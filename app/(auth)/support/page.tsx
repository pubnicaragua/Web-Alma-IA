"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { useToast } from "@/hooks/use-toast";

export default function SupportContact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSending(true);
    setSent(false);

    try {
      const response = await fetch("/api/proxy/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: form.email, nombre: form.name }),
      });
      // Aquí debes poner la lógica para enviar el formulario a tu backend o API de soporte
      // Ejemplo: await axios.post('/api/support', form);
      // contacto/almaia BODY ====> {
      //     "nombre":"sdfds",
      //     "email":"dsdsfds@jdsnds.com",
      //     "telefono":"9038473",
      //     "to":"davidcastro505personal@gmail.com"//opcional, si se envia solo se enviaran a este correo
      // }
      // Simulación de envío
      await new Promise((r) => setTimeout(r, 1500));
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast({
        title: "Sesión expirada",
        description: "Error al enviar el mensaje. Intenta nuevamente.",
        variant: "destructive",
      });
    }
    setSending(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-4 p-10 bg-white rounded-3xl shadow-2xl relative">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          Contacta con Soporte
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="tu@mail.com"
            />
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Asunto
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              value={form.subject}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Asunto del mensaje"
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Mensaje
            </label>
            <textarea
              id="message"
              name="message"
              required
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              placeholder="Escribe aquí tu mensaje de soporte..."
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {sent && (
            <p className="text-green-600 text-sm">Mensaje enviado con éxito.</p>
          )}

          <motion.button
            type="submit"
            disabled={sending}
            whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
            whileTap={{ scale: 0.95 }}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-full shadow-lg transition ${
              sending ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600"
            }`}
          >
            <EnvelopeIcon className="w-5 h-5" />
            {sending ? "Enviando..." : "Enviar Mensaje"}
          </motion.button>
        </form>

        {/* <div className="mt-8 text-center text-gray-500 text-sm">
          <PhoneIcon className="inline w-5 h-5 mr-2" />
          Para asistencia urgente, llama a nuestro soporte. +123-123 123
        </div> */}
      </motion.div>
    </div>
  );
}
