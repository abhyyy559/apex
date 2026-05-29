"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type ParallaxSectionProps = {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: "up" | "down";
};

export function ParallaxSection({
  children,
  className = "",
  speed = 0.15,
  direction = "up",
}: ParallaxSectionProps) {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion || !sectionRef.current) return;

    gsap.fromTo(
      sectionRef.current,
      { y: direction === "up" ? speed * 200 : -speed * 200 },
      {
        y: direction === "up" ? -speed * 200 : speed * 200,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current?.parentElement,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      }
    );
  }, [reducedMotion, speed, direction]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={sectionRef} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
