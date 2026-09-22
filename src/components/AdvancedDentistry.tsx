import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare const __TOTAL_FRAMES__: number;

const TOTAL_FRAMES = __TOTAL_FRAMES__;
const INITIAL_FRAMES = 150;
const CACHE_RADIUS = 120;
const PREFETCH_AHEAD = 60;

// Intro playback speed. By the time the intro starts, Preloader.tsx has
// already loaded these frames into the browser's HTTP cache, so the loop is
// timer-bound rather than network-bound — raising FPS and/or the step both
// directly cut how long the intro takes.
//   INTRO_FPS: higher = each frame shown for less time.
//   INTRO_FRAME_STEP: 1 = show every frame, 2 = every other frame (roughly
//     halves total intro time for the same FPS), 3 = every third, etc.
const INTRO_FPS = 30;
const INTRO_FRAME_STEP = 1;

// Keys that would otherwise scroll the page (Space, arrows, Page Up/Down,
// Home, End) — blocked while the intro is playing so keyboard users can't
// skip past it either.
const SCROLL_KEYS = new Set([
  ' ',
  'Spacebar',
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
]);

type FrameImage = HTMLImageElement;

function framePath(index: number) {
  return `/frames/ezgif-frame-${String(index + 1).padStart(3, '0')}.png`;
}

function loadFrame(
  index: number,
  cache: Map<number, FrameImage>,
  pending: Map<number, Promise<FrameImage>>,
) {
  const cached = cache.get(index);
  if (cached) return Promise.resolve(cached);
  const existingRequest = pending.get(index);
  if (existingRequest) return existingRequest;

  const image = new Image();
  image.decoding = 'async';
  image.src = framePath(index);
  const request = (image.decode?.() ?? Promise.resolve()).then(() => {
    cache.set(index, image);
    pending.delete(index);
    return image;
  }).catch((error: unknown) => {
    pending.delete(index);
    throw error;
  });

  pending.set(index, request);
  return request;
}

