import { useState, useRef, useEffect } from 'react';
import { playSound, playNote } from '../lib/sound';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
}

const synthNotes = [
  { key: 'a', note: 'C4', freq: 261.63 },
  { key: 's', note: 'D4', freq: 293.66 },
  { key: 'd', note: 'E4', freq: 329.63 },
  { key: 'f', note: 'F4', freq: 349.23 },
  { key: 'g', note: 'G4', freq: 392.00 },
  { key: 'h', note: 'A4', freq: 440.00 },
  { key: 'j', note: 'B4', freq: 493.88 },
  { key: 'k', note: 'C5', freq: 523.25 },
];

export default function Terminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'Initializing muneef.dev terminal core...', type: 'system' },
    { text: 'System check: OK. Est. latency: 14ms.', type: 'system' },
    { text: 'Logged in as guest@muneef.dev', type: 'system' },
    { text: "Type 'help' to explore the terminal or click on standard tabs.", type: 'success' },
  ]);
  const [input, setInput] = useState('');
  const [showSynth, setShowSynth] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Record<string, () => void> = {
    help: () => {
      printLines([
        'Available commands:',
        '  about     - Learn who Muhammad Muneef is',
        '  education - View current academic details',
        '  projects  - Show active startups and products',
        '  skills    - List programming languages & tech stack',
        '  contact   - Display contact links and email details',
        '  theme     - Change the accent color theme (orange, cyan, green, matrix)',
        '  matrix    - Toggle green digital code rain screen',
        '  synth     - Open interactive digital soundboard synthesizer',
        '  chat      - Ask Muneef\'s AI assistant a question (e.g. chat startups)',
        '  hack      - Run network diagnostic security test',
        '  clear     - Clear the terminal history',
        '  secret    - ???',
      ]);
    },
    about: () => {
      printLines([
        'Muhammad Muneef:',
        '  A teen technology entrepreneur, developer, and public speaker.',
        '  Co-founder & Lead Developer of Artlor (online art marketplace) and',
        '  Trust Finsure Accounting (professional financial services).',
        '  Passionate about Web3, high-performance web systems, and UI/UX design.',
      ]);
    },
    education: () => {
      printLines([
        'Academic Status:',
        '  Studying at Green Valley Educational Institute (GVEI), Srinagar.',
        '  Actively balancing academics with web development, competitive debate,',
        '  and running two startups. 3x MUN Best Delegate award winner.',
      ]);
    },
    projects: () => {
      printLines([
        'Featured Startups:',
        '  1. ARTLOR - Kashmir\'s premier online art marketplace connecting global art',
        '     enthusiasts with scenic and authentic local artworks.',
        '  2. TRUST FINSURE ACCOUNTING - Professional accounting, taxation, and financial',
        '     advisory solutions simplified for businesses.',
      ]);
    },
    skills: () => {
      printLines([
        'Core Technologies & Skills:',
        '  Languages    : TypeScript, JavaScript, Python, HTML/CSS',
        '  Frameworks   : React, Next.js, Vite, Node.js',
        '  Styles/Tools : Tailwind CSS, GSAP, WebGL, Git, Gitlab',
        '  Soft Skills  : Academic Debating, Public Speaking, Leadership',
      ]);
    },
    contact: () => {
      printLines([
        'Reach Out:',
        '  Email     : muhammadmuneef2928@gmail.com',
        '  GitHub    : https://github.com/Muneef29',
        '  LinkedIn  : https://linkedin.com/in/muhammad-muneef',
        '  Instagram : @m__un__ee_f',
      ]);
    },
    theme: () => {
      printLines([
        'Usage: theme [color]',
        'Available themes:',
        '  theme orange  - Original Kashmiri orange (default)',
        '  theme cyan    - Deep futuristic tech cyan',
        '  theme green   - High contrast developer green',
        '  theme matrix  - Emerald code matrix green',
      ]);
    },
    matrix: () => {
      window.dispatchEvent(new CustomEvent('toggle-matrix'));
      printLines([
        '👾 [SYSTEM] Matrix digital code rain sequence initiated...',
        '   Press ESC or click anywhere on the overlay screen to close matrix mode.',
      ], 'success');
    },
    synth: () => {
      setShowSynth(true);
      printLines([
        '👾 [SYNTH CONSOLE ENGAGED]',
        '  Click note cards below or press keyboard keys A-S-D-F-G-H-J-K to synthesize audio.',
        '  Type clear or any command to collapse synthesizer deck.',
      ], 'success');
    },
    hack: () => {
      printLines(['👾 [WARNING] INITIATING SECURITY DIAGNOSTIC BYPASS...'], 'error');
      
      const sequences = [
        { text: 'Connecting to Srinagar gateway node: PORT 8080...', type: 'system' as const },
        { text: 'Injecting buffer overflow payload into secure server db...', type: 'system' as const },
        { text: 'Bypassing local school credentials... [STAGED]', type: 'system' as const },
        { text: 'VAULT LOCATED. Decrypting GVEI academic registry...', type: 'error' as const },
        { text: 'Security check: 32%... 68%... 99%... OK.', type: 'success' as const },
        { text: 'SYSTEM OVERRIDE SUCCESSFUL. ACCESS GRANTED.', type: 'success' as const },
        { text: 'Decrypted Message: "Age is just a number. Coding is a superpower."', type: 'success' as const },
      ];

      sequences.forEach((seq, i) => {
        setTimeout(() => {
          setHistory(prev => [...prev, seq]);
          playSound('type');
        }, (i + 1) * 350);
      });
    },
    secret: () => {
      printLines([
        '👾 [SUCCESS] ACCESS GRANTED.',
        '  "I don\'t just dream — I build."',
        '  Thank you for visiting my site! Drop an email to build together.',
      ], 'success');
    },
    clear: () => {
      setHistory([]);
      setShowSynth(false);
    },
  };

  const printLines = (lines: string[], type: TerminalLine['type'] = 'output') => {
    const formatted = lines.map(line => ({ text: line, type }));
    setHistory(prev => [...prev, ...formatted]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Split input to parse arguments (e.g., 'theme cyan')
    const parts = trimmedInput.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    // Log the input to command history
    setHistory(prev => [...prev, { text: `guest@muneef:~$ ${input}`, type: 'input' }]);
    setInput('');

    // Special routing for chat command
    if (cmd === 'chat') {
      if (!arg) {
        printLines([
          '🤖 [Muneef AI Assistant Command Console]',
          '  Ask me questions about my profile! Examples:',
          '    chat age       - Display my current age',
          '    chat startups  - Tell me about Artlor and Finsure',
          '    chat kashmir   - Why Srinagar is special to me',
          '    chat debate    - Learn about my MUN debate records',
          '    chat custom    - Type any other question (e.g. chat how are you)',
        ], 'success');
      } else if (arg.includes('age') || arg.includes('old')) {
        printLines([
          '🤖 AI Response:',
          '  "I am a teenager (born in 2012), balancing my secondary education',
          '   at GVEI with active software development and startup execution."',
        ], 'success');
      } else if (arg.includes('startup') || arg.includes('artlor') || arg.includes('finsure')) {
        printLines([
          '🤖 AI Response:',
          '  "I founded Artlor to connect native Kashmiri artists with global collectors,',
          '   and Trust Finsure Accounting to simplify advisory/finance for businesses."',
        ], 'success');
      } else if (arg.includes('kashmir') || arg.includes('srinagar')) {
        printLines([
          '🤖 AI Response:',
          '  "I was born and raised in Srinagar, Kashmir. The scenic beauty,',
          '   traditional art forms, and local challenges inspire me to build daily."',
        ], 'success');
      } else if (arg.includes('debate') || arg.includes('mun')) {
        printLines([
          '🤖 AI Response:',
          '  "I\'m a 3-time MUN Best Delegate award winner and school speaking championship winner.',
          '   Debating has taught me research, lobbying, and structural communication."',
        ], 'success');
      } else {
        printLines([
          '🤖 AI Response:',
          `  "Analyzing query: '${arg}'...`,
          '   That\'s a great question! I am constantly learning and building new web apps.',
          '   Let\'s connect via email (muhammadmuneef2928@gmail.com) to discuss this further!"',
        ], 'success');
      }
      return;
    }

    // Special argument routing for theme command
    if (cmd === 'theme') {
      if (['cyan', 'green', 'orange', 'matrix'].includes(arg)) {
        window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: arg } }));
        printLines([`👾 [SUCCESS] Color theme accent updated to: ${arg.toUpperCase()}`], 'success');
      } else {
        printLines([
          `Error: Invalid theme '${arg}'.`,
          'Available themes: orange, cyan, green, matrix.',
          'Usage: theme [color] (e.g. theme cyan)',
        ], 'error');
      }
      return;
    }

    // Default command execution
    if (cmd in commands) {
      // Hide synthesizer on any command except 'synth' itself
      if (cmd !== 'synth') {
        setShowSynth(false);
      }
      commands[cmd]();
    } else {
      setHistory(prev => [
        ...prev,
        { text: `bash: command not found: ${cmd}. Type 'help' for details.`, type: 'error' }
      ]);
    }
  };

  // Capture physical keyboard press triggers for playable synthesizer
  useEffect(() => {
    if (!showSynth) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside the input prompt
      if (document.activeElement?.tagName === 'INPUT') return;

      const found = synthNotes.find(n => n.key === e.key.toLowerCase());
      if (found) {
        e.preventDefault();
        playNote(found.freq, 'sine');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSynth]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div
      onClick={focusInput}
      className="w-full max-w-[650px] mx-auto rounded-lg border border-brand/20 bg-[#171412]/80 backdrop-blur-md shadow-2xl overflow-hidden font-mono text-[14px]"
      style={{
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0c0a09]/95 border-b border-[#fafaf9]/5">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ef4444] opacity-80" />
          <span className="w-3 h-3 rounded-full bg-[#f59e0b] opacity-80" />
          <span className="w-3 h-3 rounded-full bg-[#10b981] opacity-80" />
        </div>
        <span className="text-xs text-[#a8a29e] tracking-wider uppercase select-none">
          muneef@terminal: ~
        </span>
        <div className="w-12" /> {/* spacer */}
      </div>

      {/* Terminal Output */}
      <div
        ref={containerRef}
        className="p-5 h-[280px] overflow-y-auto flex flex-col gap-2 scrollbar-thin scrollbar-thumb-brand/20"
      >
        {history.map((line, idx) => {
          let color = 'text-[#fafaf9]';
          if (line.type === 'system') color = 'text-[#78716c]';
          if (line.type === 'error') color = 'text-[#ef4444]';
          if (line.type === 'success') color = 'text-brand';
          if (line.type === 'input') color = 'text-[#a8a29e] font-semibold';
          
          return (
            <div key={idx} className={`${color} whitespace-pre-wrap leading-relaxed`}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Playable Synthesizer Panel Overlay */}
      {showSynth && (
        <div className="flex flex-col gap-2 p-4 border-t border-[#fafaf9]/5 bg-[#0c0a09]/50 select-none">
          <div className="text-[10px] text-[#78716c] uppercase tracking-widest text-center font-mono font-bold">
            Live Synthesizer soundboard
          </div>
          <div className="flex justify-center gap-1 py-1">
            {synthNotes.map((n) => (
              <button
                key={n.note}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  playNote(n.freq, 'sine');
                }}
                className="flex flex-col items-center justify-between py-2 px-1.5 min-w-[34px] rounded border border-brand/20 bg-[#171412] hover:bg-brand hover:text-[#0c0a09] transition-all duration-150 active:scale-90 interactive-item text-[#fafaf9]"
              >
                <span className="text-[10px] font-bold font-mono">{n.note}</span>
                <span className="text-[8px] opacity-40 font-mono mt-1 uppercase">{n.key}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input prompt */}
      <form
        onSubmit={handleCommand}
        className="flex items-center gap-2 px-5 py-3 border-t border-[#fafaf9]/5 bg-[#0c0a09]/40"
      >
        <span className="text-brand font-semibold shrink-0">guest@muneef:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          className="bg-transparent border-none outline-none flex-grow text-[#fafaf9] focus:ring-0 p-0 text-[14px]"
          autoCapitalize="none"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
}
