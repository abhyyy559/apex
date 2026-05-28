"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const VALUES = [
  {
    title: "Craft Over Compromise",
    description: "Every pixel, every animation, every line of code is intentional. We don't ship mediocre work.",
  },
  {
    title: "Partnership, Not Vendorship",
    description: "We embed ourselves in your vision. Your success is our success — no assembly-line mentality.",
  },
  {
    title: "Future-First Thinking",
    description: "We build for tomorrow's web today. Performance, accessibility, and scalability aren't afterthoughts.",
  },
];

export function AboutMission() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const elements = sectionRef.current?.querySelectorAll(".mission-anim");
    if (!elements?.length) return;
    gsap.fromTo(
      elements,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-padding border-t border-[rgba(255,255,255,0.05)]"
      aria-labelledby="mission-heading"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="mission-anim text-xs uppercase tracking-[0.35em] text-text-muted mb-4">
              Our Philosophy
            </p>
            <h2
              id="mission-heading"
              className="mission-anim font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-white mb-6"
            >
              Digital experiences that{" "}
              <span className="text-[#CC2200]">command attention</span>.
            </h2>
            <p className="mission-anim text-base text-text-muted leading-relaxed mb-6">
              ApeX was founded on a simple belief: your digital presence should be as ambitious as your vision.
              We combine cinematic design with engineering precision to create websites and visuals that don&apos;t
              just look stunning — they perform, convert, and leave lasting impressions.
            </p>
            <p className="mission-anim text-base text-text-muted leading-relaxed">
              From early-stage startups to established brands, we partner with founders and leaders who
              refuse to settle for templates and demand something truly exceptional.
            </p>
          </div>

          <div className="space-y-6">
            {VALUES.map((value, index) => (
              <div
                key={value.title}
                className="mission-anim rounded-2xl p-6 md:p-8 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(204,34,0,0.15)] transition-all duration-500"
              >
                <p className="text-xs font-[family-name:var(--font-syne)] text-[#CC2200] mb-2">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-bold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
