import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { playSound } from '../lib/sound';

gsap.registerPlugin(ScrollTrigger);

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'Who is Muhammad Muneef?',
    answer: 'Muhammad Muneef (commonly known as Muneef) is a teen tech entrepreneur, web developer, and school speaking championship winner from Kashmir, India. He is a student at Green Valley Educational Institute and the founder of two startups: Artlor (an online art marketplace) and Trust Finsure Accounting (a professional accounting services platform). He is also a 3-time MUN Best Delegate award winner.',
  },
  {
    question: 'What is Muneef known for?',
    answer: 'Muneef is known for being one of the youngest tech entrepreneurs from Kashmir. As a teenager, he has founded two startups (Artlor and Trust Finsure Accounting), won 3 MUN Best Delegate awards, competed as a school debater, and builds professional websites using modern technologies like React, TypeScript, and Python.',
  },
  {
    question: 'What is Artlor?',
    answer: 'Artlor (artlor.art) is an online art marketplace founded by Muhammad Muneef. It bridges artists and art lovers by showcasing Kashmir\'s creative talent to a global audience, enabling artists to sell and share their work online.',
  },
  {
    question: 'What is Trust Finsure Accounting?',
    answer: 'Trust Finsure Accounting is a startup founded by Muhammad Muneef that simplifies accounting and financial services for individuals and businesses. The platform offers professional accounting services to help businesses maintain clean books and achieve clear growth.',
  },
  {
    question: 'Where is Muhammad Muneef from?',
    answer: 'Muhammad Muneef is from the scenic valleys of Kashmir in Jammu & Kashmir, India. He studies at Green Valley Educational Institute (GVEI) and runs his startups from Kashmir.',
  },
  {
    question: 'How old is Muneef?',
    answer: 'Muhammad Muneef is a teenager (born in 2012). Despite his young age, he has already founded two startups, won multiple debating awards, and built professional websites as a web developer.',
  },
];

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          stagger: 0.1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }

    if (accordionRef.current) {
      const items = accordionRef.current.querySelectorAll('.faq-item');
      gsap.fromTo(
        items,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: accordionRef.current,
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

  const handleToggle = (index: number) => {
    playSound('click');
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative"
      aria-label="Frequently Asked Questions about Muhammad Muneef"
      style={{
        zIndex: 1,
        background: 'rgba(12, 10, 9, 0.95)',
        padding: 'clamp(100px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div className="max-w-[800px] mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span
            className="block text-brand text-[12px] uppercase tracking-[0.08em] mb-10"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            (006) FAQ
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
            Frequently Asked
          </h2>
          <p
            className="mt-6 text-[#a8a29e] max-w-[600px] mx-auto text-center"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', lineHeight: 1.65 }}
          >
            Quick answers to key inquiries about my background, ventures, and expertise.
          </p>
        </div>

        {/* Accordion container */}
        <div ref={accordionRef} className="space-y-4">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="faq-item rounded-xl border border-[#fafaf9]/5 bg-[#171412]/50 hover:bg-[#171412]/75 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => handleToggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 pr-4">
                    <HelpCircle className={`w-5 h-5 transition-colors duration-300 ${isOpen ? 'text-brand' : 'text-[#78716c]'}`} />
                    <span
                      className={`text-[16px] font-semibold transition-colors duration-300 ${isOpen ? 'text-brand' : 'text-[#fafaf9] hover:text-brand'}`}
                      style={{ fontFamily: "'Clash Display', sans-serif" }}
                    >
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#a8a29e] transition-transform duration-500 ${isOpen ? 'rotate-180 text-brand' : ''}`}
                  />
                </button>

                {/* Animated expandable body */}
                <div
                  className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] border-t border-[#fafaf9]/5 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}
                  style={{
                    transitionProperty: 'max-height, opacity, border-color',
                  }}
                >
                  <div className="p-6 bg-[#0c0a09]/30">
                    <p
                      className="text-[14px] text-[#a8a29e] leading-relaxed font-light"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
