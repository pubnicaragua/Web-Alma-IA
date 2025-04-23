"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Función para verificar si la pantalla es de tamaño móvil
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar inicialmente
    checkIsMobile()

    // Agregar listener para cambios de tamaño de ventana
    window.addEventListener("resize", checkIsMobile)

    // Limpiar listener
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}
