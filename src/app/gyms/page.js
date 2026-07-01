'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { MapPin, Percent, Dumbbell, Activity, Flame, Clock, CheckCircle2 } from 'lucide-react'

export default function FighterGymsPage() {
  const [gyms, setGyms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'gyms'), (snapshot) => {
      setGyms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return () => unsub()
  }, [])

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 md:p-10 pb-32">
      
      {/* ELITE HEADER */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
          Training <span className="text-pink-500">Grounds</span>
        </h1>
        <p className="text-gray-400">Exclusive access and VIP pricing for verified FightClub members.</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-12">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && gyms.length === 0 && (
          <p className="text-gray-500 italic text-center py-20">No facilities are currently partnered in your sector.</p>
        )}

        {gyms.map((gym) => (
          <div key={gym.id} className="rounded-[32px] overflow-hidden border border-white/[0.06] bg-black/40 hover:border-pink-500/30 transition-colors group">
            
            {/* HORIZONTAL IMAGE CAROUSEL (HIDDEN SCROLLBAR) */}
            <div className="w-full h-64 md:h-80 bg-white/[0.01] flex items-center gap-4 overflow-x-auto p-6 border-b border-white/[0.05] snap-x snap-mandatory [&::-webkit-scrollbar]:hidden scroll-smooth">
              {gym.images && gym.images.length > 0 ? (
                gym.images.map((imgUrl, i) => (
                  <div key={i} className="h-full min-w-[85%] md:min-w-[400px] snap-center rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={imgUrl} alt={`${gym.name} facility`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                ))
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gradient-to-br from-black to-gray-900 rounded-2xl">
                  <Dumbbell size={48} className="opacity-20 mb-4" />
                  <span className="text-sm uppercase tracking-[2px]">Classified Location</span>
                </div>
              )}
            </div>

            {/* DETAILS SECTION */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                
                {/* INFO BLOCK */}
                <div className="flex-1">
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-[1px] text-white mb-2">{gym.name}</h2>
                  <p className="flex items-center gap-2 text-gray-400 mb-6">
                    <MapPin size={16} className="text-pink-500" /> {gym.location}
                  </p>

                  <p className="text-gray-300 leading-relaxed mb-8 max-w-3xl">
                    {gym.about || "Elite training facility authorized for FC members."}
                  </p>

                  {/* VIP AMENITIES */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gym.features?.hasRing && (
                      <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-white/10 p-3 rounded-xl">
                        <Flame size={16} className="text-pink-500" /> Octagon / Ring
                      </div>
                    )}
                    {gym.features?.hasRecovery && (
                      <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-white/10 p-3 rounded-xl">
                        <Activity size={16} className="text-blue-500" /> Cryo / Recovery
                      </div>
                    )}
                    {gym.features?.hasCoaches && (
                      <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-white/10 p-3 rounded-xl">
                        <CheckCircle2 size={16} className="text-green-500" /> Pro Coaches
                      </div>
                    )}
                    {gym.features?.isAlwaysOpen && (
                      <div className="flex items-center gap-2 text-sm font-bold text-white bg-white/5 border border-white/10 p-3 rounded-xl">
                        <Clock size={16} className="text-amber-500" /> 24/7 Access
                      </div>
                    )}
                  </div>
                </div>

                {/* PRICING & ACTION BLOCK */}
                <div className="w-full lg:w-72 bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.1] rounded-3xl p-6 relative overflow-hidden">
                  {/* Glowing background effect */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/20 blur-[50px] pointer-events-none"></div>

                  <div className="text-xs text-gray-400 uppercase tracking-[2px] mb-4">FC Member Rate</div>
                  
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl font-black text-pink-500">${gym.fighterPrice}</span>
                    <span className="text-sm text-gray-500">/mo</span>
                  </div>

                  {gym.discount > 0 ? (
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-sm text-gray-500 line-through">${gym.basePrice}</span>
                      <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-1 rounded-md font-bold uppercase tracking-[1px] flex items-center gap-1">
                        <Percent size={12} /> {gym.discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <div className="mb-6 h-6"></div> // Spacer
                  )}

                  <button className="w-full h-[50px] rounded-xl bg-white text-black font-black uppercase tracking-[2px] hover:bg-pink-500 hover:text-white transition-colors">
                    Claim Pass
                  </button>
                  <p className="text-[10px] text-center text-gray-500 mt-4 uppercase tracking-[1px]">
                    Present FC ID at front desk
                  </p>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}