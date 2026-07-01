'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Swords, Users, Trophy, Bell, Settings, ShieldAlert, CreditCard,Dumbbell } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <Home size={20} /> },
    { label: 'Requests', href: '/admin/request', icon: <Swords size={20} /> },
    { label: 'Fighters', href: '/admin/fighters', icon: <Users size={20} /> },
    { label: 'Matches', href: '/admin/matches', icon: <ShieldAlert size={20} /> },
    { label: 'Tournaments', href: '/admin/tournaments', icon: <Trophy size={20} /> }, // <-- Added Tournaments here
    { label: 'Payments', href: '/admin/payments', icon: <CreditCard size={20} /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
    { label: 'gyms', href: '/admin/gyms', icon: <Dumbbell size={20} />}
    
  ];

  return (
    <div className="relative z-20 w-72 bg-white/[0.02] backdrop-blur-3xl border-r border-white/[0.05] p-6 flex flex-col justify-between hidden md:flex min-h-screen">
      <div>
        {/* LOGO */}
        <div className="mb-12">
          <h1 className="text-5xl font-black tracking-tight">
            Fight<span className="text-pink-500">Club</span>
          </h1>
          <p className="text-xs uppercase tracking-[5px] text-gray-500 mt-3">
            Admin Control
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <div className={`
                  flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-[0_0_30px_rgba(255,0,128,0.3)] text-white' 
                    : 'hover:bg-white/[0.05] text-gray-400 hover:text-white'
                  }
                `}>
                  {item.icon}
                  <span className="font-medium tracking-wide">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* LOWER CARD */}
      <div className="rounded-[32px] bg-gradient-to-br from-pink-500/20 to-fuchsia-700/20 border border-pink-500/30 p-6 mt-10">
        <h2 className="text-xl font-bold text-pink-500">FC Elite</h2>
        <p className="text-xs text-gray-400 mt-2 leading-relaxed">
          Secure terminal connection established.
        </p>
      </div>
    </div>
  );
}