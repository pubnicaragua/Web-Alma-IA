"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, AlertCircle } from "lucide-react";
import { fetchQuestionById, type Question } from "@/services/questions-service";
import { useToast } from "@/hooks/use-toast";

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el ID de la pregunta de los parámetros de la URL
  const questionId = params.id as string;

  // Cargar los datos de la pregunta
  useEffect(() => {
    const loadQuestion = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchQuestionById(questionId);
        if (data) {
          setQuestion(data);
        } else {
          setError("No se encontró la pregunta solicitada.");
          toast({
            title: "Error",
            description: "No se encontró la pregunta solicitada.",
            variant: "destructive",
          });
        }
      } catch (err) {
        setError("No se pudo cargar la pregunta. Por favor, intenta de nuevo.");
        toast({
          title: "Error",
          description:
            "No se pudo cargar la pregunta. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (questionId) {
      loadQuestion();
    }
  }, [questionId, toast]);

  // Función para volver a la lista de preguntas
  const handleBack = () => {
    router.push("/configuracion/preguntas");
  };

  // Función para editar la pregunta (placeholder)
  const handleEdit = () => {
    toast({
      title: "Editar pregunta",
      description: "Funcionalidad de edición no implementada aún.",
      variant: "default",
    });
  };

  // Función para eliminar la pregunta (placeholder)
  const handleDelete = () => {
    toast({
      title: "Eliminar pregunta",
      description: "Funcionalidad de eliminación no implementada aún.",
      variant: "default",
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-3 sm:px-6 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a la lista
        </Button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
              <Button
                variant="link"
                className="text-red-700 p-0 h-auto text-sm mt-1"
                onClick={handleBack}
              >
                Volver a la lista de preguntas
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <Card>
              <CardHeader>
                <div className="h-6 w-full bg-gray-200 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : question ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Detalle de la pregunta
              </h2>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  className="text-red-500"
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Información de la pregunta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Pregunta</h3>
                      <p className="mt-1">{question.questionText}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Tipo de pregunta
                        </h3>
                        <p>{question.questionType}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Nivel educativo
                        </h3>
                        <p>{question.educationLevel}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Grupo de preguntas
                        </h3>
                        <p>{question.questionGroup}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Horario
                        </h3>
                        <p>{question.time}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Diagnóstico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Diagnóstico
                      </h3>
                      <p>{question.diagnostic}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Síntomas
                      </h3>
                      <p>{question.symptoms}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Palabra clave
                      </h3>
                      <p>{question.keyword}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Prioridad
                      </h3>
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
                        {question.priority === 1
                          ? "Alta"
                          : question.priority === 2
                          ? "Media"
                          : "Baja"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </AppLayout>
  );
}
