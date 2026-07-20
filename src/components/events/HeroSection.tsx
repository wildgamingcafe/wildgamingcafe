"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection({ mediaUrl, alignment = "center" }: { mediaUrl?: string, alignment?: string }) {
  const url = mediaUrl || "/videos/hero-video.webm";
  const isVideo = url.match(/\.(mp4|webm|ogg)$/i);

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {isVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 z-0 w-full h-full object-cover"
          style={{ objectPosition: alignment }}
        >
          <source src={url} />
        </video>
      ) : (
        <div
          className="absolute inset-0 z-0 bg-cover"
          style={{ backgroundImage: `url(${url})`, backgroundPosition: alignment }}
        />
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-[#050505]/65" />

      {/* Content */}
      <div className="container relative z-20 mx-auto px-4 text-center flex flex-col items-center">
        <motion.h1 
          className="text-5xl md:text-7xl lg:text-8xl uppercase mb-8 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          PLAY. COMPETE. <br/>
          <span className="text-accent">LEVEL UP.</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-10 leading-relaxed font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          From casual LAN nights to championship tournaments,<br className="hidden md:block" />
          experience competitive gaming like never before.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="#tournaments"
            className="flex items-center justify-center px-10 py-4 font-sans text-sm font-semibold uppercase tracking-wide bg-[#F4B000] text-black rounded-none transition duration-200 ease hover:bg-[#E0A300]"
          >
            EXPLORE EVENTS
          </Link>
          <Link
            href="#leaderboard"
            className="flex items-center justify-center px-10 py-4 font-sans text-sm font-semibold uppercase tracking-wide bg-transparent border border-white text-white rounded-none transition duration-200 ease hover:bg-white hover:text-black"
          >
            VIEW LEADERBOARD
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
