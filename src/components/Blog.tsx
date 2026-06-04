import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlogReader from './BlogReader';
import { playSound } from '../lib/sound';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  title: string;
  date: string;
  category: string;
  readTime: string;
  content: string[];
}

const blogPosts: BlogPost[] = [
  {
    date: 'MAY 18, 2026',
    title: 'How I Built Artlor from Scratch',
    category: 'Entrepreneurship',
    readTime: '5 MIN',
    content: [
      'Artlor started not as a business concept, but as a realization. Walking through the markets of Kashmir, I was surrounded by incredible, world-class craftsmanship—hand-painted paper-mache, intricate wood carvings, and silk carpets that take months to complete. Yet, many local artisans struggled to make a sustainable living because of their isolation from the global art market. I realized that technology could be the bridge.',
      '### The Vision & Tech Stack',
      'At 14, I decided to build a platform that would showcase this rich heritage directly to global buyers. I chose a modern, high-performance web stack to handle it: React and TypeScript for a fluid, error-free user experience, Vite for blazing fast builds, and Tailwind CSS for custom responsive layouts. I designed a clean, minimalist storefront that prioritized the visual beauty of the artwork, ensuring fast image load speeds through preloading, WebP rendering, and lazy loading strategies.',
      '### Overcoming Barriers',
      'One of the biggest hurdles was credibility. When people find out the developer and founder is a teenager, they are often skeptical. I had to make sure the platform looked and functioned with absolute professional-grade quality. I integrated secure payment gateways and created an intuitive vendor dashboard allowing Kashmiri artists, who might not be highly tech-savvy, to easily upload and manage their listings.',
      '&gt; Artlor was built to prove that geographic borders and age do not restrict your ability to build meaningful platforms.',
      'Today, Artlor connects scenic local artwork with enthusiasts worldwide, helping preserve traditional crafts and providing local artists with the global recognition they deserve.'
    ]
  },
  {
    date: 'APR 02, 2026',
    title: 'MUN debating tips that actually work',
    category: 'Debate Strategy',
    readTime: '4 MIN',
    content: [
      "Model United Nations (MUN) is often seen as a contest of who can speak loudest. But after winning 3 Best Delegate awards and participating in multiple national-level debates, I've learned that effective debating is about strategy, active listening, and precision.",
      '### 1. Structure is Your Shield',
      'An opening speech must be unforgettable. Do not waste precious seconds reciting basic facts. Use a hook—a shocking statistic or a powerful quote—followed by a clear, three-point stance. Keep your delivery paced and maintain active eye contact with the dais.',
      '### 2. The Power of Points of Information (POIs)',
      'POIs are the most underutilized tool for shifting committee momentum. When questioning a delegate, ask closed-ended questions that force them into a corner, rather than open-ended queries where they can repeat their talking points. Keep your query short—no longer than 15 seconds—to prevent them from deflecting.',
      "`POI Formulation: 'Given that your country signed the 2015 accord, why has carbon emission increased by 14% since? Please answer in yes or no.'`",
      '### 3. Active Listening & Lobbying',
      "You do not win the committee on the floor; you win it during unmoderated caucuses. Listen closely to other delegates' speeches. Note down their concerns and approach them in the lobby. Be a builder of coalitions, not a divider. By aligning diverse interests and drafting comprehensive resolutions, you establish yourself as the natural leader of the committee."
    ]
  },
  {
    date: 'JAN 24, 2026',
    title: 'Lessons from failing my first startup',
    category: 'Retrospective',
    readTime: '6 MIN',
    content: [
      'Before founding Artlor and Trust Finsure Accounting, I worked on an e-learning tool designed for local schools. It failed. I spent months writing code and designing layouts, only to realize nobody wanted the product. It was a painful but invaluable lesson.',
      '### The Traps of Building in Isolation',
      'My primary mistake was building in a vacuum. I fell in love with my code rather than the problem. I assumed that because I was a student, I knew exactly what schools needed. I didn\'t. I had not conducted user interviews or validated the demand with teachers and administrators.',
      '### Balancing School and Code',
      'As a student at Green Valley Educational Institute, balancing schoolwork, debate clubs, and writing code is extremely demanding. When my first project failed to gain traction, it felt like a waste of time. But I realized failure is simply data. I learned how to iterate quickly, how to pivot when metrics look poor, and how to manage my time strictly using Pomodoro and focus blocks.',
      '&gt; If you aren\'t embarrassed by the first version of your product, you shipped too late.',
      'Now, with Artlor and Trust Finsure Accounting, I build a Minimum Viable Product (MVP) first, test it with real users, gather feedback, and only write scaled code once the concept is validated. Failure is not the opposite of success; it is a prerequisite.'
    ]
  },
];

export default function Blog() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

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

  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  return (
    <>
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
              className="block text-brand text-[12px] uppercase tracking-[0.08em] mb-10"
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
                onClick={() => handlePostClick(post)}
                className="blog-card group flex items-center py-8 cursor-pointer transition-transform duration-300 interactive-item"
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
                  if (title) title.classList.add('text-brand');
                  playSound('hover');
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
                  const title = e.currentTarget.querySelector('.blog-title');
                  if (title) title.classList.remove('text-brand');
                }}
              >
                {/* Date */}
                <span
                  className="text-[#78716c] text-[12px] uppercase shrink-0 w-[140px] hidden sm:block"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  <time>{post.date}</time>
                </span>

                {/* Title */}
                <h3
                  className="blog-title text-[#fafaf9] transition-colors duration-300 text-left pr-4"
                  style={{
                    fontFamily: "'Clash Display', sans-serif",
                    fontWeight: 600,
                    fontSize: '22px',
                  }}
                >
                  {post.title}
                </h3>

                {/* Arrow */}
                <span className="ml-auto text-[#a8a29e] text-[18px] group-hover:text-brand transition-colors duration-300" aria-hidden="true">
                  &rarr;
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Full article reader drawer */}
      <BlogReader
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        post={selectedPost}
      />
    </>
  );
}
