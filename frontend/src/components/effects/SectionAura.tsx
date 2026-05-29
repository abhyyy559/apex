"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type SectionAuraProps = {
  variant?: "top" | "center" | "bottom" | "full";
  color?: string;
  intensity?: number;
};

export function SectionAura({
  variant = "center",
  color = "rgba(204,34,0,0.06)",
  intensity = 1,
}: SectionAuraProps) {
  const reducedMotion = usePrefersReducedMotion();
  const auraRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion || !auraRef.current) return;

    gsap.fromTo(
      auraRef.current,
      { opacity: 0, scale: 0.8 },
      {
        opacity: intensity * 0.8,
        scale: 1,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: auraRef.current?.parentElement,
          start: "top 85%",
          end: "top 40%",
          scrub: 1.5,
        },
      }
    );
  }, [reducedMotion, intensity]);

  const positionClass = {
    top: "top-0 left-1/2 -translate-x-1/2",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    bottom: "bottom-0 left-1/2 -translate-x-1/2",
    full: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  const sizeClass = {
    top: "w-[600px] md:w-[800px] h-[300px] md:h-[400px]",
    center: "w-[500px] md:w-[700px] h-[500px] md:h-[700px]",
    bottom: "w-[600px] md:w-[800px] h-[300px] md:h-[400px]",
    full: "w-[700px] md:w-[900px] h-[700px] md:h-[900px]",
  };

  return (
    <div
      ref={auraRef}
      className={`absolute ${positionClass[variant]} ${sizeClass[variant]} pointer-events-none opacity-0`}
      style={{
        background: `radial-gradient(circle at 50% 50%, ${color}, transparent 70%)`,
        filter: "blur(60px)",
      }}
      aria-hidden
    />
  );
}
