"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, Search, Trash2, ChevronDown, ChevronRight, Gamepad2, Edit } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import RegistrationEditModal from "@/components/admin/RegistrationEditModal";

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [editingRegistration, setEditingRegistration] = useState<any>(null);

  const fetchRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select(`*, events ( id, name, game, date )`)
        .order('created_at', { ascending: false });

      if (data) setItems(data);
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
    if (!confirm("Delete this registration? This action cannot be undone.")) return;
    try {
      const { error } = await supabase.from('registrations').delete().eq('id', id);
      if (!error) fetchRegistrations();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleEvent = (eventId: string) => {
    setExpandedEvents(prev => 
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  // Group by Event
  const groupedEvents = items.reduce((acc: any, curr: any) => {
    if (!curr.events) return acc; // Skip orphaned registrations
    const eId = curr.events.id;
    if (!acc[eId]) {
      acc[eId] = {
        event: curr.events,
        registrations: []
      };
    }
    acc[eId].registrations.push(curr);
    return acc;
  }, {});

  // Convert to array and filter by search
  let displayGroups = Object.values(groupedEvents);
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    displayGroups = displayGroups.map((group: any) => {
      // If event name matches, keep all registrations
      if (group.event.name.toLowerCase().includes(q)) return group;
      
      // Otherwise, filter registrations that match
      const filteredRegs = group.registrations.filter((r: any) => {
        const tName = r.team_name?.toLowerCase() || "";
        const pName = r.captain_details?.name?.toLowerCase() || "";
        const ign = r.captain_details?.ign?.toLowerCase() || "";
        return tName.includes(q) || pName.includes(q) || ign.includes(q);
      });
      return { ...group, registrations: filteredRegs };
    }).filter((group: any) => group.registrations.length > 0);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Global Registrations</h1>
          <p className="text-text-secondary">Expand an event below to manage its registered players and payments.</p>
        </div>
      </div>

      <div className="bg-surface-100 border border-border p-4 flex items-center gap-3 rounded-md">
        <Search className="w-5 h-5 text-text-secondary" />
        <input 
          type="text" 
          placeholder="Search by event name, team name, or player name..." 
          className="bg-transparent border-none outline-none text-white w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 flex justify-center bg-surface-100 border border-border rounded-lg">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : displayGroups.length === 0 ? (
          <div className="p-12 text-center bg-surface-100 border border-border rounded-lg flex flex-col items-center justify-center">
            <Users className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-white mb-2">No Registrations Found</h3>
            <p className="text-text-secondary">Once players sign up for tournaments, their events will appear here.</p>
          </div>
        ) : (
          displayGroups.map((group: any) => {
            const eId = group.event.id;
            const isExpanded = expandedEvents.includes(eId) || searchQuery.trim() !== "";
            const totalRevenue = group.registrations.reduce((sum: number, r: any) => {
              const price = parseInt(String(r.total_price).replace(/\D/g, ''), 10);
              return sum + (isNaN(price) ? 0 : price);
            }, 0);

            return (
              <div key={eId} className="bg-surface-100 border border-border rounded-lg overflow-hidden">
                {/* Accordion Header */}
                <button 
                  onClick={() => toggleEvent(eId)}
                  className="w-full flex items-center justify-between p-4 bg-[#0A0A0A] hover:bg-white/5 transition-colors border-b border-[#262626]"
                >
                  <div className="flex items-center gap-4 text-left">
                    {isExpanded ? <ChevronDown className="w-5 h-5 text-accent" /> : <ChevronRight className="w-5 h-5 text-text-secondary" />}
                    <div>
                      <h3 className="text-lg font-bold text-white uppercase">{group.event.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-text-secondary font-semibold uppercase mt-1">
                        <Gamepad2 className="w-3 h-3 text-accent" /> {group.event.game}
                        <span>•</span>
                        {group.registrations.length} Registration(s)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-text-secondary uppercase font-bold">Est. Revenue</div>
                      <div className="text-sm text-accent font-black">₹{totalRevenue}</div>
                    </div>
                    <Link 
                      href={`/admin/events/${eId}/registrations`} 
                      onClick={(e) => e.stopPropagation()}
                      className="bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-3 py-1.5 rounded text-xs uppercase font-bold transition-colors"
                    >
                      Matchmaker
                    </Link>
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="overflow-x-auto bg-[#050505]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#262626] text-text-secondary uppercase text-[10px] tracking-wider">
                          <th className="p-3 font-bold pl-12">Player / Team</th>
                          <th className="p-3 font-bold">Contact</th>
                          <th className="p-3 font-bold">Amount</th>
                          <th className="p-3 font-bold">Status</th>
                          <th className="p-3 font-bold text-right pr-6">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#262626]">
                        {group.registrations.map((item: any) => (
                          <tr key={item.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-3 pl-12">
                              <div className="text-white font-bold text-sm">
                                {item.registration_type === 'team' ? item.team_name : item.captain_details?.name}
                              </div>
                              <div className="text-xs text-text-secondary uppercase">{item.registration_type}</div>
                            </td>
                            <td className="p-3">
                              <div className="text-sm text-white font-semibold">{item.captain_details?.ign}</div>
                              <div className="text-xs text-text-secondary">{item.captain_details?.phone}</div>
                            </td>
                            <td className="p-3 text-sm text-white font-bold">
                              {item.total_price}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${
                                item.payment_status === 'Paid' 
                                  ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                                  : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                              }`}>
                                {item.payment_status || 'Unpaid'}
                              </span>
                            </td>
                            <td className="p-3 text-right pr-6 flex justify-end gap-1">
                              <button onClick={() => setEditingRegistration(item)} className="text-text-secondary hover:text-white transition-colors p-2" title="Edit">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item.id)} className="text-text-secondary hover:text-red-500 transition-colors p-2" title="Delete">
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
            );
          })
        )}
      </div>

      {editingRegistration && (
        <RegistrationEditModal 
          registration={editingRegistration} 
          onClose={() => setEditingRegistration(null)}
          onSuccess={() => {
            setEditingRegistration(null);
            fetchRegistrations();
          }}
        />
      )}
    </div>
  );
}
