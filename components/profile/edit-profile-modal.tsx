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
import { cn } from "@/lib/utils";

interface FormErrors {
  nombres?: string;
  apellidos?: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: ProfileData;
  onSave: (
    data: ProfileData & { foto_perfil_base64?: string | null }
  ) => Promise<void>;
}

export function EditProfileModal({
  isOpen,
  onClose,
  profileData,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>(profileData);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [fotoPerfilBase64, setFotoPerfilBase64] = useState<string | null>(null);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(profileData);
      setFotoPerfilBase64(null);
      setPreviewImg(profileData.url_foto_perfil || null);
    }
  }, [isOpen, profileData]);

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "nombres":
      case "apellidos":
        if (!value.trim()) error = "Este campo es requerido";
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

  // Convertir archivo a base64 y guardar en el estado
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFotoPerfilBase64(result);
        setPreviewImg(result);
      };
      reader.readAsDataURL(file); // Esto genera el string data:image/...;base64,...
    } else {
      setFotoPerfilBase64(null);
      setPreviewImg(formData.url_foto_perfil || null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    if (!formData.nombres?.trim()) {
      newErrors.nombres = "Los nombres son requeridos";
      isValid = false;
    }
    if (!formData.apellidos?.trim()) {
      newErrors.apellidos = "Los apellidos son requeridos";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      await onSave({ ...formData, url_foto_perfil: fotoPerfilBase64 });
      onClose();
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error;
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
                  <Label htmlFor="nombres">Nombres</Label>
                  {errors.nombres && (
                    <span className="text-xs text-red-500">
                      {errors.nombres}
                    </span>
                  )}
                </div>
                <Input
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
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
                  <Label htmlFor="apellidos">Apellidos</Label>
                  {errors.apellidos && (
                    <span className="text-xs text-red-500">
                      {errors.apellidos}
                    </span>
                  )}
                </div>
                <Input
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
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
                  <Label htmlFor="email">Correo electrónico</Label>
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                </div>
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="telefono_contacto">
                    Teléfono de contacto
                  </Label>
                </div>
                <Input
                  id="telefono_contacto"
                  name="telefono_contacto"
                  type="tel"
                  value={formData.telefono_contacto}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Subida de imagen en base64 */}
            <div className="space-y-2">
              <Label htmlFor="foto_perfil_file">
                Foto de perfil (puede subir una imagen)
              </Label>
              <Input
                id="foto_perfil_file"
                name="foto_perfil_file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {/* Vista previa de la imagen */}
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

            <div className="space-y-2">
              <Label htmlFor="encripted_password">
                Nueva contraseña (dejar en blanco para no cambiar)
              </Label>
              <Input
                id="encripted_password"
                name="encripted_password"
                type="password"
                value={formData.encripted_password || ""}
                onChange={handleChange}
                placeholder="••••••••"
                minLength={8}
              />
              {formData.encripted_password &&
                formData.encripted_password.length < 8 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    La contraseña debe tener al menos 8 caracteres
                  </p>
                )}
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
