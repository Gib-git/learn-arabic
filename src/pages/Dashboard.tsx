import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { nextLesson, allLessons, CURRICULUM } from '../data/curriculum';
import { api } from '../lib/api';
import { Heatmap } from '../components/Heatmap';
import { Icon } from '../components/Icons';

const CARD_GLYPHS = ['ب', 'ق', 'ن', 'س', 'ر', 'م', 'ك', 'ع'];

const TUTOR_TILES = [
  { icon: 'chat', label: 'Ask a grammar question' },
  { icon: 'sparkle', label: 'Get a word explained' },
  { icon: 'reader', label: 'Walk through a verse' },
  { icon: 'practice', label: 'Quiz me on vocabulary' },
];

export function Dashboard() {
  const { completedLessons, counts, streak, todaySeconds, settings } = useStore();
  const [heat, setHeat] = useState<Record<string, number>>({});
  useEffect(() => {
    api.stats().then((s) => {
      const map: Record<string, number> = {};
      for (const h of s.heatmap) map[h.date] = h.seconds;
      setHeat(map);
    }).catch(() => {});
  }, []);

  const next = nextLesson(completedLessons);
  const unitOf = (lessonId: string) =>
    CURRICULUM.find((u) => u.lessons.some((l) => l.id === lessonId));
  const goalMin = settings?.dailyGoalMinutes ?? 15;
  const todayMin = Math.floor(todaySeconds / 60);
  const goalPct = Math.min(100, Math.round((todaySeconds / (goalMin * 60)) * 100));
  const due = counts.dueReview + counts.newToday;
  const totalLessons = allLessons.length;

  // the next few uncompleted lessons, shown as cards
  const upcoming = allLessons.filter((l) => !completedLessons.has(l.id)).slice(0, 4);

  const tasks = [
    {
      icon: 'review',
      title: 'Review your flashcards',
      sub: due > 0 ? `${due} card${due === 1 ? '' : 's'} scheduled for today` : 'All caught up — nothing due',
      to: '/review',
      cta: due > 0 ? 'Start' : 'Open deck',
      done: due === 0,
    },
    {
      icon: 'learn',
      title: next ? `Lesson: ${next.title}` : 'All lessons complete',
      sub: next ? unitOf(next.id)?.title ?? '' : 'Revisit any lesson from the Learn page',
      to: next ? `/learn/${next.id}` : '/learn',
      cta: next ? 'Start' : 'Browse',
      done: !next,
    },
    {
      icon: 'practice',
      title: 'Take a practice quiz',
      sub: '10 mixed questions from everything you know',
      to: '/practice',
      cta: 'Start',
      done: false,
    },
    {
      icon: 'reader',
      title: 'Read in the Quran reader',
      sub: 'Word-by-word help, audio, and tajweed colors',
      to: '/reader',
      cta: 'Open',
      done: false,
    },
  ];
  const openTasks = tasks.filter((t) => !t.done).length;

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1>
            <span lang="ar" className="ar-inline">السَّلَامُ عَلَيْكُم</span> — as-salāmu ʿalaykum
          </h1>
          <p className="muted">“Peace be upon you” — here is your study plan for today.</p>
        </div>
        <span className="date-chip">{today}</span>
      </div>

      <div className="fact-row">
        <span className="fact">
          <Icon name="learn" size={17} />
          {completedLessons.size}/{totalLessons}&nbsp;<span className="muted">lessons completed</span>
        </span>
        <span className="fact">
          <Icon name="flame" size={17} />
          {streak.current}-day streak&nbsp;<span className="muted">(best {streak.best})</span>
        </span>
        <span className="fact">
          <Icon name="clock" size={17} />
          {todayMin} min&nbsp;<span className="muted">studied today</span>
        </span>
      </div>

      <div className="split">
        <section className="panel plan-panel">
          <div className="plan-head">
            <h2>Your daily tasks</h2>
            <span className="count-pill">{openTasks}</span>
          </div>
          <div className="task-list">
            {tasks.map((t) => (
              <div className={`task-row${t.done ? ' done' : ''}`} key={t.title}>
                <span className="task-check">{t.done && <Icon name="check" size={13} />}</span>
                <div className="task-meta">
                  <div className="task-title">{t.title}</div>
                  <div className="task-sub">{t.sub}</div>
                </div>
                <Link className={`btn small-btn${t.done ? '' : ' primary'}`} to={t.to}>
                  {t.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="goal-line">
            <div className="goal-line-label">
              <span>Daily goal</span>
              <span>
                {todayMin} / {goalMin} min{goalPct >= 100 && ' — done'}
              </span>
            </div>
            <div className="goal-track">
              <div className="goal-fill" style={{ width: `${goalPct}%` }} />
            </div>
          </div>
        </section>

        <section className="panel tutor-panel">
          <div className="plan-head">
            <h2>Ask your AI tutor</h2>
          </div>
          <p className="muted small" style={{ margin: 0 }}>
            Stuck on anything? Chat in plain English about grammar, vocabulary, or a verse you are
            reading.
          </p>
          <div className="tile-grid">
            {TUTOR_TILES.map((t) => (
              <Link className="tile" to="/tutor" key={t.label}>
                <span className="tile-ico"><Icon name={t.icon} size={17} /></span>
                {t.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="section-head">
        <h2>Continue learning</h2>
        <Link className="see-all" to="/learn">See all lessons</Link>
      </div>
      {upcoming.length > 0 ? (
        <div className="course-grid">
          {upcoming.map((l, i) => {
            const unit = unitOf(l.id);
            const globalIdx = allLessons.findIndex((x) => x.id === l.id);
            const unlocked = i === 0;
            return (
              <div className="course-card" key={l.id}>
                <div className={`course-art${i % 2 === 1 ? ' alt' : ''}`}>
                  {unit && <span className="course-badge">{unit.title}</span>}
                  <span lang="ar">{CARD_GLYPHS[globalIdx % CARD_GLYPHS.length]}</span>
                </div>
                <div className="course-body">
                  <div className="course-title">{l.title}</div>
                  <div className="course-sub">{l.subtitle}</div>
                  <div className="course-foot">
                    <span className="meta">Lesson {globalIdx + 1} of {totalLessons}</span>
                    {unlocked ? (
                      <Link className="btn small-btn primary" to={`/learn/${l.id}`}>Start</Link>
                    ) : (
                      <span className="meta" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Icon name="lock" size={13} /> Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="muted">Curriculum complete — revisit any lesson from the Learn page.</p>
      )}

      <section className="panel">
        <div className="section-head" style={{ margin: '0 0 0.6rem' }}>
          <h2>Recent activity</h2>
          <Link className="see-all" to="/stats">Full stats</Link>
        </div>
        <Heatmap data={heat} weeks={20} />
        <p className="muted small">
          Each square is a day; darker means more study time.
        </p>
      </section>

      <div className="history-box">
        <div className="history-label">Why daily beats occasional</div>
        <p className="muted" style={{ margin: 0 }}>
          Memory research is unambiguous: several short sessions spaced across days build far
          stronger recall than one long session (the “spacing effect”). Fifteen focused minutes
          today is genuinely worth more than two hours on Sunday. Do your reviews first — they are
          scheduled at the exact moment they help most.
        </p>
      </div>
    </div>
  );
}
