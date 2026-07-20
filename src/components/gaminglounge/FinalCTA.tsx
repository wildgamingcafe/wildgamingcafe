"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Wifi, Monitor, Gamepad2, Users } from "lucide-react";
import ParticleBackground from "@/components/layout/ParticleBackground";

const features = [
  { icon: Wifi, label: "1 Gbps Internet" },
  { icon: Monitor, label: "High-End PCs" },
  { icon: Gamepad2, label: "PS5 Arena" },
  { icon: Users, label: "Competitive Community" },
];

export default function FinalCTA() {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">
      <ParticleBackground id="particles-cta" />
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14 relative z-10 text-center">
        <motion.h2
          className="heading-style text-4xl md:text-5xl lg:text-6xl uppercase mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to <span className="text-accent">Level Up?</span>
        </motion.h2>

        <motion.p
          className="text-text-secondary text-lg md:text-xl mb-10 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Experience Hyderabad's ultimate gaming lounge.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-2">
              <f.icon className="w-5 h-5 text-accent" />
              <span className="text-sm font-semibold uppercase tracking-wide">{f.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/events"
            className="flex items-center justify-center px-10 py-4 font-sans text-sm font-semibold uppercase tracking-wide bg-transparent border border-white text-white rounded-none transition duration-200 ease hover:bg-white hover:text-black"
          >
            VIEW EVENTS
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
