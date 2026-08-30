import { Link } from 'react-router-dom';
import { CURRICULUM, allLessons } from '../data/curriculum';
import { useStore } from '../store/useStore';
import { Icon } from '../components/Icons';

export function Learn() {
  const completed = useStore((s) => s.completedLessons);
  // A lesson is unlocked if every lesson before it (in global order) is complete
  const firstIncomplete = allLessons.findIndex((l) => !completed.has(l.id));

  return (
    <div className="page">
      <h1>Learn</h1>
      <p className="muted">
        Work through the units in order — each lesson unlocks the next and adds new flashcards to
        your review deck.
      </p>
      {CURRICULUM.map((unit) => (
        <section className="panel" key={unit.id}>
          <h2>{unit.title}</h2>
          <p className="muted small">{unit.tagline}</p>
          <div className="lesson-list">
            {unit.lessons.map((lesson) => {
              const idx = allLessons.findIndex((l) => l.id === lesson.id);
              const done = completed.has(lesson.id);
              const unlocked = firstIncomplete === -1 || idx <= firstIncomplete;
              return (
                <div className={`lesson-row${done ? ' done' : ''}${unlocked ? '' : ' locked'}`} key={lesson.id}>
                  <span className={`lesson-status${done ? ' is-done' : unlocked ? ' is-next' : ''}`}>
                    <Icon name={done ? 'check' : unlocked ? 'play' : 'lock'} size={15} />
                  </span>
                  <div className="lesson-meta">
                    <div className="lesson-title">{lesson.title}</div>
                    <div className="muted small">{lesson.subtitle}</div>
                  </div>
                  {unlocked ? (
                    <Link className="btn small-btn" to={`/learn/${lesson.id}`}>
                      {done ? 'Revisit' : 'Start'}
                    </Link>
                  ) : (
                    <span className="muted small">locked</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
