"use client";

import { AddActionModal } from "@/components/alerts/add-action-modal";
import { AlertDetailSkeleton } from "@/components/alerts/alert-detail-skeleton";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  changeLeida,
  fetchAlertById,
  fetchAlertBitacoras,
  type BitacoraResponse,
} from "@/services/alerts-service";
import { ArrowLeft, Lock } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EditAlertModal } from "@/components/edit-alert-modal";
import { hasSearchParam } from "@/lib/search-params";
import { AlertPagev1 } from "@/services/alerts-service";

export default function AlertDetailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [alert, setAlert] = useState<AlertPagev1 | null>(null);
  const [bitacoras, setBitacoras] = useState<BitacoraResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const loadAlert = useCallback(
    async (id: number) => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchAlertById(id);

        if (hasSearchParam(searchParams, "notifications")) {
          try {
            await changeLeida(id);
          } catch (error) {
            console.log("Error al marcar alerta como leida", error);
          }
        }
        setAlert(data);
        await loadAlertBitacoras(id);
      } catch (err) {
        setError(
          (err as Error).message || "error en la petición intente más tarde"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [searchParams]
  );

  const loadAlertBitacoras = async (alertaId: number) => {
    try {
      const bitacorasData = await fetchAlertBitacoras(alertaId);
      setBitacoras(bitacorasData);
    } catch {
      setBitacoras([]);
    }
  };

  useEffect(() => {
    if (id) {
      loadAlert(Number(id));
    }
  }, [id, loadAlert, refresh]);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async (data: any) => {
    if (!alert) return;

    try {
      await loadAlert(alert.id);
      setIsEditModalOpen(false);
    } catch {}
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES");
  };

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <AppLayout>
        <AlertDetailSkeleton />
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-xl text-gray-500">{error}</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      {alert ? (
        <AppLayout>
          <div className="container mx-auto px-3 sm:px-6 py-8">
            <div className="mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoBack}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </div>

            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Información del Alumno
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alert && (
                  <div className="flex items-center">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mr-6 flex-shrink-0">
                      <Image
                        src={alert.alumno.imagen}
                        alt={alert.alumno.nombre}
                        fill
                        sizes="96px"
                        className={`object-cover ${
                          alert.anonimo ? "blur-xl" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">
                        {alert.anonimo ? "Anonimo" : alert.alumno.nombre}
                      </h1>
                      <p className="text-sm text-gray-500">
                        Fecha de generación: {alert.fecha_generada}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="flex justify-end w-full space-y-0 pb-2"></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Responsable Actual:
                  </h3>
                  <div className="flex items-center">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                      <Image
                        src={alert.responsable.imagen.trim()}
                        alt={alert.responsable.nombre.trim()}
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <span className="text-gray-700">
                      {alert.responsable.nombre.trim() || "No disponible"}
                    </span>
                  </div>
                  {!alert.anonimo && (
                    <div className="flex items-center mt-2 text-gray-600">
                      <Lock className="h-4 w-4 mr-1" />
                      <span className="text-sm">No es anónimo</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Descripción de la alerta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Origen</p>
                      <p className="text-base font-medium text-gray-800">
                        {alert.origen}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tipo</p>
                      <p className="text-base font-medium text-gray-800">
                        {alert.tipo}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prioridad</p>
                      <p className="text-base font-medium ">
                        {alert.prioridad}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Severidad</p>
                      <p className="text-base font-medium ">
                        {alert.severidad}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Mensaje</p>

                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">
                    {alert.descripcion}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Bitácora de acciones</CardTitle>
                <AddActionModal
                  alertData={alert}
                  setRefresh={() => setRefresh(!refresh)}
                />
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="bg-blue-300">
                        <th className="px-4 py-3 text-left font-medium text-white">
                          Fecha Realización
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-white">
                          Hora
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-white">
                          Usuario Responsable
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-white">
                          Acción Realizada
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-white">
                          Fecha de Compromiso
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-white">
                          Estado Seguimiento
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-white">
                          Archivo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {bitacoras.length > 0 ? (
                        bitacoras.map((bitacora) => (
                          <tr
                            key={bitacora.alumno_alerta_bitacora_id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="px-4 py-3 text-sm">
                              {formatDate(bitacora.fecha_realizacion) !== "-"
                                ? formatDate(bitacora.fecha_realizacion)
                                : formatDate(bitacora.fecha_compromiso)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatTime(bitacora.fecha_realizacion)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {bitacora.observaciones || "-"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {bitacora.plan_accion}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {formatDate(bitacora.fecha_compromiso)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {bitacora.estado_seguimiento}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {bitacora.url_archivo ? (
                                <a
                                  href={bitacora.url_archivo}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  Ver archivo
                                </a>
                              ) : (
                                "-"
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-6 text-center text-gray-500"
                          >
                            No hay acciones registradas para esta alerta
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          <EditAlertModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            alert={alert}
            onSave={handleSaveChanges}
          />
        </AppLayout>
      ) : null}
    </>
  );
}
