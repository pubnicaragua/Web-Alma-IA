"use client";
export const LoadingState = () => (
  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
    <p className="text-gray-600">Cargando alertas...</p>
  </div>
);
