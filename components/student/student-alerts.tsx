"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AddAlertModal } from "@/components/student/add-alert-modal";
import { useRouter } from "next/navigation";

interface Alert {
  alumno_alerta_id: number;
  fecha: string; // formato "DD/MM/YYYY"
  hora: string; // formato "HH:mm"
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
  setRefresh: () => void;
}

export function StudentAlerts({
  alerts: initialAlerts,
  setRefresh,
}: StudentAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const router = useRouter();

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
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
  }, []);

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
      .padStart(2, "0")}`;

    const alert: Alert = {
      alumno_alerta_id: newAlert.alumno_alerta_id,
      fecha: newAlert.fecha,
      hora: hora,
      tipo: newAlert.tipo,
      estado: "Pendiente",
      prioridad: "Alta",
      responsable: "Enc. Convivencia",
      severidad_name: "",
    };
    setAlerts((prev) => [alert, ...prev]);
    setCurrentPage(1);
  };

  const handleAlertClick = (alertId: number) => {
    router.push(`/alertas/${alertId}`);
  };

  const getPriorityClass = (priorityName: string) => {
    switch (priorityName.toLowerCase()) {
      case "alta":
        return "border-red-500 text-red-500";
      case "media":
        return "border-yellow-500 text-yellow-500";
      case "baja":
        return "border-green-500 text-green-500";
      case "crítica":
      case "critica": // para evitar problemas con mayúsculas/minúsculas
        return "border-pink-600 text-pink-600";
      default:
        return "";
    }
  };

  const getPrioritySeverity = (priorityName: string) => {
    switch (priorityName.toLowerCase()) {
      case "alta":
        return "border-red-500 text-red-500";
      case "media":
        return "border-yellow-500 text-yellow-500";
      case "baja":
        return "border-green-500 text-green-500";
      case "crítica":
      case "critica": // para evitar problemas con mayúsculas/minúsculas
        return "border-pink-600 text-pink-600";
      default:
        return "";
    }
  };

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

  // Función para convertir fecha y hora a Date
  const parseDateTime = (fecha: string, hora: string): Date => {
    // fecha: "DD/MM/YYYY"
    // hora: "HH:mm"
    const [day, month, year] = fecha.split("/").map(Number);
    const [hours, minutes] = hora.split(":").map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  };

  // Ordenar alertas por fecha y hora descendente (más reciente primero)
  const sortedAlerts = [...alerts].sort((a, b) => {
    const dateA = parseDateTime(a.fecha, a.hora);
    const dateB = parseDateTime(b.fecha, b.hora);
    return dateB.getTime() - dateA.getTime();
  });

  // Calcular índices para paginación
  const totalPages = Math.ceil(sortedAlerts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAlerts = sortedAlerts.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Alertas del alumno
        </h3>
        <AddAlertModal onAddAlert={handleAddAlert} onRefresh={setRefresh} />
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
            {currentAlerts.map((alert) => (
              <tr
                key={alert.alumno_alerta_id}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleAlertClick(alert.alumno_alerta_id)}
              >
                <td className="px-4 py-3 text-sm text-center">{alert.fecha}</td>
                <td className="px-4 py-3 text-sm text-center">{alert.hora}</td>
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
                  <Badge
                    variant="outline"
                    className={getPrioritySeverity(alert.severidad_name)}
                  >
                    {alert.severidad_name}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
      <div className="flex justify-center items-center space-x-2 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${
            currentPage === 1
              ? "cursor-not-allowed border-gray-300 text-gray-300"
              : "border-blue-500 text-blue-500 hover:bg-blue-100"
          }`}
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .slice(
            Math.max(0, currentPage - 3),
            Math.min(totalPages, currentPage + 2)
          )
          .map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded border ${
                page === currentPage
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-blue-500 text-blue-500 hover:bg-blue-100"
              }`}
            >
              {page}
            </button>
          ))}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${
            currentPage === totalPages || totalPages === 0
              ? "cursor-not-allowed border-gray-300 text-gray-300"
              : "border-blue-500 text-blue-500 hover:bg-blue-100"
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
