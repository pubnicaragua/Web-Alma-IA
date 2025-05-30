"use client"

import { Student } from "@/types/student"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

interface StudentsTableProps {
  students: Student[]
}

export function StudentsTable({ students }: StudentsTableProps) {
  const router = useRouter()

  const handleViewStudent = (studentId: number) => {
    router.push(`/alumnos/${studentId}`)
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay estudiantes registrados</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Grado</TableHead>
            <TableHead>Sección</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {student.url_foto_perfil ? (
                    <div className="h-8 w-8 relative rounded-full overflow-hidden">
                      <Image
                        src={student.url_foto_perfil}
                        alt={`${student.nombres} ${student.apellidos}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">
                        {student.nombres?.[0]}{student.apellidos?.[0]}
                      </span>
                    </div>
                  )}
                  <span>{student.nombres} {student.apellidos}</span>
                </div>
              </TableCell>
              <TableCell>{student.codigo_estudiante || 'N/A'}</TableCell>
              <TableCell>{student.grado || 'N/A'}</TableCell>
              <TableCell>{student.seccion || 'N/A'}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewStudent(student.id)}
                >
                  Ver Detalles
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
