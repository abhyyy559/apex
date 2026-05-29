"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  size?: number;
};

export function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(204,34,0,0.12)",
  size = 400,
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPosition({ x, y });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(${size}px circle at ${position.x}% ${position.y}%, ${spotlightColor}, transparent 70%)`,
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(200px circle at ${position.x}% ${position.y}%, rgba(204,34,0,0.06), transparent 60%)`,
          filter: "blur(20px)",
        }}
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
