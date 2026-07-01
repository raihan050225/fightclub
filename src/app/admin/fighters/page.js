'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

import AdminHeader from '@/components/admin/AdminHeader'
import FightersTable from '@/components/admin/FightersTable'

export default function FightersPage() {
  const [fighters, setFighters] = useState([])
  const [loading, setLoading] = useState(true)

  // Real-time listener for the fighters collection
  useEffect(() => {
    const unsubFighters = onSnapshot(collection(db, 'fighters'), (snapshot) => {
      setFighters(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return () => unsubFighters()
  }, [])

  // The verify action passed down to the table
  const handleVerify = async (id) => {
    try {
      await updateDoc(doc(db, 'fighters', id), { verified: true })
    } catch (err) {
      console.error("Verification failed:", err)
    }
  }

  return (
    <div className="p-4 md:p-10">
      <AdminHeader 
        title="Fighter Roster" 
        subtitle="Manage user accounts and verification statuses" 
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <FightersTable fighters={fighters} onVerify={handleVerify} />
      )}
    </div>
  )
}