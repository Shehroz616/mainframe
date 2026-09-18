import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    return () => window.removeEventListener('scroll', updateScrollState);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-all duration-500 ${
          isScrolled ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'
        }`}
      >
        <div
          className={`flex w-[min(92vw,1200px)] items-center justify-between rounded-full border border-black/5 bg-white/75 px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,0.10)] backdrop-blur-xl transition-all duration-500 md:px-6 ${
            isScrolled ? 'shadow-[0_18px_45px_rgba(11,26,36,0.16)]' : ''
          }`}
        >
          <a href="#top" aria-label="Hamdard home" className="flex items-center gap-3">
            <img src="logo-blue.png" alt="Hamdard logo" className="h-12 w-auto md:h-14" />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group relative text-[0.78rem] font-medium tracking-[0.14em] text-slate-900 uppercase transition-all duration-300 hover:text-slate-700"
              >
                <span className="relative z-10">{link.label}</span>
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-slate-900 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            className="hidden rounded-full bg-[#2ca8ff] px-5 py-2.5 text-[0.78rem] font-semibold tracking-[0.12em] text-white uppercase shadow-[0_12px_24px_rgba(44,168,255,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(44,168,255,0.38)] md:inline-flex md:items-center md:justify-center"
          >
            Get in touch
          </a>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className="h-0.5 w-6 rounded-full bg-slate-900 transition-all duration-300"
              style={
                menuOpen
                  ? { transform: 'translateY(7px) rotate(45deg)' }
                  : undefined
              }
            />
            <span
              className="h-0.5 w-6 rounded-full bg-slate-900 transition-opacity duration-300"
              style={menuOpen ? { opacity: 0 } : undefined}
            />
            <span
              className="h-0.5 w-6 rounded-full bg-slate-900 transition-all duration-300"
              style={
                menuOpen
                  ? { transform: 'translateY(-7px) rotate(-45deg)' }
                  : undefined
              }
            />
          </button>
        </div>
      </header>

      <div
        className="fixed inset-0 z-[49] flex flex-col items-start justify-center gap-8 bg-white/95 px-8 backdrop-blur-md transition-all duration-300 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-[1.8rem] font-medium tracking-[0.06em] text-slate-900 uppercase"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          className="rounded-full bg-[#2ca8ff] px-6 py-3 text-[1.05rem] font-semibold tracking-[0.12em] text-white uppercase shadow-[0_12px_24px_rgba(44,168,255,0.32)]"
          onClick={() => setMenuOpen(false)}
        >
          Get in touch
        </a>
      </div>
    </>
  );
}
