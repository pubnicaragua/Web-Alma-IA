import type React from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-400 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mt-12 mb-8">
        <Link href="/" className="flex items-center">
          <div className="h-16 w-auto">
            {/* Usando img estándar en lugar de Image para evitar errores */}
            <img
              src="/almaiaa.svg"
              alt="AlmaIA Logo"
              className="h-full w-auto"
              style={{ filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))" }}
            />
          </div>
        </Link>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-md px-4">{children}</div>
      </div>
    </div>
  )
}
