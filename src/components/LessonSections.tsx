import type { Section } from '../data/types';
import { letterById } from '../data/letters';
import { wordById } from '../data/vocab';
import { RichText } from './RichText';
import { AudioButton } from './AudioButton';

function LetterTable({ letterIds }: { letterIds: string[] }) {
  return (
    <div className="table-scroll">
      <table className="letter-table">
        <thead>
          <tr>
            <th>Letter</th>
            <th>Sound</th>
            <th>Alone</th>
            <th>Start</th>
            <th>Middle</th>
            <th>End</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          {letterIds.map((id) => {
            const l = letterById.get(id)!;
            return (
              <tr key={id}>
                <td>
                  <div className="letter-name">
                    <strong>{l.name}</strong>
                    <AudioButton text={l.forms.isolated} label={l.name} />
                  </div>
                  <div className="muted small">{l.translit}</div>
                </td>
                <td className="small sound-cell">{l.sound}</td>
                <td className="ar-glyph" lang="ar">{l.forms.isolated}</td>
                <td className="ar-glyph" lang="ar">{l.forms.initial}</td>
                <td className="ar-glyph" lang="ar">{l.forms.medial}</td>
                <td className="ar-glyph" lang="ar">{l.forms.final}</td>
                <td>
                  <div className="example-cell">
                    <span className="ar-word" lang="ar" dir="rtl">{l.example.ar}</span>
                    <AudioButton text={l.example.ar} label={l.example.translit} />
                  </div>
                  <div className="muted small">
                    {l.example.translit} — {l.example.en}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VocabTable({ wordIds }: { wordIds: string[] }) {
  return (
    <div className="table-scroll">
      <table className="vocab-table">
        <thead>
          <tr>
            <th>Word</th>
            <th>Say it</th>
            <th>Meaning</th>
            <th>Root</th>
            <th title="Approximate occurrences in the Quran">In Quran</th>
          </tr>
        </thead>
        <tbody>
          {wordIds.map((id) => {
            const w = wordById.get(id)!;
            return (
              <tr key={id}>
                <td>
                  <div className="example-cell">
                    <span className="ar-word" lang="ar" dir="rtl">{w.ar}</span>
                    <AudioButton text={w.ar} label={w.translit} />
                  </div>
                </td>
                <td className="small">{w.translit}</td>
                <td>{w.en}</td>
                <td className="ar-inline small" lang="ar" dir="rtl">{w.root ?? '—'}</td>
                <td className="small muted">×{w.freq}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function LessonSection({ section }: { section: Section }) {
  switch (section.type) {
    case 'text':
      return (
        <div className="section-text">
          <RichText body={section.body} />
        </div>
      );
    case 'history':
      return (
        <aside className="history-box">
          <div className="history-label">{section.title ?? 'A bit of history'}</div>
          <RichText body={section.body} />
        </aside>
      );
    case 'letters':
      return <LetterTable letterIds={section.letterIds} />;
    case 'vocab':
      return <VocabTable wordIds={section.wordIds} />;
    case 'examples':
      return (
        <div className="examples-box">
          {section.title && <div className="examples-title">{section.title}</div>}
          {section.items.map((item, i) => (
            <div className="example-row" key={i}>
              <div className="example-cell">
                <span className="ar-word" lang="ar" dir="rtl">{item.ar}</span>
                <AudioButton text={item.ar} />
              </div>
              <div className="small">
                {item.translit && <span className="muted">{item.translit} — </span>}
                {item.en}
                {item.note && <span className="muted"> ({item.note})</span>}
              </div>
            </div>
          ))}
        </div>
      );
  }
}
