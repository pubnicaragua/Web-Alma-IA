"use client"

import type React from "react"

import { useState } from "react"
import { X, ChevronDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useModal } from "@/lib/modal-utils"

interface EditQuestionModalProps {
  question: {
    id: string
    question: string
    options: string[]
    responseType: string
    diagnostic: string
    priority: string
    timeOfDay: string
    symptoms: string
    keywords: string
  }
  onSave: (updatedQuestion: {
    id: string
    question: string
    options: string[]
    responseType: string
    diagnostic: string
    priority: string
    timeOfDay: string
    symptoms: string
    keywords: string
  }) => void
}

export function EditQuestionModal({ question, onSave }: EditQuestionModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false)
  const [formData, setFormData] = useState({
    id: question.id,
    question: question.question,
    options: [...question.options],
    responseType: question.responseType,
    diagnostic: question.diagnostic,
    priority: question.priority,
    timeOfDay: question.timeOfDay,
    symptoms: question.symptoms,
    keywords: question.keywords,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options]
    newOptions[index] = value
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const handleAddOption = () => {
    setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }))
  }

  const handleRemoveOption = (index: number) => {
    const newOptions = [...formData.options]
    newOptions.splice(index, 1)
    setFormData((prev) => ({ ...prev, options: newOptions }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.question || !formData.diagnostic) {
      return
    }

    // Filtrar opciones vacías
    const filteredOptions = formData.options.filter((option) => option.trim() !== "")

    // Enviar datos actualizados
    onSave({
      ...formData,
      options: filteredOptions,
    })

    // Cerrar modal
    onClose()
  }

  return (
    <>
      <Button className="bg-blue-500 hover:bg-blue-600" onClick={onOpen}>
        Editar pregunta
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
          <DialogHeader className="px-6 pt-6 pb-0">
            <div className="flex justify-between items-center w-full">
              <DialogTitle className="text-xl font-semibold">Editar pregunta</DialogTitle>
              <DialogClose className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar</span>
              </DialogClose>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <Label htmlFor="question" className="text-gray-700">
                  Pregunta
                </Label>
                <Input
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="Escribe la pregunta"
                  required
                  className="border-gray-300 mt-1"
                />
              </div>
              <div className="w-48">
                <div className="flex items-center justify-between">
                  <Label htmlFor="responseType" className="text-gray-700">
                    {formData.responseType}
                  </Label>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="border-b border-gray-300 mt-1"></div>
              </div>
            </div>

            {/* Opciones de respuesta */}
            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full border border-gray-300 flex-shrink-0"></div>
                  <Input
                    value={option}
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

            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <Label htmlFor="diagnostic" className="text-gray-700">
                  Tipo de diagnóstico
                </Label>
                <Input
                  id="diagnostic"
                  name="diagnostic"
                  value={formData.diagnostic}
                  onChange={handleChange}
                  placeholder="Selecciona el tipo de diagnóstico"
                  required
                  className="border-gray-300 mt-1"
                />
              </div>
              <div className="w-48">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-700 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Prioridad y horario
                  </Label>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
                <div className="border-b border-gray-300 mt-1"></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="priority" className="text-gray-700">
                  Prioridad
                </Label>
                <Select value={formData.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                  <SelectTrigger id="priority" className="border-gray-300 mt-1">
                    <SelectValue placeholder="Selecciona prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 (Alta)</SelectItem>
                    <SelectItem value="2">2 (Media)</SelectItem>
                    <SelectItem value="3">3 (Baja)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeOfDay" className="text-gray-700">
                  Horario
                </Label>
                <Select value={formData.timeOfDay} onValueChange={(value) => handleSelectChange("timeOfDay", value)}>
                  <SelectTrigger id="timeOfDay" className="border-gray-300 mt-1">
                    <SelectValue placeholder="Selecciona horario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AM">AM</SelectItem>
                    <SelectItem value="PM">PM</SelectItem>
                    <SelectItem value="Ambos">Ambos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="symptoms" className="text-gray-700">
                Síntomas
              </Label>
              <Textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Ingresa los síntomas relacionados"
                className="border-gray-300 mt-1 min-h-[100px]"
              />
            </div>

            <div>
              <Label htmlFor="keywords" className="text-gray-700">
                Palabras clave
              </Label>
              <Textarea
                id="keywords"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                placeholder="Ingresa palabras clave separadas por comas"
                className="border-gray-300 mt-1"
              />
            </div>

            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md">
              Guardar cambios
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
