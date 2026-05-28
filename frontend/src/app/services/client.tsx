"use client";

import { lazy, Suspense } from "react";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Footer } from "@/components/layout/Footer";

const ServicesComponent = lazy(() => import("@/components/sections/Services").then(m => ({ default: m.Services })));
const Contact = lazy(() => import("@/components/sections/Contact").then(m => ({ default: m.Contact })));

function SectionFallback() {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-pulse space-y-4 w-full max-w-4xl">
        <div className="h-8 bg-gray-800 rounded w-1/3" />
        <div className="h-32 bg-gray-800 rounded" />
      </div>
    </div>
  );
}

export function ServicesPageClient() {
  return (
    <>
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content" className="pt-32">
          <Suspense fallback={<SectionFallback />}>
            <ServicesComponent />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
