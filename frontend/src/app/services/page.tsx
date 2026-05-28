import { ServicesPageClient } from "./client";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Services — ApeX",
  description: "Premium web development, AI product posters, branding, and UI/UX design services. Elevate your digital presence.",
  path: "services",
});

export default function ServicesPage() {
  return <ServicesPageClient />;
}
