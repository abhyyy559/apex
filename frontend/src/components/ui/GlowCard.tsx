import { type HTMLAttributes, type ReactNode } from "react";

type GlowCardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "div" | "section";
  children: ReactNode;
  variant?: "default" | "glass" | "bordered";
  glowColor?: string;
  hoverScale?: boolean;
};

export function GlowCard({
  as: Tag = "div",
  children,
  variant = "glass",
  glowColor = "rgba(204,34,0,0.15)",
  hoverScale = true,
  className = "",
  ...props
}: GlowCardProps) {
  const variantClass = {
    default:
      "bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]",
    glass:
      "glass-panel",
    bordered:
      "bg-[rgba(255,255,255,0.02)] border border-[rgba(204,34,0,0.12)]",
  };

  return (
    <Tag
      className={`relative rounded-2xl overflow-hidden ${
        variantClass[variant]
      } ${
        hoverScale
          ? "transition-all duration-500 hover:scale-[1.02]"
          : ""
      } ${className}`}
      {...props}
    >
      <div
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowColor}, transparent 70%)`,
        }}
        aria-hidden
      />
      <div className="relative z-[1]">{children}</div>
    </Tag>
  );
}
