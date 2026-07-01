import React from 'react';
import { Calendar, MapPin, Building2 } from 'lucide-react';

export default function MatchesTable({ matches }) {
  // Only show confirmed matches
  const confirmedMatches = matches?.filter(m => m.status === 'confirmed') || [];

  return (
    <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7">
      <h2 className="text-3xl font-black mb-8">Confirmed Bouts</h2>
      
      {confirmedMatches.length === 0 ? (
        <p className="text-gray-500 uppercase tracking-[2px] text-sm">No confirmed matches currently scheduled.</p>
      ) : (
        <div className="space-y-4">
          {confirmedMatches.map((match) => (
            <div key={match.id} className="rounded-3xl border border-pink-500/20 bg-black/40 p-5 hover:border-pink-500/50 transition">
              <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-[2px]">
                  {match.fromUsername} <span className="text-pink-500 mx-2">VS</span> {match.toUsername}
                </h3>
                <span className="px-3 py-1 bg-pink-500/10 text-pink-500 rounded-full text-[10px] uppercase tracking-[2px] font-bold">
                  Scheduled
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2"><Building2 size={16} className="text-pink-500"/> {match.gym}</div>
                <div className="flex items-center gap-2"><MapPin size={16} className="text-pink-500"/> {match.location}</div>
                <div className="flex items-center gap-2"><Calendar size={16} className="text-pink-500"/> {match.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}