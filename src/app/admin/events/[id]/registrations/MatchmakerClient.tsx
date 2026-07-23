"use client";

import { useState } from "react";
import { Shuffle, Users, UserPlus, Save, Loader2, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MatchmakerClient({ 
  eventId, 
  registrations, 
  teamSizeLimit 
}: { 
  eventId: string, 
  registrations: any[], 
  teamSizeLimit: number 
}) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Split data
  const officialTeams = registrations.filter(r => r.registration_type === 'team');
  const solos = registrations.filter(r => r.registration_type === 'solo');

  // Assigned vs Unassigned Solos
  const unassignedSolos = solos.filter(s => !s.assigned_custom_team);
  
  // Group assigned solos by their custom team string
  const assignedSolos = solos.filter(s => s.assigned_custom_team);
  const customTeams = assignedSolos.reduce((acc: any, curr) => {
    const teamName = curr.assigned_custom_team;
    if (!acc[teamName]) acc[teamName] = [];
    acc[teamName].push(curr);
    return acc;
  }, {});

  // Manual Selection State
  const [selectedSolos, setSelectedSolos] = useState<string[]>([]);
  const [customTeamName, setCustomTeamName] = useState("");

  const toggleSelect = (id: string) => {
    setSelectedSolos(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleManualGroup = async () => {
    if (selectedSolos.length === 0) return alert("Select at least 1 player.");
    if (!customTeamName.trim()) return alert("Enter a custom team name.");
    if (selectedSolos.length > teamSizeLimit) return alert(`Max ${teamSizeLimit} players per team.`);

    setIsProcessing(true);
    
    // Prefix to identify custom matchmaker teams vs user-created teams
    const finalTeamName = `[MIX] ${customTeamName}`;

    for (const id of selectedSolos) {
      await supabase.from('registrations').update({ assigned_custom_team: finalTeamName }).eq('id', id);
    }
    
    setSelectedSolos([]);
    setCustomTeamName("");
    setIsProcessing(false);
    router.refresh();
  };

  const handleAutoShuffle = async () => {
    if (unassignedSolos.length < 2) return alert("Not enough solos to shuffle.");
    if (!confirm("This will randomly group all currently unassigned solo players into teams. Proceed?")) return;

    setIsProcessing(true);
    
    // Copy and shuffle array
    const shuffled = [...unassignedSolos].sort(() => 0.5 - Math.random());
    
    let teamCounter = Object.keys(customTeams).length + 1;
    let currentTeam: any[] = [];

    for (let i = 0; i < shuffled.length; i++) {
      currentTeam.push(shuffled[i]);

      // If team is full OR it's the last player
      if (currentTeam.length === teamSizeLimit || i === shuffled.length - 1) {
        const mixName = `[AUTO-MIX] Squad ${teamCounter}`;
        
        for (const player of currentTeam) {
          await supabase.from('registrations').update({ assigned_custom_team: mixName }).eq('id', player.id);
        }
        
        teamCounter++;
        currentTeam = []; // Reset for next batch
      }
    }

    setIsProcessing(false);
    router.refresh();
  };

  const handleDisbandTeam = async (teamName: string) => {
    setIsProcessing(true);
    const playersInTeam = assignedSolos.filter(s => s.assigned_custom_team === teamName);
    for (const player of playersInTeam) {
      await supabase.from('registrations').update({ assigned_custom_team: null }).eq('id', player.id);
    }
    setIsProcessing(false);
    router.refresh();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* LEFT COLUMN: Solos & Matchmaker */}
      <div className="space-y-6">
        
        <div className="bg-surface-100 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
            <h2 className="text-lg font-bold uppercase text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-accent" /> 
              Unassigned Solos ({unassignedSolos.length})
            </h2>
            {teamSizeLimit > 1 && (
              <button 
                onClick={handleAutoShuffle}
                disabled={isProcessing || unassignedSolos.length === 0}
                className="flex items-center gap-2 bg-[#111] border border-accent/50 text-accent hover:bg-accent/10 px-3 py-1.5 rounded text-xs font-bold uppercase transition-colors"
              >
                {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shuffle className="w-3 h-3" />}
                Auto-Shuffle All
              </button>
            )}
          </div>

          {unassignedSolos.length === 0 ? (
            <p className="text-sm text-text-secondary italic">No unassigned solo players.</p>
          ) : (
            <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {unassignedSolos.map(solo => (
                <div key={solo.id} className="flex items-center gap-3 bg-[#050505] p-3 rounded border border-[#262626]">
                  {teamSizeLimit > 1 && (
                    <input 
                      type="checkbox" 
                      checked={selectedSolos.includes(solo.id)}
                      onChange={() => toggleSelect(solo.id)}
                      className="w-4 h-4 accent-accent"
                    />
                  )}
                  <div>
                    <div className="text-white font-bold text-sm uppercase">{solo.captain_details?.ign || "Unknown IGN"}</div>
                    <div className="text-text-secondary text-xs">{solo.captain_details?.name} • {solo.captain_details?.phone}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Manual Builder UI */}
          {teamSizeLimit > 1 && selectedSolos.length > 0 && (
            <div className="bg-accent/10 border border-accent/30 p-4 rounded-lg mt-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="text-xs font-bold text-accent uppercase mb-2">
                Manual Grouping ({selectedSolos.length}/{teamSizeLimit} Selected)
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customTeamName}
                  onChange={e => setCustomTeamName(e.target.value)}
                  placeholder="Custom Team Name..."
                  className="flex-1 bg-[#111] border border-accent/30 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-accent"
                />
                <button 
                  onClick={handleManualGroup}
                  disabled={isProcessing}
                  className="bg-accent text-black px-4 py-2 rounded text-sm font-bold uppercase flex items-center gap-2 hover:bg-white transition-colors"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Group
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Official & Mixed Teams */}
      <div className="space-y-6">
        
        {/* Admin-Mixed Teams */}
        {Object.keys(customTeams).length > 0 && (
          <div className="bg-surface-100 border border-accent/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full pointer-events-none" />
            <h2 className="text-lg font-bold uppercase text-accent border-b border-accent/20 pb-4 mb-4 flex items-center gap-2">
              <Shuffle className="w-5 h-5" /> 
              Admin Mixed Teams
            </h2>
            
            <div className="space-y-4">
              {Object.entries(customTeams).map(([tName, players]: [string, any]) => (
                <div key={tName} className="bg-[#050505] border border-[#262626] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-bold uppercase">{tName}</h3>
                    <button 
                      onClick={() => handleDisbandTeam(tName)}
                      className="text-text-secondary hover:text-red-500 text-xs flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Disband
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {players.map((p: any) => (
                      <div key={p.id} className="text-xs bg-[#111] p-2 rounded text-gray-300">
                        <strong className="text-white">{p.captain_details?.ign}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User-Registered Teams */}
        <div className="bg-surface-100 border border-border rounded-xl p-6">
          <h2 className="text-lg font-bold uppercase text-white border-b border-border pb-4 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" /> 
            Official Registered Teams ({officialTeams.length})
          </h2>

          {officialTeams.length === 0 ? (
            <p className="text-sm text-text-secondary italic">No teams have registered yet.</p>
          ) : (
            <div className="space-y-4">
              {officialTeams.map(team => {
                const teammates = team.teammates_details || [];
                const allPlayers = [team.captain_details, ...teammates];
                return (
                  <div key={team.id} className="bg-[#050505] border border-[#262626] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-white font-bold uppercase">{team.team_name}</h3>
                      <span className="text-xs text-text-secondary bg-[#111] px-2 py-1 rounded">{allPlayers.length} Players</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-xs bg-accent/10 text-accent border border-accent/20 p-2 rounded">
                        <span className="font-bold uppercase mb-1 block opacity-50 text-[10px]">Captain</span>
                        {team.captain_details?.ign}
                      </div>
                      {teammates.map((p: any, i: number) => (
                        <div key={i} className="text-xs bg-[#111] p-2 rounded text-gray-300">
                          {p.ign}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
