"use client";

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
  fetchEquipoAlma,
} from "@/services/alerts-service";
import { Persona } from "@/services/teachers-service";

interface AddActionModalProps {
  onAddAction: (action: {
    plan_accion: string;
    fecha_compromiso: string;
    fecha_realizacion?: string;
    url_archivo?: string;
    alerta_prioridad_id: number;
    alerta_severidad_id: number;
    responsable_id: number;
  }) => void;
  isMobile?: boolean;
}

export function AddActionModal({
  onAddAction,
  isMobile = false,
}: AddActionModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false);
  const [planAccion, setPlanAccion] = useState("");
  const [fechaCompromiso, setFechaCompromiso] = useState("");
  const [fechaRealizacion, setFechaRealizacion] = useState("");
  const [urlArchivo, setUrlArchivo] = useState("");
  const [responsableId, setResponsableId] = useState<number>(0);
  const [prioridad, setPrioridad] = useState(0);
  const [severidad, setSeveridad] = useState(0);
  const [prioridades, setPrioridades] = useState<ApiAlertPriority[]>([]);
  const [severidades, setSeveridades] = useState<ApiAlertSeverity[]>([]);
  const [responsables, setResponsables] = useState<Persona[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchPrioridades = async () => {
      const data = await fetchPrority();
      setPrioridades(data);
    };

    const fetchSeveridades = async () => {
      const data = await fetchSeverity();
      setSeveridades(data);
    };
    const fetchResponsables = async () => {
      const data = await fetchEquipoAlma();
      setResponsables(data);
    };

    fetchPrioridades();
    fetchSeveridades();
    fetchResponsables();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!planAccion.trim()) {
      newErrors.planAccion = "El plan de acción es obligatorio";
    }
    if (!responsableId.toString().trim()) {
      newErrors.responsable = "El responsable es obligatorio";
    }
    if (!prioridad) {
      newErrors.prioridad = "La prioridad es obligatoria";
    }
    if (!severidad) {
      newErrors.severidad = "La severidad es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAddAction({
      plan_accion: planAccion,
      fecha_compromiso: fechaCompromiso,
      fecha_realizacion: fechaRealizacion || undefined,
      url_archivo: urlArchivo || undefined,
      alerta_severidad_id: severidad,
      alerta_prioridad_id: prioridad,
      responsable_id: responsableId,
    });

    setPlanAccion("");
    setFechaCompromiso("");
    setFechaRealizacion("");
    setUrlArchivo("");
    setResponsableId(0);
    setPrioridad(0);
    setSeveridad(0);
    setErrors({});
    onClose();
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
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
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

              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label className="text-sm text-gray-500">Responsable</Label>
                  <Select
                    value={responsableId.toString()}
                    onValueChange={(value) => setResponsableId(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccione" />
                    </SelectTrigger>
                    <SelectContent>
                      {responsables.map((p) => (
                        <SelectItem
                          key={p.persona_id}
                          value={p.persona_id?.toString() || ""}
                        >
                          {p.nombres} {p.apellidos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-gray-500">
                    Descripción de la alerta
                  </Label>
                  <Input placeholder="Descripción" />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                <div>
                  <Label className="text-sm text-gray-500">Origen</Label>
                  <Input value="Alumno" readOnly />
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Tipo</Label>
                  <Input value="SOS" readOnly />
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Prioridad</Label>
                  <Select
                    value={prioridad.toString()}
                    onValueChange={(value) => setPrioridad(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Alta" />
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
                </div>
                <div>
                  <Label className="text-sm text-gray-500">Severidad</Label>
                  <Select
                    value={severidad.toString()}
                    onValueChange={(value) => setSeveridad(parseInt(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Alta" />
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
                </div>
              </div>
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
                      className="min-h-[80px]"
                    />
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
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Guardar
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
