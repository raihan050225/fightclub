'use client'

import {
  useEffect,
  useState
} from 'react'

import {
  auth,
  db
} from '@/lib/firebase'

import {
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore'

import {
  onAuthStateChanged
} from 'firebase/auth'

import {
  Camera,
  Save,
  Flame,
  Shield,
  Trophy
} from 'lucide-react'

export default function ProfilePage() {

  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [uploading, setUploading] =
    useState(false)

  const [fighter, setFighter] =
    useState({
      username: '',
      age: '',
      weight: '',
      gym: '',
      style: '',
      bio: '',
      image: '',
      wins: '',
      losses: '',
      experience: ''
    })

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async currentUser => {

          if (!currentUser) {

            setLoading(false)

            return
          }

          setUser(currentUser)

          try {

            const ref = doc(
              db,
              'fighters',
              currentUser.uid
            )

            const snap =
              await getDoc(ref)

            if (snap.exists()) {

              setFighter(
                snap.data()
              )
            }

          } catch (err) {

            console.log(err)

          } finally {

            setLoading(false)
          }
        }
      )

    return () => unsubscribe()

  }, [])

  async function uploadImage(file) {

    try {

      setUploading(true)

      const formData =
        new FormData()

      formData.append(
        'file',
        file
      )

      formData.append(
        'upload_preset',
        'fightclub'
      )

      const response =
        await fetch(
          'https://api.cloudinary.com/v1_1/dmlbi0tui/image/upload',
          {
            method: 'POST',
            body: formData
          }
        )

      const data =
        await response.json()

      setFighter({
        ...fighter,
        image: data.secure_url
      })

    } catch (err) {

      console.log(err)

    } finally {

      setUploading(false)
    }
  }

  async function handleSave() {

    if (!user) return

    try {

      setSaving(true)

      await setDoc(
        doc(
          db,
          'fighters',
          user.uid
        ),
        {
          ...fighter,
          uid: user.uid,
          email: user.email
        }
      )

      alert('Profile Saved')

    } catch (err) {

      console.log(err)

    } finally {

      setSaving(false)
    }
  }

  if (loading) {

    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white overflow-hidden relative">

      {/* BACKGROUND */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-pink-500/20 blur-[180px] rounded-full"></div>

        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-fuchsia-500/20 blur-[180px] rounded-full"></div>

        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:80px_80px]"></div>

      </div>

      {/* CONTENT */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-10 grid xl:grid-cols-2 gap-10 min-h-screen items-center">

        {/* LEFT SIDE */}
        <div className="relative h-[760px] rounded-[40px] overflow-hidden border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-10 flex flex-col justify-between shadow-[0_0_100px_rgba(255,0,128,0.1)]">

          {/* SPOTLIGHT */}
          <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-pink-500/20 blur-[120px] rounded-full"></div>

          {/* HEADER */}
          <div className="relative z-20">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-500">
                <Flame size={22} />
              </div>

              <div>

                <p className="text-sm uppercase tracking-[5px] text-pink-400">
                  FightClub Identity
                </p>

                <p className="text-gray-500 text-sm mt-1">
                  Verified Fighter Profile
                </p>

              </div>

            </div>

            <h1 className="text-7xl font-black leading-none tracking-tight">
              {fighter.username || 'YOUR NAME'}
            </h1>

            <p className="mt-5 text-gray-400 text-xl">
              {fighter.style || 'Fighting Style'}
            </p>

          </div>

          {/* PROFILE IMAGE */}
          <div className="relative z-20 flex justify-center">

            <div className="relative w-[360px] h-[360px] rounded-full overflow-hidden border-[6px] border-pink-500/30 shadow-[0_0_100px_rgba(255,0,128,0.3)]">

              {fighter.image ? (

                <img
                  src={fighter.image}
                  alt="fighter"
                  className="w-full h-full object-cover"
                />

              ) : (

                <div className="w-full h-full bg-gradient-to-br from-pink-500 to-fuchsia-700"></div>

              )}

            </div>

          </div>

          {/* STATS */}
          <div className="relative z-20 grid grid-cols-3 gap-4">

            <Stat
              icon={<Shield size={18} />}
              title="Weight"
              value={fighter.weight || '--'}
            />

            <Stat
              icon={<Trophy size={18} />}
              title="Wins"
              value={fighter.wins || '--'}
            />

            <Stat
              icon={<Flame size={18} />}
              title="Experience"
              value={fighter.experience || '--'}
            />

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="rounded-[40px] border border-white/[0.06] bg-white/[0.03] backdrop-blur-3xl p-10 shadow-[0_0_80px_rgba(255,255,255,0.03)]">

          <h2 className="text-5xl font-black">
            Fighter Registration
          </h2>

          <p className="mt-3 text-gray-400 text-lg">
            Create your combat identity.
          </p>

          {/* FORM */}
          <div className="mt-10 space-y-6">

            {/* IMAGE UPLOAD */}
            <div>

              <p className="mb-3 text-sm text-gray-400">
                Fighter Image
              </p>

              <label className="h-[180px] rounded-3xl border-2 border-dashed border-white/[0.08] bg-black/20 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/40 transition">

                <Camera size={38} />

                <p className="mt-4 text-gray-400">
                  {
                    uploading
                      ? 'Uploading...'
                      : 'Upload Fighter Image'
                  }
                </p>

                <input
                  type="file"
                  hidden

                  onChange={e =>
                    uploadImage(
                      e.target.files[0]
                    )
                  }
                />

              </label>

            </div>

            <Input
              label="Username"
              value={fighter.username}
              onChange={e =>
                setFighter({
                  ...fighter,
                  username: e.target.value
                })
              }
            />

            <div className="grid md:grid-cols-2 gap-5">

              <Input
                label="Age"
                value={fighter.age}
                onChange={e =>
                  setFighter({
                    ...fighter,
                    age: e.target.value
                  })
                }
              />

              <Input
                label="Weight (KG)"
                value={fighter.weight}
                onChange={e =>
                  setFighter({
                    ...fighter,
                    weight: e.target.value
                  })
                }
              />

            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <Input
                label="Wins"
                value={fighter.wins}
                onChange={e =>
                  setFighter({
                    ...fighter,
                    wins: e.target.value
                  })
                }
              />

              <Input
                label="Losses"
                value={fighter.losses}
                onChange={e =>
                  setFighter({
                    ...fighter,
                    losses: e.target.value
                  })
                }
              />

            </div>

            <Input
              label="Gym"
              value={fighter.gym}
              onChange={e =>
                setFighter({
                  ...fighter,
                  gym: e.target.value
                })
              }
            />

            <Input
              label="Fighting Style"
              value={fighter.style}
              onChange={e =>
                setFighter({
                  ...fighter,
                  style: e.target.value
                })
              }
            />

            <Input
              label="Experience"
              value={fighter.experience}
              onChange={e =>
                setFighter({
                  ...fighter,
                  experience: e.target.value
                })
              }
            />

            {/* BIO */}
            <div>

              <p className="mb-3 text-sm text-gray-400">
                Bio
              </p>

              <textarea
                rows={5}
                value={fighter.bio}

                onChange={e =>
                  setFighter({
                    ...fighter,
                    bio: e.target.value
                  })
                }

                className="w-full rounded-3xl bg-black/20 border border-white/[0.06] px-5 py-4 outline-none focus:border-pink-500/40 transition"
              />

            </div>

            {/* BUTTON */}
            <button
              onClick={handleSave}
              disabled={saving}

              className="w-full h-[64px] rounded-3xl bg-gradient-to-r from-pink-500 to-fuchsia-600 text-lg font-bold flex items-center justify-center gap-3 hover:scale-[1.02] transition"
            >

              <Save size={22} />

              {
                saving
                  ? 'Saving...'
                  : 'Save Fighter Profile'
              }

            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

function Input({
  label,
  value,
  onChange
}) {

  return (
    <div>

      <p className="mb-3 text-sm text-gray-400">
        {label}
      </p>

      <input
        value={value}
        onChange={onChange}

        className="w-full h-[60px] rounded-2xl bg-black/20 border border-white/[0.06] px-5 outline-none focus:border-pink-500/40 transition"
      />

    </div>
  )
}

function Stat({
  icon,
  title,
  value
}) {

  return (
    <div className="rounded-3xl bg-black/20 border border-white/[0.06] p-5">

      <div className="flex items-center gap-3 text-pink-400">

        {icon}

        <p className="text-xs uppercase tracking-[4px] text-gray-500">
          {title}
        </p>

      </div>

      <h2 className="mt-4 text-3xl font-bold">
        {value}
      </h2>

    </div>
  )
}