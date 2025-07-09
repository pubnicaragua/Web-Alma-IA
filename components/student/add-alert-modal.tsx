"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { X, Plus, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/lib/modal-utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  fetchStates,
  fetchPrority,
  fetchSeverity,
  createAlert,
} from "@/services/alerts-service";
import type {
  ApiAlertPriority,
  ApiAlertSeverity,
  CreateAlertParams,
} from "@/services/alerts-service";
import { useUser } from "@/lib/user-context";
import { useToast } from "@/hooks/use-toast";

interface AlertState {
  alerta_estado_id: number;
  nombre_alerta_estado: string;
  creado_por: number;
  fecha_creacion: string;
  actualizado_por: number;
  fecha_actualizacion: string;
  activo: boolean;
}

interface PowerUser {
  usuario_id: number;
  nombre_social: string;
  personas?: {
    nombres: string;
    apellidos: string;
    persona_id: number;
  };
  // Otros campos que puedas necesitar...
}

interface AddAlertModalProps {
  onRefresh: () => void;
  onAddAlert: (alert: {
    alumno_alerta_id?: number;
    tipo: string;
    descripcion: string;
    fecha: string;
    hora: string;
    prioridad: string;
    severidad: string;
    responsable: string;
  }) => void;
}

const generarFechaISOUsuario = (fecha: string, hora: string) => {
  if (!fecha || !hora) return "";
  const horaCompleta = hora.length === 5 ? `${hora}:00` : hora;
  return `${fecha}T${horaCompleta}`;
};

