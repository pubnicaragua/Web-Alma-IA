// Evento personalizado para cambios en la autenticación
export const AUTH_CHANGE_EVENT = "auth-change"

// Función para disparar el evento de cambio de autenticación
export const dispatchAuthChangeEvent = (isAuthenticated: boolean) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent(AUTH_CHANGE_EVENT, {
      detail: { isAuthenticated },
    })
    window.dispatchEvent(event)
    console.log(`Auth event dispatched: isAuthenticated = ${isAuthenticated}`)
  }
}

// Tipo para el callback del evento de autenticación
type AuthChangeCallback = (isAuthenticated: boolean) => void

// Función para suscribirse al evento de cambio de autenticación
export const subscribeToAuthChanges = (callback: AuthChangeCallback): (() => void) => {
  if (typeof window !== "undefined") {
    const handler = (event: Event) => {
      const authEvent = event as CustomEvent
      callback(authEvent.detail.isAuthenticated)
    }

    window.addEventListener(AUTH_CHANGE_EVENT, handler)

    // Devolver función para cancelar la suscripción
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handler)
    }
  }

  // Si no estamos en el navegador, devolver una función vacía
  return () => {}
}
