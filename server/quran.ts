// Quran Foundation API client: OAuth2 client-credentials token management and
// a cached fetch helper. Credentials stay server-side only.
import { db } from './db.js';

const OAUTH_BASE = process.env.QURAN_OAUTH_BASE || 'https://oauth2.quran.foundation';
const API_BASE = process.env.QURAN_API_BASE || 'https://apis.quran.foundation';
const CLIENT_ID = process.env.QURAN_CLIENT_ID || '';
const CLIENT_SECRET = process.env.QURAN_CLIENT_SECRET || '';

let token: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (token && Date.now() < token.expiresAt) return token.value;
  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${OAUTH_BASE}/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials&scope=content',
  });
  if (!res.ok) {
    throw new Error(`Quran API token request failed: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  // Refresh 5 minutes before expiry
  token = { value: data.access_token, expiresAt: Date.now() + (data.expires_in - 300) * 1000 };
  return token.value;
}

async function apiFetch(apiPath: string): Promise<unknown> {
  let auth = await getToken();
  let res = await fetch(`${API_BASE}${apiPath}`, {
    headers: { 'x-auth-token': auth, 'x-client-id': CLIENT_ID },
  });
  if (res.status === 401) {
    token = null; // token may have been revoked early — get a fresh one and retry once
    auth = await getToken();
    res = await fetch(`${API_BASE}${apiPath}`, {
      headers: { 'x-auth-token': auth, 'x-client-id': CLIENT_ID },
    });
  }
  if (!res.ok) {
    throw new Error(`Quran API request failed (${apiPath}): ${res.status}`);
  }
  return res.json();
}

const getCache = db.prepare('SELECT payload, fetched_at FROM quran_cache WHERE cache_key = ?');
const putCache = db.prepare(
  'INSERT OR REPLACE INTO quran_cache (cache_key, payload, fetched_at) VALUES (?, ?, ?)'
);

// Moderate TTL: after this age we try to refresh, but a cached entry is only
// ever replaced by newer data from a successful fetch — never deleted. If the
// upstream API is down or rate-limiting, the stale copy keeps being served.
const JSON_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Fetch an API path with a SQLite cache (7-day refresh, stale served on failure). */
export async function cachedFetch(apiPath: string): Promise<unknown> {
  const hit = getCache.get(apiPath) as { payload: string; fetched_at: string } | undefined;
  if (hit) {
    const age = Date.now() - Date.parse(hit.fetched_at);
    if (!(age > JSON_TTL_MS)) return JSON.parse(hit.payload);
    try {
      const fresh = await apiFetch(apiPath);
      putCache.run(apiPath, JSON.stringify(fresh), new Date().toISOString());
      return fresh;
    } catch {
      return JSON.parse(hit.payload); // refresh failed — keep serving the cached copy
    }
  }
  const data = await apiFetch(apiPath);
  putCache.run(apiPath, JSON.stringify(data), new Date().toISOString());
  return data;
}

interface VersePage {
  verses: unknown[];
  pagination?: { total_pages?: number; next_page?: number | null };
}

/** Fetch every page of a paginated verses endpoint and merge. */
export async function fetchAllVersePages(basePath: string): Promise<unknown[]> {
  const all: unknown[] = [];
  let page = 1;
  for (;;) {
    const data = (await cachedFetch(`${basePath}&page=${page}`)) as VersePage;
    all.push(...(data.verses ?? []));
    const totalPages = data.pagination?.total_pages ?? 1;
    if (page >= totalPages) break;
    page += 1;
    if (page > 20) break; // safety: longest surah fits in 6 pages of 50
  }
  return all;
}

export function hasCredentials(): boolean {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}
