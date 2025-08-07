"use client";
import {
  Trash2,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export function TeacherDetailSkeleton() {
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-3 sm:px-6 py-8">
      {/* Zona 1: Información principal del docente */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-blue-100 bg-gray-200 animate-pulse"></div>
            <div className="flex flex-col items-center md:items-start">
              <div className="h-8 w-48 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
              <div className="h-6 w-36 bg-gray-200 rounded-md mb-2 animate-pulse"></div>
              <div className="h-6 w-64 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
          <Button
            disabled
            className="bg-gray-300 hover:bg-gray-300 self-start cursor-not-allowed"
          >
            {isMobile ? (
              <Trash2 className="h-5 w-5 text-gray-400" />
            ) : (
              <>
                <Trash2 className="h-5 w-5 mr-2 text-gray-400" />
                Borrar docente
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Zona 2: Datos personales */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-500" />
            Datos personales
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">
                Nombre completo:
              </span>
              <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">Edad:</span>
              <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500 mb-1">RUT:</span>
              <div className="h-6 w-32 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Zona 3: Información de contacto */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
            <Mail className="mr-2 h-5 w-5 text-blue-500" />
            Información de contacto
          </h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-blue-500 mr-3" />
              <div className="flex flex-col w-full">
                <span className="text-sm text-gray-500">
                  Correo institucional:
                </span>
                <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
              <Phone className="h-5 w-5 text-blue-500 mr-3" />
              <div className="flex flex-col w-full">
                <span className="text-sm text-gray-500">Teléfono:</span>
                <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Zona 4: Datos académicos */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
            Datos académicos
          </h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="h-5 w-5 rounded-full bg-gray-300 mr-3 animate-pulse"></div>
                <div className="flex flex-col w-full">
                  <div className="h-4 w-24 bg-gray-200 rounded-md mb-1 animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zona 5: Horario y cursos */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Horario y cursos
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="h-5 w-5 rounded-full bg-gray-300 mr-3 animate-pulse"></div>
                <div className="flex flex-col w-full">
                  <div className="h-4 w-24 bg-gray-200 rounded-md mb-1 animate-pulse"></div>
                  <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zona 6: Panel de resumen del curso */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
          <Users className="mr-2 h-5 w-5 text-blue-500" />
          Panel de resumen del curso
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-blue-300">
                <th className="px-4 py-3 text-left font-medium text-white">
                  Curso
                </th>
                <th className="px-4 py-3 text-left font-medium text-white">
                  N° de alumnos
                </th>
                <th className="px-4 py-3 text-left font-medium text-white">
                  N° de alertas activas
                </th>
                <th className="px-4 py-3 text-left font-medium text-white">
                  Última alerta ingresada
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2].map((index) => (
                <tr key={index} className="border-b-2 border-gray-100">
                  <td className="px-4 py-3">
                    <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-300 mr-2" />
                      <div className="h-6 w-8 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-6 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-300 mr-2" />
                      <div className="h-6 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Zona 7: Actividades recientes */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-blue-500" />
          Actividades recientes
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="h-6 w-20 bg-gray-200 rounded-md mr-3 animate-pulse"></div>
              <div className="h-6 w-full bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeacherDetailSkeleton;
