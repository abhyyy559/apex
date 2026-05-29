"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useServices } from "@/hooks/useContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxTilt } from "@/components/ui/ParallaxTilt";
import { SectionAura } from "@/components/effects/SectionAura";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, React.ReactNode> = {
  cube: (
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" />
  ),
  spark: (
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
  ),
  layers: (
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" />
  ),
  bolt: (
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.5" fill="none" />
  ),
};

export function ServicesPreview() {
  const { data, loading } = useServices();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".svc-card");
    if (!cards?.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );
  }, []);

  if (loading) {
    return (
      <section className="relative section-padding" aria-labelledby="services-preview-heading">
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-8 bg-gray-800 rounded w-1/4" />
          <div className="h-12 bg-gray-800 rounded w-1/2" />
        </div>
      </section>
    );
  }

  if (!data) return null;

  const previewServices = data.services.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-preview-heading"
      className="relative section-padding"
    >
      <SectionAura variant="center" intensity={0.6} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          label={data.section.label}
          title={data.section.title}
          subtitle={data.section.subtitle}
          align="center"
          className="max-w-3xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 md:mt-16">
          {previewServices.map((service) => (
            <ParallaxTilt key={service.number} maxTilt={6} scale={1.03} glare={true}>
              <div className="svc-card group relative rounded-2xl p-6 md:p-8 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(204,34,0,0.2)] transition-all duration-500 min-h-[220px] flex flex-col">
                <div className="w-10 h-10 mb-5 text-[#CC2200]">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="w-full h-full">
                    {ICONS[service.icon] || ICONS.cube}
                  </svg>
                </div>
                <p className="text-xs font-[family-name:var(--font-syne)] text-[#CC2200] mb-2">
                  {service.number}
                </p>
                <h3 className="font-[family-name:var(--font-syne)] text-lg md:text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed flex-1">
                  {service.description}
                </p>
              </div>
            </ParallaxTilt>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button href="/services" variant="glass">
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
}
