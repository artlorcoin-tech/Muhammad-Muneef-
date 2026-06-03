import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Search, VolumeX } from 'lucide-react';
import { playSound, getSoundEnabled, setSoundEnabled } from '../lib/sound';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

interface NavigationProps {
  onSearchOpen: () => void;
}

export default function Navigation({ onSearchOpen }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    gsap.to(nav, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out',
      delay: 0.3,
    });

    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    };
    
    // Initial sound active state sync
    setSoundActive(getSoundEnabled());

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    playSound('click');
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    playSound('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSound = () => {
    const nextState = !getSoundEnabled();
    setSoundEnabled(nextState);
    setSoundActive(nextState);
    playSound('toggle');
  };

  const handleSearchClick = () => {
    playSound('click');
    onSearchOpen();
  };

  return (
    <>
      {/* Skip navigation link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-[#f97316] focus:text-[#0c0a09] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-bold"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        Skip to content
      </a>
      
      <nav
        ref={navRef}
        aria-label="Main navigation"
        className="fixed top-0 left-0 w-full z-[100] opacity-0 transition-all duration-300 border-b border-[#fafaf9]/5"
        style={{
          height: '64px',
          padding: '0 clamp(24px, 5vw, 80px)',
          background: scrolled ? 'rgba(12, 10, 9, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="flex items-center justify-between h-full max-w-[1400px] mx-auto">
          {/* Logo */}
          <a
            href="#"
            onClick={handleLogoClick}
            onMouseEnter={() => playSound('hover')}
            className="text-[#fafaf9] text-[14px] font-bold uppercase tracking-[0.15em] flex items-center gap-2 group interactive-item"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <span className="text-[#f97316] font-extrabold group-hover:rotate-180 transition-transform duration-500 inline-block">&lt;/&gt;</span> MUNEEF
          </a>

          {/* Right Area: Links & Controls */}
          <div className="flex items-center gap-8">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  onMouseEnter={() => playSound('hover')}
                  className="text-[#a8a29e] hover:text-[#f97316] transition-colors duration-300 text-[12px] uppercase tracking-[0.08em] interactive-item"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Global Interaction Controls (Search, Sound) */}
            <div className="flex items-center gap-2 border-l border-[#fafaf9]/10 pl-6 h-6">
              {/* Search Icon */}
              <button
                onClick={handleSearchClick}
                onMouseEnter={() => playSound('hover')}
                aria-label="Open global search menu (Cmd+K)"
                className="text-[#a8a29e] hover:text-[#f97316] p-1.5 rounded-md hover:bg-[#fafaf9]/5 transition-all duration-300 interactive-item"
              >
                <Search size={16} />
              </button>

              {/* Sound Toggle Icon */}
              <button
                onClick={toggleSound}
                onMouseEnter={() => playSound('hover')}
                aria-label={soundActive ? 'Mute audio synthesis' : 'Unmute audio synthesis'}
                className="text-[#a8a29e] hover:text-[#f97316] p-1.5 rounded-md hover:bg-[#fafaf9]/5 transition-all duration-300 flex items-center justify-center interactive-item w-8 h-8"
              >
                {soundActive ? (
                  <div className="flex items-end gap-[2px] h-[10px] w-[12px] pb-[1px]" aria-hidden="true">
                    <span className="w-[1.5px] bg-[#f97316] sound-wave-bar h-full" />
                    <span className="w-[1.5px] bg-[#f97316] sound-wave-bar h-[50%]" />
                    <span className="w-[1.5px] bg-[#f97316] sound-wave-bar h-[80%]" />
                    <span className="w-[1.5px] bg-[#f97316] sound-wave-bar h-[30%]" />
                  </div>
                ) : (
                  <VolumeX size={16} aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden flex flex-col gap-[5px] p-2 interactive-item"
              onClick={() => {
                playSound('click');
                setMenuOpen(!menuOpen);
              }}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
            >
              <span
                className="block w-5 h-[1px] bg-[#fafaf9] transition-transform duration-300"
                style={{
                  transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none',
                }}
              />
              <span
                className="block w-5 h-[1px] bg-[#fafaf9] transition-opacity duration-300"
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className="block w-5 h-[1px] bg-[#fafaf9] transition-transform duration-300"
                style={{
                  transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
          <div
            id="mobile-nav-menu"
            role="menu"
            className="md:hidden fixed inset-0 top-[64px] flex flex-col items-center pt-16 gap-8 z-[90]"
            style={{ background: 'rgba(12, 10, 9, 0.95)', backdropFilter: 'blur(20px)' }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                role="menuitem"
                onClick={(e) => handleClick(e, link.href)}
                onMouseEnter={() => playSound('hover')}
                className="text-[#a8a29e] hover:text-[#f97316] transition-colors duration-300 text-[14px] uppercase tracking-[0.08em] interactive-item"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
