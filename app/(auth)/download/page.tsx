"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownTrayIcon,
  InformationCircleIcon,
  CalendarDaysIcon,
  CloudArrowDownIcon,
  DevicePhoneMobileIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const APP_INFO = {
  name: "AlmaIA",
  version: "v1.0.0",
  description: (
    <>
      <p>
        <strong>AlmaIA</strong> es la <strong>aplicación inteligente</strong>{" "}
        diseñada para que colegios y familias puedan <strong>monitorear</strong>{" "}
        el <strong>estado emocional</strong> y la asistencia de los estudiantes
        en <strong>tiempo real</strong>.
      </p>
      <br />
      <p>
        Con un <strong>enfoque amigable</strong> y <strong>seguro</strong>,{" "}
        <strong>AlmaIA</strong> ayuda a <strong>detectar</strong> a tiempo
        cambios emocionales, generar <strong>alertas</strong> y entregar{" "}
        información útil a profesores, especialistas y apoderados.
      </p>
    </>
  ),
  Url: "https://almaia.cl/app-android-almaia-v1.0.apk",
  updatedAt: "2025-08-07",
  size: "72.3 MB",
  downloads: "12k",
  minAndroidVersion: "6.0",
  rating: 3.5,
  reviewsCount: 892,
};

function renderStars(rating: number) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarIcon
        key={i}
        className={`w-5 h-5 ${
          i <= Math.floor(rating)
            ? "text-yellow-400"
            : i - rating <= 0.5
            ? "text-yellow-300"
            : "text-gray-300"
        }`}
      />
    );
  }
  return stars;
}

export default function AndroidDownload() {
  const [showTechnical, setShowTechnical] = useState(false);

  return (
    <div className="max-w-md mx-auto mt-4 p-8 bg-white rounded-3xl shadow-2xl relative">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring" }}
        >
          <div className="flex items-center gap-4 mb-6">
            <img
              src="/app_icon.png"
              alt="App icon"
              className="w-14 h-14 rounded-lg shadow"
            />
            <div className="flex flex-col">
              <h2 className="font-bold text-xl">{APP_INFO.name}</h2>
              <span className="text-xs text-gray-400">{APP_INFO.version}</span>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <CalendarDaysIcon className="w-4 h-4" />
                <time dateTime={APP_INFO.updatedAt}>
                  Actualizado:{" "}
                  {new Date(APP_INFO.updatedAt).toLocaleDateString()}
                </time>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-5">{APP_INFO.description}</p>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 gap-4 mb-5 text-gray-600 text-sm">
            <div className="flex items-center gap-2">
              <CloudArrowDownIcon className="w-5 h-5 text-green-500" />
              <span>Tamaño: {APP_INFO.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudArrowDownIcon className="w-5 h-5 text-green-500" />
              <span>Descargas: {APP_INFO.downloads}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <DevicePhoneMobileIcon className="w-5 h-5 text-green-500" />
              <span>
                Requiere Android {APP_INFO.minAndroidVersion} o superior
              </span>
            </div>
          </div>

          {/* Reseña con estrellas */}
          <div className="flex items-center mb-6 gap-2 text-yellow-400">
            {renderStars(APP_INFO.rating)}
            <span className="text-gray-600 text-sm ml-2">
              {APP_INFO.rating} ({APP_INFO.reviewsCount} opiniones)
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4 mb-5">
            {/* Enlace directo para descarga evita CORS */}
            <motion.a
              href={APP_INFO.Url}
              download={`${APP_INFO.name}.apk`}
              className="flex items-center gap-2 px-6 py-3 text-white rounded-full font-semibold bg-green-500 transition-all shadow-lg hover:bg-green-600"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              aria-label={`Descargar ${APP_INFO.name}`}
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
              Descargar
            </motion.a>

            <motion.button
              onClick={() => setShowTechnical((v) => !v)}
              whileHover={{ scale: 1.04, backgroundColor: "#e0e7ff" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1 px-4 py-2 rounded-full font-semibold bg-indigo-100 text-indigo-700 shadow hover:shadow-md transition"
              aria-expanded={showTechnical}
              aria-controls="technical-info"
            >
              <InformationCircleIcon className="w-5 h-5" />
              Información
            </motion.button>
          </div>

          {/* Barra de progreso: eliminado por no usar axios para descarga */}

          {/* Info técnica expandible */}
          <AnimatePresence>
            {showTechnical && (
              <motion.div
                id="technical-info"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden text-gray-700 bg-gray-50 rounded-lg p-4 mt-4 text-sm shadow-inner"
              >
                <p>
                  <strong>Nombre APK:</strong> {APP_INFO.name}.apk
                </p>
                <p>
                  <strong>Tamaño:</strong> {APP_INFO.size}
                </p>
                <p>
                  <strong>Versión:</strong> {APP_INFO.version}
                </p>
                <p>
                  <strong>Última actualización:</strong>{" "}
                  {new Date(APP_INFO.updatedAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Requisitos mínimos:</strong> Android{" "}
                  {APP_INFO.minAndroidVersion}
                </p>
                <p>
                  <strong>Descargas totales:</strong> {APP_INFO.downloads}
                </p>
                <p>PACK APK firmado digitalmente y libre de virus.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
