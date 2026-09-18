const footerLinks = [
  { label: 'About', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const clinicBranches = [
  {
    location: 'Ghakhar',
    hours: ['Morning 11:30 am to 03:00 pm', 'Evening 06:30 pm to 09:30 pm'],
    friday: 'Friday Off *',
    phones: ['0336-9882017', '0313-4882017'],
    name: 'Ashfaq Dental Clinic',
  },
  {
    location: 'DC Colony',
    hours: ['Working Hours:', 'After Namaz-e-Magrib to 10:00 pm'],
    friday: 'Friday Off *',
    phones: ['0312-663 3882', '0324-200 0912', '055-378 2301'],
  },
  {
    location: 'Rahwali',
    hours: ['Working Hours:', 'Morning 11:30 am to 03:00 pm', 'Evening 06:30 pm to 09:30 pm'],
    friday: 'Friday Off *',
    phones: ['0320-666 9099', '0331-666 9099', '055-382 9072'],
  },
  {
    location: 'Wapda Town',
    hours: ['Working Hours:', '04:00 pm to 09:00 pm'],
    friday: 'Friday Off *',
    phones: ['0301 6633882', '0336 6633882'],
  },
  {
    location: 'Satellite Town',
    hours: ['Working Hours:', '02:00 PM to 10:00 PM'],
    friday: 'Friday Off *',
    phones: ['0320-666 00 77'],
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

          <p className="footer-tagline">
            Gentle care. Modern confidence.
          </p>

          <a className="footer-phone" href="tel:+923001234567">
            +92 300 1234567 <span aria-hidden="true">&#8599;</span>
          </a>
        </div>

        <div className="footer-branches" aria-label="Clinic branches and contact details">
          <h3 className="footer-branches__title">Dental Clinic</h3>
          <div className="footer-branches__grid">
            {clinicBranches.map((branch) => (
              <article key={branch.location} className="footer-branch">
                <h4>{branch.location}</h4>

                <div className="footer-branch__hours">
                  {branch.hours.map((line) => (
                    <span key={`${branch.location}-${line}`}>{line}</span>
                  ))}
                </div>

                <p className="footer-branch__friday">{branch.friday}</p>

                {branch.name ? <p className="footer-branch__name">{branch.name}</p> : null}

                <div className="footer-branch__phones">
                  {branch.phones.map((phone) => (
                    <a key={`${branch.location}-${phone}`} href={`tel:${phone.replace(/\s+/g, '')}`}>
                      {phone}
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>
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
