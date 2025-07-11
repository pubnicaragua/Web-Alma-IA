"use client"

import type React from "react"

import { useState } from "react"
import { X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { useModal } from "@/lib/modal-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AddQuestionModalProps {
  onAddQuestion: (question: {
    pregunta: string
    tipoRespuesta: string
    opciones: string[]
    tipoDiagnostico: string
    prioridad: string
    sintomas: string
    palabrasClave: string
    curso: string
  }) => void
  isMobile?: boolean
}

export function AddQuestionModal({ onAddQuestion, isMobile = false }: AddQuestionModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false)
  const [pregunta, setPregunta] = useState("")
  const [tipoRespuesta, setTipoRespuesta] = useState("opcion_multiple")
  const [opciones, setOpciones] = useState<string[]>([""])
  const [tipoDiagnostico, setTipoDiagnostico] = useState("")
  const [prioridad, setPrioridad] = useState("normal")
  const [sintomas, setSintomas] = useState("")
  const [palabrasClave, setPalabrasClave] = useState("")
  const [curso, setCurso] = useState("")

  const handleAddOption = () => {
    setOpciones([...opciones, ""])
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...opciones]
    newOptions.splice(index, 1)
    setOpciones(newOptions)
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...opciones]
    newOptions[index] = value
    setOpciones(newOptions)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!pregunta || !tipoDiagnostico) {
      return
    }

    // Filtrar opciones vacías
    const filteredOptions = opciones.filter((option) => option.trim() !== "")

    // Enviar datos
    onAddQuestion({
      pregunta,
      tipoRespuesta,
      opciones: filteredOptions,
      tipoDiagnostico,
      prioridad,
      sintomas,
      palabrasClave,
      curso,
    })

    // Limpiar formulario y cerrar modal
    setPregunta("")
    setTipoRespuesta("opcion_multiple")
    setOpciones([""])
    setTipoDiagnostico("")
    setPrioridad("normal")
    setSintomas("")
    setPalabrasClave("")
    setCurso("")
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
        {!isMobile && <span>Agregar pregunta</span>}
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-6 pt-6 pb-0 sticky top-0 bg-white z-10">
            <div className="flex justify-between items-center w-full">
              <DialogTitle className="text-xl font-semibold">Agregar pregunta</DialogTitle>
              <DialogClose className="flex items-center justify-center h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </DialogClose>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pregunta" className="text-gray-700">
                Pregunta
              </Label>
              <Input
                id="pregunta"
                value={pregunta}
                onChange={(e) => setPregunta(e.target.value)}
                placeholder="Escribe la pregunta"
                required
                className="border-gray-300 w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipoRespuesta" className="text-gray-700">
                Tipo de respuesta
              </Label>
              <Select value={tipoRespuesta} onValueChange={setTipoRespuesta}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opcion_multiple">Opción múltiple</SelectItem>
                  <SelectItem value="texto_libre">Texto libre</SelectItem>
                  <SelectItem value="si_no">Sí/No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Opciones de respuesta */}
            <div className="space-y-2">
              {opciones.map((opcion, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"></div>
                  <Input
                    value={opcion}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={index === 0 ? "Respuesta" : ""}
                    className="border-gray-300 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
              >
                <span className="mr-1">Agregar opción o</span>
                <span className="text-indigo-600 font-medium">agregar "otros"</span>
              </button>
            </div>

            {/* Nuevo campo para Curso */}
            <div>
              <Label htmlFor="curso" className="text-gray-700">
                Curso
              </Label>
              <Input
                id="curso"
                value={curso}
                onChange={(e) => setCurso(e.target.value)}
                placeholder="Ingresa el curso"
                className="border-gray-300 mt-1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoDiagnostico" className="text-gray-700">
                Tipo de diagnóstico
              </Label>
              <Input
                id="tipoDiagnostico"
                value={tipoDiagnostico}
                onChange={(e) => setTipoDiagnostico(e.target.value)}
                placeholder="Ej: Ansiedad, Depresión, etc."
                required
                className="border-gray-300 w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prioridad" className="text-gray-700">
                Prioridad
              </Label>
              <Select value={prioridad} onValueChange={setPrioridad}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Baja</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sintomas" className="text-gray-700">
                Síntomas asociados
              </Label>
              <Input
                id="sintomas"
                value={sintomas}
                onChange={(e) => setSintomas(e.target.value)}
                placeholder="Describa los síntomas"
                className="border-gray-300 w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="palabrasClave" className="text-gray-700">
                Palabras clave
              </Label>
              <Input
                id="palabrasClave"
                value={palabrasClave}
                onChange={(e) => setPalabrasClave(e.target.value)}
                placeholder="Palabras clave separadas por comas"
                className="border-gray-300 w-full"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                Guardar pregunta
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
