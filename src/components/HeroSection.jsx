'use client'

import { motion } from 'framer-motion'

import ParallaxLayer from './ParallaxLayer'
import MagneticButton from './MagneticButton'
import Particles from './Particles'
import GlitchText from './GlitchText'

function formatCount(n) {

  if (typeof n !== 'number') return '--'

  if (n >= 1000) {

    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  }

  return String(n)
}

export default function HeroSection({
  featuredFighter,
  stats
}) {

  const fighter = featuredFighter || {}

  const wins = fighter.wins || 0
  const losses = fighter.losses || 0

  const record =
    (fighter.wins || fighter.losses)
      ? `${wins}W - ${losses}L`
      : '--'

  return (
    <section className="relative h-screen overflow-hidden flex items-center">

      {/* PARTICLES */}
      <Particles />

      {/* MASSIVE BACKGROUND TEXT */}
      <motion.h1
        animate={{
          x: [-20, 20, -20]
        }}
        transition={{
          duration: 10,
          repeat: Infinity
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[320px] font-black uppercase text-white/[0.03] leading-none whitespace-nowrap pointer-events-none z-0"
      >
        Fight Club
      </motion.h1>

      {/* GRID */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.08)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

      {/* MAIN GLOW */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity
        }}
        className="absolute left-1/2 top-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full blur-[300px] opacity-10"
      ></motion.div>

      {/* SIDE GLOW */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500 blur-[200px] opacity-20"></div>

      {/* CONTENT */}
      <div className="relative z-20 w-full px-16 grid lg:grid-cols-2 items-center gap-20">

        {/* LEFT */}
        <div>

          {/* TAG */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 border border-pink-500/20 bg-black/40 backdrop-blur-xl px-6 py-4 mb-10"
          >

            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></div>

            <p className="uppercase tracking-[8px] text-gray-400 text-xs">
              Underground Fight Network
            </p>

          </motion.div>

          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-[140px] leading-none font-black uppercase"
          >
            Find
            <br />

            Your
            <br />

           <GlitchText className="text-pink-500">
  Opponent
</GlitchText>
          </motion.h1>

          {/* SUBTEXT */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-gray-400 uppercase tracking-[5px] leading-8 text-sm max-w-xl"
          >
            Book underground sparring rounds.
            <br />
            Discover elite fighters.
            <br />
            Enter tournaments.
          </motion.p>

          {/* BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12 flex gap-6"
          >

            {/* PRIMARY */}
            <MagneticButton
              className="group relative overflow-hidden bg-pink-500 px-10 py-5 uppercase tracking-[6px] font-bold shadow-[0_0_40px_#ff0080] hover:scale-105"
            >

              <span className="relative z-10">
                Explore Fighters
              </span>

              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition"></div>

            </MagneticButton>

            {/* SECONDARY */}
            <MagneticButton
              className="border border-pink-500/20 bg-black/40 backdrop-blur-xl px-10 py-5 uppercase tracking-[6px] text-gray-400 hover:border-pink-500 hover:text-white"
            >
              Live Events
            </MagneticButton>

          </motion.div>

          {/* STATS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex gap-16 mt-20"
          >

            <div>
              <h2 className="text-5xl font-black text-pink-500">
                {formatCount(stats?.fightersCount)}
              </h2>

              <p className="uppercase tracking-[4px] text-xs text-gray-500 mt-3">
                Fighters
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-black text-pink-500">
                {formatCount(stats?.gymsCount)}
              </h2>

              <p className="uppercase tracking-[4px] text-xs text-gray-500 mt-3">
                Gyms
              </p>
            </div>

            <div>
              <h2 className="text-5xl font-black text-pink-500">
                {formatCount(stats?.tournamentsCount)}
              </h2>

              <p className="uppercase tracking-[4px] text-xs text-gray-500 mt-3">
                Tournaments
              </p>
            </div>

          </motion.div>
        </div>

        {/* RIGHT */}
        <div className="relative hidden lg:flex justify-center items-center">

          {/* DEPTH CARD 1 */}
          <ParallaxLayer
            speed={8}
            className="absolute top-20 right-0 z-10"
          >

            <motion.div
              animate={{
                y: [0, -20, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity
              }}
              className="w-72 h-96 border border-pink-500/20 bg-black/40 backdrop-blur-xl rotate-12"
            ></motion.div>

          </ParallaxLayer>

          {/* DEPTH CARD 2 */}
          <ParallaxLayer
            speed={12}
            className="absolute bottom-0 left-0 z-10"
          >

            <motion.div
              animate={{
                y: [0, 20, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity
              }}
              className="w-72 h-96 border border-white/10 bg-black/20 backdrop-blur-xl -rotate-12"
            ></motion.div>

          </ParallaxLayer>

          {/* MAIN IMAGE */}
          {fighter.image && (

            <ParallaxLayer
              speed={15}
              className="relative z-20"
            >

              <motion.img
                animate={{
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity
                }}
                src={fighter.image}
                alt={fighter.username || 'fighter'}
                className="h-[650px] object-cover grayscale hover:grayscale-0 transition duration-700"
              />

            </ParallaxLayer>
          )}

          {/* FLOATING INFO CARD */}
          {featuredFighter && (

            <ParallaxLayer
              speed={20}
              className="absolute top-20 left-0 z-30"
            >

              <motion.div
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity
                }}
                className="border border-pink-500/20 bg-black/50 backdrop-blur-xl px-8 py-6"
              >

                <p className="uppercase tracking-[4px] text-xs text-gray-500 mb-3">
                  Featured Fighter
                </p>

                <h2 className="text-4xl font-black uppercase">
                  {fighter.username || 'Unknown'}
                </h2>

                <div className="flex gap-4 mt-4 uppercase tracking-[4px] text-xs text-gray-400">

                  <p>{fighter.weight ? `${fighter.weight} KG` : '--'}</p>

                  <div className="w-1 h-1 rounded-full bg-pink-500"></div>

                  <p>{record}</p>

                </div>

              </motion.div>

            </ParallaxLayer>
          )}

          {/* FLOATING LABEL */}
          <ParallaxLayer
            speed={25}
            className="absolute bottom-20 right-10 z-30"
          >

            <motion.div
              animate={{
                y: [0, 10, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity
              }}
              className="border border-white/10 bg-black/40 backdrop-blur-xl px-6 py-5 rotate-[-6deg]"
            >

              <p className="uppercase tracking-[4px] text-xs text-gray-500 mb-2">
                Live Tonight
              </p>

              <h3 className="text-2xl font-black uppercase">
                Cage Wars
              </h3>

            </motion.div>

          </ParallaxLayer>

        </div>
      </div>
    </section>
  )
}