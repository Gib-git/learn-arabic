import { useEffect, useRef, useState } from 'react';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

interface TutorStatus {
  ok: boolean;
  url?: string;
  models?: string[];
  model?: string;
  tried?: string[];
}

const SUGGESTIONS = [
  'Why does Arabic have no word for “is”?',
  'Explain the root system with an example I haven’t seen',
  'What is the difference between raḥmān and raḥīm?',
  'Quiz me on the vocabulary of Al-Fatiha',
];

export function Tutor() {
  const [status, setStatus] = useState<TutorStatus | null>(null);
  const [model, setModel] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/tutor/status')
      .then((r) => r.json())
      .then((s: TutorStatus) => {
        setStatus(s);
        if (s.model) setModel(s.model);
        else if (s.models?.[0]) setModel(s.models[0]);
      })
      .catch(() => setStatus({ ok: false }));
    const prefill = sessionStorage.getItem('tutor-prefill');
    if (prefill) {
      setInput(prefill);
      sessionStorage.removeItem('tutor-prefill');
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    setError(null);
    setInput('');
    const history: Msg[] = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);
    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, model: model || undefined }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || `Tutor request failed (${res.status})`);
      }
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const current = acc;
        setMessages([...history, { role: 'assistant', content: current }]);
      }
      if (!acc) throw new Error('The model returned an empty response.');
    } catch (e) {
      setMessages(history);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (status && !status.ok) {
    return (
      <div className="page">
        <h1>AI Tutor</h1>
        <div className="panel">
          <h2>Ollama isn't running yet</h2>
          <p className="muted">
            The tutor runs on <strong>Ollama</strong> — a free tool that runs AI language models
            entirely on your own machine (nothing leaves your computer). To set it up:
          </p>
          <ul className="muted">
            <li>Install it from <strong>ollama.com</strong> (or <code>brew install ollama</code>)</li>
            <li>Start it: <code>ollama serve</code> (the desktop app starts it automatically)</li>
            <li>Download a model: <code>ollama pull llama3.2</code> (~2 GB, a good starting point)</li>
            <li>Reload this page</li>
          </ul>
          <p className="muted small">
            Checked: {status.tried?.join(', ')}. You can set a custom URL in Settings if Ollama
            runs elsewhere.
          </p>
          <button className="btn primary" onClick={() => window.location.reload()}>
            Check again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page tutor-page">
      <h1>AI Tutor</h1>
      <p className="muted small">
        A private AI tutor running locally via Ollama
        {status?.url && <> ({status.url.replace('http://', '')})</>}. It can explain verses,
        grammar, and vocabulary — and like any AI, it can make mistakes: verify important
        religious questions with a qualified scholar.
      </p>
      {status?.models && status.models.length > 1 && (
        <label className="toggle small">
          model:{' '}
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            {status.models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </label>
      )}

      <div className="chat">
        {messages.length === 0 && (
          <div className="chat-empty">
            <p className="muted">Ask anything — or try one of these:</p>
            {SUGGESTIONS.map((s) => (
              <button key={s} className="btn small-btn suggestion" onClick={() => send(s)}>
                {s}
              </button>
            ))}
            <p className="muted small">
              Tip: in the Reader, tap <strong>🎓 ask tutor</strong> on any verse to bring it here.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <div className="chat-bubble">
              {m.content || <span className="muted">thinking…</span>}
            </div>
          </div>
        ))}
        {error && <p className="error small">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <textarea
          value={input}
          rows={Math.min(6, Math.max(1, input.split('\n').length))}
          placeholder="Ask about a verse, a word, or a grammar point…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />
        <button className="btn primary" disabled={busy || !input.trim()} onClick={() => send()}>
          {busy ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}
