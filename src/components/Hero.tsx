import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTextScramble } from '../hooks/useTextScramble';
import { playSound } from '../lib/sound';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const lastNameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Scramble hooks for firstName and lastName
  const { displayText: firstName, scramble: scrambleFirst } = useTextScramble('MUHAMMAD', 1.4);
  const { displayText: lastName, scramble: scrambleLast } = useTextScramble('MUNEEF', 1.4);

  useEffect(() => {
    const tl = gsap.timeline();

    // Headline characters animation
    if (headlineRef.current) {
      const chars = headlineRef.current.querySelectorAll('span');
      gsap.set(chars, { y: 60, opacity: 0 });
      tl.to(chars, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.03,
        delay: 0.5,
      });
    }

    // Last name animation
    if (lastNameRef.current) {
      const chars = lastNameRef.current.querySelectorAll('span');
      gsap.set(chars, { y: 60, opacity: 0 });
      tl.to(chars, {
        y: 0,
        opacity: 1,
        duration: 1.0,
        ease: 'power3.out',
        stagger: 0.03,
      }, '-=0.5');
    }

    // Subtitle
    if (subtitleRef.current) {
      gsap.set(subtitleRef.current, { opacity: 0, y: 20 });
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
      }, '-=0.3');
    }

    // Tagline
    if (taglineRef.current) {
      gsap.set(taglineRef.current, { opacity: 0 });
      tl.to(taglineRef.current, {
        opacity: 1,
        duration: 1.0,
        ease: 'power2.out',
      }, '-=0.3');
    }

    // Scroll indicator fade out on scroll
    const onScroll = () => {
      if (scrollIndicatorRef.current && window.scrollY > 100) {
        gsap.to(scrollIndicatorRef.current, { opacity: 0, duration: 0.5 });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      tl.kill();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const renderChars = (text: string) =>
    text.split('').map((char, i) => (
      <span
        key={i}
        style={{
          display: char === ' ' ? 'inline' : 'inline-block',
          whiteSpace: char === ' ' ? 'pre' : 'normal',
        }}
      >
        {char}
      </span>
    ));

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex items-center justify-center min-h-[100dvh] overflow-hidden select-none"
      style={{ zIndex: 1 }}
      aria-label="Hero introduction — Muhammad Muneef"
    >
      {/* Glow effects for advanced aesthetics */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-brand/10 blur-[100px] pointer-events-none glow-blur" />
      <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-brand/5 blur-[120px] pointer-events-none glow-blur" />

      {/* Radial gradient overlay for text contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(12,10,9,0.5) 100%)',
        }}
      />

      <div className="relative text-center px-6 max-w-4xl mx-auto">
        {/* SEO: Single h1 for the page — visually hidden, screen-reader accessible */}
        <h1 className="sr-only">
          Muhammad Muneef — 14-Year-Old Tech Entrepreneur, Developer & Debater from Kashmir
        </h1>

        {/* First name with drip animation & scramble on hover */}
        <div
          ref={headlineRef}
          onMouseEnter={() => {
            scrambleFirst();
            playSound('hover');
          }}
          className="hero-headline text-[#fafaf9] leading-none tracking-[-0.03em] cursor-default"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(48px, 9vw, 110px)',
          }}
          aria-hidden="true"
        >
          {renderChars(firstName)}
        </div>

        {/* Last name & scramble on hover */}
        <div
          ref={lastNameRef}
          onMouseEnter={() => {
            scrambleLast();
            playSound('hover');
          }}
          className="text-[#a8a29e] leading-none tracking-[-0.03em] mt-4 cursor-default"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 600,
            fontSize: 'clamp(38px, 7.5vw, 90px)',
          }}
          aria-hidden="true"
        >
          {renderChars(lastName)}
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-8 text-accent text-[13px] font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          ENTREPRENEUR &middot; DEBATER &middot; DEVELOPER
        </p>

        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mt-8 text-[#d6d3d1] text-[18px] sm:text-[22px] italic max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
        >
          &ldquo;I don&rsquo;t just dream &mdash; I build.&rdquo;
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
      >
        <span className="text-[10px] text-[#78716c] uppercase tracking-[0.2em] mb-3" style={{ fontFamily: "'Space Mono', monospace" }}>
          SCROLL DOWN
        </span>
        <div className="relative w-[1px] h-[40px] bg-[#a8a29e] opacity-50">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-brand"
            style={{
              animation: 'scroll-dot 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    </section>
  );
}
