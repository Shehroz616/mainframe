import { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Testimonial = {
  quote: string;
  name: string;
  service: string;
  accent: string;
};

const testimonials: Testimonial[] = [
  {
    quote:
      'The clinic feels premium from the moment you walk in. My whitening results were natural, comfortable, and exactly what I wanted.',
    name: 'Ayesha Khan',
    service: 'Teeth Whitening',
    accent: '#ec612c',
  },
  {
    quote:
      'Everything was explained clearly, and the implant process felt stress-free. The team made me feel confident at every step.',
    name: 'Hamza Ali',
    service: 'Dental Implants',
    accent: '#2ca8ff',
  },
  {
    quote:
      'The skin treatment was gentle, effective, and beautifully done. My results were visible quickly without any discomfort.',
    name: 'Sana Riaz',
    service: 'Skin Care',
    accent: '#90ee90',
  },
  {
    quote:
      'I had been nervous about orthodontic treatment, but every appointment was calm, clear, and tailored to my routine. The difference is incredible.',
    name: 'Mariam Shah',
    service: 'Smile Design',
    accent: '#89cff0',
  },
  {
    quote:
      'The consultation felt personal rather than rushed. I finally understand how to care for my teeth and my confidence has come back with my smile.',
    name: 'Omar Farooq',
    service: 'Preventive Care',
    accent: '#ec612c',
  },
  {
    quote:
      'From the first check-up to the final polish, the team was warm and professional. The clinic has made dental visits something I no longer avoid.',
    name: 'Hira Malik',
    service: 'Dental Care',
    accent: '#90ee90',
  },
  {
    quote:
      'My root canal was handled with patience and care. The team kept me comfortable and explained every step before beginning treatment.',
    name: 'Bilal Ahmed',
    service: 'Root Canal Care',
    accent: '#2ca8ff',
  },
  {
    quote:
      'My daughter felt relaxed from the very first visit. The gentle approach made her excited to come back for her next check-up.',
    name: 'Nadia Rehman',
    service: 'Family Dentistry',
    accent: '#89cff0',
  },
  {
    quote:
      'I noticed a real improvement in my gum health within weeks. The advice was practical, personal, and easy to follow at home.',
    name: 'Usman Tariq',
    service: 'Gum Care',
    accent: '#ec612c',
  },
  {
    quote:
      'The crowns look completely natural and the whole process was beautifully managed. I left the clinic smiling with confidence.',
    name: 'Zara Siddiqui',
    service: 'Restorative Dentistry',
    accent: '#90ee90',
  },
];

function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track) return;

    const context = gsap.context(() => {
      const horizontalDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

      gsap.to(track, {
        x: () => -horizontalDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${horizontalDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section ref={sectionRef} id="reviews" className="testimonials-section">
      <div className="testimonials-shell">
        <div className="testimonials-header">
          <div className="eyebrow-wrap">
            <span className="eyebrow-dot" aria-hidden="true" />
            <span className="eyebrow-text">Testimonials</span>
          </div>

          <h2 className="testimonials-title">
            Patients love the calm, modern care they receive here.
          </h2>
        </div>

        <div ref={viewportRef} className="testimonial-viewport">
          <div ref={trackRef} className="testimonial-grid" aria-label="Patient testimonials">
            {testimonials.map((item) => (
              <article key={item.name} className="testimonial-card">
              <div className="testimonial-topline">
                <div className="rating" aria-label="Five star review">
                  {'★★★★★'}
                </div>
                <span className="service-badge" style={{ backgroundColor: `${item.accent}20`, color: item.accent }}>
                  {item.service}
                </span>
              </div>

              <p className="testimonial-quote">“{item.quote}”</p>

              <div className="testimonial-footer">
                <div className="avatar" aria-hidden="true" style={{ background: item.accent }}>
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="customer-name">{item.name}</p>
                  <p className="customer-meta">Verified patient</p>
                </div>
              </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
