"use client";

import { Monitor, Gamepad2, Wifi, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Monitor,
    title: "High Performance PCs",
    description: "RTX-powered gaming PCs built for performance. Play any title at max settings.",
  },
  {
    icon: Gamepad2,
    title: "PS5 Gaming Arena",
    description: "Enjoy the best of console gaming with friends on the big screen.",
  },
  {
    icon: Wifi,
    title: "1 Gbps Fiber Internet",
    description: "Ultra-low latency fiber connection. No lag, no excuses.",
  },
  {
    icon: Trophy,
    title: "Tournament Ready",
    description: "Perfect setup for LAN events, scrims and competitions.",
  },
];

export default function WhyWild() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <h2 className="heading-style text-3xl md:text-4xl text-center uppercase mb-16">
          Why Gamers Choose <span className="text-accent">Wild</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="border border-[#262626] bg-[#0A0A0A] p-8 text-center group hover:border-accent/40 transition-colors duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="w-14 h-14 mx-auto mb-6 border border-[#262626] flex items-center justify-center group-hover:border-accent/40 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="heading-style text-base uppercase mb-3">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
