import React from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';

export default function RevenueCard({ total = "0.00", percentage = "+0%" }) {
  return (
    <div className="rounded-[32px] bg-gradient-to-br from-black to-gray-900 border border-white/[0.06] p-7 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-500/10 blur-[50px] rounded-full"></div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-xs uppercase tracking-[4px] text-gray-500 mb-2">Vault Balance</p>
          <h2 className="text-4xl font-black text-white flex items-center gap-1">
            <DollarSign size={32} className="text-green-500" />
            {total}
          </h2>
        </div>
        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
          <TrendingUp size={14} /> {percentage}
        </div>
      </div>
    </div>
  );
}