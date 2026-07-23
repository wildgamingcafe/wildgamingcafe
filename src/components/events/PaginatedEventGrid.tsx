"use client";

import { useState, useEffect, useCallback } from "react";
import TournamentCard from "./TournamentCard";
import EventDetailsModal from "./EventDetailsModal";
import { Search, Loader2 } from "lucide-react";

const GAME_CATEGORIES = ["All Games", "Valorant", "CS2", "FC25", "Mobile"];
const STATUS_CATEGORIES = ["All Status", "Upcoming", "Past", "Ongoing"];

export default function PaginatedEventGrid({ initialEvents, excludeId }: { initialEvents: any[], excludeId?: string }) {
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialEvents.length === 9);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [gameFilter, setGameFilter] = useState("All Games");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const fetchEvents = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "9",
        query: searchQuery,
      });
      if (gameFilter !== "All Games") params.set("game", gameFilter);
      if (statusFilter !== "All Status") params.set("status", statusFilter);
      if (excludeId) params.set("excludeId", excludeId);

      const res = await fetch(`/api/events/paginated?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (isNewSearch) {
          setEvents(data.events);
        } else {
          setEvents((prev) => [...prev, ...data.events]);
        }
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [searchQuery, gameFilter, statusFilter, excludeId]);

  useEffect(() => {
    if (isInitialLoad) {
      if (searchQuery === "" && gameFilter === "All Games" && statusFilter === "All Status") {
        setIsInitialLoad(false);
        return;
      }
    }
    
    const timer = setTimeout(() => {
      setPage(1);
      fetchEvents(1, true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, gameFilter, statusFilter, fetchEvents]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEvents(nextPage, false);
    }
  };

  return (
    <section className="py-24 bg-background border-t border-[#262626]" id="archive">
      <div className="container mx-auto px-4">
        
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl uppercase text-text-primary mb-2">
              Event <span className="text-accent">Archive & Search</span>
            </h2>
            <p className="text-text-secondary text-lg">Browse and filter our entire history of competitive LANs.</p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-surface-100 border border-[#262626] rounded-lg">
          
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search by event name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#0A0A0A] border border-[#262626] rounded text-white focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          
          <select 
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="px-6 py-3 bg-[#0A0A0A] border border-[#262626] rounded text-white focus:outline-none focus:border-accent transition-colors font-bold uppercase text-sm"
          >
            {GAME_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-[#0A0A0A] border border-[#262626] rounded text-white focus:outline-none focus:border-accent transition-colors font-bold uppercase text-sm"
          >
            {STATUS_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Event Table */}
        <div className={`transition-all duration-500`}>
          {events.length > 0 ? (
            <div className="w-full overflow-x-auto rounded-lg border border-[#262626] bg-[#0A0A0A]">
              <table className="w-full text-left text-sm text-text-secondary whitespace-nowrap">
                <thead className="bg-[#111] text-xs uppercase font-bold text-white border-b border-[#262626]">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Game</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Prize Pool</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  {events.map((tournament) => {
                    const statusLower = tournament.status?.toLowerCase() || "";
                    let btnText = "Register";
                    let isClosed = false;
                    
                    if (statusLower === "completed" || statusLower === "past") {
                      btnText = "Closed";
                      isClosed = true;
                    } else if (statusLower === "upcoming" || statusLower === "published") {
                      btnText = "Pre-Register";
                    } else if (statusLower === "registration open" || statusLower === "ongoing" || statusLower === "live") {
                      btnText = "Register";
                    }

                    return (
                      <tr 
                        key={tournament.id} 
                        className="hover:bg-[#111] transition-colors cursor-pointer"
                        onClick={() => setSelectedEvent(tournament)}
                      >
                        <td className="px-6 py-4 font-medium text-white">
                          {new Date(tournament.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-white uppercase">{tournament.title}</td>
                        <td className="px-6 py-4 uppercase text-accent font-semibold">{tournament.game}</td>
                        <td className="px-6 py-4">{tournament.format || "-"}</td>
                        <td className="px-6 py-4 font-medium text-white">{tournament.prize_pool || "TBA"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full border ${
                            isClosed ? 'border-[#333] text-text-secondary bg-[#262626]' : 
                            statusLower.includes('upcoming') ? 'border-blue-500/50 text-blue-400 bg-blue-500/10' :
                            'border-accent/50 text-accent bg-accent/10'
                          }`}>
                            {tournament.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          {isClosed ? (
                            <span className="text-xs uppercase font-bold text-text-secondary">Closed</span>
                          ) : (
                            <a 
                              href={`/events/${tournament.id}/register`}
                              className="inline-block bg-accent text-black px-4 py-2 text-xs font-bold uppercase hover:bg-white transition-colors rounded"
                            >
                              {btnText}
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-32 text-center border border-[#262626] bg-[#0A0A0A] rounded-lg">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-10 h-10 animate-spin text-accent" />
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-black uppercase text-text-secondary">No {statusFilter !== 'All Status' ? statusFilter : ''} Events Found</h3>
                  <p className="text-text-secondary mt-2 text-lg">Adjust your search or game filters.</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button 
              onClick={handleLoadMore}
              disabled={isLoading}
              className="px-10 py-4 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wide hover:bg-white hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? "Loading..." : "Load More Events"}
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
        />
      )}
    </section>
  );
}
