import { Router } from 'express';
import { db, todayStr } from '../db.js';
import { gradeCard, type CardState } from '../srs.js';

export const api = Router();

// ---------- settings ----------
const DEFAULT_SETTINGS = {
  dailyGoalMinutes: 15,
  newCardsPerDay: 15,
  tts: {
    mode: 'browser' as 'browser' | 'endpoint',
    browserVoice: '',
    endpointUrl: '',
    endpointModel: 'kokoro',
    endpointVoice: '',
  },
  tutor: {
    url: '',
    model: '',
  },
};

function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all() as {
    key: string;
    value: string;
  }[];
  const stored: Record<string, unknown> = {};
  for (const r of rows) stored[r.key] = JSON.parse(r.value);
  return { ...DEFAULT_SETTINGS, ...stored };
}

const putSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

api.get('/settings', (_req, res) => {
  res.json(getSettings());
});

api.put('/settings', (req, res) => {
  const body = req.body as Record<string, unknown>;
  const tx = db.transaction(() => {
    for (const [k, v] of Object.entries(body)) putSetting.run(k, JSON.stringify(v));
  });
  tx();
  res.json(getSettings());
});

// ---------- streak / time helpers ----------
function computeStreaks() {
  const rows = db
    .prepare('SELECT date, SUM(seconds) s FROM time_buckets GROUP BY date HAVING s > 0 ORDER BY date')
    .all() as { date: string; s: number }[];
  const days = new Set(rows.map((r) => r.date));
  // current streak: walk back from today (today itself may not have activity yet)
  let current = 0;
  const d = new Date();
  if (!days.has(todayStr(d))) d.setDate(d.getDate() - 1);
  while (days.has(todayStr(d))) {
    current += 1;
    d.setDate(d.getDate() - 1);
  }
  // best streak
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const r of rows) {
    const cur = new Date(r.date + 'T00:00:00');
    if (prev && cur.getTime() - prev.getTime() === 86_400_000) run += 1;
    else run = 1;
    best = Math.max(best, run);
    prev = cur;
  }
  return { current, best };
}

function newCardsIntroducedToday(): number {
  const row = db
    .prepare(
      `SELECT COUNT(*) n FROM (
         SELECT card_id, MIN(reviewed_at) first_rev FROM review_log GROUP BY card_id
       ) WHERE date(first_rev, 'localtime') = date('now', 'localtime')`
    )
    .get() as { n: number };
  return row.n;
}

function dueCounts(newPerDay: number) {
  const now = new Date().toISOString();
  const dueReview = (
    db.prepare('SELECT COUNT(*) n FROM cards WHERE reps > 0 AND due_at <= ?').get(now) as {
      n: number;
    }
  ).n;
  const allowance = Math.max(0, newPerDay - newCardsIntroducedToday());
  const newAvailable = (
    db.prepare('SELECT COUNT(*) n FROM cards WHERE reps = 0').get() as { n: number }
  ).n;
  return { dueReview, newToday: Math.min(allowance, newAvailable) };
}

// ---------- state (one-shot hydration) ----------
api.get('/state', (_req, res) => {
  const settings = getSettings();
  const lessons = db
    .prepare('SELECT lesson_id, completed_at, score FROM lesson_progress')
    .all();
  const cardStates = db
    .prepare('SELECT card_id, interval_days, reps, learning_step FROM cards')
    .all();
  const wordStatuses = db.prepare('SELECT word_id, status FROM word_status').all();
  const todaySeconds =
    (
      db
        .prepare('SELECT SUM(seconds) s FROM time_buckets WHERE date = ?')
        .get(todayStr()) as { s: number | null }
    ).s ?? 0;
  res.json({
    settings,
    lessons,
    cardStates,
    wordStatuses,
    counts: dueCounts(settings.newCardsPerDay as number),
    streak: computeStreaks(),
    todaySeconds,
  });
});

