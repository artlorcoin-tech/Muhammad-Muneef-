import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { playSound, setSoundEnabled } from '../lib/sound';

interface PreloaderProps {
  onComplete: () => void;
}

const bootLogs = [
  'Booting MUNEEF_DEV_CORE v14.0.0...',
  'Locating Srinagar gateway node...',
  'Connecting local environment via GVEI network... [Latency: 14ms]',
  'Initializing WebGL Ink Displacement background layer...',
  'Pre-loading high-resolution visual assets...',
  'Establishing secure developer credentials...',
  'Preparing interactive dashboard & Recharts engine...',
  'Compiling UI components & command menu palette...',
  'SYSTEM CHECK: OK. Ready for launch.',
];

export default function Preloader({ onComplete }: PreloaderProps) {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Animate percent count
  useEffect(() => {
    const duration = 2500; // 2.5 seconds loading
    const interval = 25;
    const steps = duration / interval;
    const increment = 100 / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setIsReady(true);
      }
      setPercent(Math.floor(current));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Sync diagnostic logs with progress percentage
  useEffect(() => {
    const logIndex = Math.min(
      Math.floor((percent / 100) * bootLogs.length),
      bootLogs.length - 1
    );

    if (logs.length <= logIndex) {
      setLogs((prev) => [...prev, bootLogs[logIndex]]);
    }
  }, [percent, logs.length]);

  const handleLaunch = () => {
    // Enable sound
    setSoundEnabled(true);
    playSound('boot');

    // Fade out preloader
    gsap.to('.preloader-container', {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power4.inOut',
      onComplete: () => {
        onComplete();
      },
    });
  };

  return (
    <div
      className="preloader-container fixed inset-0 z-[9999] bg-[#0c0a09] flex flex-col justify-between p-8 sm:p-16 select-none"
      style={{ fontFamily: "'Space Mono', monospace" }}
    >
      {/* Top Details */}
      <div className="flex justify-between text-[#78716c] text-[11px] uppercase tracking-widest">
        <span>LOC: KASHMIR, IN // 34.0837° N, 74.7973° E</span>
        <span>SYS_STATUS: {percent < 100 ? 'LOADING' : 'READY'}</span>
      </div>

      {/* Center Console */}
      <div className="max-w-[700px] w-full mx-auto flex flex-col gap-8 my-auto">
        {/* Terminal Logs Box */}
        <div className="border border-[#fafaf9]/5 bg-[#171412]/40 rounded-lg p-5 h-[200px] overflow-y-auto flex flex-col gap-1.5 scrollbar-thin">
          {logs.map((log, index) => (
            <div
              key={index}
              className={`text-[12px] leading-relaxed transition-all duration-300 ${
                index === logs.length - 1 ? 'text-brand log-pulse font-semibold' : 'text-[#a8a29e]'
              }`}
            >
              <span className="text-[#fafaf9]/20 mr-2">&gt;</span> {log}
            </div>
          ))}
        </div>

        {/* Progress Display */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <span className="text-[12px] text-[#fafaf9] tracking-wider font-semibold">
              {percent < 100 ? 'INITIALIZING INTERACTIVE ENVIRONMENT' : 'COMPILATION COMPLETE'}
            </span>
            <span
              className="text-brand font-bold"
              style={{ fontSize: 'clamp(28px, 6vw, 48px)', lineHeight: 0.9 }}
            >
              {percent}%
            </span>
          </div>

          {/* Loading bar */}
          <div className="w-full h-[3px] bg-[#fafaf9]/5 relative overflow-hidden rounded">
            <div
              className="absolute left-0 top-0 h-full bg-brand transition-all duration-100 ease-out shadow-[0_0_12px_hsl(var(--brand-accent))]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Action Button Area */}
        <div className="h-16 flex items-center justify-center">
          {isReady && (
            <button
              onClick={handleLaunch}
              className="px-10 py-4 border border-brand text-brand hover:bg-brand hover:text-[#0c0a09] transition-all duration-300 font-bold uppercase tracking-wider text-[12px] shadow-[0_0_20px_hsl(var(--brand-accent)/0.15)] hover:shadow-[0_0_30px_hsl(var(--brand-accent)/0.4)] animate-pulse"
              style={{ animationDuration: '2s' }}
            >
              Launch Core System
            </button>
          )}
        </div>
      </div>

      {/* Bottom details */}
      <div className="flex justify-between text-[#78716c] text-[10px] uppercase tracking-wider">
        <span>© 2026 MUHAMMAD MUNEEF</span>
        <span>TAP TO START SOUND GENERATOR</span>
      </div>
    </div>
  );
}
