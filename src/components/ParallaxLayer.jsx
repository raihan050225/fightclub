'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'

export default function ParallaxLayer({
  children,
  speed = 20,
  className = ''
}) {

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useTransform(y, [-500, 500], [speed, -speed])

  const rotateY = useTransform(x, [-500, 500], [-speed, speed])

  function handleMouseMove(e) {

    const rect =
      e.currentTarget.getBoundingClientRect()

    x.set(
      e.clientX - rect.left - rect.width / 2
    )

    y.set(
      e.clientY - rect.top - rect.height / 2
    )
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}