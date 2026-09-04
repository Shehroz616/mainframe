import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Services from './components/Services';
import Marquee from './components/Marquee';
import {Hero} from './components/Hero';
import {Navbar} from './components/Navbar';
import Testimonials from './components/Testimonials';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';
import AdvancedDentistry from './components/AdvancedDentistry';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: false });
    const animationFrame = (time: number) => {
      lenis.raf(time * 1000);
      ScrollTrigger.update();
    };

    gsap.ticker.add(animationFrame);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(animationFrame);
      lenis.destroy();
    };
  }, []);

  return (
    <main id="top" className="page-shell relative min-h-screen">
      <Navbar />
      <Hero />
      <Marquee />
      <AdvancedDentistry />
      <Services />
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}

export default App;
