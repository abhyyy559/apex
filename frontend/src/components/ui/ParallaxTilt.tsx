"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type ParallaxTiltProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
};

export function ParallaxTilt({
  children,
  className = "",
  maxTilt = 8,
  scale = 1.02,
  glare = false,
}: ParallaxTiltProps) {
  const reducedMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const handleMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -maxTilt;
      const tiltY = (x - 0.5) * maxTilt;

      gsap.to(card, {
        rotateX: tiltX,
        rotateY: tiltY,
        scale,
        duration: 0.4,
        ease: "power2.out",
      });

      if (glare && glareRef.current) {
        gsap.to(glareRef.current, {
          background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(204,34,0,0.15) 0%, transparent 60%)`,
          duration: 0.4,
        });
      }
    };

    const handleLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
      if (glare && glareRef.current) {
        gsap.to(glareRef.current, {
          background: "transparent",
          duration: 0.3,
        });
      }
    };

    card.addEventListener("pointermove", handleMove);
    card.addEventListener("pointerleave", handleLeave);

    return () => {
      card.removeEventListener("pointermove", handleMove);
      card.removeEventListener("pointerleave", handleLeave);
    };
  }, [maxTilt, scale, reducedMotion, glare]);

  return (
    <div
      ref={cardRef}
      className={`relative [transform-style:preserve-3d] ${className}`}
    >
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 rounded-2xl pointer-events-none z-10"
          aria-hidden
        />
      )}
      <div className="relative [transform:translateZ(20px)]">
        {children}
      </div>
    </div>
  );
}
