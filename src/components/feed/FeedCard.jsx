'use client'

import React from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';

const FeedCard = ({ post, onOpenComments }) => {
  const currentUserId = auth.currentUser?.uid;
  
  // Check if the current user is the author of this specific post
  const isOwner = currentUserId === post.userId;
  
  const likedByArray = post.likedBy || [];
  const hasRespected = currentUserId ? likedByArray.includes(currentUserId) : false;
  const respectCount = likedByArray.length;

  const handleRespect = async () => {
    if (!currentUserId) {
      alert("You must be logged in to show respect.");
      return;
    }

    try {
      const postRef = doc(db, 'posts', post.id);
      
      if (hasRespected) {
        await updateDoc(postRef, {
          likedBy: arrayRemove(currentUserId)
        });
      } else {
        await updateDoc(postRef, {
          likedBy: arrayUnion(currentUserId)
        });
      }
    } catch (error) {
      console.error("Failed to update respect:", error);
    }
  };

  // THE NEW DELETE FUNCTION
  const handleDelete = async () => {
    if (window.confirm("ERASE THIS BROADCAST? This cannot be undone.")) {
      try {
        await deleteDoc(doc(db, 'posts', post.id));
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete the post. Please try again.");
      }
    }
  };

  return (
    <div className="border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden hover:border-white/20 transition-colors">
      
      <div className="p-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-800 border border-pink-500/30 flex-shrink-0 rounded-sm"></div>
          <div className="ml-4">
            <span className="block font-black uppercase tracking-[2px] text-lg leading-none text-white">{post.username}</span>
            <span className="uppercase tracking-[4px] text-gray-500 text-[10px] mt-1 block">Live Record</span>
          </div>
        </div>
        
        {/* DELETE BUTTON (Only shows if current user owns the post) */}
        {isOwner && (
          <button 
            onClick={handleDelete}
            className="uppercase tracking-[2px] text-[10px] text-red-500/50 hover:text-red-500 hover:bg-red-500/10 px-3 py-1 border border-transparent hover:border-red-500/30 transition-all rounded-sm"
          >
            [ PURGE ]
          </button>
        )}
      </div>
      
      {post.mediaUrl && (
        <div className="w-full bg-black flex justify-center border-b border-white/5 overflow-hidden group">
          {post.mediaUrl.match(/\.(mp4|webm|mov)$/i) ? (
            <video controls className="w-full max-h-[600px] object-cover grayscale group-hover:grayscale-0 transition duration-700">
              <source src={post.mediaUrl} type="video/mp4" />
            </video>
          ) : (
            <img src={post.mediaUrl} alt="Post media" className="w-full max-h-[600px] object-cover grayscale group-hover:grayscale-0 transition duration-700" />
          )}
        </div>
      )}

      <div className="p-6">
        <p className="uppercase tracking-[1px] text-gray-300 text-sm leading-relaxed">
          <span className="font-black text-pink-500 mr-3">{post.username}</span>
          {post.caption}
        </p>
        
        <div className="flex gap-8 mt-6 border-t border-white/5 pt-6">
          <button 
            onClick={handleRespect} 
            className={`uppercase tracking-[3px] text-xs transition-colors font-bold flex items-center gap-2 active:scale-95 ${
              hasRespected ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
            }`}
          >
            <span className="text-lg">▲</span> {respectCount} RESPECT
          </button>
          <button 
            onClick={onOpenComments} 
            className="uppercase tracking-[3px] text-xs text-gray-500 hover:text-white transition-colors font-bold"
          >
            [ COMMUNICATE ]
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;