"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function HallOfFamePreview() {
  const [allChampions, setAllChampions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const featuredChampion = allChampions.find((c: any) => c.featured) || (allChampions.length > 0 ? allChampions[0] : null);

  useEffect(() => {
    const fetchChampion = async () => {
      try {
        const res = await fetch("/api/db?collection=hallOfFame");
        if (res.ok) {
          const data = await res.json();
          const active = data.filter((i: any) => i.status !== "Trashed");
          setAllChampions(active);
        }
      } catch (error) {
        console.error("Failed to fetch Hall of Fame", error);
      }
    };
    fetchChampion();
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

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-10">
          <h2 className="text-3xl md:text-5xl uppercase text-text-primary mb-4">
            Hall of <span className="text-accent">Fame</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl font-sans">
            Legends are immortalized here. Behold the champions of previous seasons who conquered the competition.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-surface-100 border border-border flex flex-col md:flex-row items-center">
            <div className="relative w-full md:w-1/2 h-64 md:h-80">
              <Image
                src={featuredChampion?.image_url || "/images/clashatwild/blazerapers.JPG"}
                alt={featuredChampion?.team_name || "Champion"}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            
            <div className="p-8 md:p-12 w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-accent font-semibold uppercase text-sm mb-2 tracking-widest font-sans">{featuredChampion?.tournament_name || "Tournament Champions"}</span>
              <h3 className="text-3xl uppercase mb-4 text-text-primary">{featuredChampion?.team_name || "TBD"}</h3>
              <p className="text-text-secondary font-sans leading-relaxed">
                {featuredChampion?.description || "Stay tuned for our upcoming tournament winners!"}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="brand-button-outline px-8 py-3 uppercase text-sm w-full md:w-auto"
            >
              Show full hall of fame
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-100 border border-border rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-surface-100 pt-2 pb-4 z-10 border-b border-border">
              <h3 className="text-2xl font-bold uppercase text-white">Full Hall of Fame</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              {allChampions.map((champ: any) => (
                <div key={champ.id} className="bg-[#0A0A0A] border border-[#262626] p-5 rounded-md hover:bg-white/5 transition-colors">
                  <div className="text-accent text-xs font-bold uppercase mb-1 tracking-wider">{champ.tournament_name}</div>
                  <h4 className="text-xl font-bold text-white uppercase mb-2">{champ.team_name}</h4>
                  <p className="text-text-secondary text-sm font-sans leading-relaxed">{champ.description}</p>
                </div>
              ))}
              {allChampions.length === 0 && (
                <div className="text-center text-text-secondary p-8 font-sans">
                  No champions recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
