import type React from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-400 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mt-12 mb-8">
        <Link href="/" className="text-5xl font-bold text-white">
          Alma<span className="text-pink-400">IA</span>
        </Link>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-md px-4">{children}</div>
      </div>
    </div>
  )
}
