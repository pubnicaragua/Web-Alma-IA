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
  emotions : {
  'Alegría': "#FFD700",            // Dorado
  'Tranquilidad': "#ADD8E6",       // Celeste
  'Orgullo': "#800080",            // Púrpura
  'Gratitud': "#FFB6C1",           // Rosa claro
  'Amor': "#FF0000",               // Rojo
  'Esperanza': "#32CD32",          // Verde lima
  'Sorpresa': "#FFA500",           // Naranja
  'Confusión': "#D3D3D3",          // Gris claro
  'Indiferencia': "#A9A9A9",       // Gris oscuro
  'Miedo': "#4B0082",              // Índigo
  'Tristeza': "#1E90FF",           // Azul profundo
  'Enojo': "#8B0000",              // Rojo oscuro
  'Frustración': "#B22222",        // Fuego
  'Ansiedad': "#FF4500",           // Naranja rojizo
  'Vergüenza': "#FFC0CB",          // Rosa
  'Celos': "#006400",              // Verde oscuro
  'Agobio': "#800000",             // Marrón rojizo
  'Inseguridad': "#708090",        // Gris azulado
  'Desesperanza': "#2F4F4F",       // Gris muy oscuro
  'Culpa': "#8B4513",              // Marrón oscuro
  'Estrés': "#DC143C",             // Carmesí
  'Aburrimiento': "#C0C0C0"        // Plateado
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
