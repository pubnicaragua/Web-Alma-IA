"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useModal } from "@/lib/modal-utils"

export interface AddTeacherModalProps {
  onAddTeacher: (teacher: {
    tipo_documento: string
    numero_documento: string
    nombres: string
    apellidos: string
    genero_id: number
    estado_civil_id: number
    fecha_nacimiento: string
    especialidad: string
    email: string
    phone: string
    estado: string
    colegio_id: number
  }) => void
  isMobile?: boolean
}

export function AddTeacherModal({ onAddTeacher, isMobile = false }: AddTeacherModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false)
  const [formData, setFormData] = useState({
    tipo_documento: "DNI",
    numero_documento: "",
    nombres: "",
    apellidos: "",
    genero_id: 1, // 1: Masculino, 2: Femenino
    estado_civil_id: 1, // 1: Soltero/a, 2: Casado/a, 3: Viudo/a
    fecha_nacimiento: "",
    especialidad: "",
    email: "",
    phone: "",
    estado:'activo',
    colegio_id: Number(localStorage.getItem("selectedSchool"))
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación básica
    if (!formData.nombres || !formData.apellidos || !formData.numero_documento) {
      return
    }

    // Enviar datos
    onAddTeacher(formData)

    // Limpiar formulario y cerrar modal
    setFormData({
      tipo_documento: "DNI",
      numero_documento: "",
      nombres: "",
      apellidos: "",
      genero_id: 1,
      estado_civil_id: 1,
      fecha_nacimiento: "",
      especialidad: "",
      email: "",
      phone: "",
      estado:'activo',
      colegio_id: Number(localStorage.getItem("selectedSchool"))
    })
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        {!isMobile && <span>Agregar docente</span>}
      </Button>

      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Agregar docente</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </DialogClose>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_documento">Tipo de Documento</Label>
              <Select 
                value={formData.tipo_documento} 
                onValueChange={(value) => handleSelectChange("tipo_documento", value)}
              >
                <SelectTrigger id="tipo_documento">
                  <SelectValue placeholder="Seleccione tipo de documento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DNI">DNI</SelectItem>
                  <SelectItem value="Pasaporte">Pasaporte</SelectItem>
                  <SelectItem value="Carné de Extranjería">Carné de Extranjería</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numero_documento">Número de Documento</Label>
              <Input
                id="numero_documento"
                name="numero_documento"
                value={formData.numero_documento}
                onChange={handleChange}
                placeholder="Número de documento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Nombres"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellidos">Apellidos</Label>
              <Input
                id="apellidos"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Apellidos"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genero_id">Género</Label>
              <Select 
                value={formData.genero_id.toString()} 
                onValueChange={(value) => handleSelectChange("genero_id", value)}
              >
                <SelectTrigger id="genero_id">
                  <SelectValue placeholder="Seleccione género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Masculino</SelectItem>
                  <SelectItem value="2">Femenino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado_civil_id">Estado Civil</Label>
              <Select 
                value={formData.estado_civil_id.toString()} 
                onValueChange={(value) => handleSelectChange("estado_civil_id", value)}
              >
                <SelectTrigger id="estado_civil_id">
                  <SelectValue placeholder="Seleccione estado civil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Soltero/a</SelectItem>
                  <SelectItem value="2">Casado/a</SelectItem>
                  <SelectItem value="3">Viudo/a</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fecha_nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="especialidad">Especialidad</Label>
              <Input
                id="especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                placeholder="Ej: Lenguaje, Matemáticas, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="Número de teléfono" 
              />
            </div>

            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
              Guardar docente
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
