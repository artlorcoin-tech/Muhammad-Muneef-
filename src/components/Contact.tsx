import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/muhammad-muneef' },
  { label: 'GITHUB', href: 'https://github.com/Muneef29' },
  { label: 'INSTAGRAM', href: 'https://instagram.com/m__un__ee_f' },
  { label: 'EMAIL', href: 'mailto:muhammadmuneef2928@gmail.com' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (contentRef.current) {
      const children = contentRef.current.children;
      gsap.fromTo(
        children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative"
      aria-label="Contact Muhammad Muneef"
      style={{
        zIndex: 1,
        background: 'rgba(12, 10, 9, 0.95)',
        padding: 'clamp(100px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div ref={contentRef} className="max-w-[1200px] mx-auto text-center">
        {/* Section label */}
        <span
          className="block text-[#f97316] text-[12px] uppercase tracking-[0.08em]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          (004) CONTACT
        </span>

        {/* Heading */}
        <h2
          className="mt-8 text-[#fafaf9]"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(42px, 7vw, 96px)',
            letterSpacing: '-0.02em',
          }}
        >
          Let&rsquo;s Build Something
        </h2>

        {/* Subheading */}
        <p
          className="mt-6 text-[#a8a29e] max-w-[560px] mx-auto"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', lineHeight: 1.65 }}
        >
          Whether it&rsquo;s a startup idea, a website project, or a debate collaboration &mdash;
          I&rsquo;m always open to meaningful conversations.
        </p>

        {/* CTA Button */}
        <div className="mt-12">
          <a
            href="mailto:muhammadmuneef2928@gmail.com"
            className="inline-block text-[#f97316] border border-[#f97316] px-12 py-[18px] transition-all duration-300 hover:bg-[#f97316] hover:text-[#0c0a09]"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '14px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            GET IN TOUCH
          </a>
        </div>

        {/* Social links */}
        <nav className="mt-16 flex flex-wrap justify-center gap-10" aria-label="Social media links">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${link.label.charAt(0) + link.label.slice(1).toLowerCase()} profile`}
              className="text-[#a8a29e] hover:text-[#f97316] transition-colors duration-300 text-[12px] uppercase tracking-[0.08em]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <footer className="mt-28">
          <p
            className="text-[#78716c] text-[11px] uppercase tracking-[0.06em]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            &copy; 2026 Muhammad Muneef. Built with passion from Kashmir.
          </p>
        </footer>
      </div>
    </section>
  );
}
