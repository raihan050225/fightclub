'use client'

import React, { useState, useEffect } from 'react';
import {
  auth,
  db
} from '@/lib/firebase';

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';

// Assuming these are in a components folder relative to this page, adjust paths as needed
import CreatePost from '@/components/feed/CreatePost';
import FeedCard from '@/components/feed/FeedCard';
import TrendingFighter from '@/components/feed/TrendingFighters';
import CommentModal from '@/components/feed/CommentModel'; // Note: Ensure this matches the exact filename in your editor
export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

  useEffect(() => {
    // Open the live comms link to Firestore
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    
    // Sever connection on dismount
    return () => unsubscribe();
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white selection:bg-pink-500 flex justify-center gap-10 p-4 md:p-8 overflow-hidden pt-24">
      
      {/* BACKGROUND GRID (Inherited from Hero) */}
      <div className="fixed inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.08)_1px,transparent_1px)] bg-[size:70px_70px] pointer-events-none z-0"></div>

      {/* MAIN FEED COLUMN */}
      <div className="relative z-10 w-full max-w-2xl">
        
        {/* PAGE HEADER */}
        <div className="mb-10 border-b border-pink-500/20 pb-6">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-[8px]">
                Live <span className="text-pink-500">Feed</span>
            </h1>
            <p className="uppercase tracking-[4px] text-gray-500 text-xs mt-3">Global Combat Network</p>
        </div>

        <CreatePost />
        
        {/* POST STREAM */}
        <div className="mt-12 space-y-12 pb-20">
          {posts.map(post => (
            <FeedCard 
              key={post.id} 
              post={post} 
              onOpenComments={() => setActiveCommentPostId(post.id)} 
            />
          ))}
          
          {posts.length === 0 && (
            <div className="text-center py-20 border border-white/5 bg-black/40 backdrop-blur-xl">
                <p className="uppercase tracking-[4px] text-gray-500 text-sm animate-pulse">Scanning for broadcasts...</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR - THE ROSTER */}
      <div className="relative z-10 hidden lg:block w-[350px]">
        <TrendingFighter />
      </div>

      {/* OVERLAYS */}
      {activeCommentPostId && (
        <CommentModal 
          postId={activeCommentPostId} 
          onClose={() => setActiveCommentPostId(null)} 
        />
      )}
    </main>
  );
}