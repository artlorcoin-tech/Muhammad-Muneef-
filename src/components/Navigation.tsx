import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Search, VolumeX } from 'lucide-react';
import { playSound, getSoundEnabled, setSoundEnabled } from '../lib/sound';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Credentials', href: '#certifications' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'FAQ', href: '#faq' },
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

  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      setSoundActive(customEvent.detail.enabled);
    };
    window.addEventListener('sound-change', handleSoundChange);
    return () => {
      window.removeEventListener('sound-change', handleSoundChange);
    };
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:bg-brand focus:text-[#0c0a09] focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-bold"
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
            className="text-[#fafaf9] text-[14px] font-bold uppercase tracking-[0.15em] flex items-center gap-3 group interactive-item"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-brand/30 group-hover:border-brand transition-all duration-500 shadow-sm shadow-brand/10">
              <img 
                src="/images/muneef-profile.jpg" 
                alt="Muneef" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <span>MUNEEF</span>
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
                  className="text-[#a8a29e] hover:text-brand transition-colors duration-300 text-[12px] uppercase tracking-[0.08em] interactive-item"
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
                className="text-[#a8a29e] hover:text-brand p-1.5 rounded-md hover:bg-[#fafaf9]/5 transition-all duration-300 interactive-item"
              >
                <Search size={16} />
              </button>

              {/* Sound Toggle Icon */}
              <button
                onClick={toggleSound}
                onMouseEnter={() => playSound('hover')}
                aria-label={soundActive ? 'Mute audio synthesis' : 'Unmute audio synthesis'}
                className="text-[#a8a29e] hover:text-brand p-1.5 rounded-md hover:bg-[#fafaf9]/5 transition-all duration-300 flex items-center justify-center interactive-item w-8 h-8"
              >
                {soundActive ? (
                  <div className="flex items-end gap-[2px] h-[10px] w-[12px] pb-[1px]" aria-hidden="true">
                    <span className="w-[1.5px] bg-brand sound-wave-bar h-full" />
                    <span className="w-[1.5px] bg-brand sound-wave-bar h-[50%]" />
                    <span className="w-[1.5px] bg-brand sound-wave-bar h-[80%]" />
                    <span className="w-[1.5px] bg-brand sound-wave-bar h-[30%]" />
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

        {/* Futuristic Fullscreen Mobile Menu Dashboard Overlay */}
        {menuOpen && (
          <div
            id="mobile-nav-menu"
            role="menu"
            className="md:hidden fixed inset-0 top-[64px] flex flex-col justify-between p-8 z-[90] overflow-y-auto"
            style={{ 
              background: 'rgba(12, 10, 9, 0.96)', 
              backdropFilter: 'blur(24px)',
              height: 'calc(100dvh - 64px)'
            }}
          >
            {/* Top Stats Section */}
            <div className="flex flex-col gap-1 border-b border-[#fafaf9]/5 pb-6 text-[10px] text-[#78716c] uppercase tracking-wider font-mono">
              <div className="flex justify-between">
                <span>SYSTEM CORE:</span>
                <span className="text-brand font-bold">ONLINE // MUNEEF.DEV</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>GEO_LOC:</span>
                <span>SRINAGAR, KASHMIR</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>LATENCY:</span>
                <span className="text-emerald-500">14MS [OPTIMAL]</span>
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-6 py-6 items-center">
              {navLinks.map((link, idx) => (
                <a
                  key={link.label}
                  href={link.href}
                  role="menuitem"
                  onClick={(e) => handleClick(e, link.href)}
                  onMouseEnter={() => playSound('hover')}
                  className="text-2xl uppercase tracking-widest text-[#a8a29e] hover:text-brand transition-colors duration-300 font-bold font-mono"
                >
                  <span className="text-brand/35 text-xs mr-2 font-mono">(0{idx + 1})</span>
                  {link.label}
                </a>
              ))}
            </div>

            {/* Accent Theme Switcher Dashboard */}
            <div className="border-t border-b border-[#fafaf9]/5 py-6">
              <span className="block text-[10px] text-[#78716c] uppercase tracking-widest text-center font-mono mb-4 font-bold">
                Change UI Theme Accent
              </span>
              <div className="grid grid-cols-4 gap-2 max-w-[280px] mx-auto">
                {[
                  { name: 'orange', class: 'bg-[#f97316]' },
                  { name: 'cyan', class: 'bg-[#06b6d4]' },
                  { name: 'green', class: 'bg-[#10b981]' },
                  { name: 'matrix', class: 'bg-[#22c55e]' },
                ].map((th) => (
                  <button
                    key={th.name}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: th.name } }));
                      playSound('success');
                    }}
                    className="flex flex-col items-center gap-1.5 p-2 rounded bg-[#171412] hover:bg-[#171412]/80 transition-all border border-[#fafaf9]/5 active:scale-95"
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${th.class}`} />
                    <span className="text-[8px] text-[#a8a29e] uppercase font-mono">{th.name.substring(0, 3)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Controls / Quick Action Row */}
            <div className="flex items-center justify-between border-t border-[#fafaf9]/5 pt-6 mt-auto">
              <div className="flex flex-col">
                <span className="text-[9px] text-[#78716c] uppercase font-mono">SOUND CARD:</span>
                <span className="text-[11px] font-bold font-mono text-[#fafaf9]">
                  {soundActive ? 'SYNTH ENGINE ACTIVE' : 'MUTED'}
                </span>
              </div>

              <button
                onClick={toggleSound}
                className={`px-4 py-2 border rounded font-mono text-[10px] uppercase font-bold transition-all duration-300 ${
                  soundActive 
                    ? 'border-brand text-brand bg-brand/5 hover:bg-brand/10'
                    : 'border-[#78716c]/30 text-[#78716c] hover:text-[#fafaf9]'
                }`}
              >
                {soundActive ? 'MUTE AUDIO' : 'UNMUTE AUDIO'}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
