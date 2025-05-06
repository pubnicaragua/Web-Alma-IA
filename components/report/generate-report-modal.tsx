"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { FileText } from "lucide-react"

interface GenerateReportModalProps {
  isOpen: boolean
  onClose: () => void
  onGenerate: (reportData: ReportFormData) => void
}

export interface ReportFormData {
  title: string
  type: string
  course: string
  description: string
  dateRange: string
}

export function GenerateReportModal({ isOpen, onClose, onGenerate }: GenerateReportModalProps) {
  const [formData, setFormData] = useState<ReportFormData>({
    title: "",
    type: "",
    course: "",
    description: "",
    dateRange: "",
  })

  const handleChange = (field: keyof ReportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate(formData)
    // Reset form
    setFormData({
      title: "",
      type: "",
      course: "",
      description: "",
      dateRange: "",
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] border border-blue-200 rounded-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-blue-500" />
            Generar nuevo informe
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del informe</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Ej: Informe de rendimiento trimestral"
                required
                className="border border-gray-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de informe</Label>
                <Select value={formData.type} onValueChange={(value) => handleChange("type", value)} required>
                  <SelectTrigger id="type" className="border border-gray-200">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Rendimiento">Rendimiento</SelectItem>
                    <SelectItem value="Alertas">Alertas</SelectItem>
                    <SelectItem value="Emocional">Emocional</SelectItem>
                    <SelectItem value="Asistencia">Asistencia</SelectItem>
                    <SelectItem value="Comportamiento">Comportamiento</SelectItem>
                    <SelectItem value="Evaluaciones">Evaluaciones</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Curso</Label>
                <Select value={formData.course} onValueChange={(value) => handleChange("course", value)} required>
                  <SelectTrigger id="course" className="border border-gray-200">
                    <SelectValue placeholder="Seleccionar curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1°A">1°A</SelectItem>
                    <SelectItem value="2°A">2°A</SelectItem>
                    <SelectItem value="3°B">3°B</SelectItem>
                    <SelectItem value="4°A">4°A</SelectItem>
                    <SelectItem value="5°C">5°C</SelectItem>
                    <SelectItem value="6°B">6°B</SelectItem>
                    <SelectItem value="Todos">Todos los cursos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">Período</Label>
              <Select value={formData.dateRange} onValueChange={(value) => handleChange("dateRange", value)} required>
                <SelectTrigger id="dateRange" className="border border-gray-200">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Última semana">Última semana</SelectItem>
                  <SelectItem value="Último mes">Último mes</SelectItem>
                  <SelectItem value="Último trimestre">Último trimestre</SelectItem>
                  <SelectItem value="Año actual">Año actual</SelectItem>
                  <SelectItem value="Personalizado">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Añade detalles adicionales sobre el informe..."
                className="min-h-[100px] border border-gray-200"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" className="border border-gray-200" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
              Generar informe
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
