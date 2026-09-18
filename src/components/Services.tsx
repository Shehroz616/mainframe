const services = [
  {
    title: 'Smile Design',
    short: 'Aesthetic precision',
    description: 'Personalized cosmetic treatments that balance beauty, function, and confidence.',
    accent: 'blue',
  },
  {
    title: 'Dental Implants',
    short: 'Permanent confidence',
    description: 'Strong, stable implant solutions designed for long-term comfort and natural results.',
    accent: 'mint',
  },
  {
    title: 'Teeth Whitening',
    short: 'Brighter smile',
    description: 'Fast, safe whitening treatments that restore vibrancy and instantly refresh your look.',
    accent: 'orange',
  },
  {
    title: 'Skin Care',
    short: 'Healthy glow',
    description: 'Targeted skin treatments that support clarity, hydration, and a youthful complexion.',
    accent: 'slate',
  },
];

const Services = () => {
  return (
    <section id="services" className="services-showcase">
      <div className="services-showcase__inner">
        <div className="services-showcase__header">
          <p className="services-showcase__kicker">Our specialties</p>
          <h2>Complete care for your smile and skin.</h2>
        </div>

        <div className="services-showcase__layout">
          <div className="services-showcase__spotlight">
            <div className="spotlight-badge">Advanced dental care</div>
            <img src="/washing-teeth.png" alt="Dental care treatment" />
            <div className="spotlight-panel">
              <span>360° smile transformation</span>
              <strong>Beauty, comfort, and health in one place.</strong>
            </div>
          </div>

          <div className="services-showcase__grid">
            {services.map((service, index) => (
              <article key={service.title} className={`service-card service-card--${service.accent}`}>
                <div className="service-card__top">
                  <span className="service-card__index">0{index + 1}</span>
                  <span className="service-card__tag">{service.short}</span>
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services