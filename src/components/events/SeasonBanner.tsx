"use client";

import Link from "next/link";
import ParticleBackground from "@/components/layout/ParticleBackground";

export default function SeasonBanner() {
  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <ParticleBackground id="particles-season" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-[#111111] border border-[#262626] p-8 md:p-16 text-center flex flex-col items-center max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
          {/* Subtle atmospheric glow inside the solid banner */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-50" />
          
          <span className="text-text-secondary font-semibold uppercase mb-4 block tracking-widest text-sm">Current Season</span>
          <h2 className="text-4xl md:text-6xl uppercase text-text-primary mb-6">
            Season 4: <span className="text-accent">Awakening</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6 mb-10 font-sans">
            <div className="bg-[#050505] px-8 py-4 border border-[#262626]">
              <span className="block text-text-secondary text-xs font-semibold uppercase mb-1">Duration</span>
              <span className="text-text-primary font-semibold">Aug 1 - Oct 31, 2026</span>
            </div>
            <div className="bg-[#050505] px-8 py-4 border border-[#262626]">
              <span className="block text-text-secondary text-xs font-semibold uppercase mb-1">Total Prize Pool</span>
              <span className="text-accent font-semibold">₹5,00,000+</span>
            </div>
          </div>

          <Link
            href="/events/season"
            className="brand-button-secondary px-10 py-4 uppercase text-sm"
          >
            Learn More About Season 4
          </Link>
        </div>
      </div>
    </section>
  );
}
