import { useEffect, useState } from 'react';
import { useTypewriter } from '../hooks/useTypewriter';
import {BackgroundVideo} from '../components/BackgroundVideo';
const PILL_LABELS = [
  'Teeth Whitening',
  'Dental Implants',
  'Smile Design',
  'Skin Care',
];

const PHONE = '+92 300 1234567';

function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1" />
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Hero() {
  const { displayed, done } = useTypewriter(
    'Gentle, modern dental care designed to brighten your smile and restore your confidence.'
  );
  const [pillsVisible, setPillsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setPillsVisible(true), 400);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <section className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-12 sm:px-8 md:justify-center md:px-10 md:pb-0">
      <BackgroundVideo />
      <div className="relative z-10 max-w-2xl">
        <p
          className="pointer-events-none mb-5 select-none sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 28px)',
            lineHeight: 1.3,
            fontWeight: 600,
            color: '#000',
            filter: 'blur(2px)',
          }}
        >
          Hamdard Dental &amp; Skin Clinic
        </p>

        <p
          className="mb-5 text-black sm:mb-6"
          style={{
            fontSize: 'clamp(24px, 5vw, 62px)',
            lineHeight: 1.05,
            fontWeight: 800,
            letterSpacing: '-0.06em',
            minHeight: '54px',
          }}
        >
          Smile brighter with confident, healthy care.
        </p>

        <p
          className="mb-5 text-black sm:mb-6"
          style={{
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: '54px',
          }}
        >
          {displayed}
          {!done && (
            <span
              className="typewriter-cursor ml-[2px] inline-block h-[1.1em] w-[2px] align-middle bg-black"
              aria-hidden="true"
            />
          )}
        </p>

        <div
          className="flex flex-wrap gap-y-1 transition-[opacity,transform] duration-[400ms] ease-out"
          style={{
            opacity: pillsVisible ? 1 : 0,
            transform: pillsVisible ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          {PILL_LABELS.map((label) => (
            <a
              key={label}
              href="#"
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-[0.3em] text-[13px] text-black transition-colors duration-200 hover:bg-black hover:text-white sm:px-5 sm:text-[15px]"
            >
              {label}
            </a>
          ))}

          <a
            href="tel:+923001234567"
            className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white bg-transparent px-4 py-[0.3em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
          >
            <span>
              Call us: <span className="underline underline-offset-1">{PHONE}</span>
            </span>
            <CopyIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
