"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_METHODS = [
  {
    title: "Email Us",
    value: "hello@apexstudio.com",
    description: "We respond within 24 hours.",
    icon: (
      <path d="M22 6L12 13 2 6v10a2 2 0 002 2h16a2 2 0 002-2V6zM2 6l10 7 10-7" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Call / WhatsApp",
    value: "+91 98765 43210",
    description: "Mon–Fri, 9 AM – 7 PM IST.",
    icon: (
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
  {
    title: "Social",
    value: "@apexstudio",
    description: "DM us on Instagram or LinkedIn.",
    icon: (
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    ),
  },
];

export function ContactInfo() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const elements = sectionRef.current?.querySelectorAll(".contact-info-anim");
    if (!elements?.length) return;
    gsap.fromTo(
      elements,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative section-padding"
      aria-labelledby="contact-info-heading"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionHeading
          label="Get in Touch"
          title="Let's Build Something Great"
          subtitle="Whether you have a clear project in mind or just exploring ideas — we'd love to hear from you."
          align="center"
          className="max-w-3xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 md:mt-16">
          {CONTACT_METHODS.map((method) => (
            <div
              key={method.title}
              className="contact-info-anim rounded-2xl p-6 md:p-8 border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] text-center hover:border-[rgba(204,34,0,0.2)] transition-all duration-500 group"
            >
              <div className="w-12 h-12 rounded-full bg-[rgba(204,34,0,0.08)] border border-[rgba(204,34,0,0.15)] flex items-center justify-center mx-auto mb-5 text-[#CC2200] group-hover:bg-[rgba(204,34,0,0.15)] transition-colors duration-300">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
                  {method.icon}
                </svg>
              </div>
              <h3 className="font-[family-name:var(--font-syne)] text-sm font-bold text-white uppercase tracking-[0.1em] mb-2">
                {method.title}
              </h3>
              <p className="text-base text-white font-medium mb-1">{method.value}</p>
              <p className="text-xs text-text-muted">{method.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
