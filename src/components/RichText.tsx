import { Fragment, useState, type ReactNode } from 'react';
import { glossaryBySlug } from '../data/glossary';

// Renders lesson-body markup:
//   **bold**  ·  {{term:slug}} / {{term:slug|Display}}  ·  {{ar:نص}}  ·  "- " lists

function Term({ slug, display }: { slug: string; display?: string }) {
  const [open, setOpen] = useState(false);
  const entry = glossaryBySlug.get(slug);
  if (!entry) return <>{display ?? slug}</>;
  return (
    <span className="term-wrap">
      <button className="term" onClick={() => setOpen(!open)}>
        {display ?? entry.term}
      </button>
      {open && (
        <span className="term-pop" onClick={() => setOpen(false)}>
          <strong>{entry.term}</strong>
          <span>{entry.definition}</span>
        </span>
      )}
    </span>
  );
}

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  // Split on {{...}} tokens and **bold** spans
  const re = /\{\{(term|ar):([^}|]+)(?:\|([^}]+))?\}\}|\*\*([^*]+)\*\*|\*([^*\n]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={`${keyBase}-t${i++}`}>{text.slice(last, m.index)}</Fragment>);
    if (m[4] !== undefined) {
      out.push(<strong key={`${keyBase}-b${i++}`}>{renderInline(m[4], `${keyBase}-b${i}`)}</strong>);
    } else if (m[5] !== undefined) {
      out.push(<em key={`${keyBase}-i${i++}`}>{renderInline(m[5], `${keyBase}-i${i}`)}</em>);
    } else if (m[1] === 'term') {
      out.push(<Term key={`${keyBase}-g${i++}`} slug={m[2]} display={m[3]} />);
    } else {
      out.push(
        <span key={`${keyBase}-a${i++}`} className="ar-inline" lang="ar" dir="rtl">
          {m[2]}
        </span>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={`${keyBase}-t${i++}`}>{text.slice(last)}</Fragment>);
  return out;
}

export function RichText({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split('\n');
        const isList = lines.every((l) => l.trim().startsWith('- '));
        if (isList) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.trim().slice(2), `${bi}-${li}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={bi}>{renderInline(block, `${bi}`)}</p>;
      })}
    </>
  );
}
