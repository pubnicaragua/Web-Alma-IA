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

interface AddTeacherModalProps {
  onAddTeacher: (teacher: {
    name: string
    rut: string
    email: string
    phone: string
    birthDate: string
    position: string
    subject: string
    tutorCourse: string
    type: string
    courses: string
  }) => void
}

export function AddTeacherModal({ onAddTeacher }: AddTeacherModalProps) {
  const { isOpen, onOpen, onClose } = useModal(false)
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    email: "",
    phone: "",
    birthDate: "",
    position: "",
    subject: "",
    tutorCourse: "",
    type: "",
    courses: "",
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
    if (!formData.name || !formData.rut || !formData.email) {
      return
    }

    // Enviar datos
    onAddTeacher(formData)

    // Limpiar formulario y cerrar modal
    setFormData({
      name: "",
      rut: "",
      email: "",
      phone: "",
      birthDate: "",
      position: "",
      subject: "",
      tutorCourse: "",
      type: "",
      courses: "",
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
          className="mr-2"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Agregar docente
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
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut">RUT</Label>
              <Input id="rut" name="rut" value={formData.rut} onChange={handleChange} placeholder="Nombre" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo institucional</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nombre"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Nombre" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de nacimiento</Label>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange}
                placeholder="Nombre"
              />
            </div>

            <div className="pt-4 pb-2">
              <h3 className="text-lg font-medium">Rol y asignación</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                placeholder="Nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Materia principal</Label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tutorCourse">Curso que tutoriza (si aplica)</Label>
              <Input
                id="tutorCourse"
                name="tutorCourse"
                value={formData.tutorCourse}
                onChange={handleChange}
                placeholder="Nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">¿Principal o secundario?</Label>
              <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Nombre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Principal">Principal</SelectItem>
                  <SelectItem value="Secundario">Secundario</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courses">Cursos en los que enseña</Label>
              <Input
                id="courses"
                name="courses"
                value={formData.courses}
                onChange={handleChange}
                placeholder="Nombre"
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
