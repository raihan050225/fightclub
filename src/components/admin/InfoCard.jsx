import React from 'react';

export default function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/20 p-5">
      <div className="flex items-center gap-3 text-pink-400">
        {icon}
        <p className="text-xs uppercase tracking-[4px] text-gray-500">{title}</p>
      </div>
      <h2 className="mt-4 text-xl font-bold">{value || '--'}</h2>
    </div>
  );
}