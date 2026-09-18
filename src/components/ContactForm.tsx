const clinicBranches = [
  {
    location: 'Ghakhar',
    name: 'Ashfaq Dental Clinic',
    hours: [
      { shift: 'Morning', time: '11:30 AM - 03:00 PM' },
      { shift: 'Evening', time: '06:30 PM - 09:30 PM' },
    ],
    friday: 'Friday Off',
    phones: ['0336-9882017', '0313-4882017'],
  },
  {
    location: 'DC Colony',
    hours: [
      { shift: 'Evening', time: 'After Maghrib - 10:00 PM' },
    ],
    friday: 'Friday Off',
    phones: ['0312-663 3882', '0324-200 0912', '055-378 2301'],
  },
  {
    location: 'Rahwali',
    hours: [
      { shift: 'Morning', time: '11:30 AM - 03:00 PM' },
      { shift: 'Evening', time: '06:30 PM - 09:30 PM' },
    ],
    friday: 'Friday Off',
    phones: ['0320-666 9099', '0331-666 9099', '055-382 9072'],
  },
  {
    location: 'Wapda Town',
    hours: [
      { shift: 'Evening', time: '04:00 PM - 09:00 PM' },
    ],
    friday: 'Friday Off',
    phones: ['0301 6633882', '0336 6633882'],
  },
  {
    location: 'Satellite Town',
    hours: [
      { shift: 'Afternoon / Evening', time: '02:00 PM - 10:00 PM' },
    ],
    friday: 'Friday Off',
    phones: ['0320-666 00 77'],
  },
];

function ContactForm() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* Section Header */}
        <div className="contact-header">
          <span className="contact-kicker">Branches &amp; Consultation</span>
          <h2 className="contact-title">Visit Our Clinics or Get In Touch</h2>
          <p className="contact-subtitle">
            We operate across 5 branch locations in Gujranwala with dedicated morning &amp; evening shifts.
          </p>
        </div>

        {/* Clinic Branches & Timings Cards */}
        <div className="clinic-branches-section">
          <div className="clinic-branches-header">
            <div className="clinic-branches-title-wrap">
              <svg className="clinic-branches-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <h3>Our Clinic Branches &amp; Timings</h3>
            </div>
            <span className="clinic-branches-badge">5 Branches in Gujranwala</span>
          </div>

          <div className="clinic-branches-grid">
            {clinicBranches.map((branch) => (
              <article key={branch.location} className="branch-card">
                <div>
                  <div className="branch-card__top">
                    <div className="branch-card__location">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <h4>{branch.location}</h4>
                    </div>
                    {branch.name && <span className="branch-card__name-tag">{branch.name}</span>}
                  </div>

                  <div className="branch-card__hours">
                    {branch.hours.map((h, i) => (
                      <div key={i} className="branch-hour-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <div className="branch-hour-details">
                          <span className="shift-label">{h.shift}</span>
                          <span className="shift-time">{h.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="branch-card__bottom">
                  <span className="branch-card__friday">
                    <span className="friday-dot"></span>
                    {branch.friday}
                  </span>

                  <div className="branch-card__phones">
                    {branch.phones.map((phone) => (
                      <a key={phone} href={`tel:${phone.replace(/[\s-]/g, '')}`} className="phone-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>{phone}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Main Contact Form Grid */}
        <div className="contact-main-grid">
          <div className="contact-copy">
            <span className="contact-kicker">Book Consultation</span>
            <h3 className="contact-subheading">Let’s plan your smile transformation.</h3>
            <p className="contact-text">
              Tell us what you want to improve and our expert team will guide you toward the ideal dental and skin care plan.
            </p>

            <div className="contact-meta" aria-label="Clinic central contact details">
              <div className="contact-item">
                <span className="contact-item__label">Central Helpline</span>
                <a href="tel:+923001234567" className="contact-item__value contact-item__value--link">
                  +92 300 1234567
                </a>
              </div>
              <div className="contact-item">
                <span className="contact-item__label">Main Region</span>
                <span className="contact-item__value">Gujranwala, Punjab, Pakistan</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="field-row">
              <label className="field-wrap">
                <span>Full Name</span>
                <input type="text" name="name" placeholder="Your name" />
              </label>
              <label className="field-wrap">
                <span>Email</span>
                <input type="email" name="email" placeholder="you@example.com" />
              </label>
            </div>

            <div className="field-row">
              <label className="field-wrap">
                <span>Phone</span>
                <input type="tel" name="phone" placeholder="+92 300 0000000" />
              </label>
              <label className="field-wrap">
                <span>Service</span>
                <select name="service" defaultValue="">
                  <option value="" disabled>
                    Select service
                  </option>
                  <option value="teeth-whitening">Teeth Whitening</option>
                  <option value="dental-implants">Dental Implants</option>
                  <option value="smile-design">Smile Design</option>
                  <option value="skin-care">Skin Care</option>
                </select>
              </label>
            </div>

            <label className="field-wrap field-wrap--full">
              <span>Message</span>
              <textarea name="message" rows={4} placeholder="Tell us about your goals..." />
            </label>

            <button type="submit" className="form-submit">
              Send enquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
