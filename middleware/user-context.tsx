"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { ProfileResponse } from "@/services/profile-service";
import { useAuth } from "@/middleware/auth-provider";
import { getAuthToken } from "../lib/api-config";
import { cacheService } from "@/lib/cache-service";

// 1. Definición de tipos
export interface UserContextState {
  userData: ProfileResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: boolean;
}

export interface UserContextActions {
  loadUserData: (forceRefresh?: boolean) => Promise<void>;
  clearUserData: () => void;
  isRefreshing: () => void;
  getFuntions: (busqueda: string) => boolean;
  updateUserData: (newData: ProfileResponse) => void;
}

type UserContextType = UserContextState & UserContextActions;

// 2. Valor inicial
const initialContextValue: UserContextType = {
  userData: null,
  isLoading: false,
  error: null,
  refresh: false,
  isRefreshing: () => {},
  loadUserData: async () => {},
  clearUserData: () => {},
  getFuntions: () => false,
  updateUserData: () => {},
};

// 3. Creación del contexto
export const UserContext = createContext<UserContextType>(initialContextValue);

// 4. Hook personalizado
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// 5. Proveedor del contexto
interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { isAuthenticated } = useAuth();
  const [state, setState] = useState({
    userData: null as ProfileResponse | null,
    isLoading: false,
    error: null as string | null,
  });
  const [refresh, setRefresh] = useState(false);
  const lastFetchTimeRef = useRef<number | null>(null);
  const isLoadingRef = useRef(false);

  // Tiempo de caché en milisegundos (5 minutos)
  const CACHE_DURATION = 5 * 60 * 1000;
  const updateUserData = useCallback((newData: ProfileResponse) => {
    // Actualizar el estado inmediatamente
    setState((prev) => ({ ...prev, userData: newData, error: null }));

    // Actualizar el cache
    cacheService.set("user-profile", newData, 10 * 60 * 1000);

    // Actualizar el timestamp del cache
    lastFetchTimeRef.current = Date.now();
  }, []);

  // Modificar loadUserData para no sobrescribir datos recién actualizados
  const loadUserData = useCallback(async (forceRefresh = false) => {
    try {
      const now = Date.now();

      // Si forceRefresh, limpiar cache
      if (forceRefresh) {
        cacheService.clear("user-profile");
      }

      // Evitar múltiples peticiones simultáneas
      if (isLoadingRef.current && !forceRefresh) {
        return;
      }

      // Verificar cache primero (pero no si acabamos de actualizar)
      const cachedData = cacheService.get<ProfileResponse>("user-profile");
      if (cachedData && !forceRefresh) {
        setState((prev) => ({
          ...prev,
          userData: cachedData,
          error: null,
        }));
        return;
      }

      isLoadingRef.current = true;
      const token = getAuthToken();

      if (!token) {
        setState((prev) => ({ ...prev, error: "No auth token available" }));
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/proxy/perfil/obtener", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as ProfileResponse;

      setState((prev) => ({ ...prev, userData: data }));

      // Guardar en cache
      cacheService.set("user-profile", data, 10 * 60 * 1000);
      lastFetchTimeRef.current = now;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
      isLoadingRef.current = false;
    }
  }, []);
  const clearUserData = useCallback(() => {
    setState((prev) => ({ ...prev, userData: null, error: null }));
    lastFetchTimeRef.current = null;
  }, []);

  const getFuntions = useCallback(
    (busqueda: string): boolean => {
      if (!state.userData?.funcionalidades) return false;
      return state.userData.funcionalidades.some(
        (funcionalidad) =>
          typeof funcionalidad.nombre === "string" &&
          funcionalidad.nombre.trim().toLowerCase() ===
            busqueda.trim().toLowerCase()
      );
    },
    [state.userData]
  );

  const isRefreshing = useCallback(() => {
    setRefresh((prev) => !prev);
  }, []);

  // Efecto separado para manejar cambios de autenticación
  useEffect(() => {
    if (isAuthenticated && !state.userData && !isLoadingRef.current) {
      loadUserData();
    } else if (!isAuthenticated) {
      clearUserData();
    }
  }, [isAuthenticated]); // Solo depende de isAuthenticated

  // Efecto separado para manejar refresh manual
  useEffect(() => {
    if (refresh && isAuthenticated) {
      loadUserData(true);
    }
  }, [refresh, isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        loadUserData,
        clearUserData,
        getFuntions,
        isRefreshing,
        updateUserData,
        refresh,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
