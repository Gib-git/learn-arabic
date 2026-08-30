import { Router } from 'express';
import { cachedFetch, fetchAllVersePages, hasCredentials } from '../quran.js';
import { cdnUrl, ensureAudioFile, isAudioKind, isSafeAudioPath } from '../audio.js';

export const quran = Router();

const V4 = '/content/api/v4';
// Recitation 7 = Mishari Rashid al-Afasy; translation 20 = Saheeh International
const RECITATION_ID = 7;
const TRANSLATION_ID = 20;

// Browser cache for the JSON endpoints below — moderate; the SQLite cache
// behind them refreshes on its own schedule.
const JSON_CACHE_HEADER = 'public, max-age=86400';

// Audio files: downloaded from the CDN once, then served from disk forever.
// Registered before the credentials guard — the CDN needs no API credentials.
quran.get('/audio-file/:kind/*', async (req, res) => {
  const { kind } = req.params;
  const rel = (req.params as Record<string, string>)[0] ?? '';
  if (!isAudioKind(kind) || !isSafeAudioPath(rel)) {
    res.status(400).json({ error: 'bad audio path' });
    return;
  }
  try {
    const file = await ensureAudioFile(kind, rel);
    res.set('Cache-Control', 'public, max-age=31536000, immutable');
    res.sendFile(file);
  } catch {
    // Download failed (offline CDN hiccup, etc.) — let the browser stream it directly
    res.redirect(302, cdnUrl(kind, rel));
  }
});

quran.use((_req, res, next) => {
  if (!hasCredentials()) {
    res.status(503).json({ error: 'Quran API credentials not configured (.env)' });
    return;
  }
  next();
});

quran.get('/chapters', async (_req, res, next) => {
  try {
    const data = (await cachedFetch(`${V4}/chapters?language=en`)) as { chapters: unknown[] };
    res.set('Cache-Control', JSON_CACHE_HEADER);
    res.json(data.chapters);
  } catch (e) {
    next(e);
  }
});

quran.get('/verses/:chapter', async (req, res, next) => {
  try {
    const ch = Number(req.params.chapter);
    if (!Number.isInteger(ch) || ch < 1 || ch > 114) {
      res.status(400).json({ error: 'chapter must be 1-114' });
      return;
    }
    const verses = await fetchAllVersePages(
      `${V4}/verses/by_chapter/${ch}?language=en&words=true&translations=${TRANSLATION_ID}` +
        `&fields=text_uthmani,text_uthmani_tajweed&word_fields=text_uthmani&per_page=50`
    );
    res.set('Cache-Control', JSON_CACHE_HEADER);
    res.json(verses);
  } catch (e) {
    next(e);
  }
});

quran.get('/audio/:chapter', async (req, res, next) => {
  try {
    const ch = Number(req.params.chapter);
    if (!Number.isInteger(ch) || ch < 1 || ch > 114) {
      res.status(400).json({ error: 'chapter must be 1-114' });
      return;
    }
    // Per-verse audio files for one reciter; paginated like verses
    const files: unknown[] = [];
    let page = 1;
    for (;;) {
      const data = (await cachedFetch(
        `${V4}/recitations/${RECITATION_ID}/by_chapter/${ch}?per_page=50&page=${page}`
      )) as { audio_files?: unknown[]; pagination?: { total_pages?: number } };
      files.push(...(data.audio_files ?? []));
      const totalPages = data.pagination?.total_pages ?? 1;
      if (page >= totalPages || page > 20) break;
      page += 1;
    }
    res.set('Cache-Control', JSON_CACHE_HEADER);
    res.json(files);
  } catch (e) {
    next(e);
  }
});
