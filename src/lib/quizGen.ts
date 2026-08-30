// Auto-generates quiz questions from learned letters and vocabulary.
// Practice quizzes interleave material from every completed lesson —
// mixing topics ("interleaving") is proven to build stronger recall
// than drilling one topic at a time.
import { LETTERS, letterById } from '../data/letters';
import { VOCAB, wordById } from '../data/vocab';
import { allLessons } from '../data/curriculum';
import type { ExerciseSeed, Lesson } from '../data/types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors<T>(pool: T[], exclude: T, n: number): T[] {
  return shuffle(pool.filter((x) => x !== exclude)).slice(0, n);
}

function withShuffledChoices(q: ExerciseSeed): ExerciseSeed {
  const correct = q.choices[q.answer];
  const choices = shuffle(q.choices);
  return { ...q, choices, answer: choices.indexOf(correct) };
}

export function letterQuestion(letterId: string): ExerciseSeed {
  const letter = letterById.get(letterId)!;
  const names = pickDistractors(LETTERS.map((l) => l.name), letter.name, 3);
  const forms = ['isolated', 'initial', 'medial', 'final'] as const;
  const form = forms[Math.floor(Math.random() * forms.length)];
  return withShuffledChoices({
    prompt: `Which letter is this${form === 'isolated' ? '' : ` (${form} form)`}?`,
    promptAr: letter.forms[form],
    choices: [letter.name, ...names],
    answer: 0,
    explain: `${letter.forms.isolated} is ${letter.name} — ${letter.sound}`,
  });
}

export function vocabQuestion(wordId: string, direction: 'ar-en' | 'en-ar'): ExerciseSeed {
  const word = wordById.get(wordId)!;
  const pool = VOCAB.filter((w) => w.pos === word.pos).map((w) =>
    direction === 'ar-en' ? w.en : w.ar
  );
  if (direction === 'ar-en') {
    return withShuffledChoices({
      prompt: 'What does this word mean?',
      promptAr: word.ar,
      choices: [word.en, ...pickDistractors(pool, word.en, 3)],
      answer: 0,
      explain: `${word.ar} (${word.translit}) = ${word.en}`,
    });
  }
  return withShuffledChoices({
    prompt: `Which word means “${word.en}” (${word.translit})?`,
    choices: [word.ar, ...pickDistractors(pool, word.ar, 3)],
    answer: 0,
    explain: `${word.ar} (${word.translit}) = ${word.en}`,
  });
}

/** Exercises for a lesson: hand-written first, then generated from its letters/vocab. */
export function lessonExercises(lesson: Lesson): ExerciseSeed[] {
  const qs: ExerciseSeed[] = (lesson.exercises ?? []).map(withShuffledChoices);
  for (const l of lesson.letterIds ?? []) qs.push(letterQuestion(l));
  for (const w of shuffle(lesson.wordIds ?? []).slice(0, 8)) qs.push(vocabQuestion(w, 'ar-en'));
  return qs;
}

/** Interleaved practice quiz drawn from everything in completed lessons. */
export function practiceQuiz(completedLessonIds: Set<string>, size = 10): ExerciseSeed[] {
  const letters: string[] = [];
  const words: string[] = [];
  for (const lesson of allLessons) {
    if (!completedLessonIds.has(lesson.id)) continue;
    letters.push(...(lesson.letterIds ?? []));
    words.push(...(lesson.wordIds ?? []));
  }
  const qs: ExerciseSeed[] = [];
  for (const l of shuffle(letters).slice(0, Math.ceil(size / 3))) qs.push(letterQuestion(l));
  for (const w of shuffle(words).slice(0, size)) {
    qs.push(vocabQuestion(w, Math.random() < 0.5 ? 'ar-en' : 'en-ar'));
  }
  return shuffle(qs).slice(0, size);
}
