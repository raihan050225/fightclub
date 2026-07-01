'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Trophy, Plus, Calendar, Clock, DollarSign, Image as ImageIcon, UploadCloud, Loader2, Trash2, Users } from 'lucide-react'

import AdminHeader from '@/components/admin/AdminHeader'
import Input from '@/components/admin/Input'

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    prizePool: '',
    description: '',
    isPaid: false,
    entryFee: '',
    participantLimit: '' // NEW: Track maximum allowed fighters
  })

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'tournaments'), (snapshot) => {
      setTournaments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsub()
  }, [])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleCreateTournament = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.date) return alert("Title and Date are required!")
    
    setIsUploading(true)
    let finalImageUrl = ''

    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);
        // REMINDER: Keep your quotes around your preset and cloud name!
        uploadData.append('upload_preset', 'fightclub'); 
        const cloudName = 'dmlbi0tui'; 

        const res = await fetch(`https://api.cloudinary.com/v1_1/dmlbi0tui/image/upload`, {
          method: 'POST',
          body: uploadData
        });

        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        finalImageUrl = data.secure_url;
      }

      await addDoc(collection(db, 'tournaments'), {
        ...formData,
        participantLimit: formData.participantLimit ? parseInt(formData.participantLimit) : null,
        registeredCount: 0, // Starts at 0 when created
        bannerUrl: finalImageUrl, 
        status: 'active',
        timestamp: serverTimestamp()
      })
      
      setFormData({
        title: '', date: '', time: '', prizePool: '', description: '', isPaid: false, entryFee: '', participantLimit: ''
      })
      setImageFile(null)
      setImagePreview(null)
      
    } catch (err) {
      console.error("Failed to deploy tournament:", err)
      alert("Error creating tournament. Check console.")
    } finally {
      setIsUploading(false)
    }
  }

  // NEW: Delete Function
  const handleDeleteTournament = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this tournament? This cannot be undone.");
    if (!isConfirmed) return;

    try {
      await deleteDoc(doc(db, 'tournaments', id));
    } catch (error) {
      console.error("Error deleting tournament:", error);
      alert("Failed to delete tournament.");
    }
  }

  return (
    <div className="p-4 md:p-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* LEFT SIDE: TOURNAMENT FEED */}
      <div className="xl:col-span-2">
        <AdminHeader title="Tournaments" subtitle="Deploy event structures, manage limits, and control operations" />

        <div className="space-y-6 mt-8">
          {tournaments.map((t) => (
            <div key={t.id} className="rounded-[32px] overflow-hidden border border-white/[0.06] bg-black/40 group">
              
              <div className="w-full h-48 bg-white/[0.02] relative border-b border-white/[0.05]">
                {t.bannerUrl ? (
                  <img src={t.bannerUrl} alt="banner" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-xs uppercase tracking-[2px]">No Banner Provided</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-bold text-pink-500 uppercase tracking-[1px]">
                  {t.status}
                </div>

                {/* NEW: Delete Button */}
                <button 
                  onClick={() => handleDeleteTournament(t.id)}
                  className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur-md rounded-full border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Tournament"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-[1px] text-white">{t.title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-3">
                      <span className="flex items-center gap-1"><Calendar size={14} className="text-pink-500"/> {t.date}</span>
                      <span className="flex items-center gap-1"><Clock size={14} className="text-pink-500"/> {t.time}</span>
                      
                      {/* NEW: Participant Tracker */}
                      {t.participantLimit && (
                        <span className="flex items-center gap-1 text-white bg-white/5 px-2 py-1 rounded-md">
                          <Users size={14} className="text-blue-400"/> 
                          {t.registeredCount || 0} / {t.participantLimit} Fighters
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[2px] text-gray-500">Prize Pool</p>
                    <span className="text-2xl font-black text-pink-500 tracking-tight">${t.prizePool || '0'}</span>
                    {t.isPaid ? (
                      <div className="mt-1 text-xs text-green-400 font-bold uppercase flex items-center justify-end gap-1">
                        <DollarSign size={12}/> Entry: ${t.entryFee}
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-blue-400 font-bold uppercase">Free Entry</div>
                    )}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed border-t border-white/[0.05] pt-4">
                  {t.description || "No description provided."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: CREATE TOURNAMENT PANEL */}
      <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7 h-fit sticky top-6">
        <h3 className="text-xl font-black flex items-center gap-2 mb-6 uppercase tracking-[1px]">
          <Trophy className="text-pink-500" size={20} /> Deploy Bracket
        </h3>
        
        <form onSubmit={handleCreateTournament} className="space-y-4">
          
          <div>
            <p className="mb-2 text-sm text-gray-400">Tournament Banner</p>
            <label className="relative flex flex-col items-center justify-center w-full h-32 rounded-2xl border-2 border-dashed border-white/[0.1] bg-black/20 hover:border-pink-500/50 hover:bg-pink-500/5 cursor-pointer transition-all overflow-hidden">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  <div className="relative z-10 bg-black/60 px-4 py-2 rounded-xl backdrop-blur-sm text-white text-sm font-bold flex items-center gap-2">
                    <UploadCloud size={16} /> Change Image
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                  <UploadCloud size={28} className="mb-2 text-pink-500" />
                  <p className="text-sm font-bold">Click to upload banner</p>
                  <p className="text-xs mt-1 uppercase tracking-[1px]">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
            </label>
          </div>

          <Input label="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-sm text-gray-400">Date</p>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full h-[50px] rounded-2xl bg-black/20 border border-white/[0.06] px-4 outline-none text-white focus:border-pink-500/50" />
            </div>
            <div>
              <p className="mb-2 text-sm text-gray-400">Time</p>
              <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full h-[50px] rounded-2xl bg-black/20 border border-white/[0.06] px-4 outline-none text-white focus:border-pink-500/50" />
            </div>
          </div>

          {/* NEW: Participant Limit & Prize Pool Row */}
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Fighter Limit (Max)" 
              type="number"
              value={formData.participantLimit} 
              onChange={e => setFormData({...formData, participantLimit: e.target.value})} 
            />
            <Input 
              label="Prize Pool ($)" 
              type="number"
              value={formData.prizePool} 
              onChange={e => setFormData({...formData, prizePool: e.target.value})} 
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-400">Description</p>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full rounded-2xl bg-black/20 border border-white/[0.06] p-4 outline-none text-white focus:border-pink-500/50 resize-none" />
          </div>

          <div className="p-4 rounded-2xl border border-white/[0.05] bg-black/30">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-bold text-white">Require Entry Fee?</span>
              <input type="checkbox" className="sr-only peer" checked={formData.isPaid} onChange={e => setFormData({...formData, isPaid: e.target.checked})} />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500 relative"></div>
            </label>
            {formData.isPaid && (
              <div className="mt-4 pt-4 border-t border-white/[0.05]">
                <Input label="Entry Fee Amount ($)" type="number" value={formData.entryFee} onChange={e => setFormData({...formData, entryFee: e.target.value})} />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full h-[60px] mt-4 rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold uppercase tracking-[2px] flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
          >
            {isUploading ? <><Loader2 className="animate-spin" size={18} /> Uploading...</> : <><Plus size={18} /> Initialize</>}
          </button>
        </form>
      </div>
    </div>
  )
}