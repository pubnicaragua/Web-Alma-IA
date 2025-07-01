"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertPage } from "@/services/alerts-service";

interface EditAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: AlertPage | null;
  onSave: (data: any) => Promise<void>;
}

export function EditAlertModal({
  isOpen,
  onClose,
  alert,
  onSave,
}: EditAlertModalProps) {
  if (!alert) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    await onSave({
      accion_tomada: (formData.get("accion_tomada") as string) || null,
      fecha_resolucion: (formData.get("fecha_resolucion") as string) || null,
      alertas_prioridades: {
        alerta_prioridad_id:
          parseInt(formData.get("prioridad_id") as string) || 1,
      },
      alertas_severidades: {
        alerta_severidad_id:
          parseInt(formData.get("severidad_id") as string) || 1,
      },
      alertas_tipos: {
        alerta_tipo_id: parseInt(formData.get("tipo_id") as string) || 1,
      },
      alertas_reglas: {
        alerta_regla_id: parseInt(formData.get("regla_id") as string) || 1,
        descripcion: (formData.get("regla_descripcion") as string) || "",
        tipo_emocion: (formData.get("regla_emocion") as string) || "",
        umbral: (formData.get("regla_umbral") as string) || "",
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Alerta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Generada</Label>
              <Input
                type="datetime-local"
                name="fecha_generada"
                defaultValue={alert.fecha_generada?.split(".")[0] || ""}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Fecha Resolución</Label>
              <Input
                type="datetime-local"
                name="fecha_resolucion"
                defaultValue={alert.fecha_resolucion?.split(".")[0] || ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select
                name="prioridad_id"
                defaultValue={
                  alert.alertas_prioridades?.alerta_prioridad_id.toString() ||
                  "1"
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Baja</SelectItem>
                  <SelectItem value="2">Media</SelectItem>
                  <SelectItem value="3">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Severidad</Label>
              <Select
                name="severidad_id"
                defaultValue={
                  alert.alertas_severidades?.alerta_severidad_id.toString() ||
                  "1"
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Baja</SelectItem>
                  <SelectItem value="2">Media</SelectItem>
                  <SelectItem value="3">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                name="tipo_id"
                defaultValue={
                  alert.alertas_tipos?.alerta_tipo_id.toString() || "1"
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">SOS Alma</SelectItem>
                  <SelectItem value="2">Alerta Emocional</SelectItem>
                  <SelectItem value="5">Roja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 h-40">
            <Label>Descripción de la alerta</Label>
            <Textarea
              className="flex h-full"
              name="regla_descripcion"
              defaultValue={alert.alertas_reglas?.descripcion || ""}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
