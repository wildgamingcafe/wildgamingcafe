"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, Search, Trash2 } from "lucide-react";

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchRegistrations = async () => {
    try {
      const res = await fetch("/api/db?collection=registrations");
      if (res.ok) {
        const data = await res.json();
        setItems(data.filter((i: any) => i.status !== "Trashed"));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Move this registration to trash?")) return;
    try {
      const res = await fetch("/api/db", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "registrations", id, status: "Trashed" })
      });
      if (res.ok) fetchRegistrations();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredItems = items.filter(i => 
    i.team_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    i.game?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Registrations</h1>
          <p className="text-text-secondary">Track tournament sign-ups and player payments.</p>
        </div>
      </div>

      <div className="bg-surface-100 border border-border p-4 flex items-center gap-3 rounded-md">
        <Search className="w-5 h-5 text-text-secondary" />
        <input 
          type="text" 
          placeholder="Search by team name or game..." 
          className="bg-transparent border-none outline-none text-white w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-surface-100 border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Users className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-white mb-2">No Registrations Found</h3>
            <p className="text-text-secondary">Once players sign up for tournaments, their details will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0A0A0A] border-b border-[#262626] text-text-secondary uppercase text-xs tracking-wider">
                  <th className="p-4 font-bold">Team / Player</th>
                  <th className="p-4 font-bold">Game</th>
                  <th className="p-4 font-bold">Contact</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white font-bold">{item.team_name}</td>
                    <td className="p-4 text-text-secondary">{item.game}</td>
                    <td className="p-4 text-text-secondary">{item.contact}</td>
                    <td className="p-4 text-text-secondary text-sm">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
