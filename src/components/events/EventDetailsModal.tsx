"use client";

import { X, Trophy, Calendar, Users, Gamepad2, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EventDetailsModal({ 
  event, 
  onClose 
}: { 
  event: any; 
  onClose: () => void;
}) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300); // Matches animation duration
  };

  // Determine button state using exact same logic
  let buttonText = "[ REGISTER NOW ]";
  let isDisabled = false;
  
  const manualStatus = event.status?.toLowerCase() || "";
  const now = new Date();
  const startDate = event.registration_start_date ? new Date(event.registration_start_date) : null;
  const endDate = event.registration_end_date ? new Date(event.registration_end_date) : null;
  const isPreRegEnabled = event.enable_pre_register;
  
  if (manualStatus === "completed" || manualStatus === "past" || (event.date && now > new Date(new Date(event.date).getTime() + 86400000))) {
    buttonText = "[ TOURNAMENT COMPLETED ]";
    isDisabled = true;
  } else if (endDate && now > endDate) {
    buttonText = "[ REGISTRATIONS CLOSED ]";
    isDisabled = true;
  } else if (startDate && endDate && now >= startDate && now <= endDate) {
    buttonText = "[ REGISTRATIONS OPEN ]";
  } else if (startDate && now < startDate) {
    if (isPreRegEnabled) {
      buttonText = "[ PRE-REGISTER ]";
    } else {
      buttonText = `[ OPENS ${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ]`;
      isDisabled = true;
    }
  } else if (manualStatus === "registration open" || manualStatus === "ongoing" || manualStatus === "live") {
    buttonText = "[ REGISTRATIONS OPEN ]";
  } else if (manualStatus === "upcoming" || manualStatus === "published") {
    buttonText = isPreRegEnabled ? "[ PRE-REGISTER ]" : "[ REGISTRATIONS CLOSED ]";
    if (!isPreRegEnabled) isDisabled = true;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-3xl bg-[#111111] border border-[#262626] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:text-accent rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-48 sm:h-64 w-full shrink-0">
          <Image 
            src={event.image_url || event.thumbnail_image_url || "/images/placeholder.jpg"} 
            alt={event.name} 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="bg-accent text-black text-xs font-black uppercase px-2 py-1 rounded-sm mb-2 inline-block">
              {event.game}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white shadow-black drop-shadow-md">
              {event.title || event.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Main Info Column */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Description */}
              <div>
                <h3 className="text-sm font-bold uppercase text-text-secondary tracking-wider mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" /> About the Event
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {event.description || "No description provided for this event."}
                </p>
              </div>

              {/* Tournament Results (If Completed) */}
              {(manualStatus === "completed" || manualStatus === "past") && event.winners_data && (
                <div className="bg-surface-100 border border-accent/20 p-4 rounded-lg">
                  <h3 className="text-sm font-bold uppercase text-accent tracking-wider mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> Tournament Results
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#050505] p-3 border border-[#262626] rounded">
                      <div className="text-xs text-text-secondary font-bold uppercase mb-1">1st Place</div>
                      <div className="text-white font-bold text-lg">{event.winners_data.first || "TBA"}</div>
                    </div>
                    <div className="bg-[#050505] p-3 border border-[#262626] rounded">
                      <div className="text-xs text-text-secondary font-bold uppercase mb-1">2nd Place</div>
                      <div className="text-gray-300 font-bold">{event.winners_data.second || "TBA"}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Stats Column */}
            <div className="space-y-4">
              <div className="bg-surface-100 p-4 rounded-lg border border-[#262626] space-y-4">
                <div className="flex items-center gap-3 text-text-secondary">
                  <Calendar className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-xs font-bold uppercase">Date & Time</div>
                    <div className="text-white text-sm font-medium">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      {event.time && ` @ ${event.time}`}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-text-secondary">
                  <Users className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-xs font-bold uppercase">Format</div>
                    <div className="text-white text-sm font-medium">{event.format || "Standard"}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-text-secondary">
                  <Gamepad2 className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-xs font-bold uppercase">Entry Fee</div>
                    <div className="text-white text-sm font-medium">{event.entry_fee || "Free"}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-text-secondary border-t border-[#262626] pt-4 mt-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  <div>
                    <div className="text-xs font-bold uppercase text-accent">Prize Pool</div>
                    <div className="text-white text-lg font-black">{event.prize_pool || "TBA"}</div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isDisabled ? (
                  <div className="bg-[#262626] text-text-secondary w-full py-4 uppercase text-sm font-bold text-center block cursor-not-allowed rounded">
                    {buttonText}
                  </div>
                ) : (
                  <Link
                    href={`/events/${event.id}/register`}
                    className="brand-button-secondary w-full py-4 uppercase text-sm font-bold text-center block"
                  >
                    {buttonText}
                  </Link>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
