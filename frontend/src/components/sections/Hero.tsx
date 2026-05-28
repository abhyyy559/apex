"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { Button } from "@/components/ui/Button";
import { useHero } from "@/hooks/useContent";
import { useEffectCapabilities } from "@/hooks/useEffectCapabilities";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Hero({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const { lowPower } = useEffectCapabilities();
  const [showOrbs, setShowOrbs] = useState(false);
  const { data: heroData, loading } = useHero();

  const sectionRef = useRef<HTMLElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reducedMotion && !lowPower) {
      const timer = setTimeout(() => setShowOrbs(true), 300);
      return () => clearTimeout(timer);
    }
  }, [reducedMotion, lowPower]);

  useGSAP(() => {
    if (reducedMotion || loading || !heroData) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      taglineRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    );

    const headlineLines = headlineRef.current?.querySelectorAll(".hero-line");
    if (headlineLines?.length) {
      tl.fromTo(
        headlineLines,
        { opacity: 0, y: 60, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.15 },
        "-=0.4"
      );
    }

    tl.fromTo(
      descriptionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7 },
      "-=0.3"
    );

    const ctaButtons = ctaRef.current?.querySelectorAll(".hero-cta");
    if (ctaButtons?.length) {
      tl.fromTo(
        ctaButtons,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1 },
        "-=0.2"
      );
    }

    const scrollIndicator = sectionRef.current?.querySelector(".hero-scroll-indicator");
    if (scrollIndicator) {
      gsap.fromTo(
        scrollIndicator,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          delay: 2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom top",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, [reducedMotion, loading, heroData]);

  if (loading) {
    return (
      <section
        className={`relative min-h-screen flex flex-col justify-center overflow-hidden section-padding pb-0 ${className || ''}`}
        aria-labelledby="hero-heading"
      >
        <div className="relative z-10">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-800 rounded w-1/3" />
            <div className="h-20 bg-gray-800 rounded w-3/4" />
            <div className="h-6 bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      </section>
    );
  }

  if (!heroData) return null;

  const headlineLines = heroData.headline.split('\n');

  return (
    <section
      ref={sectionRef}
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden section-padding pb-0 ${className || ''}`}
      aria-labelledby="hero-heading"
    >
      {showOrbs && <FloatingOrbs />}
      <div className="absolute inset-0 perspective-grid opacity-40 pointer-events-none" aria-hidden />

      <div className="relative z-10">
        <p
          ref={taglineRef}
          className="mt-[2vh] text-xs md:text-sm uppercase tracking-[0.4em] text-text-muted mb-6 md:mb-8"
        >
          {heroData.tagline}
        </p>

        <h1
          ref={headlineRef}
          id="hero-heading"
          className="font-[family-name:var(--font-syne)] text-[clamp(2rem,6vw,5rem)] sm:text-[clamp(2.5rem,7vw,5.5rem)] md:text-[clamp(2.5rem,8vw,6.5rem)] font-bold leading-[1.1] sm:leading-[1.05] tracking-[-0.03em] mb-6 md:mb-8 text-text-primary"
        >
          {headlineLines.map((line, i) => (
            <span key={i} className="hero-line block leading-[1.1] sm:leading-[1.05] m-0 p-0">
              {line}
            </span>
          ))}
        </h1>

        <p
          ref={descriptionRef}
          className="text-base md:text-xl text-text-muted max-w-2xl leading-relaxed mb-10 md:mb-12"
        >
          {heroData.description}
        </p>

        <div ref={ctaRef} className="flex flex-wrap gap-4 md:gap-5">
          {heroData.ctaButtons.map((button, index) => (
            <span key={index} className="hero-cta inline-block">
              <Button
                href={button.href}
                variant={button.variant as "gradient" | "glass"}
              >
                {button.text}
              </Button>
            </span>
          ))}
        </div>
      </div>

      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0">
        <div className="w-6 h-10 rounded-full border border-[rgba(255,255,255,0.15)] flex items-start justify-center p-1.5">
          <div className="w-1 h-2 rounded-full bg-[#CC2200] animate-bounce" />
        </div>
      </div>
    </section>
  );
}
