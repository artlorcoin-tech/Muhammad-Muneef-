import { useEffect } from 'react';
import gsap from 'gsap';
import { playSound } from '../lib/sound';

interface BlogPost {
  title: string;
  date: string;
  category: string;
  readTime: string;
  content: string[]; // split by paragraphs/sections for clean rendering
}

interface BlogReaderProps {
  isOpen: boolean;
  onClose: () => void;
  post: BlogPost | null;
}

export default function BlogReader({ isOpen, onClose, post }: BlogReaderProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      playSound('click');
      // Entrance animation
      gsap.fromTo(
        '.blog-reader-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.blog-reader-panel',
        { x: '100%' },
        { x: '0%', duration: 0.5, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleClose = () => {
    playSound('toggle');
    gsap.to('.blog-reader-panel', {
      x: '100%',
      duration: 0.4,
      ease: 'power3.in',
      onComplete: onClose,
    });
    gsap.to('.blog-reader-overlay', {
      opacity: 0,
      duration: 0.4,
    });
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop overlay */}
      <div
        className="blog-reader-overlay absolute inset-0 bg-[#0c0a09]/80 backdrop-blur-md cursor-pointer"
        onClick={handleClose}
      />

      {/* Slide-out Panel */}
      <div
        className="blog-reader-panel relative w-full max-w-[680px] h-full bg-[#171412]/95 border-l border-[#fafaf9]/5 shadow-2xl flex flex-col"
        style={{
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-b border-[#fafaf9]/5 bg-[#0c0a09]/50">
          <span className="text-[11px] text-brand uppercase tracking-wider font-bold" style={{ fontFamily: "'Space Mono', monospace" }}>
            {post.category}
          </span>
          <button
            onClick={handleClose}
            className="text-[11px] text-[#a8a29e] hover:text-brand uppercase tracking-widest font-bold flex items-center gap-2 py-2 px-3 border border-[#fafaf9]/5 hover:border-brand/20 rounded transition-all duration-300"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <span>ESC // Close</span>
            <span className="text-[14px] leading-none">&times;</span>
          </button>
        </div>

        {/* Scrollable Article Area */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-10 scrollbar-thin scrollbar-thumb-brand/10">
          <header className="mb-8">
            {/* Meta row */}
            <div className="flex items-center gap-4 text-[#78716c] text-[12px] font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>
              <span>{post.date}</span>
              <span>&bull;</span>
              <span>{post.readTime} READ</span>
            </div>

            {/* Title */}
            <h1
              className="text-[#fafaf9] text-3xl sm:text-4xl font-semibold mt-4 leading-tight"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {post.title}
            </h1>

            <div className="h-[2px] w-16 bg-brand mt-6" />
          </header>

          {/* Body Content */}
          <div
            className="text-[#d6d3d1] text-[16px] sm:text-[17px] leading-relaxed font-light space-y-6"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {post.content.map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                // Subheading
                return (
                  <h3
                    key={index}
                    className="text-[#fafaf9] text-xl font-semibold pt-6"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('&gt; ')) {
                // Blockquote
                return (
                  <blockquote
                    key={index}
                    className="border-l-2 border-brand pl-5 italic text-[#a8a29e] my-6 text-[18px]"
                  >
                    {paragraph.replace('&gt; ', '')}
                  </blockquote>
                );
              }
              if (paragraph.startsWith('`') && paragraph.endsWith('`')) {
                // Code block style highlight
                return (
                  <pre
                    key={index}
                    className="bg-[#0c0a09] border border-[#fafaf9]/5 rounded-lg p-4 font-mono text-[14px] text-brand overflow-x-auto my-6"
                  >
                    {paragraph.replace(/`/g, '')}
                  </pre>
                );
              }
              return (
                <p key={index}>
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
