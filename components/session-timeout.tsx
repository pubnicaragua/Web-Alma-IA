"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState, useCallback, useRef } from "react";

// Configuración: 1 minuto y medio + 30 segundos
const INACTIVITY_TIMEOUT = 90; // 1.5 minutos en segundos
const WARNING_TIME = 30; // 30 segundos de advertencia

export function SessionTimeout() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState<number>(INACTIVITY_TIMEOUT);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityListenerRef = useRef<boolean>(false);

  const handleLogout = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    logout();
    toast({
      title: "Sesión expirada",
      description: "Tu sesión ha expirado por inactividad.",
      variant: "destructive",
    });
    router.push("/login");
  }, [logout, router, toast]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    setTimeLeft(INACTIVITY_TIMEOUT);
    setShowWarning(false);
  }, []);

  const showWarningToast = useCallback(() => {
    setShowWarning(true);
    toast({
      title: "Sesión por expirar",
      description:
        "Tu sesión expirará en 30 segundos. Realiza alguna acción para continuar.",
      variant: "destructive",
    });

    // Configurar logout después de 30 segundos
    warningTimerRef.current = setTimeout(() => {
      handleLogout();
    }, WARNING_TIME * 1000);
  }, [handleLogout, toast]);

  // Detectar actividad del usuario para resetear timer
  const handleUserActivity = useCallback(() => {
    if (showWarning) return; // No resetear si ya está mostrando advertencia
    resetTimer();
  }, [resetTimer, showWarning]);

  // Configurar listeners de actividad
  useEffect(() => {
    if (!isAuthenticated || activityListenerRef.current) return;

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => handleUserActivity();

    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    activityListenerRef.current = true;

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      activityListenerRef.current = false;
    };
  }, [isAuthenticated, handleUserActivity]);

  // Effect para manejar el countdown
  useEffect(() => {
    if (!isAuthenticated) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (timeLeft <= 0) {
      showWarningToast();
      return;
    }

    // Iniciar countdown cada segundo
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, isAuthenticated, showWarningToast]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, []);

  if (!isAuthenticated) return null;

  return null; // Solo toasts, sin UI visual
}
