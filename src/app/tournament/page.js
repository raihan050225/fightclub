'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, addDoc, serverTimestamp, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Trophy, Calendar, Clock, DollarSign, Users, CheckCircle2, QrCode, X, Search, Clock4, ShieldCheck } from 'lucide-react'

export default function FightersTournamentPage() {
  const [activeTab, setActiveTab] = useState('explore') // 'explore' or 'participated'
  
  const [tournaments, setTournaments] = useState([])
  const [selectedTournament, setSelectedTournament] = useState(null)
  
  // Registration State
  const [fighterName, setFighterName] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  // Tracking State
  const [myFighterTag, setMyFighterTag] = useState('')
  const [myRegistrations, setMyRegistrations] = useState([])
  const [lookupTag, setLookupTag] = useState('')

  const PAYMENT_QR_URL = "/my-qr-code.png" // Your local QR image

  // 1. Fetch Active Tournaments
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tournaments'), (snapshot) => {
      const activeTournaments = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(t => t.status === 'active')
      setTournaments(activeTournaments)
    })
    return () => unsub()
  }, [])

  // 2. Load Fighter Tag from device memory on boot
  useEffect(() => {
    const savedTag = localStorage.getItem('fc_fighter_tag')
    if (savedTag) {
      setMyFighterTag(savedTag)
      setLookupTag(savedTag)
    }
  }, [])

  // 3. Fetch My Registrations when myFighterTag is set
  useEffect(() => {
    if (!myFighterTag) return
    const q = query(collection(db, 'tournamentRegistrations'), where('fighterName', '==', myFighterTag))
    const unsub = onSnapshot(q, (snapshot) => {
      setMyRegistrations(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [myFighterTag])

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!fighterName) return alert("Enter your fighter name.")
    if (selectedTournament.isPaid && !transactionId) return alert("Transaction ID is required for paid entry.")

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, 'tournamentRegistrations'), {
        tournamentId: selectedTournament.id,
        tournamentTitle: selectedTournament.title,
        fighterName: fighterName,
        transactionId: transactionId || 'FREE_ENTRY',
        status: selectedTournament.isPaid ? 'pending_payment' : 'confirmed',
        timestamp: serverTimestamp()
      })
      
      // Save to device memory so they can track it instantly
      localStorage.setItem('fc_fighter_tag', fighterName)
      setMyFighterTag(fighterName)
      setLookupTag(fighterName)

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setSelectedTournament(null)
        setFighterName('')
        setTransactionId('')
        setActiveTab('participated') // Switch to tracking tab automatically
      }, 3000)

    } catch (error) {
      console.error("Registration failed:", error)
      alert("Registration failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLookup = (e) => {
    e.preventDefault()
    setMyFighterTag(lookupTag)
    localStorage.setItem('fc_fighter_tag', lookupTag)
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white p-4 md:p-10 pb-32">
      
      {/* HEADER & TABS */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-5xl font-black uppercase tracking-tighter mb-8">
          Global <span className="text-pink-500">Tournaments</span>
        </h1>

        <div className="flex gap-8 border-b border-white/[0.05] pb-px">
          <button 
            onClick={() => setActiveTab('explore')}
            className={`pb-4 text-sm font-bold uppercase tracking-[2px] transition-colors relative ${activeTab === 'explore' ? 'text-pink-500' : 'text-gray-500 hover:text-white'}`}
          >
            Explore Brackets
            {activeTab === 'explore' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(255,0,128,0.5)]"></div>}
          </button>
          
          <button 
            onClick={() => setActiveTab('participated')}
            className={`pb-4 text-sm font-bold uppercase tracking-[2px] transition-colors relative ${activeTab === 'participated' ? 'text-pink-500' : 'text-gray-500 hover:text-white'}`}
          >
            My Tournaments
            {activeTab === 'participated' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 shadow-[0_0_10px_rgba(255,0,128,0.5)]"></div>}
          </button>
        </div>
      </div>

      {/* TAB 1: EXPLORE TOURNAMENTS */}
      {activeTab === 'explore' && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {tournaments.length === 0 && <p className="text-gray-500 italic">No active tournaments at this time.</p>}

          {tournaments.map((t) => (
            <div key={t.id} className="rounded-[32px] overflow-hidden border border-white/[0.06] bg-black/40 hover:border-pink-500/30 transition-all group">
              <div className="w-full h-56 bg-white/[0.02] relative border-b border-white/[0.05]">
                {t.bannerUrl ? (
                  <img src={t.bannerUrl} alt="banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 bg-gradient-to-br from-black to-gray-900">
                    <Trophy size={48} className="opacity-20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <h3 className="absolute bottom-4 left-6 text-3xl font-black uppercase tracking-[1px] text-white">{t.title}</h3>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-400">
                  <span className="flex items-center gap-2"><Calendar size={16} className="text-pink-500"/> {t.date}</span>
                  <span className="flex items-center gap-2"><Clock size={16} className="text-pink-500"/> {t.time}</span>
                  <span className="flex items-center gap-2"><Trophy size={16} className="text-pink-500"/> ${t.prizePool} Prize</span>
                  {t.participantLimit && (
                    <span className="flex items-center gap-2"><Users size={16} className="text-blue-400"/> {t.registeredCount || 0} / {t.participantLimit} Limit</span>
                  )}
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {t.description || "Prepare for combat. Registration is now open."}
                </p>

                <div className="flex items-center justify-between border-t border-white/[0.05] pt-6">
                  <div>
                    {t.isPaid ? (
                      <div className="text-green-400 font-bold uppercase flex items-center gap-1">
                        <DollarSign size={16}/> Entry: ${t.entryFee}
                      </div>
                    ) : (
                      <div className="text-blue-400 font-bold uppercase">Free Entry</div>
                    )}
                  </div>
                  
                  <button onClick={() => setSelectedTournament(t)} className="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 text-white font-bold uppercase tracking-[2px] transition-colors">
                    Register Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: MY TOURNAMENTS (PARTICIPATED) */}
      {activeTab === 'participated' && (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* LOOKUP FORM */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-[32px] p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-black uppercase tracking-[1px] mb-2">Fighter Access Terminal</h2>
              <p className="text-sm text-gray-400">Enter your Fighter Tag to view your bracket status and approvals.</p>
            </div>
            
            <form onSubmit={handleLookup} className="flex w-full md:w-auto gap-2">
              <input 
                type="text" 
                placeholder="Enter Fighter Tag..."
                value={lookupTag}
                onChange={(e) => setLookupTag(e.target.value)}
                className="w-full md:w-64 h-[50px] rounded-2xl bg-black border border-white/[0.1] px-4 outline-none focus:border-pink-500"
              />
              <button type="submit" className="h-[50px] px-6 rounded-2xl bg-white text-black font-bold uppercase tracking-[1px] hover:bg-pink-500 hover:text-white transition-colors">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* MY REGISTRATIONS FEED */}
          {myFighterTag ? (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-[2px] text-pink-500 mb-4">Records for: {myFighterTag}</h3>
              
              {myRegistrations.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/[0.1] rounded-[32px]">
                  <p className="text-gray-500">No registrations found for this tag.</p>
                </div>
              ) : (
                myRegistrations.map((reg) => (
                  <div key={reg.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-black/40 border border-white/[0.05] rounded-3xl gap-4">
                    <div>
                      <h4 className="text-xl font-black uppercase tracking-[1px]">{reg.tournamentTitle}</h4>
                      <p className="text-xs text-gray-500 uppercase tracking-[2px] mt-1">Transaction ID: {reg.transactionId}</p>
                    </div>

                    <div>
                      {reg.status === 'pending_payment' ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-sm font-bold uppercase tracking-[1px]">
                          <Clock4 size={16} /> Verifying Payment
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-bold uppercase tracking-[1px]">
                          <ShieldCheck size={16} /> Bracket Locked
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
             <div className="text-center py-20 border border-dashed border-white/[0.1] rounded-[32px]">
               <p className="text-gray-500">Enter your tag above to sync your records.</p>
             </div>
          )}
        </div>
      )}

      {/* REGISTRATION MODAL (Same as before) */}
      {selectedTournament && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0a0a0f] border border-white/[0.1] rounded-[32px] p-6 relative overflow-hidden">
            
            <button onClick={() => setSelectedTournament(null)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>

            {success ? (
              <div className="py-10 text-center flex flex-col items-center">
                <CheckCircle2 size={64} className="text-green-500 mb-4" />
                <h3 className="text-2xl font-black uppercase mb-2">Registration Submitted</h3>
                <p className="text-gray-400">
                  {selectedTournament.isPaid ? "Your payment is being verified by an admin." : "You are locked in. Prepare for battle."}
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black uppercase tracking-[1px] mb-2">{selectedTournament.title}</h2>
                <p className="text-sm text-gray-400 mb-6">Complete your registration to secure your spot.</p>

                <form onSubmit={handleRegister} className="space-y-5">
                  <div>
                    <label className="text-xs uppercase tracking-[2px] text-gray-500 block mb-2">Fighter Tag / Username</label>
                    <input 
                      type="text" 
                      required
                      value={fighterName}
                      onChange={e => setFighterName(e.target.value)}
                      className="w-full h-[50px] rounded-2xl bg-white/[0.02] border border-white/[0.1] px-4 outline-none text-white focus:border-pink-500" 
                      placeholder="e.g. ShadowStriker"
                    />
                  </div>

                  {selectedTournament.isPaid && (
                    <div className="p-5 rounded-2xl border border-pink-500/30 bg-pink-500/5">
                      <div className="flex items-center gap-2 text-pink-500 font-bold uppercase mb-4 tracking-[1px]">
                        <QrCode size={18} /> Entry Fee: ${selectedTournament.entryFee}
                      </div>
                      
                      <div className="flex justify-center mb-6">
                        <div className="w-48 h-48 bg-white p-2 rounded-xl">
                          <img src='/qr.jpg.jpeg' alt="Payment QR" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      
                      <div className="text-center text-xs text-gray-400 mb-4">
                        Scan to pay. Once paid, paste the exact Transaction ID below.
                      </div>

                      <div>
                        <input 
                          type="text" 
                          required
                          value={transactionId}
                          onChange={e => setTransactionId(e.target.value)}
                          className="w-full h-[50px] rounded-2xl bg-black border border-white/[0.2] px-4 outline-none text-white focus:border-pink-500" 
                          placeholder="Transaction ID (UTR)"
                        />
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-[60px] rounded-2xl bg-white text-black font-black uppercase tracking-[2px] hover:bg-pink-500 hover:text-white transition-colors disabled:opacity-50 mt-4"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Registration'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}