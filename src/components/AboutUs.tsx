import React, { useState } from 'react';

const SPECIALTIES = [
  {
    id: 'implants',
    title: '3D Computer-Guided Implants',
    desc: 'Sub-millimeter precision implant placement using high-definition 3D CBCT scans for virtually painless, permanent tooth restoration.',
    metric: '99.8%',
    metricLabel: 'Success Rate',
  },
  {
    id: 'makeover',
    title: 'Full-Arch Smile Makeovers',
    desc: 'Bespoke ultra-thin porcelain veneers crafted to complement your natural facial geometry and skin tones.',
    metric: '10,000+',
    metricLabel: 'Veneers Placed',
  },
  {
    id: 'sedation',
    title: 'Pain-Free Sedation Dentistry',
    desc: 'Relaxation-focused treatment protocols designed specifically for anxious patients seeking a calm, stress-free experience.',
    metric: '100%',
    metricLabel: 'Comfort Rate',
  },
];

const AboutUs: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="about" className="relative z-10 overflow-hidden bg-white py-28 text-slate-900 lg:py-36">
      

      {/* SVG Tooth ClipPath Definition */}
      <svg className="absolute h-0 w-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="tooth-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0.50,0.06 C 0.38,0.01 0.16,0.03 0.07,0.18 C -0.02,0.34 0.03,0.58 0.18,0.71 C 0.26,0.78 0.28,0.86 0.25,0.95 C 0.23,1.01 0.36,1.00 0.42,0.89 C 0.46,0.79 0.50,0.67 0.50,0.67 C 0.50,0.67 0.54,0.79 0.58,0.89 C 0.64,1.00 0.77,1.01 0.75,0.95 C 0.72,0.86 0.74,0.78 0.82,0.71 C 0.97,0.58 1.02,0.34 0.93,0.18 C 0.84,0.03 0.62,0.01 0.50,0.06 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">

          {/* Left Column: Doctor Profile & Editorial Content */}
          <div className="lg:col-span-7">

            {/* Micro Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#2ca8ff]/30 bg-[#2ca8ff]/10 px-4 py-1.5 shadow-[0_2px_10px_rgba(44,168,255,0.1)] backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[#2ca8ff] animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#0284c7] uppercase">
                Chief Dental Surgeon & Founder
              </span>
            </div>

            {/* Doctor Headline */}
            <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl font-sans leading-[1.08]">
              Dr. Shehroz Hamdard
            </h2>
            <p className="mt-2 text-lg font-semibold text-[#0284c7] tracking-wide">
              BDS, MDS (Oral & Maxillofacial Surgery) · Fellow of ICOI
            </p>

            {/* Editorial Lead Paragraph */}
            <p className="mt-5 text-xl font-light leading-relaxed text-slate-700 max-w-[62ch]">
              Mastering the delicate harmony of surgical precision and cosmetic artistry to deliver gentle, lifetime smile transformations.
            </p>

            <p className="mt-3 text-base leading-relaxed text-slate-600 max-w-[62ch]">
              With over 15 years of dedicated practice, Dr. Hamdard has pioneered computer-guided implant procedures and non-invasive cosmetic reconstructions. His patient-first philosophy transforms complex dental treatments into calm, comfortable experiences.
            </p>

            {/* Double-Bezel Interactive Specialty Selector */}
            <div className="mt-8 rounded-3xl border border-slate-200/90 bg-[#f8fafc]/80 p-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] backdrop-blur-sm">
              <div className="flex flex-wrap gap-1.5 rounded-2xl bg-slate-200/50 p-1.5">
                {SPECIALTIES.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`flex-1 min-w-[130px] rounded-xl px-3.5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all duration-300 ${activeTab === idx
                      ? 'bg-white text-[#0284c7] shadow-[0_4px_12px_rgba(15,23,42,0.06)]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                  >
                    {item.id === 'implants' ? 'Implants' : item.id === 'makeover' ? 'Veneers' : 'Sedation'}
                  </button>
                ))}
              </div>

              {/* Active Tab Inner Core Card */}
              <div className="mt-2.5 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      {SPECIALTIES[activeTab].title}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {SPECIALTIES[activeTab].desc}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-2xl font-black text-[#0284c7]">
                      {SPECIALTIES[activeTab].metric}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {SPECIALTIES[activeTab].metricLabel}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Double-Bezel Strip */}
            <div className="mt-8 rounded-3xl border border-slate-200/90 bg-[#f8fafc] p-2 shadow-sm">
              <div className="grid grid-cols-3 gap-2 rounded-[calc(1.5rem-0.5rem)] bg-white p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div>
                  <div className="text-2xl font-black text-[#0284c7] sm:text-3xl">15+</div>
                  <div className="mt-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Years Exp.</div>
                </div>
                <div className="border-x border-slate-100">
                  <div className="text-2xl font-black text-[#0ea5e9] sm:text-3xl">10k+</div>
                  <div className="mt-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Happy Patients</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#ec612c] sm:text-3xl">99.8%</div>
                  <div className="mt-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Action CTAs (Island Button Architecture with Trailing Icon Wrapper) */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-[#2ca8ff] to-[#1a8ad4] pl-7 pr-3 py-3 text-xs font-bold tracking-widest text-white uppercase shadow-[0_10px_25px_rgba(44,168,255,0.32)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_35px_rgba(44,168,255,0.45)] active:scale-[0.98]"
              >
                <span>Book Consultation</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </a>

              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-slate-300/80 bg-slate-100/80 px-7 py-4 text-xs font-bold tracking-widest text-slate-800 uppercase transition-all duration-300 hover:bg-slate-200/90 hover:text-slate-900 active:scale-[0.98]"
              >
                View Treatments
              </a>
            </div>

          </div>

          {/* Right Column: Double-Bezel Hardware Enclosure for Tooth Masked Doctor Photo */}
          <div className="relative flex justify-center lg:col-span-5">

            {/* Outer Machine Enclosure (Double Bezel Outer Shell) */}
            <div className="relative w-full max-w-md lg:max-w-none ">

              {/* Inner Core Container */}
              <div className="relative aspect-[4/5] w-full  bg-white p-2 overflow-hidden flex items-center justify-center ">

                {/* Soft Radial Backlight */}
                <div className="absolute inset-4 rounded-full animate-pulse pointer-events-none" />

                {/* The Tooth Masked Image Container */}
                <div
                  className="relative w-full h-full max-h-[520px] drop-shadow-[0_20px_40px_rgba(44,168,255,0.22)] transition-transform duration-700 hover:scale-[1.02]"
                  style={{
                    clipPath: 'url(#tooth-clip)',
                    WebkitClipPath: 'url(#tooth-clip)',
                  }}
                >
                  {/* Doctor Portrait Photo */}
                  <img
                    src="/doctor-image.png"
                    alt="Dr. Shehroz Hamdard"
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
                  />

                  {/* Subtle Depth Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Decorative SVG Tooth Contour Trace */}
                <svg
                  viewBox="0 0 500 580"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full pointer-events-none z-10 max-h-[520px] mx-auto p-2"
                >
                  <defs>
                    <linearGradient id="tooth-stroke-grad-skill" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2ca8ff" />
                      <stop offset="50%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#ec612c" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 250,35 C 190,6 80,17 35,104 C -10,197 15,336 90,412 C 130,452 140,499 125,551 C 115,586 180,580 210,516 C 230,458 250,388 250,388 C 250,388 270,458 290,516 C 320,580 385,586 375,551 C 360,499 370,452 410,412 C 485,336 510,197 465,104 C 420,17 310,6 250,35 Z"
                    stroke="url(#tooth-stroke-grad-skill)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-90 drop-shadow-[0_4px_12px_rgba(44,168,255,0.35)]"
                  />
                </svg>

                
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;
