'use client'

import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

const CreatePost = () => {
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // State to hold the full database profile of the active fighter
  const [activeFighter, setActiveFighter] = useState(null);
  
  // State to lock the form until the database finishes fetching the profile
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  // LISTEN FOR AUTH & FETCH FIGHTER PROFILE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const fighterRef = doc(db, 'fighters', user.uid);
          const fighterSnap = await getDoc(fighterRef);
          
          if (fighterSnap.exists()) {
            // Profile found, save it to state
            setActiveFighter({ uid: user.uid, ...fighterSnap.data() });
          } else {
            // No profile found yet
            setActiveFighter({ uid: user.uid, username: 'Unregistered Fighter' });
          }
        } catch (error) {
          console.error("Error fetching fighter profile:", error);
        } finally {
          // Unlock the form whether the fetch succeeded or failed
          setIsProfileLoading(false); 
        }
      } else {
        setActiveFighter(null);
        setIsProfileLoading(false);
      }
    });

    // Sever connection on dismount
    return () => unsubscribe(); 
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!caption.trim() && !file) return;

    // Bulletproof ID and Username logic
    const currentUser = auth.currentUser;
    const userId = activeFighter?.uid || currentUser?.uid || 'anonymous_id';
    const username = activeFighter?.username || activeFighter?.name || currentUser?.displayName || 'Unregistered Fighter';

    setIsUploading(true);
    let mediaUrl = '';

    try {
      // 1. Upload media to Cloudinary if it exists
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'fightclub'); 
        
        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/dmlbi0tui/auto/upload`, 
          {
            method: 'POST',
            body: formData
          }
        );
        
        const cloudData = await cloudRes.json();
        mediaUrl = cloudData.secure_url;
      }

      // 2. Save the post to Firestore
      await addDoc(collection(db, 'posts'), {
        userId: userId, 
        username: username, // Now guaranteed to be 'woo jin'
        caption: caption.trim(),
        mediaUrl: mediaUrl,
        timestamp: serverTimestamp(),
        likedBy: [] 
      });

      // 3. Reset form
      setCaption('');
      setFile(null);
      document.getElementById('file-upload').value = ''; 

    } catch (error) {
      console.error("Transmission Failed: ", error);
      alert("Failed to broadcast footage. Check your connection.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handlePost} className="mt-10 border border-pink-500/20 bg-black/40 backdrop-blur-xl p-6 group transition-colors hover:border-pink-500/40">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>
        <p className="uppercase tracking-[4px] text-gray-400 text-xs font-bold">Transmit Footage</p>
      </div>

      <textarea 
        className="w-full bg-black/50 border border-white/5 text-white p-4 focus:outline-none focus:border-pink-500/50 transition-colors uppercase tracking-[1px] text-sm resize-none h-24"
        placeholder="DROP YOUR BATTLE FOOTAGE..."
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        disabled={isUploading || isProfileLoading}
      />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4">
        <input 
          id="file-upload"
          type="file" 
          accept="video/*,image/*" 
          onChange={(e) => setFile(e.target.files[0])}
          disabled={isUploading || isProfileLoading}
          className="text-xs text-gray-500 uppercase tracking-[2px] file:mr-4 file:py-2 file:px-4 file:bg-pink-500/10 file:border-0 file:text-pink-500 file:uppercase file:tracking-[2px] hover:file:bg-pink-500/20 file:transition-colors file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button 
          type="submit" 
          disabled={isUploading || isProfileLoading || (!caption.trim() && !file)}
          className="w-full sm:w-auto bg-pink-500 px-8 py-3 uppercase tracking-[4px] font-bold text-xs text-black shadow-[0_0_20px_rgba(255,0,128,0.4)] hover:shadow-[0_0_40px_rgba(255,0,128,0.8)] hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:shadow-none"
        >
          {isProfileLoading ? 'SYNCING...' : isUploading ? 'UPLOADING...' : 'BROADCAST'}
        </button>
      </div>
    </form>
  );
};

export default CreatePost;