'use client'

import {
  motion,
  AnimatePresence
} from 'framer-motion'

import { usePathname } from 'next/navigation'

export default function RouteTransition() {

  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">

      <motion.div
        key={pathname}

        initial={{
          y: '100%'
        }}

        animate={{
          y: '-100%'
        }}

        exit={{
          y: '100%'
        }}

        transition={{
          duration: 1,
          ease: [0.76, 0, 0.24, 1]
        }}
        
        className={`
          fixed
          inset-0
          z-[99999]
          bg-black
          pointer-events-none
        `}
      >

        {/* GLOW */}
        <div
        suppressHydrationWarning
         className={`
          absolute
          inset-0
          bg-pink-500
          opacity-20
          blur-[150px]
        `}></div>

        {/* TITLE */}
        <div
        suppressHydrationWarning
         className={`
          absolute
          inset-0
          flex
          items-center
          justify-center
        `}>

          <h1
            className={`
              text-[160px]
              font-black
              uppercase
              text-pink-500
            `}
            style={{
              textShadow:
                '0 0 20px #ff0080'
            }}
          >
            FightClub
          </h1>

        </div>

      </motion.div>

    </AnimatePresence>
  )
}