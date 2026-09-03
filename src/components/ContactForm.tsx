const contactDetails = [
  { label: 'Call us', value: '+92 300 1234567' },
  { label: 'Clinic hours', value: 'Mon - Sat · 9:00 AM - 8:00 PM' },
  { label: 'Location', value: 'Hamdard Plaza, Karachi' },
];

function ContactForm() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-inner">
        <div className="contact-copy">
          <span className="contact-kicker">Consultation</span>
          <h3 className="contact-title">Let’s plan your smile transformation.</h3>
          <p className="contact-text">
            Tell us what you want to improve and our team will guide you toward the right
            dental and skin care plan.
          </p>

          <div className="contact-meta" aria-label="Clinic contact details">
            {contactDetails.map((item) => (
              <div key={item.label} className="contact-item">
                <span className="contact-item__label">{item.label}</span>
                <span className="contact-item__value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <form className="contact-form">
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
            <textarea name="message" rows={5} placeholder="Tell us about your goals..." />
          </label>

          <button type="submit" className="form-submit">
            Send enquiry
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactForm;
