"use client"

import { User } from "lucide-react"
import { useAuth } from "./auth-provider"
import { useEffect, useState } from "react"

export function UserInfo() {
  const { isAuthenticated } = useAuth()
  const [userData, setUserData] = useState({
    name: "Emilio Aguilera",
    position: "Rector",
  })

  // Evitar bucles infinitos usando un estado para controlar si ya se cargaron los datos
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // Solo cargar datos si el usuario está autenticado y aún no se han cargado
    if (isAuthenticated && !dataLoaded) {
      console.log("UserInfo: Cargando datos del usuario")

      // Simulación de carga de datos (reemplazar con llamada API real)
      const loadUserData = async () => {
        try {
          // Aquí iría la llamada a la API para obtener datos del usuario
          // Por ahora, usamos datos estáticos
          setUserData({
            name: "Emilio Aguilera",
            position: "Rector",
          })

          // Marcar como cargados para evitar bucles
          setDataLoaded(true)
          console.log("UserInfo: Datos cargados correctamente")
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error)
          // Marcar como cargados incluso en caso de error para evitar bucles
          setDataLoaded(true)
        }
      }

      loadUserData()
    }
  }, [isAuthenticated, dataLoaded])

  return (
    <div className="border-t p-4">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
          <User className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{userData.name}</p>
          <p className="text-xs text-gray-500">{userData.position}</p>
        </div>
      </div>
    </div>
  )
}
