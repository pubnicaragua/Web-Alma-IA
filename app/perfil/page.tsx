import Image from "next/image"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ProfileSection } from "@/components/profile-section"
import { ProfileField } from "@/components/profile-field"
import { PermissionItem } from "@/components/permission-item"
import { PermissionAction } from "@/components/permission-action"
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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={() => {}} />
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                <Image
                  src="/confident-businessman.png"
                  alt={userData.name}
                  width={128}
                  height={128}
                  className="object-cover"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
              <p className="text-xl text-gray-600">{userData.position}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileSection title="Datos personales">
                <ProfileField label="Nombre completo" value={userData.fullName} />
                <ProfileField label="Edad" value={`${userData.age} años`} />
                <ProfileField label="RUT" value={userData.rut} />
              </ProfileSection>

              <ProfileSection title="Información de contacto">
                <ProfileField label="Correo institucional" value={userData.email} />
                <ProfileField label="Teléfono" value={userData.phone} />
              </ProfileSection>
            </div>

            <ProfileSection title="Datos académicos">
              <ProfileField label="Rol institucional" value={userData.role} />
              <ProfileField label="Colegio" value={userData.school} />
              <ProfileField label="Fecha de registro" value={userData.registrationDate} />
            </ProfileSection>

            <ProfileSection title="Permisos y accesos del sistema">
              {permissions.map((permission, index) => (
                <PermissionItem key={index} title={permission} />
              ))}
              {actions.map((action, index) => (
                <PermissionAction key={index} title={action} />
              ))}
            </ProfileSection>

            <div className="mt-8">
              <Button className="w-full bg-blue-500 hover:bg-blue-600">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
