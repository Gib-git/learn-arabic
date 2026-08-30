import { Router } from 'express';
import { db } from '../db.js';

// AI tutor backed by a local Ollama server. The Quran/Arabic knowledge comes
// from the model; this route just proxies chat with a tutoring system prompt.
export const tutor = Router();

const SYSTEM_PROMPT = `You are a warm, patient tutor of Quranic Arabic helping a beginner who is learning to read and understand the Quran. Rules:
- Explain simply. Define every technical term and acronym the first time you use it.
- When you write Arabic, always give transliteration and translation alongside it.
- For verse questions, go word by word: the word, its root if useful, its meaning, and its grammatical role in plain language.
- Keep answers short and focused; offer to go deeper rather than dumping everything.
- If asked about matters of religious ruling or interpretation dispute, describe the main views neutrally and suggest consulting a qualified scholar.`;

function candidates(): string[] {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'tutor'").get() as
    | { value: string }
    | undefined;
  const cfg = row ? (JSON.parse(row.value) as { url?: string }) : {};
  if (cfg.url) return [cfg.url.replace(/\/$/, '')];
  const list = ['http://localhost:11434', 'http://127.0.0.1:11434'];
  if (process.env.DATA_DIR === '/app/data') list.unshift('http://host.docker.internal:11434');
  return list;
}

function configuredModel(): string {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'tutor'").get() as
    | { value: string }
    | undefined;
  const cfg = row ? (JSON.parse(row.value) as { model?: string }) : {};
  return cfg.model ?? '';
}

async function findOllama(): Promise<{ url: string; models: string[] } | null> {
  for (const base of candidates()) {
    try {
      const res = await fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) continue;
      const data = (await res.json()) as { models?: { name: string }[] };
      return { url: base, models: (data.models ?? []).map((m) => m.name) };
    } catch {
      /* try next */
    }
  }
  return null;
}

tutor.get('/status', async (_req, res) => {
  const found = await findOllama();
  if (!found) {
    res.json({ ok: false, tried: candidates() });
    return;
  }
  res.json({ ok: true, url: found.url, models: found.models, model: configuredModel() });
});

tutor.post('/chat', async (req, res) => {
  const { messages = [], model } = req.body as {
    messages: { role: 'user' | 'assistant'; content: string }[];
    model?: string;
  };
  const found = await findOllama();
  if (!found) {
    res.status(503).json({ error: 'Ollama is not reachable. Start it with `ollama serve`.' });
    return;
  }
  const useModel = model || configuredModel() || found.models[0];
  if (!useModel) {
    res.status(503).json({ error: 'No Ollama models installed. Run e.g. `ollama pull llama3.2`.' });
    return;
  }
  try {
    const upstream = await fetch(`${found.url}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: useModel,
        stream: true,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-20)],
      }),
    });
    if (!upstream.ok || !upstream.body) {
      res.status(502).json({ error: `Ollama error: ${upstream.status} ${await upstream.text()}` });
      return;
    }
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Tutor-Model', useModel);
    const decoder = new TextDecoder();
    let buf = '';
    for await (const chunk of upstream.body as unknown as AsyncIterable<Uint8Array>) {
      buf += decoder.decode(chunk, { stream: true });
      let nl;
      while ((nl = buf.indexOf('\n')) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        try {
          const obj = JSON.parse(line) as { message?: { content?: string }; done?: boolean };
          if (obj.message?.content) res.write(obj.message.content);
        } catch {
          /* partial line */
        }
      }
    }
    res.end();
  } catch (e) {
    if (!res.headersSent) res.status(502).json({ error: (e as Error).message });
    else res.end();
  }
});
