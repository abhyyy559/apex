"use client";

import { lazy, Suspense } from "react";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesProcess } from "@/components/sections/ServicesProcess";
import { PageCta } from "@/components/sections/PageCta";

const ServicesComponent = lazy(() => import("@/components/sections/Services").then(m => ({ default: m.Services })));

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
        <main id="main-content">
          <PageHero
            label="Services"
            title="Premium Digital Services"
            description="From cinematic websites to AI-powered visuals and brand identity systems — we craft digital experiences that elevate your brand and drive results."
            ctaText="Start Your Project"
            ctaHref="/contact"
          />
          <Suspense fallback={<SectionFallback />}>
            <ServicesComponent />
          </Suspense>
          <ServicesProcess />
          <PageCta
            title="Ready to Elevate Your Brand?"
            description="Let's discuss your vision and create something extraordinary together."
            ctaText="Get in Touch"
            ctaHref="/contact"
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
