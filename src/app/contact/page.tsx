'use client'

import React from 'react'
import { Github, Linkedin, Mail, Phone } from 'lucide-react'

const ElvishBorder = () => (
  <div className="absolute inset-0 p-1">
    <div className="w-full h-full border-2 md:border-4 border-amber-600/30 rounded-lg relative">
      <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 md:border-t-4 md:border-l-4 border-amber-600/70 rounded-tl-lg" />
      <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 md:border-t-4 md:border-r-4 border-amber-600/70 rounded-tr-lg" />
      <div className="absolute -bottom-2 -left-2 md:-bottom-3 md:-left-3 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 md:border-b-4 md:border-l-4 border-amber-600/70 rounded-bl-lg" />
      <div className="absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 md:border-b-4 md:border-r-4 border-amber-600/70 rounded-br-lg" />
    </div>
  </div>
)

export default function ContactUs() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-amber-50">
      {/* Top decoration */}
      <div className="absolute top-0 left-0 w-full h-12 md:h-16 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzAgMEwwIDMwaDYwTDMwIDB6IiBmaWxsPSJyZ2JhKDI1MSwgMTkxLCA2MywgMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
      
      <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 sm:px-6 relative">
        <div className="text-center mb-8 md:mb-16 relative">
          <div className="absolute -top-4 md:-top-8 left-1/2 transform -translate-x-1/2 w-24 md:w-32 h-1 md:h-2 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
          
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-amber-900/80 tracking-wide relative inline-block">
            Contáctanos
            <div className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-0.5 md:h-1 bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
          </h1>
          
          <p className="mt-4 md:mt-6 text-sm md:text-base text-amber-800/60 font-serif italic px-4">
            &quot;Comunícate con nosotros a través de cualquier medio&quot;
          </p>
        </div>

        {/* Contact Info Container */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
          <ElvishBorder />
          
          {/* Contact Information */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-6 max-w-xl mx-auto">
              {/* Email */}
              <a 
                href="mailto:creymora@ucompensar.edu.co" 
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-amber-50 transition-colors duration-300"
              >
                <Mail className="w-6 h-6 text-amber-600" />
                <span className="text-amber-900">creymora@ucompensar.edu.co</span>
              </a>

              {/* GitHub */}
              <a 
                href="https://github.com/ChristianMoraLopez" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-amber-50 transition-colors duration-300"
              >
                <Github className="w-6 h-6 text-amber-600" />
                <span className="text-amber-900">github.com/ChristianMoraLopez</span>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/in/christian-moral/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-amber-50 transition-colors duration-300"
              >
                <Linkedin className="w-6 h-6 text-amber-600" />
                <span className="text-amber-900">linkedin.com/in/christian-moral</span>
              </a>

              {/* Phone */}
              <a 
                href="tel:+573144715980" 
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-amber-50 transition-colors duration-300"
              >
                <Phone className="w-6 h-6 text-amber-600" />
                <span className="text-amber-900">+57 314 471 5980</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="mt-6 md:mt-12 text-center text-amber-700/40 font-serif text-xs md:text-sm">
          ❈ Forjado en los reinos élficos ❈
        </div>
      </div>
    </main>
  )
}