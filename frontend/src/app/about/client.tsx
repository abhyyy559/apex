"use client";

import { lazy, Suspense } from "react";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { AboutMission } from "@/components/sections/AboutMission";
import { PageCta } from "@/components/sections/PageCta";

const AboutComponent = lazy(() => import("@/components/sections/About").then(m => ({ default: m.About })));
const WhyUs = lazy(() => import("@/components/sections/WhyUs").then(m => ({ default: m.WhyUs })));

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

export function AboutPageClient() {
  return (
    <>
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <PageHero
            label="About"
            title="We Are ApeX"
            description="A boutique digital studio crafting premium web experiences, AI-powered visuals, and brand identities for founders who refuse to blend in."
            ctaText="View Our Work"
            ctaHref="/portfolio"
            secondaryCtaText="Get in Touch"
            secondaryCtaHref="/contact"
          />
          <AboutMission />
          <Suspense fallback={<SectionFallback />}>
            <AboutComponent />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <WhyUs />
          </Suspense>
          <PageCta
            title="Let's Build Together"
            description="Ready to elevate your digital presence? We'd love to hear your story."
            ctaText="Start the Conversation"
            ctaHref="/contact"
          />
        </main>
        <Footer />
      </div>
    </>
  );
}
