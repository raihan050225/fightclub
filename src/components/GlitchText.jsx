'use client'

export default function GlitchText({
  children,
  className = ''
}) {
  return (
    <div className={`relative inline-block group ${className}`}>

      {/* MAIN */}
      <span className="relative z-10">
        {children}
      </span>

      {/* RED LAYER */}
      <span className="absolute left-0 top-0 text-pink-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-[2px] transition duration-100">
        {children}
      </span>

      {/* WHITE LAYER */}
      <span className="absolute left-0 top-0 text-white opacity-0 group-hover:opacity-100 group-hover:-translate-x-[2px] transition duration-100">
        {children}
      </span>

    </div>
  )
}