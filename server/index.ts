import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { api } from './routes/api.js';
import { quran } from './routes/quran.js';
import { tutor } from './routes/tutor.js';

const app = express();
app.use(express.json({ limit: '20mb' }));

app.use('/api/quran', quran);
app.use('/api/tutor', tutor);
app.use('/api', api);

// Serve the built frontend (dist/) with SPA fallback
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

// JSON error handler
app.use(
  (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err.message);
    res.status(502).json({ error: err.message });
  }
);

const port = Number(process.env.PORT || 3026);
app.listen(port, () => {
  console.log(`learn-arabic server listening on http://localhost:${port}`);
});
