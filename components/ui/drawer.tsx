"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  position?: "left" | "right"
}

export function Drawer({ isOpen, onClose, children, position = "right" }: DrawerProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)

    // Bloquear el scroll cuando el drawer está abierto
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Cerrar el drawer con la tecla Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  // No renderizar en el servidor
  if (!mounted) return null

  // Usar createPortal para renderizar fuera del flujo normal del DOM
  return createPortal(
    <>
      {/* Overlay con transición de opacidad */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer con animación de deslizamiento */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out",
          position === "right" ? "right-0" : "left-0",
          isOpen ? "transform-none" : position === "right" ? "translate-x-full" : "-translate-x-full",
        )}
      >
        {children}
      </div>
    </>,
    document.body,
  )
}

const DrawerPortal = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const DrawerOverlay = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className,
      )}
      {...props}
    />
  ),
)
DrawerOverlay.displayName = "DrawerOverlay"

const DrawerTrigger = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  ),
)
DrawerTrigger.displayName = "DrawerTrigger"

const DrawerClose = React.forwardRef<React.ElementRef<"button">, React.ComponentPropsWithoutRef<"button">>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className,
      )}
      {...props}
    />
  ),
)
DrawerClose.displayName = "DrawerClose"

const DrawerContent = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
DrawerContent.displayName = "DrawerContent"

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)
DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)
DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<React.ElementRef<"h2">, React.ComponentPropsWithoutRef<"h2">>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
  ),
)
DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef<React.ElementRef<"p">, React.ComponentPropsWithoutRef<"p">>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
)
DrawerDescription.displayName = "DrawerDescription"

export {
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
