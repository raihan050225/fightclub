import React from 'react';
import { Activity } from 'lucide-react';

export default function ActivityFeed({ logs = [] }) {
  return (
    <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7">
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <Activity className="text-pink-500" />
        <h2 className="text-xl font-black uppercase tracking-[2px]">System Logs</h2>
      </div>

      <div className="space-y-6">
        {logs.length === 0 ? (
          <p className="text-gray-500 text-sm">System is quiet. No recent activity.</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-4 relative">
              {/* Timeline line */}
              {i !== logs.length - 1 && <div className="absolute left-2 top-6 bottom-[-24px] w-[1px] bg-white/10"></div>}
              
              <div className="w-4 h-4 rounded-full bg-pink-500 mt-1 shadow-[0_0_10px_rgba(255,0,128,0.5)]"></div>
              <div>
                <p className="text-sm font-medium text-white">{log.message}</p>
                <p className="text-[10px] uppercase tracking-[2px] text-gray-500 mt-1">{log.time}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}