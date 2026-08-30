import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type CardRow } from '../lib/api';
import { letterById } from '../data/letters';
import { wordById } from '../data/vocab';
import { AudioButton } from '../components/AudioButton';
import { useStore } from '../store/useStore';

interface CardFaces {
  frontAr?: string;
  frontEn?: string;
  backLines: string[];
  backAr?: string;
  audioText?: string;
}

function facesFor(cardId: string): CardFaces | null {
  const parts = cardId.split(':');
  if (parts[0] === 'letter') {
    const l = letterById.get(parts[1]);
    if (!l) return null;
    return {
      frontAr: l.forms.isolated,
      backLines: [
        `${l.name} — “${l.translit}”`,
        l.sound,
        `Forms: ${l.forms.isolated} ${l.forms.initial} ${l.forms.medial} ${l.forms.final}`,
        `Example: ${l.example.ar} (${l.example.translit}) — ${l.example.en}`,
      ],
      audioText: l.forms.isolated,
    };
  }
  const w = wordById.get(parts[1]);
  if (!w) return null;
  if (parts[2] === 'ar-en') {
    return {
      frontAr: w.ar,
      backLines: [
        `${w.translit} — ${w.en}`,
        w.root ? `Root: ${w.root}` : '',
        `Appears ~${w.freq}× in the Quran`,
        w.example ? `${w.example.ar} — “${w.example.en}” (${w.example.ref})` : '',
      ].filter(Boolean),
      audioText: w.ar,
    };
  }
  return {
    frontEn: `${w.en}`,
    backLines: [`${w.translit}`, `Appears ~${w.freq}× in the Quran`],
    backAr: w.ar,
    audioText: w.ar,
  };
}

const GRADES: { label: string; key: string; grade: 0 | 1 | 2 | 3; hint: string }[] = [
  { label: 'Again', key: '1', grade: 0, hint: 'forgot' },
  { label: 'Hard', key: '2', grade: 1, hint: 'struggled' },
  { label: 'Good', key: '3', grade: 2, hint: 'recalled' },
  { label: 'Easy', key: '4', grade: 3, hint: 'instant' },
];

export function Review() {
  const [queue, setQueue] = useState<CardRow[] | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const shownAt = useRef(Date.now());
  const refreshCounts = useStore((s) => s.refreshCounts);

  useEffect(() => {
    api.dueCards().then(({ due, fresh }) => setQueue([...due, ...fresh])).catch(() => setQueue([]));
  }, []);

  const current = queue?.[0] ?? null;
  const faces = current ? facesFor(current.card_id) : null;

  const grade = useCallback(
    async (g: 0 | 1 | 2 | 3) => {
      if (!current || !queue) return;
      const elapsed = Date.now() - shownAt.current;
      const rest = queue.slice(1);
      const { card } = await api.review(current.card_id, g, elapsed);
      // If the card comes back due within 15 minutes (learning step), requeue it
      if (new Date(card.due_at).getTime() - Date.now() < 15 * 60_000) {
        rest.push(card);
      }
      setQueue(rest);
      setFlipped(false);
      setDoneCount((c) => c + 1);
      shownAt.current = Date.now();
      if (rest.length === 0) refreshCounts();
    },
    [current, queue, refreshCounts]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (flipped) {
        const g = GRADES.find((x) => x.key === e.key);
        if (g) grade(g.grade);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flipped, grade]);

  if (queue === null) return <div className="page"><p className="muted">Loading deck…</p></div>;

  if (!current || !faces) {
    return (
      <div className="page center-page">
        <h1>All caught up! ✨</h1>
        <p className="muted">
          {doneCount > 0
            ? `You reviewed ${doneCount} card${doneCount === 1 ? '' : 's'} this session. `
            : ''}
          No cards are due right now — the schedule will bring them back at the right moment.
        </p>
        <p>
          <Link className="btn primary" to="/learn">Learn something new</Link>{' '}
          <Link className="btn" to="/practice">Take a practice quiz</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="page center-page">
      <div className="muted small">{queue.length} card{queue.length === 1 ? '' : 's'} left · {doneCount} done</div>
      <div
        className={`flashcard${flipped ? ' flipped' : ''}`}
        onClick={() => setFlipped((f) => !f)}
        title="Tap to flip (or press Space)"
      >
        {!flipped ? (
          <div className="card-face">
            {faces.frontAr && <div className="ar-huge" lang="ar" dir="rtl">{faces.frontAr}</div>}
            {faces.frontEn && <div className="card-front-en">{faces.frontEn}</div>}
            <div className="muted small">tap to reveal</div>
          </div>
        ) : (
          <div className="card-face">
            {faces.frontAr && <div className="ar-big" lang="ar" dir="rtl">{faces.frontAr}</div>}
            {faces.backAr && <div className="ar-huge" lang="ar" dir="rtl">{faces.backAr}</div>}
            {faces.backLines.map((l, i) => (
              <div key={i} className={i === 0 ? 'card-back-main' : 'muted small'}>{l}</div>
            ))}
            {faces.audioText && <AudioButton text={faces.audioText} />}
          </div>
        )}
      </div>
      {flipped ? (
        <div className="grade-row">
          {GRADES.map((g) => (
            <button key={g.grade} className={`btn grade-btn grade-${g.grade}`} onClick={() => grade(g.grade)}>
              {g.label}
              <span className="muted small">{g.hint}</span>
            </button>
          ))}
        </div>
      ) : (
        <button className="btn primary big" onClick={() => setFlipped(true)}>
          Show answer
        </button>
      )}
      <p className="muted small">
        Space = flip · 1–4 = grade. Be honest with yourself — the schedule only works if the
        grades are true.
      </p>
    </div>
  );
}
