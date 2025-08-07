"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Importamos version desde package.json (ajusta la ruta según donde esté este archivo)
import packageInfo from "../../package.json";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const apkUrl = "/download"; // Cambia la url si tienes otra ruta

  return (
    <>
      <style>{`
        @keyframes slowOscillate {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .oscillate {
          animation: slowOscillate 3s ease-in-out infinite;
          will-change: transform;
        }
        .paused {
          animation-play-state: paused !important;
        }
      `}</style>

      <div className="min-h-screen bg-blue-400 flex flex-col">
        {/* Logo */}
        <div className="flex flex-col justify-center mt-12 mb-8 items-center">
          <div className="h-20 w-auto mr-2">
            <Image
              src="/logotipo.png"
              alt="AlmaIA Logo"
              width={128}
              height={40}
              className="h-full w-auto"
            />
          </div>
        </div>

        {/* Contenido con animación */}
        <div className="flex-1 flex justify-center items-start">
          <div
            className={`items-center w-full max-w-md px-4 oscillate${
              isHovered ? " paused" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {children}
          </div>
        </div>

        {/* Footer simple y minimalista */}
        <footer
          className="text-center text-gray-200 bg-blue-400 border-t border-blue-400 py-3 text-sm select-none"
          style={{ userSelect: "none" }}
        >
          {" "}
          {pathname !== "/download" ? (
            <a
              href={apkUrl}
              className="mb-8 inline-flex items-center gap-2 px-5 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition"
            >
              Descargar APK Android
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 12l5 5m0 0l5-5m-5 5V4"
                />
              </svg>
            </a>
          ) : null}
          <div>
            Versión: {packageInfo.version} © {year} AlmaIA
          </div>
          <div>Todos los derechos reservados.</div>
        </footer>
      </div>
    </>
  );
}
