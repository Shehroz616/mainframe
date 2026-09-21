function ContactForm() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">
        {/* Section Header */}
        <div className="contact-header">
          <span className="contact-kicker">Consultation</span>
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-subtitle">
            We operate across 5 branch locations in Gujranwala with dedicated morning &amp; evening shifts.
          </p>
        </div>

        {/* Main Contact Form Grid */}
        <div className="contact-main-grid">
          <div className="contact-copy">
            <span className="contact-kicker mb-6">Book Consultation</span>
            <h3 className="contact-subheading mb-8">Let’s plan your smile transformation.</h3>
            <p className="contact-text">
              Tell us what you want to improve and our expert team will guide you toward the ideal dental and skin care plan.
            </p>

            <div className="contact-meta" aria-label="Clinic central contact details">
              <div className="contact-item">
                <span className="contact-item__label">Main Region </span>
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
