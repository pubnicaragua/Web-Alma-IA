// components/SplashScreen.tsx
"use client";

export default function SplashScreen() {
  return (
    <div className="bg-blue-400 fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="h-32 w-32 animate-spin rounded-full border-8 border-white border-t-transparent" />
        <h1 className="text-3xl text-white font-bold text-foreground">
          Alma IA
        </h1>
        <p className="text-xl text-muted-foreground text-white ">
          Cargando plataforma educativa...
        </p>
      </div>
    </div>
  );
}
