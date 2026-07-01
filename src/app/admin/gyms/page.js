'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Building2, Plus, MapPin, DollarSign, UploadCloud, Loader2, Trash2, Dumbbell, Percent, Layers } from 'lucide-react'

import AdminHeader from '@/components/admin/AdminHeader'
import Input from '@/components/admin/Input'

export default function AdminGymsPage() {
  const [gyms, setGyms] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  
  // Advanced Form State
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    about: '',
    basePrice: '',
    discount: '', // Exclusive FightClub discount percentage
  })

  // Next-Level Premium Features/Amenities
  const [amenities, setAmenities] = useState({
    hasRing: false,
    hasRecovery: false, // Ice baths, sauna
    hasCoaches: false,
    isAlwaysOpen: false
  })

  // Multiple Images Management
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'gyms'), (snapshot) => {
      setGyms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsub()
  }, [])

  // Handle up to 8 images locally
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    if (imageFiles.length + files.length > 8) {
      return alert("Maximum limit of 8 images reached.")
    }

    const updatedFiles = [...imageFiles, ...files]
    setImageFiles(updatedFiles)

    const previews = updatedFiles.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
  }

  const removeSelectedImage = (index) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index)
    setImageFiles(updatedFiles)
    setImagePreviews(updatedFiles.map(file => URL.createObjectURL(file)))
  }

  const handleRegisterGym = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.location || !formData.basePrice) {
      return alert("Gym Name, Location, and Base Pricing are required!")
    }

    setIsUploading(true)
    let uploadedUrls = []

    try {
      // 1. ITERATE AND UPLOAD MULTIPLE IMAGES TO CLOUDINARY
      if (imageFiles.length > 0) {
        const cloudName = 'dmlbi0tui'; 
        const uploadPreset = 'fightclub';

        const uploadPromises = imageFiles.map(async (file) => {
          const uploadData = new FormData()
          uploadData.append('file', file)
          uploadData.append('upload_preset', 'fightclub')

          const res = await fetch(`https://api.cloudinary.com/v1_1/dmlbi0tui/image/upload`, {
            method: 'POST',
            body: uploadData
          })
          const data = await res.json()
          if (data.error) throw new Error(data.error.message)
          return data.secure_url
        })

        uploadedUrls = await Promise.all(uploadPromises)
      }

      // Calculate finalized deal math
      const basePriceNum = parseFloat(formData.basePrice)
      const discountNum = formData.discount ? parseFloat(formData.discount) : 0
      const fighterPrice = basePriceNum - (basePriceNum * (discountNum / 100))

      // 2. STAGE TO FIRESTORE
      await addDoc(collection(db, 'gyms'), {
        ...formData,
        basePrice: basePriceNum,
        discount: discountNum,
        fighterPrice: parseFloat(fighterPrice.toFixed(2)),
        features: amenities,
        images: uploadedUrls, // Array of live asset links stored cleanly
        timestamp: serverTimestamp()
      })

      // Reset Form State entirely
      setFormData({ name: '', location: '', about: '', basePrice: '', discount: '' })
      setAmenities({ hasRing: false, hasRecovery: false, hasCoaches: false, isAlwaysOpen: false })
      setImageFiles([])
      setImagePreviews([])
      alert("HQ Training Grounds deployed successfully!")

    } catch (err) {
      console.error("Failed to map out gym layout:", err)
      alert("Error building gym entry. Review parameters in console.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteGym = async (id) => {
    const confirmErase = window.confirm("Decommission this gym partnership? Fighters will lose booking capabilities.")
    if (!confirmErase) return
    try {
      await deleteDoc(doc(db, 'gyms', id))
    } catch (err) {
      console.error("Erase operation failed:", err)
    }
  }

  return (
    <div className="p-4 md:p-10 grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* LEFT BLOCK: ACTIVE GYMS FEED */}
      <div className="xl:col-span-2">
        <AdminHeader title="Gym Management Hub" subtitle="Authorize premium training facilities and exclusive booking price vectors" />

        <div className="space-y-8 mt-8">
          {gyms.length === 0 && <p className="text-gray-500 italic">No training grounds registered in the mainframe.</p>}

          {gyms.map((gym) => (
            <div key={gym.id} className="rounded-[32px] overflow-hidden border border-white/[0.06] bg-black/40 group relative">
              
              {/* NEXT-LEVEL SIDE SCROLLABLE CAROUSEL VIEW CONTAINER */}
              <div className="w-full h-56 bg-white/[0.01] flex items-center gap-2 overflow-x-auto p-4 border-b border-white/[0.05] scrollbar-thin scrollbar-thumb-pink-500/20 scrollbar-track-transparent">
                {gym.images && gym.images.length > 0 ? (
                  gym.images.map((imgUrl, i) => (
                    <img key={i} src={imgUrl} alt="facility preview" className="h-full w-72 object-cover rounded-2xl border border-white/10 flex-shrink-0" />
                  ))
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                    <Building2 size={32} className="mb-2" />
                    <span className="text-xs uppercase tracking-[2px]">No Facility Asset Footage Staged</span>
                  </div>
                )}
              </div>

              {/* Action Vector Top Right */}
              <button 
                onClick={() => handleDeleteGym(gym.id)}
                className="absolute top-4 right-4 p-2 bg-black/80 backdrop-blur-md rounded-full border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100 z-30"
              >
                <Trash2 size={16} />
              </button>

              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-[1px] text-white">{gym.name}</h3>
                    <p className="flex items-center gap-1.5 text-sm text-gray-400 mt-2">
                      <MapPin size={14} className="text-pink-500" /> {gym.location}
                    </p>
                  </div>

                  {/* PRICING SYSTEM DATA VIEW */}
                  <div className="text-left md:text-right bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl min-w-[160px]">
                    <div className="text-xs text-gray-500 uppercase tracking-[1px] mb-1">Exclusive Tier</div>
                    <div className="flex items-baseline gap-2 justify-start md:justify-end">
                      <span className="text-2xl font-black text-pink-500">${gym.fighterPrice}</span>
                      <span className="text-xs text-gray-400 line-through">${gym.basePrice}</span>
                    </div>
                    {gym.discount > 0 && (
                      <div className="text-[10px] text-green-400 font-bold uppercase tracking-[1px] mt-1 flex items-center gap-0.5 justify-start md:justify-end">
                        <Percent size={10} /> Saved {gym.discount}%
                      </div>
                    )}
                  </div>
                </div>

                {/* FEATURE BADGES ARCHITECTURE */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gym.features?.hasRing && <span className="text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-[1px]">Fight Octagon</span>}
                  {gym.features?.hasRecovery && <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-[1px]">Cryo & Recovery</span>}
                  {gym.features?.hasCoaches && <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-[1px]">Elite Instructors</span>}
                  {gym.features?.isAlwaysOpen && <span className="text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-md font-bold uppercase tracking-[1px]">24/7 Access Hub</span>}
                </div>

                <p className="text-gray-400 text-sm leading-relaxed border-t border-white/[0.05] pt-4 italic">
                  "{gym.about || 'No descriptive tactical analysis supplied for this facility.'}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT BLOCK: REGISTRATION FORM MATRIX */}
      <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7 h-fit sticky top-6">
        <h3 className="text-xl font-black flex items-center gap-2 mb-6 uppercase tracking-[1px]">
          <Dumbbell className="text-pink-500" size={20} /> Register Facility
        </h3>

        <form onSubmit={handleRegisterGym} className="space-y-4">
          
          {/* MULTI-FILE SELECTOR MATRIX UI */}
          <div>
            <p className="mb-2 text-sm text-gray-400">Staging Vault Assets ({imageFiles.length}/8)</p>
            <label className="flex flex-col items-center justify-center w-full h-28 rounded-2xl border-2 border-dashed border-white/[0.1] bg-black/20 hover:border-pink-500/50 hover:bg-pink-500/5 cursor-pointer transition">
              <div className="flex flex-col items-center justify-center p-4 text-center text-gray-400">
                <UploadCloud size={24} className="mb-1 text-pink-500" />
                <p className="text-xs font-bold">Select Multiple Media Files</p>
              </div>
              <input type="file" multiple className="hidden" accept="image/*" onChange={handleImageSelect} />
            </label>

            {/* Micro Side Scrolling Previews Row inside Form */}
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mt-3 overflow-x-auto py-1">
                {imagePreviews.map((preview, idx) => (
                  <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/20 flex-shrink-0">
                    <img src={preview} alt="Queue item" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeSelectedImage(idx)} className="absolute inset-0 bg-black/60 flex items-center justify-center text-red-400 opacity-0 hover:opacity-100 text-xs font-bold transition">Remove</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Input label="Gym Facility Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input label="Geographic Location / Address" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Standard Price ($/mo)" type="number" value={formData.basePrice} onChange={e => setFormData({...formData, basePrice: e.target.value})} />
            <Input label="Exclusive Discount (%)" type="number" value={formData.discount} placeholder="e.g. 25" onChange={e => setFormData({...formData, discount: e.target.value})} />
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-400">Facility Briefing / About</p>
            <textarea rows={3} value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className="w-full rounded-2xl bg-black/20 border border-white/[0.06] p-4 outline-none text-white focus:border-pink-500/50 text-sm resize-none" />
          </div>

          {/* NEXT LEVEL PREMIUM UTILITY TOGGLES CONTAINER */}
          <div className="p-4 rounded-2xl border border-white/[0.05] bg-black/30 space-y-3">
            <p className="text-xs font-bold uppercase tracking-[1px] text-pink-500 mb-2 flex items-center gap-1">
              <Layers size={12} /> Tech & Facility Amenities
            </p>
            
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-gray-300">Has Fight Octagon / Ring</span>
              <input type="checkbox" checked={amenities.hasRing} onChange={e => setAmenities({...amenities, hasRing: e.target.checked})} className="accent-pink-500" />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-gray-300">Cryo-Baths & Recovery Area</span>
              <input type="checkbox" checked={amenities.hasRecovery} onChange={e => setAmenities({...amenities, hasRecovery: e.target.checked})} className="accent-pink-500" />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-gray-300">Pro Coaches & Trainers Available</span>
              <input type="checkbox" checked={amenities.hasCoaches} onChange={e => setAmenities({...amenities, hasCoaches: e.target.checked})} className="accent-pink-500" />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-gray-300">24/7 Open Bio-Metric Entry Gate</span>
              <input type="checkbox" checked={amenities.isAlwaysOpen} onChange={e => setAmenities({...amenities, isAlwaysOpen: e.target.checked})} className="accent-pink-500" />
            </label>
          </div>

          <button 
            type="submit" 
            disabled={isUploading}
            className="w-full h-[60px] rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white font-bold uppercase tracking-[2px] flex items-center justify-center gap-2 hover:scale-[1.02] transition disabled:opacity-50"
          >
            {isUploading ? <><Loader2 className="animate-spin" size={18} /> Syncing Assets...</> : <><Plus size={18} /> Initialize Partnership</>}
          </button>
        </form>
      </div>
    </div>
  )
}