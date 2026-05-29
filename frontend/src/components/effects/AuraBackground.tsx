"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type AuraLayer = {
  size: number;
  x: number;
  y: number;
  color: string;
  blur: number;
  opacity: number;
  driftX: number;
  driftY: number;
  duration: number;
};

const AURA_LAYERS: AuraLayer[] = [
  { size: 700, x: 20, y: 15, color: "rgba(204,34,0,0.12)", blur: 120, opacity: 0.8, driftX: 8, driftY: 5, duration: 12 },
  { size: 500, x: 75, y: 25, color: "rgba(204,34,0,0.08)", blur: 100, opacity: 0.7, driftX: -6, driftY: 8, duration: 15 },
  { size: 600, x: 50, y: 50, color: "rgba(180,20,0,0.06)", blur: 110, opacity: 0.9, driftX: 10, driftY: -7, duration: 18 },
  { size: 400, x: 80, y: 70, color: "rgba(204,34,0,0.07)", blur: 90, opacity: 0.6, driftX: -8, driftY: -5, duration: 14 },
  { size: 550, x: 30, y: 80, color: "rgba(220,50,10,0.05)", blur: 100, opacity: 0.5, driftX: 5, driftY: 10, duration: 16 },
  { size: 350, x: 10, y: 45, color: "rgba(204,34,0,0.09)", blur: 80, opacity: 0.7, driftX: -4, driftY: 6, duration: 11 },
  { size: 450, x: 90, y: 10, color: "rgba(255,60,20,0.04)", blur: 95, opacity: 0.5, driftX: 7, driftY: -8, duration: 13 },
];

export function AuraBackground() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const elements: HTMLDivElement[] = [];

    AURA_LAYERS.forEach((layer) => {
      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        width: ${layer.size}px;
        height: ${layer.size}px;
        left: ${layer.x}%;
        top: ${layer.y}%;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, ${layer.color}, transparent 70%);
        filter: blur(${layer.blur}px);
        pointer-events: none;
        will-change: transform, opacity;
        opacity: ${layer.opacity};
      `;
      container.appendChild(el);
      elements.push(el);

      gsap.to(el, {
        x: layer.driftX * (window.innerWidth / 100),
        y: layer.driftY * (window.innerHeight / 100),
        opacity: layer.opacity * 0.6,
        duration: layer.duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => {
      elements.forEach((el) => el.remove());
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute w-[800px] h-[800px] rounded-full bg-[rgba(204,34,0,0.04)] blur-[100px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden
    />
  );
}
