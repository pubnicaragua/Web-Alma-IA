"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchRestorePasswordCode,
  fetchRestorePasswordCodeType,
} from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? "";
  const { toast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword || !resetCode) {
      setError("Por favor, completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      setIsLoading(true);
      const data: fetchRestorePasswordCodeType = {
        email,
        resetCode,
        newPassword: password,
      };
      const success = await fetchRestorePasswordCode(data);
      if (success) {
        toast({
          title: "Contraseña restablecida",
          description:
            "Su contraseña ha restablecida exitosamente. Por favor, inicia sesión nuevamente con su nueva clave.",
        });
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast({
          title: "Error",
          description:
            "No se pudo restablecer la contraseña. Rectifica todos los campos y inténtalo de nuevo.",
          variant: "default",
        });
      }
    } catch {
      setError("Ocurrió un error. Por favor, inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-md max-w-md mx-auto">
      <header className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/login")}
          aria-label="Volver"
          className="mr-4"
        >
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold text-center flex-1">
          Restablece tu contraseña
        </h1>
      </header>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            value={email}
            disabled
            aria-label="Correo electrónico"
          />
        </div>

        <div className="space-y-2 relative">
          <Input
            type="text"
            placeholder="Código de recuperación"
            value={resetCode}
            onChange={(e) => setResetCode(e.target.value)}
            required
            aria-label="Código de recuperación"
          />
        </div>

        <div className="space-y-2 relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            aria-label="Nueva contraseña"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="space-y-2 relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            aria-label="Confirmar contraseña"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={
              showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Restableciendo..." : "Restablecer contraseña"}
        </Button>
      </form>
    </div>
  );
}
