"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RevealGroup, RevealItem } from "@/components/ui/RevealGroup";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { useTestimonials } from "@/hooks/useContent";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Testimonials({ className }: { className?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const { data: testimonialsData, loading } = useTestimonials();
  const trackRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (reducedMotion) return;
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>(".testimonial-card");
    if (!cards.length) return;

    const totalWidth = track.scrollWidth;
    const duration = totalWidth / 60;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      gsap.to(track, {
        x: -totalWidth + track.parentElement!.offsetWidth,
        duration,
        ease: "none",
        repeat: -1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 20%",
          scrub: 1.5,
        },
      });
    });

    return () => mm.revert();
  }, [reducedMotion]);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".testimonial-card");
    if (!cards?.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );
  }, []);

  if (loading) {
    return (
      <section id="testimonials" className={`relative section-padding z-10 ${className || ''}`} aria-labelledby="testimonials-heading">
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-8 bg-gray-800 rounded w-1/4 mx-auto" />
          <div className="h-12 bg-gray-800 rounded w-1/2 mx-auto" />
          <div className="flex gap-6 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-800 rounded-xl min-w-[300px]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!testimonialsData) return null;

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className={`relative section-padding z-10 ${className || ''}`}
      aria-labelledby="testimonials-heading"
    >
      <SectionHeading
        label={testimonialsData.section.label}
        title={testimonialsData.section.title}
        subtitle={testimonialsData.section.subtitle}
        align="center"
      />

      <RevealGroup>
        <div className="relative overflow-hidden -mx-4 md:-mx-8">
          <div
            ref={trackRef}
            className="flex gap-6 px-4 md:px-8 will-change-transform"
          >
            {testimonialsData.testimonials.map((testimonial, i) => (
              <RevealItem key={i} index={i} className="flex-shrink-0 w-[85vw] md:w-[400px] testimonial-card">
                <Card className="relative p-6 md:p-8 rounded-2xl h-full border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                  <div className="absolute top-6 left-6 text-[#CC2200] opacity-20" aria-hidden>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <p className="text-sm md:text-base text-text-muted leading-relaxed mb-6 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[rgba(204,34,0,0.15)] flex items-center justify-center">
                        <span className="font-[family-name:var(--font-syne)] text-sm font-bold text-[#CC2200]">
                          {testimonial.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-syne)] text-sm font-bold text-white">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-text-muted">
                          {testimonial.role}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </RevealItem>
            ))}
          </div>
        </div>
      </RevealGroup>
    </section>
  );
}
