"use client"

import type React from "react"

// Este componente ahora simplemente renderiza sus hijos sin verificación
export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  console.log("ProtectedRoute: Renderizando sin verificación de autenticación")

  // Simplemente renderizar los hijos sin verificación
  return <>{children}</>
}
