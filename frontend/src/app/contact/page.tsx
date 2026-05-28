import { ContactPageClient } from "./client";
import { generatePageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Contact — ApeX",
  description: "Ready to elevate your digital presence? Get in touch with ApeX for premium web design, AI visuals, and branding.",
  path: "contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
