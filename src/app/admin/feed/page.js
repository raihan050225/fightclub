'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, deleteDoc, doc, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Trash2, AlertTriangle } from 'lucide-react'

import AdminHeader from '../components/AdminHeader'

export default function FeedAdminPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Real-time listener for global posts
  useEffect(() => {
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'))
    const unsubPosts = onSnapshot(postsQuery, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    
    return () => unsubPosts()
  }, [])

  // Moderation action
  const handleDeletePost = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post? This cannot be undone.");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'posts', id))
    } catch (err) {
      console.error("Failed to delete post:", err)
    }
  }

  return (
    <div className="p-4 md:p-10">
      <AdminHeader 
        title="Feed Moderation" 
        subtitle="Monitor and moderate global user broadcasts" 
      />
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="rounded-[32px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-7">
          <div className="flex items-center gap-3 mb-8">
            <AlertTriangle className="text-pink-500" />
            <h2 className="text-3xl font-black">Global Feed</h2>
          </div>

          <div className="space-y-4">
            {posts.length === 0 ? (
              <p className="text-gray-500">No posts available to moderate.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="flex justify-between items-center rounded-3xl border border-white/[0.06] bg-black/40 p-5 hover:border-white/10 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-pink-500/20">
                      {post.userImage && (
                        <img src={post.userImage} alt="user" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{post.username}</h3>
                      <p className="text-sm text-gray-400 mt-1 max-w-xl truncate">
                        {post.caption}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition flex items-center gap-2"
                  >
                    <Trash2 size={18} />
                    <span className="hidden md:block text-xs font-bold uppercase tracking-[1px]">Purge</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}