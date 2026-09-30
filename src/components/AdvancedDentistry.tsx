import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TOTAL_FRAMES,
  INTRO_FRAMES,
  getFrame,
  hasFrame,
  isFailed,
  loadFrame,
  requestFrames,
  evictOutside,
  clearFrames,
  warmFrames,
} from "./frameStore";

gsap.registerPlugin(ScrollTrigger);

const LAST_INTRO = INTRO_FRAMES - 1;
const INTRO_FPS = 60;
const INTRO_PREBUFFER = 40;
const INTRO_STALL_LIMIT = 4000;
const AHEAD = 48; // decoded frames kept in scroll direction
const BEHIND = 12; // decoded frames kept behind
// Like CSS object-position: 0 = left/top, 0.5 = center, 1 = right/bottom.
const FOCAL_DESKTOP = { x: 0.5, y: 0.5 };
const FOCAL_MOBILE = { x: 0.75, y: 0.5 }; // change x/y if the subject sits off-center

const SCROLL_KEYS = new Set([
  " ",
  "Spacebar",
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
]);
const sleep = (ms: number) =>
  new Promise<void>((r) => window.setTimeout(r, ms));

export default function AdvancedDentistry() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (!section || !track || !canvas) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;

    let destroyed = false;
    let isIntroPlaying = true;
    let dir: 1 | -1 = 1;
    let lastProgress = 0;
    let targetFrame = 0;
    let displayFrame = 0;
    let introRaf = 0;
    let loopRaf = 0;
    let looping = false;

    // ─── Scroll lock (overflow based, keeps layout/scroll height intact) ───
    const root = document.documentElement;
    const prevRoot = root.style.overflow;
    const prevBody = document.body.style.overflow;
    const lockScroll = () => {
      root.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };
    const unlockScroll = () => {
      root.style.overflow = prevRoot;
      document.body.style.overflow = prevBody;
    };

    // ─── Drawing ───
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const drawFrame = (index: number) => {
      const image = getFrame(index);
      if (!image || destroyed) return;

      const w = window.innerWidth;
      const h = window.innerHeight;
      const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      const dw = image.naturalWidth * scale;
      const dh = image.naturalHeight * scale;

      const focal = mobileQuery.matches ? FOCAL_MOBILE : FOCAL_DESKTOP;
      const x = (w - dw) * focal.x;
      const y = (h - dh) * focal.y;

      context.clearRect(0, 0, w, h);
      context.drawImage(image, x, y, dw, dh);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      // Setting canvas.width resets context state, so re-apply everything here.
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      drawFrame(currentFrameRef.current);
    };

    // ─── Frame window: nearest first, in scroll direction ───
    const planWindow = (center: number) => {
      const c = Math.round(center);
      const list: number[] = [];
      for (let d = 0; d <= AHEAD; d++) {
        const a = c + dir * d;
        if (a >= 0 && a < TOTAL_FRAMES) list.push(a);
        if (d > 0 && d <= BEHIND) {
          const b = c - dir * d;
          if (b >= 0 && b < TOTAL_FRAMES) list.push(b);
        }
      }
      requestFrames(list);
      const a = c + dir * (AHEAD + 8);
      const b = c - dir * (BEHIND + 8);
      evictOutside(Math.min(a, b), Math.max(a, b));
    };

    const nearestCached = (ideal: number): number | null => {
      if (hasFrame(ideal)) return ideal;
      for (let o = 1; o <= 20; o++) {
        const p = ideal - dir * o;
        if (p >= 0 && p < TOTAL_FRAMES && hasFrame(p)) return p;
        const s = ideal + dir * o;
        if (s >= 0 && s < TOTAL_FRAMES && hasFrame(s)) return s;
      }
      return null;
    };

    // ─── Scroll render loop (stops itself when settled) ───
    const loop = () => {
      if (destroyed) return;
      displayFrame += (targetFrame - displayFrame) * 0.35;
      if (Math.abs(targetFrame - displayFrame) < 0.05)
        displayFrame = targetFrame;

      const ideal = Math.round(displayFrame);
      const best = nearestCached(ideal);
      if (best !== null && best !== currentFrameRef.current) {
        currentFrameRef.current = best;
        drawFrame(best);
      }

      if (displayFrame === targetFrame && best === ideal) {
        looping = false;
        return;
      }
      loopRaf = window.requestAnimationFrame(loop);
    };
    const kick = () => {
      if (looping || isIntroPlaying || destroyed) return;
      looping = true;
      loopRaf = window.requestAnimationFrame(loop);
    };

    // ─── Intro ───
    const INTRO_INTERVAL = 1000 / INTRO_FPS;

    const finishIntro = () => {
      if (destroyed || !isIntroPlaying) return;
      window.cancelAnimationFrame(introRaf);
      isIntroPlaying = false;
      targetFrame = LAST_INTRO;
      displayFrame = LAST_INTRO;
      currentFrameRef.current = -1; // force redraw of the last intro frame
      dir = 1;
      unlockScroll();
      ScrollTrigger.refresh();
      // Tell the rest of the site the intro is over (navbar listens to this).
      window.__introFinished = true;
      window.dispatchEvent(new CustomEvent("intro:finished"));

      planWindow(LAST_INTRO);
      kick();

      // Warm HTTP cache (bytes only) for the rest, low priority, 2 at a time.
      const rest = Array.from(
        { length: TOTAL_FRAMES - INTRO_FRAMES },
        (_, i) => INTRO_FRAMES + i,
      );
      void warmFrames(rest, 2, () => destroyed);
    };

    const runIntro = async () => {
      window.scrollTo(0, 0);
      resizeCanvas();
      lockScroll();

      const order = Array.from({ length: INTRO_FRAMES }, (_, i) => i);
      const prebuffer = Math.min(INTRO_PREBUFFER, INTRO_FRAMES);
      await Promise.race([
        Promise.all(order.slice(0, prebuffer).map(loadFrame)),
        sleep(5000),
      ]);
      if (destroyed || !isIntroPlaying) return;
      requestFrames(order.slice(prebuffer));

      let introFrame = 0;
      let lastTick = -1;
      let stallSince = -1;

      const tick = (now: DOMHighResTimeStamp) => {
        if (destroyed || !isIntroPlaying) return;
        if (lastTick < 0) lastTick = now;
        const elapsed = now - lastTick;

        if (elapsed >= INTRO_INTERVAL) {
          const next = introFrame + 1;
          if (next > LAST_INTRO) return finishIntro();

          if (!hasFrame(next) && !isFailed(next)) {
            if (stallSince < 0) stallSince = now;
            if (now - stallSince > INTRO_STALL_LIMIT) return finishIntro();
            introRaf = window.requestAnimationFrame(tick);
            return;
          }
          stallSince = -1;
          lastTick = now - (elapsed % INTRO_INTERVAL);

          introFrame = next;
          if (hasFrame(next)) {
            currentFrameRef.current = next;
            drawFrame(next);
          }
          targetFrame = displayFrame = introFrame;
          evictOutside(introFrame - 2, TOTAL_FRAMES); // free frames already played

          if (introFrame >= LAST_INTRO) return finishIntro();
        }
        introRaf = window.requestAnimationFrame(tick);
      };

      drawFrame(0);
      introRaf = window.requestAnimationFrame(tick);
    };

    // ─── ScrollTrigger ───
    const textLayers = Array.from(
      section.querySelectorAll<HTMLElement>("[data-copy]"),
    );
    const layerVisible = new Map<HTMLElement, boolean>();

    const scrollTrigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      pin: "[data-pinned-stage]",
      pinSpacing: false, // track already provides the scroll distance
      onUpdate: (self) => {
        if (isIntroPlaying) return;
        const progress = self.progress;
        if (progress !== lastProgress) dir = progress > lastProgress ? 1 : -1;
        lastProgress = progress;

        textLayers.forEach((layer) => {
          const from = Number(layer.dataset.from);
          const to = Number(layer.dataset.to);
          const visible = progress >= from && progress <= to;
          if (layerVisible.get(layer) === visible) return;
          layerVisible.set(layer, visible);
          gsap.to(layer, {
            autoAlpha: visible ? 1 : 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          });
        });

        targetFrame = LAST_INTRO + progress * (TOTAL_FRAMES - 1 - LAST_INTRO);
        planWindow(targetFrame);
        kick();
      },
    });

    // ─── Start when preloader is done ───
    let preloaderListener: (() => void) | null = null;
    if (window.__preloaderReady) {
      void runIntro();
    } else {
      preloaderListener = () => void runIntro();
      window.addEventListener("preloader:ready", preloaderListener, {
        once: true,
      });
    }

    const blockWheel = (e: WheelEvent) => {
      if (isIntroPlaying) e.preventDefault();
    };
    const blockTouch = (e: TouchEvent) => {
      if (isIntroPlaying) e.preventDefault();
    };
    const blockKeys = (e: KeyboardEvent) => {
      if (isIntroPlaying && SCROLL_KEYS.has(e.key)) e.preventDefault();
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("wheel", blockWheel, { passive: false });
    window.addEventListener("touchmove", blockTouch, { passive: false });
    window.addEventListener("keydown", blockKeys);

    return () => {
      destroyed = true;
      if (preloaderListener)
        window.removeEventListener("preloader:ready", preloaderListener);
      window.cancelAnimationFrame(introRaf);
      window.cancelAnimationFrame(loopRaf);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("wheel", blockWheel);
      window.removeEventListener("touchmove", blockTouch);
      window.removeEventListener("keydown", blockKeys);
      unlockScroll();
      scrollTrigger.kill();
      clearFrames();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="advanced-dentistry"
      aria-labelledby="advanced-dentistry-title"
    >
      <div ref={trackRef} className="advanced-dentistry__track">
        <div data-pinned-stage className="advanced-dentistry__stage">
          <canvas
            ref={canvasRef}
            className="advanced-dentistry__canvas"
            aria-hidden="true"
          />
          <div className="advanced-dentistry__copy">
            <p
              id="advanced-dentistry-title"
              data-copy
              data-from="0.95"
              data-to="1"
              className="feature-title"
            >
              Restore Your True Smile
            </p>
            <p data-copy data-from="0.95" data-to="1" className="feature-copy">
              Using advanced technology, we deliver comprehensive treatments for
              a healthy, confident smile.
            </p>
            <p data-copy data-from="0.95" data-to="1" className="feature-tags">
              <span className="feature-tag">Smile Design</span>
              <span className="feature-tag">Dental Implants</span>
              <span className="feature-tag">Teeth Whitening</span>
            </p>
            <div
              data-copy
              data-from="0.95"
              data-to="1"
              className="feature-proof"
              aria-label="More than 2k patients"
            >
              <div className="feature-proof__avatars" aria-hidden="true">
                <span className="feature-avatar avatar-one"></span>
                <span className="feature-avatar avatar-two"></span>
                <span className="feature-avatar avatar-three"></span>
              </div>
              <span className="feature-proof__count">+2k</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
