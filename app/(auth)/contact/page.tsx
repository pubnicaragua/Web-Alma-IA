"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ContactForm() {
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isCaptchaChecked, setIsCaptchaChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Por favor, completa todos los campos.");
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      toast({
        title: "Error",
        description: "Por favor, ingresa un correo electrónico válido.",
        variant: "destructive",
      });
      return;
    }

    if (!isCaptchaChecked) {
      setError("Por favor, marca la casilla 'No soy un robot'.");
      toast({
        title: "Error de validación",
        description: "Por favor, marca la casilla 'No soy un robot'.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const data = {};
    try {
      fetch("https://api-almaia.onrender.com/api/v1/contacto/almaia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: name,
          email: email,
          telefono: phone,
        }),
      });

      toast({
        title: "Mensaje enviado",
        description:
          "Gracias por contactarnos. Te responderemos a la brevedad.",
      });

      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setIsCaptchaChecked(false);
      setError("");
    } catch (err) {
      setError("Error enviando el mensaje. Intenta nuevamente.");
      toast({
        title: "Error",
        description: "Error enviando el mensaje. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-md max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Contáctanos</h1>

      {/* Botón para volver a la ventana anterior
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
          className="w-full"
        >
          ← Volver
        </Button>
      </div> */}

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4 text-sm">
          <p className="font-medium mb-1">Error</p>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Input
            type="tel"
            placeholder="Teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="border rounded-md p-3 flex items-center space-x-3">
          <Checkbox
            id="captcha"
            checked={isCaptchaChecked}
            onCheckedChange={(checked) =>
              setIsCaptchaChecked(checked as boolean)
            }
            disabled={isLoading}
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
          {isLoading ? "Enviando..." : "Enviar mensaje"}
        </Button>
      </form>
    </div>
  );
}
