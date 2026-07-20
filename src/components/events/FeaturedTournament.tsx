"use client";

import { Clock, Users, Calendar, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const formatTime = (time: string) => {
  if (!time || !time.includes(':')) return time;
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export default function FeaturedTournament({ tournament }: { tournament: any }) {
  if (!tournament) return null;

  return (
    <section className="py-16 bg-background" id="featured">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-surface-100 border border-border flex flex-col lg:flex-row"
        >
          {/* Image Side */}
          <div className="relative w-full lg:w-1/2 h-64 lg:h-auto min-h-[400px]">
            <Image
              src={tournament.banner_image_url || tournament.thumbnail_image_url || "/images/placeholder.jpg"}
              alt={tournament.title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-accent text-black px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Featured Event
            </div>
            {tournament.status && (
              <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider border ${
                tournament.status === "Registration Open" 
                  ? "bg-black/80 text-white border-white/50" 
                  : tournament.status === "Filling Fast" || tournament.status === "Almost Full"
                  ? "bg-accent text-black border-accent"
                  : "bg-surface-100 text-text-secondary border-border"
              }`}>
                {tournament.status}
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className="relative w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <span className="text-accent font-semibold uppercase text-sm mb-2 block">{tournament.game}</span>
            <h2 className="text-3xl lg:text-5xl uppercase mb-6 text-text-primary">
              {tournament.title}
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8 font-sans">
              <div className="flex flex-col gap-1 border-l-2 border-accent pl-4">
                <span className="text-text-secondary text-sm uppercase font-semibold">Prize Pool</span>
                <span className="text-xl font-semibold text-text-primary">{tournament.prize_pool || "TBA"}</span>
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-accent pl-4">
                <span className="text-text-secondary text-sm uppercase font-semibold">Date & Time</span>
                <span className="text-xl font-semibold text-text-primary">
                  {new Date(tournament.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {tournament.time ? `• ${formatTime(tournament.time)}` : ''}
                </span>
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-accent pl-4">
                <span className="text-text-secondary text-sm uppercase font-semibold">Format</span>
                <span className="text-xl font-semibold text-text-primary">{tournament.format}</span>
              </div>
              <div className="flex flex-col gap-1 border-l-2 border-accent pl-4">
                <span className="text-text-secondary text-sm uppercase font-semibold">Entry Fee</span>
                <span className="text-xl font-semibold text-text-primary mb-2">
                  {tournament.entry_fee || "Free"}
                </span>
              </div>
            </div>

            <div className="mt-auto">
              {tournament.status === "Completed" ? (
                <Link
                  href="#leaderboard"
                  className="brand-button-outline w-full py-4 uppercase text-sm text-center block"
                >
                  View Results
                </Link>
              ) : (
                <Link
                  href={tournament.registration_link || `https://wa.me/919381923198?text=Hi! I want to register for ${tournament.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brand-button-secondary w-full py-4 uppercase text-sm text-center block"
                >
                  Register Now
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
