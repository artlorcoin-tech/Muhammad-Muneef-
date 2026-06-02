import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    name: 'Artlor',
    category: 'Startup / Art Marketplace',
    description: "An online platform bridging artists and art lovers. Kashmir's creative talent, global reach.",
    link: 'https://www.artlor.art',
    image: '/images/kashmir.jpg',
  },
  {
    name: 'Trust Finsure Accounting',
    category: 'Startup / Financial Services',
    description: 'Simplifying accounting for individuals and businesses. Clean books, clear growth.',
    link: '#',
    image: '/images/architecture.jpg',
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

    // Card entrances
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { x: i === 0 ? -60 : 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
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
      id="projects"
      ref={sectionRef}
      className="relative"
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
            className="block text-[#f97316] text-[12px] uppercase tracking-[0.08em] mb-10"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            (002) PROJECTS
          </span>
          <h2
            className="text-[#fafaf9]"
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontWeight: 600,
              fontSize: 'clamp(36px, 5vw, 64px)',
              letterSpacing: '-0.01em',
            }}
          >
            What I&rsquo;ve Built
          </h2>
        </div>

        {/* Project grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, i) => (
            <div
              key={project.name}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="group cursor-pointer rounded-xl overflow-hidden border border-[#fafaf9]/5 bg-[#171412]/60 backdrop-blur-md transition-all duration-500 hover:border-[#f97316]/30"
              style={{
                transform: 'translateY(0)',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
              }}
              onClick={() => {
                if (project.link && project.link !== '#') {
                  window.open(project.link, '_blank', 'noopener,noreferrer');
                }
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px)';
                (e.currentTarget as HTMLElement).style.boxShadow =
                  '0 20px 50px rgba(249, 115, 22, 0.15)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.4)';
              }}
            >
              {/* Image area */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-[#171412] to-transparent z-10 opacity-60" />
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  style={{ filter: 'grayscale(50%) contrast(1.1)' }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.filter = 'grayscale(0%) contrast(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.filter = 'grayscale(50%) contrast(1.1)';
                  }}
                />
              </div>

              {/* Content area */}
              <div className="p-8 relative">
                <span
                  className="block text-[#f97316] text-[11px] uppercase tracking-[0.15em]"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {project.category}
                </span>
                <h3
                  className="text-[#fafaf9] mt-2 group-hover:text-[#f97316] transition-colors duration-300"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 600,
                    fontSize: '28px',
                  }}
                >
                  {project.name}
                </h3>
                <p
                  className="mt-3 text-[#a8a29e] leading-[1.7] text-[15px]"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {project.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#fafaf9] group-hover:text-[#f97316] transition-colors duration-300 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ fontFamily: "'Space Mono', monospace" }}>
                  <span>VISIT SITE</span>
                  <span className="transform group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
