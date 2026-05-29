"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/Button";
import { MagneticButton } from "@/components/ui/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

type PageCtaProps = {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
};

export function PageCta({ title, description, ctaText, ctaHref }: PageCtaProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const elements = sectionRef.current?.querySelectorAll(".cta-anim");
    if (!elements?.length) return;
    gsap.fromTo(
      elements,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-padding border-t border-[rgba(255,255,255,0.05)]"
    >
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="cta-anim font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
          {title}
        </h2>
        <p className="cta-anim text-base md:text-lg text-text-muted leading-relaxed mb-8 max-w-xl mx-auto">
          {description}
        </p>
        <div className="cta-anim">
          <MagneticButton>
            <Button href={ctaHref} size="lg">
              {ctaText}
            </Button>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
