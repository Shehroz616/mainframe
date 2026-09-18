import { useEffect, useState } from 'react';

declare const __TOTAL_FRAMES__: number;

const TOTAL_FRAMES = __TOTAL_FRAMES__;
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

// async function loadAllFrames() {
//   let nextIndex = 0;

//   const loadWorker = async () => {
//     while (nextIndex < TOTAL_FRAMES) {
//       const index = nextIndex;
//       nextIndex += 1;
//       await loadFrame(index);
//     }
//   };

//   await Promise.all(
//     Array.from(
//       { length: Math.min(FRAME_LOAD_CONCURRENCY, TOTAL_FRAMES) },
//       () => loadWorker(),
//     ),
//   );
// }

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
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    let removeTimer: number | undefined;

    const updateProgress = (loaded: number, total: number) => {
      const nextProgress = Math.min(100, Math.max(0, (loaded / total) * 100));
      setProgress(nextProgress);
    };

    const hide = () => {
      const remaining = Math.max(0, 850 - (performance.now() - startedAt));
      window.setTimeout(() => {
        setIsLeaving(true);
        removeTimer = window.setTimeout(() => setIsVisible(false), 650);
      }, remaining);
    };

    const loadTasks = async () => {
      let framesLoaded = 0;

      const trackFrameProgress = async () => {
        const total = TOTAL_FRAMES + 1;
        const tick = () => {
          framesLoaded += 1;
          updateProgress(framesLoaded, total);
        };

        for (let index = 0; index < TOTAL_FRAMES; index += 1) {
          await loadFrame(index);
          tick();
        }
      };

      await Promise.all([
        (async () => {
          await loadHeroVideo();
          updateProgress(1, TOTAL_FRAMES + 1);
        })(),
        trackFrameProgress(),
      ]);

      updateProgress(TOTAL_FRAMES + 1, TOTAL_FRAMES + 1);
      hide();
    };

    void loadTasks();

    return () => {
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`site-preloader ${isLeaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading Hamdard Dental">
      <div className="site-preloader__card" aria-hidden="true">
        <img src="/logo-blue.png" alt="Hamdard logo" className="site-preloader__logo" />
        <div className="site-preloader__text-wrap">
          <span className="site-preloader__brand">Hamdard</span>
          <small className="site-preloader__sub">Dental &amp; Skin Clinic</small>
        </div>
      </div>

      <div className="site-preloader__progress" aria-live="polite">
        <div className="site-preloader__bar" aria-hidden="true">
          <span className="site-preloader__bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="site-preloader__percent">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
