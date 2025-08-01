"use client";
import { DataTable } from "@/components/data-table";
import { FilterDropdown } from "@/components/filter-dropdown";
import { AppLayout } from "@/components/layout/app-layout";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  type Alert,
  fetchAlerts,
  fetchStates,
  fetchTypes,
  fetchPrority,
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

  // Estados para almacenar los datos desde la BD
  const [alertStates, setAlertStates] = useState<
    { alerta_estado_id: number; nombre_alerta_estado: string }[]
  >([]);
  const [alertTypes, setAlertTypes] = useState<
    { alerta_tipo_id: number; nombre: string }[]
  >([]);
  const [alertPriorities, setAlertPriorities] = useState<
    { alerta_prioridad_id: number; nombre: string }[]
  >([]);

  useEffect(() => {
    selectByDefaul();

    const loadAlertsAndFilters = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Cargar alertas
        let data = await fetchAlerts();

        // Cargar estados desde la base de datos
        const statesData = await fetchStates();
        setAlertStates(statesData);

        // Cargar tipos desde la base de datos
        const typesData = await fetchTypes();
        setAlertTypes(typesData);

        // Cargar prioridades desde la base de datos
        const prioritiesData = await fetchPrority();
        setAlertPriorities(prioritiesData);

        // Filtrar por notificaciones si aplica
        const params = getSearchParam(searchParams, "notifications");
        if (params) {
          data = data.filter((alert) => alert.status === "Pendiente");
        }

        setAlerts(data);
      } catch (err) {
        setError("No se pudieron cargar las alertas. Intente nuevamente.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAlertsAndFilters();
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

  const getTypeOptions = () => {
    return ["Todos", ...alertTypes.map((t) => t.nombre)];
  };

  const getPriorityOptions = () => {
    return ["Todos", ...alertPriorities.map((p) => p.nombre)];
  };

  const typeOptions = getTypeOptions();
  const priorityOptions = getPriorityOptions();
  const statusOptions = [
    "Todos",
    ...alertStates.map((s) => s.nombre_alerta_estado),
  ];
  const dateOptions = ["Todos", "Hoy", "Hasta..."];

  // Nueva función para parseo considerando la hora local
  const parseAlertDateTime = (
    dateString: string,
    timeString?: string
  ): Date | null => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split("/").map(Number);
    if (
      !day ||
      !month ||
      !year ||
      year < 1900 ||
      year > 2100 ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      console.warn(
        `Fecha con formato inválido o año fuera de rango: ${dateString}`
      );
      return null;
    }
    let hours = 0,
      minutes = 0;
    if (timeString) {
      [hours, minutes] = timeString.split(":").map((t) => parseInt(t, 10) || 0);
    }
    // Construye fecha local (no UTC)
    return new Date(year, month - 1, day, hours, minutes);
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
          const alertDate = parseAlertDateTime(alert.date, alert.time);
          if (!alertDate) return false;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          switch (dateFilter) {
            case "Hoy":
              const todayStart = new Date(today);
              const todayEnd = new Date(today);
              todayEnd.setHours(23, 59, 59, 999);
              return alertDate >= todayStart && alertDate <= todayEnd;
            case "Hasta...":
              if (!selectedDate) return false;
              const untilDate = new Date(selectedDate);
              untilDate.setHours(23, 59, 59, 999);
              return alertDate.getTime() <= untilDate.getTime();
            default:
              return true;
          }
        } catch (error) {
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
      const dateTimeA =
        parseAlertDateTime(a.date || "", a.time || "") || new Date(0);
      const dateTimeB =
        parseAlertDateTime(b.date || "", b.time || "") || new Date(0);

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
      case "date": {
        const localDate = parseAlertDateTime(alert.date || "", alert.time);
        return (
          <div className="text-left">
            {localDate ? localDate.toLocaleDateString() : "N/A"}
          </div>
        );
      }
      case "time": {
        const localDate = parseAlertDateTime(alert.date || "", alert.time);
        return (
          <div className="text-left">
            {localDate
              ? localDate.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </div>
        );
      }
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
