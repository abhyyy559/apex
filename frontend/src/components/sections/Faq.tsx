"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FAQ_ITEMS } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/SectionHeading";

function PlusIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-5 h-5 flex-shrink-0">
      <span
        className={`absolute top-1/2 left-0 right-0 h-px bg-[#CC2200] transition-transform duration-300 ${
          open ? "rotate-180" : ""
        }`}
        style={{ transform: `translateY(-50%) ${open ? "rotate(180deg)" : ""}` }}
      />
      <span
        className={`absolute top-0 bottom-0 left-1/2 w-px bg-[#CC2200] transition-transform duration-300 ${
          open ? "rotate-90" : ""
        }`}
        style={{ transform: `translateX(-50%) ${open ? "rotate(90deg)" : ""}` }}
      />
    </div>
  );
}

export function Faq() {
  const [mounted, setMounted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative section-padding"
    >
      <div className="relative z-10 max-w-3xl mx-auto">
        <SectionHeading
          label="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about working with ApeX."
          align="center"
          className="max-w-3xl"
        />

        <div className="mt-12 md:mt-16 space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            const showContent = mounted && isOpen;
            return (
              <div
                key={index}
                className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] overflow-hidden transition-colors duration-300 hover:border-[rgba(204,34,0,0.15)]"
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CC2200]"
                >
                  <span className="font-[family-name:var(--font-syne)] text-sm md:text-base font-semibold text-white pr-4">
                    {item.question}
                  </span>
                  <PlusIcon open={isOpen} />
                </button>
                {showContent && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5">
                      <p className="text-sm md:text-base text-text-muted leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
