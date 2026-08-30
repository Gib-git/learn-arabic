import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  api,
  audioSrc,
  type QuranChapter,
  type QuranVerse,
  type QuranWord,
} from '../lib/api';
import { VOCAB, normalizeArabic, type VocabWord } from '../data/vocab';
import { BUNDLED_SURAHS } from '../data/surahs';
import { AddToDeck } from '../components/AddToDeck';
import { Icon } from '../components/Icons';
import { useStore } from '../store/useStore';

const PINNED = [1, 112, 113, 114, 103, 108]; // surahs used in lessons

const vocabByNorm = new Map(VOCAB.map((w) => [normalizeArabic(w.ar), w]));

/** Deterministic 0-99 bucket per word, so hiding is stable per level. */
function wordBucket(id: number): number {
  return (id * 2654435761) % 100;
}

/** Convert the API's <tajweed class=x>…</tajweed> markup to safe span HTML. */
function tajweedHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&lt;tajweed class=(\w+)&gt;/g, '<span class="tj-$1">')
    .replace(/&lt;\/tajweed&gt;/g, '</span>')
    .replace(/&lt;span class=(\w+)&gt;/g, '<span class="tj-$1">')
    .replace(/&lt;\/span&gt;/g, '</span>');
}

const TAJWEED_LEGEND: { cls: string; label: string }[] = [
  { cls: 'tj-madda_necessary', label: 'madd — long stretch (4–6 beats)' },
  { cls: 'tj-madda_obligatory', label: 'madd — obligatory (4–5 beats)' },
  { cls: 'tj-madda_permissible', label: 'madd — permissible (2–4 beats)' },
  { cls: 'tj-madda_normal', label: 'madd — normal (2 beats)' },
  { cls: 'tj-qalaqah', label: 'qalqalah — echoing bounce' },
  { cls: 'tj-ghunnah', label: 'ghunnah — nasal hum' },
  { cls: 'tj-idgham_ghunnah', label: 'idghām with ghunnah — merge + hum' },
  { cls: 'tj-idgham_wo_ghunnah', label: 'idghām without ghunnah — merge' },
  { cls: 'tj-ikhafa', label: 'ikhfāʾ — hidden n' },
  { cls: 'tj-iqlab', label: 'iqlāb — n becomes m' },
  { cls: 'tj-ham_wasl', label: 'silent connecting alif' },
  { cls: 'tj-laam_shamsiyah', label: 'silent sun-letter lām' },
];

