import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, ShieldAlert, BookOpen, GraduationCap, Play } from 'lucide-react';
import { playSound } from '../lib/sound';

gsap.registerPlugin(ScrollTrigger);

interface Credential {
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon: React.ReactNode;
  category: 'DEBATING' | 'ENTREPRENEURSHIP' | 'ACADEMICS';
}

const credentials: Credential[] = [
  {
    title: '3x Best Delegate Award',
    issuer: 'Model United Nations (MUN) Delegations',
    date: '2025 - 2026',
    description: 'Secured three consecutive Best Delegate honors in competitive regional and national model United Nations simulations, representing complex diplomatic councils.',
    icon: <Award className="w-6 h-6 text-brand" />,
    category: 'DEBATING',
  },
  {
    title: 'School Speaking Championship Winner',
    issuer: 'School Speaker Forum & Literary Association',
    date: '2025',
    description: 'Awarded first place in school-level speaking fixtures, displaying strong public speaking, research, and argumentative skills.',
    icon: <GraduationCap className="w-6 h-6 text-brand" />,
    category: 'DEBATING',
  },
  {
    title: 'Venture Founder & Strategic Lead',
    issuer: 'Artlor & Trust Finsure Platforms',
    date: '2025 - Active',
    description: 'Spearheaded two software-supported enterprises from Kashmir, managing full-stack architectural pipelines and operational fiscal frameworks.',
    icon: <BookOpen className="w-6 h-6 text-brand" />,
    category: 'ENTREPRENEURSHIP',
  },
];

export default function Certifications() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
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

    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.cert-card');
      gsap.fromTo(
        cards,
        { y: 50, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: 'back.out(1.1)',
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
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
      id="certifications"
      ref={sectionRef}
      className="relative"
      aria-label="Certifications and Awards of Muhammad Muneef"
      style={{
        zIndex: 1,
        background: 'rgba(23, 20, 18, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
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
            (003) CREDENTIALS
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
            Awards &amp; Recognition
          </h2>
          <p
            className="mt-6 text-[#a8a29e] max-w-[600px]"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', lineHeight: 1.65 }}
          >
            Milestones and professional benchmarks secured across model diplomacy, national public speaking, and venture engineering.
          </p>
        </div>

        {/* Credentials Grid */}
        <div
          ref={cardsRef}
          className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {credentials.map((cred, idx) => (
            <div
              key={cred.title}
              onClick={() => playSound('click')}
              className="cert-card group relative rounded-xl border border-[#fafaf9]/5 bg-[#171412]/60 p-8 transition-all duration-400 hover:border-brand/35 hover:bg-[#171412]/80 hover:translate-y-[-4px] cursor-pointer flex flex-col justify-between"
              style={{
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Outer decorative neon border corner */}
              <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t border-r border-[#fafaf9]/10 group-hover:border-brand/40 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b border-l border-[#fafaf9]/10 group-hover:border-brand/40 transition-colors duration-300" />
              
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-3.5 rounded-lg bg-[#0c0a09]/80 border border-[#fafaf9]/5 group-hover:border-brand/20 transition-all duration-300">
                    {cred.icon}
                  </div>
                  <span
                    className="text-[9px] uppercase tracking-[0.15em] text-[#78716c] font-bold border border-[#fafaf9]/5 rounded px-2.5 py-0.5 font-mono"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {cred.category}
                  </span>
                </div>

                <h3
                  className="mt-6 text-[#fafaf9] text-xl font-semibold leading-snug group-hover:text-brand transition-colors duration-300"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {cred.title}
                </h3>
                
                <span
                  className="block mt-1.5 text-xs text-[#a8a29e]/80 font-mono font-medium"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {cred.issuer}
                </span>

                <p
                  className="mt-4 text-[14px] text-[#a8a29e] leading-relaxed font-light"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {cred.description}
                </p>
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-[#fafaf9]/5 pt-4">
                <span
                  className="text-xs text-[#78716c] font-mono"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  Issued: {cred.date}
                </span>
                <span className="text-[10px] text-brand uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Active <Play className="w-2 h-2 fill-current" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
