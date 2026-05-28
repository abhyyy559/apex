"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePortfolio } from "@/hooks/useContent";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxTilt } from "@/components/ui/ParallaxTilt";
import { Button } from "@/components/ui/Button";

gsap.registerPlugin(ScrollTrigger);

export function PortfolioShowcase() {
  const { data, loading } = usePortfolio();
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const cards = sectionRef.current?.querySelectorAll(".portfolio-card");
    if (!cards?.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 80, rotateX: -5 },
      {
        opacity: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.15, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
      }
    );
  }, []);

  if (loading) {
    return (
      <section className="relative section-padding" aria-labelledby="showcase-heading">
        <div className="animate-pulse space-y-4 max-w-6xl mx-auto">
          <div className="h-8 bg-gray-800 rounded w-1/4" />
          <div className="h-12 bg-gray-800 rounded w-1/2" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const featured = data.projects.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      id="work"
      aria-labelledby="showcase-heading"
      className="relative section-padding"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          label={data.section.label}
          title={data.section.title}
          subtitle={data.section.subtitle}
          align="center"
          className="max-w-3xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 md:mt-16">
          {featured.map((project) => (
            <div key={project.slug} className="portfolio-card">
              <ParallaxTilt maxTilt={5} scale={1.02}>
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group block relative rounded-2xl overflow-hidden min-h-[280px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(204,34,0,0.25)] transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[rgba(204,34,0,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full min-h-[280px]">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#CC2200] mb-2">
                      {project.category}
                    </p>
                    <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-bold text-white group-hover:text-[#CC2200] transition-colors duration-300">
                      {project.title}
                    </h3>
                  </div>
                </Link>
              </ParallaxTilt>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Button href="/portfolio" variant="glass">
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
