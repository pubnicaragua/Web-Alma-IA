"use client";

import type React from "react";
import Image from "next/image";
import { useState } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isHovered, setIsHovered] = useState(false);

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
        <div className="flex justify-center mt-12 mb-8">
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
            className={`w-full max-w-md px-4 oscillate${
              isHovered ? " paused" : ""
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
