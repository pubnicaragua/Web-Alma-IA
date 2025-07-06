"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AddAlertModal } from "@/components/student/add-alert-modal";
import { useRouter } from "next/navigation"; // Importar useRouter
import Image from "next/image";

interface Alert {
  alumno_alerta_id: number; // Asegúrate de que la alerta tenga un ID para la navegación
  fecha: string;
  hora: string;
  tipo: string;
  estado: string;
  prioridad: string;
  responsable: string;
  // Agrega aquí cualquier otro campo necesario para mostrar en la tabla
}

interface StudentAlertsProps {
  alerts: Alert[];
}

export function StudentAlerts({ alerts: initialAlerts }: StudentAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const router = useRouter(); // Inicializar useRouter

  const handleAddAlert = (newAlert: {
    alumno_alerta_id: number;
    tipo: string;
    descripcion: string;
    fecha: string;
  }) => {
    // En un caso real, aquí se enviaría la alerta al servidor
    // y luego se actualizaría el estado con la respuesta

    // Para este ejemplo, creamos una nueva alerta con datos simulados
    const currentDate = new Date();
    const hora = `${currentDate
      .getHours()
      .toString()
      .padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${currentDate.getHours() >= 12 ? "PM" : "AM"}`;

    const alert: Alert = {
      alumno_alerta_id: newAlert.alumno_alerta_id, // Asignar un ID simulado
      fecha: newAlert.fecha,
      hora: hora,
      tipo: newAlert.tipo,
      estado: "Pendiente",
      prioridad: "Alta",
      responsable: "Enc. Convivencia",
    };
    setAlerts([alert, ...alerts]);
  };

  // Nueva función para manejar el clic en la fila de la alerta
  const handleAlertClick = (alertId: string) => {
    console.log(alertId);
    router.push(`/alertas/${alertId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Alertas del alumno
        </h3>
        <AddAlertModal onAddAlert={handleAddAlert} />
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
                Responsable actual
              </th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" // Añadir cursor-pointer
                onClick={() => handleAlertClick(alert.alumno_alerta_id)} // Añadir onClick
              >
                <td className="px-4 py-3 text-sm text-center">{alert.fecha}</td>
                <td className="px-4 py-3 text-sm text-center">{alert.hora}</td>
                <td className="px-4 py-3 text-sm text-center">
                  <div className="flex justify-center">
                    <Badge
                      className={
                        alert.tipo === "SOS Alma"
                          ? "bg-red-500"
                          : alert.tipo === "Alerta amarilla"
                          ? "bg-yellow-400"
                          : alert.tipo === "Alerta Naranja"
                          ? "bg-orange-500"
                          : alert.tipo === "Denuncia"
                          ? "bg-purple-600"
                          : ""
                      }
                    >
                      {alert.tipo}
                    </Badge>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <Badge
                    variant="outline"
                    className={
                      alert.estado === "Pendiente"
                        ? "border-red-500 text-red-500"
                        : alert.estado === "En curso"
                        ? "border-blue-500 text-blue-500"
                        : "border-green-500 text-green-500"
                    }
                  >
                    {alert.estado}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <Badge
                    variant="outline"
                    className={
                      alert.prioridad === "Alta"
                        ? "border-red-500 text-red-500"
                        : alert.prioridad === "Media"
                        ? "border-yellow-500 text-yellow-500"
                        : "border-green-500 text-green-500"
                    }
                  >
                    {alert.prioridad}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  {alert.responsable !== undefined
                    ? "Sin responsable"
                    : alert.responsable}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
