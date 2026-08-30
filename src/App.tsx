import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Learn } from './pages/Learn';
import { LessonPage } from './pages/LessonPage';
import { Review } from './pages/Review';
import { Practice } from './pages/Practice';
import { Reader } from './pages/Reader';
import { Roots } from './pages/Roots';
import { Tutor } from './pages/Tutor';
import { Stats } from './pages/Stats';
import { Glossary } from './pages/Glossary';
import { SettingsPage } from './pages/Settings';
import { useStore } from './store/useStore';
import { startTimeTracking, onTimeFlushed } from './lib/timeTracker';

export default function App() {
  const { loaded, error, hydrate, addTodaySeconds } = useStore();

  useEffect(() => {
    hydrate();
    startTimeTracking();
    onTimeFlushed((s) => addTodaySeconds(s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!loaded) {
    return <div className="boot">Loading…</div>;
  }
  if (error) {
    return (
      <div className="boot">
        <p>Couldn't reach the server: {error}</p>
        <button className="btn primary" onClick={() => hydrate()}>Retry</button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:lessonId" element={<LessonPage />} />
          <Route path="/review" element={<Review />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/reader" element={<Reader />} />
          <Route path="/roots" element={<Roots />} />
          <Route path="/tutor" element={<Tutor />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
