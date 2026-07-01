'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

import AdminHeader from '@/components/admin/AdminHeader'
import RequestTable from '@/components/admin/RequestTable'
import Input from '@/components/admin/Input'

export default function RequestsPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [assignment, setAssignment] = useState({ gym: '', location: '', time: '', notes: '' })

  // Real-time listener for match requests
  useEffect(() => {
    const unsubRequests = onSnapshot(collection(db, 'sparRequests'), (snapshot) => {
      setRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return () => unsubRequests()
  }, [])

  const updateRequestStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'sparRequests', id), { status })
    } catch (err) {
      console.error("Status update failed:", err)
    }
  }

  const handleApproveClick = (requestItem) => {
    setSelectedRequest(requestItem)
    setAssignment({ gym: '', location: '', time: '', notes: '' })
  }

  const confirmMatch = async () => {
    if (!selectedRequest) return
    try {
      await updateDoc(doc(db, 'sparRequests', selectedRequest.id), {
        status: 'confirmed',
        gym: assignment.gym,
        location: assignment.location,
        time: assignment.time,
        notes: assignment.notes
      })
      setSelectedRequest(null)
      alert("Match scheduled successfully!")
    } catch (err) {
      console.error("Error scheduling match:", err)
      alert("Failed to schedule match. Check console.")
    }
  }

  return (
    <div className="min-h-screen overflow-y-auto p-4 md:p-10">
      <AdminHeader
        title="Match Requests"
        subtitle="Approve, reject, and schedule bout assignments"
      />

      <RequestTable
        requests={requests}
        onApprove={handleApproveClick}
        onReject={updateRequestStatus}
        loading={loading}
      />

      {/* ASSIGNMENT MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="relative overflow-hidden w-full max-w-2xl rounded-[40px] border border-white/[0.06] bg-[#111111] p-8">
            <div className="absolute top-[-100px] right-[-100px] w-[250px] h-[250px] bg-pink-500/20 blur-[120px] rounded-full"></div>

            <div className="relative z-20">
              <h2 className="text-4xl font-black text-white">Assign Match</h2>
              <p className="mt-3 text-gray-400 mb-8">
                Finalize sparring details for {selectedRequest.fromUsername}
              </p>

              <div className="space-y-5">
                <Input
                  label="Gym"
                  value={assignment.gym}
                  onChange={e => setAssignment({ ...assignment, gym: e.target.value })}
                />
                <Input
                  label="Location"
                  value={assignment.location}
                  onChange={e => setAssignment({ ...assignment, location: e.target.value })}
                />
                <Input
                  label="Time"
                  value={assignment.time}
                  onChange={e => setAssignment({ ...assignment, time: e.target.value })}
                />

                <div>
                  <p className="mb-3 text-sm text-gray-400">Notes</p>
                  <textarea
                    rows={4}
                    value={assignment.notes}
                    onChange={e => setAssignment({ ...assignment, notes: e.target.value })}
                    className="w-full rounded-3xl bg-black/20 border border-white/[0.06] px-5 py-4 outline-none text-white focus:border-pink-500/50 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="flex-1 h-[60px] rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.1] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmMatch}
                    className="flex-1 h-[60px] rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 font-bold text-white hover:scale-[1.02] transition"
                  >
                    Confirm Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}