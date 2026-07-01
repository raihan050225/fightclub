import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CommentModal = ({ postId, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // useEffect for Firebase fetching remains the same

  const handleAddComment = async (e) => {
    // Firebase addDoc logic remains the same
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="border border-pink-500/30 bg-black w-full max-w-xl h-3/4 flex flex-col shadow-[0_0_50px_rgba(255,0,128,0.1)] relative">
        
        {/* GLOW EFFECT */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px] bg-pink-500 shadow-[0_0_20px_#ff0080]"></div>

        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="font-black uppercase tracking-[6px] text-pink-500">Comms Link</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white uppercase tracking-[2px] text-xs border border-white/10 px-3 py-1 transition-colors">
            CLOSE [X]
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {comments.map(c => (
            <div key={c.id} className="border-l-2 border-white/10 pl-4 hover:border-pink-500 transition-colors">
              <span className="font-black uppercase tracking-[2px] text-gray-400 block mb-1 text-xs">{c.username}</span>
              <span className="uppercase text-sm tracking-[1px] text-gray-200">{c.text}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="p-6 border-t border-white/10 flex gap-4 bg-black/50">
          <input 
            type="text" 
            className="flex-1 bg-transparent border-b border-white/20 p-2 focus:outline-none focus:border-pink-500 text-white uppercase tracking-[1px] text-sm transition-colors"
            placeholder="ENTER TRANSMISSION..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="bg-white/10 hover:bg-pink-500 px-6 py-2 uppercase tracking-[3px] text-xs font-bold transition-colors">
            SEND
          </button>
        </form>
      </div>
    </div>
  );
};

export default CommentModal;