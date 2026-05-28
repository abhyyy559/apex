"use client";

import { GsapMarquee } from "@/components/ui/GsapMarquee";
import { useMarquee } from "@/hooks/useContent";

export function Marquee({ className }: { className?: string }) {
  const { data: marqueeData, loading } = useMarquee();

  if (loading) {
    return (
      <section
        className={`relative overflow-hidden border-y border-[rgba(204,34,0,0.08)] z-10 ${className || ''}`}
        aria-label="Capabilities"
      >
        <div className="animate-pulse space-x-8 flex whitespace-nowrap py-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-10 bg-gray-800 rounded w-32" />
          ))}
        </div>
      </section>
    );
  }

  if (!marqueeData) return null;

  return (
    <section
      className={`relative overflow-hidden border-y border-[rgba(204,34,0,0.08)] z-10 py-6 ${className || ''}`}
      aria-label="Capabilities"
    >
      <GsapMarquee items={marqueeData.items} speed={0.4} />
    </section>
  );
}
