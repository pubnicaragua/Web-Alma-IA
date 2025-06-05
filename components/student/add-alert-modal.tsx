"use client"

import type React from "react"

import { useState } from "react"
import { X, Plus, AlertTriangle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useModal } from "@/lib/modal-utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface AddAlertModalProps {
  onAddAlert: (alert: {
    alumno_alerta_id:number
    tipo: string
    descripcion: string
    fecha: string
    prioridad: string
    responsable: string
  }) => void
  currentUser?: string
}

export function AddAlertModal({ onAddAlert, currentUser = "Usuario actual" }: AddAlertModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false)
  const [tipo, setTipo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [fecha, setFecha] = useState("")
  const [prioridad, setPrioridad] = useState("Media")
  const [responsable, setResponsable] = useState(currentUser)
  const isMobile = useIsMobile()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!tipo || !descripcion || !fecha || !prioridad || !responsable) {
      return
    }

    // Enviar datos
    onAddAlert({
      tipo,
      descripcion,
      fecha,
      prioridad,
      responsable,
    })

    // Limpiar formulario y cerrar modal
    setTipo("")
    setDescripcion("")
    setFecha("")
    setPrioridad("Media")
    setResponsable(currentUser)
    onClose()
  }

  // Opciones para los selectores
  const tiposAlerta = [
    { value: "SOS Alma", color: "bg-red-100 text-red-800" },
    { value: "Alerta amarilla", color: "bg-yellow-100 text-yellow-800" },
    { value: "Denuncia", color: "bg-purple-100 text-purple-800" },
    { value: "Alerta Naranja", color: "bg-orange-100 text-orange-800" },
  ]

  const prioridadesAlerta = [
    { value: "Baja", color: "bg-green-100 text-green-800" },
    { value: "Media", color: "bg-blue-100 text-blue-800" },
    { value: "Alta", color: "bg-red-100 text-red-800" },
  ]

  return (
    <>
      <Button className="bg-blue-500 hover:bg-blue-600" onClick={onOpen}>
        <Plus className={isMobile ? "" : "mr-2"} size={16} />
        {!isMobile && <span>Agregar alerta manual</span>}
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-white z-10 pb-2">
            <DialogTitle className="text-xl font-semibold">Agregar alerta manual</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground flex items-center justify-center">
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </DialogClose>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo" className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-blue-500" />
                Tipo de alerta
              </Label>
              <Select value={tipo} onValueChange={setTipo} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el tipo de alerta" />
                </SelectTrigger>
                <SelectContent>
                  {tiposAlerta.map((tipoAlerta) => (
                    <SelectItem key={tipoAlerta.value} value={tipoAlerta.value}>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tipoAlerta.color} mr-2`}>
                          {tipoAlerta.value}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridad" className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                Nivel de prioridad
              </Label>
              <Select value={prioridad} onValueChange={setPrioridad} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione el nivel de prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {prioridadesAlerta.map((prioridadAlerta) => (
                    <SelectItem key={prioridadAlerta.value} value={prioridadAlerta.value}>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadAlerta.color} mr-2`}>
                          {prioridadAlerta.value}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsable">Responsable</Label>
              <Input
                id="responsable"
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                placeholder="Nombre del responsable"
                required
              />
              <p className="text-xs text-gray-500">* Por defecto, se asigna al usuario actual como responsable.</p>
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
