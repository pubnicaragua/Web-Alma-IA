"use client"

import { AddActionModal } from "@/components/alert/add-action-modal"
import { AlertDetailSkeleton } from "@/components/alert/alert-detail-skeleton"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { 
  AlertPage, 
  changeLeida, 
  createAccionAlert, 
  CreateAccionAlertParams, 
  fetchAlertById,
  createAlertBitacora, 
  fetchAlertDetail, 
  fetchAlertBitacoras, 
  type AlumnoAlertaBitacora, 
  type BitacoraResponse, 
  type AlertDetailResponse 
} from "@/services/alerts-service" 
import { ArrowLeft, Edit, Lock } from "lucide-react"  
import Image from "next/image"  
import { useParams, useRouter } from "next/navigation"  
import { useCallback, useEffect, useState } from "react"  
import { EditAlertModal } from "@/components/edit-alert-modal"  
import { hasSearchParam } from "@/lib/search-params"  

interface Action {  
  plan_accion: string  
  fecha_compromiso: string  
  fecha_realizacion: string  
  url_archivo: string  
  fecha: string  
  hora: string  
  usuarioResponsable: string  
  accionRealizada: string  
  fechaCompromiso: string  
}  

export default function AlertDetailPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {  
  const { id } = useParams()  
  const router = useRouter()  
  const { toast } = useToast()
  const [alert, setAlert] = useState<AlertPage | null>(null)  
  const [bitacoras, setBitacoras] = useState<BitacoraResponse[]>([])  
  const [error, setError] = useState<string | null>(null)  
  const [isLoading, setIsLoading] = useState(true)  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)  
  const isMobile = useIsMobile()  

  const loadAlert = useCallback(async (id: number) => {  
    try {  
      setIsLoading(true)  
      setError(null)  
      const data = await fetchAlertById(id)  
        
      if (hasSearchParam(searchParams, 'notifications')) {  
        try {  
          await changeLeida(id)  
          console.log('change leida bien')  
        } catch (error) {  
          console.log('Error al marcar alerta como leida', error)  
        }  
      }  
      setAlert(data)  
      await loadAlertBitacoras(id)  
    } catch (err) {  
      console.error("Error al cargar alertas:", err)  
      setError((err as Error).message || 'error en la petición intente más tarde')  
    } finally {  
      setIsLoading(false)  
    }  
  }, [searchParams])  

  const loadAlertBitacoras = async (alertaId: number) => {  
    try {  
      const bitacorasData = await fetchAlertBitacoras(alertaId)  
      setBitacoras(bitacorasData)  
    } catch (error) {  
      console.error("Error al cargar bitácoras:", error)  
      setBitacoras([])  
    }  
  }  

  useEffect(() => {  
    if (id) {  
      loadAlert(Number(id))  
    }  
  }, [id, loadAlert])  

  const handleEditClick = () => {  
    setIsEditModalOpen(true)  
  }  

  const handleSaveChanges = async (data: any) => {  
    if (!alert) return  
      
    try {  
      await loadAlert(alert.id)  
      setIsEditModalOpen(false)  
    } catch (error) {  
      console.error('Error updating alert:', error)  
    }  
  }  

  const handleGoBack = () => {  
    router.back()  
  }  

  const handleAddAction = async (newAction: {  
    plan_accion: string  
    fecha_compromiso: string  
    fecha_realizacion?: string  
    url_archivo?: string  
  }) => {  
    if (!alert) return  

    try {  
      setIsLoading(true)  
        
      const bitacoraData: AlumnoAlertaBitacora = {  
        alumno_alerta_id: Number(id),  
        alumno_id: alert.student?.alumno_id || 0,  
        plan_accion: newAction.plan_accion,  
        fecha_compromiso: newAction.fecha_compromiso || undefined,  
        fecha_realizacion: newAction.fecha_realizacion || undefined,  
        url_archivo: newAction.url_archivo || undefined,  
      }  

      await createAlertBitacora(bitacoraData)  
      await loadAlertBitacoras(Number(id))  
        
      toast({  
        title: "Éxito",  
        description: "Acción agregada a la bitácora correctamente",  
        variant: "default",  
      })  
    } catch (error) {  
      console.error("Error al agregar acción:", error)  
      toast({  
        title: "Error",  
        description: "No se pudo agregar la acción a la bitácora",  
        variant: "destructive",  
      })  
    } finally {  
      setIsLoading(false)  
    }  
  }  

  const formatBitacorasForTable = (bitacoras: BitacoraResponse[]): Action[] => {  
    return bitacoras.map(bitacora => {  
      const fecha = new Date(bitacora.fecha_compromiso)  
      const fechaFormateada = fecha.toLocaleDateString('es-ES')  
      const horaFormateada = fecha.toLocaleTimeString('es-ES', {   
        hour: '2-digit',   
        minute: '2-digit',  
        hour12: true   
      })  

      return {  
        fecha: fechaFormateada,  
        hora: horaFormateada,  
        usuarioResponsable: bitacora.alumno.nombre,
        accionRealizada: bitacora.plan_accion,  
        fechaCompromiso: bitacora.fecha_compromiso ? new Date(bitacora.fecha_compromiso).toLocaleDateString('es-ES') : '-',
        plan_accion: bitacora.plan_accion,  
        fecha_compromiso: bitacora.fecha_compromiso,  
        fecha_realizacion: bitacora.fecha_realizacion || '',  
        url_archivo: bitacora.url_archivo || ''  
      }  
    })  
  }  

  if (isLoading) {  
    return (  
      <AppLayout>  
        <AlertDetailSkeleton />  
      </AppLayout>  
    )  
  }  

  if (error) {  
    return (  
      <AppLayout>  
        <div className="container mx-auto px-6 py-8">  
          <div className="flex justify-center items-center h-64">  
            <p className="text-xl text-gray-500">{error}</p>  
          </div>  
        </div>  
      </AppLayout>  
    )  
  }  

  const actionsToShow = bitacoras.length > 0 ? formatBitacorasForTable(bitacoras) : alert?.actions || []  

  return (  
    <>  
      {alert ? (  
        <AppLayout>  
          <div className="container mx-auto px-3 sm:px-6 py-8">  
            <div className="mb-6">  
              <Button variant="outline" size="sm" onClick={handleGoBack} className="flex items-center gap-1">  
                <ArrowLeft className="h-4 w-4" />  
                Volver  
              </Button>  
            </div>  

            <Card className="mb-6">  
              <CardHeader className="pb-2">  
                <CardTitle className="text-xl">Información del Alumno</CardTitle>  
              </CardHeader>  
              <CardContent>  
                {alert.student && (  
                  <div className="flex items-center">  
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mr-6 flex-shrink-0">  
                      <Image  
                        src={alert.student.image || "/placeholder.svg"}  
                        alt={alert.student.name}  
                        fill  
                        sizes="96px"  
                        className="object-cover"  
                      />  
                    </div>  
                    <div>  
                      <h1 className="text-2xl font-bold text-gray-800">{alert.student.name}</h1>  
                      <p className="text-sm text-gray-500">  
                        Fecha de generación: {alert.generationDate} - {alert.generationTime}  
                      </p>  
                    </div>  
                  </div>  
                )}  
              </CardContent>  
            </Card>  

            <Card className="mb-6">  
              <CardHeader className="flex justify-end w-full space-y-0 pb-2">  
                <Button variant="outline" size="sm" className="w-fit" onClick={handleEditClick}>  
                  <Edit className="h-4 w-4" />  
                  Editar  
                </Button>  
              </CardHeader>  
              <CardContent className="space-y-6">  
                <div>  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Responsable Actual:</h3>  
                  <div className="flex items-center">  
                    <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0">  
                      <Image  
                        src={alert.responsible?.image?.trim() || "/placeholder.svg"}  
                        alt={alert.responsible?.name?.trim() || "No disponible"}  
                        fill  
                        sizes="40px"  
                        className="object-cover"  
                      />  
                    </div>  
                    <span className="text-gray-700">  
                      {alert.responsible?.name?.trim() || "No disponible"}  
                    </span>  
                  </div>  
                  {!alert.isAnonymous && (  
                    <div className="flex items-center mt-2 text-gray-600">  
                      <Lock className="h-4 w-4 mr-1" />  
                      <span className="text-sm">No es anónimo</span>  
                    </div>  
                  )}  
                </div>  

                <div>  
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Descripción de la alerta</h3>  
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{alert.description}</p>  
                </div>  
              </CardContent>  
            </Card>  

            <Card className="mb-6">  
              <CardHeader className="pb-2 flex flex-row items-center justify-between">  
                <CardTitle className="text-xl">Bitácora de acciones</CardTitle>  
                <AddActionModal   
                  onAddAction={handleAddAction}  
                  isMobile={isMobile}   
                />  
              </CardHeader>  
              <CardContent>  
                <div className="bg-white rounded-lg shadow-sm overflow-x-auto">  
                  <table className="w-full min-w-[640px]">  
                    <thead>  
                      <tr className="bg-blue-300">  
                        <th className="px-4 py-3 text-left font-medium text-white">Fecha</th>  
                        <th className="px-4 py-3 text-left font-medium text-white">Hora</th>  
                        <th className="px-4 py-3 text-left font-medium text-white">Usuario Responsable</th>  
                        <th className="px-4 py-3 text-left font-medium text-white">Acción Realizada</th>  
                        <th className="px-4 py-3 text-left font-medium text-white">Fecha de Compromiso</th>  
                      </tr>  
                    </thead>  
                    <tbody>  
                      {actionsToShow.length > 0 ? (  
                        actionsToShow.map((action, index) => (  
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">  
                            <td className="px-4 py-3 text-sm">{action.fecha}</td>  
                            <td className="px-4 py-3 text-sm">{action.hora}</td>  
                            <td className="px-4 py-3 text-sm">{action.usuarioResponsable}</td>  
                            <td className="px-4 py-3 text-sm">{action.accionRealizada}</td>  
                            <td className="px-4 py-3 text-sm">{action.fechaCompromiso}</td>  
                          </tr>  
                        ))  
                      ) : (  
                        <tr>  
                          <td colSpan={5} className="px-4 py-6 text-center text-gray-500">  
                            No hay acciones registradas para esta alerta  
                          </td>  
                        </tr>  
                      )}  
                    </tbody>  
                  </table>  
                </div>  
              </CardContent>  
            </Card>  
          </div>  

          <EditAlertModal   
            isOpen={isEditModalOpen}  
            onClose={() => setIsEditModalOpen(false)}  
            alert={alert}  
            onSave={handleSaveChanges}  
          />  
        </AppLayout>  
      ) : null}  
    </>  
  )  
}