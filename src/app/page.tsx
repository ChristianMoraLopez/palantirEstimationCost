'use client'

import React from 'react'
import { CostEstimator } from '@/components/cost/CostEstimator'

const elvishBorder = (
  <div className="absolute inset-0 p-1">
    <div className="w-full h-full border-4 border-amber-600/30 rounded-lg relative">
      {/* Esquinas decorativas */}
      <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-amber-600/70 rounded-tl-lg" />
      <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-amber-600/70 rounded-tr-lg" />
      <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-amber-600/70 rounded-bl-lg" />
      <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-amber-600/70 rounded-br-lg" />
    </div>
  </div>
)

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-amber-50">
      {/* Decoración superior */}
      <div className="absolute top-0 left-0 w-full h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMEwwIDMwaDYwTDMwIDB6IiBmaWxsPSJyZ2JhKDI1MSwgMTkxLCA2MywgMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
      
      <div className="max-w-6xl mx-auto py-12 px-4 relative">
        <div className="text-center mb-16 relative">
          {/* Decoración del título */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
          
          <h1 className="text-4xl md:text-6xl font-serif text-amber-900/80 tracking-wide relative inline-block">
            Palantír Cost Vision
            {/* Subrayado decorativo */}
            <div className="absolute -bottom-4 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
          </h1>
          
          <p className="mt-6 text-amber-800/60 font-serif italic">
            "Un vistazo a través del tiempo para revelar los costos del futuro"
          </p>
        </div>

        {/* Contenedor principal con borde élfico */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-8 relative">
          {elvishBorder}
          {/* Contenido del estimador */}
          <div className="relative z-10">
            <CostEstimator />
          </div>
        </div>

        {/* Decoración inferior */}
        <div className="mt-12 text-center text-amber-700/40 font-serif text-sm">
          ❈ Forjado en los reinos élficos ❈
        </div>
      </div>
    </main>
  )
}