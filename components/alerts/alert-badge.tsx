"use client";
import { Badge } from "@/components/ui/badge";

interface AlertBadgeProps {
  type: "type" | "priority" | "status";
  value: string;
}

export const AlertBadge = ({ type, value }: AlertBadgeProps) => {
  const getBadgeProps = () => {
    switch (type) {
      case "type":
        return {
          className: `whitespace-nowrap px-3 py-1 ${
            value === "SOS Alma" || value === "Roja"
              ? "bg-red-500"
              : value === "Amarilla"
              ? "bg-yellow-400"
              : value === "Denuncias"
              ? "bg-purple-600"
              : "bg-blue-500"
          }`,
          children: value,
        };
      case "priority":
        return {
          variant: "outline" as const,
          className: `whitespace-nowrap px-3 py-1 text-center ${
            value === "Alta"
              ? "border-red-500 text-red-500"
              : value === "Media"
              ? "border-yellow-500 text-yellow-500"
              : "border-green-500 text-green-500"
          }`,
          children: value,
        };
      case "status":
        return {
          variant: "outline" as const,
          className: `whitespace-nowrap px-3 py-1 text-center ${
            value === "Pendiente"
              ? "border-red-500 text-red-500"
              : value === "En curso"
              ? "border-blue-500 text-blue-500"
              : "border-green-500 text-green-500"
          }`,
          children: value,
        };
      default:
        return { children: value };
    }
  };

  return <Badge {...getBadgeProps()} />;
};
