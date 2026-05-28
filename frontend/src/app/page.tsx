import { PageShell } from "@/components/layout/PageShell";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "ApeX — Immersive Digital Experiences",
  description: "Premium cinematic web design, AI product posters & 3D brand experiences. Elevate your digital presence with ApeX Studio.",
  path: "",
  keywords: [
    "cinematic web design",
    "AI product posters",
    "3D web experiences",
    "premium website development",
    "Hyderabad digital agency",
    "brand identity design",
  ],
});

export default function Home() {
  return <PageShell />;
}
