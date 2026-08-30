// Thin wrapper over the backend REST API.
export interface CardRow {
  card_id: string;
  lesson_id: string;
  card_type: string;
  ease: number;
  interval_days: number;
  due_at: string;
  reps: number;
  lapses: number;
  learning_step: number;
}

export interface AppState {
  settings: Settings;
  lessons: { lesson_id: string; completed_at: string; score: number | null }[];
  cardStates: Pick<CardRow, 'card_id' | 'interval_days' | 'reps' | 'learning_step'>[];
  wordStatuses: { word_id: string; status: string }[];
  counts: { dueReview: number; newToday: number };
  streak: { current: number; best: number };
  todaySeconds: number;
}

export interface Settings {
  dailyGoalMinutes: number;
  newCardsPerDay: number;
  tts: {
    mode: 'browser' | 'endpoint';
    browserVoice: string;
    endpointUrl: string;
    endpointModel: string;
    endpointVoice: string;
  };
  tutor: {
    url: string;
    model: string;
  };
}

export interface StatsPayload {
  heatmap: { date: string; seconds: number }[];
  byActivity: { activity: string; seconds: number }[];
  totalSeconds: number;
  cardTotals: { total: number; fresh: number; learning: number; mature: number };
  accuracy: { total: number; passed: number | null };
  accuracy30: { total: number; passed: number | null };
  reviewsToday: number;
  quiz: { taken: number; correct: number | null; total: number | null };
  streak: { current: number; best: number };
}

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  state: () => req<AppState>('/state'),
  stats: () => req<StatsPayload>('/stats'),
  completeLesson: (id: string, cardIds: { id: string; type: string }[], score?: number) =>
    req(`/lessons/${id}/complete`, { method: 'POST', body: JSON.stringify({ cardIds, score }) }),
  dueCards: () => req<{ due: CardRow[]; fresh: CardRow[] }>('/cards/due'),
  addCards: (cardIds: { id: string; type: string }[]) =>
    req('/cards', { method: 'POST', body: JSON.stringify({ cardIds }) }),
  review: (cardId: string, grade: 0 | 1 | 2 | 3, elapsedMs?: number) =>
    req<{ card: CardRow }>('/reviews', {
      method: 'POST',
      body: JSON.stringify({ cardId, grade, elapsedMs }),
    }),
  logTime: (activity: string, seconds: number) =>
    req('/time', { method: 'POST', body: JSON.stringify({ activity, seconds }) }),
  quizResult: (quizType: string, correct: number, total: number) =>
    req('/quiz-results', { method: 'POST', body: JSON.stringify({ quizType, correct, total }) }),
  setWordStatus: (id: string, status: string) =>
    req(`/words/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  saveSettings: (patch: Partial<Settings>) =>
    req<Settings>('/settings', { method: 'PUT', body: JSON.stringify(patch) }),
  importBackup: (data: unknown) =>
    req('/import', { method: 'POST', body: JSON.stringify(data) }),
  reset: () => req('/reset', { method: 'POST' }),
  quran: {
    chapters: () => req<QuranChapter[]>('/quran/chapters'),
    verses: (chapter: number) => req<QuranVerse[]>(`/quran/verses/${chapter}`),
    audio: (chapter: number) => req<QuranAudioFile[]>(`/quran/audio/${chapter}`),
  },
};

export interface QuranChapter {
  id: number;
  name_simple: string;
  name_arabic: string;
  translated_name: { name: string };
  verses_count: number;
  revelation_place: string;
}

export interface QuranWord {
  id: number;
  text_uthmani?: string;
  char_type_name: string; // 'word' | 'end'
  audio_url: string | null;
  translation?: { text: string };
  transliteration?: { text: string | null };
}

export interface QuranVerse {
  id: number;
  verse_key: string; // "1:1"
  verse_number: number;
  text_uthmani?: string;
  text_uthmani_tajweed?: string;
  words?: QuranWord[];
  translations?: { text: string }[];
}

export interface QuranAudioFile {
  verse_key: string;
  url: string;
}

// CDN hosts the API returns audio from; matching files are served through our
// server, which downloads each one to disk permanently on first play.
const AUDIO_CDN_HOSTS: Record<string, 'verse' | 'word'> = {
  'verses.quran.com': 'verse',
  'audio.qurancdn.com': 'word',
};

/**
 * Resolve an audio URL from the Quran API to a playable src, routed through
 * the server's permanent disk cache. Unknown absolute hosts play directly.
 */
export function audioSrc(url: string | null | undefined, kind: 'verse' | 'word'): string | null {
  if (!url) return null;
  let rel = url;
  if (url.startsWith('http')) {
    try {
      const u = new URL(url);
      const hostKind = AUDIO_CDN_HOSTS[u.hostname];
      if (!hostKind) return url;
      kind = hostKind;
      rel = u.pathname.replace(/^\//, '');
    } catch {
      return url;
    }
  }
  return `/api/quran/audio-file/${kind}/${rel}`;
}
