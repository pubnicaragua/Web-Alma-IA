'use client';  
  
import { useRouter } from 'next/navigation';  
import { useAuth } from '@/components/auth-provider';  
import { Button } from '@/components/ui/button';  
import {  
  Dialog,  
  DialogContent,  
  DialogDescription,  
  DialogFooter,  
  DialogHeader,  
  DialogTitle,  
} from '@/components/ui/dialog';  
import { useEffect, useState, useCallback, useRef } from 'react';  
  
// Aumentar timeout para reducir peticiones - 30 minutos  
const INACTIVITY_TIMEOUT = 1800; // 30 minutes in seconds  
// Tiempo de advertencia antes del logout - 2 minutos  
const WARNING_TIME = 120; // 2 minutes in seconds  
  
export function SessionTimeout() {  
  const router = useRouter();  
  const { logout, isAuthenticated } = useAuth();  
  const [timeLeft, setTimeLeft] = useState<number>(INACTIVITY_TIMEOUT);  
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);  
  const [isExtended, setIsExtended] = useState<boolean>(false);  
  const timerRef = useRef<NodeJS.Timeout | null>(null);  
  const confirmationTimerRef = useRef<NodeJS.Timeout | null>(null);  
  const activityListenerRef = useRef<boolean>(false);  
  
  const handleLogout = useCallback(() => {  
    if (timerRef.current) {  
      clearInterval(timerRef.current);  
      timerRef.current = null;  
    }  
    if (confirmationTimerRef.current) {  
      clearTimeout(confirmationTimerRef.current);  
      confirmationTimerRef.current = null;  
    }  
    logout();  
    router.push('/login');  
  }, [logout, router]);  
  
  const resetTimer = useCallback(() => {  
    if (timerRef.current) {  
      clearInterval(timerRef.current);  
      timerRef.current = null;  
    }  
    if (confirmationTimerRef.current) {  
      clearTimeout(confirmationTimerRef.current);  
      confirmationTimerRef.current = null;  
    }  
    setTimeLeft(INACTIVITY_TIMEOUT);  
    setShowConfirmation(false);  
    setIsExtended(false);  
  }, []);  
  
  const handleConfirmLogout = useCallback(() => {  
    handleLogout();  
  }, [handleLogout]);  
  
  const showSessionExpirationModal = useCallback(() => {  
    setShowConfirmation(true);  
    // Dar más tiempo para decidir - 5 minutos  
    confirmationTimerRef.current = setTimeout(() => {  
      if (!isExtended) {  
        handleLogout();  
      }  
    }, 300000); // 5 minutes  
  }, [isExtended, handleLogout]);  
  
  // Detectar actividad del usuario para resetear timer  
  const handleUserActivity = useCallback(() => {  
    if (showConfirmation) return; // No resetear si ya está mostrando confirmación  
    resetTimer();  
  }, [resetTimer, showConfirmation]);  
  
  // Configurar listeners de actividad  
  useEffect(() => {  
    if (!isAuthenticated || activityListenerRef.current) return;  
  
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];  
      
    // Throttle para evitar demasiadas llamadas  
    let throttleTimer: NodeJS.Timeout | null = null;  
    const throttledActivity = () => {  
      if (throttleTimer) return;  
      throttleTimer = setTimeout(() => {  
        handleUserActivity();  
        throttleTimer = null;  
      }, 30000); // Solo resetear cada 30 segundos máximo  
    };  
  
    events.forEach(event => {  
      document.addEventListener(event, throttledActivity, true);  
    });  
  
    activityListenerRef.current = true;  
  
    return () => {  
      events.forEach(event => {  
        document.removeEventListener(event, throttledActivity, true);  
      });  
      if (throttleTimer) clearTimeout(throttleTimer);  
      activityListenerRef.current = false;  
    };  
  }, [isAuthenticated, handleUserActivity]);  
  
  // Effect to handle the countdown - solo cuando se acerca el tiempo  
  useEffect(() => {  
    if (!isAuthenticated) return;  
  
    // Clear any existing timers  
    if (timerRef.current) {  
      clearInterval(timerRef.current);  
      timerRef.current = null;  
    }  
  
    if (timeLeft <= 0) {  
      showSessionExpirationModal();  
      return;  
    }  
  
    // Solo iniciar countdown cuando quedan menos de 5 minutos  
    if (timeLeft <= WARNING_TIME) {  
      timerRef.current = setInterval(() => {  
        setTimeLeft((prev) => {  
          if (prev <= 1) {  
            clearInterval(timerRef.current as NodeJS.Timeout);  
            return 0;  
          }  
          return prev - 1;  
        });  
      }, 1000);  
    } else {  
      // Para tiempos largos, usar intervalos menos frecuentes  
      timerRef.current = setInterval(() => {  
        setTimeLeft((prev) => {  
          if (prev <= WARNING_TIME) {  
            clearInterval(timerRef.current as NodeJS.Timeout);  
            return prev;  
          }  
          return prev - 60; // Decrementar por minuto  
        });  
      }, 60000); // Cada minuto  
    }  
  
    return () => {  
      if (timerRef.current) {  
        clearInterval(timerRef.current);  
        timerRef.current = null;  
      }  
    };  
  }, [timeLeft, isAuthenticated, showSessionExpirationModal]);  
  
  // Handle session extension  
  const handleExtendSession = useCallback(() => {  
    setTimeLeft(INACTIVITY_TIMEOUT);  
    setShowConfirmation(false);  
    setIsExtended(true);  
    if (confirmationTimerRef.current) {  
      clearTimeout(confirmationTimerRef.current);  
      confirmationTimerRef.current = null;  
    }  
  }, []);  
  
  // Calculate remaining time for the confirmation dialog (5 minutes total)  
  const [confirmationTimeLeft, setConfirmationTimeLeft] = useState(300);  
  
  useEffect(() => {  
    if (!showConfirmation) {  
      setConfirmationTimeLeft(300);  
      return;  
    }  
  
    const timer = setInterval(() => {  
      setConfirmationTimeLeft(prev => {  
        if (prev <= 1) {  
          clearInterval(timer);  
          return 0;  
        }  
        return prev - 1;  
      });  
    }, 1000);  
  
    return () => clearInterval(timer);  
  }, [showConfirmation]);  
  
  // Clean up timers on unmount  
  useEffect(() => {  
    return () => {  
      if (timerRef.current) clearInterval(timerRef.current);  
      if (confirmationTimerRef.current) clearTimeout(confirmationTimerRef.current);  
    };  
  }, []);  
  
  // Format time as MM:SS  
  const formatTime = (seconds: number): string => {  
    const mins = Math.floor(seconds / 60);  
    const secs = seconds % 60;  
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;  
  };  
  
  // Show confirmation when time is up  
  useEffect(() => {  
    if (isAuthenticated && timeLeft <= 0) {  
      showSessionExpirationModal();  
    }  
  }, [timeLeft, isAuthenticated, showSessionExpirationModal]);  
  
  // Don't render anything if user is not authenticated  
  if (!isAuthenticated) return null;  
  
  // Solo mostrar advertencia cuando quedan menos de 5 minutos  
  const shouldShowWarning = timeLeft <= WARNING_TIME && timeLeft > 0;  
  
  return (  
    <>  
      {/* Warning indicator cuando quedan pocos minutos */}  
      {shouldShowWarning && !showConfirmation && (  
        <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-md shadow-md z-50">  
          <p className="text-sm">  
            Sesión expira en: <span className="font-semibold">{formatTime(timeLeft)}</span>  
          </p>  
        </div>  
      )}  
  
      {/* Session timeout confirmation modal */}  
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>  
        <DialogContent className="sm:max-w-[425px]">  
          <DialogHeader>  
            <DialogTitle>¿Deseas continuar con tu sesión?</DialogTitle>  
          </DialogHeader>  
          <DialogDescription className="text-sm text-muted-foreground">  
            Tu sesión está a punto de expirar. ¿Deseas continuar?  
          </DialogDescription>  
          <div className="mt-4 text-center">  
            <div className="text-sm text-muted-foreground mb-2">  
              La sesión se cerrará en: <span className="font-semibold">{formatTime(confirmationTimeLeft)}</span>  
            </div>  
            <div className="w-full bg-gray-200 rounded-full h-2.5">  
              <div   
                className="bg-yellow-500 h-2.5 rounded-full"   
                style={{ width: `${(confirmationTimeLeft / 300) * 100}%` }}  
              />  
            </div>  
          </div>  
          <DialogFooter>  
            <Button variant="outline" onClick={handleConfirmLogout}>  
              Cerrar sesión  
            </Button>  
            <Button onClick={handleExtendSession}>  
              Continuar  
            </Button>  
          </DialogFooter>  
        </DialogContent>  
      </Dialog>  
    </>  
  );  
}