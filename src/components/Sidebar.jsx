'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Home,
  Users,
  Dumbbell,
  Swords,
  Activity,
  Menu,
  User,
  Inbox,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase' // Adjust this path if your firebase config is elsewhere

import MenuOverlay from './MenuOverlay'

export default function Sidebar() {
  const router = useRouter()
  
  // State for the full-screen menu overlay
  const [open, setOpen] = useState(false)
  
  // State to slide the sidebar in and out
  const [isVisible, setIsVisible] = useState(true)

  const links = [
    { href: '/home', icon: Home },
    { href: '/explore', icon: Users },
    { href: '/inbox', icon: Inbox },
    { href: '/profile', icon: User },
    { href: '/gyms', icon: Dumbbell },
    { href: '/tournament', icon: Swords },
    { href: '/feed', icon: Activity }
  ]

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login'); // Sends them back to the login screen
    } catch (error) {
      console.error("System Error during logout:", error);
      alert("Disconnection failed. Try again.");
    }
  };

  return (
    <>
      {/* MENU OVERLAY */}
      <MenuOverlay
        open={open}
        setOpen={setOpen}
      />

      {/* SIDEBAR CONTAINER */}
      <aside className={`
        fixed
        left-0
        top-0
        h-screen
        w-24
        border-r
        border-pink-500/10
        bg-black/40
        backdrop-blur-xl
        z-[100]
        transform 
        transition-transform 
        duration-500 
        ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isVisible ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* TOGGLE VISIBILITY TAB (Sticks out to the right) */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="
            absolute
            top-1/2
            -right-8
            -translate-y-1/2
            w-8
            h-16
            bg-black/60
            backdrop-blur-xl
            border-y
            border-r
            border-pink-500/20
            rounded-r-md
            flex
            items-center
            justify-center
            text-pink-500/50
            hover:text-pink-500
            hover:border-pink-500/50
            transition-colors
            group
          "
        >
          {isVisible ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          
          {/* Subtle glow on hover */}
          <div className="absolute inset-0 bg-pink-500 blur-md opacity-0 group-hover:opacity-30 transition-opacity rounded-r-md"></div>
        </button>

        {/* GLOW */}
        <div className="
          absolute
          top-0
          left-0
          w-full
          h-64
          bg-pink-500/10
          blur-[100px]
          pointer-events-none
        "></div>

        <div className="
          relative
          flex
          flex-col
          items-center
          py-10
          h-full
        ">

          {/* LOGO */}
          <Link href="/home" className="mb-10">
            <h1
              className="
                text-pink-500
                font-black
                text-3xl
                uppercase
              "
              style={{
                textShadow: '0 0 10px #ff0080, 0 0 20px #ff0080'
              }}
            >
              FC
            </h1>
          </Link>

          {/* MENU BUTTON */}
          <button
            onClick={() => setOpen(true)}
            className="
              group
              relative
              hover:text-pink-500
              transition
              duration-300
              mb-6
            "
          >
            <div className="
              absolute
              inset-0
              bg-pink-500
              blur-xl
              opacity-0
              group-hover:opacity-30
              transition
              duration-300
            "></div>

            <div className="
              relative
              z-10
              border
              border-pink-500/20
              p-4
              bg-black/20
              backdrop-blur-xl
            ">
              <Menu size={24} />
            </div>
          </button>

          {/* NAV - Reduced gap-8 to gap-4 */}
          <nav className="
            flex
            flex-col
            gap-4
            text-gray-500
            w-full
            items-center
          ">
            {links.map((item, i) => {
              const Icon = item.icon
              return (
                <Link
                  key={i}
                  href={item.href}
                  className="
                    group
                    relative
                    hover:text-pink-500
                    transition
                    duration-300
                  "
                >
                  {/* GLOW */}
                  <div className="
                    absolute
                    inset-0
                    bg-pink-500
                    blur-xl
                    opacity-0
                    group-hover:opacity-30
                    transition
                    duration-300
                  "></div>

                  {/* ICON */}
                  <div className="
                    relative
                    z-10
                    border
                    border-transparent
                    group-hover:border-pink-500/20
                    p-4
                    transition
                    duration-300
                    bg-black/20
                    backdrop-blur-xl
                  ">
                    <Icon size={24} />
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* LOGOUT BUTTON - Pushed to the bottom */}
          <div className="mt-auto mb-4">
            <button
              onClick={handleLogout}
              className="
                group
                relative
                text-gray-500
                hover:text-red-500
                transition
                duration-300
              "
              title="Disconnect"
            >
              {/* RED GLOW */}
              <div className="
                absolute
                inset-0
                bg-red-500
                blur-xl
                opacity-0
                group-hover:opacity-30
                transition
                duration-300
              "></div>

              {/* ICON */}
              <div className="
                relative
                z-10
                border
                border-transparent
                group-hover:border-red-500/20
                p-4
                transition
                duration-300
                bg-black/20
                backdrop-blur-xl
              ">
                <LogOut size={24} />
              </div>
            </button>
          </div>

        </div>
      </aside>
    </>
  )
}