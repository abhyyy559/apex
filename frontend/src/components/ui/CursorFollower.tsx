"use client";

import { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type CursorFollowerProps = {
  color?: string;
  size?: number;
  trailSize?: number;
  zIndex?: number;
};

export function CursorFollower({
  color = "rgba(204,34,0,0.3)",
  size = 12,
  trailSize = 40,
  zIndex = 9999,
}: CursorFollowerProps) {
  const reducedMotion = usePrefersReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });

  const handleMouse = useCallback((e: MouseEvent) => {
    posRef.current = { x: e.clientX, y: e.clientY };

    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.08,
        ease: "power2.out",
      });
    }

    if (trailRef.current) {
      gsap.to(trailRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: "power2.out",
      });
    }
  }, []);

  const handleLeave = useCallback(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 0, duration: 0.3 });
    }
    if (trailRef.current) {
      gsap.to(trailRef.current, { opacity: 0, duration: 0.3 });
    }
  }, []);

  const handleEnter = useCallback(() => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.3 });
    }
    if (trailRef.current) {
      gsap.to(trailRef.current, { opacity: 0.6, duration: 0.3 });
    }
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    window.addEventListener("mousemove", handleMouse);
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [reducedMotion, handleMouse, handleLeave, handleEnter]);

  useEffect(() => {
    if (reducedMotion) return;
    document.body.style.cursor = "none";
    return () => { document.body.style.cursor = ""; };
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <>
      <div
        ref={trailRef}
        className="pointer-events-none fixed top-0 left-0 rounded-full"
        style={{
          width: trailSize,
          height: trailSize,
          background: `radial-gradient(circle, ${color.replace("0.3", "0.15")}, transparent 70%)`,
          transform: "translate(-50%, -50%)",
          zIndex: zIndex - 1,
          opacity: 0,
          willChange: "transform",
        }}
        aria-hidden
      />
      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 rounded-full"
        style={{
          width: size,
          height: size,
          background: "#CC2200",
          boxShadow: "0 0 12px rgba(204,34,0,0.6), 0 0 30px rgba(204,34,0,0.2)",
          transform: "translate(-50%, -50%)",
          zIndex,
          opacity: 0,
          willChange: "transform",
        }}
        aria-hidden
      />
    </>
  );
}
