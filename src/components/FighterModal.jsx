'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth, db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'

export default function FighterModal({ fighter, isOpen, onClose }) {
  const [showSparForm, setShowSparForm] = useState(false)
  const [requestDate, setRequestDate] = useState('')
  const [requestTime, setRequestTime] = useState('')
  const [sending, setSending] = useState(false)

  async function requestSpar() {
    if (!requestDate || !requestTime) {
      alert('Please select a date and time')
      return
    }

    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        alert('Login first')
        return
      }

      setSending(true)

      await addDoc(collection(db, 'sparRequests'), {
        fromUserId: currentUser.uid,
        fromUsername: currentUser.email,
        toUserId: fighter.id,
        toUsername: fighter.name,
        status: 'pending',
        requestedDate: requestDate,
        requestedTime: requestTime,
        createdAt: Date.now()
      })

      setShowSparForm(false)
      setRequestDate('')
      setRequestTime('')
      alert('Spar request sent')
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    } finally {
      setSending(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-2xl overflow-y-auto"
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="fixed top-8 right-8 z-[1000] border border-pink-500/20 bg-black/40 px-6 py-4 uppercase tracking-[4px] text-xs hover:bg-pink-500 transition"
          >
            Close
          </button>

          {/* CONTENT */}
          <div className="min-h-screen flex items-center px-20 py-20">
            <div className="grid lg:grid-cols-2 gap-20 w-full items-center">

              {/* IMAGE */}
              <motion.div
                initial={{ opacity: 0, x: -120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -120 }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-pink-500 blur-[180px] opacity-20"></div>
                <img
                  src={fighter.image}
                  alt={fighter.name}
                  className="relative z-10 w-full h-[900px] object-cover"
                />
              </motion.div>

              {/* INFO */}
              <motion.div
                initial={{ opacity: 0, y: 120 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 120 }}
                transition={{ duration: 0.8 }}
              >
                <p className="uppercase tracking-[8px] text-pink-400 text-xs mb-6">{fighter.style}</p>
                <h1 className="text-[140px] leading-none font-black uppercase">{fighter.name}</h1>

                <div className="flex gap-8 mt-10 uppercase tracking-[4px] text-xs text-gray-400">
                  <p>{fighter.weight}</p>
                  <p>{fighter.record}</p>
                  <p>Available Tonight</p>
                </div>

                <p className="mt-14 text-gray-400 leading-9 max-w-2xl text-lg">
                  Underground fighter specializing in high-pressure striking,
                  elite conditioning, and aggressive forward movement.
                  Looking for advanced sparring partners and tournament opportunities.
                </p>

                {/* STATS */}
                <div className="grid grid-cols-3 gap-8 mt-16">
                  <div>
                    <h2 className="text-5xl font-black text-pink-500">92%</h2>
                    <p className="uppercase tracking-[4px] text-xs text-gray-500 mt-3">Win Rate</p>
                  </div>
                  <div>
                    <h2 className="text-5xl font-black text-pink-500">28</h2>
                    <p className="uppercase tracking-[4px] text-xs text-gray-500 mt-3">Fights</p>
                  </div>
                  <div>
                    <h2 className="text-5xl font-black text-pink-500">PRO</h2>
                    <p className="uppercase tracking-[4px] text-xs text-gray-500 mt-3">Level</p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-6 mt-16">
                  <button
                    onClick={() => setShowSparForm(true)}
                    className="bg-pink-500 px-10 py-5 uppercase tracking-[6px] font-bold shadow-[0_0_40px_#ff0080] hover:scale-105 transition"
                  >
                    Book Sparring
                  </button>
                  <button
                    onClick={() => setShowSparForm(true)}
                    className="border border-pink-500/20 px-10 py-5 uppercase tracking-[6px] text-gray-400 hover:border-pink-500 transition"
                  >
                    Send Request
                  </button>
                </div>

                {/* INLINE DATE/TIME FORM */}
                <AnimatePresence>
                  {showSparForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.3 }}
                      className="mt-10 border border-pink-500/20 bg-black/40 backdrop-blur-xl p-8"
                    >
                      <p className="uppercase tracking-[6px] text-pink-500 text-xs mb-8">Pick Date & Time</p>

                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <p className="uppercase tracking-[4px] text-xs text-gray-400 mb-3">Date</p>
                          <input
                            type="date"
                            value={requestDate}
                            onChange={e => setRequestDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-black/40 border border-white/[0.08] px-5 py-4 text-white outline-none focus:border-pink-500/50 transition-colors text-sm"
                            style={{ colorScheme: 'dark' }}
                          />
                        </div>
                        <div>
                          <p className="uppercase tracking-[4px] text-xs text-gray-400 mb-3">Time</p>
                          <input
                            type="time"
                            value={requestTime}
                            onChange={e => setRequestTime(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.08] px-5 py-4 text-white outline-none focus:border-pink-500/50 transition-colors text-sm"
                            style={{ colorScheme: 'dark' }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setShowSparForm(false)}
                          className="flex-1 py-4 border border-white/[0.08] uppercase tracking-[4px] text-xs hover:bg-white/[0.05] transition"
                        >
                          Cancel
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={requestSpar}
                          disabled={sending}
                          className="flex-1 py-4 bg-pink-500 uppercase tracking-[4px] text-xs font-bold shadow-[0_0_30px_#ff0080] disabled:opacity-50"
                        >
                          {sending ? 'Sending...' : 'Confirm Request'}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}