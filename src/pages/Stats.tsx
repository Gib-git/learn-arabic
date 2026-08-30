import { useEffect, useState } from 'react';
import { api, type StatsPayload } from '../lib/api';
import { Heatmap } from '../components/Heatmap';
import { Icon } from '../components/Icons';

function fmtTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const ACTIVITY_LABELS: Record<string, string> = {
  lessons: 'Lessons',
  review: 'Flashcards',
  practice: 'Practice',
  reading: 'Reader',
  roots: 'Root explorer',
  tutor: 'AI tutor',
  other: 'Browsing',
};

export function Stats() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.stats().then(setStats).catch((e) => setError((e as Error).message));
  }, []);

  if (error) return <div className="page"><p className="error">Couldn't load stats: {error}</p></div>;
  if (!stats) return <div className="page"><p className="muted">Loading stats…</p></div>;

  const heat: Record<string, number> = {};
  for (const h of stats.heatmap) heat[h.date] = h.seconds;
  const acc = stats.accuracy.total > 0 ? Math.round(((stats.accuracy.passed ?? 0) / stats.accuracy.total) * 100) : null;
  const acc30 = stats.accuracy30.total > 0 ? Math.round(((stats.accuracy30.passed ?? 0) / stats.accuracy30.total) * 100) : null;
  const quizAcc =
    stats.quiz.total && stats.quiz.total > 0
      ? Math.round(((stats.quiz.correct ?? 0) / stats.quiz.total) * 100)
      : null;
  const totalByActivity = stats.byActivity.reduce((n, a) => n + a.seconds, 0) || 1;

  return (
    <div className="page">
      <h1>Stats</h1>

      <section className="panel">
        <h2>Study heatmap — last 12 months</h2>
        <Heatmap data={heat} weeks={53} />
        <div className="heat-legend muted small">
          less
          {[0, 1, 2, 3, 4].map((l) => (
            <svg key={l} width="12" height="12"><rect width="12" height="12" rx="2.5" className={`heat-cell heat-${l}`} /></svg>
          ))}
          more (0 · &lt;5 · &lt;15 · &lt;30 · 30+ min)
        </div>
      </section>

      <div className="card-grid">
        <div className="stat-card"><div className="stat-big">{fmtTime(stats.totalSeconds)}</div><div className="stat-label">total study time</div></div>
        <div className="stat-card"><div className="stat-big streak-big"><Icon name="flame" size={26} /> {stats.streak.current}</div><div className="stat-label">day streak (best {stats.streak.best})</div></div>
        <div className="stat-card"><div className="stat-big">{stats.reviewsToday}</div><div className="stat-label">reviews today</div></div>
        <div className="stat-card"><div className="stat-big">{acc30 ?? acc ?? '—'}{(acc30 ?? acc) !== null && '%'}</div><div className="stat-label">review accuracy (30 days)</div></div>
      </div>

      <section className="panel">
        <h2>Your deck</h2>
        <div className="deck-bars">
          {([
            ['mature', 'Mature (interval ≥ 3 weeks)', stats.cardTotals.mature],
            ['learning', 'Learning', stats.cardTotals.learning],
            ['fresh', 'New (not yet seen)', stats.cardTotals.fresh],
          ] as const).map(([key, label, n]) => (
            <div className="deck-bar-row" key={key}>
              <span className="deck-label">{label}</span>
              <div className="deck-bar">
                <div
                  className={`deck-fill deck-${key}`}
                  style={{ width: `${stats.cardTotals.total ? (n / stats.cardTotals.total) * 100 : 0}%` }}
                />
              </div>
              <span className="muted small">{n}</span>
            </div>
          ))}
        </div>
        <p className="muted small">
          {stats.cardTotals.total} cards total. A card counts as “mature” once you can go three
          weeks between reviews — that's knowledge in long-term memory.
        </p>
      </section>

      <section className="panel">
        <h2>Time by activity</h2>
        {stats.byActivity.length === 0 && <p className="muted">No time logged yet.</p>}
        {stats.byActivity
          .sort((a, b) => b.seconds - a.seconds)
          .map((a) => (
            <div className="deck-bar-row" key={a.activity}>
              <span className="deck-label">{ACTIVITY_LABELS[a.activity] ?? a.activity}</span>
              <div className="deck-bar">
                <div className="deck-fill deck-time" style={{ width: `${(a.seconds / totalByActivity) * 100}%` }} />
              </div>
              <span className="muted small">{fmtTime(a.seconds)}</span>
            </div>
          ))}
      </section>

      <section className="panel">
        <h2>Quizzes</h2>
        <p className="muted">
          {stats.quiz.taken > 0
            ? `${stats.quiz.taken} quizzes taken · ${quizAcc}% of questions answered correctly.`
            : 'No practice quizzes yet — they are a great way to consolidate.'}
        </p>
      </section>
    </div>
  );
}
