import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Terminal from './Terminal';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '14', label: 'Years Old' },
  { value: 'GVEI', label: 'Green Valley Ed. Inst.' },
  { value: '2x', label: 'Startups Founded' },
  { value: '3x', label: 'MUN Best Delegate' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyLeftRef = useRef<HTMLParagraphElement>(null);
  const bodyRightRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    tl.fromTo(
      [labelRef.current, headingRef.current],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', stagger: 0.15 }
    );

    tl.fromTo(
      [bodyLeftRef.current, bodyRightRef.current],
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
      '-=0.5'
    );

    // Stats animation
    if (statsRef.current) {
      const statItems = statsRef.current.querySelectorAll('.stat-item');
      gsap.fromTo(
        statItems,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section relative"
      style={{
        zIndex: 1,
        background: 'rgba(23, 20, 18, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: 'clamp(100px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Section label */}
        <span
          ref={labelRef}
          className="block text-[#f97316] text-[12px] uppercase tracking-[0.08em] mb-10"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          (001) ABOUT
        </span>

        {/* Heading */}
        <h2
          ref={headingRef}
          className="text-[#fafaf9] max-w-[800px]"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 600,
            fontSize: 'clamp(36px, 5vw, 64px)',
            letterSpacing: '-0.01em',
          }}
        >
          The Story So Far
        </h2>

        {/* Two-column/Grid layout with Bio & Terminal */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-[60px] items-start">
          {/* Bio text & Stats */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p
                ref={bodyLeftRef}
                className="text-[#a8a29e] leading-[1.8]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 300 }}
              >
                I&rsquo;m Muhammad Muneef, a 14-year-old tech entrepreneur and student at Green Valley Educational Institute from the scenic valleys of Kashmir. I&rsquo;m the founder of two ventures &mdash; Artlor, an online art marketplace, and Trust Finsure Accounting, a platform offering professional accounting services.
              </p>
              <p
                ref={bodyRightRef}
                className="mt-6 text-[#a8a29e] leading-[1.8]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 300 }}
              >
                Beyond business, I&rsquo;m a three-time MUN Best Delegate award winner, a national-level debater, a public speaker, and a web developer. Whether it&rsquo;s a startup, a speech, or a website &mdash; I build with purpose, passion, and precision.
              </p>
            </div>
            
            {/* Stats row */}
            <div
              ref={statsRef}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item flex flex-col">
                  <span
                    className="text-[#f97316]"
                    style={{
                      fontFamily: "'Clash Display', sans-serif",
                      fontWeight: 700,
                      fontSize: '36px',
                      lineHeight: 1.1,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[#a8a29e] mt-1 text-[11px] uppercase tracking-[0.08em] leading-tight"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Terminal */}
          <div className="lg:col-span-6 w-full">
            <div className="relative group">
              {/* Decorative terminal glow background */}
              <div className="absolute inset-0 bg-[#f97316]/5 rounded-lg filter blur-xl group-hover:bg-[#f97316]/10 transition-all duration-500 -z-10" />
              <Terminal />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
