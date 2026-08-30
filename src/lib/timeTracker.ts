// Tracks ACTIVE study time only: ticks once a second while the tab is visible
// and the user has interacted within the last 60 seconds. Accumulated seconds
// are flushed to the server every 30 seconds and when the tab is hidden.
const IDLE_LIMIT_MS = 60_000;
const FLUSH_INTERVAL_MS = 30_000;

let currentActivity = 'other';
let lastInteraction = Date.now();
let pending: Record<string, number> = {};
let onFlushed: ((seconds: number) => void) | null = null;

export function setActivity(activity: string) {
  currentActivity = activity;
}

export function onTimeFlushed(cb: (seconds: number) => void) {
  onFlushed = cb;
}

function flush(useBeacon = false) {
  const entries = Object.entries(pending).filter(([, s]) => s > 0);
  if (entries.length === 0) return;
  pending = {};
  let total = 0;
  for (const [activity, seconds] of entries) {
    total += seconds;
    const body = JSON.stringify({ activity, seconds });
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon('/api/time', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {
        // restore on failure so time isn't lost
        pending[activity] = (pending[activity] ?? 0) + seconds;
      });
    }
  }
  onFlushed?.(total);
}

export function startTimeTracking() {
  const markActive = () => {
    lastInteraction = Date.now();
  };
  for (const ev of ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']) {
    window.addEventListener(ev, markActive, { passive: true });
  }

  setInterval(() => {
    if (document.hidden) return;
    if (Date.now() - lastInteraction > IDLE_LIMIT_MS) return;
    pending[currentActivity] = (pending[currentActivity] ?? 0) + 1;
  }, 1000);

  setInterval(() => flush(), FLUSH_INTERVAL_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) flush(true);
  });
  window.addEventListener('pagehide', () => flush(true));
}
