'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import { db } from '@/lib/firebase'

import {
  ShieldCheck,
  Trophy,
  Dumbbell,
  Flame,
  Swords
} from 'lucide-react'

export default function FighterProfilePage() {

  const { uid } = useParams()

  const [fighter, setFighter] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function loadFighter() {

      try {

        const snap =
          await getDoc(
            doc(
              db,
              'fighters',
              uid
            )
          )

        if (snap.exists()) {

          setFighter({
            id: snap.id,
            ...snap.data()
          })
        }

      } catch (err) {

        console.log(err)

      } finally {

        setLoading(false)
      }
    }

    if (uid) {
      loadFighter()
    }

  }, [uid])

  if (loading) {

    return (
      <div className="
        min-h-screen
        bg-[#050507]
        text-white
        flex
        items-center
        justify-center
      ">
        Loading Fighter...
      </div>
    )
  }

  if (!fighter) {

    return (
      <div className="
        min-h-screen
        bg-[#050507]
        text-white
        flex
        items-center
        justify-center
      ">
        Fighter Not Found
      </div>
    )
  }

  return (
    <div className="
      min-h-screen
      bg-[#050507]
      text-white
      overflow-hidden
      relative
    ">

      {/* BACKGROUND */}
      <div className="
        absolute
        top-[-200px]
        left-[-200px]
        w-[500px]
        h-[500px]
        bg-pink-500/20
        blur-[180px]
        rounded-full
      " />

      <div className="
        absolute
        bottom-[-200px]
        right-[-200px]
        w-[500px]
        h-[500px]
        bg-fuchsia-500/20
        blur-[180px]
        rounded-full
      " />

      <div className="
        relative
        z-20
        max-w-7xl
        mx-auto
        px-6
        py-10
      ">

        {/* HERO */}
        <div className="
          rounded-[40px]
          border
          border-white/[0.06]
          bg-white/[0.03]
          backdrop-blur-3xl
          p-10
          overflow-hidden
          relative
        ">

          <div className="
            absolute
            top-[-100px]
            right-[-100px]
            w-[300px]
            h-[300px]
            bg-pink-500/20
            blur-[120px]
            rounded-full
          " />

          <div className="
            relative
            z-20
            grid
            lg:grid-cols-2
            gap-10
            items-center
          ">

            {/* IMAGE */}
            <div className="
              flex
              justify-center
            ">

              <div className="
                w-[350px]
                h-[350px]
                rounded-full
                overflow-hidden
                border-[6px]
                border-pink-500/30
                shadow-[0_0_100px_rgba(255,0,128,0.35)]
              ">

                {fighter.image ? (

                  <img
                    src={fighter.image}
                    alt={fighter.username}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  <div className="
                    w-full
                    h-full
                    bg-gradient-to-br
                    from-pink-500
                    to-fuchsia-700
                  " />

                )}

              </div>

            </div>

            {/* INFO */}
            <div>

              <div className="
                flex
                items-center
                gap-3
                mb-4
              ">

                {fighter.verified && (

                  <div className="
                    px-4
                    py-2
                    rounded-full
                    bg-green-500/10
                    text-green-400
                    flex
                    items-center
                    gap-2
                  ">

                    <ShieldCheck size={18} />

                    VERIFIED

                  </div>

                )}

              </div>

              <h1 className="
                text-7xl
                font-black
                leading-none
              ">
                {fighter.username}
              </h1>

              <p className="
                mt-4
                text-2xl
                text-pink-400
              ">
                {fighter.style || 'Fighter'}
              </p>

              <p className="
                mt-3
                text-gray-400
                text-lg
              ">
                {fighter.gym || 'Independent Fighter'}
              </p>

              <button
                className="
                  mt-8
                  h-[60px]
                  px-8
                  rounded-2xl
                  bg-gradient-to-r
                  from-pink-500
                  to-fuchsia-600
                  font-bold
                  text-lg
                  hover:scale-105
                  transition
                "
              >
                REQUEST SPAR
              </button>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="
          grid
          md:grid-cols-4
          gap-6
          mt-8
        ">

          <StatCard
            icon={<Trophy />}
            title="Wins"
            value={fighter.wins || 0}
          />

          <StatCard
            icon={<Swords />}
            title="Losses"
            value={fighter.losses || 0}
          />

          <StatCard
            icon={<Dumbbell />}
            title="Weight"
            value={fighter.weight || '--'}
          />

          <StatCard
            icon={<Flame />}
            title="Experience"
            value={fighter.experience || '--'}
          />

        </div>

        {/* BIO */}
        <div className="
          mt-8
          rounded-[40px]
          border
          border-white/[0.06]
          bg-white/[0.03]
          backdrop-blur-3xl
          p-8
        ">

          <h2 className="
            text-3xl
            font-black
          ">
            Fighter Bio
          </h2>

          <p className="
            mt-6
            text-gray-300
            leading-relaxed
            text-lg
          ">
            {fighter.bio || 'No bio added yet.'}
          </p>

        </div>

        {/* ACHIEVEMENTS */}
        <div className="
          mt-8
          rounded-[40px]
          border
          border-white/[0.06]
          bg-white/[0.03]
          backdrop-blur-3xl
          p-8
        ">

          <h2 className="
            text-3xl
            font-black
            mb-6
          ">
            Achievements
          </h2>

          <div className="
            flex
            flex-wrap
            gap-4
          ">

            {
              fighter.achievements?.length
                ? fighter.achievements.map(
                    (achievement, index) => (

                      <div
                        key={index}

                        className="
                          px-5
                          py-3
                          rounded-2xl
                          bg-pink-500/10
                          border
                          border-pink-500/20
                        "
                      >

                        {achievement}

                      </div>

                    )
                  )
                : (
                  <p className="text-gray-500">
                    No achievements yet
                  </p>
                )
            }

          </div>

        </div>

        {/* GALLERY */}
        <div className="
          mt-8
          rounded-[40px]
          border
          border-white/[0.06]
          bg-white/[0.03]
          backdrop-blur-3xl
          p-8
        ">

          <h2 className="
            text-3xl
            font-black
            mb-6
          ">
            Gallery
          </h2>

          <div className="
            grid
            md:grid-cols-3
            gap-5
          ">

            {
              fighter.gallery?.map(
                (image, index) => (

                  <div
                    key={index}

                    className="
                      aspect-square
                      rounded-3xl
                      overflow-hidden
                      border
                      border-white/[0.06]
                    "
                  >

                    <img
                      src={image}
                      alt=""
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  </div>

                )
              )
            }

          </div>

        </div>

      </div>

    </div>
  )
}

function StatCard({
  icon,
  title,
  value
}) {

  return (
    <div className="
      rounded-[32px]
      border
      border-white/[0.06]
      bg-white/[0.03]
      backdrop-blur-3xl
      p-6
    ">

      <div className="
        text-pink-500
        mb-5
      ">
        {icon}
      </div>

      <p className="
        text-gray-500
        text-sm
        uppercase
        tracking-[4px]
      ">
        {title}
      </p>

      <h2 className="
        mt-4
        text-4xl
        font-black
      ">
        {value}
      </h2>

    </div>
  )
}