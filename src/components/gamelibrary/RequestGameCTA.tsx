"use client";

import { useState, useEffect } from "react";
import { Gamepad2, Users, Search, Plus, ThumbsUp } from "lucide-react";

interface GameRequest {
  id: string;
  name: string;
  votes: number;
}

export default function RequestGameCTA() {
  const [requests, setRequests] = useState<GameRequest[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [votedGameNames, setVotedGameNames] = useState<string[]>([]);

  useEffect(() => {
    fetchRequests();
    // Load voted games from local storage
    const storedVotes = localStorage.getItem("votedGames");
    if (storedVotes) {
      setVotedGameNames(JSON.parse(storedVotes));
    }
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRequests(data.sort((a, b) => b.votes - a.votes));
      }
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  const submitRequest = async (gameName: string) => {
    const cleanName = gameName.trim().toLowerCase();
    if (!cleanName || loading) return;

    // Prevent double voting client-side
    if (votedGameNames.includes(cleanName)) {
      alert("You have already requested or voted for this game!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameName }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests.sort((a: GameRequest, b: GameRequest) => b.votes - a.votes));
        
        // Save to local storage
        const newVoted = [...votedGameNames, cleanName];
        setVotedGameNames(newVoted);
        localStorage.setItem("votedGames", JSON.stringify(newVoted));

        setQuery("");
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch (err) {
      console.error("Failed to submit request", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = query.trim() === "" 
    ? requests.slice(0, 5) // Show top 5 if no query
    : requests.filter(r => r.name.toLowerCase().includes(query.toLowerCase())).slice(0, 5);

  return (
    <section className="py-24 bg-[#050505]">
      <div className="container mx-auto px-4 sm:px-6 md:px-10 lg:px-14">
        <div className="border border-[#262626] bg-[#0A0A0A] rounded-md overflow-hidden flex flex-col lg:flex-row relative shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent pointer-events-none" />

          {/* Left: Content */}
          <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center text-center lg:text-left z-10 border-b lg:border-b-0 lg:border-r border-[#262626]">
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                <Gamepad2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="heading-style text-2xl lg:text-3xl uppercase text-white leading-tight">
                REQUEST A <span className="text-accent">GAME</span>
              </h3>
            </div>
            <p className="text-text-secondary text-sm font-semibold leading-relaxed mb-6">
              Can't find your favorite title? Search below to see if others have requested it, or submit a new request. We regularly add games with high community interest!
            </p>
            
            <form 
              onSubmit={(e) => { e.preventDefault(); submitRequest(query); }}
              className="flex gap-2 w-full mt-2"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                <input 
                  type="text"
                  placeholder="Enter game name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#111] border border-[#333] text-white pl-12 pr-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all rounded-sm placeholder:text-[#444]"
                />
              </div>
              <button 
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-3.5 bg-accent text-black font-bold uppercase tracking-wide text-sm transition-all hover:bg-[#E0A300] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm flex items-center gap-2 whitespace-nowrap"
              >
                {loading ? "..." : (filteredRequests.length > 0 && query.toLowerCase() === filteredRequests[0].name.toLowerCase()) ? "VOTE" : "REQUEST"}
              </button>
            </form>
            
            {submitted && (
              <p className="text-green-500 text-xs font-bold uppercase tracking-wider mt-3">
                Request recorded successfully!
              </p>
            )}
          </div>

          {/* Right: Community Requests */}
          <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center z-10 bg-[#0F0F0F]">
            <div className="flex items-center gap-3 mb-6 border-b border-[#222] pb-4">
              <Users className="w-5 h-5 text-accent" />
              <h4 className="text-white font-bold uppercase tracking-wide text-sm">
                {query.trim() === "" ? "Trending Community Requests" : "Matching Requests"}
              </h4>
            </div>

            {requests.length === 0 ? (
              <p className="text-text-secondary text-sm italic">No requests yet. Be the first!</p>
            ) : filteredRequests.length === 0 ? (
              <div className="flex items-center gap-3 text-text-secondary bg-[#151515] p-4 border border-[#222] rounded-sm">
                <Plus className="w-5 h-5 text-accent" />
                <p className="text-sm font-semibold">"{query}" hasn't been requested. Submit it to start the trend!</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {filteredRequests.map((req) => (
                  <button
                    key={req.id}
                    onClick={() => submitRequest(req.name)}
                    disabled={loading}
                    className="group flex items-center gap-2 bg-[#1A1A1A] border border-[#333] px-4 py-2 rounded-full transition-all hover:border-accent hover:bg-[#222] text-left"
                  >
                    <span className="text-white text-sm font-semibold">{req.name}</span>
                    <div className="flex items-center gap-1.5 bg-[#111] px-2 py-1 rounded-full border border-[#333] group-hover:border-accent/30">
                      <ThumbsUp className="w-3 h-3 text-accent" />
                      <span className="text-accent text-xs font-bold">{req.votes}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-text-primary text-[10px] uppercase tracking-widest font-bold mt-8 opacity-50">
              Click any game above to add your vote instantly.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
