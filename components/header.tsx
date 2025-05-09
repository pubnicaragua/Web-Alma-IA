"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Search, Bell, X } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isMobile = useMobile()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="h-10 w-auto mr-2">
              <img src="/almaiaa.svg" alt="AlmaIA Logo" className="h-full w-auto" />
            </div>
          </Link>

          {/* Barra de búsqueda (escritorio) */}
          {!isMobile && !isSearchOpen && (
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          )}

          {/* Barra de búsqueda expandida (móvil) */}
          {isMobile && isSearchOpen && (
            <div className="absolute inset-0 bg-white p-4 flex items-center z-50">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button onClick={() => setIsSearchOpen(false)} className="ml-2 p-2 text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Iconos de acción */}
          <div className="flex items-center">
            {isMobile && !isSearchOpen && (
              <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-500 hover:text-gray-700">
                <Search className="h-5 w-5" />
              </button>
            )}

            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {isMobile && (
              <button className="p-2 ml-1 text-gray-500 hover:text-gray-700 md:hidden">
                <Menu className="h-5 w-5" />
              </button>
            )}

            {/* Avatar de usuario */}
            <div className="ml-4 relative">
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                EA
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
