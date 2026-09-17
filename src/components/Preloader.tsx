import { useEffect, useState } from 'react';

declare const __TOTAL_FRAMES__: number;

const TOTAL_FRAMES = __TOTAL_FRAMES__;
const FRAME_LOAD_CONCURRENCY = 6;
const VIDEO_SRC = '/hero-video-2.mp4';

function loadFrame(index: number) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => resolve();
    image.onload = () => {
      if (image.decode) {
        void image.decode().catch(() => undefined).finally(finish);
      } else {
        finish();
      }
    };
    image.onerror = finish;
    image.src = `/frames/frame_${String(index + 1).padStart(4, '0')}.jpg`;
  });
}

async function loadAllFrames() {
  let nextIndex = 0;

  const loadWorker = async () => {
    while (nextIndex < TOTAL_FRAMES) {
      const index = nextIndex;
      nextIndex += 1;
      await loadFrame(index);
    }
  };

  await Promise.all(
    Array.from(
      { length: Math.min(FRAME_LOAD_CONCURRENCY, TOTAL_FRAMES) },
      () => loadWorker(),
    ),
  );
}

function loadHeroVideo() {
  return new Promise<void>((resolve) => {
    const video = document.createElement('video');
    const finish = () => resolve();
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;
    video.addEventListener('canplaythrough', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    video.src = VIDEO_SRC;
    video.load();
  });
}

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let removeTimer: number | undefined;

    const hide = () => {
      const remaining = Math.max(0, 850 - (performance.now() - startedAt));
      window.setTimeout(() => {
        setIsLeaving(true);
        removeTimer = window.setTimeout(() => setIsVisible(false), 650);
      }, remaining);
    };

    void Promise.all([loadHeroVideo(), loadAllFrames()]).then(hide);

    return () => {
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`site-preloader ${isLeaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading Hamdard Dental">
      <div className="site-preloader__card" aria-hidden="true">
        <div className="site-preloader__tooth">
          <span className="site-preloader__tooth-core" />
        </div>
        <div className="site-preloader__text-wrap">
          <span className="site-preloader__brand">Hamdard</span>
          <small className="site-preloader__sub">Dental &amp; Skin Clinic</small>
        </div>
      </div>

      <div className="site-preloader__bar" aria-hidden="true">
        <span className="site-preloader__bar-fill" />
      </div>
    </div>
  );
}
