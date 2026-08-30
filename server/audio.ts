// Permanent on-disk cache for recitation audio. Files are downloaded from the
// Quran CDNs once and kept forever under DATA_DIR/audio/ (they never change,
// and keeping them locally avoids CDN rate limits and works offline).
import fs from 'node:fs';
import path from 'node:path';

const AUDIO_BASES = {
  verse: 'https://verses.quran.com/',
  word: 'https://audio.qurancdn.com/',
} as const;

export type AudioKind = keyof typeof AUDIO_BASES;

export function isAudioKind(v: string): v is AudioKind {
  return v in AUDIO_BASES;
}

export function cdnUrl(kind: AudioKind, rel: string): string {
  return AUDIO_BASES[kind] + rel;
}

const dataDir = process.env.DATA_DIR || './data';
const audioDir = path.resolve(dataDir, 'audio');

export function isSafeAudioPath(rel: string): boolean {
  return /^[\w\-./]+$/.test(rel) && !rel.split('/').includes('..') && !rel.startsWith('/');
}

// Dedupe concurrent downloads of the same file
const inflight = new Map<string, Promise<string>>();

/** Return the local path for an audio file, downloading it first if needed. */
export async function ensureAudioFile(kind: AudioKind, rel: string): Promise<string> {
  const kindDir = path.resolve(audioDir, kind);
  const localPath = path.resolve(kindDir, rel);
  if (!localPath.startsWith(kindDir + path.sep)) throw new Error('bad audio path');
  if (fs.existsSync(localPath)) return localPath;

  const key = `${kind}/${rel}`;
  let pending = inflight.get(key);
  if (!pending) {
    pending = (async () => {
      const res = await fetch(cdnUrl(kind, rel));
      if (!res.ok) throw new Error(`audio download failed (${key}): ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      // Write via temp file + rename so a crashed download never leaves a
      // truncated file that would then be served forever.
      const tmp = `${localPath}.${process.pid}.${Date.now()}.tmp`;
      fs.writeFileSync(tmp, buf);
      fs.renameSync(tmp, localPath);
      return localPath;
    })().finally(() => inflight.delete(key));
    inflight.set(key, pending);
  }
  return pending;
}
