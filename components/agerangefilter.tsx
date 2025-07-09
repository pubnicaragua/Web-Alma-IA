"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgeRangeFilterProps {
  label: string;
  minAge?: number;
  maxAge?: number;
  onRangeChange: (minAge: number | null, maxAge: number | null) => void;
  className?: string;
}

export function AgeRangeFilter({
  label,
  minAge,
  maxAge,
  onRangeChange,
  className,
}: AgeRangeFilterProps) {
  const [localMinAge, setLocalMinAge] = useState<string>(
    minAge?.toString() || ""
  );
  const [localMaxAge, setLocalMaxAge] = useState<string>(
    maxAge?.toString() || ""
  );
  const [sliderValues, setSliderValues] = useState<number[]>([
    minAge || 5,
    maxAge || 18,
  ]);

  const displayValue = () => {
    if (!minAge && !maxAge) return label;
    if (minAge && maxAge) return `${label}: ${minAge}-${maxAge} años`;
    if (minAge) return `${label}: Desde ${minAge} años`;
    if (maxAge) return `${label}: Hasta ${maxAge} años`;
    return label;
  };

  const handleApplyFilter = () => {
    const min = localMinAge ? parseInt(localMinAge) : null;
    const max = localMaxAge ? parseInt(localMaxAge) : null;

    // Validación básica
    if (min && max && min > max) {
      return; // No aplicar si min > max
    }

    onRangeChange(min, max);
    localStorage.removeItem("selectedTab");
  };

  const handleClearFilter = () => {
    setLocalMinAge("");
    setLocalMaxAge("");
    setSliderValues([5, 18]);
    onRangeChange(null, null);
    localStorage.removeItem("selectedTab");
  };

  const handleSliderChange = (values: number[]) => {
    setSliderValues(values);
    setLocalMinAge(values[0].toString());
    setLocalMaxAge(values[1].toString());
  };

  return (
    <div className={cn("w-full", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between overflow-hidden"
            aria-label={`Filtrar por ${label?.toLowerCase() || "edad"}`}
          >
            <span className="truncate">{displayValue()}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Filtrar por rango de edad</h4>
              {(minAge || maxAge) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilter}
                  className="h-6 px-2"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Slider para selección visual */}
            <div className="space-y-2">
              <label className="text-xs text-gray-600">
                Rango: {sliderValues[0]} - {sliderValues[1]} años
              </label>
              <Slider
                value={sliderValues}
                onValueChange={handleSliderChange}
                min={5}
                max={18}
                step={1}
                className="w-full"
              />
            </div>

            {/* Inputs manuales */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Edad mínima
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 8"
                  value={localMinAge}
                  onChange={(e) => setLocalMinAge(e.target.value)}
                  min="5"
                  max="18"
                  className="h-8"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Edad máxima
                </label>
                <Input
                  type="number"
                  placeholder="Ej: 15"
                  value={localMaxAge}
                  onChange={(e) => setLocalMaxAge(e.target.value)}
                  min="5"
                  max="18"
                  className="h-8"
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleApplyFilter} size="sm" className="flex-1">
                Aplicar filtro
              </Button>
              <Button
                onClick={handleClearFilter}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Limpiar
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
