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
    readTime: '7 MIN',
    content: [
      'I am Muhammad Muneef, a teenage tech entrepreneur from Kashmir, India — and Artlor is my answer to a problem I watched unfold my entire childhood. Walking through the bustling markets of Srinagar and the quieter lanes of rural Kashmir, I was surrounded by breathtaking craftsmanship: hand-painted papier-mâché boxes, intricate walnut wood carvings, and pashmina shawls that take months to weave by hand. Yet most of these artisans — many of them generational masters — were barely making a living. Their art was world-class; their reach was not. That disconnect ignited something in me.',
      '### The Spark: Why I Started Artlor',
      'The idea for Artlor came during a school break in early 2025. I was helping my family visit a local artisan in downtown Srinagar who carved wooden trays. His work was museum-worthy, but he told me he had never sold a single piece online. He didn\'t know how. That night, I opened my laptop and started wireframing what would become Artlor — a digital art marketplace designed to bridge the gap between Kashmir\'s hidden creative talent and the global audience that would love to own their work.',
      '### Choosing the Tech Stack',
      'As a teenager, I was already comfortable with React and TypeScript from building smaller projects. For Artlor, I needed a stack that could handle a dynamic product catalog, image-heavy pages, and fast load times on mobile devices — since many Kashmiri users access the web on phones with modest internet speeds. I chose React with TypeScript for type-safe, component-driven development. Vite gave me blazing-fast builds and hot module replacement during development. I used Tailwind CSS for responsive, utility-first styling that let me prototype rapidly without fighting CSS specificity wars.',
      'For the backend, I evaluated several options before settling on a serverless architecture with API routes. I designed a clean, RESTful API layer for product listings, artist profiles, and order management. Image optimization was critical — I implemented WebP conversion, lazy loading with intersection observers, and responsive srcset attributes to ensure artwork loaded crisp and fast on any device.',
      '### Overcoming the Age Barrier',
      'Here is the reality nobody talks about: when you are a teenager and you tell someone you built a production-grade marketplace, they do not believe you. I faced this skepticism from potential partner artists, payment gateway providers, and even well-meaning adults who thought I should "focus on studies first." My response was simple — I let the product speak. I made sure Artlor looked, felt, and performed at a level indistinguishable from platforms built by full teams of adult engineers. Every pixel, every interaction, every page load time was meticulously optimized.',
      'I integrated secure payment processing, built an intuitive vendor dashboard that even non-tech-savvy artisans could navigate, and added multi-language support planning for Urdu and Kashmiri interfaces in the future. Accessibility was also a priority — I followed WCAG guidelines to ensure the platform was usable by everyone.',
      '### The Design Philosophy',
      'Artlor\'s design language is minimalist by intention. The artwork is the hero of every page. I used a muted, warm color palette — deep charcoals, soft creams, and accent copper tones — that lets the vibrant colors of Kashmiri art pop without competing for attention. The typography pairs a modern geometric sans-serif for UI elements with a refined serif for artist bios and descriptions, creating a gallery-like browsing experience.',
      '### Impact and What Comes Next',
      'Today, Artlor connects scenic local artwork with enthusiasts worldwide. More importantly, it gives Kashmiri artisans something they have never had: a direct digital storefront with global visibility. Every time an order comes through, it validates the core thesis — that geography should not limit talent, and age should not limit ambition.',
      '&gt; Artlor was built to prove that geographic borders and age do not restrict your ability to build meaningful platforms. I am a teenager, I am from Kashmir, and I am just getting started.',
      'Looking ahead, I am working on adding artist video profiles, an AR preview feature for wall art, and expanding the marketplace beyond Kashmir to include artisans from other underrepresented regions across South Asia. The mission remains the same: give every artist a fighting chance to reach the world. If you are an artisan, a buyer, or just someone who believes in this vision — I want to hear from you.'
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
              (004) BLOG
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
