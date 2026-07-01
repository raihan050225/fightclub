'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, orderBy, doc, updateDoc, increment, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { DollarSign, ShieldCheck, Clock4, CheckCircle2, AlertCircle, X, Ban } from 'lucide-react'

import AdminHeader from '@/components/admin/AdminHeader'
import RevenueCard from '@/components/admin/RevenueCard'

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState('ledger') // 'ledger' or 'approvals'
  const [transactions, setTransactions] = useState([])
  const [pendingRegistrations, setPendingRegistrations] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Fetch Transactions (Revenue)
    const qPayments = query(collection(db, 'payments'), orderBy('timestamp', 'desc'))
    const unsubPayments = onSnapshot(qPayments, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setTransactions(docs)
      const total = docs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0)
      setTotalRevenue(total)
    })

    // 2. Fetch Pending Registrations (Approvals)
    const unsubRegs = onSnapshot(collection(db, 'tournamentRegistrations'), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPendingRegistrations(docs.filter(r => r.status === 'pending_payment'))
      setLoading(false)
    })

    return () => { unsubPayments(); unsubRegs(); }
  }, [])

  // ACTION: Verify Payment & Approve Access
  const handleVerifyPayment = async (reg) => {
    if (!window.confirm(`Confirm payment for ${reg.fighterName}? This will unlock their spot.`)) return

    try {
      // A. Update registration status
      await updateDoc(doc(db, 'tournamentRegistrations', reg.id), { status: 'confirmed' })

      // B. Increment participant count
      await updateDoc(doc(db, 'tournaments', reg.tournamentId), { registeredCount: increment(1) })

      // C. AUTOMATICALLY ADD TO REVENUE LEDGER
      await addDoc(collection(db, 'payments'), {
        amount: reg.entryFee || 0,
        username: reg.fighterName,
        description: `Entry: ${reg.tournamentTitle}`,
        timestamp: serverTimestamp()
      })

      alert("Fighter approved and revenue logged!")
    } catch (err) {
      console.error("Verification failed:", err)
      alert("Error processing approval.")
    }
  }

  // ACTION: Reject Registration
  const handleReject = async (reg) => {
    const reason = window.prompt("Reason for rejection? (This will be shown to the fighter)");
    if (!reason) return; // User cancelled

    try {
      await updateDoc(doc(db, 'tournamentRegistrations', reg.id), {
        status: 'rejected',
        rejectionReason: reason
      });
      alert("Registration rejected and fighter notified.");
    } catch (err) {
      console.error("Rejection error:", err)
      alert("Error processing rejection.");
    }
  }

  return (
    <div className="p-4 md:p-10">
      <AdminHeader title="Financial Ledger & Approvals" subtitle="Monitor revenue flow and verify pending registrations" />

      {/* TABS */}
      <div className="flex gap-8 border-b border-white/[0.05] pb-px mb-8 mt-8">
        <button onClick={() => setActiveTab('ledger')} className={`pb-4 text-sm font-bold uppercase transition ${activeTab === 'ledger' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500 hover:text-white'}`}>Revenue Ledger</button>
        <button onClick={() => setActiveTab('approvals')} className={`pb-4 text-sm font-bold uppercase flex gap-2 transition ${activeTab === 'approvals' ? 'text-pink-500 border-b-2 border-pink-500' : 'text-gray-500 hover:text-white'}`}>
          Pending Approvals {pendingRegistrations.length > 0 && <span className="bg-pink-500 text-white px-2 py-0.5 rounded-full text-[10px]">{pendingRegistrations.length}</span>}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <>
          {activeTab === 'ledger' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <RevenueCard total={totalRevenue.toFixed(2)} percentage="+12.4%" />
              
              <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7">
                <h2 className="text-2xl font-black uppercase tracking-[2px] mb-6">Transaction History</h2>
                <div className="space-y-4">
                  {transactions.length === 0 ? <p className="text-gray-500">No transactions recorded.</p> : transactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center rounded-2xl border border-white/[0.04] bg-black/40 p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400"><DollarSign size={20} /></div>
                        <div>
                          <h4 className="font-bold text-white">{tx.username}</h4>
                          <p className="text-xs text-gray-500 mt-1">{tx.description}</p>
                        </div>
                      </div>
                      <span className="text-xl font-black text-green-400">+${Number(tx.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7 animate-in fade-in duration-500">
              <h2 className="text-2xl font-black uppercase tracking-[2px] mb-6">Pending Registrations</h2>
              {pendingRegistrations.length === 0 ? <p className="text-gray-500">No pending approvals.</p> : (
                <div className="space-y-4">
                  {pendingRegistrations.map((reg) => (
                    <div key={reg.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-white/[0.04] bg-black/40 gap-4">
                      <div>
                        <h4 className="font-bold text-white">{reg.fighterName}</h4>
                        <p className="text-xs text-gray-500 mt-1">{reg.tournamentTitle} | TX: {reg.transactionId}</p>
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleReject(reg)}
                          className="px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold text-xs uppercase hover:bg-red-500 hover:text-white transition-all flex items-center gap-2"
                        >
                          <Ban size={14} /> Reject
                        </button>
                        <button 
                          onClick={() => handleVerifyPayment(reg)}
                          className="px-6 py-3 bg-green-500/20 text-green-400 border border-green-500/30 rounded-xl font-bold text-xs uppercase hover:bg-green-500 hover:text-white transition-all flex items-center gap-2"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}