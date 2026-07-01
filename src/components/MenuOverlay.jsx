'use client'

import Link from 'next/link'

import {
  motion,
  AnimatePresence
} from 'framer-motion'

export default function MenuOverlay({
  open,
  setOpen
}) {

  const links = [
    {
      name: 'Home',
      href: '/home'
    },
    {
      name: 'Explore',
      href: '/explore'
    },
    {
      name: 'Gyms',
      href: '/gyms'
    },
    {
      name: 'Sparring',
      href: '/sparring'
    },
    {
      name: 'Tournaments',
      href: '/tournaments'
    }
  ]

  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{
            opacity: 0,
            clipPath: 'circle(0% at top right)'
          }}
          animate={{
            opacity: 1,
            clipPath: 'circle(150% at top right)'
          }}
          exit={{
            opacity: 0,
            clipPath: 'circle(0% at top right)'
          }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut'
          }}
          className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-3xl overflow-hidden"
        >

          {/* GRID */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,128,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,128,0.08)_1px,transparent_1px)] bg-[size:70px_70px]"></div>

          {/* GLOW */}
          <div className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full blur-[250px] opacity-10"></div>

          {/* CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-10 right-10 z-50 border border-pink-500/20 bg-black/40 backdrop-blur-xl px-6 py-4 uppercase tracking-[4px] text-xs hover:bg-pink-500 transition"
          >
            Close
          </button>

          {/* BACKGROUND TEXT */}
          <h1 className="absolute bottom-[-80px] left-0 text-[300px] font-black uppercase text-white/[0.03] leading-none whitespace-nowrap">
            Fight Club
          </h1>

          {/* LINKS */}
          <div className="relative z-20 flex flex-col justify-center h-full px-20">

            {links.map((link, i) => (

              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: -100
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: i * 0.1
                }}
              >

                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-6 mb-6"
                >

                  {/* NUMBER */}
                  <span className="text-gray-600 text-sm tracking-[4px] uppercase">
                    0{i + 1}
                  </span>

                  {/* TITLE */}
                  <h2 className="text-[120px] font-black uppercase leading-none text-white group-hover:text-pink-500 transition duration-300">

                    {link.name}

                  </h2>

                </Link>

              </motion.div>

            ))}

          </div>

        </motion.div>
      )}

    </AnimatePresence>
  )
}