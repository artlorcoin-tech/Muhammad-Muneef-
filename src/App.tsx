import { useEffect, useState } from 'react';
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
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import SpotlightSearch from './components/SpotlightSearch';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);

  // Initialize Lenis scroll only after loading completes
  useEffect(() => {
    if (isLoading) return;

    const lenis = new Lenis({
      lerp: 0.08,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const handleTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    
    gsap.ticker.add(handleTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(handleTick);
    };
  }, [isLoading]);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* 1. Interactive Custom Cursor (active on loaded systems) */}
      {!isLoading && <CustomCursor />}

      {/* 2. Boot Preloader diagnostic sequence overlay */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* 3. Persistent WebGL ink background */}
      <InkEffect />

      {/* 4. Global Navigation */}
      <Navigation onSearchOpen={() => setSearchOpen(true)} />

      {/* 5. Spotlight Search & Command Menu Overlay */}
      <SpotlightSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* 6. Main Scrollable Sections */}
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