// ---------- lessons ----------
api.post('/lessons/:id/complete', (req, res) => {
  const lessonId = req.params.id;
  const { cardIds = [], score = null } = req.body as {
    cardIds?: { id: string; type: string }[];
    score?: number | null;
  };
  const now = new Date().toISOString();
  const insLesson = db.prepare(
    'INSERT OR REPLACE INTO lesson_progress (lesson_id, completed_at, score) VALUES (?, ?, ?)'
  );
  const insCard = db.prepare(
    `INSERT OR IGNORE INTO cards (card_id, lesson_id, card_type, due_at, created_at)
     VALUES (?, ?, ?, ?, ?)`
  );
  const tx = db.transaction(() => {
    insLesson.run(lessonId, now, score);
    for (const c of cardIds) insCard.run(c.id, lessonId, c.type, now, now);
  });
  tx();
  res.json({ ok: true });
});

// ---------- flashcards ----------
// Add cards outside a lesson (from the Reader or Root explorer)
api.post('/cards', (req, res) => {
  const { cardIds = [] } = req.body as { cardIds?: { id: string; type: string }[] };
  const now = new Date().toISOString();
  const insCard = db.prepare(
    `INSERT OR IGNORE INTO cards (card_id, lesson_id, card_type, due_at, created_at)
     VALUES (?, 'custom', ?, ?, ?)`
  );
  const tx = db.transaction(() => {
    for (const c of cardIds) insCard.run(c.id, c.type, now, now);
  });
  tx();
  res.json({ ok: true, added: cardIds.length });
});

api.get('/cards/due', (_req, res) => {
  const settings = getSettings();
  const now = new Date().toISOString();
  const due = db
    .prepare(
      'SELECT * FROM cards WHERE reps > 0 AND due_at <= ? ORDER BY due_at LIMIT 200'
    )
    .all(now);
  const allowance = Math.max(
    0,
    (settings.newCardsPerDay as number) - newCardsIntroducedToday()
  );
  const fresh = db
    .prepare('SELECT * FROM cards WHERE reps = 0 ORDER BY created_at LIMIT ?')
    .all(allowance);
  res.json({ due, fresh });
});

api.post('/reviews', (req, res) => {
  const { cardId, grade, elapsedMs = null } = req.body as {
    cardId: string;
    grade: 0 | 1 | 2 | 3;
    elapsedMs?: number | null;
  };
  const card = db.prepare('SELECT * FROM cards WHERE card_id = ?').get(cardId) as
    | (CardState & { card_id: string })
    | undefined;
  if (!card) {
    res.status(404).json({ error: 'card not found' });
    return;
  }
  const next = gradeCard(card, grade);
  const now = new Date().toISOString();
  const tx = db.transaction(() => {
    db.prepare(
      `UPDATE cards SET ease = ?, interval_days = ?, due_at = ?, reps = ?, lapses = ?, learning_step = ?
       WHERE card_id = ?`
    ).run(
      next.ease,
      next.interval_days,
      next.due_at,
      next.reps,
      next.lapses,
      next.learning_step,
      cardId
    );
    db.prepare(
      'INSERT INTO review_log (card_id, grade, reviewed_at, elapsed_ms) VALUES (?, ?, ?, ?)'
    ).run(cardId, grade, now, elapsedMs);
  });
  tx();
  res.json({ card: { card_id: cardId, ...next } });
});

// ---------- time tracking ----------
api.post('/time', (req, res) => {
  const { activity, seconds, date } = req.body as {
    activity: string;
    seconds: number;
    date?: string;
  };
  if (!activity || !Number.isFinite(seconds) || seconds <= 0) {
    res.json({ ok: true });
    return;
  }
  const day = date || todayStr();
  db.prepare(
    `INSERT INTO time_buckets (date, activity, seconds) VALUES (?, ?, ?)
     ON CONFLICT(date, activity) DO UPDATE SET seconds = seconds + excluded.seconds`
  ).run(day, activity, Math.round(seconds));
  res.json({ ok: true });
});

// ---------- quiz results ----------
api.post('/quiz-results', (req, res) => {
  const { quizType, correct, total } = req.body as {
    quizType: string;
    correct: number;
    total: number;
  };
  db.prepare(
    'INSERT INTO quiz_results (quiz_type, correct, total, taken_at) VALUES (?, ?, ?, ?)'
  ).run(quizType, correct, total, new Date().toISOString());
  res.json({ ok: true });
});

