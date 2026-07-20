"use client";

import { motion } from "framer-motion";
import { Mail, Handshake } from "lucide-react";
import Link from "next/link";

export default function PromotionsPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-black flex items-center justify-center p-4 overflow-hidden relative">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <div className="relative group">
          {/* Glowing animated border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/0 via-accent/50 to-accent/0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 blur-sm"></div>
          
          <div className="relative bg-[#0A0A0A] border border-[#262626] rounded-xl p-10 md:p-20 flex flex-col items-center text-center shadow-2xl overflow-hidden">
            
            {/* Subtle animated background grid or pattern */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="mb-8 relative"
            >
              <div className="w-24 h-24 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shadow-[0_0_30px_rgba(244,176,0,0.2)]">
                <Handshake className="w-12 h-12 text-accent" />
              </div>
            </motion.div>

            <h1 className="heading-style text-4xl md:text-6xl lg:text-7xl uppercase text-white mb-6 leading-tight">
              WE ARE OPEN FOR <br />
              <span className="text-accent">COLLABORATIONS</span>
            </h1>

            <p className="text-text-secondary text-lg md:text-xl font-semibold max-w-2xl mx-auto mb-12">
              Whether you're a tournament organizer, content creator, or a gaming brand looking to partner with Hyderabad's premier gaming lounge, we'd love to hear from you.
            </p>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="mailto:wildgamingcafe@gmail.com"
                className="inline-flex items-center gap-4 bg-[#111111] border border-[#333] hover:border-accent transition-colors duration-300 rounded-full px-8 py-4 group/mail"
              >
                <div className="bg-accent/10 p-2 rounded-full group-hover/mail:bg-accent transition-colors duration-300">
                  <Mail className="w-5 h-5 text-accent group-hover/mail:text-black transition-colors duration-300" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Contact Us At</span>
                  <span className="text-white font-sans font-semibold text-sm md:text-base">wildgamingcafe@gmail.com</span>
                </div>
              </Link>
            </motion.div>
            
          </div>
        </div>
      </motion.div>

    </div>
  );
}
