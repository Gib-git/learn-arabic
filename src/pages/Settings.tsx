import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { api, type Settings as SettingsType } from '../lib/api';
import { arabicVoices, speak } from '../lib/tts';

export function SettingsPage() {
  const { settings, saveSettings, hydrate } = useStore();
  const [local, setLocal] = useState<SettingsType | null>(settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => setLocal(settings), [settings]);
  useEffect(() => {
    const load = () => setVoices(arabicVoices());
    load();
    window.speechSynthesis?.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis?.removeEventListener('voiceschanged', load);
  }, []);

  if (!local) return <div className="page"><p className="muted">Loading…</p></div>;

  const save = async () => {
    setBusy(true);
    try {
      await saveSettings(local);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setBusy(false);
    }
  };

  const exportBackup = () => {
    window.location.href = '/api/export';
  };

  const importBackup = async (file: File) => {
    const data = JSON.parse(await file.text());
    await api.importBackup(data);
    await hydrate();
    alert('Backup imported.');
  };

  return (
    <div className="page">
      <h1>Settings</h1>

      <section className="panel">
        <h2>Daily targets</h2>
        <label className="field">
          Daily goal (minutes)
          <input
            type="number" min={5} max={240}
            value={local.dailyGoalMinutes}
            onChange={(e) => setLocal({ ...local, dailyGoalMinutes: Number(e.target.value) })}
          />
        </label>
        <label className="field">
          New flashcards per day
          <input
            type="number" min={1} max={100}
            value={local.newCardsPerDay}
            onChange={(e) => setLocal({ ...local, newCardsPerDay: Number(e.target.value) })}
          />
        </label>
        <p className="muted small">
          15–20 new cards a day is sustainable for most people; going higher piles up future
          reviews fast.
        </p>
      </section>

      <section className="panel">
        <h2>Audio (TTS — text-to-speech)</h2>
        <label className="field">
          Mode
          <select
            value={local.tts.mode}
            onChange={(e) => setLocal({ ...local, tts: { ...local.tts, mode: e.target.value as 'browser' | 'endpoint' } })}
          >
            <option value="browser">Browser voice (built-in)</option>
            <option value="endpoint">Local TTS server (OpenAI-compatible)</option>
          </select>
        </label>

        {local.tts.mode === 'browser' && (
          <label className="field">
            Arabic voice
            <select
              value={local.tts.browserVoice}
              onChange={(e) => setLocal({ ...local, tts: { ...local.tts, browserVoice: e.target.value } })}
            >
              <option value="">Automatic</option>
              {voices.map((v) => (
                <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>
              ))}
            </select>
            {voices.length === 0 && (
              <span className="muted small">
                No Arabic voices found. On macOS: System Settings → Accessibility → Spoken
                Content → System Voice → Manage Voices → add an Arabic voice (e.g. “Majed”).
              </span>
            )}
          </label>
        )}

        {local.tts.mode === 'endpoint' && (
          <>
            <label className="field">
              Server URL
              <input
                type="text" placeholder="http://localhost:8880"
                value={local.tts.endpointUrl}
                onChange={(e) => setLocal({ ...local, tts: { ...local.tts, endpointUrl: e.target.value } })}
              />
            </label>
            <label className="field">
              Model
              <input
                type="text"
                value={local.tts.endpointModel}
                onChange={(e) => setLocal({ ...local, tts: { ...local.tts, endpointModel: e.target.value } })}
              />
            </label>
            <label className="field">
              Voice
              <input
                type="text" placeholder="(server default)"
                value={local.tts.endpointVoice}
                onChange={(e) => setLocal({ ...local, tts: { ...local.tts, endpointVoice: e.target.value } })}
              />
            </label>
            <p className="muted small">
              Works with any server exposing the OpenAI <code>/v1/audio/speech</code> route, such
              as Kokoro-FastAPI. Note: Kokoro's Arabic support is limited — the browser voice or
              the Reader's real recitations are usually better for Arabic. (Ollama serves
              language models only, not speech.) If the server fails, the app falls back to the
              browser voice automatically.
            </p>
          </>
        )}
        <button className="btn" onClick={() => speak('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ')}>
          Test voice
        </button>
      </section>

      <section className="panel">
        <h2>AI tutor (Ollama)</h2>
        <p className="muted small">
          The Tutor page uses Ollama, a free tool that runs AI models locally on your machine.
          Leave the URL empty to auto-detect it at localhost:11434.
        </p>
        <label className="field">
          Ollama URL (optional)
          <input
            type="text" placeholder="http://localhost:11434"
            value={local.tutor?.url ?? ''}
            onChange={(e) => setLocal({ ...local, tutor: { ...local.tutor, url: e.target.value } })}
          />
        </label>
        <label className="field">
          Preferred model (optional)
          <input
            type="text" placeholder="auto (first installed model)"
            value={local.tutor?.model ?? ''}
            onChange={(e) => setLocal({ ...local, tutor: { ...local.tutor, model: e.target.value } })}
          />
        </label>
      </section>

      <section className="panel">
        <h2>Backup</h2>
        <p className="muted small">
          Your progress lives in the app's database. Export a JSON backup any time; import
          restores it (replacing current progress).
        </p>
        <button className="btn" onClick={exportBackup}>Export progress</button>{' '}
        <label className="btn">
          Import backup
          <input
            type="file" accept="application/json" hidden
            onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])}
          />
        </label>
      </section>

      <section className="panel danger-zone">
        <h2>Danger zone</h2>
        <button
          className="btn danger"
          onClick={async () => {
            if (confirm('Really erase ALL progress? This cannot be undone (export a backup first!).')) {
              await api.reset();
              await hydrate();
            }
          }}
        >
          Reset all progress
        </button>
      </section>

      <div className="save-bar">
        <button className="btn primary big" disabled={busy} onClick={save}>
          {saved ? '✓ Saved' : 'Save settings'}
        </button>
      </div>
    </div>
  );
}
