import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const blogPosts = [
  {
    date: 'COMING SOON',
    title: 'How I Built Artlor from Scratch',
  },
  {
    date: 'COMING SOON',
    title: 'MUN debating tips that actually work',
  },
  {
    date: 'COMING SOON',
    title: 'Lessons from failing my first startup',
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

    // Blog cards entrance
    if (cardsRef.current) {
      const cards = cardsRef.current.querySelectorAll('.blog-card');
      gsap.fromTo(
        cards,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.1,
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
      id="blog"
      ref={sectionRef}
      className="relative"
      aria-label="Blog posts and essays"
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
            className="block text-[#f97316] text-[12px] uppercase tracking-[0.08em] mb-10"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            (003) BLOG
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
            Thoughts &amp; Essays
          </h2>
          <p
            className="mt-6 text-[#a8a29e] max-w-[600px]"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', lineHeight: 1.65 }}
          >
            Writing about entrepreneurship, debating, web development, and the journey of
            building things from scratch.
          </p>
        </div>

        {/* Blog cards */}
        <div ref={cardsRef} className="mt-16 max-w-[800px]" role="list">
          {blogPosts.map((post, i) => (
            <article
              key={i}
              className="blog-card group flex items-center py-8 cursor-pointer transition-transform duration-300"
              role="listitem"
              style={{
                borderBottom:
                  i < blogPosts.length - 1
                    ? '1px solid rgba(168, 162, 158, 0.2)'
                    : 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(8px)';
                const title = e.currentTarget.querySelector('.blog-title');
                if (title) title.classList.add('text-[#f97316]');
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                const title = e.currentTarget.querySelector('.blog-title');
                if (title) title.classList.remove('text-[#f97316]');
              }}
            >
              {/* Date */}
              <span
                className="text-[#78716c] text-[12px] uppercase shrink-0 w-[120px] hidden sm:block"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                <time>{post.date}</time>
              </span>

              {/* Title */}
              <h3
                className="blog-title text-[#fafaf9] transition-colors duration-300"
                style={{
                  fontFamily: "'Clash Display', sans-serif",
                  fontWeight: 600,
                  fontSize: '22px',
                }}
              >
                {post.title}
              </h3>

              {/* Arrow */}
              <span className="ml-auto text-[#a8a29e] text-[18px] group-hover:text-[#f97316] transition-colors duration-300" aria-hidden="true">
                &rarr;
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
