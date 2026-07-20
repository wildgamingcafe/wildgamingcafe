"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface NewsTickerProps {
  active: boolean;
  text: string;
}

export default function NewsTicker({ active, text }: NewsTickerProps) {
  if (!active || !text) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-accent text-black overflow-hidden flex items-center h-10 border-t border-black z-[60]">
      <div className="flex-shrink-0 z-10 bg-accent px-4 h-full flex items-center gap-2 border-r border-black shadow-[4px_0_10px_rgba(244,176,0,1)]">
        <AlertCircle className="w-4 h-4" />
        <span className="font-bold text-xs uppercase tracking-widest whitespace-nowrap">Latest Update</span>
      </div>
      
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        {/* We duplicate the text multiple times to ensure a smooth infinite loop on large screens */}
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20 // Adjust speed here
          }}
        >
          <span className="text-sm font-bold uppercase tracking-wide px-8">{text}</span>
          <span className="text-sm font-bold uppercase tracking-wide px-8">{text}</span>
          <span className="text-sm font-bold uppercase tracking-wide px-8">{text}</span>
          <span className="text-sm font-bold uppercase tracking-wide px-8">{text}</span>
        </motion.div>
      </div>
    </div>
  );
}
