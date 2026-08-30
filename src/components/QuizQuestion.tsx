import { useState } from 'react';
import type { ExerciseSeed } from '../data/types';
import { AudioButton } from './AudioButton';

export function QuizQuestion({
  q,
  onAnswered,
}: {
  q: ExerciseSeed;
  onAnswered: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);
  const done = picked !== null;
  const isArabicChoice = (c: string) => /[؀-ۿ]/.test(c);
  return (
    <div className="quiz-q">
      <div className="quiz-prompt">
        {q.prompt}
        {q.promptAr && (
          <div className="quiz-ar">
            <span className="ar-big" lang="ar" dir="rtl">{q.promptAr}</span>
            <AudioButton text={q.promptAr} />
          </div>
        )}
      </div>
      <div className="quiz-choices">
        {q.choices.map((c, i) => {
          let cls = 'choice';
          if (done) {
            if (i === q.answer) cls += ' correct';
            else if (i === picked) cls += ' wrong';
            else cls += ' faded';
          }
          return (
            <button
              key={i}
              className={cls}
              disabled={done}
              onClick={() => {
                setPicked(i);
                onAnswered(i === q.answer);
              }}
            >
              {isArabicChoice(c) ? (
                <span className="ar-choice" lang="ar" dir="rtl">{c}</span>
              ) : (
                c
              )}
            </button>
          );
        })}
      </div>
      {done && (
        <div className={picked === q.answer ? 'feedback ok' : 'feedback no'}>
          {picked === q.answer ? '✓ Correct!' : '✗ Not quite.'}
          {q.explain && <span> {q.explain}</span>}
        </div>
      )}
    </div>
  );
}