export default function AdvancedDentistry() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<number, FrameImage>>(new Map());
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (!section || !track || !canvas) return;

    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    let destroyed = false;
    let scrollDirection = 1;
    let lastProgress = 0;
    let targetFrame = 0;
    let displayFrame = 0;
    let animationFrameId = 0;
    let isIntroPlaying = true;
    const cache = cacheRef.current;
    const pending = new Map<number, Promise<FrameImage>>();

    // ─── Scroll lock while the intro plays ───────────────────────────────────
    // We lock the page (rather than just cancelling the intro on interaction)
    // so the user can't scroll, wheel, touch, or key their way past it.
    let scrollLocked = false;
    let lockedScrollY = 0;
    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPosition = document.body.style.position;
    const previousBodyTop = document.body.style.top;
    const previousBodyWidth = document.body.style.width;

    const lockScroll = () => {
      if (scrollLocked) return;
      scrollLocked = true;
      lockedScrollY = window.scrollY;
      // Fixed-position lock (not just overflow:hidden) so it also holds on
      // iOS Safari, which otherwise still allows rubber-band scrolling.
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockedScrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    };

    const unlockScroll = () => {
      if (!scrollLocked) return;
      scrollLocked = false;
      document.body.style.position = previousBodyPosition;
      document.body.style.top = previousBodyTop;
      document.body.style.width = previousBodyWidth;
      document.body.style.overflow = previousBodyOverflow;
      window.scrollTo(0, lockedScrollY);
    };

    const drawFrame = (index: number) => {
      const image = cache.get(index);
      if (!image || destroyed) return;

      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;

      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.clearRect(0, 0, width, height);
      context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    // Requests a frame into memory cache (never draws directly to avoid race conditions)
    const requestFrame = (index: number) => {
      if (index < 0 || index >= TOTAL_FRAMES) return;
      void loadFrame(index, cache, pending).catch(() => undefined);
    };

    const maintainCache = (currentIndex: number) => {
      const start = Math.max(0, currentIndex - CACHE_RADIUS);
      const end = Math.min(TOTAL_FRAMES - 1, currentIndex + CACHE_RADIUS);

      for (let index = start; index <= end; index += 1) requestFrame(index);
      for (const index of cache.keys()) {
        if (index < start || index > end) cache.delete(index);
      }

      const prefetchStart = scrollDirection > 0 ? currentIndex + 1 : currentIndex - PREFETCH_AHEAD;
      const prefetchEnd = scrollDirection > 0 ? currentIndex + PREFETCH_AHEAD : currentIndex - 1;
      for (
        let index = prefetchStart;
        scrollDirection > 0 ? index <= prefetchEnd : index >= prefetchEnd;
        index += scrollDirection
      ) {
        if (index >= 0 && index < TOTAL_FRAMES) requestFrame(index);
      }
    };

    // Finds closest loaded frame to target to prevent frame jumps or blank canvases
    const getNearestCachedFrame = (idealIndex: number): number | null => {
      if (cache.has(idealIndex)) return idealIndex;
      const maxSearch = 20;
      for (let offset = 1; offset <= maxSearch; offset += 1) {
        const primary = idealIndex - scrollDirection * offset;
        if (primary >= 0 && primary < TOTAL_FRAMES && cache.has(primary)) return primary;
        const secondary = idealIndex + scrollDirection * offset;
        if (secondary >= 0 && secondary < TOTAL_FRAMES && cache.has(secondary)) return secondary;
      }
      return null;
    };

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * pixelRatio);
      canvas.height = Math.round(window.innerHeight * pixelRatio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      drawFrame(currentFrameRef.current);
    };

    // ─── Scroll-driven render loop ───────────────────────────────────────────
    const renderFrameLoop = () => {
      if (destroyed) return;

      if (!isIntroPlaying) {
        displayFrame += (targetFrame - displayFrame) * 0.42;

        const idealFrame = Math.round(displayFrame);
        const bestFrame = getNearestCachedFrame(idealFrame);

        if (bestFrame !== null && bestFrame !== currentFrameRef.current) {
          currentFrameRef.current = bestFrame;
          drawFrame(bestFrame);
        }

        if (!cache.has(idealFrame)) {
          requestFrame(idealFrame);
        }
      }

      animationFrameId = window.requestAnimationFrame(renderFrameLoop);
    };

    // ─── Intro: play frames 0–(INITIAL_FRAMES-1) like a smooth video ─────────
    const INTRO_MS = 1000 / INTRO_FPS;
    let introTimerId: ReturnType<typeof setTimeout> | null = null;

    const runIntro = async () => {
      resizeCanvas();
      lockScroll();

      for (let i = 0; i < INITIAL_FRAMES; i += INTRO_FRAME_STEP) {
        if (destroyed || !isIntroPlaying) break;

        await loadFrame(i, cache, pending).catch(() => undefined);
        if (destroyed || !isIntroPlaying) break;

        currentFrameRef.current = i;
        targetFrame = i;
        displayFrame = i;
        drawFrame(i);

        await new Promise<void>((resolve) => {
          introTimerId = setTimeout(resolve, INTRO_MS);
        });
      }

      if (destroyed) return;

      const lastIntroFrame = Math.min(INITIAL_FRAMES - 1, TOTAL_FRAMES - 1);
      if (isIntroPlaying) {
        targetFrame = lastIntroFrame;
        displayFrame = lastIntroFrame;
        currentFrameRef.current = lastIntroFrame;
        isIntroPlaying = false;
      }

      // Intro is done (or already ended) — hand control back to the user.
      unlockScroll();

      animationFrameId = window.requestAnimationFrame(renderFrameLoop);

      // Quietly prefetch remaining frames during idle time
      const prefetchRemaining = (startIndex: number) => {
        if (destroyed || startIndex >= TOTAL_FRAMES) return;

        const schedule =
          typeof window.requestIdleCallback === 'function'
            ? (cb: () => void) => window.requestIdleCallback(cb, { timeout: 2000 })
            : (cb: () => void) => window.requestAnimationFrame(cb);

        schedule(() => {
          const batchSize = 20;
          const end = Math.min(startIndex + batchSize, TOTAL_FRAMES);
          const loads: Promise<FrameImage | void>[] = [];
          for (let i = startIndex; i < end; i++) {
            if (!cache.has(i)) loads.push(loadFrame(i, cache, pending).catch(() => undefined));
          }
          void Promise.all(loads).then(() => prefetchRemaining(end));
        });
      };

      prefetchRemaining(INITIAL_FRAMES);
    };

    const textLayers = Array.from(section.querySelectorAll<HTMLElement>('[data-copy]'));

    const scrollTrigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      pin: '[data-pinned-stage]',
      onUpdate: (self) => {
        // While the intro is playing (and scroll is locked) the page can't
        // actually move, so there's nothing meaningful to scrub here yet.
        if (isIntroPlaying) return;

        const trackBounds = track.getBoundingClientRect();
        const scrollableDistance = track.offsetHeight - window.innerHeight;
        const progress = scrollableDistance > 0
          ? Math.min(1, Math.max(0, -trackBounds.top / scrollableDistance))
          : self.progress;

        scrollDirection = progress >= lastProgress ? 1 : -1;
        lastProgress = progress;

        textLayers.forEach((layer) => {
          const from = Number(layer.dataset.from);
          const to = Number(layer.dataset.to);
          const visible = progress >= from && progress <= to;
          gsap.to(layer, { autoAlpha: visible ? 1 : 0, duration: 0.6, ease: 'power2.out', overwrite: true });
        });

        const frameIndex = INITIAL_FRAMES + progress * (TOTAL_FRAMES - 1 - INITIAL_FRAMES);
        const safeFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, frameIndex));
        targetFrame = safeFrame;
        maintainCache(Math.round(safeFrame));
      },
    });
    scrollTrigger.update();

    // Start the intro only when the preloader signals it has reached 100%
    // and its exit animation has begun. This keeps the canvas dark while the
    // loading screen is still visible.
    let preloaderReadyListener: (() => void) | null = null;

    const startWhenReady = () => {
      if (window.__preloaderReady) {
        // Event already fired before we got here (race condition).
        void runIntro();
      } else {
        preloaderReadyListener = () => { void runIntro(); };
        window.addEventListener('preloader:ready', preloaderReadyListener, { once: true });
      }
    };

    // While the intro is playing, these block the interaction outright
    // (preventDefault) instead of cancelling the intro. Once isIntroPlaying
    // is false, they're no-ops and native scrolling behaves normally.
    const blockWheel = (event: WheelEvent) => {
      if (isIntroPlaying) event.preventDefault();
    };

    const blockTouchMove = (event: TouchEvent) => {
      if (isIntroPlaying) event.preventDefault();
    };

    const blockScrollKeys = (event: KeyboardEvent) => {
      if (isIntroPlaying && SCROLL_KEYS.has(event.key)) {
        event.preventDefault();
      }
    };

    startWhenReady();
    window.addEventListener('resize', resizeCanvas);
    // passive: false is required so preventDefault() actually blocks the scroll.
    window.addEventListener('wheel', blockWheel, { passive: false });
    window.addEventListener('touchmove', blockTouchMove, { passive: false });
    window.addEventListener('keydown', blockScrollKeys);

    return () => {
      destroyed = true;
      if (introTimerId !== null) clearTimeout(introTimerId);
      if (preloaderReadyListener) {
        window.removeEventListener('preloader:ready', preloaderReadyListener);
      }
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('wheel', blockWheel);
      window.removeEventListener('touchmove', blockTouchMove);
      window.removeEventListener('keydown', blockScrollKeys);
      unlockScroll();
      scrollTrigger.kill();
      cache.clear();
      pending.clear();
    };
  }, []);

  return (
    <section ref={sectionRef} className="advanced-dentistry" aria-labelledby="advanced-dentistry-title">
      <div ref={trackRef} className="advanced-dentistry__track">
        <div data-pinned-stage className="advanced-dentistry__stage">
          <canvas ref={canvasRef} className="advanced-dentistry__canvas" aria-hidden="true" />
          <div className="advanced-dentistry__copy">
            <p id="advanced-dentistry-title" data-copy data-from="0.95" data-to="1" className="feature-title">
              Restore Your True Smile
            </p>
            <p data-copy data-from="0.95" data-to="1" className="feature-copy">
              Using advanced technology, we deliver comprehensive treatments for a healthy, confident smile.
            </p>
            <p data-copy data-from="0.95" data-to="1" className="feature-tags">
              <span className="feature-tag">Smile Design</span>
              <span className="feature-tag">Dental Implants</span>
              <span className="feature-tag">Teeth Whitening</span>
            </p>
            <div data-copy data-from="0.95" data-to="1" className="feature-proof" aria-label="More than 2k patients">
              <div className="feature-proof__avatars" aria-hidden="true">
                <span className="feature-avatar avatar-one"></span><span className="feature-avatar avatar-two"></span><span className="feature-avatar avatar-three"></span>
              </div>
              <span className="feature-proof__count">+2k</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}