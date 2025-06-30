"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { AlertCircle, RefreshCw } from "lucide-react";
import { fetchTotalAlerts, type TotalAlert } from "@/services/home-service";
import { useToast } from "@/hooks/use-toast";
import { DonutChartSkeleton } from "./donut-chart-skeleton";

interface DonutChartProps {
  title?: string;
  initialData?: TotalAlert[];
}

export function DonutChart({
  title = "Distribución de alertas",
  initialData,
}: DonutChartProps) {
  const [data, setData] = useState<TotalAlert[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!initialData) {
      loadData();
    }
  }, [initialData]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const alertsData = await fetchTotalAlerts();
      setData(alertsData);
    } catch (err) {
      console.error("Error al cargar las alertas totales:", err);
      setError(
        "No se pudieron cargar los datos de alertas. Intente nuevamente."
      );

      toast({
        title: "Error al cargar datos",
        description:
          "No se pudieron cargar los datos de alertas. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DonutChartSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-red-200">
        <div className="flex items-center mb-4">
          <AlertCircle className="mr-2 text-red-500" />
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={loadData}
          className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
        <div className="flex items-center mb-4">
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-100 text-lg font-medium text-center py-6 px-4 rounded-md">
          No hay datos de alertas disponibles.
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
    color: item.color,
    percentage: item.percentage,
  }));

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <h3 className="font-medium text-gray-800 mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row items-center">
        <div className="h-48 w-full md:h-64 md:w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={false}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full md:w-1/2 mt-4 md:mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm">
                  {item.name} ({item.percentage})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
