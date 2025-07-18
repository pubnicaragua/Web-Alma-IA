import { type NextRequest, NextResponse } from "next/server";

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Función auxiliar para normalizar la URL
const getApiUrl = (path: string[]) => {
  const pathStr = path.join("/");
  const baseUrl = API_BASE_URL.endsWith("/")
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;
  return `${baseUrl}/${pathStr}`;
};

// Función para manejar errores de manera consistente
const handleApiError = (error: unknown, path: string) => {
  // Determinar el tipo de error para dar una respuesta más específica
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return NextResponse.json(
      {
        error:
          "No se pudo conectar con el servidor API. Por favor, inténtelo más tarde.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { error: "Error interno del servidor al procesar la solicitud." },
    { status: 500 }
  );
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params antes de usar sus propiedades
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");
    const apiUrl = getApiUrl(resolvedParams.path);

    // Obtener searchParams de la URL del request
    const { searchParams } = new URL(request.url);

    // Construir la URL final con query parameters
    let finalApiUrl = apiUrl;
    if (searchParams.size > 0) {
      const queryString = Array.from(searchParams.entries())
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      finalApiUrl += `?${queryString}`;
    }

    // Obtener el token de autorización de la solicitud
    const authHeader = request.headers.get("authorization");

    // Preparar headers para la solicitud a la API externa
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Añadir el header de autorización si existe
    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else {
      console.warn(
        "No se proporcionó token de autorización para la solicitud GET a:",
        path
      );

      // Si no hay token, rechazar la solicitud
      return NextResponse.json(
        { error: "Se requiere autenticación" },
        { status: 401 }
      );
    }

    // Hacer la solicitud a la API real
    const response = await fetch(finalApiUrl, {
      method: "GET",
      headers,
      // Añadir un timeout para evitar que la solicitud se quede colgada
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta como texto
      const errorText = await response.text();

      // Devolver el error
      return NextResponse.json(
        { error: errorText || response.statusText || "Error en la solicitud" },
        { status: response.status }
      );
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      // Si no es JSON, devolver el texto
      const textData = await response.text();
      return new NextResponse(textData, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    const resolvedParams = await params;
    return handleApiError(error, resolvedParams.path.join("/"));
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");

    // Verificar si es una solicitud de login
    const isLoginRequest = path === "auth/login";

    // Obtener el cuerpo de la solicitud
    const body = await request.json().catch((e) => {
      return {};
    });

    const apiUrl = getApiUrl(resolvedParams.path);

    // Obtener el token de autorización de la solicitud (excepto para login)
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (!isLoginRequest) {
      const authHeader = request.headers.get("authorization");
      if (authHeader) {
        headers["Authorization"] = authHeader;
      } else {
        console.warn(
          "No se proporcionó token de autorización para la solicitud POST a:",
          path
        );

        // Si no hay token y no es login, rechazar la solicitud
        return NextResponse.json(
          { error: "Se requiere autenticación" },
          { status: 401 }
        );
      }
    }

    // Hacer la solicitud a la API real
    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      // Añadir un timeout para evitar que la solicitud se quede colgada
      signal: AbortSignal.timeout(10000), // 10 segundos de timeout
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta como texto
      const errorText = await response.text();

      // Devolver el error
      return NextResponse.json(
        { error: errorText || response.statusText || "Error en la solicitud" },
        { status: response.status }
      );
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      // Si no es JSON, devolver el texto
      const textData = await response.text();
      return new NextResponse(textData, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    const resolvedParams = await params;
    return handleApiError(error, resolvedParams.path.join("/"));
  }
}

// Aplicar los mismos cambios para PUT y DELETE...
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");
    const body = await request.json().catch(() => ({}));
    const apiUrl = getApiUrl(resolvedParams.path);

    // Obtener el token de autorización de la solicitud
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else {
      console.warn(
        "No se proporcionó token de autorización para la solicitud PUT a:",
        path
      );

      // Si no hay token, rechazar la solicitud
      return NextResponse.json(
        { error: "Se requiere autenticación" },
        { status: 401 }
      );
    }

    // Hacer la solicitud a la API real
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta como texto
      const errorText = await response.text();

      // Devolver un error formateado
      return NextResponse.json(
        { error: errorText || response.statusText || "Error en la solicitud" },
        { status: response.status }
      );
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      // Si no es JSON, devolver el texto
      const textData = await response.text();
      return new NextResponse(textData, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    const resolvedParams = await params;
    return handleApiError(error, resolvedParams.path.join("/"));
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const path = resolvedParams.path.join("/");
    const apiUrl = getApiUrl(resolvedParams.path);

    // Obtener el token de autorización de la solicitud
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    } else {
      console.warn(
        "No se proporcionó token de autorización para la solicitud DELETE a:",
        path
      );

      // Si no hay token, rechazar la solicitud
      return NextResponse.json(
        { error: "Se requiere autenticación" },
        { status: 401 }
      );
    }

    // Hacer la solicitud a la API real
    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers,
      signal: AbortSignal.timeout(10000),
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Intentar leer el cuerpo de la respuesta como texto
      const errorText = await response.text();

      // Devolver un error formateado
      return NextResponse.json(
        { error: errorText || response.statusText || "Error en la solicitud" },
        { status: response.status }
      );
    }

    // Intentar parsear la respuesta como JSON
    try {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } catch (error) {
      // Si no es JSON, devolver el texto
      const textData = await response.text();
      return new NextResponse(textData, {
        status: response.status,
        headers: { "Content-Type": "text/plain" },
      });
    }
  } catch (error) {
    const resolvedParams = await params;
    return handleApiError(error, resolvedParams.path.join("/"));
  }
}
