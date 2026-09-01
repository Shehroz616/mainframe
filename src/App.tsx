import Services from './components/Services';
import Marquee from './components/Marquee';
import {Hero} from './components/Hero';
import {Navbar} from './components/Navbar';
import {BackgroundVideo} from './components/BackgroundVideo';








function App() {
  return (
    <main className="page-shell relative min-h-screen">
      <BackgroundVideo />
      <Navbar />
      <Hero />
      <Services />
      <Marquee />
    </main>
  );
}

export default App;
