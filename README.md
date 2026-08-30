# Quranic Arabic — personal learning platform

A self-hosted app that teaches Arabic from absolute zero to reading real Quran, built around
techniques with strong evidence in language-learning research:

- **25 lessons in 10 units** — alphabet → vowel marks → high-frequency vocabulary → the root
  system → grammar → reading complete surahs. Every lesson explains simply, defines each term
  and acronym on first use, and includes a history box for context.
- **Anki-style flashcards** — SM-2 (SuperMemo-2) spaced-repetition scheduling, with
  Again/Hard/Good/Easy grading and a daily new-card cap.
- **Practice quizzes** — auto-generated, interleaved across everything you've learned.
- **Quran Reader** — all 114 surahs from the Quran Foundation API (the service behind
  Quran.com): word-by-word meanings, transliteration, real recitation audio, and words tinted
  by how well you know them.
- **Stats** — GitHub-style study-time heatmap (active time only — idle/hidden tab excluded),
  streaks, deck maturity, review accuracy.
- **Audio** — browser Arabic text-to-speech by default; optional local OpenAI-compatible TTS
  server (e.g. Kokoro-FastAPI) in Settings.

Progress is stored server-side in SQLite (better-sqlite3), so it survives restarts and
rebuilds. Export/import a JSON backup from Settings.

## Run with Docker (recommended)

```bash
cp .env.example .env   # then fill in your Quran Foundation API credentials
docker compose up -d --build
```

Open **http://localhost:3026**. The SQLite database lives on the `learn-arabic-data` volume.

## Run for development

```bash
npm install
npm run dev
```

- Express API + static server: http://localhost:3026
- Vite dev server (hot reload): http://localhost:5173 (proxies `/api` to 3026)

Other scripts: `npm run build` (frontend build), `npm run typecheck`, `npm start` (production
server, serves `dist/` if present).

## Configuration (.env)

| Variable | Purpose |
| --- | --- |
| `QURAN_CLIENT_ID` / `QURAN_CLIENT_SECRET` | Quran Foundation API OAuth2 credentials (server-side only, never sent to the browser) |
| `QURAN_OAUTH_BASE` / `QURAN_API_BASE` | API endpoints (defaults: production) |
| `PORT` | Server port (default 3026) |
| `DATA_DIR` | Where the SQLite file is stored (default `./data`) |

Quran API responses are cached in SQLite after first fetch, so the Reader keeps working
offline afterwards; the six short surahs used in lessons are also bundled as a fallback.
