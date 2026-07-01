'use client'

import { useState } from 'react'

import {
  db,
  storage,
  auth
} from '@/lib/firebase'

import {
  doc,
  setDoc
} from 'firebase/firestore'

import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage'

import {
  motion
} from 'framer-motion'

import { useRouter } from 'next/navigation'

export default function SetupProfile() {

  const router = useRouter()

  const [loading, setLoading] =
    useState(false)

  const [form, setForm] = useState({
    username: '',
    style: '',
    weight: '',
    bio: '',
    wins: '',
    losses: ''
  })

  const [image, setImage] =
    useState(null)

  function handleChange(e) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleSubmit(e) {

    e.preventDefault()

    try {

      setLoading(true)

      const user =
        auth.currentUser

      if (!user) return

      // UPLOAD IMAGE
      let imageUrl = ''

      if (image) {

        const imageRef =
          ref(storage, `fighters/${user.uid}`)

        await uploadBytes(imageRef, image)

        imageUrl =
          await getDownloadURL(imageRef)
      }

      // SAVE USER
      await setDoc(
        doc(db, 'fighters', user.uid),
        {
          ...form,
          image: imageUrl,
          uid: user.uid,
          email: user.email,
          createdAt: Date.now()
        }
      )

      router.push('/profile')

    } catch (err) {

      console.log(err)

    } finally {

      setLoading(false)
    }
  }

  return (
    <main className="
      min-h-screen
      bg-black
      text-white
      flex
      items-center
      justify-center
      px-6
    ">

      <motion.form
        initial={{
          opacity: 0,
          y: 80
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        onSubmit={handleSubmit}
        className="
          w-full
          max-w-2xl
          border
          border-pink-500/20
          bg-black/40
          backdrop-blur-xl
          p-10
          space-y-6
        "
      >

        <h1 className="
          text-6xl
          font-black
          uppercase
        ">
          Create
          <span className="text-pink-500">
            {' '}Profile
          </span>
        </h1>

        {/* USERNAME */}
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="
            w-full
            bg-black/40
            border
            border-pink-500/20
            px-6
            py-5
            outline-none
          "
        />

        {/* STYLE */}
        <input
          name="style"
          placeholder="Fighting Style"
          onChange={handleChange}
          className="
            w-full
            bg-black/40
            border
            border-pink-500/20
            px-6
            py-5
            outline-none
          "
        />

        {/* WEIGHT */}
        <input
          name="weight"
          placeholder="Weight Class"
          onChange={handleChange}
          className="
            w-full
            bg-black/40
            border
            border-pink-500/20
            px-6
            py-5
            outline-none
          "
        />

        {/* BIO */}
        <textarea
          name="bio"
          placeholder="Bio"
          rows="5"
          onChange={handleChange}
          className="
            w-full
            bg-black/40
            border
            border-pink-500/20
            px-6
            py-5
            outline-none
          "
        />

        {/* RECORD */}
        <div className="grid grid-cols-2 gap-4">

          <input
            name="wins"
            placeholder="Wins"
            onChange={handleChange}
            className="
              w-full
              bg-black/40
              border
              border-pink-500/20
              px-6
              py-5
              outline-none
            "
          />

          <input
            name="losses"
            placeholder="Losses"
            onChange={handleChange}
            className="
              w-full
              bg-black/40
              border
              border-pink-500/20
              px-6
              py-5
              outline-none
            "
          />

        </div>

        {/* IMAGE */}
        <input
          type="file"
          onChange={(e) =>
            setImage(e.target.files[0])
          }
        />

        {/* BUTTON */}
        <button
          disabled={loading}
          className="
            w-full
            bg-pink-500
            py-5
            uppercase
            tracking-[6px]
            font-bold
          "
        >
          {loading
            ? 'Creating...'
            : 'Create Profile'}
        </button>

      </motion.form>
    </main>
  )
}