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
import { useToast } from "@/hooks/use-toast";

interface AddActionModalProps {
  alertData: AlertPage;
  setRefresh: () => void;
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

export function AddActionModal({ alertData, setRefresh }: AddActionModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false);
  const [planAccion, setPlanAccion] = useState("");
  const [fechaCompromiso, setFechaCompromiso] = useState("");
  const [fechaRealizacion, setFechaRealizacion] = useState("");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [responsableName, setResponsableName] = useState("");
  const [prioridad, setPrioridad] = useState(alertData.prioridad_id);
  const [severidad, setSeveridad] = useState(alertData.severidad_id);
  const [prioridades, setPrioridades] = useState<ApiAlertPriority[]>([]);
  const [severidades, setSeveridades] = useState<ApiAlertSeverity[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [powerUsers, setPowerUsers] = useState<PowerUser[]>([]);
  const [alertStates, setAlertStates] = useState<AlertState[]>([]);
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const { toast } = useToast();

  // Formatea el año a 4 dígitos
  const formatYearTo4Digits = (dateString: string): string => {
    if (!dateString) return dateString;
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    parts[0] = parts[0].padStart(4, "0");
    return parts.join("-");
  };

  // Valida que el año tenga 4 dígitos
  const validateYear = (dateString: string): boolean => {
    if (!dateString) return true;
    const year = dateString.split("-")[0];
    return year.length === 4 && /^\d+$/.test(year);
  };

  // Manejador de cambio para fechas
  const handleDateChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const formattedDate = formatYearTo4Digits(value);
    setter(formattedDate);
  };

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

  // Validación para archivo: opcional, pero si hay archivo, debe ser < 5MB
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

    // Ahora las fechas son obligatorias
    if (!fechaCompromiso) {
      newErrors.fechaCompromiso = "La fecha de compromiso es obligatoria";
    } else if (!validateYear(fechaCompromiso)) {
      newErrors.fechaCompromiso = "El año debe tener 4 dígitos (ej: 0001)";
    }
    if (!fechaRealizacion) {
      newErrors.fechaRealizacion = "La fecha de realización es obligatoria";
    } else if (!validateYear(fechaRealizacion)) {
      newErrors.fechaRealizacion = "El año debe tener 4 dígitos (ej: 0001)";
    }

    if (archivo) {
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (archivo.size > maxSizeInBytes) {
        newErrors.archivo = "El archivo debe ser menor a 5MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setArchivo(e.target.files[0]);
    } else {
      setArchivo(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const bitacoraData = {
        alumno_alerta_id: alertData.alumno_alerta_id,
        alumno_id: alertData.alumno.alumno_id,
        plan_accion: planAccion,
        fecha_compromiso: fechaCompromiso,
        fecha_realizacion: fechaRealizacion,
        archivo: archivo || undefined,
      };
      const alertUpdateData = {
        ...alertData,
        alumno_alerta_id: alertData.alumno_alerta_id,
        prioridad_id: prioridad,
        severidad_id: severidad,
        responsable_actual_id: responsableName,
        estado_id: selectedEstado,
        estado: selectedEstado,
      };
      await updateAlertAndBitacora(alertUpdateData, bitacoraData);
      toast({
        title: "Éxito",
        description: "Acción agregada a la bitácora correctamente",
        variant: "default",
      });
      setRefresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Error al agregar la bitácora",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      onClose();
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
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Agregar nueva acción</span>
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
                      {powerUsers.map((user) => (
                        <SelectItem
                          key={user.usuario_id}
                          value={user.persona_id.toString()}
                        >
                          {user.personas.nombres} {user.personas.apellidos}
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
                    value={selectedEstado}
                    onValueChange={(value) => setSelectedEstado(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {alertStates.map((estado) => (
                        <SelectItem
                          key={estado.alerta_estado_id}
                          value={estado.nombre_alerta_estado}
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
              <Label className="text-sm text-gray-500">
                Descripción de la alerta
              </Label>
              <Textarea
                value={alertData.descripcion}
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
                        onChange={(e) =>
                          handleDateChange(e.target.value, setFechaCompromiso)
                        }
                        onBlur={(e) => {
                          if (!e.target.value) {
                            setErrors((prev) => ({
                              ...prev,
                              fechaCompromiso:
                                "La fecha de compromiso es obligatoria",
                            }));
                          } else if (!validateYear(e.target.value)) {
                            setErrors((prev) => ({
                              ...prev,
                              fechaCompromiso:
                                "El año debe tener 4 dígitos (ej: 0001)",
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              fechaCompromiso: "",
                            }));
                          }
                        }}
                      />
                      {errors.fechaCompromiso && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fechaCompromiso}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">
                        Fecha realización
                      </Label>
                      <Input
                        type="date"
                        value={fechaRealizacion}
                        onChange={(e) =>
                          handleDateChange(e.target.value, setFechaRealizacion)
                        }
                        onBlur={(e) => {
                          if (!e.target.value) {
                            setErrors((prev) => ({
                              ...prev,
                              fechaRealizacion:
                                "La fecha de realización es obligatoria",
                            }));
                          } else if (!validateYear(e.target.value)) {
                            setErrors((prev) => ({
                              ...prev,
                              fechaRealizacion:
                                "El año debe tener 4 dígitos (ej: 0001)",
                            }));
                          } else {
                            setErrors((prev) => ({
                              ...prev,
                              fechaRealizacion: "",
                            }));
                          }
                        }}
                      />
                      {errors.fechaRealizacion && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fechaRealizacion}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">
                      Subir archivo (opcional)
                    </Label>
                    <Input
                      type="file"
                      accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      El archivo debe ser menor a 5MB. Puede ser imagen o
                      documento.
                    </p>
                    {errors.archivo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.archivo}
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
