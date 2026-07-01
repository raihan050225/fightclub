'use client'

import { motion, AnimatePresence } from 'framer-motion'

export default function Loader({ loading }) {

  return (
    <AnimatePresence>

      {loading && (

        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 1
            }
          }}
          className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        >

          {/* GRID */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.08)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

          {/* GLOW */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity
            }}
            className="absolute w-[900px] h-[900px] bg-pink-500 rounded-full blur-[250px] opacity-20"
          ></motion.div>

          {/* CONTENT */}
          <div className="relative z-20 text-center">

            {/* SMALL TEXT */}
            <motion.p
              initial={{
                opacity: 0,
                y: 20
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              className="uppercase tracking-[10px] text-gray-500 text-xs mb-8"
            >
              Entering The Arena
            </motion.p>

            {/* TITLE */}
            <motion.h1
              initial={{
                opacity: 0,
                y: 100
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 1
              }}
              className="text-[180px] font-black uppercase text-pink-500 leading-none"
              style={{
                textShadow:
                  '0 0 20px #ff0080, 0 0 40px #ff0080'
              }}
            >
              FightClub
            </motion.h1>

            {/* LOADING BAR */}
            <div className="w-[400px] h-[2px] bg-white/10 mt-16 mx-auto overflow-hidden">

              <motion.div
                initial={{
                  x: '-100%'
                }}
                animate={{
                  x: '100%'
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear'
                }}
                className="w-1/2 h-full bg-pink-500"
              ></motion.div>

            </div>

            {/* BOTTOM TEXT */}
            <motion.p
              animate={{
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
              className="mt-8 uppercase tracking-[6px] text-gray-500 text-xs"
            >
              Syncing Fighters...
            </motion.p>

          </div>

          {/* MASSIVE BACKGROUND TEXT */}
          <h1 className="absolute bottom-[-60px] left-0 text-[300px] font-black uppercase text-white/[0.03] whitespace-nowrap">
            Underground Fight Network
          </h1>

        </motion.div>
      )}

    </AnimatePresence>
  )
}