// Text-to-speech for Arabic. Resolution order:
//   1. Custom OpenAI-compatible endpoint (e.g. Kokoro-FastAPI) if configured
//   2. Browser speechSynthesis with the best available Arabic voice
import type { Settings } from './api';

let ttsSettings: Settings['tts'] | null = null;
const endpointCache = new Map<string, string>(); // text -> object URL

export function configureTts(s: Settings['tts']) {
  ttsSettings = s;
}

export function arabicVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('ar'));
}

function pickBrowserVoice(): SpeechSynthesisVoice | null {
  const voices = arabicVoices();
  if (voices.length === 0) return null;
  if (ttsSettings?.browserVoice) {
    const chosen = voices.find((v) => v.name === ttsSettings!.browserVoice);
    if (chosen) return chosen;
  }
  return voices[0];
}

async function speakViaEndpoint(text: string): Promise<boolean> {
  const cfg = ttsSettings;
  if (!cfg?.endpointUrl) return false;
  try {
    let url = endpointCache.get(text);
    if (!url) {
      const res = await fetch(`${cfg.endpointUrl.replace(/\/$/, '')}/v1/audio/speech`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: cfg.endpointModel || 'kokoro',
          voice: cfg.endpointVoice || undefined,
          input: text,
        }),
      });
      if (!res.ok) return false;
      const blob = await res.blob();
      url = URL.createObjectURL(blob);
      endpointCache.set(text, url);
    }
    await new Audio(url).play();
    return true;
  } catch {
    return false;
  }
}

/** Speak Arabic text. Returns false when no audio path is available. */
export async function speak(text: string): Promise<boolean> {
  if (ttsSettings?.mode === 'endpoint') {
    if (await speakViaEndpoint(text)) return true;
  }
  if (!('speechSynthesis' in window)) return false;
  const voice = pickBrowserVoice();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ar-SA';
  if (voice) u.voice = voice;
  u.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
  return true;
}
