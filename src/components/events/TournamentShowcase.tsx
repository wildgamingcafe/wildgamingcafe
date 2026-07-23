"use client";

import TournamentCard from "./TournamentCard";

export default function TournamentShowcase({
  ongoing,
  upcoming,
  recent
}: {
  ongoing: any[];
  upcoming: any[];
  recent: any[];
}) {
  return (
    <div className="w-full bg-[#050505] flex flex-col gap-12 py-16 md:py-24">
      
      {/* Ongoing / Live Events */}
      {ongoing && ongoing.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-5xl uppercase text-white font-black border-l-4 border-red-500 pl-4">
              Ongoing <span className="text-red-500">Live</span>
            </h2>
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {ongoing.map((tournament) => (
              <div key={tournament.id} className="ring-2 ring-red-500/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                 <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcoming && upcoming.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl uppercase text-white font-black mb-8 border-l-4 border-accent pl-4">
            Next <span className="text-accent">Up</span>
          </h2>
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x hide-scrollbar">
            {upcoming.map((tournament) => (
              <div key={tournament.id} className="min-w-[300px] md:min-w-[400px] snap-start">
                 <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Champions */}
      {recent && recent.length > 0 && (
        <section className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl uppercase text-text-secondary font-black mb-8 border-l-4 border-[#333] pl-4">
            Recent <span className="text-white">Champions</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recent.slice(0, 4).map((tournament) => (
              <div key={tournament.id} className="grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100">
                 <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        </section>
      )}
      
    </div>
  );
}
