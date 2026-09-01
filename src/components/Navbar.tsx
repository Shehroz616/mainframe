import { useState } from 'react';

const NAV_LINKS = ['About', 'Services', 'Reviews', 'Contact'];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
        {/* Logo */}
        <div className="flex flex-row items-center gap-3">
          <span
            className="text-[21px] tracking-tight text-black sm:text-[26px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe&reg;
          </span>
          <span
            aria-hidden="true"
            className="select-none text-[25px] text-black sm:text-[30px]"
            style={{ letterSpacing: '-0.02em' }}
          >
            &#10035;&#65038;
          </span>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden flex-row text-[23px] text-black md:flex">
          {NAV_LINKS.map((link, i) => (
            <span key={link} className="flex flex-row">
              <a href="#" className="transition-opacity hover:opacity-60">
                {link}
              </a>
              {i < NAV_LINKS.length - 1 && <span>,&nbsp;</span>}
            </span>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#"
          className="hidden text-[23px] text-black underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
        >
          Get in touch
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span
            className="h-[2px] w-6 bg-black transition-all duration-300"
            style={
              menuOpen
                ? { transform: 'translateY(7px) rotate(45deg)' }
                : undefined
            }
          />
          <span
            className="h-[2px] w-6 bg-black transition-opacity duration-300"
            style={menuOpen ? { opacity: 0 } : undefined}
          />
          <span
            className="h-[2px] w-6 bg-black transition-all duration-300"
            style={
              menuOpen
                ? { transform: 'translateY(-7px) rotate(-45deg)' }
                : undefined
            }
          />
        </button>
      </header>

      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-[9] flex flex-col items-start justify-center gap-8 bg-white/95 px-8 backdrop-blur-sm transition-opacity duration-300 md:hidden"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            href="#"
            className="text-[32px] font-medium text-black"
            onClick={() => setMenuOpen(false)}
          >
            {link}
          </a>
        ))}
        <a
          href="#"
          className="text-[32px] font-medium text-black underline underline-offset-2"
          onClick={() => setMenuOpen(false)}
        >
          Get in touch
        </a>
      </div>
    </>
  );
}
