'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'

import AdminHeader from '@/components/admin/AdminHeader'
import MatchesTable from '@/components/admin/MatchesTable'

export default function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  // Real-time listener for confirmed matches
  useEffect(() => {
    const unsubMatches = onSnapshot(collection(db, 'sparRequests'), (snapshot) => {
      setMatches(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    
    return () => unsubMatches()
  }, [])

  return (
    <div className="p-4 md:p-10">
      <AdminHeader 
        title="Scheduled Bouts" 
        subtitle="Overview of all confirmed matches and locations" 
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <MatchesTable matches={matches} />
      )}
    </div>
  )
}