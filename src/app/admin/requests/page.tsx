"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trash2, AlertCircle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface GameRequest {
  id: string;
  title: string;
  likes: number;
  created_at: string;
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<GameRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("game_requests")
      .select("*")
      .order("likes", { ascending: false });
      
    if (data) setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    const { error } = await supabase.from("game_requests").delete().eq("id", id);
    if (!error) {
      setRequests(prev => prev.filter(r => r.id !== id));
    } else {
      alert("Failed to delete request");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wide">Game Requests</h1>
          <p className="text-text-secondary text-sm mt-1">Manage public game requests. Queue limit is 5.</p>
        </div>
        <button 
          onClick={fetchRequests} 
          className="flex items-center gap-2 px-4 py-2 bg-surface-100 border border-border rounded text-sm font-semibold hover:bg-white/5 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="bg-surface-100 border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold uppercase tracking-wider text-text-secondary">Current Queue Status:</span>
            <span className={`px-2 py-1 rounded text-xs font-bold ${requests.length >= 5 ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
              {requests.length} / 5
            </span>
          </div>
          {requests.length >= 5 && (
            <div className="flex items-center gap-2 text-xs text-red-500">
              <AlertCircle className="w-4 h-4" /> Queue is full. Public submissions are blocked.
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-text-secondary">
            No game requests found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase bg-[#111111] text-text-secondary">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Game Title</th>
                  <th className="px-4 py-3 text-center">Likes</th>
                  <th className="px-4 py-3">Requested On</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={req.id} 
                    className="border-b border-[#262626] hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-4 font-bold text-white">{req.title}</td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block px-2 py-1 bg-accent/20 text-accent rounded text-xs font-bold min-w-[30px]">
                        {req.likes}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-text-secondary">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(req.id)}
                        className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
