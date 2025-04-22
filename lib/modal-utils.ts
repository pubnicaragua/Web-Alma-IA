"use client"

import { useEffect, useState } from "react"

// Esta función ayuda a manejar correctamente el estado de los modales
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState)

  // Asegura que el modal se cierre correctamente cuando se presiona Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onToggle: () => setIsOpen(!isOpen),
  }
}
