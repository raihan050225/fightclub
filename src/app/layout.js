'use client'

import './globals.css'

import SmoothScroll from '@/components/SmoothScroll'
import Cursor from '@/components/Cursor'
import Spotlight from '@/components/SpotLight'
import Loader from '@/components/Loader'
import CursorTrail from '@/components/CursorTrail'
import RouteTransition from '@/components/RouteTransition'

import { useEffect, useState } from 'react'

export default function RootLayout({ children }) {

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => clearTimeout(timer)

  }, [])

  return (
    <html lang="en" data-scroll-behavior="smooth">

      <body suppressHydrationWarning={true}>

        {/* LOADER */}
        <Loader loading={loading} />

        {/* GLOBAL EFFECTS */}
        <RouteTransition />
       <SmoothScroll />

<Cursor />

<CursorTrail />

<Spotlight />
        {/* CONTENT */}
        {children}

      </body>
    </html>
  )
}