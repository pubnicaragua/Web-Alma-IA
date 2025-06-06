"use client";

import { BarChartComparison } from "@/components/bar-chart-comparison";
import { BarChartComparisonCategory } from "@/components/bar-chart-comparison-category";
import { FilterDropdown } from "@/components/filter-dropdown";
import { FilterDropdownObject } from "@/components/filter-dropdown-object";
import { AppLayout } from "@/components/layout/app-layout";
import { LineChartComparison } from "@/components/line-chart-comparison";
import { LineChartHistory } from "@/components/line-chart-history";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { colors } from "@/lib/colors";
import { fetchTotalAlertsHistoricoChartLine } from "@/services/alerts-service";
import { fetchGrade, Grade } from "@/services/grade-service";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function ComparativePage() {
  // Estados para los filtros
const [levelFilter, setLevelFilter] = useState<Grade>({
  grado_id: 1,
  nombre: "Primero", 
  creado_por: 1,
  estado: "activo"
})  
 const [courseFilter, setCourseFilter] = useState<string>("Todos");
  const [yearFilter, setYearFilter] = useState<string>("2025");
  const [monthFilter, setMonthFilter] = useState<string>("Abril");

  // Opciones para los filtros
  const [levelOptions, setLevelOptions] = useState<Grade[]>([]);

  const courseOptions = ["Todos", "3°B", "4°A", "5°A", "6°C", "1°A", "2°B"];
  const yearOptions = ["2023", "2024", "2025"];
  const monthOptions = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // Usar useMemo para evitar recálculos innecesarios de los datos
  const emotionsDataCourseA = useMemo(
    () => [
      { name: "Tristeza", value: 1500, color: colors.chart.blue },
      { name: "Felicidad", value: 3000, color: colors.chart.yellow },
      { name: "Estrés", value: 1000, color: colors.chart.gray },
      { name: "Ansiedad", value: 2500, color: colors.chart.orange },
      { name: "Enojo", value: 800, color: colors.chart.red },
      { name: "Otros", value: 2000, color: colors.chart.gray },
    ],
    []
  );

  const emotionsDataCourseB = useMemo(
    () => [
      { name: "Tristeza", value: 1200, color: colors.chart.blue },
      { name: "Felicidad", value: 2800, color: colors.chart.yellow },
      { name: "Estrés", value: 1200, color: colors.chart.gray },
      { name: "Ansiedad", value: 2700, color: colors.chart.orange },
      { name: "Enojo", value: 1500, color: colors.chart.red },
      { name: "Otros", value: 1800, color: colors.chart.gray },
    ],
    []
  );
  const loadData = async () => {
    try {
      console.log("load data comparativa");

      const grados = await fetchGrade();
      setLevelOptions(grados);
    } catch (err) {
      // Mostrar notificación de error
      console.log(err);
    } finally {
    }
  };

  useEffect(() => {
    console.log("level filtrado", levelFilter);
    loadData();
  }, []);

  // Estados para las emociones seleccionadas
  const [selectedEmotionsCourseA, setSelectedEmotionsCourseA] = useState<
    string[]
  >(["Tristeza", "Felicidad", "Estrés", "Ansiedad", "Enojo", "Otros"]);

  const [selectedEmotionsCourseB, setSelectedEmotionsCourseB] = useState<
    string[]
  >(["Tristeza", "Felicidad", "Estrés", "Ansiedad", "Enojo", "Otros"]);

  // Estado para los cursos seleccionados en el gráfico de líneas
  const [selectedCourses, setSelectedCourses] = useState<string[]>([
    "vencidas",
    "atendidas",
  ]);

  // Funciones para manejar la selección de emociones
  const handleToggleEmotionCourseA = (emotion: string) => {
    if (selectedEmotionsCourseA.includes(emotion)) {
      setSelectedEmotionsCourseA(
        selectedEmotionsCourseA.filter((e) => e !== emotion)
      );
    } else {
      setSelectedEmotionsCourseA([...selectedEmotionsCourseA, emotion]);
    }
  };

  const handleToggleEmotionCourseB = (emotion: string) => {
    if (selectedEmotionsCourseB.includes(emotion)) {
      setSelectedEmotionsCourseB(
        selectedEmotionsCourseB.filter((e) => e !== emotion)
      );
    } else {
      setSelectedEmotionsCourseB([...selectedEmotionsCourseB, emotion]);
    }
  };

  // Función para manejar la selección de cursos en el gráfico de líneas
  const handleToggleCourse = (course: string) => {
    if (selectedCourses.includes(course)) {
      setSelectedCourses(selectedCourses.filter((c) => c !== course));
    } else {
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  // Función para descargar la comparación
  const handleDownloadComparison = () => {
    alert("Descargando comparación...");
    // Aquí iría la lógica para descargar la comparación
  };

  const isMobile = useIsMobile();

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Comparativos</h2>
          <Button
            onClick={handleDownloadComparison}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Download className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Descargar comparación</span>
          </Button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <FilterDropdownObject<Grade>
            label="Nivel"
            options={levelOptions}
            value={levelFilter}
            onChange={setLevelFilter}
            labelKey="nombre"
            idKey="grado_id"
          />
          <FilterDropdown
            label="Curso"
            options={courseOptions}
            value={courseFilter}
            onChange={setCourseFilter}
          />
          <FilterDropdown
            label="Año"
            options={yearOptions}
            value={yearFilter}
            onChange={setYearFilter}
          />
          <FilterDropdown
            label="Mes"
            options={monthOptions}
            value={monthFilter}
            onChange={setMonthFilter}
          />
        </div>

        {/* Gráficos de barras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BarChartComparisonCategory
            title="Emociones"
            initialData={emotionsDataCourseA}
            selectedEmotions={selectedEmotionsCourseA}
            onToggleEmotion={handleToggleEmotionCourseA}
            grado={levelFilter?.grado_id}
          />
          <BarChartComparison
            title="Curso B"
            initialData={emotionsDataCourseB}
            selectedEmotions={selectedEmotionsCourseB}
            onToggleEmotion={handleToggleEmotionCourseB}
          />
        </div>

        {/* Gráfico de líneas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="mb-6">
            <LineChartComparison
              title="Gestor Alertas Hoy"
              selectedCourses={selectedCourses}
              onToggleCourse={handleToggleCourse}
            />
          </div>
          <div className="mb-6">
            <LineChartHistory
              title="Gestor Historial"
              selectedCourses={selectedCourses}
              onToggleCourse={handleToggleCourse}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
