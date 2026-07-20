"use client";

import { useState } from "react";
import TournamentCard from "./TournamentCard";

const CATEGORIES = ["All Games", "Valorant", "CS2", "FC25", "Mobile"];

export default function UpcomingTournaments({ tournaments }: { tournaments: any[] }) {
  const [activeFilter, setActiveFilter] = useState("All Games");

  const filteredTournaments = activeFilter === "All Games" 
    ? tournaments 
    : tournaments.filter(t => t.game === activeFilter);

  return (
    <section className="py-16 bg-background" id="tournaments">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl uppercase text-text-primary mb-2">
              Upcoming <span className="text-accent">Tournaments</span>
            </h2>
            <p className="text-text-secondary text-lg">Secure your spot in our next major events.</p>
          </div>
          
          {/* Filter Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto snap-x">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors duration-200 snap-start border ${
                  activeFilter === category 
                    ? "bg-accent text-black border-accent" 
                    : "bg-surface-100 text-text-secondary border-border hover:border-white/30 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-border bg-surface-100">
            <h3 className="text-xl font-semibold uppercase text-text-secondary">No Upcoming Events Found</h3>
            <p className="text-text-secondary mt-2">Check back later or try a different game category.</p>
          </div>
        )}
      </div>
    </section>
  );
}
