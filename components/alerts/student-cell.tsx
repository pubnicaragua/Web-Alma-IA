"use client";
import Image from "next/image";
import { type Alert } from "@/services/alerts-service";

interface StudentCellProps {
  alert: Alert;
  onClick: () => void;
}

export const StudentCell = ({ alert, onClick }: StudentCellProps) => (
  <div
    className="flex items-center space-x-3 cursor-pointer text-center hover:text-blue-500"
    onClick={onClick}
  >
    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
      <Image
        src={alert.student?.avatar || "/placeholder.svg"}
        alt={alert.student?.name || "image"}
        width={32}
        height={32}
        className="w-full h-full object-cover"
      />
    </div>
    <span className="text-center">{alert?.student?.name}</span>
  </div>
);
