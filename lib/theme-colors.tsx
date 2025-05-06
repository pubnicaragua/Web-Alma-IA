"use client"

import { createContext, useContext, type ReactNode } from "react"

// Definición de colores más vivos y llamativos
export const themeColors = {
  primary: {
    light: "#8ac5ff",
    main: "#4299ff",
    dark: "#0d6efd",
  },
  secondary: {
    light: "#ff9db9",
    main: "#ff6b9d",
    dark: "#e6417a",
  },
  background: {
    main: "#f8f9fa",
    blue: "#4299ff",
  },
  chart: {
    blue: "#59a8ff",
    yellow: "#ffcc45",
    pink: "#ff9db9",
    orange: "#ff9d4d",
    red: "#ff3a47",
    gray: "#6c757d",
    green: "#22dd65",
    purple: "#c353ff",
  },
  status: {
    success: "#22dd65",
    warning: "#ffcc45",
    danger: "#ff3a47",
    info: "#59a8ff",
  },
  text: {
    primary: "#212529",
    secondary: "#6c757d",
    light: "#ffffff",
  },
  border: {
    light: "#d1e6ff",
    main: "#90c2ff",
    dark: "#4299ff",
  },
}

// Crear el contexto
const ThemeColorsContext = createContext(themeColors)

// Proveedor del contexto
export function ThemeColorsProvider({ children }: { children: ReactNode }) {
  return <ThemeColorsContext.Provider value={themeColors}>{children}</ThemeColorsContext.Provider>
}

// Hook para usar los colores
export function useThemeColors() {
  return useContext(ThemeColorsContext)
}
