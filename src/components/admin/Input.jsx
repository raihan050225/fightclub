import React from 'react';

export default function Input({ label, value, onChange }) {
  return (
    <div>
      <p className="mb-3 text-sm text-gray-400">{label}</p>
      <input
        value={value}
        onChange={onChange}
        className="w-full h-[60px] rounded-2xl bg-black/20 border border-white/[0.06] px-5 outline-none focus:border-pink-500/50 transition-colors"
      />
    </div>
  );
}