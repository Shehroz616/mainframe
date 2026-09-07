import { useEffect, useState } from 'react';

const INITIAL_FRAMES = 40;
const VIDEO_SRC = '/hero-video-2.mp4';

function loadInitialFrame(index: number) {
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

    void Promise.all([
      loadHeroVideo(),
      ...Array.from({ length: INITIAL_FRAMES }, (_, index) => loadInitialFrame(index)),
    ]).then(hide);

    return () => {
      if (removeTimer) window.clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`site-preloader ${isLeaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading Hamdard Dental">
      <div className="site-preloader__mark" aria-hidden="true">
        <div className="site-preloader__tooth" />
        <span className="site-preloader__orbit site-preloader__orbit--one" />
        <span className="site-preloader__orbit site-preloader__orbit--two" />
      </div>
      <div className="site-preloader__label">
        <span>Hamdard</span>
        <small>Dental &amp; Skin Clinic</small>
      </div>
    </div>
  );
}
