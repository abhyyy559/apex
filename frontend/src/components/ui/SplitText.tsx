"use client";

import { useRef, type ElementType } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

type SplitTextProps = {
  as?: ElementType;
  children: string;
  className?: string;
  type?: "chars" | "words" | "lines";
  stagger?: number;
  delay?: number;
  scrollTrigger?: boolean;
  once?: boolean;
};

export function SplitText({
  as: Tag = "div",
  children,
  className = "",
  type = "chars",
  stagger = 0.02,
  delay = 0,
  scrollTrigger = true,
  once = true,
}: SplitTextProps) {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const splits = container.querySelectorAll<HTMLElement>(".split-item");
    if (!splits.length) return;

    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 0.8 },
      delay,
      scrollTrigger: scrollTrigger
        ? {
            trigger: container,
            start: "top 85%",
            toggleActions: once ? "play none none none" : "play none none reverse",
          }
        : undefined,
    });

    tl.fromTo(
      splits,
      { opacity: 0, y: 40, rotateX: -10 },
      { opacity: 1, y: 0, rotateX: 0, stagger }
    );
  }, [children, type, stagger, delay, scrollTrigger, once, reducedMotion]);

  const splitItems = (() => {
    if (type === "chars") {
      return children.split("").map((char, i) => (
        <span key={i} className="split-item inline-block" aria-hidden="true">
          {char === " " ? "\u00A0" : char}
        </span>
      ));
    }
    if (type === "words") {
      return children.split(" ").map((word, i) => (
        <span key={i} className="split-item inline-block" aria-hidden="true">
          {word}
          {i < children.split(" ").length - 1 && "\u00A0"}
        </span>
      ));
    }
    return (
      <span className="split-item inline-block" aria-hidden="true">
        {children}
      </span>
    );
  })();

  return (
    <Tag ref={containerRef} className={className} aria-label={children}>
      {splitItems}
    </Tag>
  );
}
