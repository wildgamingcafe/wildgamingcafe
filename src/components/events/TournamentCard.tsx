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
  let buttonText = "[ REGISTER NOW ]";
  let isDisabled = false;
  
  // Use manual status for visual badge
  const manualStatus = tournament.status?.toLowerCase() || "";
  
  // Automated Button Logic
  const now = new Date();
  const startDate = tournament.registration_start_date ? new Date(tournament.registration_start_date) : null;
  const endDate = tournament.registration_end_date ? new Date(tournament.registration_end_date) : null;
  const isPreRegEnabled = tournament.enable_pre_register;
  
  // Is the event in the past?
  if (manualStatus === "completed" || manualStatus === "past" || (tournament.date && now > new Date(new Date(tournament.date).getTime() + 86400000))) {
    buttonText = "[ TOURNAMENT COMPLETED ]";
    isDisabled = true;
  }
  // Has registration window closed?
  else if (endDate && now > endDate) {
    buttonText = "[ REGISTRATIONS CLOSED ]";
    isDisabled = true;
  }
  // Is registration currently open?
  else if (startDate && endDate && now >= startDate && now <= endDate) {
    buttonText = "[ REGISTRATIONS OPEN ]";
  }
  // Registration hasn't started yet
  else if (startDate && now < startDate) {
    if (isPreRegEnabled) {
      buttonText = "[ PRE-REGISTER ]";
    } else {
      buttonText = `[ OPENS ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ]`;
      isDisabled = true; // Wait for it to open
    }
  }
  // Fallback for missing dates but open status
  else if (manualStatus === "registration open" || manualStatus === "ongoing" || manualStatus === "live") {
    buttonText = "[ REGISTRATIONS OPEN ]";
  } else if (manualStatus === "upcoming" || manualStatus === "published") {
    buttonText = isPreRegEnabled ? "[ PRE-REGISTER ]" : "[ REGISTRATIONS CLOSED ]";
    if (!isPreRegEnabled) isDisabled = true;
  }

  return (
    <div className="bg-[#111111] border border-[#262626] flex flex-col hover:border-white/20 transition-colors duration-300">
      <div className="relative aspect-video w-full border-b border-[#262626] bg-black">
        <Image
          src={tournament.image_url || "/images/PC gaming.webp"}
          alt={tournament.title || tournament.name}
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
              {tournament.reschedule_message && (
                <span className="block text-xs text-red-500 mt-1">{tournament.reschedule_message}</span>
              )}
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

        {isDisabled ? (
          <div className="bg-[#262626] text-text-secondary w-full py-3 uppercase text-sm font-bold text-center block cursor-not-allowed rounded">
            {buttonText}
          </div>
        ) : (
          <Link
            href={`/events/${tournament.id}/register`}
            className="brand-button-secondary w-full py-3 uppercase text-sm font-bold text-center block"
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  );
}