function WordSpan({
  word,
  known,
  vocab,
  memorize,
  memLevel,
  wbw,
}: {
  word: QuranWord;
  known: 'known' | 'learning' | 'new';
  vocab: VocabWord | undefined;
  memorize: boolean;
  memLevel: number;
  wbw: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [peeked, setPeeked] = useState(false);
  useEffect(() => setPeeked(false), [memLevel, memorize]);

  if (word.char_type_name === 'end') {
    return <span className="verse-end" lang="ar">{word.text_uthmani}</span>;
  }

  const hidden = memorize && !peeked && wordBucket(word.id) < memLevel * 25;
  if (memorize) {
    return (
      <span
        className={`qword mem-word${hidden ? ' mem-hidden' : ''}`}
        title={hidden ? 'Tap to peek' : undefined}
        onClick={() => setPeeked((p) => !p)}
      >
        {word.text_uthmani}
      </span>
    );
  }

  if (wbw) {
    return (
      <span className={`wbw-word qword-${known}`} onClick={() => setOpen(!open)}>
        <span className="wbw-ar" lang="ar" dir="rtl">{word.text_uthmani}</span>
        <span className="wbw-translit" dir="ltr">{word.transliteration?.text ?? ''}</span>
        <span className="wbw-en" dir="ltr">{word.translation?.text ?? ''}</span>
        {open && (
          <WordPopover word={word} vocab={vocab} onClose={() => setOpen(false)} />
        )}
      </span>
    );
  }

  return (
    <span className={`qword qword-${known}`} onClick={() => setOpen(!open)}>
      {word.text_uthmani}
      {open && <WordPopover word={word} vocab={vocab} onClose={() => setOpen(false)} />}
    </span>
  );
}

function WordPopover({
  word,
  vocab,
  onClose,
}: {
  word: QuranWord;
  vocab: VocabWord | undefined;
  onClose: () => void;
}) {
  const wordAudio = audioSrc(word.audio_url, 'word');
  return (
    <span className="word-pop" dir="ltr" onClick={(e) => e.stopPropagation()}>
      <strong>{word.translation?.text ?? '—'}</strong>
      {word.transliteration?.text && <span className="muted">{word.transliteration.text}</span>}
      {vocab && (
        <span className="muted small">
          dictionary: {vocab.ar} ({vocab.translit}) — {vocab.en}
          {vocab.root && <> · root {vocab.root}</>}
        </span>
      )}
      {wordAudio && (
        <button className="audio-btn" onClick={() => new Audio(wordAudio).play()}>
          <Icon name="speaker" size={15} /> hear this word
        </button>
      )}
      {vocab && <AddToDeck wordId={vocab.id} />}
      <button className="audio-btn" onClick={onClose}>close</button>
    </span>
  );
}

export function Reader() {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<QuranChapter[] | null>(null);
  const [chapter, setChapter] = useState<number>(1);
  const [verses, setVerses] = useState<QuranVerse[] | null>(null);
  const [audio, setAudio] = useState<Map<string, string>>(new Map());
  const [showTranslation, setShowTranslation] = useState(true);
  const [wbw, setWbw] = useState(() => {
    try { return localStorage.getItem('reader-wbw') === '1'; } catch { return false; }
  });
  const [fontScale, setFontScale] = useState(() => {
    try { return Number(localStorage.getItem('reader-font')) || 1; } catch { return 1; }
  });
  const [wordGap, setWordGap] = useState(() => {
    try {
      const v = localStorage.getItem('reader-gap');
      return v === null ? 1 : Number(v);
    } catch { return 1; }
  });
  const [tajweed, setTajweed] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [memorize, setMemorize] = useState(false);
  const [memLevel, setMemLevel] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const playerRef = useRef<HTMLAudioElement | null>(null);
  const cardStates = useStore((s) => s.cardStates);

  useEffect(() => {
    api.quran.chapters().then(setChapters).catch((e) => setError((e as Error).message));
  }, []);

  useEffect(() => {
    setLoading(true);
    setVerses(null);
    setError(null);
    api.quran
      .verses(chapter)
      .then(setVerses)
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
    api.quran
      .audio(chapter)
      .then((files) => {
        const m = new Map<string, string>();
        for (const f of files) {
          const u = audioSrc(f.url, 'verse');
          if (u) m.set(f.verse_key, u);
        }
        setAudio(m);
      })
      .catch(() => setAudio(new Map()));
  }, [chapter]);

  const wordStatus = useMemo(() => {
    return (w: QuranWord): 'known' | 'learning' | 'new' => {
      const v = vocabByNorm.get(normalizeArabic(w.text_uthmani ?? ''));
      if (!v) return 'new';
      const card = cardStates.get(`vocab:${v.id}:ar-en`);
      if (!card || card.reps === 0) return 'new';
      return card.interval_days >= 21 ? 'known' : 'learning';
    };
  }, [cardStates]);

  const playVerse = (key: string) => {
    const url = audio.get(key);
    if (!url) return;
    playerRef.current?.pause();
    playerRef.current = new Audio(url);
    playerRef.current.play();
  };

  const askTutor = (v: QuranVerse) => {
    const arabic = v.words?.filter((w) => w.char_type_name === 'word').map((w) => w.text_uthmani).join(' ') ?? v.text_uthmani ?? '';
    const en = v.translations?.[0]?.text.replace(/<[^>]+>/g, '') ?? '';
    sessionStorage.setItem(
      'tutor-prefill',
      `Please explain verse ${v.verse_key} word by word:\n\n${arabic}\n\n(“${en}”)\n\nBreak down the grammar simply — I'm a beginner.`
    );
    navigate('/tutor');
  };

  const bundled = BUNDLED_SURAHS.find((s) => s.chapter === chapter);
  const chapterInfo = chapters?.find((c) => c.id === chapter);

  const sortedChapters = useMemo(() => {
    if (!chapters) return null;
    const pinned = PINNED.map((id) => chapters.find((c) => c.id === id)).filter(Boolean) as QuranChapter[];
    const rest = chapters.filter((c) => !PINNED.includes(c.id));
    return [...pinned, ...rest];
  }, [chapters]);

  return (
    <div className="page">
      <h1>Quran Reader</h1>
      {!memorize && !tajweed && (
        <p className="muted">
          Real Quran text with real recitation. Tap any word for its meaning — words are tinted
          by how well you know them:{' '}
          <span className="qword qword-known demo">known</span>{' '}
          <span className="qword qword-learning demo">learning</span>{' '}
          <span className="qword qword-new demo">not yet studied</span>
        </p>
      )}

      <div className="reader-controls">
        <select value={chapter} onChange={(e) => setChapter(Number(e.target.value))}>
          {sortedChapters
            ? sortedChapters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.id}. {c.name_simple} ({c.translated_name.name}) — {c.verses_count} verses
                  {PINNED.includes(c.id) ? ' ★' : ''}
                </option>
              ))
            : BUNDLED_SURAHS.map((s) => (
                <option key={s.chapter} value={s.chapter}>
                  {s.chapter}. {s.name} ({s.meaning})
                </option>
              ))}
        </select>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showTranslation}
            onChange={(e) => setShowTranslation(e.target.checked)}
          />
          translation
        </label>
        <label className="toggle" title="Show transliteration and meaning under every word">
          <input
            type="checkbox"
            checked={wbw}
            onChange={(e) => {
              setWbw(e.target.checked);
              try { localStorage.setItem('reader-wbw', e.target.checked ? '1' : ''); } catch { /* ignore */ }
              if (e.target.checked) { setTajweed(false); setMemorize(false); }
            }}
          />
          word-by-word
        </label>
        <span className="stepper" title="Arabic text size">
          <span className="stepper-label">Text</span>
          <button
            className="stepper-btn"
            aria-label="Smaller text"
            onClick={() => {
              const s = Math.max(0.7, Math.round((fontScale - 0.15) * 100) / 100);
              setFontScale(s);
              try { localStorage.setItem('reader-font', String(s)); } catch { /* ignore */ }
            }}
          >
            −
          </button>
          <button
            className="stepper-btn"
            aria-label="Larger text"
            onClick={() => {
              const s = Math.min(2.2, Math.round((fontScale + 0.15) * 100) / 100);
              setFontScale(s);
              try { localStorage.setItem('reader-font', String(s)); } catch { /* ignore */ }
            }}
          >
            +
          </button>
        </span>
        <span className="stepper" title="Space between words">
          <span className="stepper-label">Spacing</span>
          <button
            className="stepper-btn"
            aria-label="Less space between words"
            onClick={() => {
              const g = Math.max(0, Math.round((wordGap - 0.25) * 100) / 100);
              setWordGap(g);
              try { localStorage.setItem('reader-gap', String(g)); } catch { /* ignore */ }
            }}
          >
            −
          </button>
          <button
            className="stepper-btn"
            aria-label="More space between words"
            onClick={() => {
              const g = Math.min(4, Math.round((wordGap + 0.25) * 100) / 100);
              setWordGap(g);
              try { localStorage.setItem('reader-gap', String(g)); } catch { /* ignore */ }
            }}
          >
            +
          </button>
        </span>
        <label className="toggle" title="Color-code recitation rules (tajweed)">
          <input
            type="checkbox"
            checked={tajweed}
            onChange={(e) => {
              setTajweed(e.target.checked);
              if (e.target.checked) { setMemorize(false); setWbw(false); }
            }}
          />
          tajweed colors
        </label>
        <label className="toggle" title="Hide words progressively to memorize">
          <input
            type="checkbox"
            checked={memorize}
            onChange={(e) => {
              setMemorize(e.target.checked);
              if (e.target.checked) {
                setTajweed(false);
                setWbw(false);
                setShowTranslation(false);
              }
            }}
          />
          memorize
        </label>
      </div>

      {memorize && (
        <div className="mem-bar">
          <span className="small">Hide:</span>
          {[1, 2, 3, 4].map((l) => (
            <button
              key={l}
              className={`btn small-btn${memLevel === l ? ' primary' : ''}`}
              onClick={() => setMemLevel(l)}
            >
              {l * 25}%
            </button>
          ))}
          <span className="muted small">
            Recite each verse aloud, tap a blank to peek, then raise the level. This
            “retrieval practice” is exactly how huffāẓ (memorizers) have learned for centuries.
          </span>
        </div>
      )}

      {tajweed && (
        <div className="panel tj-panel">
          <button className="audio-btn" onClick={() => setShowLegend(!showLegend)}>
            {showLegend ? '▾ hide' : '▸ show'} color legend
          </button>
          {showLegend && (
            <div className="tj-legend">
              {TAJWEED_LEGEND.map((t) => (
                <div key={t.cls} className="small">
                  <span className={`tj-swatch ${t.cls}`}>◉</span> {t.label}
                </div>
              ))}
              <div className="muted small">
                These rules are taught in Unit 10. Word tap-for-meaning is off in this mode.
              </div>
            </div>
          )}
        </div>
      )}

      {chapterInfo && (
        <p className="muted small">
          Surah {chapterInfo.name_simple} · {chapterInfo.verses_count} verses · revealed in{' '}
          {chapterInfo.revelation_place === 'makkah' ? 'Mecca' : 'Medina'}
        </p>
      )}

      {loading && <p className="muted">Loading surah…</p>}

      {verses && (
        <div
          className="verses"
          style={{ ['--fs' as string]: fontScale, ['--wgap' as string]: wordGap }}
        >
          {verses.map((v) => (
            <div className="verse" key={v.verse_key}>
              {tajweed && v.text_uthmani_tajweed ? (
                <div
                  className="verse-ar"
                  lang="ar"
                  dir="rtl"
                  dangerouslySetInnerHTML={{ __html: tajweedHtml(v.text_uthmani_tajweed) }}
                />
              ) : (
                <div className={wbw && !memorize ? 'verse-wbw' : 'verse-ar'} lang="ar" dir="rtl">
                  {v.words?.map((w) => (
                    <WordSpan
                      key={w.id}
                      word={w}
                      known={wordStatus(w)}
                      vocab={vocabByNorm.get(normalizeArabic(w.text_uthmani ?? ''))}
                      memorize={memorize}
                      memLevel={memLevel}
                      wbw={wbw && !memorize}
                    />
                  ))}
                </div>
              )}
              <div className="verse-meta">
                <span className="verse-key">{v.verse_key}</span>
                {audio.has(v.verse_key) && (
                  <button className="audio-btn" onClick={() => playVerse(v.verse_key)}>
                    <Icon name="play" size={14} /> recite
                  </button>
                )}
                {!memorize && (
                  <button className="audio-btn" onClick={() => askTutor(v)} title="Ask the AI tutor about this verse">
                    <Icon name="tutor" size={15} /> ask tutor
                  </button>
                )}
              </div>
              {showTranslation && v.translations?.[0] && (
                <div
                  className="verse-en muted"
                  dangerouslySetInnerHTML={{
                    __html: v.translations[0].text.replace(/<sup[^>]*>.*?<\/sup>/g, ''),
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {!verses && !loading && error && bundled && (
        <>
          <p className="muted small">
            The Quran API isn't reachable right now — showing the built-in copy of this surah.
          </p>
          <div className="verses">
            {bundled.verses.map((v) => (
              <div className="verse" key={v.n}>
                <div className="verse-ar" lang="ar" dir="rtl">{v.ar}</div>
                <div className="verse-meta"><span className="verse-key">{bundled.chapter}:{v.n}</span></div>
                <div className="muted small">{v.translit}</div>
                {showTranslation && <div className="verse-en muted">{v.en}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      {!verses && !loading && error && !bundled && (
        <p className="error">Couldn't load this surah: {error}</p>
      )}
    </div>
  );
}
