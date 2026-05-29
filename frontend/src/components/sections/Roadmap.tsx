"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ROADMAP_STEPS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAura } from "@/components/effects/SectionAura";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Roadmap() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pulseRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const steps = stepsRef.current.filter((s): s is HTMLDivElement => s !== null);
    if (!steps.length) return;

    gsap.fromTo(
      timelineRef.current,
      { scaleY: 0, transformOrigin: "top center" },
      {
        scaleY: 1,
        duration: 1.6,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1.5,
        },
      }
    );

    gsap.to(pulseRef.current, {
      opacity: 0.6,
      scale: 1.5,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    steps.forEach((step, idx) => {
      gsap.fromTo(
        step,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      const icon = step.querySelector(".roadmap-icon");
      if (icon) {
        gsap.fromTo(
          icon,
          { scale: 0, opacity: 0, rotation: -180 },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(2)",
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      const connector = step.querySelector(".step-connector");
      if (connector) {
        gsap.fromTo(
          connector,
          { scaleX: 0, transformOrigin: isLeft(idx) ? "right center" : "left center" },
          {
            scaleX: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    });
  }, []);

  const isLeft = (idx: number) => idx % 2 === 0;

  const setStepRef = (el: HTMLDivElement | null, index: number) => {
    stepsRef.current[index] = el;
  };

  return (
    <section
      ref={sectionRef}
      id="roadmap"
      aria-labelledby="roadmap-heading"
      className="relative section-padding overflow-hidden"
    >
      <SectionAura variant="full" intensity={0.4} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          label="Our Process"
          title="How We Work"
          subtitle="A proven 6-step pipeline from concept to launch — and beyond."
          align="center"
          className="max-w-3xl"
        />

        <div className="relative mt-20 md:mt-28">
          <div
            ref={timelineRef}
            className="absolute left-7 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#CC2200] via-[rgba(204,34,0,0.4)] to-transparent origin-top"
          >
            <div
              ref={pulseRef}
              className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#CC2200]"
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {ROADMAP_STEPS.map((step, index) => {
              const left = isLeft(index);
              return (
                <div
                  key={step.number}
                  ref={(el) => setStepRef(el, index)}
                  className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-8 ${
                    left ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className={`flex-1 ${left ? "md:text-right md:pr-12" : "md:text-left md:pl-12"}`}>
                    <div className="step-connector" />
                    <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-bold tracking-tight text-white mb-3">
                      <span className="text-[#CC2200]">{step.number}.</span> {step.title}
                    </h3>
                    <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-md inline-block">
                      {step.description}
                    </p>
                  </div>

                  <div className="relative z-10 flex-shrink-0 hidden md:flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[rgba(204,34,0,0.12)] border border-[rgba(204,34,0,0.3)] flex items-center justify-center roadmap-icon">
                      <span className="font-[family-name:var(--font-syne)] text-sm font-bold text-[#CC2200]">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 md:invisible" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
