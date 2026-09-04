import Services from './components/Services';
import Marquee from './components/Marquee';
import {Hero} from './components/Hero';
import {Navbar} from './components/Navbar';
import Testimonials from './components/Testimonials';
import AfterTestimonials from './components/AfterTestimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdvancedDentistry from './components/AdvancedDentistry';

function App() {
  return (
    <main id="top" className="page-shell relative min-h-screen">
      <Navbar />
      <Hero />
      <AdvancedDentistry />
      <Marquee />
      <Services />
      <Testimonials />
      <AfterTestimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}

export default App;
