import { Link } from 'react-router-dom';
import { GLOSSARY } from '../data/glossary';
import { lessonById } from '../data/curriculum';

export function Glossary() {
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));
  return (
    <div className="page">
      <h1>Glossary</h1>
      <p className="muted">
        Every technical term and acronym used in the lessons, in one place. Terms are also
        tappable wherever they appear (dotted underline).
      </p>
      <div className="glossary-list">
        {sorted.map((g) => {
          const lesson = g.lessonId ? lessonById.get(g.lessonId) : undefined;
          return (
            <div className="glossary-item" key={g.slug} id={g.slug}>
              <div className="glossary-term">{g.term}</div>
              <div className="glossary-def">{g.definition}</div>
              {lesson && (
                <div className="muted small">
                  Introduced in <Link to={`/learn/${lesson.id}`}>{lesson.title}</Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
