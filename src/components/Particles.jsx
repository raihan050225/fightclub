'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Particles() {

  const [particles, setParticles] = useState([])

  useEffect(() => {

    const generated = Array.from({ length: 25 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: 5 + Math.random() * 5
    }))

    setParticles(generated)

  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">

      {particles.map((particle, i) => (

        <motion.div
          key={i}

          animate={{
            y: [0, -100, 0],
            x: [0, 30, 0],
            opacity: [0.1, 0.4, 0.1]
          }}

          transition={{
            duration: particle.duration,
            repeat: Infinity
          }}

          className="absolute w-1 h-1 bg-pink-500 rounded-full blur-[1px]"

          style={{
            top: `${particle.top}%`,
            left: `${particle.left}%`
          }}
        />

      ))}

    </div>
  )
}