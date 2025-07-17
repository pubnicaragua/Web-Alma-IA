// app/(auth)/login/page.tsx
"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { removeAuthToken, setAuthToken } from "@/lib/api-config";
import { fetchProfileData } from "@/services/profile-service";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(true); // Nuevo estado para el checkbox de captcha

  // Función para obtener un mensaje de error amigable
  const getFriendlyErrorMessage = (error: any): string => {
    // Si el error es un objeto con message y error
    if (typeof error === "object" && error !== null) {
      if (error.error === "Invalid login credentials") {
        return "Las credenciales ingresadas no son válidas. Por favor, verifica tu correo y contraseña.";
      }
      if (error.message) {
        return error.message;
      }
    }

    // Si es un string que contiene "Invalid login credentials"
    if (
      typeof error === "string" &&
      error.includes("Invalid login credentials")
    ) {
      return "Las credenciales ingresadas no son válidas. Por favor, verifica tu correo y contraseña.";
    }

    // Si es un string que contiene "Error interno del servidor"
    if (
      typeof error === "string" &&
      error.includes("Error interno del servidor")
    ) {
      return "Ha ocurrido un problema en el servidor. Por favor, intenta nuevamente más tarde.";
    }

    // Mensaje genérico para otros errores
    return "Ha ocurrido un error al intentar iniciar sesión. Por favor, intenta nuevamente.";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validación del checkbox "No soy un robot"
    if (!isCaptchaChecked) {
      setError("Por favor, marca la casilla 'No soy un robot'.");
      setIsLoading(false);
      toast({
        title: "Error de validación",
        description: "Por favor, marca la casilla 'No soy un robot'.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/proxy/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Extraer el mensaje de error del servidor
        throw new Error(JSON.stringify(data));
      }

      // Asegurarnos de que el token se guarde correctamente
      if (data.token) {
        // Guardar el token usando la función centralizada
        setAuthToken(data.token);
        localStorage.setItem("isAuthenticated", "true");

        try {
          const profile = await fetchProfileData();
          if (
            profile.rol.nombre === "Alumno" ||
            profile.rol.nombre === "Apoderado"
          ) {
            toast({
              title: "Acceso denegado",
              description: "No tienes permiso para acceder a esta sección.",
              variant: "destructive",
            });
            removeAuthToken();
            localStorage.setItem("isAuthenticated", "false");
            // form reset
            return;
          }
        } catch (error) {
          removeAuthToken();
          localStorage.setItem("isAuthenticated", "false");
          return;
        }

        // Mostrar notificación de éxito
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente. Redirigiendo...",
        });

        // Redirección a la página de selección de colegio
        router.push("/select-school");
      } else {
        throw new Error("No se recibió un token válido");
      }
    } catch (error) {
      let errorMessage = "";
      try {
        // Intentar parsear el mensaje de error si es un JSON
        const errorObj =
          error instanceof Error
            ? error.message.startsWith("{")
              ? JSON.parse(error.message)
              : error.message
            : "Error desconocido al iniciar sesión";

        errorMessage = getFriendlyErrorMessage(errorObj);
      } catch (e) {
        // Si hay un error al parsear, usar el mensaje original
        errorMessage =
          error instanceof Error
            ? error.message
            : "Error desconocido al iniciar sesión";
        errorMessage = getFriendlyErrorMessage(errorMessage);
      }

      setError(errorMessage);

      // Mostrar notificación de error
      toast({
        title: "Error de inicio de sesión",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Inicia sesión</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4 text-sm">
          <p className="font-medium mb-1">No se pudo iniciar sesión</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Correo electrónico o usuario"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2 relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <Label htmlFor="remember" className="text-sm">
              Recuérdame
            </Label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="border rounded-md p-3 flex items-center space-x-3">
          <Checkbox
            id="captcha"
            checked={isCaptchaChecked} // Conectar el estado
            onCheckedChange={(checked) =>
              setIsCaptchaChecked(checked as boolean)
            } // Actualizar el estado
          />
          <Label htmlFor="captcha">No soy un robot</Label>
          <div className="ml-auto">
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="24" height="24" rx="4" fill="#F0F0F0" />
              <path
                d="M12 6V18"
                stroke="#A0A0A0"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 12H18"
                stroke="#A0A0A0"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Ingresar"}
        </Button>
      </form>
    </div>
  );
}
