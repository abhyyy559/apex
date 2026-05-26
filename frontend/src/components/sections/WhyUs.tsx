"use client";

import { Reveal } from "@/components/ui/Reveal";
import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";

const FEATURES = [
  {
    id: "3d-web",
    title: "3D Websites",
    desc: "Immersive WebGL experiences with cinematic spatial design.",
    icon: "cube",
    position: "whu-card--left",
  },
  {
    id: "performance",
    title: "Fast Performance",
    desc: "Lightning-fast load times optimized for conversion.",
    icon: "bolt",
    position: "whu-card--right",
  },
  {
    id: "brand-impact",
    title: "Brand Impact",
    desc: "Design systems that elevate storytelling, conversion, and premium positioning.",
    icon: "sparkles",
    position: "whu-card--left",
  },
  {
    id: "responsive",
    title: "Responsive Design",
    desc: "Pixel-perfect layouts for every device and interaction.",
    icon: "mobile",
    position: "whu-card--right",
  },
  {
    id: "conversion",
    title: "Conversion Strategy",
    desc: "UX and motion tuned to turn intent into measurable results.",
    icon: "chart",
    position: "whu-card--left",
  },
  {
    id: "future-ready",
    title: "Future-Ready Tech",
    desc: "Scalable systems built for emerging platforms and launch-ready audiences.",
    icon: "shield",
    position: "whu-card--right",
  },
] as const;

type Feature = (typeof FEATURES)[number];
type IconName = Feature["icon"];

function CardIcon({ name }: { name: IconName }) {
  switch (name) {
    case "cube":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 8.4 12 4l8 4.4v7.2L12 20 4 15.6V8.4Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 4v16" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4 8.4 12 12.8 20 8.4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m12 3 1.75 6.5H20l-6 6 1.75 6.5L12 15.5H4l6-6-1.75-6.5L12 3Z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      );
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2.5 13.35 7.2l4.85.7-3.5 3.4.82 4.84L12 15.75 7.48 16.1l.82-4.84-3.5-3.4 4.85-.7L12 2.5Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 6.5 6.4 8.1 8 6.5 6.4 5 5 6.5Z" fill="currentColor" />
        </svg>
      );
    case "mobile":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="7" y="3" width="10" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 18.5h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M7 14 11 9 15 13 19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3 6 5.5v5.8c0 5.1 3.9 9.9 6 10.7 2.1-.8 6-5.6 6-10.7V5.5L12 3Z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9.5 12.5 11 14 14.5 10.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <article className={`whu-card ${feature.position}`}>
      <div className="whu-card-icon">
        <CardIcon name={feature.icon} />
      </div>
      <div className="whu-card-body">
        <h3 className="whu-card-title">{feature.title}</h3>
        <p className="whu-card-desc">{feature.desc}</p>
      </div>
    </article>
  );
}

function GlassCrystal() {
  return (
    <div className="whu-stage" aria-hidden="true">
      <div className="whu-ring whu-ring--1" />
      <div className="whu-ring whu-ring--2" />
      <div className="whu-ring whu-ring--3" />
      <div className="whu-gem-outer">
        <svg className="whu-gem-svg" viewBox="0 0 120 120" aria-hidden="true">
          <defs>
            <linearGradient id="whu-gem-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
              <stop offset="100%" stopColor="rgba(200,241,53,0.24)" />
            </linearGradient>
          </defs>
          <polygon
            points="60,12 100,34 90,86 60,108 30,86 20,34"
            fill="url(#whu-gem-gradient)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
          <path d="M60 12 90 34 60 108 30 34 60 12Z" fill="rgba(255,255,255,0.16)" opacity="0.45" />
        </svg>
      </div>
      <div className="whu-crystal-glow-base" />
    </div>
  );
}

type ParticlePosition = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  size: number;
  variant: "lime" | "default";
};

export function WhyUs({ className }: { className?: string }) {
  const particlePositions: ParticlePosition[] = [
    { top: "10%", left: "16%", size: 10, variant: "lime" },
    { top: "24%", right: "12%", size: 8, variant: "default" },
    { bottom: "20%", left: "18%", size: 14, variant: "default" },
    { bottom: "14%", right: "20%", size: 12, variant: "lime" },
  ];

  return (
    <section id="about" aria-labelledby="why-us-heading" className={`why-us-section ${className ?? ""}`}>
      <div className="why-us-grid" />
      <div className="why-us-watermark" aria-hidden="true">ApeX</div>
      <div className="why-us-glow-top" />
      <div className="why-us-glow-bottom" />

      <div className="why-us-inner">
        <div className="why-us-header">
          <p className="why-us-label">Why Choose ApeX</p>

          <RevealGroup>
            <RevealItem as="h2" index={0} id="why-us-heading" className="why-us-title">
              Premium Digital <span className="why-us-accent">Excellence</span>
            </RevealItem>
            <RevealItem as="p" index={1} className="why-us-subtitle">
              From immersive WebGL experiences to conversion-first campaigns, we build premium digital products that feel polished, memorable, and built for growth.
            </RevealItem>
          </RevealGroup>
        </div>

        <div className="whu-showcase">
          <div className="whu-particles" aria-hidden={true}>
            {particlePositions.map((particle, index) => (
              <span
                key={index}
                className={`whu-particle${particle.variant === "lime" ? " whu-particle--lime" : ""}`}
                style={{
                  position: "absolute",
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  top: particle.top,
                  left: particle.left,
                  right: particle.right,
                  bottom: particle.bottom,
                }}
              />
            ))}
          </div>

          <div className="whu-cards whu-pl whu-pl--left">
            {FEATURES.filter((feature) => feature.position === "whu-card--left").map((feature) => (
              <Reveal key={feature.id} delay={0.08}>
                <FeatureCard feature={feature} />
              </Reveal>
            ))}
          </div>

          <div className="whu-center">
            <GlassCrystal />
          </div>

          <div className="whu-cards whu-pl whu-pl--right">
            {FEATURES.filter((feature) => feature.position === "whu-card--right").map((feature) => (
              <Reveal key={feature.id} delay={0.12}>
                <FeatureCard feature={feature} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
