"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { CustomCursor } from "@/components/cursor/CustomCursor";
import { CinematicBackground } from "@/components/effects/CinematicBackground";
import { Footer } from "@/components/layout/Footer";
import { FloatingGlassNavbar } from "@/components/layout/FloatingGlassNavbar";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Portfolio } from "@/components/sections/Portfolio";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { JsonLd } from "@/components/SEO/JsonLd";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo";

export function PageShell() {
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
      <CustomCursor />
      <CinematicBackground />
      <div className="relative z-[1]">
        <FloatingGlassNavbar />
        <main id="main-content">
          <Hero />
          <Services />
          <Marquee />
          <Portfolio />
          <ErrorBoundary>
            <Testimonials />
          </ErrorBoundary>
          <Contact />
        </main>
        <Footer />
      </div>
    </AppProviders>
  );
}
