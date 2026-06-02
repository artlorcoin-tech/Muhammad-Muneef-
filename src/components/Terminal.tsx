import { useState, useRef, useEffect } from 'react';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'system' | 'error' | 'success';
}

export default function Terminal() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'Initializing muneef.dev terminal core...', type: 'system' },
    { text: 'System check: OK. Est. latency: 14ms.', type: 'system' },
    { text: 'Logged in as guest@muneef.dev', type: 'system' },
    { text: "Type 'help' to explore the terminal or click on standard tabs.", type: 'success' },
  ]);
  const [input, setInput] = useState('');
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
        '  clear     - Clear the terminal history',
        '  secret    - ???',
      ]);
    },
    about: () => {
      printLines([
        'Muhammad Muneef:',
        '  A 14-year-old technology entrepreneur, developer, and public speaker.',
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
    secret: () => {
      printLines([
        '👾 [SUCCESS] ACCESS GRANTED.',
        '  "Age is just a number. Coding is a superpower."',
        '  Thank you for visiting my site! Drop an email to build together.',
      ], 'success');
    },
    clear: () => {
      setHistory([]);
    },
  };

  const printLines = (lines: string[], type: TerminalLine['type'] = 'output') => {
    const formatted = lines.map(line => ({ text: line, type }));
    setHistory(prev => [...prev, ...formatted]);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    if (!cmd) return;

    const newHistory = [...history, { text: `guest@muneef:~$ ${input}`, type: 'input' as const }];
    setHistory(newHistory);
    setInput('');

    if (cmd in commands) {
      commands[cmd]();
    } else {
      setHistory(prev => [
        ...prev,
        { text: `bash: command not found: ${cmd}. Type 'help' for details.`, type: 'error' }
      ]);
    }
  };

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
      className="w-full max-w-[650px] mx-auto rounded-lg border border-[#f97316]/20 bg-[#171412]/80 backdrop-blur-md shadow-2xl overflow-hidden font-mono text-[14px]"
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
        className="p-5 h-[280px] overflow-y-auto flex flex-col gap-2 scrollbar-thin scrollbar-thumb-[#f97316]/20"
      >
        {history.map((line, idx) => {
          let color = 'text-[#fafaf9]';
          if (line.type === 'system') color = 'text-[#78716c]';
          if (line.type === 'error') color = 'text-[#ef4444]';
          if (line.type === 'success') color = 'text-[#f97316]';
          if (line.type === 'input') color = 'text-[#a8a29e] font-semibold';
          
          return (
            <div key={idx} className={`${color} whitespace-pre-wrap leading-relaxed`}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Input prompt */}
      <form
        onSubmit={handleCommand}
        className="flex items-center gap-2 px-5 py-3 border-t border-[#fafaf9]/5 bg-[#0c0a09]/40"
      >
        <span className="text-[#f97316] font-semibold shrink-0">guest@muneef:~$</span>
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
