"use client";

import { useRef, useCallback, type ReactNode, type ButtonHTMLAttributes } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type MagneticButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  ...props
}: MagneticButtonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (reducedMotion || !btnRef.current) return;
      const rect = btnRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * strength;
      const y = (e.clientY - rect.top - rect.height / 2) * strength;
      gsap.to(btnRef.current, {
        x,
        y,
        duration: 0.4,
        ease: "power2.out",
      });
    },
    [reducedMotion, strength]
  );

  const handleLeave = useCallback(() => {
    if (reducedMotion || !btnRef.current) return;
    gsap.to(btnRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  }, [reducedMotion]);

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
