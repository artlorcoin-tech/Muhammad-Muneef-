import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { playSound } from '../lib/sound';
import { X, TrendingUp, Cpu, Target, Award } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface CaseStudyData {
  name: string;
  category: string;
  problem: string;
  solution: string;
  techStack: string[];
  metrics: { name: string; value: number }[];
  metricLabel: string;
  achievements: string[];
}

const caseStudies: Record<string, CaseStudyData> = {
  'Artlor': {
    name: 'Artlor',
    category: 'Startup / Art Marketplace',
    problem: 'Kashmiri artisans produce world-class handicrafts and paintings but are geographically and technologically isolated, making them dependent on exploitative middlemen who take up to 80% of their margins.',
    solution: "A modern, high-performance web marketplace bridging native Kashmiri artists directly with global collectors. Features high-speed image delivery, vendor onboarding panels, and encrypted payment pathways.",
    techStack: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Supabase', 'GSAP', 'WebGL'],
    metricLabel: 'Monthly Active Art Collectors',
    metrics: [
      { name: 'Jan', value: 15 },
      { name: 'Feb', value: 32 },
      { name: 'Mar', value: 58 },
      { name: 'Apr', value: 82 },
      { name: 'May', value: 120 },
      { name: 'Jun', value: 175 },
    ],
    achievements: [
      'Preserved native Kashmiri paper-mache and wood carving digital cataloging.',
      'Onboarded 50+ local independent artisans.',
      'Reduced sales transaction delay from weeks to under 24 hours.',
    ],
  },
  'Trust Finsure Accounting': {
    name: 'Trust Finsure Accounting',
    category: 'Startup / Financial Services',
    problem: 'Small local businesses and taxpayers face overly complex filing processes, heavy administrative backlogs, and lack of clear financial advice tailored to regional tax structures.',
    solution: 'Simplifying financial operations, bookkeeping, and tax compliance advisory through a unified consultation portal. Helps businesses save costs by automating recurring accounting audits.',
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
    metricLabel: 'Active Retained Clients / Accounts',
    metrics: [
      { name: 'Jan', value: 4 },
      { name: 'Feb', value: 8 },
      { name: 'Mar', value: 12 },
      { name: 'Apr', value: 18 },
      { name: 'May', value: 26 },
      { name: 'Jun', value: 38 },
    ],
    achievements: [
      'Managed financial filing books for regional businesses.',
      'Decreased client average tax prep time by 45%.',
      'Automated quarterly financial reporting and invoice audits.',
    ],
  },
};

interface CaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string | null;
}

