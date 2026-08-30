import { useMemo, useState } from 'react';
import { buildRootGroups } from '../data/roots';
import { AudioButton } from '../components/AudioButton';
import { AddToDeck } from '../components/AddToDeck';
import { useStore } from '../store/useStore';

export function Roots() {
  const [query, setQuery] = useState('');
  const [openRoot, setOpenRoot] = useState<string | null>(null);
  const cardStates = useStore((s) => s.cardStates);
  const groups = useMemo(() => buildRootGroups(), []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? groups.filter(
        (g) =>
          g.root.replace(/ /g, '').includes(q.replace(/ /g, '')) ||
          g.meaning?.toLowerCase().includes(q) ||
          g.words.some(
            (w) =>
              w.en.toLowerCase().includes(q) ||
              w.translit.toLowerCase().includes(q) ||
              w.ar.includes(query.trim())
          )
      )
    : groups;

  return (
    <div className="page">
      <h1>Root Explorer</h1>
      <p className="muted">
        Almost every Arabic word grows from a root of (usually) three consonants carrying a core
        meaning. Tap a root to see its whole word family — recognizing roots is the single
        biggest shortcut to Quranic vocabulary. Roots are sorted by how often their family
        appears in the Quran.
      </p>
      <input
        type="text"
        className="root-search"
        placeholder="Search roots, meanings, or words… (e.g. “mercy”, “kitab”, or كتب)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="root-list">
        {filtered.map((g) => {
          const open = openRoot === g.root;
          const knownCount = g.words.filter((w) => cardStates.has(`vocab:${w.id}:ar-en`)).length;
          return (
            <div className="root-item" key={g.root}>
              <button className="root-head" onClick={() => setOpenRoot(open ? null : g.root)}>
                <span className="root-letters" lang="ar" dir="rtl">{g.root}</span>
                <span className="root-info">
                  <span className="root-meaning">{g.meaning ?? 'word family'}</span>
                  <span className="muted small">
                    {g.words.length} word{g.words.length === 1 ? '' : 's'} · ~{g.totalFreq}× in
                    the Quran{knownCount > 0 && ` · ${knownCount} in your deck`}
                  </span>
                </span>
                <span className="root-chevron">{open ? '▾' : '▸'}</span>
              </button>
              {open && (
                <div className="root-words">
                  {g.words.map((w) => (
                    <div className="root-word-row" key={w.id}>
                      <div className="example-cell">
                        <span className="ar-word" lang="ar" dir="rtl">{w.ar}</span>
                        <AudioButton text={w.ar} label={w.translit} />
                      </div>
                      <div className="root-word-meta">
                        <div><em>{w.translit}</em> — {w.en}</div>
                        <div className="muted small">{w.pos} · ~{w.freq}×</div>
                      </div>
                      <AddToDeck wordId={w.id} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="muted">No roots match “{query}”.</p>}
      </div>
    </div>
  );
}
