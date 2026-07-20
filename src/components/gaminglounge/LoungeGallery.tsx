"use client";

import { useRef } from "react";
import Image from "next/image";
import { galleryImages } from "@/data/loungeData";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function LoungeGallery({ data }: { data?: string[] }) {
  const images = data && data.length > 0 ? data : galleryImages;
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-[#0A0A0A] border-t border-b border-[#262626]">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="flex items-end justify-between mb-12">
          <h2 className="heading-style text-3xl md:text-4xl uppercase">
            Lounge <span className="text-accent">Gallery</span>
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 border border-[#262626] flex items-center justify-center text-text-secondary hover:bg-accent hover:text-black hover:border-accent transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 border border-[#262626] flex items-center justify-center text-text-secondary hover:bg-accent hover:text-black hover:border-accent transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Strip */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 sm:px-6 md:px-10 lg:px-14 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[280px] md:w-[320px] aspect-[4/3] relative overflow-hidden border border-[#262626] group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${src})` }}
            />
          </div>
        ))}

        {/* Logo Card */}
        <div className="flex-shrink-0 w-[280px] md:w-[320px] aspect-[4/3] border border-[#262626] bg-[#111111] flex items-center justify-center">
          <Image src="/logo.png" alt="Wild Gaming Cafe" width={200} height={200} className="h-20 w-auto opacity-60" />
        </div>
      </div>
    </section>
  );
}
