"use client";

import { motion } from "framer-motion";
import { Wifi, MonitorPlay, Cpu, ScreenShare, Keyboard, Armchair } from "lucide-react";

export default function HardwareSpecs({ data }: { data?: any }) {
  const specs = [
    { icon: Wifi, label: data?.internet || "1 Gbps", sublabel: "Fiber Internet" },
    { icon: MonitorPlay, label: data?.gpu || "RTX", sublabel: "Graphics" },
    { icon: Cpu, label: data?.cpu || "Intel", sublabel: "Core i7" },
    { icon: ScreenShare, label: data?.monitors || "144Hz / 240Hz", sublabel: "Monitors" },
    { icon: Keyboard, label: data?.keyboards || "Mechanical", sublabel: "Keyboards" },
    { icon: Armchair, label: data?.chairs || "Premium", sublabel: "Gaming Chairs" },
  ];

  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-b border-[#262626]">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <h2 className="heading-style text-3xl md:text-4xl text-center uppercase mb-16">
          Built for <span className="text-accent">Performance</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {specs.map((spec, i) => (
            <motion.div
              key={spec.label}
              className="flex flex-col items-center text-center p-6 border border-[#262626] bg-[#111111] hover:border-accent/40 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <spec.icon className="w-8 h-8 text-accent mb-4" />
              <p className="heading-style text-sm uppercase">{spec.label}</p>
              <p className="text-text-secondary text-xs uppercase tracking-wider mt-1">{spec.sublabel}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
