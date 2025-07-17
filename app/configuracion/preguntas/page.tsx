"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddQuestionModal } from "@/components/question/add-question-modal";
import { Download, RefreshCw, AlertCircle } from "lucide-react";
import * as XLSX from "xlsx";
import { fetchQuestions, type Question } from "@/services/questions-service";
import { useToast } from "@/hooks/use-toast";

export default function QuestionsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar las preguntas
  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchQuestions();
      setQuestionsData(data);
    } catch (err) {
      setError(
        "No se pudieron cargar las preguntas. Por favor, intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  // Cargar preguntas al montar el componente
  useEffect(() => {
    loadQuestions();
  }, []);

  // Función para agregar una nueva pregunta
  const handleAddQuestion = (questionData: {
    pregunta: string;
    tipoRespuesta: string;
    opciones: string[];
    tipoDiagnostico: string;
    prioridad: string;
    sintomas: string;
    palabrasClave: string;
  }) => {
    // Crear una nueva pregunta con los datos del formulario
    const newQuestion: Question = {
      id: (questionsData.length + 1).toString(),
      questionType:
        questionData.tipoRespuesta === "opcion_multiple"
          ? "Opción múltiple"
          : "Texto",
      educationLevel: "General", // Valor por defecto
      diagnostic: questionData.tipoDiagnostico,
      symptoms: questionData.sintomas,
      questionGroup: "Evaluación general", // Valor por defecto
      keyword: questionData.palabrasClave,
      time: "AM", // Valor por defecto
      questionText: questionData.pregunta,
      priority: Number.parseInt(questionData.prioridad) || 2,
    };

    // Añadir la nueva pregunta a la lista
    setQuestionsData([...questionsData, newQuestion]);
  };

  // Función para manejar el clic en una pregunta
  const handleQuestionClick = (question: Question) => {
    router.push(`/configuracion/preguntas/${question.id}`);
  };

  // Función para exportar datos a Excel
  const exportToExcel = () => {
    // Preparar los datos para Excel
    const dataForExcel = questionsData.map((q) => ({
      ID: q.id,
      "Tipo de pregunta": q.questionType,
      "Nivel educativo": q.educationLevel,
      Diagnóstico: q.diagnostic,
      Síntomas: q.symptoms,
      "Grupo de preguntas": q.questionGroup,
      "Palabra clave": q.keyword,
      Horario: q.time,
      Pregunta: q.questionText,
      Prioridad: q.priority,
    }));

    // Crear una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

    // Crear un libro de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Preguntas");

    // Generar el archivo Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Crear un Blob y descargar
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Preguntas_${new Date().toISOString().split("T")[0]}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Columnas para la tabla
  const columns = [
    { key: "questionText", title: "Pregunta" },
    { key: "diagnostic", title: "Diagnóstico" },
    { key: "questionType", title: "Tipo de respuesta" },
    { key: "educationLevel", title: "Nivel educativo" },
    { key: "priority", title: "Prioridad" },
    { key: "time", title: "Horario" },
  ];

  // Renderizar celdas de la tabla
  const renderCell = (
    question: Question,
    column: { key: string; title: string }
  ) => {
    switch (column.key) {
      case "questionText":
        return (
          <span
            className="cursor-pointer hover:text-blue-500"
            onClick={() => handleQuestionClick(question)}
          >
            {question.questionText}
          </span>
        );
      case "priority":
        return (
          <Badge
            variant="outline"
            className={
              question.priority === 1
                ? "border-red-500 text-red-500"
                : question.priority === 2
                ? "border-yellow-500 text-yellow-500"
                : "border-green-500 text-green-500"
            }
          >
            {question.priority}
          </Badge>
        );
      default:
        return question[column.key as keyof Question];
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Historial de preguntas cargadas
          </h2>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={loadQuestions}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Actualizar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={exportToExcel}
            >
              <Download size={16} />
              Exportar Excel
            </Button>
            <AddQuestionModal
              onAddQuestion={handleAddQuestion}
              isMobile={true}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error al cargar las preguntas</p>
              <p className="text-sm">{error}</p>
              <Button
                variant="link"
                className="text-red-700 p-0 h-auto text-sm mt-1"
                onClick={loadQuestions}
              >
                Intentar de nuevo
              </Button>
            </div>
          </div>
        )}

        {/* Tabla de preguntas */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <DataTable
            columns={columns}
            data={questionsData}
            renderCell={renderCell}
            loading={loading}
            emptyMessage="No se encontraron preguntas"
          />
        </div>
      </div>
    </AppLayout>
  );
}
