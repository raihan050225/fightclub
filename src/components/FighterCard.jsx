'use client'

import { useState } from 'react'
import Tilt from 'react-parallax-tilt'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'

export default function FighterCard(props) {
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [requestDate, setRequestDate] = useState('')
  const [requestTime, setRequestTime] = useState('')

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
        toUserId: props.id,
        toUsername: props.name,
        status: 'pending',
        requestedDate: requestDate,
        requestedTime: requestTime,
        createdAt: Date.now()
      })

      setShowModal(false)
      alert('Spar request sent')
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    } finally {
      setSending(false)
    }
  }

  function viewProfile() {
    router.push(`/fighter/${props.id}`)
  }

  return (
    <>
      <Tilt
        glareEnable
        glareMaxOpacity={0.4}
        scale={1.02}
        perspective={2500}
        transitionSpeed={1500}
        className="w-full"
      >
        <motion.div
          whileHover={{ y: -10 }}
          className="group relative overflow-hidden h-[650px] border border-pink-500/20 bg-black"
        >
          {/* GLOW */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-pink-500/10 blur-3xl transition duration-700 z-10"></div>

          {/* IMAGE */}
          <img
            src={props.image}
            alt={props.name}
            className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 group-hover:rotate-1 group-hover:blur-[1px] transition duration-1000"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

          {/* CONTENT */}
          <div className="absolute bottom-0 left-0 p-8 z-30">
            <h2 className="text-7xl font-black uppercase leading-none">{props.name}</h2>

            <div className="flex items-center gap-6 mt-6 uppercase tracking-[4px] text-xs text-gray-300">
              <p>{props.weight}</p>
              <div className="w-1 h-1 rounded-full bg-pink-500"></div>
              <p>{props.style}</p>
            </div>

            <p className="mt-4 uppercase tracking-[4px] text-xs text-gray-500">{props.record}</p>

            <div className="flex gap-4 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(true)}
                className="bg-pink-500 px-6 py-4 uppercase tracking-[4px] text-xs font-bold shadow-[0_0_20px_#ff0080]"
              >
                Request Spar
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={viewProfile}
                className="border border-pink-500/20 bg-black/40 backdrop-blur-xl px-6 py-4 uppercase tracking-[4px] text-xs hover:border-pink-500 transition"
              >
                View Profile
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Tilt>

      {/* DATE/TIME MODAL */}
      <AnimatePresence>
        {showModal && (
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
              className="relative overflow-hidden w-full max-w-lg border border-pink-500/20 bg-[#0a0a0a] p-10"
            >
              {/* GLOW */}
              <div className="absolute top-[-80px] right-[-80px] w-[200px] h-[200px] bg-pink-500/20 blur-[100px] rounded-full pointer-events-none"></div>

              <div className="relative z-10">
                <p className="uppercase tracking-[6px] text-pink-500 text-xs mb-4">Spar Request</p>
                <h2 className="text-5xl font-black uppercase leading-none mb-2">{props.name}</h2>
                <p className="text-gray-500 uppercase tracking-[3px] text-xs mb-10">Pick your preferred date & time</p>

                {/* DATE */}
                <div className="mb-6">
                  <p className="uppercase tracking-[4px] text-xs text-gray-400 mb-3">Date</p>
                  <input
                    type="date"
                    value={requestDate}
                    onChange={e => setRequestDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-black/40 border border-white/[0.08] px-5 py-4 text-white outline-none focus:border-pink-500/50 transition-colors uppercase tracking-[2px] text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                {/* TIME */}
                <div className="mb-10">
                  <p className="uppercase tracking-[4px] text-xs text-gray-400 mb-3">Time</p>
                  <input
                    type="time"
                    value={requestTime}
                    onChange={e => setRequestTime(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.08] px-5 py-4 text-white outline-none focus:border-pink-500/50 transition-colors uppercase tracking-[2px] text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 border border-white/[0.08] bg-white/[0.03] uppercase tracking-[4px] text-xs hover:bg-white/[0.08] transition"
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}