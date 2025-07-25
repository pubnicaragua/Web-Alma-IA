"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Ahora onSave recibe la contrasena actual y la nueva
  onSave: (newPassword: string, currentPassword: string) => Promise<void>;
}

export function EditPasswordModal({
  isOpen,
  onClose,
  onSave,
}: EditPasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Control para mostrar/ocultar contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setPassword("");
      setPasswordConfirm("");
      setErrors({});
      setIsLoading(false);
      setShowCurrentPassword(false);
      setShowPassword(false);
      setShowPasswordConfirm(false);
    }
  }, [isOpen]);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = "Este campo es requerido";
    } else if (
      (name === "password" || name === "currentPassword") &&
      value.length < 8
    ) {
      error = "La contraseña debe tener al menos 8 caracteres";
    }
    return error;
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    newErrors.currentPassword = validateField(
      "currentPassword",
      currentPassword
    );
    newErrors.password = validateField("password", password);
    newErrors.passwordConfirm = validateField(
      "passwordConfirm",
      passwordConfirm
    );

    if (!newErrors.passwordConfirm && password !== passwordConfirm) {
      newErrors.passwordConfirm = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return (
      !newErrors.currentPassword &&
      !newErrors.password &&
      !newErrors.passwordConfirm
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(password, currentPassword);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  // Estilos para el botón del ojo para posicionarlo dentro del input
  const eyeBtnClass =
    "absolute right-3 top-1/2 cursor-pointer text-gray-400 hover:text-gray-600";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-lg font-semibold">
              Editar contraseña
            </DialogTitle>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Contraseña actual */}
          <div className="relative space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual*</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type={showCurrentPassword ? "text" : "password"}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errors.currentPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    currentPassword: undefined,
                  }));
                }
              }}
              aria-invalid={!!errors.currentPassword}
              aria-describedby={
                errors.currentPassword ? "currentPassword-error" : undefined
              }
              minLength={8}
              className="pr-10" // espaciado para el icono
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword((v) => !v)}
              className={eyeBtnClass}
              tabIndex={-1}
              aria-label={
                showCurrentPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              title={
                showCurrentPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.currentPassword && (
              <p
                id="currentPassword-error"
                className="text-xs text-red-500 mt-1"
              >
                {errors.currentPassword}
              </p>
            )}
          </div>

          {/* Nueva contraseña */}
          <div className="relative space-y-2">
            <Label htmlFor="password">Nueva contraseña*</Label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
              }}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              minLength={8}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={eyeBtnClass}
              tabIndex={-1}
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p id="password-error" className="text-xs text-red-500 mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirmar contraseña */}
          <div className="relative space-y-2">
            <Label htmlFor="passwordConfirm">Confirmar contraseña*</Label>
            <Input
              id="passwordConfirm"
              name="passwordConfirm"
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                if (errors.passwordConfirm) {
                  setErrors((prev) => ({
                    ...prev,
                    passwordConfirm: undefined,
                  }));
                }
              }}
              aria-invalid={!!errors.passwordConfirm}
              aria-describedby={
                errors.passwordConfirm ? "passwordConfirm-error" : undefined
              }
              minLength={8}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPasswordConfirm((v) => !v)}
              className={eyeBtnClass}
              tabIndex={-1}
              aria-label={
                showPasswordConfirm
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              title={
                showPasswordConfirm
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showPasswordConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.passwordConfirm && (
              <p
                id="passwordConfirm-error"
                className="text-xs text-red-500 mt-1"
              >
                {errors.passwordConfirm}
              </p>
            )}
          </div>

          <DialogFooter className="border-t pt-4 flex justify-end gap-2">
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
        </form>
      </DialogContent>
    </Dialog>
  );
}
