"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";

type PageHeroProps = {
  label: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
};

export function PageHero({
  label,
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: PageHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.querySelectorAll(".page-hero-anim");
      if (!elements?.length) return;
      gsap.fromTo(
        elements,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[50vh] md:min-h-[60vh] flex items-center section-padding pt-32 pb-16 md:pb-20 overflow-hidden"
    >
      <div className="absolute inset-0 perspective-grid opacity-30 pointer-events-none" aria-hidden />
      <div className="relative z-10 max-w-4xl">
        <p className="page-hero-anim text-xs md:text-sm uppercase tracking-[0.4em] text-text-muted mb-4 md:mb-6">
          {label}
        </p>
        <h1 className="page-hero-anim font-[family-name:var(--font-syne)] text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white mb-6">
          {title}
        </h1>
        <p className="page-hero-anim text-base md:text-lg text-text-muted max-w-2xl leading-relaxed mb-8 md:mb-10">
          {description}
        </p>
        <div className="page-hero-anim flex flex-wrap gap-4">
          {ctaText && ctaHref && (
            <Button href={ctaHref}>{ctaText}</Button>
          )}
          {secondaryCtaText && secondaryCtaHref && (
            <Button href={secondaryCtaHref} variant="glass">
              {secondaryCtaText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
