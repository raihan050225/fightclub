'use client'

import { useEffect, useState } from 'react'

import { db } from '@/lib/firebase'

import {
  collection,
  getDocs,
  getCountFromServer
} from 'firebase/firestore'

import Sidebar from '@/components/Sidebar'
import HeroSection from '@/components/HeroSection'
import FighterCard from '@/components/FighterCard'
import PageTransition from '@/components/PageTransition'
import Reveal from '@/components/Reveal'

export default function HomePage() {

  const [loading, setLoading] = useState(true)

  const [topFighters, setTopFighters] = useState([])

  const [stats, setStats] = useState({
    fightersCount: 0,
    gymsCount: 0,
    tournamentsCount: 0
  })

  useEffect(() => {

    async function loadHomeData() {

      try {

        const fightersRef = collection(db, 'fighters')

        // Pull every fighter once so we can rank by spar
        // requests and derive gym/fighter counts client-side
        // without needing a composite Firestore index.
        const snap = await getDocs(fightersRef)

        const allFighters = snap.docs.map(d => ({
          id: d.id,
          ...d.data()
        }))

        const sorted = [...allFighters].sort(
          (a, b) =>
            (b.sparRequests || 0) - (a.sparRequests || 0)
        )

        const top3 = sorted.slice(0, 3)

        const gymsSet = new Set(
          allFighters
            .map(f => f.gym)
            .filter(Boolean)
        )

        // Tournaments live in their own collection, so count
        // them separately. Falls back to 0 if it doesn't exist.
        let tournamentsCount = 0

        try {

          const tournamentsSnap = await getCountFromServer(
            collection(db, 'tournaments')
          )

          tournamentsCount = tournamentsSnap.data().count

        } catch (err) {

          console.log(err)
        }

        setTopFighters(top3)

        setStats({
          fightersCount: allFighters.length,
          gymsCount: gymsSet.size,
          tournamentsCount
        })

      } catch (err) {

        console.log(err)

      } finally {

        setLoading(false)
      }
    }

    loadHomeData()

  }, [])

  const featuredFighter = topFighters[0] || null

  return (
    <PageTransition>

      <main className="relative min-h-screen bg-black text-white overflow-hidden">

        {/* GRID */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,128,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.1)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

        {/* GLOW */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-pink-500 blur-[220px] opacity-10 rounded-full"></div>

        {/* NOISE */}
        <div className="noise"></div>

        <Sidebar />

        <Reveal>

          <section className="px-10 py-20">

            <HeroSection
              featuredFighter={featuredFighter}
              stats={stats}
            />

            {/* FIGHTERS */}
            <section className="px-10 py-20">

              <div className="mb-16">

                <p className="uppercase tracking-[6px] text-gray-500 text-xs mb-4">
                  Active Fighters
                </p>

                <h2 className="text-6xl font-black uppercase">
                  Find Your Match
                </h2>

              </div>

              {loading ? (

                <p className="text-gray-500 uppercase tracking-[4px] text-sm">
                  Loading fighters...
                </p>

              ) : topFighters.length === 0 ? (

                <p className="text-gray-500 uppercase tracking-[4px] text-sm">
                  No fighters registered yet.
                </p>

              ) : (

                <div className="grid md:grid-cols-3 gap-8">

                  {topFighters.map((fighter, i) => (

                    <Reveal key={fighter.id} delay={0.1 * (i + 1)}>

                      <FighterCard
                        image={fighter.image}
                        name={fighter.username}
                        style={fighter.style}
                        weight={
                          fighter.weight
                            ? `${fighter.weight} KG`
                            : '--'
                        }
                      />

                    </Reveal>
                  ))}

                </div>
              )}

            </section>

          </section>

        </Reveal>

      </main>

    </PageTransition>
  )
}