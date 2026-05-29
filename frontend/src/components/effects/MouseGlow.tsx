"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MouseGlowProps = {
  className?: string;
  size?: number;
  color?: string;
  opacity?: number;
  zIndex?: number;
};

export function MouseGlow({
  className = "",
  size = 500,
  color = "rgba(204,34,0,0.08)",
  opacity = 1,
  zIndex = 0,
}: MouseGlowProps) {
  const reducedMotion = usePrefersReducedMotion();
  const glowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    if (reducedMotion) return;
    const glow = glowRef.current;
    if (!glow) return;

    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      posRef.current = { x, y };
      gsap.to(glow, {
        background: `radial-gradient(${size}px at ${x}% ${y}%, ${color}, transparent 70%)`,
        duration: 0.6,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [reducedMotion, size, color]);

  if (reducedMotion) return null;

  return (
    <div
      ref={glowRef}
      className={`pointer-events-none fixed inset-0 transition-opacity duration-500 ${className}`}
      style={{ opacity, zIndex }}
      aria-hidden
    />
  );
}
