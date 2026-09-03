import { useEffect, useRef, useState } from 'react';

const leftWords = ['Smile', 'Implants', 'Whitening', 'Aligners'];
const rightWords = ['Clean', 'Care', 'Dental', 'Skin'];


function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const Services = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const updateProgress = () => {
      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const windowHeight = window.innerHeight;
      const nextProgress = clamp(-rect.top / (sectionHeight - windowHeight), 0, 1);
      setProgress(nextProgress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scaleFactor = mobile ? 0.5 : 1;

  const leftOffsets = leftWords.map((_, index) => -(60 + index * 40) * scaleFactor * (1 - progress));
  const rightOffsets = rightWords.map((_, index) => +(60 + index * 40) * scaleFactor * (1 - progress));
  const opacity = 0.35 + progress * 0.65;

  return (
    <section ref={sectionRef} id="services" className="services-section">
      <img
        className="services-character"
        src="center-character.png"
        alt="3D dental character"
      />

      <div className="services-sticky">
        <div className="specialties-title-wrap" aria-label="specialties heading">
          <h1 className="specialties specialties-back">Specialties</h1>
          <h1 className="specialties specialties-layer-1">Specialties</h1>
          <h1 className="specialties specialties-layer-2">Specialties</h1>
          <h1 className="specialties specialties-layer-3">Specialties</h1>
          <h1 className="specialties specialties-front">Specialties</h1>
        </div>

        <div className="side-columns" aria-hidden="true">
          <div className="side-column left-column">
            {leftWords.map((word, index) => (
              <span
                key={word}
                className="side-word"
                style={{
                  transform: `translateX(${leftOffsets[index]}px)`,
                  opacity,
                }}
              >
                {word}
              </span>
            ))}
          </div>

          <div className="side-column right-column">
            {rightWords.map((word, index) => (
              <span
                key={word}
                className="side-word"
                style={{
                  transform: `translateX(${rightOffsets[index]}px)`,
                  opacity,
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services