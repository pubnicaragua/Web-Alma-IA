// UnauthorizedMessage.tsx
"use client";

export function UnauthorizedMessage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 bg-red-50 rounded-md border border-red-200 shadow">
      {/* Icono sencillo SVG */}
      <svg
        width="48"
        height="48"
        fill="none"
        viewBox="0 0 48 48"
        className="mb-4"
      >
        <circle
          cx="24"
          cy="24"
          r="22"
          stroke="#f87171"
          strokeWidth="4"
          fill="#fee2e2"
        />
        <rect x="19" y="22" width="10" height="10" rx="2" fill="#f87171" />
        <rect x="21" y="11" width="6" height="11" rx="3" fill="#f87171" />
      </svg>
      <h2 className="text-2xl font-bold text-red-600 mb-2">
        Acceso no autorizado
      </h2>
      <p className="text-red-500 text-center mb-2 max-w-md">
        No tienes permisos para acceder a esta sección de la aplicación.
      </p>
      <p className="text-gray-400 text-center text-sm">
        Si crees que es un error, contacta a tu administrador.
      </p>
    </div>
  );
}
