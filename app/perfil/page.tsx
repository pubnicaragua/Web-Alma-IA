import Image from "next/image"
import { AppLayout } from "@/components/layout/app-layout"
import { ProfileField } from "@/components/profile-field"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function ProfilePage() {
  // Datos del usuario
  const userData = {
    name: "Emilio Aguilera",
    position: "Rector",
    fullName: "Emilio Andrés Aguilera Silva",
    age: 28,
    rut: "19.345.876-2",
    email: "eaguilera@colegiohorizonte.cl",
    phone: "+56 9 7654 3210",
    role: "Director General",
    school: "Santiago Apostol",
    registrationDate: "08/03/2023",
  }

  // Lista de permisos
  const permissions = [
    "Ver alertas activas de todos los cursos",
    "Acceder a seguimientos hechos por psicólogos o docentes",
    "Descargar reportes generales",
    "Visualizar estadísticas generales",
    "Eliminar o agregar docente",
  ]

  // Lista de acciones
  const actions = [
    "Agregar o editar preguntas para alumnos",
    "Generar alertas o intervenciones",
    "Ver respuestas de alumnos por curso",
    "Modificar datos de otros usuarios",
  ]

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        {/* Zona 1: Información de perfil principal */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden mb-4 flex-shrink-0 border-4 border-blue-100">
              <Image
                src="/confident-businessman.png"
                alt={userData.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
              <p className="text-xl text-gray-600 mb-2">{userData.position}</p>
              <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {userData.role}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Zona 2: Datos personales */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Datos personales</h2>
            <div className="space-y-4">
              <ProfileField label="Nombre completo" value={userData.fullName} />
              <ProfileField label="Edad" value={`${userData.age} años`} />
              <ProfileField label="RUT" value={userData.rut} />
            </div>
          </div>

          {/* Zona 3: Información de contacto */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Información de contacto
            </h2>
            <div className="space-y-4">
              <ProfileField label="Correo institucional" value={userData.email} />
              <ProfileField label="Teléfono" value={userData.phone} />
            </div>
          </div>
        </div>

        {/* Zona 4: Datos académicos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Datos académicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Rol institucional</h3>
              <p className="font-medium">{userData.role}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Colegio</h3>
              <p className="font-medium">{userData.school}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Fecha de registro</h3>
              <p className="font-medium">{userData.registrationDate}</p>
            </div>
          </div>
        </div>

        {/* Zona 5: Permisos y accesos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Permisos */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Permisos del sistema</h2>
            <div className="space-y-1">
              {permissions.map((permission, index) => (
                <div key={index} className="bg-green-50 p-3 rounded-md mb-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-800">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">Acciones disponibles</h2>
            <div className="space-y-1">
              {actions.map((action, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-md mb-2 flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-800">{action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zona 6: Botón de cerrar sesión */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
          <Button className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-lg">
            <LogOut className="mr-2 h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </AppLayout>
  )
}
