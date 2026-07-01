'use client'

import React from 'react';
import { useRouter } from 'next/navigation'; // Using next/navigation for App Router
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Adjust this path if your firebase.js is somewhere else

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Tell Firebase to destroy the user's session
      await signOut(auth);
      
      // 2. Once destroyed, boot them back to the login screen
      router.push('/login'); 
      
    } catch (error) {
      console.error("System Error during logout:", error);
      alert("Disconnection failed. Try again.");
    }
  };

  return (
    <button 
      onClick={handleLogout}
      className="w-full flex items-center gap-4 px-6 py-3 mt-auto uppercase tracking-[3px] text-xs font-bold text-gray-500 hover:text-red-500 hover:bg-red-500/10 border-l-2 border-transparent hover:border-red-500 transition-all"
    >
      <span className="text-lg">⏏</span> DISCONNECT
    </button>
  );
};

export default LogoutButton;