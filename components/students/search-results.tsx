"use client"

import { StudentSearchResult } from "@/services/header-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SearchResultsProps {
  results: StudentSearchResult[]
}

export function SearchResults({ results }: SearchResultsProps) {
  const router = useRouter()

  const handleViewStudent = (studentId: number) => {
    router.push(`/alumnos/${studentId}`)
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No se encontraron resultados</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{results.length} resultados encontrados</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Grado</TableHead>
              <TableHead>Sección</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.nombre} {student.apellido}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{student.grado || 'N/A'}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{student.seccion || 'N/A'}</Badge>
                </TableCell>
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
      </CardContent>
    </Card>
  )
}
