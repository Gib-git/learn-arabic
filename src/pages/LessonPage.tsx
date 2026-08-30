import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { allLessons, lessonById } from '../data/curriculum';
import { cardsForLesson } from '../data/types';
import { lessonExercises } from '../lib/quizGen';
import { LessonSection } from '../components/LessonSections';
import { QuizQuestion } from '../components/QuizQuestion';
import { useStore } from '../store/useStore';

export function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const completeLesson = useStore((s) => s.completeLesson);
  const alreadyDone = useStore((s) => s.completedLessons.has(lessonId ?? ''));

  const lesson = lessonId ? lessonById.get(lessonId) : undefined;
  const [phase, setPhase] = useState<'read' | 'quiz' | 'done'>('read');
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [saving, setSaving] = useState(false);

  const exercises = useMemo(() => (lesson ? lessonExercises(lesson) : []), [lesson]);

  if (!lesson) {
    return (
      <div className="page">
        <p>Lesson not found.</p>
        <Link to="/learn">Back to Learn</Link>
      </div>
    );
  }

  const idx = allLessons.findIndex((l) => l.id === lesson.id);
  const next = allLessons[idx + 1];
  const cards = cardsForLesson(lesson);

  const finish = async (score: number) => {
    setSaving(true);
    try {
      await completeLesson(lesson.id, cards, score);
      setPhase('done');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page lesson-page">
      <div className="crumbs">
        <Link to="/learn">← Learn</Link>
      </div>
      <h1>{lesson.title}</h1>
      <p className="muted">{lesson.subtitle}</p>

      {phase === 'read' && (
        <>
          {lesson.sections.map((s, i) => (
            <LessonSection key={i} section={s} />
          ))}
          <div className="lesson-actions">
            {exercises.length > 0 ? (
              <button className="btn primary big" onClick={() => setPhase('quiz')}>
                Check yourself ({exercises.length} questions)
              </button>
            ) : (
              <button className="btn primary big" disabled={saving} onClick={() => finish(1)}>
                Mark complete
              </button>
            )}
          </div>
        </>
      )}

      {phase === 'quiz' && (
        <div className="panel">
          <div className="muted small">
            Question {qIndex + 1} of {exercises.length}
          </div>
          <QuizQuestion
            key={qIndex}
            q={exercises[qIndex]}
            onAnswered={(ok) => {
              if (ok) setCorrect((c) => c + 1);
              setAnswered(true);
            }}
          />
          {answered && (
            <button
              className="btn primary"
              disabled={saving}
              onClick={() => {
                if (qIndex + 1 < exercises.length) {
                  setQIndex(qIndex + 1);
                  setAnswered(false);
                } else {
                  finish(correct / exercises.length);
                }
              }}
            >
              {qIndex + 1 < exercises.length ? 'Next question' : 'Finish lesson'}
            </button>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="panel done-panel">
          <h2>Lesson complete! 🎉</h2>
          <p>
            You scored {correct}/{exercises.length || '—'}.{' '}
            {cards.length > 0 && (
              <>
                <strong>{cards.length} flashcards</strong> {alreadyDone ? 'are in' : 'were added to'} your
                review deck — they'll surface on their own schedule.
              </>
            )}
          </p>
          <div className="lesson-actions">
            <button className="btn" onClick={() => navigate('/review')}>
              Review cards now
            </button>
            {next && (
              <button className="btn primary" onClick={() => { navigate(`/learn/${next.id}`); setPhase('read'); setQIndex(0); setCorrect(0); setAnswered(false); window.scrollTo(0, 0); }}>
                Next lesson: {next.title}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
