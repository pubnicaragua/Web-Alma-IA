"use client";

import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { AddAlertModal } from "@/components/student/add-alert-modal";
import { useRouter } from "next/navigation";

interface Alert {
  alumno_alerta_id: number;
  fecha: string; // formato: "YYYY-MM-DD"
  hora: string; // formato: "HH:mm" o "HH:mm AM/PM"
  tipo: string;
  estado: string;
  prioridad: string;
  responsable: string | null;
  severidad_name: string;
}

interface Priority {
  alerta_prioridad_id: number;
  nombre: string;
}

interface State {
  alerta_estado_id: number;
  nombre_alerta_estado: string;
}

interface StudentAlertsProps {
  alerts: Alert[];
}

const PAGE_SIZE = 15;

function parseDateTime(fecha: string, hora: string): Date {
  // Intenta parsear la fecha y hora para ordenarlas correctamente
  // Soporta formatos "HH:mm" y "HH:mm AM/PM"
  let time = hora;
  let isPM = false;
  if (hora.includes("AM") || hora.includes("PM")) {
    isPM = hora.includes("PM");
    time = hora.replace(/(AM|PM)/, "").trim();
  }
  const [hourStr, minStr] = time.split(":");
  let hour = parseInt(hourStr, 10);
  const min = parseInt(minStr, 10) || 0;
  if (isPM && hour < 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  return new Date(
    `${fecha}T${hour.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}:00`
  );
}

export function StudentAlerts({ alerts: initialAlerts }: StudentAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Ordenar alertas por fecha y hora (más reciente primero)
  useEffect(() => {
    const sortedAlerts = [...initialAlerts].sort((a, b) => {
      const dateA = parseDateTime(a.fecha, a.hora);
      const dateB = parseDateTime(b.fecha, b.hora);
      return dateB.getTime() - dateA.getTime();
    });
    setAlerts(sortedAlerts);
    setCurrentPage(1); // Resetear a la primera página cuando cambian las alertas
  }, [initialAlerts, refresh]);

  useEffect(() => {
    // Simula fetch de prioridades y estados
    async function loadData() {
      try {
        const fetchedPriorities: Priority[] = [
          { alerta_prioridad_id: 1, nombre: "Baja" },
          { alerta_prioridad_id: 2, nombre: "Media" },
          { alerta_prioridad_id: 3, nombre: "Alta" },
          { alerta_prioridad_id: 4, nombre: "Crítica" },
        ];
        const fetchedStates: State[] = [
          { alerta_estado_id: 1, nombre_alerta_estado: "Pendiente" },
          { alerta_estado_id: 2, nombre_alerta_estado: "Asignada" },
          { alerta_estado_id: 3, nombre_alerta_estado: "En proceso" },
          { alerta_estado_id: 4, nombre_alerta_estado: "Resuelta" },
          { alerta_estado_id: 5, nombre_alerta_estado: "Cerrada" },
          { alerta_estado_id: 6, nombre_alerta_estado: "Anulada" },
        ];
        setPriorities(fetchedPriorities);
        setStates(fetchedStates);
      } catch (error) {
        console.error("Error cargando prioridades o estados:", error);
      }
    }
    loadData();
  }, [refresh]);

  // Paginación
  const totalPages = Math.ceil(alerts.length / PAGE_SIZE);

  const paginatedAlerts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return alerts.slice(start, start + PAGE_SIZE);
  }, [alerts, currentPage]);

  const handleAddAlert = (newAlert: {
    alumno_alerta_id: number;
    tipo: string;
    descripcion: string;
    fecha: string;
  }) => {
    const currentDate = new Date();
    const hora = `${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${currentDate.getHours() >= 12 ? "PM" : "AM"}`;

    const alert: Alert = {
      alumno_alerta_id: newAlert.alumno_alerta_id,
      fecha: newAlert.fecha,
      hora: hora,
      tipo: newAlert.tipo,
      estado: "Pendiente",
      prioridad: "Alta",
      responsable: "Enc. Convivencia",
      severidad_name: "N/A",
    };
    setAlerts((prev) => [alert, ...prev]);
    setCurrentPage(1);
  };

  const handleAlertClick = (alertId: number) => {
    router.push(`/alertas/${alertId}`);
  };

  // Badge de prioridad
  const getPriorityClass = (priorityName: string) => {
    switch (priorityName.toLowerCase()) {
      case "alta":
        return "border-red-500 text-red-500";
      case "media":
        return "border-yellow-500 text-yellow-500";
      case "baja":
        return "border-green-500 text-green-500";
      case "crítica":
        return "border-pink-600 text-pink-600";
      default:
        return "";
    }
  };

  // Badge de estado
  const getStateClass = (stateName: string) => {
    switch (stateName.toLowerCase()) {
      case "pendiente":
        return "border-red-500 text-red-500";
      case "asignada":
        return "border-yellow-500 text-yellow-500";
      case "en proceso":
        return "border-blue-500 text-blue-500";
      case "resuelta":
        return "border-green-500 text-green-500";
      case "cerrada":
        return "border-gray-500 text-gray-500";
      case "anulada":
        return "border-gray-400 text-gray-400";
      default:
        return "";
    }
  };

  // Renderiza la paginación
  const Pagination = () => (
    <div className="flex justify-center items-center gap-2 py-4">
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        disabled={currentPage === 1}
      >
        {"<"}
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={`px-3 py-1 rounded ${
            currentPage === i + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
      <button
        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
      >
        {">"}
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Alertas del alumno
        </h3>
        <AddAlertModal
          onAddAlert={handleAddAlert}
          onRefresh={() => setRefresh((v) => !v)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-x-auto border border-gray-100">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-blue-300">
              <th className="px-4 py-3 text-center font-medium text-white">
                Fecha
              </th>
              <th className="px-4 py-3 text-center font-medium text-white">
                Hora
              </th>
              <th className="px-4 py-3 text-center font-medium text-white">
                Tipo de alerta
              </th>
              <th className="px-4 py-3 text-center font-medium text-white">
                Estado
              </th>
              <th className="px-4 py-3 text-center font-medium text-white">
                Nivel de prioridad
              </th>
              <th className="px-4 py-3 text-center font-medium text-white">
                Severidad
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedAlerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  No hay alertas para mostrar.
                </td>
              </tr>
            ) : (
              paginatedAlerts.map((alert) => (
                <tr
                  key={alert.alumno_alerta_id}
                  className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleAlertClick(alert.alumno_alerta_id)}
                >
                  <td className="px-4 py-3 text-sm text-center">
                    {alert.fecha}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {alert.hora}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <div className="flex justify-center">
                      <Badge>{alert.tipo}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <Badge
                      variant="outline"
                      className={getStateClass(alert.estado)}
                    >
                      {alert.estado}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <Badge
                      variant="outline"
                      className={getPriorityClass(alert.prioridad)}
                    >
                      {alert.prioridad}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {alert.severidad_name}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación sólo si hay más de una página */}
      {totalPages > 1 && <Pagination />}
    </div>
  );
}
