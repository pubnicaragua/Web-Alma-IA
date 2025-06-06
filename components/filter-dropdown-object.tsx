"use client"

import { Check, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface FilterDropdownObjectProps<T> {
  label: string
  options: T[]
  value: T
  onChange: (value: T) => void
  labelKey: keyof T
  idKey?: keyof T
  isEqual?: (a: T, b: T) => boolean
  className?: string
}

export function FilterDropdownObject<T>({
  label,
  options,
  value,
  onChange,
  labelKey,
  idKey,
  isEqual = (a, b) => a === b,
  className,
}: FilterDropdownObjectProps<T>) {
  const getLabel = (item: T) => String(item[labelKey])
  const getKey = (item: T) => idKey ? item[idKey] : item[labelKey]

const labelValue = value ? getLabel(value) : null
const displayValue = !labelValue || labelValue === "Todos"
  ? label
  : `${label}: ${labelValue}`

  return (
    <div className={cn("w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between overflow-hidden"
            aria-label={`Filtrar por ${label.toLowerCase()}`}
          >
            <span className="truncate">{displayValue}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[200px] p-1">
          {options.map((option) => {
            const selected = isEqual(option, value)
            const key = String(getKey(option))
            return (
              <DropdownMenuItem
                key={key}
                onSelect={() => onChange(option)}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm",
                  selected && "bg-accent font-medium"
                )}
              >
                <span className={cn("truncate", selected && "font-medium")}>
                  {getLabel(option)}
                </span>
                {selected && <Check className="ml-2 h-4 w-4" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
