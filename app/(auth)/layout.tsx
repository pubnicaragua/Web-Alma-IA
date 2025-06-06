import type React from "react"
import Image from "next/image"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-blue-400 flex flex-col">
      {/* Logo */}
      <div className="flex justify-center mt-12 mb-8">
        <div className="h-10 w-auto mr-2">
          <Image src="/logotipo.png" alt="AlmaIA Logo" width={128} height={40} className="h-full w-auto" />
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex justify-center items-start">
        <div className="w-full max-w-md px-4">{children}</div>
      </div>
    </div>
  )
}
