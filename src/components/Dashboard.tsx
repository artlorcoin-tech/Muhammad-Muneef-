import { useState } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { playSound } from '../lib/sound';

const talentData = [
  { subject: 'Development', rating: 95 },
  { subject: 'Public Speaking', rating: 90 },
  { subject: 'Academic Debating', rating: 95 },
  { subject: 'UI/UX Design', rating: 88 },
  { subject: 'Business Ops', rating: 85 },
  { subject: 'Finance & Tax', rating: 80 },
];

const growthData = [
  { name: 'Jan', Artlor: 15, TrustFinsure: 4 },
  { name: 'Feb', Artlor: 32, TrustFinsure: 8 },
  { name: 'Mar', Artlor: 58, TrustFinsure: 12 },
  { name: 'Apr', Artlor: 82, TrustFinsure: 18 },
  { name: 'May', Artlor: 120, TrustFinsure: 26 },
  { name: 'Jun', Artlor: 175, TrustFinsure: 38 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'talent' | 'growth'>('talent');

  const handleTabChange = (tab: 'talent' | 'growth') => {
    setActiveTab(tab);
    playSound('toggle');
  };

  return (
    <div className="w-full rounded-xl border border-[#fafaf9]/5 bg-[#171412]/50 backdrop-blur-md overflow-hidden p-6 sm:p-8 mt-12 shadow-2xl">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#fafaf9]/5 pb-6">
        <div>
          <h3
            className="text-[#fafaf9] text-xl font-semibold"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Startup Console &amp; Capability Index
          </h3>
          <p className="text-[12px] text-[#a8a29e] mt-1" style={{ fontFamily: "'Space Mono', monospace" }}>
            REAL-TIME ANALYTICS / RESUME RADAR
          </p>
        </div>

        <div className="flex bg-[#0c0a09]/80 p-1 rounded-lg border border-[#fafaf9]/5">
          <button
            onClick={() => handleTabChange('talent')}
            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${
              activeTab === 'talent'
                ? 'bg-[#f97316] text-[#0c0a09]'
                : 'text-[#a8a29e] hover:text-[#fafaf9]'
            }`}
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Talent Radar
          </button>
          <button
            onClick={() => handleTabChange('growth')}
            className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-md transition-all duration-300 ${
              activeTab === 'growth'
                ? 'bg-[#f97316] text-[#0c0a09]'
                : 'text-[#a8a29e] hover:text-[#fafaf9]'
            }`}
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Growth Index
          </button>
        </div>
      </div>

      {/* Render Area */}
      <div className="mt-8 h-[300px] sm:h-[350px] w-full flex items-center justify-center">
        {activeTab === 'talent' ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={talentData}>
              <PolarGrid stroke="rgba(168, 162, 158, 0.15)" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="#a8a29e"
                tick={{ fill: '#a8a29e', fontSize: 11, fontFamily: "'Space Mono', monospace" }}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="rgba(168, 162, 158, 0.1)"
                tick={{ fill: '#78716c', fontSize: 9 }}
              />
              <Radar
                name="Muneef Capabilities"
                dataKey="rating"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.2}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171412',
                  border: '1px solid rgba(249, 115, 22, 0.2)',
                  borderRadius: '6px',
                  color: '#fafaf9',
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '12px',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={growthData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              onMouseMove={() => {
                // Optional: add extremely low-frequency hover feedback on hover if wanted
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 162, 158, 0.05)" />
              <XAxis
                dataKey="name"
                stroke="#a8a29e"
                tick={{ fill: '#a8a29e', fontSize: 11, fontFamily: "'Space Mono', monospace" }}
              />
              <YAxis
                stroke="#a8a29e"
                tick={{ fill: '#78716c', fontSize: 10, fontFamily: "'Space Mono', monospace" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171412',
                  border: '1px solid rgba(249, 115, 22, 0.2)',
                  borderRadius: '8px',
                  color: '#fafaf9',
                  fontFamily: "'Inter', sans-serif",
                }}
              />
              <Legend
                wrapperStyle={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '11px',
                  color: '#a8a29e',
                  paddingTop: '10px',
                }}
              />
              <Line
                type="monotone"
                dataKey="Artlor"
                stroke="#f97316"
                activeDot={{ r: 6 }}
                strokeWidth={2}
                name="Artlor Users"
              />
              <Line
                type="monotone"
                dataKey="TrustFinsure"
                stroke="#fafaf9"
                strokeDasharray="4 4"
                strokeWidth={1.5}
                name="Finsure Accounts"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer statistics breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 border-t border-[#fafaf9]/5 mt-6 pt-6 text-left">
        <div>
          <span className="text-[10px] text-[#78716c] uppercase tracking-wider block" style={{ fontFamily: "'Space Mono', monospace" }}>
            Active Artlor Reach
          </span>
          <span className="text-[#fafaf9] text-lg font-bold" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            Global
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#78716c] uppercase tracking-wider block" style={{ fontFamily: "'Space Mono', monospace" }}>
            Monthly Growth Rate
          </span>
          <span className="text-[#f97316] text-lg font-bold" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            +40% MoM
          </span>
        </div>
        <div className="col-span-2 md:col-span-1">
          <span className="text-[10px] text-[#78716c] uppercase tracking-wider block" style={{ fontFamily: "'Space Mono', monospace" }}>
            Consultation Capacity
          </span>
          <span className="text-[#fafaf9] text-lg font-bold" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            Open / Limited
          </span>
        </div>
      </div>
    </div>
  );
}
