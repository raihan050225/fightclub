'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Users, Swords, Trophy, Activity } from 'lucide-react'

// Import your newly modularized components
import AdminHeader from '@/components/admin/AdminHeader'
import StatsCard from '@/components/admin/StatsCard'
import ActivityFeed from '@/components/admin/ActivityFeed'

export default function AdminOverview() {
  const [stats, setStats] = useState({
    fighters: 0,
    requests: 0,
    confirmed: 0,
    pending: 0
  })
  const [loading, setLoading] = useState(true)

  // Demo logs for the Activity Feed (you can wire this to Firestore later)
  const recentLogs = [
    { message: 'System boot sequence initiated', time: '08:00 AM' },
    { message: 'Admin authentication successful', time: 'Just now' }
  ]

  useEffect(() => {
    // 1. Listen to Fighters collection
    const unsubFighters = onSnapshot(collection(db, 'fighters'), (snap) => {
      setStats(prev => ({ ...prev, fighters: snap.size }))
    })

    // 2. Listen to sparRequests collection for total, confirmed, and pending
    const unsubRequests = onSnapshot(collection(db, 'sparRequests'), (snap) => {
      let confirmedCount = 0;
      let pendingCount = 0;
      
      snap.forEach(doc => {
        const data = doc.data();
        if (data.status === 'confirmed') confirmedCount++;
        if (data.status === 'pending') pendingCount++;
      });

      setStats(prev => ({
        ...prev,
        requests: snap.size,
        confirmed: confirmedCount,
        pending: pendingCount
      }))
      setLoading(false)
    })

    return () => {
      unsubFighters()
      unsubRequests()
    }
  }, [])

  return (
    <div className="p-4 md:p-10">
      <AdminHeader 
        title="Command Center" 
        subtitle="Global overview of FightClub operations" 
      />

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <StatsCard 
          icon={<Users size={24} />} 
          title="Total Fighters" 
          value={stats.fighters} 
          loading={loading} 
        />
        <StatsCard 
          icon={<Swords size={24} />} 
          title="Total Requests" 
          value={stats.requests} 
          loading={loading} 
        />
        <StatsCard 
          icon={<Trophy size={24} />} 
          title="Confirmed Bouts" 
          value={stats.confirmed} 
          loading={loading} 
        />
        <StatsCard 
          icon={<Activity size={24} />} 
          title="Pending Actions" 
          value={stats.pending} 
          loading={loading} 
        />
      </div>

      {/* LOWER SECTION - Activity Feed */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ActivityFeed logs={recentLogs} />
        
        {/* Quick Info / Welcome Card */}
        <div className="rounded-[32px] bg-gradient-to-br from-pink-500/20 to-fuchsia-700/20 border border-pink-500/30 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-black mb-4">Welcome back, Admin.</h2>
          <p className="text-gray-400 leading-relaxed mb-6">
            All systems are fully operational. You can use the sidebar to manage fighter verifications, assign match locations, and moderate the global feed.
          </p>
          <div className="flex gap-4">
             <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></div>
             <span className="text-xs uppercase tracking-[2px] text-green-500 font-bold">Network Secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}