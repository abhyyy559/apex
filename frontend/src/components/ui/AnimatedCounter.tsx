"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type AnimatedCounterProps = {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
};

export function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  duration = 2,
  className = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(reducedMotion ? end : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useGSAP(() => {
    if (reducedMotion || animated.current) return;

    const obj = { val: 0 };
    animated.current = true;

    gsap.to(obj, {
      val: end,
      duration,
      ease: "power3.out",
      onUpdate: () => {
        setDisplayValue(obj.val);
      },
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    });
  }, [end, duration, reducedMotion]);

  const formatted = reducedMotion
    ? end.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : displayValue.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
