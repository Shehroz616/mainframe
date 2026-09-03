const featureTags = ['Smile Design', 'Dental Implants', 'Teeth Whitening'];

function AfterTestimonials() {
  return (
    <section className="feature-showcase" aria-label="Smile transformation section">
      <div className="feature-showcase__inner">
        <div className="feature-showcase__content">
          <span className="feature-kicker">Advanced dentistry</span>

          <h3 className="feature-title">
         Restore
           Your True
         Smile
          </h3>

          <div className="feature-proof" aria-label="More than 2k patients">
            <div className="feature-proof__avatars" aria-hidden="true">
              <span className="feature-avatar avatar-one" />
              <span className="feature-avatar avatar-two" />
              <span className="feature-avatar avatar-three" />
            </div>
            <span className="feature-proof__count">+2k</span>
          </div>

          <p className="feature-copy">
            Using advanced technology, we deliver comprehensive treatments for a healthy,
            confident smile.
          </p>

          <div className="feature-tags" aria-label="Treatment specialties">
            {featureTags.map((tag) => (
              <span key={tag} className="feature-tag">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="feature-visual" aria-hidden="true">
            <img src="washing-teeth.png" alt="Dental treatment visual" className="w-full"  />
        </div>
      </div>
    </section>
  );
}

export default AfterTestimonials;
