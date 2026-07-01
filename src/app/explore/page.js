'use client'

import {
  useEffect,
  useState
} from 'react'

import {
  collection,
  getDocs
} from 'firebase/firestore'

import {
  onAuthStateChanged
} from 'firebase/auth'

import {
  db,
  auth
} from '@/lib/firebase'

import Sidebar from '@/components/Sidebar'

import FighterCard from '@/components/FighterCard'

import {
  motion
} from 'framer-motion'

export default function ExplorePage() {

  const [fighters, setFighters] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    // Wait for Firebase to resolve the current auth state before
    // fetching/filtering. Reading auth.currentUser synchronously
    // here can return null even when a user is logged in, because
    // Firebase hasn't finished restoring the session yet.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      loadFighters(user)
    })

    async function loadFighters(currentUser) {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              'fighters'
            )
          )

        const data =
          snapshot.docs

            .map(doc => ({
              id: doc.id,
              ...doc.data()
            }))

            // REMOVE CURRENT USER
            .filter(fighter =>
              fighter.uid !== currentUser?.uid
            )

        setFighters(data)

      } catch (err) {

        console.log(err)

      } finally {

        setLoading(false)
      }
    }

    return () => unsubscribe()

  }, [])

  return (
    <main className="
      min-h-screen
      bg-black
      text-white
      relative
      overflow-hidden
    ">

      {/* GRID */}
      <div className="
        absolute
        inset-0
        opacity-10
        bg-[linear-gradient(rgba(255,0,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.08)_1px,transparent_1px)]
        bg-[size:70px_70px]
      "></div>

      {/* GLOW */}
      <div className="
        absolute
        top-1/2
        left-1/2
        w-[1200px]
        h-[1200px]
        -translate-x-1/2
        -translate-y-1/2
        bg-pink-500
        rounded-full
        blur-[300px]
        opacity-10
      "></div>

      {/* BACKGROUND TEXT */}
      <h1 className="
        absolute
        top-20
        left-1/2
        -translate-x-1/2
        text-[260px]
        font-black
        uppercase
        text-white/[0.03]
        whitespace-nowrap
        pointer-events-none
      ">
        FightClub
      </h1>

      <Sidebar />

      <section className="
        relative
        z-20
        ml-24
        px-12
        py-20
      ">

        {/* HEADER */}
        <motion.div
          initial={{
            opacity: 0,
            y: 80
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 1
          }}
          className="mb-20"
        >

          <p className="
            uppercase
            tracking-[8px]
            text-gray-500
            text-xs
            mb-6
          ">
            Underground Fight Network
          </p>

          <h1 className="
            text-[120px]
            font-black
            uppercase
            leading-none
          ">
            Explore
            <span className="text-pink-500">
              {' '}Fighters
            </span>
          </h1>

          <p className="
            mt-8
            text-gray-400
            uppercase
            tracking-[4px]
            text-sm
            max-w-2xl
            leading-8
          ">
            Discover fighters.
            Challenge opponents.
            Build rivalries.
            Enter underground sparring.
          </p>

        </motion.div>

        {/* LOADING */}
        {loading ? (

          <div className="
            flex
            items-center
            justify-center
            h-[500px]
          ">

            <motion.h2
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
              className="
                text-5xl
                font-black
                uppercase
              "
            >
              Loading Fighters...
            </motion.h2>

          </div>

        ) : fighters.length === 0 ? (

          <div className="
            flex
            items-center
            justify-center
            h-[500px]
            border
            border-pink-500/10
            bg-black/40
            backdrop-blur-xl
          ">

            <div className="text-center">

              <h2 className="
                text-5xl
                font-black
                uppercase
                mb-6
              ">
                No Fighters Found
              </h2>

              <p className="
                uppercase
                tracking-[4px]
                text-gray-500
                text-xs
              ">
                More fighters will appear here
              </p>

            </div>

          </div>

        ) : (

          <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 0.3
            }}
            className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
              gap-10
            "
          >

            {fighters.map((fighter, index) => (

              <motion.div
                key={fighter.id}

                initial={{
                  opacity: 0,
                  y: 100
                }}

                animate={{
                  opacity: 1,
                  y: 0
                }}

                transition={{
                  delay: index * 0.1
                }}
              >

                <FighterCard
                  id={fighter.id}

                  image={fighter.image}

                  name={fighter.username}

                  style={fighter.style}

                  weight={fighter.weight}

                  record={`${fighter.wins}W - ${fighter.losses}L`}
                />

              </motion.div>

            ))}

          </motion.div>

        )}

      </section>

    </main>
  )
}