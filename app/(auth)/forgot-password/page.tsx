"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { fetchRestorePassword } from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Por favor, ingresa tu correo electrónico");
      return;
    }

    try {
      setIsLoading(true);
      if (await fetchRestorePassword(email)) {
        setSuccess(true);
        return;
      }
      toast({
        title: "Error",
        description: "No se encuentra este correo en el sistema.",
        variant: "destructive",
      });
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-md">
      <Link
        href="/login"
        className="flex items-center text-sm text-gray-600 mb-6 hover:text-blue-500"
      >
        <ArrowLeft size={16} className="mr-1" />
        Volver al inicio de sesión
      </Link>

      <h1 className="text-2xl font-bold text-center mb-6">
        Recupera tu contraseña
      </h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {success ? (
        <div className="text-center">
          <div className="bg-green-50 text-green-600 p-4 rounded-md mb-6">
            <p className="font-medium">¡Correo enviado!</p>
            <p className="text-sm mt-1">
              Hemos enviado un codigo de recuperación a tu correo electrónico.
              Por favor, revisa tu bandeja de entrada y pega ese codigo en la
              siguiente pagina.
            </p>
          </div>

          <Link href={`/reset-password?email=${encodeURIComponent(email)}`}>
            <Button className="bg-blue-500 hover:bg-blue-600">
              Continuar recuperacion
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </p>
            <Input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
          </Button>
        </form>
      )}
    </div>
  );
}