export function AddAlertModal({ onAddAlert, onRefresh }: AddAlertModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false);
  const { userData, isLoading: userLoading } = useUser();
  const isMobile = useIsMobile();
  const params = useParams();
  const { toast } = useToast();

  const [tipo, setTipo] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [fecha, setFecha] = useState<string>("");
  const [hora, setHora] = useState<string>("");
  const [prioridad, setPrioridad] = useState<string>("");
  const [severidad, setSeveridad] = useState<string>("");

  const [prioridades, setPrioridades] = useState<ApiAlertPriority[]>([]);
  const [alertStates, setAlertStates] = useState<AlertState[]>([]);
  const [severitys, setSeveritys] = useState<ApiAlertSeverity[]>([]);

  const [powerUsers, setPowerUsers] = useState<PowerUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const [prioridadesData, alertStatesData, severidadData] =
          await Promise.all([fetchPrority(), fetchStates(), fetchSeverity()]);

        if (!isMounted) return;

        setPrioridades(Array.isArray(prioridadesData) ? prioridadesData : []);
        setAlertStates(Array.isArray(alertStatesData) ? alertStatesData : []);
        setSeveritys(Array.isArray(severidadData) ? severidadData : []);

        // Valores por defecto solo si no hay uno seleccionado
        if (alertStatesData && alertStatesData.length > 0 && !tipo) {
          setTipo(alertStatesData[0].nombre_alerta_estado || "");
        }
        if (prioridadesData && prioridadesData.length > 0 && !prioridad) {
          setPrioridad(prioridadesData[0].nombre || "");
        }
        if (severidadData && severidadData.length > 0 && !severidad) {
          setSeveridad(severidadData[0].nombre || "");
        }
      } catch (error) {
        setFetchError("Error cargando datos para selects.");
        console.error("Error cargando datos para selects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Leer usuarios desde localStorage
    try {
      const storedUsers = localStorage.getItem("powerUsers");
      if (storedUsers) {
        const parsedUsers: PowerUser[] = JSON.parse(storedUsers);
        setPowerUsers(parsedUsers);
        // Seleccionar el primer usuario por defecto si existe
        if (parsedUsers.length > 0) {
          setSelectedUserId(parsedUsers[0].usuario_id);
        }
      }
    } catch (e) {
      console.error("Error leyendo usuarios de localStorage:", e);
    }

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !tipo.trim() ||
      !descripcion.trim() ||
      !fecha.trim() ||
      !hora.trim() ||
      !prioridad.trim() ||
      !severidad.trim() ||
      selectedUserId === null
    ) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }

    const prioridadSeleccionada = prioridades.find(
      (p) => p.nombre === prioridad
    );
    const severidadSeleccionada = severitys.find((s) => s.nombre === severidad);

    if (!prioridadSeleccionada || !severidadSeleccionada) {
      alert("Prioridad o severidad inválidos.");
      return;
    }

    const fechaGenerada = generarFechaISOUsuario(fecha, hora);

    if (!fechaGenerada) {
      alert("Fecha y hora inválidas.");
      return;
    }

    const data: CreateAlertParams = {
      alumno_id: params?.id,
      mensaje: descripcion,
      fecha_generada: fechaGenerada,
      alerta_origen_id: 1,
      prioridad_id: prioridadSeleccionada.alerta_prioridad_id,
      severidad_id: severidadSeleccionada.alerta_severidad_id,
      responsable_actual_id: selectedUserId,
      leida: false,
      estado: tipo,
      alertas_tipo_alerta_tipo_id: 1,
    };
    onClose();
    try {
      await createAlert(data);
      toast({
        title: "Éxito",
        description: "Alerta agregada correctamente",
        variant: "default",
      });
      onRefresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al agregar a la alerta.",
        variant: "destructive",
      });
    }
  };

  if (fetchError) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded border border-red-200">
        {fetchError}
      </div>
    );
  }

  return (
    <>
      <Button
        className="bg-blue-500 hover:bg-blue-600"
        onClick={onOpen}
        aria-label="Agregar alerta manual"
        disabled={loading || userLoading}
      >
        <Plus className={isMobile ? "" : "mr-2"} size={16} />
        {!isMobile && <span>Agregar alerta manual</span>}
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-2">
            <DialogTitle className="text-xl font-semibold">
              Agregar alerta manual
            </DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground flex items-center justify-center">
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </DialogClose>
          </DialogHeader>
          {loading ? (
            <div className="py-8 text-center text-gray-500">
              Cargando datos...
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo" className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                  Estado de alerta
                </Label>
                <Select
                  value={tipo}
                  onValueChange={setTipo}
                  required
                  disabled={alertStates.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione el estado de alerta" />
                  </SelectTrigger>
                  <SelectContent>
                    {alertStates.length > 0 ? (
                      alertStates
                        .filter(
                          (sev) =>
                            sev.nombre_alerta_estado &&
                            sev.nombre_alerta_estado.trim() !== ""
                        )
                        .map((sev) => (
                          <SelectItem
                            key={sev.nombre_alerta_estado}
                            value={sev.nombre_alerta_estado}
                          >
                            {sev.nombre_alerta_estado}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="" disabled>
                        No hay tipos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prioridad" className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-blue-500" />
                  Nivel de prioridad
                </Label>
                <Select
                  value={prioridad}
                  onValueChange={setPrioridad}
                  required
                  disabled={prioridades.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione el nivel de prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    {prioridades.length > 0 ? (
                      prioridades
                        .filter(
                          (prio) => prio.nombre && prio.nombre.trim() !== ""
                        )
                        .map((prio) => (
                          <SelectItem
                            key={prio.alerta_prioridad_id}
                            value={prio.nombre}
                          >
                            {prio.nombre}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="" disabled>
                        No hay prioridades disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="severidad" className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                  Severidad
                </Label>
                <Select
                  value={severidad}
                  onValueChange={setSeveridad}
                  required
                  disabled={severitys.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione la severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {severitys.length > 0 ? (
                      severitys
                        .filter((sev) => sev.nombre && sev.nombre.trim() !== "")
                        .map((sev) => (
                          <SelectItem key={sev.nombre} value={sev.nombre}>
                            {sev.nombre}
                          </SelectItem>
                        ))
                    ) : (
                      <SelectItem value="" disabled>
                        No hay severidades disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsable" className="flex items-center">
                  Responsable
                </Label>
                <Select
                  value={selectedUserId !== null ? String(selectedUserId) : ""}
                  onValueChange={(val) => setSelectedUserId(Number(val))}
                  required
                  disabled={powerUsers.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione un responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    {powerUsers.length > 0 ? (
                      powerUsers.map((user) => {
                        const nombreCompleto = user.personas
                          ? `${user.personas.nombres} ${user.personas.apellidos}`
                          : user.nombre_social;
                        return (
                          <SelectItem
                            key={user.usuario_id}
                            value={user.persona_id.toString()}
                          >
                            {nombreCompleto}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem value="" disabled>
                        No hay usuarios disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Describa la situación"
                  required
                  className="min-h-[100px]"
                />
                <p className="text-xs text-gray-500">
                  * Si son más de un involucrado en la alerta, mencionar el RUT
                  de cada involucrado.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha">Fecha del suceso</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hora">Hora del suceso</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={
                  userLoading ||
                  loading ||
                  alertStates.length === 0 ||
                  prioridades.length === 0 ||
                  severitys.length === 0 ||
                  selectedUserId === null
                }
              >
                Agregar alerta manual
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