export default function CaseStudyModal({ isOpen, onClose, projectName }: CaseStudyModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'tech'>('overview');
  const study = projectName ? caseStudies[projectName] : null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab('overview');
      playSound('click');
      
      // Entrance animation
      gsap.fromTo(
        '.case-modal-overlay',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
      gsap.fromTo(
        '.case-modal-panel',
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
    gsap.to('.case-modal-panel', {
      x: '100%',
      duration: 0.4,
      ease: 'power3.in',
      onComplete: onClose,
    });
    gsap.to('.case-modal-overlay', {
      opacity: 0,
      duration: 0.4,
    });
  };

  if (!isOpen || !study) return null;

  return (
    <div className="fixed inset-0 z-[110] flex justify-end">
      {/* Backdrop */}
      <div
        className="case-modal-overlay absolute inset-0 bg-[#0c0a09]/80 backdrop-blur-md cursor-pointer"
        onClick={handleClose}
      />

      {/* Slide-out Panel */}
      <div
        className="case-modal-panel relative w-full max-w-[650px] h-full bg-[#171412]/95 border-l border-[#fafaf9]/5 shadow-2xl flex flex-col"
        style={{
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
        }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#fafaf9]/5 bg-[#0c0a09]/50 shrink-0">
          <div className="flex flex-col">
            <span className="text-[10px] text-brand uppercase tracking-wider font-mono font-bold">
              {study.category}
            </span>
            <h3
              className="text-[#fafaf9] text-xl font-bold font-mono mt-0.5"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              {study.name} Console
            </h3>
          </div>

          <button
            onClick={handleClose}
            className="text-[11px] text-[#a8a29e] hover:text-brand uppercase tracking-widest font-bold flex items-center gap-2 py-2 px-3 border border-[#fafaf9]/5 hover:border-brand/20 rounded transition-all duration-300 active:scale-95"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            <span>Close</span>
            <X size={14} />
          </button>
        </div>

        {/* Console tabs */}
        <div className="grid grid-cols-3 gap-1 border-b border-[#fafaf9]/5 py-2 px-6 text-[10px] font-bold tracking-wider uppercase bg-[#0c0a09]/30 shrink-0" style={{ fontFamily: "'Space Mono', monospace" }}>
          {[
            { id: 'overview', label: 'Overview', icon: <Target className="w-3 h-3" /> },
            { id: 'metrics', label: 'Metrics', icon: <TrendingUp className="w-3 h-3" /> },
            { id: 'tech', label: 'Tech Stack', icon: <Cpu className="w-3 h-3" /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as any);
                playSound('toggle');
              }}
              className={`py-2 px-2 flex items-center justify-center gap-2 border-b-2 rounded-sm transition-all duration-300 active:scale-95 ${
                activeTab === t.id
                  ? 'border-brand text-brand bg-brand/5'
                  : 'border-transparent text-[#78716c] hover:text-[#a8a29e]'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab contents */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 scrollbar-thin scrollbar-thumb-brand/10">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Problem section */}
              <div className="p-5 rounded-lg border border-[#fafaf9]/5 bg-[#0c0a09]/40">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider font-mono block mb-2">
                  [THE PROBLEM]
                </span>
                <p
                  className="text-[#d6d3d1] text-[14px] leading-relaxed font-light"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {study.problem}
                </p>
              </div>

              {/* Solution section */}
              <div className="p-5 rounded-lg border border-brand/10 bg-brand/5">
                <span className="text-[10px] text-brand font-bold uppercase tracking-wider font-mono block mb-2">
                  [THE SOLUTION]
                </span>
                <p
                  className="text-[#fafaf9] text-[14px] leading-relaxed font-light"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {study.solution}
                </p>
              </div>

              {/* Achievements section */}
              <div>
                <span className="text-[10px] text-[#78716c] font-bold uppercase tracking-wider font-mono block mb-3">
                  Key Milestones &amp; Outcomes
                </span>
                <ul className="space-y-2.5">
                  {study.achievements.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-[13px] text-[#a8a29e] leading-relaxed font-light"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <Award className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* Chart */}
              <div>
                <span className="text-[10px] text-[#78716c] font-bold uppercase tracking-wider font-mono block mb-4">
                  Growth Traction Index: {study.metricLabel}
                </span>
                <div className="h-[250px] w-full bg-[#0c0a09]/40 border border-[#fafaf9]/5 rounded-lg p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={study.metrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--brand-accent))" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(var(--brand-accent))" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 162, 158, 0.05)" />
                      <XAxis
                        dataKey="name"
                        stroke="#a8a29e"
                        tick={{ fill: '#a8a29e', fontSize: 10, fontFamily: "'Space Mono', monospace" }}
                      />
                      <YAxis
                        stroke="#a8a29e"
                        tick={{ fill: '#78716c', fontSize: 9, fontFamily: "'Space Mono', monospace" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#171412',
                          border: '1px solid hsl(var(--brand-accent)/0.2)',
                          borderRadius: '6px',
                          color: '#fafaf9',
                          fontFamily: "'Space Mono', monospace",
                          fontSize: '11px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(var(--brand-accent))"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick stats breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-[#fafaf9]/5 bg-[#0c0a09]/20">
                  <span className="text-[9px] text-[#78716c] uppercase font-mono block">
                    Starting Value (Jan)
                  </span>
                  <span className="text-xl font-bold font-mono text-[#fafaf9] mt-1 block">
                    {study.metrics[0].value}
                  </span>
                </div>
                <div className="p-4 rounded-lg border border-brand/10 bg-brand/5">
                  <span className="text-[9px] text-brand uppercase font-mono block">
                    Current Value (Jun)
                  </span>
                  <span className="text-xl font-bold font-mono text-brand mt-1 block">
                    {study.metrics[study.metrics.length - 1].value}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tech' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] text-[#78716c] font-bold uppercase tracking-wider font-mono block mb-4">
                  Tech Stack Integration Console
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {study.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3.5 py-1.5 rounded border border-brand/20 bg-brand/5 text-brand text-[12px] uppercase font-mono font-bold tracking-wider hover:bg-brand hover:text-[#0c0a09] transition-all duration-300 cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-lg border border-[#fafaf9]/5 bg-[#0c0a09]/40 text-[13px] text-[#a8a29e] leading-relaxed font-light space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                <p>
                  <strong>Architecture Choice:</strong> We selected a decoupled single-page architecture to maximize load times and response speeds.
                </p>
                <p>
                  <strong>Performance Optimization:</strong> By using Vite, components are dynamically split, ensuring fast rendering on mobile browsers with minimal footprint.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
