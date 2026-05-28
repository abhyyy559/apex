"use client";

import { Suspense, lazy } from "react";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { ContactInfo } from "@/components/sections/ContactInfo";

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

export function ContactPageClient() {
  return (
    <>
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <PageHero
            label="Contact"
            title="Let's Talk"
            description="Have a project, a question, or just an idea? We're all ears. Fill out the form below or reach out directly — we'll get back to you within 24 hours."
          />
          <ContactInfo />
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
