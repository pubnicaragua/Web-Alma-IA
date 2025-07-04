import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  ApiAlertPriority,
  ApiAlertSeverity,
  fetchPrority,
  fetchSeverity,
  fetchStates,
  updateAlertAndBitacora,
} from "@/services/alerts-service";
import { AlertPage } from "@/services/alerts-service";

interface AddActionModalProps {
  onAddAction: () => void;
  isMobile?: boolean;
  users?: Array<{ usuario_id: number; nombre_social: string }>;
  alertData: AlertPage;
}

interface PowerUser {
  usuario_id: number;
  nombre_social: string;
  persona_id: number;
  personas: {
    nombres: string;
    apellidos: string;
    persona_id: number;
  };
}

interface AlertState {
  alerta_estado_id: number;
  nombre_alerta_estado: string;
  creado_por: number;
  fecha_creacion: string;
  actualizado_por: number;
  fecha_actualizacion: string;
  activo: boolean;
}

export function AddActionModal({
  onAddAction,
  isMobile = false,
  users = [],
  alertData,
}: AddActionModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false);
  const [planAccion, setPlanAccion] = useState("");
  const [fechaCompromiso, setFechaCompromiso] = useState("");
  const [fechaRealizacion, setFechaRealizacion] = useState("");
  const [urlArchivo, setUrlArchivo] = useState("");
  const [responsableName, setResponsableName] = useState("");
  const [prioridad, setPrioridad] = useState(alertData.prioridad_id);
  const [severidad, setSeveridad] = useState(alertData.severidad_id);
  const [prioridades, setPrioridades] = useState<ApiAlertPriority[]>([]);
  const [severidades, setSeveridades] = useState<ApiAlertSeverity[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [powerUsers, setPowerUsers] = useState<PowerUser[]>([]);
  const [alertStates, setAlertStates] = useState<AlertState[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedPowerUsers = localStorage.getItem("powerUsers");
        if (storedPowerUsers) {
          const parsedPowerUsers: PowerUser[] = JSON.parse(storedPowerUsers);
          setPowerUsers(parsedPowerUsers);
        }

        const [prioridadesData, severidadesData] = await Promise.all([
          fetchPrority(),
          fetchSeverity(),
        ]);

        setPrioridades(prioridadesData);
        setSeveridades(severidadesData);

        const loadstates: AlertState[] = await fetchStates();

        setAlertStates(loadstates);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  // Función para validar URL con expresión regular básica
  const isValidUrl = (url: string) => {
    // Permite http, https, ftp y localhost con puertos y paths
    const urlRegex =
      /^(https?:\/\/|ftp:\/\/|localhost)([\w\-]+(\.[\w\-]+)+)(:\d+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
    return urlRegex.test(url);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!planAccion.trim()) {
      newErrors.planAccion = "El plan de acción es obligatorio";
    }
    if (!responsableName.toString().trim()) {
      newErrors.responsable = "El responsable es obligatorio";
    }
    if (!prioridad) {
      newErrors.prioridad = "La prioridad es obligatoria";
    }
    if (!severidad) {
      newErrors.severidad = "La severidad es obligatoria";
    }
    if (!selectedEstado) {
      newErrors.estado = "El estado es obligatorio";
    }

    // Validar urlArchivo solo si tiene valor
    if (urlArchivo.trim()) {
      if (!isValidUrl(urlArchivo.trim())) {
        newErrors.urlArchivo = "Debe ingresar una URL válida";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const bitacoraData = {
        alumno_alerta_id: alertData.id,
        alumno_id: alertData.student.alumno_id,
        plan_accion: planAccion,
        fecha_compromiso: fechaCompromiso,
        fecha_realizacion: fechaRealizacion || undefined,
        url_archivo: urlArchivo || undefined,
      };

      const alertUpdateData = {
        ...alertData,
        alumno_alerta_id: alertData.student.alumno_id,
        prioridad_id: prioridad,
        severidad_id: severidad,
        responsable_actual_id: responsableName,
        estado_id: selectedEstado,
        estado: selectedEstado, // Ajustar según necesidad
      };
      console.log("XXXXX" + JSON.stringify(alertData));
      await updateAlertAndBitacora(alertUpdateData, bitacoraData);

      // Resetear el formulario
      setPlanAccion("");
      setFechaCompromiso("");
      setFechaRealizacion("");
      setUrlArchivo("");
      setResponsableName("");
      setPrioridad(0);
      setSeveridad(0);
      setSelectedEstado(0);
      setErrors({});

      onAddAction();
      onClose();
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button className="bg-blue-500 hover:bg-blue-600" onClick={onOpen}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={isMobile ? "" : "mr-2"}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        {!isMobile && <span>Agregar nueva acción</span>}
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex justify-between items-center w-full">
              <DialogTitle className="text-xl font-semibold">
                Bitácora
              </DialogTitle>
              <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-medium">Alerta</h3>

              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <Label className="text-sm text-gray-500">Responsable</Label>
                  <Select
                    value={responsableName}
                    onValueChange={(value) => setResponsableName(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem
                          key={user.usuario_id}
                          value={user.usuario_id.toString()}
                        >
                          {user.nombre_social}
                        </SelectItem>
                      ))}

                      {powerUsers.map((user) => (
                        <SelectItem
                          key={user.usuario_id}
                          value={user.persona_id.toString()}
                        >
                          {user.nombre_social} ({user.personas.nombres}{" "}
                          {user.personas.apellidos})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.responsable && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.responsable}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-500">Estado</Label>
                  <Select
                    value={selectedEstado.toString()}
                    onValueChange={(value) =>
                      setSelectedEstado(parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {alertStates.map((estado) => (
                        <SelectItem
                          key={estado.alerta_estado_id}
                          value={estado.alerta_estado_id.toString()}
                        >
                          {estado.nombre_alerta_estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.estado && (
                    <p className="text-red-500 text-xs mt-1">{errors.estado}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <Label className="text-sm text-gray-500">Origen</Label>
                  <Input value={alertData.origen} readOnly disabled />
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Tipo</Label>
                  <Input value={alertData.tipo} readOnly disabled />
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Prioridad</Label>
                  <Select
                    value={prioridad.toString()}
                    onValueChange={(value) => {
                      setPrioridad(parseInt(value));
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {prioridades.map((item) => (
                        <SelectItem
                          key={item.alerta_prioridad_id}
                          value={item.alerta_prioridad_id.toString()}
                        >
                          {item.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.prioridad && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.prioridad}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Severidad</Label>
                  <Select
                    value={severidad.toString()}
                    onValueChange={(value) => setSeveridad(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {severidades.map((item) => (
                        <SelectItem
                          key={item.alerta_severidad_id}
                          value={item.alerta_severidad_id.toString()}
                        >
                          {item.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.severidad && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.severidad}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label
                className="text-sm text-gray-500"
                onClick={() => console.log(alertData)}
              >
                Descripción de la alerta
              </Label>
              <Textarea
                value={alertData.description}
                placeholder="Descripción"
                className="min-h-[120px]"
                disabled
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h3 className="font-medium">Bitácora</h3>

                <div className="mt-2 space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">
                      Plan de acción (texto)
                    </Label>
                    <Textarea
                      value={planAccion}
                      onChange={(e) => setPlanAccion(e.target.value)}
                      placeholder="Describa el plan de acción"
                      className="min-h-[120px]"
                    />
                    {errors.planAccion && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.planAccion}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">
                        Fecha compromiso
                      </Label>
                      <Input
                        type="date"
                        value={fechaCompromiso}
                        onChange={(e) => setFechaCompromiso(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">
                        Fecha realización
                      </Label>
                      <Input
                        type="date"
                        value={fechaRealizacion}
                        onChange={(e) => setFechaRealizacion(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-gray-500">URL archivo</Label>
                    <Input
                      type="text"
                      value={urlArchivo}
                      onChange={(e) => setUrlArchivo(e.target.value)}
                      placeholder="URL del archivo"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Cargar archivo no más allá de 2MB
                    </p>
                    {errors.urlArchivo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.urlArchivo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                disabled={isLoading}
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
