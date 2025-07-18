"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Bell, Users } from "lucide-react";
import { Header } from "@/components/header";
import { loadSchoolsByUsuario_id } from "@/services/school-service";
import { Skeleton } from "@/components/ui/skeleton";
import { SchoolCardSkeleton } from "@/components/school-card-skeleton";
import { fetchUserProfile } from "@/services/profile-service";
import { getPowerUsers } from "@/services/alerts-service";
import { AppLayout } from "@/components/layout/app-layout";

interface School {
  id: string;
  name: string;
  alerts: number;
  students: number;
  color: string;
}

export default function SelectSchoolPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    // Comprobar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (isAuthenticated !== "true") {
      // Si no está autenticado, redirigir al login
      router.push("/login");
      return;
    }

    // Cargar colegios
    loadAllSchools();
  }, [router]);

  const loadAllSchools = async () => {
    try {
      // Cargar power users
      let powerUsers = await getPowerUsers();
      localStorage.setItem("powerUsers", JSON.stringify(powerUsers));
      setIsLoading(true);
      const profile = await fetchUserProfile();
      const schools = await loadSchoolsByUsuario_id(profile.usuario.usuario_id);
      setSchools(schools);
    } catch (error) {
      // Mostrar mensaje de error al usuario
      setError(
        "No se pudieron cargar los colegios. Por favor, intente nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSchool = (schoolId: string) => {
    // Guardar el colegio seleccionado
    localStorage.setItem("selectedSchool", schoolId);

    // Redirigir al dashboard
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 px-2 sm:px-6 py-4 sm:py-8">
          <div className="container mx-auto">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <SchoolCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppLayout isOpen={true}>
      <div className="min-h-screen flex flex-col bg-white">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 px-2 sm:px-6 py-4 sm:py-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Seleccionar colegio
            </h2>

            <div className="space-y-4">
              {schools.length > 0 ? (
                schools.map((school) => (
                  <button
                    key={school.id}
                    className="w-full bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between border border-gray-100 relative overflow-hidden"
                    onClick={() => handleSelectSchool(school.id)}
                  >
                    <div className="flex items-center mb-3 sm:mb-0 w-full sm:w-auto">
                      <div className="bg-gray-100 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4">
                        <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-800">
                        {school.name}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 sm:gap-0 sm:flex-nowrap sm:items-center sm:space-x-6 w-full sm:w-auto">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          {school.alerts} alertas
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          {school.students} alumnos
                        </span>
                      </div>
                    </div>

                    {/* Barra de color */}
                    <div
                      className={`absolute right-0 top-0 bottom-0 w-2 ${school.color}`}
                    ></div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-700 mb-4">
                    No se encontraron colegios
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
