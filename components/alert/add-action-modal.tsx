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
import { useToast } from "@/hooks/use-toast"
import { createAccionAlert, CreateAccionAlertParams } from "@/services/alerts-service"

interface AddActionModalProps {
  alumnoAlertaId: number
  alumnoId: number
  addAccionBitacora: (data: CreateAccionAlertParams) => Promise<void>
  isMobile?: boolean
}

export function AddActionModal({ alumnoAlertaId, alumnoId, addAccionBitacora, isMobile = false }: AddActionModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false)
  const [planAccion, setPlanAccion] = useState("")
  const [fechaCompromiso, setFechaCompromiso] = useState("")
  const [fechaRealizacion, setFechaRealizacion] = useState("")
  const [urlArchivo, setUrlArchivo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!planAccion || !fechaCompromiso || !fechaRealizacion) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      
      // Formatear fechas a ISO string
      const fechaCompromisoISO = new Date(fechaCompromiso).toISOString()
      const fechaRealizacionISO = new Date(fechaRealizacion || new Date()).toISOString()

      // Crear la acción de alerta
      await addAccionBitacora({
        alumno_alerta_id: alumnoAlertaId,
        alumno_id: alumnoId,
        plan_accion: planAccion,
        fecha_compromiso: fechaCompromisoISO,
        fecha_realizacion: fechaRealizacionISO,
        url_archivo: urlArchivo || undefined,
      })

      // Notificar éxito
      toast({
        title: "Acción registrada",
        description: "La acción se ha registrado correctamente",
      })

      // Limpiar formulario
      setPlanAccion("")
      setFechaCompromiso("")
      setFechaRealizacion("")
      setUrlArchivo("")
      
      // Cerrar modal y notificar al componente padre
      onClose()
    } catch (error) {
      console.error("Error al crear la acción:", error)
      toast({
        title: "Error",
        description: "No se pudo registrar la acción. Por favor, intente nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
          className={isMobile ? "" : "mr-2"}
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
        {!isMobile && <span>Agregar nueva acción</span>}
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
              <Label htmlFor="planAccion" className="text-gray-700">
                Plan de acción *
              </Label>
              <Textarea
                id="planAccion"
                value={planAccion}
                onChange={(e) => setPlanAccion(e.target.value)}
                placeholder="Describa el plan de acción a realizar"
                required
                className="border-gray-300 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaCompromiso" className="text-gray-700">
                  Fecha de compromiso *
                </Label>
                <Input
                  id="fechaCompromiso"
                  type="datetime-local"
                  value={fechaCompromiso}
                  onChange={(e) => setFechaCompromiso(e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fechaRealizacion" className="text-gray-700">
                  Fecha de realización *
                </Label>
                <Input
                  id="fechaRealizacion"
                  type="datetime-local"
                  value={fechaRealizacion}
                  onChange={(e) => setFechaRealizacion(e.target.value)}
                  className="border-gray-300"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urlArchivo" className="text-gray-700">
                URL del archivo (opcional)
              </Label>
              <Input
                id="urlArchivo"
                type="url"
                value={urlArchivo}
                onChange={(e) => setUrlArchivo(e.target.value)}
                placeholder="https://ejemplo.com/archivo.pdf"
                className="border-gray-300"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : (
                'Agregar acción a la bitácora'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
