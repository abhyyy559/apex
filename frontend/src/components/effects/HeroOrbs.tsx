"use client";

import { useRef, useEffect } from "react";

type Orb = {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

export function HeroOrbs() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const orbs: Orb[] = [];
    const colors = [
      "rgba(204,34,0,0.08)",
      "rgba(204,34,0,0.05)",
      "rgba(204,34,0,0.06)",
      "rgba(255,255,255,0.03)",
    ];

    for (let i = 0; i < 5; i++) {
      const el = document.createElement("div");
      const size = 150 + Math.random() * 350;
      el.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, ${colors[i % colors.length]}, transparent 70%);
        pointer-events: none;
        filter: blur(40px);
        will-change: transform;
      `;
      container.appendChild(el);

      orbs.push({
        el,
        x: Math.random() * 100,
        y: Math.random() * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size,
      });
    }

    let rafId: number;
    const animate = () => {
      orbs.forEach((o) => {
        o.x += o.vx;
        o.y += o.vy;
        if (o.x < -5 || o.x > 105) o.vx *= -1;
        if (o.y < -5 || o.y > 105) o.vy *= -1;
        o.el.style.transform = `translate(${o.x}vw, ${o.y}vh)`;
      });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      orbs.forEach((o) => o.el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden
    />
  );
}
