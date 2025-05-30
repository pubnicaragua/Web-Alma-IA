import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Fecha no disponible'
  
  try {
    const date = new Date(dateString)
    
    // Verificar si la fecha es válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida'
    }
    
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date)
  } catch (error) {
    console.error("Error al formear fecha:", error, "Fecha recibida:", dateString)
    return 'Fecha inválida'
  }
}

/**
 * Compara dos cadenas sin distinguir entre mayúsculas y minúsculas
 * @param str1 Primera cadena a comparar
 * @param str2 Segunda cadena a comparar
 * @returns `true` si las cadenas son iguales ignorando mayúsculas/minúsculas, `false` en caso contrario
 */
export function equalsIgnoreCase(str1: string, str2: string): boolean {
  if (str1 === str2) return true
  if (!str1 || !str2) return false
  return str1.localeCompare(str2, undefined, { sensitivity: 'accent' }) === 0
}
