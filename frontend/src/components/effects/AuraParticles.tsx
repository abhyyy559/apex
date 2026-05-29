"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type Particle = {
  el: HTMLDivElement;
  x: number;
  y: number;
  size: number;
};

export function AuraParticles({ count = 25 }: { count?: number }) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const size = 2 + Math.random() * 4;
      const el = document.createElement("div");
      const x = Math.random() * 100;
      const y = Math.random() * 100;

      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        border-radius: 50%;
        background: rgba(204, 34, 0, ${0.15 + Math.random() * 0.25});
        box-shadow: 0 0 ${6 + Math.random() * 10}px rgba(204, 34, 0, ${0.1 + Math.random() * 0.2});
        pointer-events: none;
        will-change: transform, opacity;
      `;

      container.appendChild(el);
      particles.push({ el, x, y, size });

      const duration = 4 + Math.random() * 8;

      gsap.to(el, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        opacity: 0.2 + Math.random() * 0.5,
        scale: 0.5 + Math.random() * 1.5,
        duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * duration,
      });
    }

    return () => {
      particles.forEach((p) => p.el.remove());
    };
  }, [count, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-[1]"
      aria-hidden
    />
  );
}
