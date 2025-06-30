"use client";

import { DataTable } from "@/components/data-table";
import { useState } from "react";

interface ComparisonData {
  emocion: string;
  alumno: number;
  promedio: number;
}

interface ComparisonChartProps {
  comparisonData: ComparisonData[];
}

interface Point {
  x: number;
  y: number;
  value: number;
  emotion: string;
}

export function ComparisonChart({ comparisonData }: ComparisonChartProps) {
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
  }>({ visible: false, x: 0, y: 0, text: "" });

  // Configuración del gráfico
  const center = { x: 200, y: 200 };
  const maxRadius = 120;
  const maxValue = Math.max(
    ...comparisonData.map((d) => Math.max(d.alumno, d.promedio)),
    2
  ); // Mínimo 2 para la escala

  // Función para convertir valor a coordenadas polares
  const valueToCoordinates = (
    value: number,
    angle: number,
    offset: number = 0
  ): Point => {
    const radius = (value / maxValue) * maxRadius;
    const radian = (angle * Math.PI) / 180;
    return {
      x: center.x + radius * Math.sin(radian) + offset,
      y: center.y - radius * Math.cos(radian) + offset,
      value,
      emotion: comparisonData[angle / 72]?.emocion || "",
    };
  };

  // Generar puntos para el alumno y el promedio
  const generatePolygonPoints = (data: ComparisonData[], isAverage = false) => {
    return data
      .map((item, index) => {
        const angle = index * 72; // 72° por cada punto (360/5)
        const value = isAverage ? item.promedio : item.alumno;
        return valueToCoordinates(value, angle);
      })
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
  };

  // Generar puntos individuales para interactividad
  const generateInteractivePoints = (
    data: ComparisonData[],
    isAverage = false
  ) => {
    return data.map((item, index) => {
      const angle = index * 72;
      const value = isAverage ? item.promedio : item.alumno;
      return valueToCoordinates(value, angle);
    });
  };

  const alumnoPoints = generateInteractivePoints(comparisonData);
  const promedioPoints = generateInteractivePoints(comparisonData, true);

  // Manejadores para el tooltip
  const handleMouseEnter = (
    e: React.MouseEvent<SVGCircleElement>,
    point: Point
  ) => {
    const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (svgRect) {
      setTooltip({
        visible: true,
        x: e.clientX - svgRect.left,
        y: e.clientY - svgRect.top,
        text: `${point.emotion}: ${point.value.toFixed(1)}`,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ visible: false, x: 0, y: 0, text: "" });
  };

  // Posicionamiento de etiquetas de emociones
  const emotionLabels = [
    { angle: 0, text: "Felicidad", anchor: "middle" },
    { angle: 72, text: "Tristeza", anchor: "start" },
    { angle: 144, text: "Estrés", anchor: "middle" },
    { angle: 216, text: "Enojo", anchor: "middle" },
    { angle: 288, text: "Ansiedad", anchor: "end" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
      <h4 className="text-lg font-medium mb-4">Comparativa</h4>

      <div className="flex items-center justify-end gap-4 mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
          <span className="text-sm">Alumno</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
          <span className="text-sm">Promedio</span>
        </div>
      </div>

      <div className="flex justify-center mb-4 relative">
        <div className="w-full max-w-md">
          <svg viewBox="0 0 400 400" width="100%" height="100%">
            {/* Círculos de fondo (escala) */}
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <circle
                key={scale}
                cx={center.x}
                cy={center.y}
                r={scale * maxRadius}
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="1"
              />
            ))}

            {/* Líneas radiales */}
            {alumnoPoints.map((_, index) => {
              const angle = index * 72;
              const radian = (angle * Math.PI) / 180;
              return (
                <line
                  key={index}
                  x1={center.x}
                  y1={center.y}
                  x2={center.x + maxRadius * Math.sin(radian)}
                  y2={center.y - maxRadius * Math.cos(radian)}
                  stroke="#e5e5e5"
                  strokeWidth="1"
                />
              );
            })}

            {/* Etiquetas de escala */}
            {[0.5, 1, 1.5, 2].map((value) => (
              <text
                key={value}
                x={center.x + 5}
                y={center.y - (value / maxValue) * maxRadius}
                textAnchor="middle"
                fontSize="10"
                fill="#888"
              >
                {value.toFixed(1)}
              </text>
            ))}

            {/* Polígono del promedio */}
            <polygon
              points={generatePolygonPoints(comparisonData, true)}
              fill="rgba(128, 128, 128, 0.2)"
              stroke="#888"
              strokeWidth="2"
              strokeDasharray="5,3"
            />

            {/* Polígono del alumno */}
            <polygon
              points={generatePolygonPoints(comparisonData)}
              fill="rgba(120, 182, 255, 0.3)"
              stroke="#78b6ff"
              strokeWidth="2"
            />

            {/* Puntos del promedio */}
            {promedioPoints.map((point, index) => (
              <circle
                key={`avg-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="white"
                stroke="#888"
                strokeWidth="2"
                onMouseEnter={(e) => handleMouseEnter(e, point)}
                onMouseLeave={handleMouseLeave}
              />
            ))}

            {/* Puntos del alumno */}
            {alumnoPoints.map((point, index) => (
              <circle
                key={`alumno-${index}`}
                cx={point.x}
                cy={point.y}
                r="6"
                fill="white"
                stroke="#78b6ff"
                strokeWidth="2"
                onMouseEnter={(e) => handleMouseEnter(e, point)}
                onMouseLeave={handleMouseLeave}
              />
            ))}

            {/* Etiquetas de emociones */}
            {emotionLabels.map((label, index) => {
              const radian = (label.angle * Math.PI) / 180;
              const x = center.x + (maxRadius + 20) * Math.sin(radian);
              const y = center.y - (maxRadius + 20) * Math.cos(radian);
              return (
                <text
                  key={index}
                  x={x}
                  y={y}
                  textAnchor={label.anchor as any}
                  fontSize="12"
                  fontWeight="bold"
                  fill="#333"
                >
                  {label.text}
                </text>
              );
            })}

            {/* Tooltip */}
            {tooltip.visible && (
              <g transform={`translate(${tooltip.x},${tooltip.y})`}>
                <rect
                  x="-50"
                  y="-20"
                  width="100"
                  height="20"
                  rx="4"
                  fill="#333"
                />
                <text
                  x="0"
                  y="-5"
                  textAnchor="middle"
                  fontSize="10"
                  fill="white"
                >
                  {tooltip.text}
                </text>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Tabla de comparación */}
      <div className="overflow-x-auto">
        <DataTable
          columns={[
            {
              key: "emocion",
              title: "Emoción",
              className: "text-left",
            },
            {
              key: "alumno",
              title: "Alumno",
              className: "text-center text-blue-500",
            },
            {
              key: "promedio",
              title: "Promedio",
              className: "text-center text-gray-500",
            },
            {
              key: "diferencia",
              title: "Dif.",
              className: "text-center",
            },
          ]}
          data={comparisonData.map((item) => ({
            emocion: item.emocion,
            alumno: item.alumno,
            promedio: item.promedio,
            diferencia: item.alumno - item.promedio,
          }))}
          renderCell={(row, column) => {
            if (column.key === "diferencia") {
              const diff = row[column.key] as number;
              const isPositive = diff > 0;
              return (
                <div
                  className={`text-center font-medium ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {diff.toFixed(1)}
                </div>
              );
            }
            if (column.key === "alumno") {
              return (
                <div className="text-center font-medium text-blue-500">
                  {row[column.key]}
                </div>
              );
            }
            if (column.key === "promedio") {
              return (
                <div className="text-center text-gray-500">
                  {row[column.key]}
                </div>
              );
            }
            if (column.key === "emocion")
              return <div className="text-center">{row[column.key]}</div>;
          }}
        />
      </div>
    </div>
  );
}
