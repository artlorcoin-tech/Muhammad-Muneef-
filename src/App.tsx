import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InkEffect from './components/InkEffect';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Blog from './components/Blog';
import Contact from './components/Contact';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Persistent WebGL ink background */}
      <InkEffect />

      {/* Navigation */}
      <Navigation />

      {/* Content sections scroll over the ink */}
      <main id="main-content" className="relative" style={{ zIndex: 1 }}>
        <Hero />
        <About />
        <Projects />
        <Blog />
        <Contact />
      </main>
    </>
  );
}
