import Services from './components/Services';
import Marquee from './components/Marquee';
import {Hero} from './components/Hero';
import {Navbar} from './components/Navbar';

function App() {
  return (
    <main className="page-shell relative min-h-screen">
      
      <Navbar />
      <Hero />
      <Services />
      <Marquee />
    </main>
  );
}

export default App;
