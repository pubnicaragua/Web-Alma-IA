"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Smile, RefreshCw, AlertCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  fetchNeurodivergences,
  fetchfetchNeurodivergencesByDate,
  type Emotion,
} from "@/services/home-service";
import { useToast } from "@/hooks/use-toast";
import { themeColors } from "@/lib/theme-colors";
import { DatePicker } from "@/components/ui/date-picker";

interface BarChartComparisonNeurodivergencesProps {
  title: string;
  initialSelectedEmotions?: string[];
  onEmotionsChange: (emotions: string[]) => void;
  initialData?: Emotion[];
  apiEmotions?: Array<{
    nombre: string;
    valor: number;
  }>;
}

export function BarChartComparisonNeurodivergences({
  title,
  initialSelectedEmotions = [
    "Tristeza",
    "Felicidad",
    "Estrés",
    "Ansiedad",
    "Enojo",
    "Otros",
  ],
  onEmotionsChange,
  initialData,
  apiEmotions,
}: BarChartComparisonNeurodivergencesProps) {
  const [data, setData] = useState<Emotion[]>(initialData || []);
  const [isLoading, setIsLoading] = useState(!initialData && !apiEmotions);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>(
    initialSelectedEmotions
  );
  const [dateMode, setDateMode] = useState<"today" | "date">("today");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { toast } = useToast();

  const dateFilterValue =
    dateMode === "today"
      ? "today"
      : selectedDate
      ? selectedDate.toISOString().slice(0, 10)
      : "today";

  useEffect(() => {
    setSelectedEmotions(initialSelectedEmotions);
  }, [initialSelectedEmotions]);

  useEffect(() => {
    if (!initialData && !apiEmotions) {
      loadData(dateFilterValue);
    } else if (apiEmotions) {
      const transformedData = apiEmotions.map((emotion) => ({
        name: emotion.nombre,
        value: Math.round(emotion.valor / 100),
        color: getNeurodivergenceColor(emotion.nombre),
      }));
      setData(transformedData);
      const apiEmotionNames = apiEmotions.map((e) => e.nombre);
      setSelectedEmotions(apiEmotionNames);
      if (onEmotionsChange) onEmotionsChange(apiEmotionNames);
    }
  }, [initialData, apiEmotions, selectedDate]);

  const loadData = async (filter: string) => {
    try {
      setIsLoading(true);
      setError(null);

      let emotionsData: Emotion[];

      if (filter === "today") {
        emotionsData = await fetchNeurodivergences();
      } else {
        emotionsData = await fetchfetchNeurodivergencesByDate(
          formatDateToYYYYMMDD(selectedDate as Date)
        );
      }

      const emotionNames = emotionsData.map((emotion) => emotion.name);
      setSelectedEmotions(emotionNames);
      if (onEmotionsChange) onEmotionsChange(emotionNames);
      setData(emotionsData);
    } catch (err) {
      setError(
        "No se pudieron cargar los datos de neurodivergencias. Intente nuevamente."
      );
      toast({
        title: "Error al cargar datos",
        description:
          "No se pudieron cargar los datos de neurodivergencias. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleEmotion = (emotion: string) => {
    const newEmotions = selectedEmotions.includes(emotion)
      ? selectedEmotions.filter((e) => e !== emotion)
      : [...selectedEmotions, emotion];

    setSelectedEmotions(newEmotions);
    if (onEmotionsChange) onEmotionsChange(newEmotions);
  };

  const filteredData =
    data && data.length > 0
      ? data.filter((emotion) => selectedEmotions.includes(emotion.name))
      : [];

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 rounded-full mr-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-8"></div>
          </div>
        </div>
        <div className="h-64 w-full bg-gray-100 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <AlertCircle className="mr-2 text-red-500" />
            <h3 className="font-medium text-gray-800">{title}</h3>
          </div>
          <button
            onClick={() => loadData(dateFilterValue)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Reintentar
          </button>
        </div>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Smile className="mr-2 text-gray-700" />
            <h3 className="font-medium text-gray-800">{title}</h3>
          </div>
          <button
            onClick={() => loadData(dateFilterValue)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="mr-1 h-4 w-4" />
            Recargar
          </button>
        </div>
        <div className="text-gray-500 text-center py-8">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 shadow-sm border border-blue-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          <Smile className="mr-2 text-gray-700" />
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={dateMode}
            onChange={(e) => setDateMode(e.target.value as "today" | "date")}
            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="today">Hasta hoy</option>
            <option value="date">Elegir fecha</option>
          </select>
          {dateMode === "date" && (
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              maxDate={new Date()}
              placeholderText="Seleccione una fecha"
              className="w-full p-2 border rounded-md"
            />
          )}
          <div className="pointer-events-none ml-2">
            <Calendar className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {data.map((emotion) => (
          <Badge
            key={emotion.name}
            variant={
              selectedEmotions.includes(emotion.name) ? "default" : "outline"
            }
            className={`cursor-pointer ${
              selectedEmotions.includes(emotion.name)
                ? ""
                : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
            }`}
            style={{
              backgroundColor: selectedEmotions.includes(emotion.name)
                ? emotion.color
                : "",
              borderColor: emotion.color,
              color: selectedEmotions.includes(emotion.name) ? "white" : "",
            }}
            onClick={() => handleToggleEmotion(emotion.name)}
          >
            {emotion.name}
          </Badge>
        ))}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 5, right: 5, left: 0, bottom: 20 }}
            maxBarSize={50}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                value.length > 6 ? `${value.substring(0, 6)}...` : value
              }
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}`, "Cantidad"]}
              labelFormatter={(name) => `${name}`}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {filteredData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function formatDateToYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}/${month}/${day}`;
}

function getNeurodivergenceColor(emotion: string): string {
  const colors: Record<string, string> = {
    Felicidad: themeColors.chart.yellow,
    Tristeza: themeColors.chart.blue,
    Estrés: themeColors.chart.gray,
    Ansiedad: themeColors.chart.orange,
    Enojo: themeColors.chart.red,
    Otros: themeColors.chart.purple,
  };
  return colors[emotion] || themeColors.chart.gray;
}
