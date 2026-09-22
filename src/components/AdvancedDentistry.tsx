import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare const __TOTAL_FRAMES__: number;

const TOTAL_FRAMES = __TOTAL_FRAMES__;
const INITIAL_FRAMES = 150;
const CACHE_RADIUS = 120;
const PREFETCH_AHEAD = 60;

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
    const INTRO_FPS = 52;
    const INTRO_MS = 1000 / INTRO_FPS;
    let introTimerId: ReturnType<typeof setTimeout> | null = null;

    const runIntro = async () => {
      resizeCanvas();

      for (let i = 0; i < INITIAL_FRAMES; i++) {
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

        // Hand off control to scroll if user scrolls while intro is active
        if (isIntroPlaying && progress > 0.005) {
          isIntroPlaying = false;
          if (introTimerId !== null) clearTimeout(introTimerId);
        }

        if (!isIntroPlaying) {
          const frameIndex = INITIAL_FRAMES + progress * (TOTAL_FRAMES - 1 - INITIAL_FRAMES);
          const safeFrame = Math.min(TOTAL_FRAMES - 1, Math.max(0, frameIndex));
          targetFrame = safeFrame;
          maintainCache(Math.round(safeFrame));
        }
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

    const handleUserInteraction = () => {
      if (isIntroPlaying) {
        isIntroPlaying = false;
        if (introTimerId !== null) clearTimeout(introTimerId);
      }
    };

    startWhenReady();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('wheel', handleUserInteraction, { passive: true });
    window.addEventListener('touchmove', handleUserInteraction, { passive: true });
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      destroyed = true;
      if (introTimerId !== null) clearTimeout(introTimerId);
      if (preloaderReadyListener) {
        window.removeEventListener('preloader:ready', preloaderReadyListener);
      }
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
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