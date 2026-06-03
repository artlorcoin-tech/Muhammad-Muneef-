import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
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
      className="fixed top-0 left-0 w-full z-[100] opacity-0 transition-all duration-300"
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
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-[#fafaf9] text-[14px] font-bold uppercase tracking-[0.15em] flex items-center gap-2 group"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          <span className="text-[#f97316] font-extrabold group-hover:rotate-180 transition-transform duration-500 inline-block">&lt;/&gt;</span> MUNEEF
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="text-[#a8a29e] hover:text-[#f97316] transition-colors duration-300 text-[12px] uppercase tracking-[0.08em]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] p-2"
          onClick={() => setMenuOpen(!menuOpen)}
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

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          id="mobile-nav-menu"
          role="menu"
          className="md:hidden fixed inset-0 top-[64px] flex flex-col items-center pt-16 gap-8"
          style={{ background: 'rgba(12, 10, 9, 0.95)', backdropFilter: 'blur(20px)' }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              role="menuitem"
              onClick={(e) => handleClick(e, link.href)}
              className="text-[#a8a29e] hover:text-[#f97316] transition-colors duration-300 text-[14px] uppercase tracking-[0.08em]"
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
