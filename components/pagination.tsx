"use client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Determinar qué páginas mostrar
  const pages = []
  const maxPagesToShow = 3

  if (totalPages <= maxPagesToShow) {
    // Si hay pocas páginas, mostrar todas
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Siempre mostrar la primera página
    pages.push(1)

    // Mostrar páginas alrededor de la actual
    const startPage = Math.max(2, currentPage - 1)
    const endPage = Math.min(totalPages - 1, currentPage + 1)

    // Añadir elipsis si es necesario
    if (startPage > 2) {
      pages.push(-1) // -1 representa elipsis
    }

    // Añadir páginas intermedias
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Añadir elipsis si es necesario
    if (endPage < totalPages - 1) {
      pages.push(-2) // -2 representa elipsis
    }

    // Siempre mostrar la última página
    if (totalPages > 1) {
      pages.push(totalPages)
    }
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3"
      >
        Anterior
      </Button>

      {pages.map((page, index) => {
        if (page < 0) {
          // Elipsis
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2">
              ...
            </span>
          )
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className={cn("px-3", currentPage === page ? "bg-blue-500 hover:bg-blue-600" : "")}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3"
      >
        Siguiente
      </Button>
    </div>
  )
}
