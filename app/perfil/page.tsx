"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AppLayout } from "@/components/layout/app-layout";
import { ProfileField } from "@/components/profile-field";
import { Button } from "@/components/ui/button";
import { LogOut, AlertCircle, Edit } from "lucide-react";
import { useAuth } from "@/middleware/auth-provider";
import {
  fetchUserProfile,
  type ProfileResponse,
  updateProfile,
  type ProfileData,
} from "@/services/profile-service";
import { ProfileSkeleton } from "@/components/profile-skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";
import { EditProfileModal } from "@/components/profile/edit-profile-modal";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refrehs, setRefresh] = useState(false);
  const { logout } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfileData() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserProfile();
        setProfileData(data);
      } catch (err) {
        setError(
          "No se pudieron cargar los datos del perfil. Por favor, intenta de nuevo más tarde."
        );

        // Mostrar toast de error
        toast({
          title: "Error al cargar perfil",
          description:
            "No se pudieron cargar los datos del perfil. Se están mostrando datos de ejemplo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfileData();
  }, [toast, refrehs]);

  const handleLogout = () => logout();

  const handleSaveProfile = async (data: ProfileData): Promise<void> => {
    if (!profileData?.usuario.usuario_id) {
      throw new Error("No se pudo identificar al usuario");
    }

    try {
      await updateProfile(profileData?.usuario.usuario_id, data);
      const profile = await fetchUserProfile();
      setProfileData(profile);
      //cerrar el modal
      setIsEditModalOpen(false);

      // Mostrar mensaje de éxito
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios se han guardado correctamente.",
      });
    } catch (error) {
      //cerrar el modal
      setIsEditModalOpen(false);
      toast({
        title: "Error",
        description:
          "No se pudo actualizar el perfil. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getFormDataFromProfile = (): ProfileData => {
    if (!profileData) {
      return {
        nombre_social: "",
        email: "",
        encripted_password: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        numero_documento: "",
        telefono_contacto: "",
        url_foto_perfil: "",
      } as ProfileData;
    }

    return {
      nombre_social: profileData.usuario?.nombre_social || "",
      email: profileData.usuario?.email,
      encripted_password: profileData.usuario?.encripted_password,
      nombres: profileData.persona?.nombres,
      apellidos: profileData.persona?.apellidos,
      fecha_nacimiento: profileData.persona?.fecha_nacimiento || "",
      numero_documento: profileData.persona?.numero_documento,
      telefono_contacto: profileData.usuario?.telefono_contacto || "",
      url_foto_perfil: profileData.usuario?.url_foto_perfil || "",
    } as ProfileData;
  };

  // Calcular edad a partir de la fecha de nacimiento
  const calculateAge = (birthDateString: string): number | null => {
    try {
      if (!birthDateString) return 0;

      const birthDate = new Date(birthDateString);

      // Verificar si la fecha es válida
      if (isNaN(birthDate.getTime())) {
        return 0;
      }

      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    } catch (error) {
      return 0;
    }
  };

  // Mostrar skeleton mientras se cargan los datos
  if (loading) {
    return (
      <AppLayout>
        <ProfileSkeleton />
      </AppLayout>
    );
  }

  // Si no hay datos, mostrar mensaje de error
  if (!profileData) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Error al cargar el perfil
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "No se pudieron cargar los datos del perfil."}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Intentar de nuevo
          </Button>
        </div>
      </AppLayout>
    );
  }

  const { usuario, persona, rol, funcionalidades } = profileData;

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        {/* Zona 1: Información de perfil principal */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 flex-shrink-0 border-4 border-blue-100">
              <Image
                src={usuario?.url_foto_perfil || "/confident-businessman.png"}
                alt={`${persona?.nombres} ${persona?.apellidos}`}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                aria-label="Editar foto de perfil"
              >
                <Edit className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center md:items-start">
              <div className="w-full flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {`${persona?.nombres} ${persona?.apellidos}`}
                      {usuario?.nombre_social && ` (${usuario.nombre_social})`}
                    </h1>
                  </div>
                  <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mt-1">
                    {rol?.nombre}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-4"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar perfil
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Zona 2: Datos personales */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Datos personales
            </h2>
            <div className="space-y-4">
              <ProfileField
                label="Nombre completo"
                value={`${persona?.nombres} ${persona?.apellidos}`}
              />
              <ProfileField
                label="Edad"
                value={`${calculateAge(persona?.fecha_nacimiento)} años`}
              />
              <ProfileField
                label={persona?.tipo_documento}
                value={persona?.numero_documento}
              />
            </div>
          </div>

          {/* Zona 3: Información de contacto */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Información de contacto
            </h2>
            <div className="space-y-4">
              <ProfileField
                label="Correo institucional"
                value={usuario?.email}
              />
              <ProfileField
                label="Teléfono"
                value={usuario?.telefono_contacto}
              />
            </div>
          </div>
        </div>

        {/* Zona 4: Datos académicos */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
            Datos del sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Rol institucional</h3>
              <p className="font-medium">{rol?.nombre}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">Estado</h3>
              <p className="font-medium">
                {usuario?.estado_usuario || "No disponible"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm text-gray-500 mb-1">
                Último inicio de sesión
              </h3>
              <p className="font-medium">
                {formatDate(usuario?.ultimo_inicio_sesion)}
              </p>
            </div>
          </div>
        </div>

        {/* Zona 5: Permisos y accesos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Permisos */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Funcionalidades
            </h2>
            <div className="space-y-1">
              {funcionalidades && funcionalidades?.length > 0 ? (
                funcionalidades.map((funcionalidad) => (
                  <div
                    key={funcionalidad.funcionalidad_id}
                    className="bg-green-50 p-3 rounded-md mb-2 flex items-center"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-800">
                      {funcionalidad.nombre}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <p className="text-gray-600 text-center">
                    No hay funcionalidades asignadas a este rol
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">
              Descripción del rol
            </h2>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-gray-800">{rol?.descripcion}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-medium text-gray-700 mb-2">
                Información adicional
              </h3>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600">
                  Fecha de creación: {formatDate(rol?.fecha_creacion)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Zona 6: Botón de cerrar sesión */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-blue-200">
          <Button
            onClick={handleLogout}
            className="w-full bg-blue-500 hover:bg-blue-600 py-6 text-lg"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Cerrar sesión
          </Button>
        </div>
      </div>

      {/* Modal de edición de perfil */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profileData={getFormDataFromProfile()}
        onSave={handleSaveProfile}
        onRefresh={() => setRefresh(!refrehs)}
      />
    </AppLayout>
  );
}
