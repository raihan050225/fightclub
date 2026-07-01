'use client'

import { useEffect, useState } from 'react'

export default function Cursor() {

  const [position, setPosition] =
    useState({
      x: 0,
      y: 0
    })

  useEffect(() => {

    const move = e => {

      setPosition({
        x: e.clientX,
        y: e.clientY
      })

    }

    window.addEventListener(
      'mousemove',
      move
    )

    return () =>
      window.removeEventListener(
        'mousemove',
        move
      )

  }, [])

  return (

    <div
     suppressHydrationWarning
      className={`
        fixed
        w-5
        h-5
        rounded-full
        bg-pink-500
        pointer-events-none
        z-[99999]
      `}
      style={{
        left: position.x,
        top: position.y,
        transform:
          'translate(-50%, -50%)'
      }}
    />

  )
}