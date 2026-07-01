'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {

      // Not logged in at all -> send to login
      if (!user) {
        router.replace('/login')
        return
      }

      try {
        // admin collection doc ID == user's uid
        const adminDoc = await getDoc(doc(db, 'admins', user.uid))

        if (adminDoc.exists()) {
          setAuthorized(true)
        } else {
          // Logged in, but not an admin -> send to explore
          router.replace('/explore')
        }
      } catch (err) {
        console.log(err)
        router.replace('/explore')
      } finally {
        setCheckingAuth(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  // Block rendering of any admin content until the check finishes
  if (checkingAuth || !authorized) {
    return (
      <div className="min-h-screen bg-[#050507] text-white flex items-center justify-center">
        <p className="uppercase tracking-[4px] text-xs text-gray-500">
          Verifying access...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050507]  text-white flex ">

      {/* GLOBAL ADMIN BACKGROUND - This stays persistent across all admin pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-pink-500/20 blur-[180px] rounded-full"></div>
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-fuchsia-500/20 blur-[180px] rounded-full"></div>
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      {/* PERSISTENT SIDEBAR - Imported from your new components folder */}
      <AdminSidebar />

      {/* DYNAMIC PAGE CONTENT - Next.js injects page.js right here */}
      <main className="relative z-20 flex-1 overflow-y-auto h-screen">
        {children}
      </main>

    </div>
  )
}