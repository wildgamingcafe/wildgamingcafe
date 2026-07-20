"use client";

import { useState } from "react";
import { faqItems as defaultFaqItems } from "@/data/loungeData";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQProps {
  items?: { question: string; answer: string }[];
}

export default function FAQ({ items = defaultFaqItems }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-[#262626]">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14 max-w-3xl">
        <h2 className="heading-style text-3xl md:text-4xl text-center uppercase mb-16">
          <span className="text-accent">FAQ</span>
        </h2>

        <div className="space-y-0">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border-b border-[#262626]">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-6 text-left group"
                >
                  <span className="text-sm font-semibold uppercase tracking-wide pr-4 group-hover:text-accent transition-colors duration-200">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0 w-8 h-8 border border-[#262626] flex items-center justify-center group-hover:border-accent/40 transition-colors duration-200">
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-accent" />
                    ) : (
                      <Plus className="w-4 h-4 text-text-secondary" />
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="text-text-secondary text-sm leading-relaxed pb-6 pr-12">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
