import React from 'react';

export default function StatsCard({ icon, title, value, loading }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7 shadow-[0_0_50px_rgba(255,255,255,0.03)]">
      <div className="absolute top-[-40px] right-[-40px] w-[140px] h-[140px] bg-pink-500/10 blur-[80px] rounded-full"></div>
      <div className="relative z-20">
        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center mb-8">
          {icon}
        </div>
        <h2 className="text-gray-400 text-sm">{title}</h2>
        <h1 className="text-5xl font-black mt-3 tracking-tight">
          {loading ? '--' : value}
        </h1>
      </div>
    </div>
  );
}