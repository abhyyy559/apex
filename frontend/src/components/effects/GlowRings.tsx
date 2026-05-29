"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export function GlowRings() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return;

    const rings: HTMLDivElement[] = [];
    const positions = [
      { x: 15, y: 20, size: 200 },
      { x: 85, y: 30, size: 150 },
      { x: 70, y: 75, size: 180 },
      { x: 25, y: 80, size: 120 },
      { x: 50, y: 45, size: 250 },
    ];

    positions.forEach((pos, i) => {
      const ring = document.createElement("div");
      ring.style.cssText = `
        position: absolute;
        width: ${pos.size}px;
        height: ${pos.size}px;
        left: ${pos.x}%;
        top: ${pos.y}%;
        border-radius: 50%;
        border: 1px solid rgba(204,34,0,${0.06 + i * 0.02});
        pointer-events: none;
        will-change: transform, opacity;
      `;
      container.appendChild(ring);
      rings.push(ring);

      const tl = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });

      tl.to(ring, {
        scale: 1.3 + i * 0.1,
        opacity: 0.15 + i * 0.05,
        duration: 3 + i * 0.5,
        yoyo: true,
        repeat: 1,
      });

      gsap.to(ring, {
        rotation: 360,
        duration: 20 + i * 5,
        repeat: -1,
        ease: "none",
      });

      gsap.to(ring, {
        x: (Math.random() - 0.5) * 60,
        y: (Math.random() - 0.5) * 60,
        duration: 8 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => {
      rings.forEach((r) => r.remove());
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none z-[1]"
      aria-hidden
    />
  );
}
