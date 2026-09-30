declare const __TOTAL_FRAMES__: number;

export const TOTAL_FRAMES = __TOTAL_FRAMES__;
export const INTRO_FRAMES = Math.min(220, TOTAL_FRAMES);

const MAX_CONCURRENT = 6;
const MAX_ATTEMPTS = 2;

export const framePath = (i: number) =>
  `/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.webp`;

const cache = new Map<number, HTMLImageElement>();
const inflight = new Map<number, Promise<HTMLImageElement | null>>();
const attempts = new Map<number, number>();
let wanted: number[] = [];
let active = 0;

export const getFrame = (i: number) => cache.get(i);
export const hasFrame = (i: number) => cache.has(i);
export const isFailed = (i: number) => (attempts.get(i) ?? 0) >= MAX_ATTEMPTS;

export function loadFrame(i: number): Promise<HTMLImageElement | null> {
  const hit = cache.get(i);
  if (hit) return Promise.resolve(hit);
  const existing = inflight.get(i);
  if (existing) return existing;

  const img = new Image();
  img.decoding = 'async';
  const p = new Promise<HTMLImageElement | null>((resolve) => {
    img.onload = () => {
      const done = () => {
        cache.set(i, img);
        resolve(img);
      };
      if (img.decode) img.decode().then(done, done);
      else done();
    };
    img.onerror = () => {
      attempts.set(i, (attempts.get(i) ?? 0) + 1);
      resolve(null);
    };
    img.src = framePath(i);
  }).finally(() => inflight.delete(i));

  inflight.set(i, p);
  return p;
}

function pump() {
  while (active < MAX_CONCURRENT && wanted.length) {
    const i = wanted.shift()!;
    if (cache.has(i) || inflight.has(i) || isFailed(i)) continue;
    active += 1;
    void loadFrame(i).finally(() => {
      active -= 1;
      pump();
    });
  }
}

/** Replaces the queue: nearest-first list, stale requests are dropped. */
export function requestFrames(indices: number[]) {
  wanted = indices;
  pump();
}

export function evictOutside(start: number, end: number) {
  for (const k of cache.keys()) if (k < start || k > end) cache.delete(k);
}

export function clearFrames() {
  wanted = [];
  cache.clear();
}

/** Downloads bytes into the HTTP cache only (no decoded image is retained). */
export async function warmFrames(
  indices: number[],
  concurrency: number,
  shouldStop: () => boolean,
  onEach?: () => void,
) {
  let next = 0;
  const warmOne = (i: number) =>
    new Promise<void>((resolve) => {
      const img = new Image();
      img.setAttribute('fetchpriority', 'low');
      img.onload = () => resolve();
      img.onerror = () => resolve();
      img.src = framePath(i);
    });

  const worker = async () => {
    while (next < indices.length && !shouldStop()) {
      await warmOne(indices[next++]);
      onEach?.();
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, indices.length) }, worker));
}