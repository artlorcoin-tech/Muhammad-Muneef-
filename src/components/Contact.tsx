import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playSound } from '../lib/sound';
import { transmitSignal } from '../lib/supabase';
import { Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { label: 'LINKEDIN', href: 'https://linkedin.com/in/muhammad-muneef' },
  { label: 'GITHUB', href: 'https://github.com/MUHAMMADM29' },
  { label: 'INSTAGRAM', href: 'https://instagram.com/m__un__ee_f' },
  { label: 'EMAIL', href: 'mailto:muhammadmuneef2928@gmail.com' },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [spamBlocked, setSpamBlocked] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (contentRef.current) {
      const children = contentRef.current.children;
      gsap.fromTo(
        children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
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

    // Check rate limit spam prevention
    const lastSent = localStorage.getItem('muneef_contact_last_sent');
    if (lastSent) {
      const diff = Date.now() - parseInt(lastSent, 10);
      if (diff < 60000) {
        setSpamBlocked(true);
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (spamBlocked) {
      playSound('toggle');
      setErrorMessage('Spam prevention active. Please wait 60 seconds between submissions.');
      setStatus('error');
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      playSound('toggle');
      setErrorMessage('Please fill in all required fields (Name, Email, Message).');
      setStatus('error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      playSound('toggle');
      setErrorMessage('Please provide a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    playSound('click');

    try {
      const result = await transmitSignal({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (result.success) {
        setStatus('success');
        playSound('success');
        localStorage.setItem('muneef_contact_last_sent', Date.now().toString());
        setSpamBlocked(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(result.error || 'Supabase transmission failed.');
      }
    } catch (err) {
      setStatus('error');
      playSound('toggle');
      setErrorMessage(
        err instanceof Error
          ? `Transmission failed: ${err.message}`
          : 'Could not transmit signal. Please send direct email instead.'
      );
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative"
      aria-label="Contact Muhammad Muneef"
      style={{
        zIndex: 1,
        background: 'rgba(12, 10, 9, 0.95)',
        padding: 'clamp(100px, 12vw, 160px) clamp(24px, 5vw, 80px)',
      }}
    >
      <div ref={contentRef} className="max-w-[1200px] mx-auto text-center">
        {/* Section label */}
        <span
          className="block text-brand text-[12px] uppercase tracking-[0.08em]"
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          (007) CONTACT
        </span>

        {/* Heading */}
        <h2
          className="mt-8 text-[#fafaf9]"
          style={{
            fontFamily: "'Clash Display', sans-serif",
            fontWeight: 700,
            fontSize: 'clamp(42px, 7vw, 96px)',
            letterSpacing: '-0.02em',
          }}
        >
          Let&rsquo;s Build Something
        </h2>

        {/* Subheading */}
        <p
          className="mt-6 text-[#a8a29e] max-w-[560px] mx-auto"
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '18px', lineHeight: 1.65 }}
        >
          Whether it&rsquo;s a startup idea, a website project, or a debate collaboration &mdash;
          I&rsquo;m always open to meaningful conversations.
        </p>

        {/* Interactive Form Component */}
        <div className="max-w-[600px] mx-auto mt-12 bg-[#171412]/50 border border-[#fafaf9]/5 rounded-xl p-6 sm:p-8 backdrop-blur-md shadow-2xl text-left">
          <form onSubmit={handleSubmit} className="space-y-5">
            {status === 'success' && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-sm">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span>Transmission received successfully. I will inspect the logs and contact you shortly.</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-[#78716c] uppercase tracking-[0.08em] font-mono mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  required
                  className="w-full bg-[#0c0a09]/70 border border-[#fafaf9]/10 rounded-lg px-4 py-3 text-sm text-[#fafaf9] placeholder-[#57534e] focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all font-mono"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#78716c] uppercase tracking-[0.08em] font-mono mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                  className="w-full bg-[#0c0a09]/70 border border-[#fafaf9]/10 rounded-lg px-4 py-3 text-sm text-[#fafaf9] placeholder-[#57534e] focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all font-mono"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-[#78716c] uppercase tracking-[0.08em] font-mono mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
                className="w-full bg-[#0c0a09]/70 border border-[#fafaf9]/10 rounded-lg px-4 py-3 text-sm text-[#fafaf9] placeholder-[#57534e] focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all font-mono"
                style={{ fontFamily: "'Space Mono', monospace" }}
              />
            </div>

            <div>
              <label className="block text-[10px] text-[#78716c] uppercase tracking-[0.08em] font-mono mb-2" style={{ fontFamily: "'Space Mono', monospace" }}>
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message..."
                required
                rows={5}
                className="w-full bg-[#0c0a09]/70 border border-[#fafaf9]/10 rounded-lg px-4 py-3 text-sm text-[#fafaf9] placeholder-[#57534e] focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-all font-mono resize-none"
                style={{ fontFamily: "'Space Mono', monospace" }}
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full text-brand border border-brand py-3.5 transition-all duration-300 hover:bg-brand hover:text-[#0c0a09] disabled:border-[#78716c] disabled:text-[#78716c] disabled:hover:bg-transparent flex items-center justify-center gap-2 uppercase tracking-[0.1em] text-xs font-mono font-bold"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {status === 'submitting' ? (
                <>
                  TRANSMITTING <Loader className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  TRANSMIT SIGNAL <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
          <div className="mt-4 text-center">
            <span className="text-[10px] text-[#57534e] font-mono">
              Or fallback direct email: <a href="mailto:muhammadmuneef2928@gmail.com" className="text-brand hover:underline">muhammadmuneef2928@gmail.com</a>
            </span>
          </div>
        </div>

        {/* Social links */}
        <nav className="mt-16 flex flex-wrap justify-center gap-10" aria-label="Social media links">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${link.label.charAt(0) + link.label.slice(1).toLowerCase()} profile`}
              className="text-[#a8a29e] hover:text-brand transition-colors duration-300 text-[12px] uppercase tracking-[0.08em]"
              style={{ fontFamily: "'Space Mono', monospace" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Footer */}
        <footer className="mt-28">
          <p
            className="text-[#78716c] text-[11px] uppercase tracking-[0.06em]"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            &copy; 2026 Muhammad Muneef. Built with passion from Kashmir.
          </p>
        </footer>
      </div>
    </section>
  );
}
