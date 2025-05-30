"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { ProfileData } from "@/services/profile-service"
import { cn } from "@/lib/utils"

interface FormErrors {
  nombres?: string
  apellidos?: string
  // email?: string
  // fecha_nacimiento?: string
  // telefono_contacto?: string
  // url_foto_perfil?: string
}

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profileData: ProfileData
  onSave: (data: ProfileData) => Promise<void>
}

export function EditProfileModal({ isOpen, onClose, profileData, onSave }: EditProfileModalProps) {
  const [formData, setFormData] = useState<ProfileData>(profileData)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (isOpen) {
      setFormData(profileData)
    }
  }, [isOpen, profileData])

  const validateField = (name: string, value: string) => {
    let error = ''

    switch (name) {
      case 'nombres':
      case 'apellidos':
        if (!value.trim()) error = 'Este campo es requerido'
        break
      // case 'email':
      //   if (!value) {
      //     error = 'El correo es requerido'
      //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      //     error = 'Correo electrónico inválido'
      //   }
      //   break
      // case 'fecha_nacimiento':
      //   if (!value) error = 'La fecha de nacimiento es requerida'
      //   break
      // case 'telefono_contacto':
      //   if (!value) {
      //     error = 'El teléfono es requerido'
      //   } else if (!/^[0-9+\-\s()]+$/.test(value)) {
      //     error = 'Formato de teléfono inválido'
      //   }
      //   break
      // case 'url_foto_perfil':
      //   if (value && !/^https?:\/\//.test(value)) {
      //     error = 'La URL debe comenzar con http:// o https://'
      //   }
      //   break
    }

    return error
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Validar el campo que está cambiando
    const error = validateField(name, value)

    // Actualizar errores
    setErrors(prev => ({
      ...prev,
      [name]: error || undefined
    }))

    // Actualizar datos del formulario
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    // Validar campos requeridos
    if (!formData.nombres?.trim()) {
      newErrors.nombres = 'Los nombres son requeridos'
      isValid = false
    }

    if (!formData.apellidos?.trim()) {
      newErrors.apellidos = 'Los apellidos son requeridos'
      isValid = false
    }

    // if (!formData.email) {
    //   newErrors.email = 'El correo es requerido'
    //   isValid = false
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = 'Correo electrónico inválido'
    //   isValid = false
    // }

    // if (!formData.fecha_nacimiento) {
    //   newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida'
    //   isValid = false
    // }

    // if (formData.url_foto_perfil && !/^https?:\/\//.test(formData.url_foto_perfil)) {
    //   newErrors.url_foto_perfil = 'La URL debe comenzar con http:// o https://'
    //   isValid = false
    // }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </button>
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-lg font-semibold">Editar perfil</DialogTitle>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="nombres">Nombres</Label>
                  {errors.nombres && (
                    <span className="text-xs text-red-500">{errors.nombres}</span>
                  )}
                </div>
                <Input
                  id="nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateField(e.target.name, e.target.value)
                    setErrors(prev => ({ ...prev, nombres: error }))
                  }}
                  className={cn(errors.nombres && 'border-red-500 focus-visible:ring-red-500')}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  {errors.apellidos && (
                    <span className="text-xs text-red-500">{errors.apellidos}</span>
                  )}
                </div>
                <Input
                  id="apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const error = validateField(e.target.name, e.target.value)
                    setErrors(prev => ({ ...prev, apellidos: error }))
                  }}
                  className={cn(errors.apellidos && 'border-red-500 focus-visible:ring-red-500')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre_social">Nombre social (opcional)</Label>
                <Input
                  id="nombre_social"
                  name="nombre_social"
                  value={formData.nombre_social || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="email">Correo electrónico</Label>
                  {/* {errors.email && (
                    <span className="text-xs text-red-500">{errors.email}</span>
                  )} */}
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  // onBlur={(e) => {
                  //   const error = validateField(e.target.name, e.target.value)
                  //   setErrors(prev => ({ ...prev, email: error }))
                  // }}
                  // className={cn(errors.email && 'border-red-500 focus-visible:ring-red-500')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                  {/* {errors.fecha_nacimiento && (
                    <span className="text-xs text-red-500">{errors.fecha_nacimiento}</span>
                  )} */}
                </div>
                <Input
                  id="fecha_nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  // onBlur={(e) => {
                  //   const error = validateField(e.target.name, e.target.value)
                  //   setErrors(prev => ({ ...prev, fecha_nacimiento: error }))
                  // }}
                  // className={cn(errors.fecha_nacimiento && 'border-red-500 focus-visible:ring-red-500')}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="telefono_contacto">Teléfono de contacto</Label>
                  {/* {errors.telefono_contacto && (
                    <span className="text-xs text-red-500">{errors.telefono_contacto}</span>
                  )} */}
                </div>
                <Input
                  id="telefono_contacto"
                  name="telefono_contacto"
                  type="tel"
                  value={formData.telefono_contacto}
                  onChange={handleChange}
                  // onBlur={(e) => {
                  //   const error = validateField(e.target.name, e.target.value)
                  //   setErrors(prev => ({ ...prev, telefono_contacto: error }))
                  // }}
                  // className={cn(errors.telefono_contacto && 'border-red-500 focus-visible:ring-red-500')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="url_foto_perfil">URL de la foto de perfil (opcional)</Label>
                {/* {errors.url_foto_perfil && (
                  <span className="text-xs text-red-500">{errors.url_foto_perfil}</span>
                )} */}
              </div>
              <Input
                id="url_foto_perfil"
                name="url_foto_perfil"
                type="url"
                value={formData.url_foto_perfil || ''}
                onChange={handleChange}
                // onBlur={(e) => {
                //   const error = validateField(e.target.name, e.target.value)
                //   setErrors(prev => ({ ...prev, url_foto_perfil: error }))
                // }}
                // placeholder="https://ejemplo.com/foto.jpg"
                // className={cn(errors.url_foto_perfil && 'border-red-500 focus-visible:ring-red-500')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="encripted_password">Nueva contraseña (dejar en blanco para no cambiar)</Label>
              <Input
                id="encripted_password"
                name="encripted_password"
                type="password"
                value={formData.encripted_password || ''}
                onChange={handleChange}
                placeholder="••••••••"
                minLength={8}
              />
              {formData.encripted_password && formData.encripted_password.length < 8 && (
                <p className="text-xs text-muted-foreground mt-1">
                  La contraseña debe tener al menos 8 caracteres
                </p>
              )}
            </div>
          </div>
          <div className="border-t px-6 py-4">
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar cambios'
                )}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
