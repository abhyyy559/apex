"use client";

import { HomePageClient } from "@/app/home-client";

/**
 * @deprecated PageShell is no longer the main entry point.
 * Use HomePageClient directly from app/page.tsx.
 * Kept for backward compatibility.
 */
export function PageShell() {
  return <HomePageClient />;
}
