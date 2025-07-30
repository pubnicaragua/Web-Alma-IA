"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ProfileData } from "@/services/profile-service";
import { useUser } from "@/middleware/user-context";
import { cn } from "@/lib/utils";

interface FormErrors {
  nombres?: string;
  apellidos?: string;
  email?: string;
  fecha_nacimiento?: string;
  telefono_contacto?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onRefresh: () => void;
  onSave: (
    data: ProfileData & { foto_perfil_base64?: string | null }
  ) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profileData,
  onSave,
  onRefresh,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>(profileData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [fotoPerfilBase64, setFotoPerfilBase64] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const { isRefreshing } = useUser();

  useEffect(() => {
    if (isOpen) {
      setFormData(profileData);
      setFotoPerfilBase64(null);
      setPreviewImg(profileData.url_foto_perfil || null);
      setErrors({});
    }
  }, [isOpen, profileData]);

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "nombres":
      case "apellidos":
        if (!value.trim()) error = "Este campo es requerido";
        break;
      case "email":
        if (!value.trim()) {
          error = "El correo es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Correo electrónico inválido";
        }
        break;
      case "fecha_nacimiento":
        if (!value.trim()) error = "La fecha de nacimiento es requerida";
        break;
      case "telefono_contacto":
        if (!value.trim()) error = "El teléfono es requerido";
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFotoPerfilBase64(result);
        setPreviewImg(result);
      };
      reader.readAsDataURL(file);
    } else {
      setFotoPerfilBase64(null);
      setPreviewImg(formData.url_foto_perfil || null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Campos obligatorios
    const requiredFields: Array<keyof ProfileData> = [
      "nombres",
      "apellidos",
      "email",
      "fecha_nacimiento",
      "telefono_contacto",
    ];

    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field] || "");
      if (error) {
        // newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      let dataToSend: ProfileData & { foto_perfil_base64?: string | null } = {
        ...formData,
      };

      if (fotoPerfilBase64 !== null) {
        dataToSend.url_foto_perfil = fotoPerfilBase64;
      } else if (formData.url_foto_perfil) {
        dataToSend.url_foto_perfil = formData.url_foto_perfil;
      }
      await onSave(dataToSend);
      onRefresh();
      isRefreshing();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[600px] p-0 overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </button>
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-lg font-semibold">
              Editar perfil
            </DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="nombres">Nombres*</Label>
                  {errors.nombres && (
                    <span className="text-xs text-red-500">
                      {errors.nombres}
                    </span>
                  )}
                </div>
                <Input
                  id="nombres"
                  name="nombres"
                  value={formData.nombres || ""}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateField(e.target.name, e.target.value);
                    setErrors((prev) => ({ ...prev, nombres: error }));
                  }}
                  className={cn(
                    errors.nombres &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="apellidos">Apellidos*</Label>
                  {errors.apellidos && (
                    <span className="text-xs text-red-500">
                      {errors.apellidos}
                    </span>
                  )}
                </div>
                <Input
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos || ""}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateField(e.target.name, e.target.value);
                    setErrors((prev) => ({ ...prev, apellidos: error }));
                  }}
                  className={cn(
                    errors.apellidos &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre_social">Nombre social (opcional)</Label>
                <Input
                  id="nombre_social"
                  name="nombre_social"
                  value={formData.nombre_social || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="email">Correo electrónico*</Label>
                  {errors.email && (
                    <span className="text-xs text-red-500">{errors.email}</span>
                  )}
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateField(e.target.name, e.target.value);
                    setErrors((prev) => ({ ...prev, email: error }));
                  }}
                  className={cn(
                    errors.email && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="fecha_nacimiento">Fecha de nacimiento*</Label>
                  {errors.fecha_nacimiento && (
                    <span className="text-xs text-red-500">
                      {errors.fecha_nacimiento}
                    </span>
                  )}
                </div>
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento || ""}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateField(e.target.name, e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      fecha_nacimiento: error,
                    }));
                  }}
                  className={cn(
                    errors.fecha_nacimiento &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="telefono_contacto">
                    Teléfono de contacto*
                  </Label>
                  {errors.telefono_contacto && (
                    <span className="text-xs text-red-500">
                      {errors.telefono_contacto}
                    </span>
                  )}
                </div>
                <Input
                  id="telefono_contacto"
                  name="telefono_contacto"
                  type="tel"
                  value={formData.telefono_contacto || ""}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateField(e.target.name, e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      telefono_contacto: error,
                    }));
                  }}
                  className={cn(
                    errors.telefono_contacto &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="foto_perfil_file">
                Foto de perfil (opcional)
              </Label>
              <Input
                id="foto_perfil_file"
                name="foto_perfil_file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewImg && (
                <div className="mt-2">
                  <img
                    src={previewImg}
                    alt="Vista previa"
                    className="h-24 w-24 object-cover rounded-full border"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Formatos permitidos: jpg, jpeg, png, webp, gif, etc.
              </p>
            </div>
          </div>
          <div className="border-t px-6 py-4">
            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
