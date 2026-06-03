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
import MatrixRain from './components/MatrixRain';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);

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

  // Global Ctrl+K / Cmd+K and Event listeners for Matrix Rain / Themes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    const handleToggleMatrix = () => {
      setMatrixActive((prev) => !prev);
    };

    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      const nextTheme = customEvent.detail?.theme;
      if (nextTheme) {
        const html = document.documentElement;
        html.classList.remove('theme-cyan', 'theme-green', 'theme-orange', 'theme-matrix');
        if (nextTheme !== 'orange') {
          html.classList.add(`theme-${nextTheme}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-matrix', handleToggleMatrix);
    window.addEventListener('theme-change', handleThemeChange);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-matrix', handleToggleMatrix);
      window.removeEventListener('theme-change', handleThemeChange);
    };
  }, []);

  return (
    <>
      {/* 1. Interactive Custom Cursor (active on loaded systems) */}
      {!isLoading && <CustomCursor />}

      {/* 2. Boot Preloader diagnostic sequence overlay */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* 3. Fullscreen Green Code Rain (toggled via terminal "/matrix") */}
      <MatrixRain active={matrixActive} onClose={() => setMatrixActive(false)} />

      {/* 4. Persistent WebGL ink background */}
      <InkEffect />

      {/* 5. Global Navigation */}
      <Navigation onSearchOpen={() => setSearchOpen(true)} />

      {/* 6. Spotlight Search & Command Menu Overlay */}
      <SpotlightSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* 7. Main Scrollable Sections */}
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
