import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Terminal from './Terminal';
import Dashboard from './Dashboard';
import Timeline from './Timeline';
import { Download, X, ExternalLink } from 'lucide-react';
import { playSound } from '../lib/sound';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 'Teen', label: 'Life Stage' },
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
  const [isResumeOpen, setIsResumeOpen] = useState(false);

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
      aria-label="About Muhammad Muneef"
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
          className="block text-brand text-[12px] uppercase tracking-[0.08em] mb-10"
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
              {/* Profile Photo with SEO alt text */}
              <div className="mb-8 relative group">
                <div className="w-[140px] h-[140px] rounded-xl overflow-hidden border-2 border-brand/20 group-hover:border-brand/50 transition-all duration-500 relative">
                  <img
                    src="/images/muneef-profile.jpg"
                    alt="Muhammad Muneef — 14-year-old tech entrepreneur, web developer, and founder of Artlor from Kashmir, India"
                    width={140}
                    height={140}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover"
                    style={{ filter: 'grayscale(20%) contrast(1.05)' }}
                    onError={(e) => {
                      // Fallback: show styled initials if image not found
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  {/* Fallback initials avatar */}
                  <div
                    className="absolute inset-0 items-center justify-center bg-gradient-to-br from-brand/20 to-brand/5"
                    style={{
                      display: 'none',
                      fontFamily: "'Clash Display', sans-serif",
                      fontSize: '48px',
                      fontWeight: 700,
                      color: 'hsl(var(--brand-accent))',
                    }}
                  >
                    MM
                  </div>
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-brand/40 rounded-tl-sm" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-brand/40 rounded-br-sm" />
                </div>
                <span
                  className="block mt-2 text-[10px] text-[#78716c] uppercase tracking-[0.12em]"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  FOUNDER // DEVELOPER
                </span>
              </div>

              <p
                ref={bodyLeftRef}
                className="text-[#a8a29e] leading-[1.8]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 300 }}
              >
                I&rsquo;m Muhammad Muneef, a teen tech entrepreneur and student at Green Valley Educational Institute from the scenic valleys of Kashmir. I&rsquo;m the founder of two ventures &mdash; Artlor, an online art marketplace, and Trust Finsure Accounting, a platform offering professional accounting services.
              </p>
              <p
                ref={bodyRightRef}
                className="mt-6 text-[#a8a29e] leading-[1.8]"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', fontWeight: 300 }}
              >
                Beyond business, I&rsquo;m a three-time MUN Best Delegate award winner, a school speaking championship winner, a public speaker, and a web developer. Whether it&rsquo;s a startup, a speech, or a website &mdash; I build with purpose, passion, and precision.
              </p>

              {/* Resume download / view actions */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/muhammad-muneef-resume.pdf"
                  download
                  onClick={() => playSound('success')}
                  className="inline-flex items-center gap-2 text-brand border border-brand px-6 py-3 transition-all duration-300 hover:bg-brand hover:text-[#0c0a09] font-mono text-xs font-bold"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  DOWNLOAD CV (PDF) <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => {
                    playSound('click');
                    setIsResumeOpen(true);
                  }}
                  className="inline-flex items-center gap-2 text-[#fafaf9] border border-[#fafaf9]/10 px-6 py-3 bg-[#fafaf9]/5 hover:bg-[#fafaf9]/10 hover:border-[#fafaf9]/20 transition-all duration-300 font-mono text-xs font-bold"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  VIEW RESUME ONLINE <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div
              ref={statsRef}
              className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="stat-item flex flex-col">
                  <span
                    className="text-brand"
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
              <div className="absolute inset-0 bg-brand/5 rounded-lg filter blur-xl group-hover:bg-brand/10 transition-all duration-500 -z-10" />
              <Terminal />
            </div>
          </div>
        </div>

        {/* Interactive Venture Dashboard */}
        <Dashboard />

        {/* Milestone Roadmap */}
        <Timeline />
      </div>

      {/* CV Modal Overlay */}
      {isResumeOpen && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0c0a09]/90 backdrop-blur-md transition-all duration-300"
          onClick={() => setIsResumeOpen(false)}
        >
          <div 
            className="w-full max-w-[700px] max-h-[85vh] bg-[#171412] border border-[#fafaf9]/10 rounded-xl overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#fafaf9]/5 bg-[#0c0a09]/50 font-mono text-xs">
              <span className="text-[#a8a29e]">CURRICULUM VITAE // SYS.LOG</span>
              <button 
                onClick={() => { playSound('click'); setIsResumeOpen(false); }}
                className="p-1 text-[#a8a29e] hover:text-brand transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-left">
              {/* CV Header */}
              <div className="border-b border-[#fafaf9]/5 pb-6">
                <h3 className="text-3xl font-bold text-[#fafaf9]" style={{ fontFamily: "'Clash Display', sans-serif" }}>Muhammad Muneef</h3>
                <p className="text-sm text-brand font-mono mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>Tech Entrepreneur & Web Developer</p>
                
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#a8a29e] font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>
                  <div>Location: Kashmir, India</div>
                  <div>Email: muhammadmuneef2928@gmail.com</div>
                  <div>GitHub: github.com/MUHAMMADM29</div>
                  <div>LinkedIn: linkedin.com/in/muhammad-muneef</div>
                </div>
              </div>

              {/* CV Summary */}
              <div className="space-y-2">
                <h4 className="text-xs text-[#fafaf9] uppercase tracking-wider font-mono border-l-2 border-brand pl-2.5" style={{ fontFamily: "'Space Mono', monospace" }}>Profile Summary</h4>
                <p className="text-sm text-[#a8a29e] leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Ambitious teen tech entrepreneur, full-stack developer, and school speaking championship winner based in Kashmir. Founder of Artlor (art marketplace) and Trust Finsure Accounting. Specializes in building modern component architectures with React, TypeScript, and Python backend microservices. Proven leadership in academic assemblies and three-time MUN Best Delegate winner.
                </p>
              </div>

              {/* CV Work/Ventures */}
              <div className="space-y-4">
                <h4 className="text-xs text-[#fafaf9] uppercase tracking-wider font-mono border-l-2 border-brand pl-2.5" style={{ fontFamily: "'Space Mono', monospace" }}>Ventures & Experience</h4>
                
                <div className="space-y-3 font-sans">
                  <div className="border-l border-[#fafaf9]/10 pl-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-[#fafaf9]" style={{ fontFamily: "'Clash Display', sans-serif" }}>Founder & Lead Developer &mdash; Artlor</span>
                      <span className="text-xs text-brand font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>2025 - Present</span>
                    </div>
                    <p className="text-xs text-[#78716c] font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>Srinagar, Kashmir</p>
                    <p className="text-xs text-[#a8a29e] font-light leading-relaxed mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Designed and launched online marketplace connecting global art collectors directly with traditional Kashmiri papier-mâché, woodcarving, and shawl artisans. Engineered frontend catalog, profile modules, and order-dispatch routing.
                    </p>
                  </div>

                  <div className="border-l border-[#fafaf9]/10 pl-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-[#fafaf9]" style={{ fontFamily: "'Clash Display', sans-serif" }}>Founder & Accountant &mdash; Trust Finsure Accounting</span>
                      <span className="text-xs text-brand font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>2025 - Present</span>
                    </div>
                    <p className="text-xs text-[#78716c] font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>Srinagar, Kashmir</p>
                    <p className="text-xs text-[#a8a29e] font-light leading-relaxed mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Launched digital bookkeeping platform providing professional general ledgers, tax consultation records, and balance reports for small trade shops and freelancers across the local valley.
                    </p>
                  </div>
                </div>
              </div>

              {/* CV Education & Awards */}
              <div className="space-y-4">
                <h4 className="text-xs text-[#fafaf9] uppercase tracking-wider font-mono border-l-2 border-brand pl-2.5" style={{ fontFamily: "'Space Mono', monospace" }}>Education & Certifications</h4>
                
                <div className="space-y-3">
                  <div className="border-l border-[#fafaf9]/10 pl-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-[#fafaf9]" style={{ fontFamily: "'Clash Display', sans-serif" }}>Secondary Student &mdash; Green Valley Educational Institute</span>
                      <span className="text-xs text-brand font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>Active Enrollment</span>
                    </div>
                    <p className="text-xs text-[#78716c] font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>Srinagar, Kashmir</p>
                  </div>

                  <div className="border-l border-[#fafaf9]/10 pl-4 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-[#fafaf9]" style={{ fontFamily: "'Clash Display', sans-serif" }}>3x Best Delegate & Speaker Honors &mdash; Model UN & Debates</span>
                      <span className="text-xs text-brand font-mono" style={{ fontFamily: "'Space Mono', monospace" }}>2025 - 2026</span>
                    </div>
                    <p className="text-xs text-[#a8a29e] font-light leading-relaxed mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Honored with consecutive first-place speaker gavels across inter-district assemblies and debating competitions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#fafaf9]/5 bg-[#0c0a09]/30">
              <a
                href="/muhammad-muneef-resume.pdf"
                download
                onClick={() => playSound('success')}
                className="flex items-center gap-1.5 text-[#0c0a09] bg-[#fafaf9] border border-[#fafaf9] px-4 py-2 hover:bg-transparent hover:text-[#fafaf9] transition-all duration-300 font-mono text-[11px] font-bold rounded"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Download PDF <Download className="w-3.5 h-3.5" />
              </a>
              <button 
                onClick={() => { playSound('click'); setIsResumeOpen(false); }}
                className="text-[#a8a29e] border border-[#fafaf9]/10 bg-[#fafaf9]/5 hover:bg-[#fafaf9]/10 px-4 py-2 transition-all duration-300 font-mono text-[11px] font-bold rounded"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
