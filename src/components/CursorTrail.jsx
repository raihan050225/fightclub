'use client'

import { useEffect, useState } from 'react'

export default function CursorTrail() {

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
      suppressHydrationWarning
      className={`
        fixed
        top-0
        left-0
        w-32
        h-32
        rounded-full
        pointer-events-none
        z-[9998]
        blur-3xl
        opacity-20
        transition-all
        duration-300
      `}
      style={{
        transform: `
          translate(
            ${position.x - 64}px,
            ${position.y - 64}px
          )
        `,
        background: '#ff0080'
      }}
    />
  )
}