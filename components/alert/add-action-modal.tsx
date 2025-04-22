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

interface AddActionModalProps {
  onAddAction: (action: {
    accionRealizada: string
    fechaCompromiso: string
    observaciones: string
  }) => void
}

export function AddActionModal({ onAddAction }: AddActionModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false)
  const [accionRealizada, setAccionRealizada] = useState("")
  const [fechaCompromiso, setFechaCompromiso] = useState("")
  const [observaciones, setObservaciones] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!accionRealizada) {
      return
    }

    // Enviar datos
    onAddAction({
      accionRealizada,
      fechaCompromiso,
      observaciones,
    })

    // Limpiar formulario y cerrar modal
    setAccionRealizada("")
    setFechaCompromiso("")
    setObservaciones("")
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
        Agregar nueva acción
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex justify-between items-center w-full">
              <DialogTitle className="text-xl font-semibold">Agregar nueva acción</DialogTitle>
              <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </DialogClose>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accionRealizada" className="text-gray-700">
                Acción realizada
              </Label>
              <Input
                id="accionRealizada"
                value={accionRealizada}
                onChange={(e) => setAccionRealizada(e.target.value)}
                placeholder="Describa la acción realizada"
                required
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaCompromiso" className="text-gray-700">
                Fecha de compromiso
              </Label>
              <Input
                id="fechaCompromiso"
                type="date"
                value={fechaCompromiso}
                onChange={(e) => setFechaCompromiso(e.target.value)}
                className="border-gray-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones" className="text-gray-700">
                Observaciones
              </Label>
              <Textarea
                id="observaciones"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Agregue observaciones adicionales"
                className="border-gray-300 min-h-[80px]"
              />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md">
              Agregar acción a la bitácora
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
