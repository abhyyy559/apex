import { AboutPageClient } from "./client";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "About — ApeX",
  description: "We craft premium digital experiences — cinematic websites, AI visuals, and brand systems that elevate businesses.",
  path: "about",
});

export default function AboutPage() {
  return <AboutPageClient />;
}
