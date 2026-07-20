"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Monitor, Gamepad2, Wifi, Trophy } from "lucide-react";

export default function LoungeHero({ data }: { data?: any }) {
  // Use CMS data or fallback to defaults
  const videoUrl = data?.video_url || "/videos/HomePage.webm";
  const headline = data?.headline || "YOUR NEXT WIN STARTS HERE";
  const subheadline = data?.subheadline || "High-performance PCs, PS5 Arena, 1 Gbps Internet and a community built for gamers.";
  
  const stats = [
    { icon: Monitor, value: "20", label: "Gaming PCs" },
    { icon: Gamepad2, value: "PS5", label: "Arena" },
    { icon: Wifi, value: "1 Gbps", label: "Internet" },
    { icon: Trophy, value: "Tournament", label: "Ready" },
  ];

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 w-full h-full object-cover"
        key={videoUrl} // Force video element to remount if URL changes
      >
        <source src={videoUrl} type="video/webm" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-[#050505]/65" />

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 text-center flex flex-col items-center">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl uppercase mb-8 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          dangerouslySetInnerHTML={{ __html: headline.replace("STARTS HERE", "<span class='text-accent'>STARTS HERE</span>") }}
        />

        <motion.p
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {subheadline}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="#pricing"
            className="flex items-center justify-center px-10 py-4 font-sans text-sm font-semibold uppercase tracking-wide bg-[#F4B000] text-black rounded-none transition duration-200 ease hover:bg-[#E0A300]"
          >
            VIEW PRICING
          </Link>
          <Link
            href="#games"
            className="flex items-center justify-center px-10 py-4 font-sans text-sm font-semibold uppercase tracking-wide bg-transparent border border-white text-white rounded-none transition duration-200 ease hover:bg-white hover:text-black"
          >
            EXPLORE GAMES
          </Link>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 md:gap-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon className="w-6 h-6 text-accent" />
              <div className="text-left">
                <p className="text-sm font-semibold uppercase text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-secondary uppercase tracking-wide">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg className="w-6 h-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </section>
  );
}