// ---------- word status ----------
api.put('/words/:id/status', (req, res) => {
  const { status } = req.body as { status: string };
  db.prepare('INSERT OR REPLACE INTO word_status (word_id, status) VALUES (?, ?)').run(
    req.params.id,
    status
  );
  res.json({ ok: true });
});

// ---------- stats ----------
api.get('/stats', (_req, res) => {
  const heatmap = db
    .prepare('SELECT date, SUM(seconds) seconds FROM time_buckets GROUP BY date')
    .all();
  const byActivity = db
    .prepare('SELECT activity, SUM(seconds) seconds FROM time_buckets GROUP BY activity')
    .all();
  const totalSeconds =
    (
      db.prepare('SELECT SUM(seconds) s FROM time_buckets').get() as { s: number | null }
    ).s ?? 0;
  const cardTotals = db
    .prepare(
      `SELECT
         COUNT(*) total,
         SUM(CASE WHEN reps = 0 THEN 1 ELSE 0 END) fresh,
         SUM(CASE WHEN reps > 0 AND interval_days < 21 THEN 1 ELSE 0 END) learning,
         SUM(CASE WHEN interval_days >= 21 THEN 1 ELSE 0 END) mature
       FROM cards`
    )
    .get();
  const accuracy = db
    .prepare(
      `SELECT COUNT(*) total, SUM(CASE WHEN grade > 0 THEN 1 ELSE 0 END) passed
       FROM review_log`
    )
    .get() as { total: number; passed: number | null };
  const accuracy30 = db
    .prepare(
      `SELECT COUNT(*) total, SUM(CASE WHEN grade > 0 THEN 1 ELSE 0 END) passed
       FROM review_log WHERE reviewed_at >= datetime('now', '-30 days')`
    )
    .get() as { total: number; passed: number | null };
  const reviewsToday = (
    db
      .prepare(
        `SELECT COUNT(*) n FROM review_log WHERE date(reviewed_at, 'localtime') = date('now', 'localtime')`
      )
      .get() as { n: number }
  ).n;
  const quiz = db
    .prepare('SELECT COUNT(*) taken, SUM(correct) correct, SUM(total) total FROM quiz_results')
    .get();
  res.json({
    heatmap,
    byActivity,
    totalSeconds,
    cardTotals,
    accuracy,
    accuracy30,
    reviewsToday,
    quiz,
    streak: computeStreaks(),
  });
});

// ---------- export / import ----------
const TABLES = [
  'lesson_progress',
  'cards',
  'review_log',
  'time_buckets',
  'quiz_results',
  'word_status',
  'settings',
] as const;

api.get('/export', (_req, res) => {
  const dump: Record<string, unknown[]> = {};
  for (const t of TABLES) dump[t] = db.prepare(`SELECT * FROM ${t}`).all();
  res.setHeader('Content-Disposition', 'attachment; filename="learn-arabic-backup.json"');
  res.json({ exportedAt: new Date().toISOString(), version: 1, tables: dump });
});

api.post('/import', (req, res) => {
  const body = req.body as { tables?: Record<string, Record<string, unknown>[]> };
  if (!body?.tables) {
    res.status(400).json({ error: 'invalid backup file' });
    return;
  }
  const tx = db.transaction(() => {
    for (const t of TABLES) {
      const rows = body.tables![t];
      if (!Array.isArray(rows)) continue;
      db.prepare(`DELETE FROM ${t}`).run();
      for (const row of rows) {
        const cols = Object.keys(row);
        db.prepare(
          `INSERT INTO ${t} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`
        ).run(...cols.map((c) => row[c]));
      }
    }
  });
  tx();
  res.json({ ok: true });
});

api.post('/reset', (_req, res) => {
  const tx = db.transaction(() => {
    for (const t of TABLES) db.prepare(`DELETE FROM ${t}`).run();
  });
  tx();
  res.json({ ok: true });
});
