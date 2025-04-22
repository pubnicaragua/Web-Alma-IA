"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useModal } from "@/lib/modal-utils"

interface AddAlertModalProps {
  onAddAlert: (alert: {
    tipo: string
    descripcion: string
    fecha: string
  }) => void
}

export function AddAlertModal({ onAddAlert }: AddAlertModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false)
  const [tipo, setTipo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fecha, setFecha] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!tipo || !descripcion || !fecha) {
      return
    }

    // Enviar datos
    onAddAlert({
      tipo,
      descripcion,
      fecha,
    })

    // Limpiar formulario y cerrar modal
    setTipo("")
    setDescripcion("")
    setFecha("")
    onClose()
  }

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
          className="mr-2"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        Agregar alerta manual
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Agregar alerta manual</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </DialogClose>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de alerta</Label>
              <Input
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                placeholder="Seleccione el tipo de alerta"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describa la situación"
                required
                className="min-h-[100px]"
              />
              <p className="text-xs text-gray-500">
                * Si son más de un involucrado en la alerta, mencionar el RUT de cada involucrado.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha del suceso</Label>
              <Input id="fecha" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Agregar alerta manual
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
