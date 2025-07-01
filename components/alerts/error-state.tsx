"use client";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className="bg-white rounded-lg shadow-sm p-8">
    <div className="flex items-center justify-center mb-4 text-red-500">
      <AlertCircle className="w-8 h-8 mr-2" />
      <h3 className="text-xl font-medium">Error</h3>
    </div>
    <p className="text-gray-600 text-center mb-6">{error}</p>
    <div className="flex justify-center">
      <button
        onClick={onRetry}
        className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        <RefreshCw className="w-4 h-4 mr-2" /> Reintentar
      </button>
    </div>
  </div>
);
