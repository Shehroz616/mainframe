import { useEffect, useState } from 'react';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();
    let hideTimer: number | undefined;
    let removeTimer: number | undefined;

    const hide = () => {
      const remaining = Math.max(0, 850 - (performance.now() - startedAt));
      hideTimer = window.setTimeout(() => {
        setIsLeaving(true);
        removeTimer = window.setTimeout(() => setIsVisible(false), 650);
      }, remaining);
    };

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
      hideTimer = window.setTimeout(hide, 2200);
    }

    return () => {
      window.removeEventListener('load', hide);
      if (hideTimer) window.clearTimeout(hideTimer);
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
