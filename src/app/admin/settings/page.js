'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { ToggleLeft, ToggleRight, Save, Shield } from 'lucide-react'

import AdminHeader from '@/components/admin/AdminHeader'

export default function SettingsPage() {
  const [config, setConfig] = useState({ inviteOnly: true, maintenanceMode: false })
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const unsubConfig = onSnapshot(doc(db, 'system', 'config'), (snapshot) => {
      if (snapshot.exists()) {
        setConfig(snapshot.data())
      }
    })
    return () => unsubConfig()
  }, [])

  const handleToggle = async (key) => {
    setUpdating(true)
    try {
      const configRef = doc(db, 'system', 'config')
      await updateDoc(configRef, { [key]: !config[key] }).catch(async (err) => {
        // Fallback if document doesn't exist yet
        if (err.code === 'not-found') {
          await setDoc(configRef, { ...config, [key]: !config[key] })
        }
      })
    } catch (err) {
      console.error("Configuration system push failed:", err)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="p-4 md:p-10 max-w-4xl">
      <AdminHeader 
        title="System Parameters" 
        subtitle="Configure network controls and algorithmic toggles globally" 
      />

      <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-8 space-y-8">
        <h3 className="text-xl font-black flex items-center gap-2 border-b border-white/5 pb-4 uppercase tracking-[1px]">
          <Shield className="text-pink-500" size={20} /> Security Gateways
        </h3>

        {/* INVITE ONLY CONTROL */}
        <div className="flex justify-between items-center bg-black/30 p-6 rounded-2xl border border-white/[0.02]">
          <div>
            <h4 className="font-bold text-white text-lg">Invite Only Restrictions</h4>
            <p className="text-sm text-gray-400 mt-1">Locks registration. New users must present verification hash to sign up.</p>
          </div>
          <button 
            disabled={updating}
            onClick={() => handleToggle('inviteOnly')}
            className={`transition text-pink-500 disabled:opacity-50`}
          >
            {config.inviteOnly ? <ToggleRight size={50} /> : <ToggleLeft size={50} className="text-gray-600" />}
          </button>
        </div>

        {/* MAINTENANCE TOGGLE */}
        <div className="flex justify-between items-center bg-black/30 p-6 rounded-2xl border border-white/[0.02]">
          <div>
            <h4 className="font-bold text-white text-lg">System Maintenance Lockout</h4>
            <p className="text-sm text-gray-400 mt-1">Forces standard application routes offline globally for all non-admin ranks.</p>
          </div>
          <button 
            disabled={updating}
            onClick={() => handleToggle('maintenanceMode')}
            className={`transition text-pink-500 disabled:opacity-50`}
          >
            {config.maintenanceMode ? <ToggleRight size={50} /> : <ToggleLeft size={50} className="text-gray-600" />}
          </button>
        </div>
      </div>
    </div>
  )
}