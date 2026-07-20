"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function CommunityGallery() {
  const [moments, setMoments] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMoments = async () => {
      try {
        const res = await fetch("/api/db?collection=communityMoments");
        if (res.ok) {
          const data = await res.json();
          setMoments(data.filter((i: any) => i.status !== "Trashed"));
        }
      } catch (error) {
        console.error("Failed to fetch community moments", error);
      }
    };
    fetchMoments();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const featured = moments.filter(m => m.featured);
  const displayMoments = featured.length > 0 ? featured.slice(0, 6) : moments.slice(0, 6);
  return (
    <section className="py-16 bg-surface-100 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl uppercase text-text-primary mb-2">
              Community Moments
            </h2>
            <p className="text-text-secondary text-lg">Action shots from our recent tournaments.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 brand-button-secondary px-8 py-3 uppercase text-sm"
          >
            View Gallery
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {displayMoments.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="relative aspect-square md:aspect-video overflow-hidden border border-[#262626]"
            >
              <Image
                src={item.url}
                alt={`Community moment ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-100 border border-border rounded-lg p-6 max-w-5xl w-full max-h-[85vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-surface-100 pt-2 pb-4 z-10 border-b border-border">
              <h3 className="text-2xl font-bold uppercase text-white">Community Gallery</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {moments.map((item: any, idx: number) => (
                <div key={item.id || idx} className="relative aspect-square overflow-hidden border border-[#262626] rounded-md">
                  <Image
                    src={item.url}
                    alt={`Community moment ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
              {moments.length === 0 && (
                <div className="col-span-full text-center text-text-secondary p-8 font-sans">
                  No community moments uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
