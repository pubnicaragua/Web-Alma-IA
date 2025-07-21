"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { isAuthenticated, removeAuthToken } from "@/lib/api-config";
import { subscribeToAuthChanges } from "@/lib/auth-events";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  logout: () => {},
  checkAuth: () => false,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Usar useRef para evitar múltiples verificaciones
  const initialCheckDone = useRef(false);

  const checkAuth = () => {
    // Evitar verificaciones innecesarias
    if (initialCheckDone.current) {
      return isAuth;
    }

    const authStatus = isAuthenticated();
    setIsAuth(authStatus);
    initialCheckDone.current = true;
    return authStatus;
  };

  useEffect(() => {
    // Verificar autenticación inicial solo una vez
    if (!initialCheckDone.current) {
      checkAuth();
    }

    // Suscribirse a cambios de autenticación
    const unsubscribe = subscribeToAuthChanges((newAuthStatus) => {
      setIsAuth(newAuthStatus);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const logout = () => {
    router.push("/login");
    removeAuthToken();
    setIsAuth(false);
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      variant: "default",
    });
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: isAuth, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
