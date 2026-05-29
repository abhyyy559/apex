"use client";

import { lazy, Suspense } from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { WhyUs } from "@/components/sections/WhyUs";
import { JsonLd } from "@/components/SEO/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo";

const ServicesPreview = lazy(() => import("@/components/sections/ServicesPreview").then(m => ({ default: m.ServicesPreview })));
const Roadmap = lazy(() => import("@/components/sections/Roadmap").then(m => ({ default: m.Roadmap })));
const PortfolioShowcase = lazy(() => import("@/components/sections/PortfolioShowcase").then(m => ({ default: m.PortfolioShowcase })));
const Faq = lazy(() => import("@/components/sections/Faq").then(m => ({ default: m.Faq })));
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

export function HomePageClient() {
  const breadcrumbData = [
    { name: "Home", item: "https://apex-studio-mu.vercel.app/" },
  ];

  return (
    <AppProviders>
      <JsonLd data={serviceSchema("Cinematic Web Development", "Premium 3D web experiences with immersive animations and cutting-edge technology")} />
      <JsonLd data={serviceSchema("AI Product Posters", "AI-generated product visuals and marketing materials")} />
      <JsonLd data={serviceSchema("Brand Identity Design", "Complete brand strategy and visual identity systems")} />
      <JsonLd data={serviceSchema("UI/UX Design", "User-centered interface design with focus on conversion")} />
      <JsonLd data={breadcrumbSchema(breadcrumbData)} />
      <CinematicBackground />
      <CursorFollower />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <Hero />
          <WhyUs />
          <Suspense fallback={<SectionFallback />}>
            <ServicesPreview />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Roadmap />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <PortfolioShowcase />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Faq />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
      </div>
    </AppProviders>
  );
}
