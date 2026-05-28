import { PortfolioPageClient } from "./client";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Portfolio — ApeX",
  description: "Explore our latest projects in cinematic web development, AI visuals, and brand identity design.",
  path: "portfolio",
});

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
