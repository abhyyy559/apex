import { type ReactNode } from "react";

type GlowBorderProps = {
  children: ReactNode;
  className?: string;
  active?: boolean;
  speed?: number;
};

export function GlowBorder({
  children,
  className = "",
  active = true,
  speed = 4,
}: GlowBorderProps) {
  return (
    <div className={`relative group ${className}`}>
      {active && (
        <div
          className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `conic-gradient(from 0deg, transparent, rgba(204,34,0,0.3), transparent, rgba(204,34,0,0.3), transparent)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
            padding: "1px",
            animation: active ? `glow-spin ${speed}s linear infinite` : "none",
          }}
          aria-hidden
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
