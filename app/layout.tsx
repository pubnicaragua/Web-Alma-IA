import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeColorsProvider } from "@/lib/theme-colors"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"
import { SessionTimeout } from "@/components/session-timeout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Alma IA",
  description: "Plataforma de gestión educativa con inteligencia artificial",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <ThemeColorsProvider>
            <AuthProvider>
              {children}
              <Toaster />
              <SessionTimeout />
            </AuthProvider>
          </ThemeColorsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
