import { useState } from 'react';
import { Link } from 'react-router-dom';
import { practiceQuiz } from '../lib/quizGen';
import { QuizQuestion } from '../components/QuizQuestion';
import { api } from '../lib/api';
import { useStore } from '../store/useStore';
import type { ExerciseSeed } from '../data/types';

export function Practice() {
  const completed = useStore((s) => s.completedLessons);
  const [quiz, setQuiz] = useState<ExerciseSeed[] | null>(null);
  const [qIndex, setQIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [finished, setFinished] = useState(false);

  const start = () => {
    const q = practiceQuiz(completed, 10);
    setQuiz(q);
    setQIndex(0);
    setCorrect(0);
    setAnswered(false);
    setFinished(false);
  };

  if (completed.size === 0) {
    return (
      <div className="page center-page">
        <h1>Practice</h1>
        <p className="muted">
          Practice quizzes mix questions from everything you've learned. Complete your first
          lesson to unlock them.
        </p>
        <Link className="btn primary" to="/learn">Go to lessons</Link>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="page center-page">
        <h1>Practice quiz</h1>
        <p className="muted">
          Ten questions drawn from every lesson you've completed, deliberately shuffled across
          topics — mixing subjects (“interleaving”) is proven to build stronger, more flexible
          recall than drilling one topic at a time.
        </p>
        <button className="btn primary big" onClick={start}>Start a 10-question quiz</button>
      </div>
    );
  }

  if (finished) {
    const pct = Math.round((correct / quiz.length) * 100);
    return (
      <div className="page center-page">
        <h1>{pct >= 80 ? 'Excellent! 🌟' : pct >= 50 ? 'Good work! 💪' : 'Keep at it! 🌱'}</h1>
        <p>
          You scored <strong>{correct}/{quiz.length}</strong>.
          {pct < 80 && ' Wrong answers are learning working as intended — the effort of retrieval is what builds the memory.'}
        </p>
        <button className="btn primary" onClick={start}>Another quiz</button>{' '}
        <Link className="btn" to="/review">Review flashcards</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Practice quiz</h1>
      <div className="panel">
        <div className="muted small">Question {qIndex + 1} of {quiz.length} · {correct} correct</div>
        <QuizQuestion
          key={qIndex}
          q={quiz[qIndex]}
          onAnswered={(ok) => {
            if (ok) setCorrect((c) => c + 1);
            setAnswered(true);
          }}
        />
        {answered && (
          <button
            className="btn primary"
            onClick={() => {
              if (qIndex + 1 < quiz.length) {
                setQIndex(qIndex + 1);
                setAnswered(false);
              } else {
                const finalCorrect = correct;
                api.quizResult('practice', finalCorrect, quiz.length).catch(() => {});
                setFinished(true);
              }
            }}
          >
            {qIndex + 1 < quiz.length ? 'Next question' : 'See results'}
          </button>
        )}
      </div>
    </div>
  );
}
