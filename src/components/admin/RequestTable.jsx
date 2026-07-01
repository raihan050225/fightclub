import React from 'react';
import { CheckCircle2, XCircle, Building2, MapPin, Clock3, Loader2 } from 'lucide-react';
import InfoCard from './InfoCard';

export default function RequestTable({ requests, onApprove, onReject, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-pink-500" size={40} />
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7">
      <h2 className="text-3xl font-black mb-8 uppercase tracking-[2px]">Match Requests</h2>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No pending requests at this time.</p>
      ) : (
        <div className="space-y-5">
          {requests.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/[0.06] bg-black/20 p-6 transition-all hover:border-white/[0.1]"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                {/* FIGHTER INFO */}
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-pink-500/20 border-2 border-pink-500/20">
                    {item.fromImage ? (
                      <img src={item.fromImage} alt={item.fromUsername} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold">
                        {item.fromUsername?.[0] ?? '?'}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{item.fromUsername ?? 'Unknown'}</h3>
                    <p className="text-gray-400 mt-1">
                      Sparring request: <span className="text-white">{item.toUsername ?? 'Unknown'}</span>
                    </p>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-3">
                  {item.status === 'pending' && (
                    <>
                      <button
                        onClick={() => onApprove(item)}
                        className="px-6 py-3 rounded-2xl bg-green-500/20 text-green-400 text-sm font-bold flex items-center gap-2 hover:bg-green-500/30 transition"
                      >
                        <CheckCircle2 size={18} /> APPROVE
                      </button>
                      <button
                        onClick={() => onReject(item.id, 'rejected')}
                        className="px-6 py-3 rounded-2xl bg-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2 hover:bg-red-500/30 transition"
                      >
                        <XCircle size={18} /> REJECT
                      </button>
                    </>
                  )}

                  {item.status === 'confirmed' && (
                    <div className="px-5 py-3 rounded-2xl bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-[2px]">
                      Confirmed
                    </div>
                  )}
                  {item.status === 'rejected' && (
                    <div className="px-5 py-3 rounded-2xl bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-[2px]">
                      Rejected
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILS — only shown when confirmed */}
              {item.status === 'confirmed' && (
                <div className="grid md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/[0.05]">
                  <InfoCard icon={<Building2 size={18} />} title="Gym" value={item.gym || '—'} />
                  <InfoCard icon={<MapPin size={18} />} title="Location" value={item.location || '—'} />
                  <InfoCard icon={<Clock3 size={18} />} title="Time" value={item.time || '—'} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}