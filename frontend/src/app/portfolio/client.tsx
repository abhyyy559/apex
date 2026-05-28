"use client";

import { lazy, Suspense } from "react";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { PageCta } from "@/components/sections/PageCta";

const Portfolio = lazy(() => import("@/components/sections/Portfolio").then(m => ({ default: m.Portfolio })));

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

export function PortfolioPageClient() {
  return (
    <>
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <PageHero
            label="Portfolio"
            title="Our Work"
            description="A curated selection of projects where design meets performance. Each case study reflects our commitment to cinematic quality and measurable impact."
            ctaText="Start Your Project"
            ctaHref="/contact"
            secondaryCtaText="View Services"
            secondaryCtaHref="/services"
          />
          <Suspense fallback={<SectionFallback />}>
            <Portfolio />
          </Suspense>
          <PageCta
            title="Have a Project in Mind?"
            description="Let's create something that stands out. We're just one conversation away."
            ctaText="Start a Conversation"
            ctaHref="/contact"
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
