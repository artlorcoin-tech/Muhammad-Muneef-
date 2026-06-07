import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  icon: string;
  proficiency: number; // 0–100
  category: string;
}

const skills: Skill[] = [
  { name: 'React', icon: '⚛️', proficiency: 92, category: 'Frontend' },
  { name: 'TypeScript', icon: '🔷', proficiency: 88, category: 'Language' },
  { name: 'JavaScript', icon: '⚡', proficiency: 95, category: 'Language' },
  { name: 'Python', icon: '🐍', proficiency: 82, category: 'Language' },
  { name: 'Next.js', icon: '▲', proficiency: 78, category: 'Framework' },
  { name: 'Tailwind CSS', icon: '🎨', proficiency: 90, category: 'Styling' },
  { name: 'Node.js', icon: '🟢', proficiency: 80, category: 'Backend' },
  { name: 'Git & GitHub', icon: '🔀', proficiency: 85, category: 'Tooling' },
  { name: 'Vite', icon: '⚡', proficiency: 88, category: 'Tooling' },
  { name: 'Figma', icon: '🖌️', proficiency: 75, category: 'Design' },
  { name: 'GSAP', icon: '🎬', proficiency: 82, category: 'Animation' },
  { name: 'REST APIs', icon: '🔗', proficiency: 86, category: 'Backend' },
];

const categories = [...new Set(skills.map((s) => s.category))];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Header entrance
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Skill cards stagger entrance
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.skill-card');
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    // Animated progress bars
    barsRef.current.forEach((bar) => {
      if (!bar) return;
      const targetWidth = bar.dataset.proficiency || '0';
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: `${targetWidth}%`,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative"
      aria-label="Skills and tech stack of Muhammad Muneef"
      style={{
        zIndex: 1,
        background: 'rgba(12, 10, 9, 0.95)',
        padding: 'clamp(100px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div ref={headerRef}>
          <span
            className="block text-brand text-[12px] uppercase tracking-[0.08em] mb-10"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            (002) SKILLS
          </span>
          <h2
            className="text-[#fafaf9] max-w-[800px]"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(36px, 5vw, 64px)',
              letterSpacing: '-0.01em',
            }}
          >
            Tech Stack &amp; Tools
          </h2>
          <p
            className="mt-6 text-[#a8a29e] max-w-[600px]"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', lineHeight: 1.65 }}
          >
            The technologies I use to build fast, modern, and scalable web experiences — from
            frontend frameworks to design tools and deployment pipelines.
          </p>
        </div>

        {/* Category legend */}
        <div className="mt-12 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-[10px] uppercase tracking-[0.12em] text-[#78716c] border border-[#fafaf9]/5 rounded-full px-4 py-1.5"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Skills grid */}
        <div
          ref={gridRef}
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {skills.map((skill, i) => (
            <div
              key={skill.name}
              className="skill-card group relative rounded-xl border border-[#fafaf9]/5 bg-[#171412]/60 backdrop-blur-md p-6 transition-all duration-400 hover:border-brand/30 hover:bg-[#171412]/80 cursor-default"
              style={{
                boxShadow: '0 2px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-xl bg-brand/0 group-hover:bg-brand/[0.03] transition-all duration-500 pointer-events-none" />

              {/* Top row: icon + name + category */}
              <div className="relative flex items-center gap-3">
                <span className="text-[24px] leading-none" aria-hidden="true">
                  {skill.icon}
                </span>
                <div className="flex-1">
                  <h3
                    className="text-[#fafaf9] text-[16px] font-semibold group-hover:text-brand transition-colors duration-300"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {skill.name}
                  </h3>
                  <span
                    className="text-[10px] text-[#78716c] uppercase tracking-[0.1em]"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {skill.category}
                  </span>
                </div>
                <span
                  className="text-[13px] text-brand font-bold tabular-nums"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {skill.proficiency}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="relative mt-4 h-[3px] w-full bg-[#fafaf9]/5 rounded-full overflow-hidden">
                <div
                  ref={(el) => {
                    if (el) barsRef.current[i] = el;
                  }}
                  data-proficiency={skill.proficiency}
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, hsl(var(--brand-accent)) 0%, hsl(var(--brand-accent) / 0.6) 100%)`,
                    width: '0%',
                    boxShadow: '0 0 8px hsl(var(--brand-accent) / 0.3)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
