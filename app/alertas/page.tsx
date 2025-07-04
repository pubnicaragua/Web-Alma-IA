"use client";
import { DataTable } from "@/components/data-table";
import { FilterDropdown } from "@/components/filter-dropdown";
import { AppLayout } from "@/components/layout/app-layout";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  type Alert,
  fetchAlerts,
  getPowerUsers,
  fetchStates, // <-- Importar la función para obtener estados
} from "@/services/alerts-service";
import { getSearchParam } from "@/lib/search-params";
import { DatePicker } from "@/components/ui/date-picker";
import { AlertBadge } from "@/components/alerts/alert-badge";
import { StudentCell } from "@/components/alerts/student-cell";
import { LoadingState } from "@/components/alerts/loading-state";
import { ErrorState } from "@/components/alerts/error-state";
import { NoResults } from "@/components/alerts/no-results";

export default function AlertsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("Todos");
  const [priorityFilter, setPriorityFilter] = useState<string>("Todos");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [dateFilter, setDateFilter] = useState<string>("Todos");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [horaFilter, setHoraFilter] = useState<string>();
  const [currentPage, setCurrentPage] = useState(1);

  // Nuevo estado para almacenar los estados de alerta desde la BD
  const [alertStates, setAlertStates] = useState<
    { alerta_estado_id: number; nombre_alerta_estado: string }[]
  >([]);

  useEffect(() => {
    selectByDefaul();

    const loadAlertsAndStates = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar alertas
        let data = await fetchAlerts();

        // Cargar power users
        let powerUsers = await getPowerUsers();
        localStorage.setItem("powerUsers", JSON.stringify(powerUsers));

        // Cargar estados desde la base de datos
        const statesData = await fetchStates();
        setAlertStates(statesData);

        // Filtrar por notificaciones si aplica
        const params = getSearchParam(searchParams, "notifications");
        if (params) {
          data = data.filter((alert) => alert.status === "Pendiente");
        }

        setAlerts(data);
      } catch (err) {
        console.error("Error al cargar alertas:", err);
        setError("No se pudieron cargar las alertas. Intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAlertsAndStates();
  }, []);

  const selectByDefaul = () => {
    switch (localStorage.getItem("selectedTab")) {
      case "Denuncias":
        setTypeFilter("Denuncias");
        break;
      case "SOS Alma":
        setTypeFilter("SOS Alma");
        break;
      case "Alertas Alma":
        setTypeFilter("Amarilla");
        break;
      default:
        setTypeFilter("Todos");
        break;
    }
  };

  const getUniqueValues = (key: keyof Alert): string[] => {
    const values = alerts
      .map((alert) => {
        const value = alert[key];
        if (value === undefined || value === null) return null;
        return String(value);
      })
      .filter((value): value is string => value !== null);

    const uniqueValues = Array.from(new Set(values)).sort();
    return ["Todos", ...uniqueValues];
  };

  const typeOptions = getUniqueValues("type");
  const priorityOptions = getUniqueValues("priority");
  // Cambiamos statusOptions para que venga de alertStates con el nombre de estado
  const statusOptions = [
    "Todos",
    ...alertStates.map((s) => s.nombre_alerta_estado),
  ];
  const dateOptions = ["Todos", "Hoy", "Hasta..."];

  const parseAlertDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/");
    // Crear fecha en UTC para evitar problemas de zona horaria
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  };

  const filteredAlerts = useMemo(() => {
    setCurrentPage(1);

    const filtered = alerts.filter((alert) => {
      if (typeFilter !== "Todos" && alert.type !== typeFilter) return false;
      if (priorityFilter !== "Todos" && alert.priority !== priorityFilter)
        return false;
      if (statusFilter !== "Todos" && alert.status !== statusFilter)
        return false;

      if (dateFilter !== "Todos" && alert.date) {
        try {
          const alertDate = parseAlertDate(alert.date);
          if (!alertDate) return false;

          const today = new Date();
          today.setUTCHours(0, 0, 0, 0);

          switch (dateFilter) {
            case "Hoy":
              // Corrección para el filtro "Hoy"
              const todayStart = new Date();
              todayStart.setUTCHours(0, 0, 0, 0);
              const todayEnd = new Date();
              todayEnd.setUTCHours(23, 59, 59, 999);
              return alertDate >= todayStart && alertDate <= todayEnd;

            case "Hasta...":
              if (!selectedDate) return false;
              const untilDate = new Date(selectedDate);
              untilDate.setUTCHours(23, 59, 59, 999);
              // Comparación segura en UTC
              return alertDate.getTime() <= untilDate.getTime();
          }
        } catch (error) {
          console.error("Error al procesar fechas:", error);
          return false;
        }
      }

      if (horaFilter && alert.time) {
        const alertTime = alert.time.slice(0, 5);
        if (alertTime !== horaFilter) return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const dateTimeA = new Date(
        `${a.date?.split("/").reverse().join("-")}T${a.time || "00:00"}`
      );
      const dateTimeB = new Date(
        `${b.date?.split("/").reverse().join("-")}T${b.time || "00:00"}`
      );
      return dateTimeB.getTime() - dateTimeA.getTime();
    });
  }, [
    alerts,
    typeFilter,
    priorityFilter,
    statusFilter,
    dateFilter,
    selectedDate,
    horaFilter,
  ]);

  const columns = [
    { key: "student", title: "Alumno" },
    { key: "type", title: "Tipo de Alerta" },
    { key: "priority", title: "Prioridad" },
    { key: "status", title: "Estado" },
    { key: "date", title: "Fecha" },
    { key: "time", title: "Hora" },
  ];

  const handleAlertClick = (alert: Alert) => {
    router.push(`/alertas/${alert.id}`);
  };

  const renderCell = (alert: Alert, column: { key: string; title: string }) => {
    switch (column.key) {
      case "student":
        return (
          <StudentCell alert={alert} onClick={() => handleAlertClick(alert)} />
        );
      case "type":
        return (
          <div className="flex justify-start w-full">
            <AlertBadge type="type" value={alert.type} />
          </div>
        );
      case "priority":
        return (
          <div className="flex justify-start w-full">
            <AlertBadge type="priority" value={alert.priority} />
          </div>
        );
      case "status":
        return (
          <div className="flex justify-start w-full">
            <AlertBadge type="status" value={alert.status} />
          </div>
        );
      case "time":
        return <div className="text-left">{alert.time || "N/A"}</div>;
      default:
        return (
          <div className="text-left">
            {alert[column.key as keyof Alert] || "N/A"}
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertas</h2>
          <LoadingState />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="container mx-auto px-2 sm:px-6 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertas</h2>
          <ErrorState error={error} onRetry={() => window.location.reload()} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Alertas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FilterDropdown
            label="Tipo"
            options={typeOptions}
            value={typeFilter}
            onChange={setTypeFilter}
          />
          <FilterDropdown
            label="Prioridad"
            options={priorityOptions}
            value={priorityFilter}
            onChange={setPriorityFilter}
          />
          <FilterDropdown
            label="Estado"
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="flex flex-col">
            <FilterDropdown
              label="Fecha"
              options={dateOptions}
              value={dateFilter}
              onChange={(value) => {
                setDateFilter(value);
                if (value !== "Hasta...") {
                  setSelectedDate(null);
                }
              }}
            />
            {dateFilter === "Hasta..." && (
              <div className="mt-2">
                <DatePicker
                  selected={selectedDate}
                  onChange={setSelectedDate}
                  placeholderText="Seleccione una fecha"
                  className="w-full p-2 border rounded-md"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredAlerts.length > 0 ? (
            <DataTable
              columns={columns}
              data={filteredAlerts}
              renderCell={renderCell}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              pageSize={25}
              className="mt-4"
            />
          ) : (
            <NoResults />
          )}
        </div>
      </div>
    </AppLayout>
  );
}
