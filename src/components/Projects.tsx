import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { use3DTilt } from '../hooks/use3DTilt';
import { playSound } from '../lib/sound';
import CaseStudyModal from './CaseStudyModal';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    name: 'Artlor',
    category: 'Startup / Art Marketplace',
    description: "An online platform bridging artists and art lovers. Kashmir's creative talent, global reach.",
    link: 'https://www.artlor.art',
    image: '/images/kashmir.jpg',
    imageAlt: 'Scenic Kashmir valley landscape representing Artlor art marketplace — connecting Kashmiri artists with global art lovers',
  },
  {
    name: 'Trust Finsure Accounting',
    category: 'Startup / Financial Services',
    description: 'Simplifying accounting for individuals and businesses. Clean books, clear growth.',
    link: '#',
    image: '/images/architecture.jpg',
    imageAlt: 'Modern architecture symbolizing structured financial services by Trust Finsure Accounting',
  },
];

interface ProjectCardProps {
  project: typeof projects[0];
  index: number;
  onEnter: (el: HTMLDivElement | null) => void;
  onSelect: (name: string) => void;
}

function ProjectCard({ project, onEnter, onSelect }: ProjectCardProps) {
  // Wrap card with 3D tilt hook
  const cardRef = use3DTilt<HTMLDivElement>(6);

  const handleClick = () => {
    playSound('success');
    onSelect(project.name);
  };

  return (
    <div
      ref={(el) => {
        // Bind both refs: local tilt ref and parent stagger ref
        (cardRef as any).current = el;
        onEnter(el);
      }}
      className="group cursor-pointer rounded-xl overflow-hidden border border-[#fafaf9]/5 bg-[#171412]/60 backdrop-blur-md transition-all duration-500 hover:border-brand/30 relative interactive-item select-none"
      style={{
        transform: 'translateY(0)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.4)',
      }}
      onClick={handleClick}
      onMouseEnter={() => {
        playSound('hover');
      }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/10' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#171412] to-transparent z-10 opacity-60" />
        <img
          src={project.image}
          alt={project.imageAlt}
          width={640}
          height={400}
          loading="lazy"
          decoding="async"
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
          className="block text-brand text-[11px] uppercase tracking-[0.15em]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {project.category}
        </span>
        <h3
          className="text-[#fafaf9] mt-2 group-hover:text-brand transition-colors duration-300"
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
        <div className="mt-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-[#fafaf9] group-hover:text-brand transition-colors duration-300 text-[12px] font-bold uppercase tracking-[0.15em]" style={{ fontFamily: "'Space Mono', monospace" }}>
            <span>OPEN CASE CONSOLE</span>
            <span className="transform group-hover:translate-x-2 transition-transform duration-300">&rarr;</span>
          </div>
          {project.link && project.link !== '#' && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 border border-brand/40 text-brand hover:bg-brand hover:text-[#0c0a09]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              View live
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
                <path d="M3.5 1.5H10.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.5 1.5L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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
    <>
      <section
        id="projects"
        ref={sectionRef}
        className="relative"
        aria-label="Projects and startups by Muhammad Muneef"
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
              (003) PROJECTS
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
              <ProjectCard
                key={project.name}
                project={project}
                index={i}
                onSelect={(name) => setSelectedProject(name)}
                onEnter={(el) => {
                  cardsRef.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Deck Drawer */}
      <CaseStudyModal
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        projectName={selectedProject}
      />
    </>
  );
}
