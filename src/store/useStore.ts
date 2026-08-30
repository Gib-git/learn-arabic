import { create } from 'zustand';
import { api, type AppState, type Settings } from '../lib/api';
import { configureTts } from '../lib/tts';

interface Store {
  loaded: boolean;
  error: string | null;
  settings: Settings | null;
  completedLessons: Set<string>;
  cardStates: Map<string, { interval_days: number; reps: number; learning_step: number }>;
  counts: { dueReview: number; newToday: number };
  streak: { current: number; best: number };
  todaySeconds: number;
  hydrate: () => Promise<void>;
  completeLesson: (id: string, cardIds: { id: string; type: string }[], score?: number) => Promise<void>;
  saveSettings: (patch: Partial<Settings>) => Promise<void>;
  addTodaySeconds: (s: number) => void;
  refreshCounts: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  loaded: false,
  error: null,
  settings: null,
  completedLessons: new Set(),
  cardStates: new Map(),
  counts: { dueReview: 0, newToday: 0 },
  streak: { current: 0, best: 0 },
  todaySeconds: 0,

  hydrate: async () => {
    try {
      const s: AppState = await api.state();
      configureTts(s.settings.tts);
      set({
        loaded: true,
        error: null,
        settings: s.settings,
        completedLessons: new Set(s.lessons.map((l) => l.lesson_id)),
        cardStates: new Map(s.cardStates.map((c) => [c.card_id, c])),
        counts: s.counts,
        streak: s.streak,
        todaySeconds: s.todaySeconds,
      });
    } catch (e) {
      set({ loaded: true, error: (e as Error).message });
    }
  },

  completeLesson: async (id, cardIds, score) => {
    await api.completeLesson(id, cardIds, score);
    const completed = new Set(get().completedLessons);
    completed.add(id);
    set({ completedLessons: completed });
    await get().refreshCounts();
  },

  saveSettings: async (patch) => {
    const settings = await api.saveSettings(patch);
    configureTts(settings.tts);
    set({ settings });
  },

  addTodaySeconds: (s) => set({ todaySeconds: get().todaySeconds + s }),

  refreshCounts: async () => {
    try {
      const s = await api.state();
      set({
        counts: s.counts,
        streak: s.streak,
        cardStates: new Map(s.cardStates.map((c) => [c.card_id, c])),
      });
    } catch {
      /* non-fatal */
    }
  },
}));
