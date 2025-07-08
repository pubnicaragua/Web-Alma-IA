"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { AddAlertModal } from "@/components/student/add-alert-modal";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Alert {
  alumno_alerta_id: number;
  fecha: string;
  hora: string;
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

export function StudentAlerts({ alerts: initialAlerts }: StudentAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Cargar prioridades y estados (simula fetch o usa tu servicio)
    async function loadData() {
      try {
        // Aquí deberías llamar a tus servicios fetchPrority y fetchStates
        // Por ejemplo:
        // const fetchedPriorities = await fetchPrority();
        // const fetchedStates = await fetchStates();

        // Para ejemplo, uso los datos estáticos que diste:
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
    };
    setAlerts((prev) => [alert, ...prev]);
  };

  const handleAlertClick = (alertId: number) => {
    router.push(`/alertas/${alertId}`);
  };

  // Función para obtener clase de badge según prioridad
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

  // Función para obtener clase de badge según estado
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Alertas del alumno
        </h3>
        <AddAlertModal
          onAddAlert={handleAddAlert}
          onRefresh={() => setRefresh(!refresh)}
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
              <th
                className="px-4 py-3 text-center font-medium text-white"
                onClick={() => console.log(alerts)}
              >
                Severidad
              </th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
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
                  {alert.severidad_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
