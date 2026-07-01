'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import Sidebar from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'

export default function InboxPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  // Counter-offer state
  const [counterTarget, setCounterTarget] = useState(null)
  const [counterDate, setCounterDate] = useState('')
  const [counterTime, setCounterTime] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function loadRequests() {
      try {
        const user = auth.currentUser
        if (!user) return

        const q = query(
          collection(db, 'sparRequests'),
          where('toUserId', '==', user.uid)
        )

        const snapshot = await getDocs(q)
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
        setRequests(data)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [])

  async function updateStatus(id, status) {
    try {
      await updateDoc(doc(db, 'sparRequests', id), { status })
      setRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status } : req)
      )
    } catch (err) {
      console.log(err)
    }
  }

  function openCounter(request) {
    setCounterTarget(request)
    setCounterDate('')
    setCounterTime('')
  }

  async function submitCounter() {
    if (!counterDate || !counterTime) {
      alert('Please select a date and time for your counter offer')
      return
    }

    try {
      setSending(true)
      await updateDoc(doc(db, 'sparRequests', counterTarget.id), {
        status: 'countered',
        counterDate,
        counterTime
      })

      setRequests(prev =>
        prev.map(req =>
          req.id === counterTarget.id
            ? { ...req, status: 'countered', counterDate, counterTime }
            : req
        )
      )

      setCounterTarget(null)
      alert('Counter offer sent!')
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    } finally {
      setSending(false)
    }
  }

  function statusColor(status) {
    if (status === 'accepted') return 'text-green-400'
    if (status === 'declined') return 'text-red-400'
    if (status === 'countered') return 'text-yellow-400'
    return 'text-pink-500'
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* GRID */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.08)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* GLOW */}
      <div className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full blur-[300px] opacity-10"></div>

      <Sidebar />

      <section className="relative z-20 ml-24 px-12 py-20">

        {/* HEADER */}
        <div className="mb-20">
          <p className="uppercase tracking-[8px] text-gray-500 text-xs mb-6">Fight Requests</p>
          <h1 className="text-[120px] font-black uppercase leading-none">
            Spar<span className="text-pink-500"> Inbox</span>
          </h1>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex items-center justify-center h-[400px]">
            <h2 className="text-5xl font-black uppercase animate-pulse">Loading Requests...</h2>
          </div>

        ) : requests.length === 0 ? (
          <div className="flex items-center justify-center h-[400px] border border-pink-500/10 bg-black/40 backdrop-blur-xl">
            <div className="text-center">
              <h2 className="text-5xl font-black uppercase mb-6">No Requests</h2>
              <p className="uppercase tracking-[4px] text-gray-500 text-xs">Spar requests will appear here</p>
            </div>
          </div>

        ) : (
          <div className="grid gap-8">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-pink-500/20 bg-black/40 backdrop-blur-xl p-8"
              >
                <div className="flex items-start justify-between gap-6 flex-wrap">

                  {/* LEFT */}
                  <div>
                    <p className="uppercase tracking-[4px] text-xs text-gray-500 mb-4">Incoming Request</p>
                    <h2 className="text-5xl font-black uppercase">{request.fromUsername}</h2>

                    {/* REQUESTED DATE/TIME */}
                    {request.requestedDate && (
                      <div className="flex gap-6 mt-4">
                        <p className="uppercase tracking-[4px] text-xs text-gray-400">
                          Date: <span className="text-white">{request.requestedDate}</span>
                        </p>
                        <p className="uppercase tracking-[4px] text-xs text-gray-400">
                          Time: <span className="text-white">{request.requestedTime}</span>
                        </p>
                      </div>
                    )}

                    {/* COUNTER OFFER DETAILS */}
                    {request.status === 'countered' && request.counterDate && (
                      <div className="mt-4 border border-yellow-500/20 bg-yellow-500/5 px-5 py-4 inline-block">
                        <p className="uppercase tracking-[4px] text-xs text-yellow-400 mb-2">Counter Offer Sent</p>
                        <p className="uppercase tracking-[3px] text-xs text-gray-300">
                          {request.counterDate} at {request.counterTime}
                        </p>
                      </div>
                    )}

                    <p className={`mt-4 uppercase tracking-[4px] text-xs ${statusColor(request.status)}`}>
                      Status: {request.status}
                    </p>
                  </div>

                  {/* BUTTONS — only show if pending */}
                  {request.status === 'pending' && (
                    <div className="flex gap-4 flex-wrap">
                      <button
                        onClick={() => updateStatus(request.id, 'accepted')}
                        className="bg-pink-500 px-8 py-4 uppercase tracking-[4px] text-xs font-bold"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => openCounter(request)}
                        className="border border-yellow-500/40 bg-yellow-500/10 text-yellow-400 px-8 py-4 uppercase tracking-[4px] text-xs font-bold hover:bg-yellow-500/20 transition"
                      >
                        Counter
                      </button>
                      <button
                        onClick={() => updateStatus(request.id, 'declined')}
                        className="border border-pink-500/20 bg-black/40 px-8 py-4 uppercase tracking-[4px] text-xs hover:border-pink-500 transition"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* COUNTER OFFER MODAL */}
      <AnimatePresence>
        {counterTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden w-full max-w-lg border border-yellow-500/20 bg-[#0a0a0a] p-10"
            >
              {/* GLOW */}
              <div className="absolute top-[-80px] right-[-80px] w-[200px] h-[200px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="relative z-10">
                <p className="uppercase tracking-[6px] text-yellow-400 text-xs mb-4">Counter Offer</p>
                <h2 className="text-4xl font-black uppercase leading-none mb-2">{counterTarget.fromUsername}</h2>
                <p className="text-gray-500 uppercase tracking-[3px] text-xs mb-2">
                  Their request: {counterTarget.requestedDate} at {counterTarget.requestedTime}
                </p>
                <p className="text-gray-500 uppercase tracking-[3px] text-xs mb-10">Propose a different time below</p>

                {/* DATE */}
                <div className="mb-6">
                  <p className="uppercase tracking-[4px] text-xs text-gray-400 mb-3">Your Date</p>
                  <input
                    type="date"
                    value={counterDate}
                    onChange={e => setCounterDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-black/40 border border-white/[0.08] px-5 py-4 text-white outline-none focus:border-yellow-500/50 transition-colors text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                {/* TIME */}
                <div className="mb-10">
                  <p className="uppercase tracking-[4px] text-xs text-gray-400 mb-3">Your Time</p>
                  <input
                    type="time"
                    value={counterTime}
                    onChange={e => setCounterTime(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.08] px-5 py-4 text-white outline-none focus:border-yellow-500/50 transition-colors text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setCounterTarget(null)}
                    className="flex-1 py-4 border border-white/[0.08] bg-white/[0.03] uppercase tracking-[4px] text-xs hover:bg-white/[0.08] transition"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={submitCounter}
                    disabled={sending}
                    className="flex-1 py-4 bg-yellow-500 text-black uppercase tracking-[4px] text-xs font-bold disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Counter'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}