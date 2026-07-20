"use client";

import Image from "next/image";
import Link from "next/link";

const formatTime = (time: string) => {
  if (!time || !time.includes(':')) return time;
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export default function TournamentCard({ tournament }: { tournament: any }) {
  return (
    <div className="bg-[#111111] border border-[#262626] flex flex-col hover:border-white/20 transition-colors duration-300">
      <div className="relative h-48 w-full border-b border-[#262626]">
        <Image
          src={tournament.thumbnail_image_url || tournament.banner_image_url || "/images/placeholder.jpg"}
          alt={tournament.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-black/80 px-2 py-1 text-xs font-semibold uppercase text-white border border-border">
          {tournament.game}
        </div>
        
        {/* Status Badge */}
        {tournament.status && (
          <div className={`absolute top-3 right-3 px-2 py-1 text-xs font-semibold uppercase border ${
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
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl uppercase mb-4 text-text-primary">
          {tournament.title}
        </h3>
        
        <div className="space-y-2 mb-6 flex-grow font-sans">
          <div className="flex items-center justify-between text-sm border-b border-border pb-2">
            <span className="text-text-secondary">Date</span>
            <span className="text-text-primary font-medium">
              {new Date(tournament.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm border-b border-border pb-2">
            <span className="text-text-secondary">Time</span>
            <span className="text-text-primary font-medium">{formatTime(tournament.time)}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-b border-border pb-2">
            <span className="text-text-secondary">Format</span>
            <span className="text-text-primary font-medium">{tournament.format}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-b border-border pb-2">
            <span className="text-text-secondary">Prize Pool</span>
            <span className="text-accent font-semibold">{tournament.prize_pool || "TBA"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Entry Fee</span>
            <span className="text-text-primary font-medium">{tournament.entry_fee || "Free"}</span>
          </div>
        </div>

        <Link
          href={tournament.registration_link || `https://wa.me/919381923198?text=Hi! I want to register for ${tournament.title}`}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-button-secondary w-full py-3 uppercase text-sm text-center block"
        >
          [ REGISTER NOW ]
        </Link>
      </div>
    </div>
  );
}
