// hooks/use-session-timeout.ts
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { removeAuthToken } from "@/lib/api-config";

const WARNING_AFTER = 2 * 60 * 1000; // 20 minutos (1200000 ms)
const LOGOUT_AFTER_WARNING = 20 * 1000; // 20 segundos (20000 ms)

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
      clearTimeout(warningTimeoutRef.current);
      clearTimeout(logoutTimeoutRef.current);

      // Configurar advertencia a los 20 minutos
      warningTimeoutRef.current = setTimeout(() => {
        toast({
          title: "Sesión por expirar",
          description:
            "Tu sesión expirará en 20 segundos. Realiza alguna acción para continuar.",
          variant: "destructive",
        });

        // Configurar logout 20 segundos DESPUÉS del warning
        logoutTimeoutRef.current = setTimeout(
          handleLogout,
          LOGOUT_AFTER_WARNING
        );
      }, WARNING_AFTER);
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

      resetTimeout(); // Iniciar temporizadores

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
