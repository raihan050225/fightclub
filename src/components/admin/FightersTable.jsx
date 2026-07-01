import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function FightersTable({ fighters, onVerify }) {
  return (
    <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7">
      <h2 className="text-3xl font-black mb-8">Fighters</h2>
      <div className="space-y-5">
        {fighters.map((fighter) => (
          <div key={fighter.id} className="rounded-3xl border border-white/[0.06] bg-black/20 p-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-pink-500/20">
                {fighter.image && (
                  <img src={fighter.image} alt="fighter" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <h3 className="font-bold">{fighter.username}</h3>
                <p className="text-sm text-gray-400 mt-1">{fighter.style || 'Fighter'}</p>
              </div>
            </div>
            
            {fighter.verified ? (
              <div className="mt-4 px-4 py-2 rounded-2xl bg-green-500/10 text-green-400 text-xs uppercase tracking-[3px] inline-flex items-center gap-2">
                <ShieldCheck size={16} /> VERIFIED
              </div>
            ) : (
              <button
                onClick={() => onVerify(fighter.id)}
                className="mt-4 px-5 py-3 rounded-2xl bg-pink-500/20 text-pink-400 text-sm font-bold transition hover:bg-pink-500/30"
              >
                VERIFY FIGHTER
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}