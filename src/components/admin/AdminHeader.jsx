import React from 'react';
import { Bell } from 'lucide-react';

export default function AdminHeader({ title = "Admin Dashboard", subtitle = "Operational control center" }) {
  return (
    <div className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          {title}
        </h1>
        <p className="text-gray-400 mt-2 text-sm md:text-lg">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center backdrop-blur-xl hover:bg-white/[0.1] transition">
          <Bell size={20} />
        </button>

        <div className="hidden md:flex items-center gap-4 rounded-2xl border border-white/[0.05] bg-white/[0.04] backdrop-blur-xl px-5 py-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-fuchsia-600 shadow-[0_0_15px_rgba(255,0,128,0.5)]"></div>
          <div>
            <h3 className="font-semibold text-sm">System Admin</h3>
            <p className="text-[10px] uppercase tracking-[2px] text-pink-500">Level 10</p>
          </div>
        </div>
      </div>
    </div>
  );
}