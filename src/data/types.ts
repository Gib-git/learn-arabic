export interface Letter {
  id: string;
  name: string; // e.g. "bā’"
  translit: string; // symbol used in transliteration, e.g. "b"
  forms: { isolated: string; initial: string; medial: string; final: string };
  connectsForward: boolean; // does it connect to the letter AFTER it?
  group: string; // shape family label
  sound: string; // plain-English description of the sound
  example: { ar: string; translit: string; en: string };
}

export interface VocabWord {
  id: string;
  ar: string; // fully vowelled Arabic
  translit: string;
  en: string;
  root?: string; // e.g. "ك ت ب"
  pos: 'noun' | 'verb' | 'particle' | 'pronoun' | 'adjective' | 'name';
  freq: number; // approximate occurrences in the Quran
  example?: { ar: string; en: string; ref: string };
}

export interface GlossaryEntry {
  slug: string;
  term: string;
  definition: string;
  lessonId?: string; // lesson where it is introduced
}

export type Section =
  | { type: 'text'; body: string }
  | { type: 'history'; title?: string; body: string }
  | { type: 'letters'; letterIds: string[] }
  | { type: 'vocab'; wordIds: string[] }
  | { type: 'examples'; title?: string; items: { ar: string; translit?: string; en: string; note?: string }[] };

export interface ExerciseSeed {
  prompt: string;
  promptAr?: string;
  choices: string[];
  answer: number; // index into choices
  explain?: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  sections: Section[];
  /** Extra hand-written exercises; letter/vocab exercises are auto-generated too. */
  exercises?: ExerciseSeed[];
  /** Letters introduced (SRS cards are created for these). */
  letterIds?: string[];
  /** Vocab introduced (SRS cards are created for these). */
  wordIds?: string[];
}

export interface Unit {
  id: string;
  title: string;
  tagline: string;
  lessons: Lesson[];
}

export type CardKind = 'letter' | 'vocab-ar-en' | 'vocab-en-ar';

/** Cards seeded when a lesson is completed. */
export function cardsForLesson(lesson: Lesson): { id: string; type: CardKind }[] {
  const cards: { id: string; type: CardKind }[] = [];
  for (const l of lesson.letterIds ?? []) cards.push({ id: `letter:${l}`, type: 'letter' });
  for (const w of lesson.wordIds ?? []) {
    cards.push({ id: `vocab:${w}:ar-en`, type: 'vocab-ar-en' });
    cards.push({ id: `vocab:${w}:en-ar`, type: 'vocab-en-ar' });
  }
  return cards;
}
