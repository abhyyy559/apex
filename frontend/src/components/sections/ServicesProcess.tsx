"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxTilt } from "@/components/ui/ParallaxTilt";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    number: "01",
    title: "Discovery Call",
    description: "We learn about your brand, goals, and vision to define the project scope.",
  },
  {
    number: "02",
    title: "Proposal & Planning",
    description: "A detailed roadmap with timelines, deliverables, and milestones is crafted.",
  },
  {
    number: "03",
    title: "Design & Iterate",
    description: "Cinematic designs are created and refined through collaborative feedback.",
  },
  {
    number: "04",
    title: "Development & QA",
    description: "Pixel-perfect build with rigorous testing across devices and browsers.",
  },
  {
    number: "05",
    title: "Launch & Optimize",
    description: "Seamless deployment followed by performance monitoring and iterations.",
  },
];

export function ServicesProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".process-card");
    if (!cards?.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      }
    );

    gsap.fromTo(
      cards,
      { rotateY: 10 },
      {
        rotateY: 0, duration: 1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services-process"
      className="relative section-padding"
      aria-labelledby="process-heading"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          label="How We Deliver"
          title="Our Engagement Process"
          subtitle="A streamlined approach that ensures clarity, quality, and on-time delivery."
          align="center"
          className="max-w-3xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mt-12 md:mt-16">
          {STEPS.map((step, index) => (
            <ParallaxTilt key={step.number} maxTilt={4} scale={1.02}>
              <div className="process-card relative rounded-2xl p-6 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-center group hover:border-[rgba(204,34,0,0.2)] transition-all duration-500">
                <div className="w-12 h-12 rounded-full bg-[rgba(204,34,0,0.1)] border border-[rgba(204,34,0,0.2)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[rgba(204,34,0,0.18)] transition-colors duration-300">
                  <span className="font-[family-name:var(--font-syne)] text-sm font-bold text-[#CC2200]">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-syne)] text-sm font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  {step.description}
                </p>

                {index < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path d="M6 4l4 4-4 4" stroke="rgba(204,34,0,0.3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </ParallaxTilt>
          ))}
        </div>
      </div>
    </section>
  );
}
