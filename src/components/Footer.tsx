const footerLinks = [
  { label: 'About', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const footerMeta = [
  {
    label: 'Timings',
    value: 'Mon - Sat | 11:30 AM - 09:30 PM',
  },
  {
    label: 'Locations',
    value: 'Ghakhar, DC Colony, Rahwali, Wapda Town, Satellite Town',
  },
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <a className="footer-brand" href="#top" aria-label="Hamdard Dental and Skin Clinic home">
            <img src="/logo.png" alt="Hamdard Dental and Skin Clinic" />
          </a>

          {footerMeta.map((item) => (
            <div key={item.label} className="footer-info">
              <span className="footer-info__label">{item.label}</span>
              <p className="footer-info__value">{item.value}</p>
            </div>
          ))}
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
            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/hamdardclinic/" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
              </svg>
              <span>Instagram</span>
            </a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/hamdardclinic" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.3c0-.9.3-1.6 1.7-1.6h1.8V2.7c-.3 0-1.4-.1-2.7-.1-2.7 0-4.5 1.6-4.5 4.7v2.6H7v3.2h3.1v8h3.4Z" fill="currentColor" />
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>Hamdard Dental &amp; Skin Clinic</span>
          <span>Gujranwala, Pakistan</span>
          <span>© 2026 All rights reserved. Created by <a className="text-white" href="https://growmify.com/" target="_blank" rel="noopener noreferrer">Growmify</a></span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
