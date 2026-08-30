// SM-2-style spaced repetition (the algorithm family Anki uses), with short
// learning steps for brand-new cards. Pure function: given a card's state and
// a grade, return the new state.
//
// Grades: 0 = Again (forgot), 1 = Hard, 2 = Good, 3 = Easy

export interface CardState {
  ease: number; // ease factor, min 1.3
  interval_days: number; // 0 while in learning steps
  reps: number;
  lapses: number;
  learning_step: number; // index into LEARNING_STEPS_MIN; -1 = graduated
}

export interface ScheduledCard extends CardState {
  due_at: string; // ISO timestamp
}

const LEARNING_STEPS_MIN = [1, 10]; // minutes
const GRADUATING_INTERVAL = 1; // days after finishing learning steps
const EASY_INTERVAL = 4; // days when Easy pressed on a learning card
const MIN_EASE = 1.3;

function due(minutesFromNow: number): string {
  return new Date(Date.now() + minutesFromNow * 60_000).toISOString();
}

function dueDays(days: number): string {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

export function gradeCard(card: CardState, grade: 0 | 1 | 2 | 3): ScheduledCard {
  const s: CardState = { ...card, reps: card.reps + 1 };
  const learning = s.learning_step >= 0;

  if (grade === 0) {
    // Again: (re)enter learning; count a lapse only for graduated cards
    if (!learning) s.lapses += 1;
    s.ease = Math.max(MIN_EASE, s.ease - 0.2);
    s.learning_step = 0;
    s.interval_days = 0;
    return { ...s, due_at: due(LEARNING_STEPS_MIN[0]) };
  }

  if (learning) {
    if (grade === 3) {
      // Easy: graduate immediately
      s.learning_step = -1;
      s.interval_days = EASY_INTERVAL;
      return { ...s, due_at: dueDays(EASY_INTERVAL) };
    }
    if (grade === 1) {
      // Hard: repeat the current step
      return { ...s, due_at: due(LEARNING_STEPS_MIN[s.learning_step]) };
    }
    // Good: advance a step or graduate
    const next = s.learning_step + 1;
    if (next < LEARNING_STEPS_MIN.length) {
      s.learning_step = next;
      return { ...s, due_at: due(LEARNING_STEPS_MIN[next]) };
    }
    s.learning_step = -1;
    s.interval_days = GRADUATING_INTERVAL;
    return { ...s, due_at: dueDays(GRADUATING_INTERVAL) };
  }

  // Graduated (review) card
  if (grade === 1) {
    s.ease = Math.max(MIN_EASE, s.ease - 0.15);
    s.interval_days = Math.max(1, s.interval_days * 1.2);
  } else if (grade === 2) {
    // Classic SM-2 progression: 1 → 6 → interval × ease
    s.interval_days = s.interval_days < 1.5 ? 6 : s.interval_days * s.ease;
  } else {
    s.ease += 0.15;
    s.interval_days = Math.max(EASY_INTERVAL, s.interval_days * s.ease * 1.3);
  }
  s.interval_days = Math.min(s.interval_days, 365);
  return { ...s, due_at: dueDays(s.interval_days) };
}
