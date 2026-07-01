'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

// Make sure db is imported alongside auth
import { auth, db } from '@/lib/firebase' 

import { motion } from 'framer-motion'

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleLogin() {
    try {
      // 1. Authenticate the user
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      
      const user = userCredential.user;

      // 2. Check for Level 10 Clearance in the 'admins' collection
      const adminRef = doc(db, 'admins', user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        // Admin found -> Route to Admin Dashboard
        router.push('/admin')
      } else {
        // Regular fighter -> Route to Home
        router.push('/home')
      }

    } catch (error) {
      alert(error.message)
    }
  }

  async function handleSignup() {
    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      alert('Account Created')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white flex items-center justify-center">

      {/* GRID */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,0,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.08)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* GLOW */}
      <div className="absolute w-[700px] h-[700px] bg-pink-500 blur-[200px] opacity-20 rounded-full"></div>

      {/* NOISE */}
      <div className="noise"></div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 w-full max-w-2xl border border-pink-500/20 bg-black/50 backdrop-blur-xl p-10 md:p-16"
      >

        {/* TOP */}
        <div className="flex justify-between items-center mb-10 text-xs uppercase tracking-[6px] text-gray-500">
          <p>Invite Only</p>
          <p>EST · MMXXVI</p>
        </div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-7xl md:text-[120px] font-black uppercase text-pink-500 leading-none"
          style={{
            textShadow:
              '0 0 10px #ff0080, 0 0 30px #ff0080, 0 0 60px #ff0080'
          }}
        >
          FightClub
        </motion.h1>

        {/* SUBTEXT */}
        <p className="mt-8 text-center uppercase tracking-[6px] text-gray-400 text-xs leading-8">
          Find a fighter.
          <br />
          Book a round.
          <br />
          Enter the ring.
        </p>

        {/* FORM */}
        <div className="mt-14 space-y-6">

          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/70 border border-pink-500/20 px-6 py-5 uppercase tracking-[4px] outline-none focus:border-pink-500 transition"
          />

          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/70 border border-pink-500/20 px-6 py-5 uppercase tracking-[4px] outline-none focus:border-pink-500 transition"
          />

          {/* LOGIN */}
          <button
            onClick={handleLogin}
            className="w-full bg-pink-500 py-5 uppercase tracking-[6px] font-bold shadow-[0_0_40px_#ff0080] hover:scale-[1.02] transition"
          >
            Enter The Ring
          </button>

          {/* SIGNUP */}
          <button
            onClick={handleSignup}
            className="w-full border border-pink-500/20 py-5 uppercase tracking-[6px] text-gray-400 hover:border-pink-500 transition"
          >
            Create Account
          </button>

        </div>
      </motion.div>
    </main>
  )
}