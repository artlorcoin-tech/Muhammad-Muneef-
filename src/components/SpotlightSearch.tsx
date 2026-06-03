import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { playSound, getSoundEnabled, setSoundEnabled } from '../lib/sound';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'NAVIGATION' | 'VENTURES' | 'ACTIONS' | 'PROFILE';
  shortcut?: string;
  action: () => void;
}

export default function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [profileTab, setProfileTab] = useState<'overview' | 'bio' | 'ventures' | 'stats'>('overview');
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'muneef-profile',
      title: 'Who is Muneef? (Profile Explorer)',
      category: 'PROFILE',
      shortcut: 'M',
      action: () => {
        // Just focus the preview card
      },
    },
    {
      id: 'nav-about',
      title: 'Navigate to About (Story, Terminal & Dashboard)',
      category: 'NAVIGATION',
      shortcut: '1',
      action: () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'nav-projects',
      title: 'Navigate to Projects (Artlor, Finsure)',
      category: 'NAVIGATION',
      shortcut: '2',
      action: () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'nav-blog',
      title: 'Navigate to Blog (Thoughts & Essays)',
      category: 'NAVIGATION',
      shortcut: '3',
      action: () => {
        document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'nav-contact',
      title: 'Navigate to Contact (Get in Touch)',
      category: 'NAVIGATION',
      shortcut: '4',
      action: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'venture-artlor',
      title: 'Launch Artlor (Art Marketplace)',
      category: 'VENTURES',
      shortcut: 'A',
      action: () => {
        window.open('https://www.artlor.art', '_blank', 'noopener,noreferrer');
        onClose();
      },
    },
    {
      id: 'venture-finsure',
      title: 'Launch Trust Finsure Accounting services',
      category: 'VENTURES',
      shortcut: 'F',
      action: () => {
        // Mock scroll to projects since link is #
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        onClose();
      },
    },
    {
      id: 'action-sound',
      title: `Toggle Audio System (${getSoundEnabled() ? 'DISABLE' : 'ENABLE'})`,
      category: 'ACTIONS',
      shortcut: 'S',
      action: () => {
        const nextState = !getSoundEnabled();
        setSoundEnabled(nextState);
        playSound('toggle');
      },
    },
  ];

  // Filter commands by query
  const filteredCommands = commands.filter((cmd) => {
    const term = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(term) ||
      cmd.category.toLowerCase().includes(term) ||
      (term === 'muneef' && cmd.id === 'muneef-profile')
    );
  });

  // Automatically select the profile card if query is 'muneef' or equivalent
  useEffect(() => {
    const term = query.toLowerCase().trim();
    if (term === 'muneef' || term === 'muhammad' || term === 'who is muneef' || term === 'who am i' || term === 'who i am') {
      const idx = filteredCommands.findIndex(c => c.id === 'muneef-profile');
      if (idx !== -1) setSelectedIndex(idx);
    } else {
      setSelectedIndex(0);
    }
  }, [query, filteredCommands.length]);

  // Entrance animations and key listeners
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);

      gsap.fromTo(
        '.spotlight-backdrop',
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { scale: 0.95, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: 'power3.out' }
      );
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle arrow keys & enter keys
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        playSound('type');
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        playSound('type');
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          playSound('success');
          selected.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  const handleClose = () => {
    playSound('toggle');
    gsap.to('.spotlight-backdrop', { opacity: 0, duration: 0.25 });
    gsap.to(modalRef.current, {
      scale: 0.95,
      opacity: 0,
      duration: 0.25,
      onComplete: onClose,
    });
  };

  if (!isOpen) return null;

  const currentSelectedCommand = filteredCommands[selectedIndex];
  const isProfileSelected = currentSelectedCommand?.id === 'muneef-profile';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="spotlight-backdrop absolute inset-0 bg-[#0c0a09]/80 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Spotlight Window */}
      <div
        ref={modalRef}
        className="relative max-w-[780px] w-full bg-[#171412]/95 border border-[#fafaf9]/10 rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden h-[450px]"
        style={{
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7), 0 0 50px rgba(249, 115, 22, 0.05)',
        }}
      >
        {/* Left Side: Search & Command List */}
        <div className="flex-1 flex flex-col h-full border-r border-[#fafaf9]/5">
          {/* Input field */}
          <div className="px-5 py-4 border-b border-[#fafaf9]/5 flex items-center gap-3">
            <span className="text-[#a8a29e] text-[14px]" style={{ fontFamily: "'Space Mono', monospace" }}>
              $
            </span>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search command palette or type 'muneef'..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                playSound('type');
              }}
              className="bg-transparent border-none outline-none flex-1 text-[#fafaf9] placeholder-[#78716c] text-[14px] p-0 focus:ring-0"
              autoComplete="off"
              spellCheck={false}
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded border border-[#fafaf9]/10 text-[9px] text-[#78716c] font-mono tracking-wider">
              ESC
            </kbd>
          </div>

          {/* List of items */}
          <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5 scrollbar-thin">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      playSound('success');
                      cmd.action();
                    }}
                    onMouseEnter={() => {
                      setSelectedIndex(idx);
                      playSound('hover');
                    }}
                    className={`px-4 py-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors duration-200 ${
                      isSelected
                        ? 'bg-[#f97316]/10 text-[#f97316]'
                        : 'text-[#a8a29e] hover:bg-[#fafaf9]/5 hover:text-[#fafaf9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          isSelected
                            ? 'border-[#f97316]/30 bg-[#f97316]/10 text-[#f97316]'
                            : 'border-[#78716c]/20 bg-[#fafaf9]/5 text-[#78716c]'
                        }`}
                        style={{ fontFamily: "'Space Mono', monospace" }}
                      >
                        {cmd.category}
                      </span>
                      <span className="text-[13px] font-medium">{cmd.title}</span>
                    </div>

                    {cmd.shortcut && (
                      <kbd className="text-[10px] font-mono opacity-40 uppercase">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-[#78716c] text-[12px] font-mono p-5 text-center">
                NO COMMANDS FOUND FOR &ldquo;{query}&rdquo;
              </div>
            )}
          </div>

          {/* Bottom Info bar */}
          <div className="px-5 py-3 border-t border-[#fafaf9]/5 bg-[#0c0a09]/50 flex items-center justify-between text-[10px] text-[#78716c] font-mono">
            <span>↑↓ NAVIGATE // ENTER CHOOSE</span>
            <span>SEARCH CORE v1.0</span>
          </div>
        </div>

        {/* Right Side: Profile Card / Who I Am Overlay (conditional on selection) */}
        <div
          className={`w-full md:w-[320px] bg-[#0c0a09]/60 h-full flex flex-col transition-all duration-300 ${
            isProfileSelected ? 'opacity-100 translate-x-0' : 'opacity-30 md:opacity-40 pointer-events-none md:pointer-events-auto'
          }`}
        >
          {isProfileSelected ? (
            <div className="h-full flex flex-col p-6">
              {/* Profile Card Header */}
              <div className="flex items-center gap-3 border-b border-[#fafaf9]/5 pb-4">
                <div className="w-10 h-10 rounded-full border border-[#f97316]/30 bg-[#171412] flex items-center justify-center text-[#f97316] font-bold text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>
                  MM
                </div>
                <div>
                  <h4 className="text-[#fafaf9] text-[14px] font-bold tracking-wide">MUHAMMAD MUNEEF</h4>
                  <span className="text-[#f97316] text-[10px] uppercase font-bold tracking-widest" style={{ fontFamily: "'Space Mono', monospace" }}>
                    FOUNDER // 14yo
                  </span>
                </div>
              </div>

              {/* Profile Tab Buttons */}
              <div className="grid grid-cols-4 gap-1 border-b border-[#fafaf9]/5 py-3 text-[9px] font-bold tracking-wider uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>
                {(['overview', 'bio', 'ventures', 'stats'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setProfileTab(tab);
                      playSound('toggle');
                    }}
                    className={`py-1 text-center border-b-2 rounded-sm transition-all duration-300 ${
                      profileTab === tab
                        ? 'border-[#f97316] text-[#f97316]'
                        : 'border-transparent text-[#78716c] hover:text-[#a8a29e]'
                    }`}
                  >
                    {tab.substring(0, 4)}
                  </button>
                ))}
              </div>

              {/* Profile Content Container */}
              <div className="flex-1 overflow-y-auto py-4 text-left scrollbar-thin">
                {profileTab === 'overview' && (
                  <div className="text-[12px] text-[#a8a29e] leading-relaxed space-y-3">
                    <p>
                      <strong>Muhammad Muneef</strong> is a young technology entrepreneur, developer, and student from Kashmir.
                    </p>
                    <p>
                      At just 14 years old, he balances secondary academics at <strong>GVEI</strong> with running multiple business ventures.
                    </p>
                    <p className="text-[#f97316] font-semibold">
                      &bull; Srinagar, Kashmir, IN
                    </p>
                  </div>
                )}

                {profileTab === 'bio' && (
                  <div className="text-[12px] text-[#a8a29e] leading-relaxed space-y-3">
                    <p>
                      Muneef studies at <strong>Green Valley Educational Institute</strong> in Srinagar.
                    </p>
                    <p>
                      He is a <strong>3x MUN Best Delegate</strong>, competitive debater, public speaker, and developer.
                    </p>
                    <p>
                      His goal is to build secure, high-performance web systems and empower local artisans through digital platforms.
                    </p>
                  </div>
                )}

                {profileTab === 'ventures' && (
                  <div className="text-[12px] text-[#a8a29e] leading-relaxed space-y-3">
                    <div>
                      <span className="text-[#fafaf9] font-bold block">1. Artlor (artlor.art)</span>
                      Kashmir&rsquo;s online art marketplace, bridging native artists with global buyers.
                    </div>
                    <div>
                      <span className="text-[#fafaf9] font-bold block">2. Trust Finsure Accounting</span>
                      Professional accounting &amp; taxation advisory solutions simplified for growing firms.
                    </div>
                  </div>
                )}

                {profileTab === 'stats' && (
                  <div className="text-[11px] text-[#a8a29e] space-y-2.5 font-mono">
                    <div className="flex justify-between">
                      <span>AGE:</span>
                      <span className="text-[#fafaf9] font-bold">14 YEARS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>STARTUPS:</span>
                      <span className="text-[#f97316] font-bold">2 FOUNDED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MUN DEBATES:</span>
                      <span className="text-[#fafaf9] font-bold">3x BEST DEL.</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ALUMNI:</span>
                      <span className="text-[#fafaf9] font-bold">GVEI</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-center text-[#78716c] text-[11px] font-mono leading-relaxed">
              Select &ldquo;Who is Muneef?&rdquo; or search for &ldquo;muneef&rdquo; to unlock the profile inspector.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
