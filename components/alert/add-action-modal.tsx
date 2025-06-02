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
    plan_accion: string  
    fecha_compromiso: string  
    fecha_realizacion?: string  
    url_archivo?: string  
    // observaciones: string // ELIMINAR ESTA LÍNEA  
  }) => void  
  isMobile?: boolean  
}  
  
export function AddActionModal({ onAddAction, isMobile = false }: AddActionModalProps) {  
  const { isOpen, onOpen, onClose } = useModal(false)  
  const [planAccion, setPlanAccion] = useState("")  
  const [fechaCompromiso, setFechaCompromiso] = useState("")  
  const [fechaRealizacion, setFechaRealizacion] = useState("")  
  const [urlArchivo, setUrlArchivo] = useState("")  
  // const [observaciones, setObservaciones] = useState("") // ELIMINAR ESTA LÍNEA  
  const [errors, setErrors] = useState<{[key: string]: string}>({})  
  
  const validateForm = () => {  
    const newErrors: {[key: string]: string} = {}  
      
    if (!planAccion.trim()) {  
      newErrors.planAccion = "El plan de acción es obligatorio"  
    }  
      
    setErrors(newErrors)  
    return Object.keys(newErrors).length === 0  
  }  
  
  const handleSubmit = (e: React.FormEvent) => {  
    e.preventDefault()  
  
    if (!validateForm()) {  
      return  
    }  
  
    // Enviar datos  
    onAddAction({  
      plan_accion: planAccion,  
      fecha_compromiso: fechaCompromiso,  
      fecha_realizacion: fechaRealizacion || undefined,  
      url_archivo: urlArchivo || undefined,  
      // observaciones, // ELIMINAR ESTA LÍNEA  
    })  
  
    // Limpiar formulario y cerrar modal  
    setPlanAccion("")  
    setFechaCompromiso("")  
    setFechaRealizacion("")  
    setUrlArchivo("")  
    // setObservaciones("") // ELIMINAR ESTA LÍNEA  
    setErrors({})  
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
              <DialogTitle className="text-xl font-semibold">Agregar nueva acción a la bitácora</DialogTitle>  
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
                className={`border-gray-300 min-h-[80px] ${errors.planAccion ? 'border-red-500' : ''}`}  
              />  
              {errors.planAccion && (  
                <p className="text-red-500 text-sm">{errors.planAccion}</p>  
              )}  
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
              <Label htmlFor="fechaRealizacion" className="text-gray-700">  
                Fecha de realización  
              </Label>  
              <Input  
                id="fechaRealizacion"  
                type="date"  
                value={fechaRealizacion}  
                onChange={(e) => setFechaRealizacion(e.target.value)}  
                className="border-gray-300"  
              />  
            </div>  
  
            <div className="space-y-2">  
              <Label htmlFor="urlArchivo" className="text-gray-700">  
                URL del archivo  
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
  
            {/* ELIMINAR ESTE BLOQUE COMPLETO DE OBSERVACIONES  
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
            */}  
  
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md">  
              Agregar acción a la bitácora  
            </Button>  
          </form>  
        </DialogContent>  
      </Dialog>  
    </>  
  )  
}