'use client'

import { motion } from 'framer-motion'

export default function Reveal({
  children,
  className = '',
  delay = 0
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 100,
        filter: 'blur(10px)'
      }}

      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)'
      }}

      transition={{
        duration: 1,
        delay
      }}

      viewport={{
        once: true,
        amount: 0.2
      }}

      className={className}
    >
      {children}
    </motion.div>
  )
}