import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playSound, playNote } from '../lib/sound';
import { Award, Briefcase, Code, Milestone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface TimelineEvent {
  year: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  freq: number;
}

const events: TimelineEvent[] = [
  {
    year: '2024',
    title: 'Genesis: Commenced Web Engineering',
    icon: <Code className="w-5 h-5 text-[#fafaf9]" />,
    subtitle: 'Self-Taught Stack',
    description: 'Began building basic script engines, mastering HTML/CSS/JavaScript and transitioning to React, TypeScript, and Git.',
    freq: 440, // A4
  },
  {
    year: '2025',
    title: 'Launch of Artlor Art Marketplace',
    icon: <Briefcase className="w-5 h-5 text-[#fafaf9]" />,
    subtitle: 'Co-Founder & Lead Developer',
    description: "Designed and launched Kashmir's online art marketplace connecting global art buyers directly with native Kashmiri craftsmen.",
    freq: 554.37, // C#5
  },
  {
    year: '2025',
    title: 'Founded Trust Finsure Accounting & Debate Success',
    icon: <Award className="w-5 h-5 text-[#fafaf9]" />,
    subtitle: 'Co-Founder & National Debater',
    description: 'Launched streamlined financial consulting services. Participated in national debate tournaments and secured multiple speaking awards.',
    freq: 659.25, // E5
  },
  {
    year: '2026',
    title: '3x MUN Best Delegate & Debating Excellence',
    icon: <Milestone className="w-5 h-5 text-[#fafaf9]" />,
    subtitle: 'National Debater & MUN Lead',
    description: 'Participated in prestigious Model United Nations (MUN) conferences and national-level debate competitions, securing three consecutive Best Delegate awards and leading regional speaker committees.',
    freq: 880, // A5
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Timeline line drawing animation
    gsap.fromTo(
      '.timeline-line',
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 75%',
          end: 'bottom 65%',
          scrub: true,
        },
      }
    );

    // Staggered cards animation
    const cards = el.querySelectorAll('.timeline-card');
    cards.forEach((card, idx) => {
      gsap.set(card, { 
        transformOrigin: window.innerWidth < 768 ? 'left center' : (idx % 2 === 0 ? 'right center' : 'left center'), 
        perspective: 1000 
      });
      gsap.fromTo(
        card,
        {
          opacity: 0,
          scale: 0.8,
          rotateY: window.innerWidth < 768 ? 20 : (idx % 2 === 0 ? -25 : 25),
          x: window.innerWidth < 768 ? 30 : (idx % 2 === 0 ? -65 : 65),
        },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          x: 0,
          duration: 1.1,
          ease: 'back.out(1.1)',
          scrollTrigger: {
            trigger: card,
            start: 'top 82%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, []);

  return (
    <div className="timeline-container relative mt-24 sm:mt-32 max-w-[1000px] mx-auto px-4 select-none">
      {/* Section Title */}
      <div className="text-center mb-16">
        <h3
          className="text-[#fafaf9] text-2xl sm:text-3xl font-semibold"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          Interactive Milestone Roadmap
        </h3>
        <p
          className="text-xs text-[#a8a29e] mt-2 tracking-widest uppercase"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          Click nodes to synthesize audio frequencies / view journey logs
        </p>
      </div>

      <div ref={containerRef} className="relative mt-12">
        {/* Central timeline axis line */}
        <div
          className="timeline-line absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-brand origin-top"
          style={{ transform: 'translateX(-50%)' }}
        />

        {/* Timeline Events list */}
        <div className="space-y-12 md:space-y-0">
          {events.map((event, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={event.year}
                className={`relative flex flex-col md:flex-row items-start md:items-center ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Left/Right spacer for layout centering */}
                <div className="hidden md:block w-1/2" />

                {/* Timeline node dot */}
                <div
                  onClick={() => {
                    playNote(event.freq, 'triangle', 0.5);
                    playSound('success');
                  }}
                  onMouseEnter={() => {
                    playNote(event.freq, 'sine', 0.2);
                  }}
                  className="absolute left-6 md:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full border border-brand bg-[#0c0a09] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-125 hover:bg-brand/15 hover:shadow-[0_0_15px_hsl(var(--brand-accent))] z-10"
                >
                  {event.icon}
                </div>

                {/* Event Card */}
                <div className="timeline-card w-full md:w-1/2 pl-16 md:pl-0 md:px-12">
                  <div
                    onClick={() => {
                      playNote(event.freq, 'sine', 0.3);
                      playSound('click');
                    }}
                    className="p-6 rounded-xl border border-[#fafaf9]/5 bg-[#171412]/50 hover:bg-[#171412]/75 hover:border-brand/20 transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="text-brand font-bold text-lg font-mono"
                        style={{ fontFamily: "'Space Mono', monospace" }}
                      >
                        [{event.year}]
                      </span>
                      <span className="text-xs text-[#a8a29e] uppercase tracking-wider font-mono">
                        {event.subtitle}
                      </span>
                    </div>

                    <h4
                      className="text-[#fafaf9] text-lg font-semibold mt-2 leading-tight"
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {event.title}
                    </h4>

                    <p
                      className="mt-3 text-[14px] text-[#a8a29e] leading-relaxed font-light"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
