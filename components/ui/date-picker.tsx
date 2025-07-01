"use client";
import React, { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { format, parse, isBefore, isSameDay } from "date-fns";
import { es } from "date-fns/locale";

interface DatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onChange,
  placeholderText = "Seleccione una fecha",
  className = "",
  minDate,
  maxDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [month, setMonth] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      setInputValue(format(selected, "dd/MM/yyyy"));
      setMonth(selected);
    } else {
      setInputValue("");
    }
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDateClick = (day: Date) => {
    onChange(day);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length === 10) {
      try {
        const parsedDate = parse(value, "dd/MM/yyyy", new Date());
        if (!isNaN(parsedDate.getTime())) {
          onChange(parsedDate);
          return;
        }
      } catch (error) {
        console.error("Error al parsear fecha:", error);
      }
    }

    if (value === "") {
      onChange(null);
    }
  };

  const generateDays = () => {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const startDay = startDate.getDay();
    const daysInMonth = endDate.getDate();

    const days = [];
    const today = new Date();

    const prevMonthEnd = new Date(
      month.getFullYear(),
      month.getMonth(),
      0
    ).getDate();
    for (let i = 0; i < startDay; i++) {
      const day = prevMonthEnd - startDay + i + 1;
      days.push(
        <div
          key={`prev-${day}`}
          className="text-gray-400 p-2 text-center cursor-default"
        >
          {day}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const isDisabled =
        (minDate && isBefore(date, minDate)) ||
        (maxDate && isBefore(maxDate, date));

      const isSelected = selected && isSameDay(date, selected);
      const isToday = isSameDay(date, today);

      days.push(
        <div
          key={`current-${day}`}
          className={`p-2 text-center cursor-pointer rounded-full
            ${isSelected ? "bg-blue-500 text-white" : ""}
            ${isToday && !isSelected ? "border border-blue-300" : ""}
            ${
              isDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "hover:bg-gray-100"
            }
          `}
          onClick={() => !isDisabled && handleDateClick(date)}
        >
          {day}
        </div>
      );
    }

    const daysToAdd = 42 - days.length;
    for (let day = 1; day <= daysToAdd; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="text-gray-400 p-2 text-center cursor-default"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const navigateMonth = (direction: number) => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + direction, 1));
  };

  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholderText}
          className="w-full p-2 border rounded-md pl-10"
          onFocus={() => setIsOpen(true)}
        />
        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-64 bg-white border rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              {"<"}
            </button>
            <div className="font-medium">
              {format(month, "MMMM yyyy", { locale: es })}
            </div>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 rounded hover:bg-gray-100"
            >
              {">"}
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
              <div key={day} className="text-center font-medium text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">{generateDays()}</div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                onChange(null);
                setInputValue("");
              }}
              className="text-sm text-blue-500 hover:text-blue-700 mr-2"
            >
              Limpiar
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
