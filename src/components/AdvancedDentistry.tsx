import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare const __TOTAL_FRAMES__: number;

const TOTAL_FRAMES = __TOTAL_FRAMES__;
const INITIAL_FRAMES = 40;
const CACHE_RADIUS = 60;
const PREFETCH_AHEAD = 15;

type FrameImage = HTMLImageElement;

function framePath(index: number) {
  return `/frames/frame_${String(index + 1).padStart(4, '0')}.jpg`;
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
    const cache = cacheRef.current;
    const pending = new Map<number, Promise<FrameImage>>();

    const drawFrame = (index: number) => {
      const image = cache.get(index);
      if (!image || destroyed) return;

      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(
        image,
        (width - drawWidth) / 2 * pixelRatio,
        (height - drawHeight) / 2 * pixelRatio,
        drawWidth * pixelRatio,
        drawHeight * pixelRatio,
      );
    };

    const requestFrame = (index: number) => {
      void loadFrame(index, cache, pending).then(() => {
        if (index === currentFrameRef.current) drawFrame(index);
      }).catch(() => undefined);
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
      for (let index = prefetchStart; scrollDirection > 0 ? index <= prefetchEnd : index >= prefetchEnd; index += scrollDirection) {
        if (index >= 0 && index < TOTAL_FRAMES) requestFrame(index);
      }
    };

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * pixelRatio;
      canvas.height = window.innerHeight * pixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      drawFrame(currentFrameRef.current);
    };

    const initialLoad = async () => {
      await Promise.all(Array.from({ length: INITIAL_FRAMES }, (_, index) => loadFrame(index, cache, pending)));
      if (destroyed) return;
      resizeCanvas();
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
        const frameIndex = 1 + Math.round(progress * (TOTAL_FRAMES - 1)) - 1;
        currentFrameRef.current = frameIndex;
        maintainCache(frameIndex);
        requestFrame(frameIndex);
        textLayers.forEach((layer) => {
          const from = Number(layer.dataset.from);
          const to = Number(layer.dataset.to);
          const visible = progress >= from && progress <= to;
          gsap.to(layer, { autoAlpha: visible ? 1 : 0, duration: 0.6, ease: 'power2.out', overwrite: true });
        });
      },
    });
    scrollTrigger.update();

    void initialLoad();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      destroyed = true;
      window.removeEventListener('resize', resizeCanvas);
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
            <p id="advanced-dentistry-title" data-copy data-from="0.15" data-to="0.80" className="feature-title">
              Restore Your True Smile
            </p>
            <p data-copy data-from="0.35" data-to="0.80" className="feature-copy">
              Using advanced technology, we deliver comprehensive treatments for a healthy, confident smile.
            </p>
            <p data-copy data-from="0.55" data-to="0.80" className="feature-tags">
              <span className="feature-tag">Smile Design</span>
              <span className="feature-tag">Dental Implants</span>
              <span className="feature-tag">Teeth Whitening</span>
            </p>
            <div data-copy data-from="0.70" data-to="0.80" className="feature-proof" aria-label="More than 2k patients">
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