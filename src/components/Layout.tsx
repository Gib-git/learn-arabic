import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { setActivity } from '../lib/timeTracker';
import { useStore } from '../store/useStore';
import { Icon } from './Icons';

type NavItem = { to: string; label: string; icon: string; activity: string };
type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Study',
    items: [
      { to: '/', label: 'Home', icon: 'home', activity: 'other' },
      { to: '/learn', label: 'Learn', icon: 'learn', activity: 'lessons' },
      { to: '/review', label: 'Review', icon: 'review', activity: 'review' },
      { to: '/practice', label: 'Practice', icon: 'practice', activity: 'practice' },
    ],
  },
  {
    label: 'Explore',
    items: [
      { to: '/reader', label: 'Reader', icon: 'reader', activity: 'reading' },
      { to: '/roots', label: 'Roots', icon: 'roots', activity: 'roots' },
      { to: '/tutor', label: 'AI Tutor', icon: 'tutor', activity: 'tutor' },
      { to: '/glossary', label: 'Glossary', icon: 'glossary', activity: 'other' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/stats', label: 'Stats', icon: 'stats', activity: 'other' },
      { to: '/settings', label: 'Settings', icon: 'settings', activity: 'other' },
    ],
  },
];

const NAV = NAV_GROUPS.flatMap((g) => g.items);

export function Layout() {
  const location = useLocation();
  const counts = useStore((s) => s.counts);
  const streak = useStore((s) => s.streak);

  useEffect(() => {
    const item =
      NAV.find((n) => n.to !== '/' && location.pathname.startsWith(n.to)) ??
      NAV.find((n) => n.to === '/');
    setActivity(location.pathname.startsWith('/learn') ? 'lessons' : item?.activity ?? 'other');
  }, [location.pathname]);

  const due = counts.dueReview + counts.newToday;
  return (
    <div className="layout">
      <header className="topbar">
        <span className="brand">
          <span className="brand-mark" lang="ar">اقرأ</span>
          <span className="brand-text">
            <span className="brand-name">Quranic Arabic</span>
            <span className="brand-tag">Read the Quran, word by word</span>
          </span>
        </span>
        <div className="top-actions">
          <span className="top-chip" title={`Current streak: ${streak.current} days`}>
            <span className="flame"><Icon name="flame" size={15} /></span>
            {streak.current}-day streak
          </span>
          {due > 0 && (
            <Link className="top-chip due-chip" to="/review">
              <Icon name="review" size={15} />
              {due} due
            </Link>
          )}
        </div>
      </header>
      <nav className="nav">
        {NAV_GROUPS.map((group) => (
          <div style={{ display: 'contents' }} key={group.label}>
            <span className="nav-group-label">{group.label}</span>
            {group.items.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon">
                  <Icon name={n.icon} />
                  {n.to === '/review' && due > 0 && <span className="badge">{due}</span>}
                </span>
                <span className="nav-label">{n.label}</span>
                {n.to === '/review' && due > 0 && <span className="badge badge-row">{due}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
