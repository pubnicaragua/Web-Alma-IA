// lib/api-config.ts
import { dispatchAuthChangeEvent } from "./auth-events";

// API base URL para el proxy local
export const API_BASE_URL = "/api/proxy";

// Function to get the auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};

// Function to get the auth token from cookie
export const getAuthTokenFromCookie = (): string | null => {
  if (typeof window !== "undefined") {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const authCookie = cookies.find((cookie) =>
      cookie.startsWith("auth_token=")
    );
    if (authCookie) {
      const token = authCookie.split("=")[1];
      console.log(
        "Token encontrado en cookie:",
        token.substring(0, 10) + "..."
      );
      return token;
    }
    return null;
  }
  return null;
};

// Function to set the auth token
export const setAuthToken = (
  token: string,
  rememberMe: boolean = false
): void => {
  // Añadir parámetro rememberMe
  if (typeof window !== "undefined") {
    try {
      // Guardar en localStorage
      localStorage.setItem("auth_token", token);

      // Guardar en cookies para que el middleware pueda detectarlo
      // Si rememberMe es true, la cookie dura 30 días, de lo contrario, es una cookie de sesión
      let cookieString = `auth_token=${token}; path=/; SameSite=Lax`;
      if (rememberMe) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 15); // 15 días
        cookieString += `; expires=${expirationDate.toUTCString()}`;
      } else {
        // Para que la cookie sea de sesión y expire al cerrar el navegador
        // No se añade 'expires' ni 'max-age'
      }
      document.cookie = cookieString;

      console.log("Token guardado correctamente:");
      console.log("- En localStorage:", token.substring(0, 10) + "...");
      console.log(
        "- En cookie:",
        rememberMe
          ? `con expiración: ${expirationDate.toUTCString()}`
          : "de sesión"
      );
      // Verificar que se haya guardado correctamente
      const storedToken = localStorage.getItem("auth_token");
      const cookieToken = getAuthTokenFromCookie();
      console.log("Verificación después de guardar:");
      console.log(
        "- Token en localStorage:",
        storedToken ? "Presente" : "No presente"
      );
      console.log(
        "- Token en cookie:",
        cookieToken ? "Presente" : "No presente"
      );
      dispatchAuthChangeEvent(true);
    } catch (error) {
      console.error("Error al guardar el token:", error);
    }
  }
};

// Function to remove the auth token (for logout)
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("auth_token");
      document.cookie =
        "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax";

      console.log("Token eliminado correctamente");

      const storedToken = localStorage.getItem("auth_token");

      const cookieToken = getAuthTokenFromCookie();

      console.log("Verificación después de eliminar:");

      console.log(
        "- Token en localStorage:",
        storedToken ? "Presente" : "No presente"
      );

      console.log(
        "- Token en cookie:",
        cookieToken ? "Presente" : "No presente"
      );

      dispatchAuthChangeEvent(false);
    } catch (error) {
      console.error("Error al eliminar el token:", error);
    }
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const cookieToken = getAuthTokenFromCookie();
  const isAuth = !!token || !!cookieToken;
  console.log(
    `isAuthenticated check: ${isAuth ? "Autenticado" : "No autenticado"}`
  );
  console.log(`- localStorage token: ${token ? "Presente" : "No presente"}`);
  console.log(`- cookie token: ${cookieToken ? "Presente" : "No presente"}`);
  return isAuth;
};

// Custom error class for API errors
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Helper function to get selected school ID safely
const getSelectedSchoolId = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      const selectedSchool = localStorage.getItem("selectedSchool");
      return selectedSchool || null;
    } catch (error) {
      console.error("Error al obtener selectedSchool:", error);
      return null;
    }
  }
  return null;
};

export const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {},
  addSchoolId: boolean = true // nuevo parámetro para controlar si se agrega colegio_id
): Promise<Response> => {
  const token = getAuthToken();
  const method = options.method || "GET";

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let processedEndpoint = endpoint;

  // Solo agregar colegio_id si addSchoolId es true y se cumplen las condiciones originales
  if (
    addSchoolId &&
    !endpoint.endsWith("/colegios") &&
    !endpoint.includes("/preguntas") &&
    !endpoint.includes("/colegios/usuarios_colegios")
  ) {
    const selectedSchool = getSelectedSchoolId();
    if (selectedSchool) {
      const separator = endpoint.includes("?") ? "&" : "?";
      processedEndpoint += `${separator}colegio_id=${selectedSchool}`;
    }
  }

  const normalizedEndpoint = processedEndpoint.startsWith("/")
    ? processedEndpoint
    : `/${processedEndpoint}`;

  console.log(
    `api-config:Enviando solicitud ${method} a ${API_BASE_URL}${normalizedEndpoint}`
  );

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      method,
      headers,
    });

    if (response.status === 401) {
      console.error("Error de autenticación: Token inválido o expirado");
      throw new ApiError("Token inválido o expirado", 401);
    }

    if (!response.ok) {
      let errorDetails = `${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.text();
        if (errorBody) {
          errorDetails += ` - ${errorBody}`;
        }
      } catch (parseError) {
        console.warn("No se pudo leer el cuerpo del error:", parseError);
      }

      console.error(`Error detallado de la API:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
      });

      throw new ApiError(
        `Error en la solicitud: ${errorDetails}`,
        response.status
      );
    }

    return response;
  } catch (error) {
    console.error("API request error:", error);

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(`Error de red: ${error}`, 0);
  }
};

// Simple fetch without auth
export const fetchApi = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();

  const method = options.method || "GET";

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Asegurar que el endpoint comience con /
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  console.log(
    `api-config:Enviando solicitud sin auth ${method} a ${API_BASE_URL}${normalizedEndpoint}`
  );

  try {
    const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
      ...options,
      method,
      headers,
    });

    // Si la respuesta no es exitosa, lanzar un error
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta para obtener más detalles
      let errorDetails = `${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.text();
        if (errorBody) {
          errorDetails += ` - ${errorBody}`;
        }
      } catch (parseError) {
        console.warn("No se pudo leer el cuerpo del error:", parseError);
      }

      console.error(`Error detallado de la API:`, {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
      });

      throw new ApiError(
        `Error en la solicitud: ${errorDetails}`,
        response.status
      );
    }

    return response;
  } catch (error) {
    console.error("API request error:", error);

    // Si es un ApiError, lo propagamos
    if (error instanceof ApiError) {
      throw error;
    }

    // Si es otro tipo de error, lo envolvemos en un ApiError
    throw new ApiError(`Error de red: ${error}`, 0);
  }
};
