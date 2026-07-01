'use client'

import { useEffect, useState } from 'react'

export default function Spotlight() {

  const [position, setPosition] = useState({
    x: 0,
    y: 0
  })

  useEffect(() => {

    const move = (e) => {

      setPosition({
        x: e.clientX,
        y: e.clientY
      })
    }

    window.addEventListener('mousemove', move)

    return () =>
      window.removeEventListener('mousemove', move)

  }, [])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30"
      style={{
        background: `
          radial-gradient(
            circle 300px at ${position.x}px ${position.y}px,
            rgba(255,0,128,0.12),
            transparent 70%
          )
        `
      }}
    />
  )
}