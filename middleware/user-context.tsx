"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  use,
} from "react";
import { ProfileResponse } from "@/services/profile-service";
import { useAuth } from "@/middleware/auth-provider";
import { getAuthToken } from "../lib/api-config";
// 1. Definición de tipos
export interface UserContextState {
  userData: ProfileResponse | null;
  isLoading: boolean;
  error: string | null;
  refresh: boolean;
}

export interface UserContextActions {
  loadUserData: () => Promise<void>;
  clearUserData: () => void;
  isRefreshing: () => void;
  getFuntions: (busqueda: string) => boolean;
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

  const loadUserData = useCallback(async () => {
    try {
      const token = getAuthToken();
      const options = {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      };
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch("/api/proxy/perfil/obtener", options);

      const data = (await response.json()) as ProfileResponse;

      setState((prev) => ({ ...prev, userData: data }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const clearUserData = useCallback(() => {
    setState((prev) => ({ ...prev, userData: null }));
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

  const isRefreshing = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (isAuthenticated && !state.userData) {
      loadUserData();
    }
  }, [isAuthenticated, state.userData, loadUserData]);

  return (
    <UserContext.Provider
      value={{
        ...state,
        loadUserData,
        clearUserData,
        getFuntions,
        isRefreshing,
        refresh,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
