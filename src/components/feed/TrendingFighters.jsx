import React from 'react';

const TrendingFighter = () => {
  const trendingList = [
    { id: 1, name: 'Reaper', style: '72 KG | 12W-2L' },
    { id: 2, name: 'Ghost', style: '84 KG | Undefeated' },
    { id: 3, name: 'Neon', style: '65 KG | Striker' }
  ];

  return (
    <div className="border border-pink-500/20 bg-black/40 backdrop-blur-xl p-6 sticky top-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
        <h3 className="text-sm font-black uppercase tracking-[6px] text-white">Top Contenders</h3>
      </div>
      
      <ul className="space-y-6">
        {trendingList.map((fighter, index) => (
          <li key={fighter.id} className="flex justify-between items-center group cursor-pointer">
            <div className="flex gap-4 items-center">
              <span className="text-pink-500/50 font-black text-xl w-6">0{index + 1}</span>
              <div>
                <p className="font-black uppercase tracking-[2px] text-lg group-hover:text-pink-500 transition-colors">{fighter.name}</p>
                <p className="text-[10px] uppercase tracking-[4px] text-gray-500 mt-1">{fighter.style}</p>
              </div>
            </div>
            <button className="border border-white/10 px-3 py-1 uppercase text-[10px] tracking-[2px] text-gray-400 group-hover:border-pink-500 group-hover:text-pink-500 transition-all">
              Scout
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingFighter;