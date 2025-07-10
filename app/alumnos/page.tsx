"use client";

import { Suspense } from "react";
import { Header } from "@/components/header";
import { NavigationMenu } from "@/components/navigation-menu";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { AndroidNavMenu } from "@/components/android-nav-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { StudentsContent } from "@/components/students/student-component";
import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";

export default function StudentsPage() {
  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Alumnos</h2>
        <Suspense fallback={<div>Cargando búsqueda...</div>}>
          <StudentsContent />
        </Suspense>
      </div>
    </AppLayout>
  );
}
