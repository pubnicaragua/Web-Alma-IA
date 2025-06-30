// hooks/use-session-timeout.ts
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { removeAuthToken } from "@/lib/api-config";

const INACTIVITY_WARNING_TIME = 10000; // 10 segundos para prueba
const INACTIVITY_LOGOUT_TIME = 15000; // 15 segundos para prueba

export function useSessionTimeout() {
  const router = useRouter();
  const { toast } = useToast();
  const warningTimeoutRef = useRef<NodeJS.Timeout>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout>(null);

  const handleLogout = useCallback(() => {
    if (typeof window !== "undefined") {
      removeAuthToken();
      toast({
        title: "Sesión expirada",
        description: "Tu sesión ha expirado por inactividad.",
        variant: "destructive",
      });
      router.push("/login");
    }
  }, [router, toast]);

  const resetTimeout = useCallback(() => {
    if (typeof window !== "undefined") {
      console.log("Timer reiniciado por actividad del usuario");
      clearTimeout(warningTimeoutRef.current);
      clearTimeout(logoutTimeoutRef.current);

      warningTimeoutRef.current = setTimeout(() => {
        toast({
          title: "Sesión por expirar",
          description:
            "Tu sesión expirará en 5 segundos. Mueve el mouse para extender.",
          variant: "destructive",
        });
      }, INACTIVITY_WARNING_TIME);

      logoutTimeoutRef.current = setTimeout(
        handleLogout,
        INACTIVITY_LOGOUT_TIME
      );
    }
  }, [handleLogout, toast]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const events = [
        "mousedown",
        "mousemove",
        "keypress",
        "scroll",
        "touchstart",
        "click",
      ];

      const resetOnActivity = () => resetTimeout();

      events.forEach((event) => {
        document.addEventListener(event, resetOnActivity, true);
      });

      resetTimeout(); // Iniciar el timer

      return () => {
        events.forEach((event) => {
          document.removeEventListener(event, resetOnActivity, true);
        });
        clearTimeout(warningTimeoutRef.current);
        clearTimeout(logoutTimeoutRef.current);
      };
    }
  }, [resetTimeout]);
}
