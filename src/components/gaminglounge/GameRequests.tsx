"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, PlusCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface GameRequest {
  id: string;
  title: string;
  likes: number;
}

export default function GameRequests() {
  const [requests, setRequests] = useState<GameRequest[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to submit request.");
      } else {
        setNewTitle("");
        fetchRequests();
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      // Optimistic update
      setRequests(prev => prev.map(req => req.id === id ? { ...req, likes: req.likes + 1 } : req));
      
      const res = await fetch("/api/requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        // Revert on failure
        fetchRequests();
      } else {
        // Re-sort
        fetchRequests();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const limitReached = requests.length >= 5;

  if (loading) return null;

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6 bg-[#0A0A0A] border border-[#262626]">
      <h3 className="heading-style text-2xl uppercase mb-2">Request a <span className="text-accent">Game</span></h3>
      <p className="text-text-secondary text-sm mb-6">Don't see your favorite game? Request it below, or upvote an existing request!</p>
      
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {errorMsg}
        </div>
      )}

      {limitReached ? (
        <div className="mb-6 p-4 bg-accent/10 border border-accent text-accent text-sm font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Request queue is full. Please DM support regarding any issues or upvote an existing request below.
        </div>
      ) : (
        <form onSubmit={handleRequest} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Enter game title..."
            className="flex-1 bg-[#111111] border border-[#262626] rounded-none p-3 text-white focus:border-accent outline-none text-sm"
            disabled={submitting}
          />
          <button
            type="submit"
            disabled={submitting || !newTitle.trim()}
            className="px-6 bg-accent text-black font-bold uppercase tracking-wide text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? "..." : <><PlusCircle className="w-4 h-4" /> Request</>}
          </button>
        </form>
      )}

      <div className="space-y-3">
        {requests.length === 0 && !limitReached && (
          <p className="text-text-secondary text-sm italic">No game requests yet. Be the first!</p>
        )}
        
        {requests.map((req, i) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 bg-[#111111] border border-[#262626] hover:border-accent/30 transition-colors group"
          >
            <span className="font-semibold text-sm uppercase tracking-wide">{req.title}</span>
            
            <button
              onClick={() => handleLike(req.id)}
              className="flex items-center gap-2 px-3 py-1.5 border border-[#262626] group-hover:border-accent group-hover:text-accent transition-colors text-xs font-bold"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{req.likes}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
