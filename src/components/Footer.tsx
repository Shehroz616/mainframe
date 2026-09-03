const footerLinks = [
  { label: 'About', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <a className="footer-brand" href="#top" aria-label="Hamdard Dental and Skin Clinic home">
            Hamdard<span>+</span>
          </a>

          <p className="footer-tagline">
            Gentle care. Modern confidence.
          </p>

          <a className="footer-phone" href="tel:+923001234567">
            +92 300 1234567 <span aria-hidden="true">&#8599;</span>
          </a>
        </div>

        <div className="site-footer__middle">
          <nav className="footer-nav" aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="footer-socials" aria-label="Social media links">
            <a href="#contact">Instagram</a>
            <a href="#contact">Facebook</a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>Hamdard Dental &amp; Skin Clinic</span>
          <span>Karachi, Pakistan</span>
          <span>© 2026 All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
