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
];

function Testimonials() {
  return (
    <section id="reviews" className="testimonials-section">
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

        <div className="testimonial-grid" aria-label="Patient testimonials">
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
    </section>
  );
}

export default Testimonials;
