"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type GsapMarqueeProps = {
  items: string[];
  className?: string;
  speed?: number;
};

export function GsapMarquee({
  items,
  className = "",
  speed = 0.5,
}: GsapMarqueeProps) {
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;
    const duration = totalWidth / (100 * speed);

    gsap.to(track, {
      x: -totalWidth,
      duration,
      ease: "none",
      repeat: -1,
    });
  }, [items, speed, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <div className="flex whitespace-nowrap">
          {items.map((item, i) => (
            <span key={i} className="mx-8 md:mx-12 text-2xl md:text-4xl font-[family-name:var(--font-syne)] font-bold tracking-tight text-white/80">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  const doubled = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="mx-8 md:mx-12 text-2xl md:text-4xl font-[family-name:var(--font-syne)] font-bold tracking-tight text-white/80"
          >
            {item}
            <span className="ml-8 md:ml-12 text-[#CC2200]/40 text-lg" aria-hidden>
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
