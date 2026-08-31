import { useEffect, useRef } from 'react';

const SENSITIVITY = 0.8;
const VIDEO_SRC =
  'hero-video-2.mp4';

export function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const prevXRef = useRef<number | null>(null);
  const targetTimeRef = useRef(0);
  const seekingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const seekTo = (time: number) => {
      seekingRef.current = true;
      video.currentTime = time;
    };

    const handleSeeked = () => {
      // If the target has moved since we started this seek, chase it.
      if (Math.abs(targetTimeRef.current - video.currentTime) > 0.001) {
        seekTo(targetTimeRef.current);
      } else {
        seekingRef.current = false;
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      const currentX = event.clientX;
      if (prevXRef.current === null) {
        prevXRef.current = currentX;
        return;
      }

      const delta = currentX - prevXRef.current;
      prevXRef.current = currentX;

      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * duration;
      const nextTarget = clamp(
        (seekingRef.current ? targetTimeRef.current : video.currentTime) + timeOffset,
        0,
        duration
      );

      targetTimeRef.current = nextTarget;

      if (!seekingRef.current) {
        seekTo(nextTarget);
      }
    };

    video.addEventListener('seeked', handleSeeked);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      video.removeEventListener('seeked', handleSeeked);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src={VIDEO_SRC}
      muted
      playsInline
      preload="auto"
      className="fixed inset-0 z-0 h-full w-full object-cover"
      style={{ objectPosition: '70% center' }}
    />
  );
}
