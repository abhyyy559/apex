"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { NAV_LINKS } from "@/lib/constants";

export function FloatingGlassNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between gap-8 px-8 py-3.5 rounded-full"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.25)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.25)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        }}
        aria-label="Main navigation"
      >
        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight gradient-text">
            ApeX
          </span>
        </motion.a>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <UnderlineLink
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-xs uppercase tracking-[0.2em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent ${
                    active
                      ? "text-[#CC2200]"
                      : "text-text-muted hover:text-text-primary"
                  }`}
                >
                  {link.label}
                </UnderlineLink>
              </li>
            );
          })}
        </ul>

        <Button href="/contact" size="sm" className="hidden md:inline-flex btn-navbar-cta px-5">
          Hire Us
        </Button>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden flex flex-col gap-1.5 p-2 min-w-[36px] min-h-[36px] items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span
            className={`block w-5 h-px bg-text-primary transition-transform ${mobileOpen ? "rotate-45 translate-y-1.5" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-text-primary transition-opacity ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-px bg-text-primary transition-transform ${mobileOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
          />
        </button>
      </motion.nav>

      {mobileOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[99] w-[calc(100%-2rem)] max-w-md rounded-2xl p-6"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          }}
        >
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-3 text-sm uppercase tracking-[0.2em] min-h-[44px] flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
                    isActive(link.href) ? "text-[#CC2200]" : "text-text-primary"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Button
                href="/contact"
                size="sm"
                onClick={() => setMobileOpen(false)}
                className="w-full btn-navbar-cta"
              >
                Hire Us
              </Button>
            </li>
          </ul>
        </motion.div>
      )}
    </>
  );
}
