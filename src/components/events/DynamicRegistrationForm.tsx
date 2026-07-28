"use client";

import { useState } from "react";
import { Users, User, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DynamicRegistrationForm({ event, isPreReg }: { event: any, isPreReg: boolean }) {
  const router = useRouter();
  const teamSizeLimit = event.team_size_limit || 1;
  
  // Fallback to parsing entry_fee string if price_per_player is missing
  let parsedPrice = event.price_per_player;
  if (!parsedPrice && event.entry_fee) {
    const extracted = parseInt(String(event.entry_fee).replace(/\D/g, ''), 10);
    if (!isNaN(extracted)) parsedPrice = extracted;
  }
  const pricePerPlayer = parsedPrice || 0;

  const [regType, setRegType] = useState<"solo" | "team">(teamSizeLimit > 1 ? "team" : "solo");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);

  // Form State
  const [teamName, setTeamName] = useState("");
  const [captain, setCaptain] = useState({ name: "", phone: "", ign: "", email: "" });
  const [teammates, setTeammates] = useState([{ name: "", ign: "" }]);

  const handleAddTeammate = () => {
    if (teammates.length < teamSizeLimit - 1) {
      setTeammates([...teammates, { name: "", ign: "" }]);
    }
  };

  const handleRemoveTeammate = (index: number) => {
    setTeammates(teammates.filter((_, i) => i !== index));
  };

  const handleTeammateChange = (index: number, field: string, value: string) => {
    const updated = [...teammates];
    updated[index] = { ...updated[index], [field]: value };
    setTeammates(updated);
  };

  // Pricing Logic
  const playerCount = regType === "solo" ? 1 : 1 + teammates.length;
  const totalPrice = playerCount * pricePerPlayer;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      event_id: event.id,
      registration_type: regType,
      team_name: regType === "team" ? teamName : null,
      captain_details: captain,
      teammates_details: regType === "team" ? teammates : [],
      total_price: `₹${totalPrice}`,
    };

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Failed to submit");
      
      const resData = await response.json();
      setSuccessToken(resData.token);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-[#111] border border-accent/30 rounded-xl p-12 text-center flex flex-col items-center shadow-2xl">
        <CheckCircle2 className="w-16 h-16 text-accent mb-4" />
        <h2 className="text-3xl font-black uppercase text-white mb-2">Registration Confirmed!</h2>
        
        <div className="bg-[#050505] border border-[#262626] rounded-lg p-6 my-6 w-full max-w-sm">
          <div className="text-xs font-bold text-text-secondary uppercase mb-1">Your Token</div>
          <div className="text-4xl font-black text-accent tracking-widest">{successToken || "PENDING"}</div>
          
          <div className="mt-4 pt-4 border-t border-[#262626]">
            <div className="text-xs font-bold text-text-secondary uppercase mb-1">Total Amount Due</div>
            <div className="text-2xl font-black text-white">₹{totalPrice}</div>
          </div>
        </div>

        <p className="text-white font-medium mb-2 max-w-md mx-auto">
          A confirmation email with your token has been sent.
        </p>
        <p className="text-text-secondary mb-8 max-w-md mx-auto text-sm">
          <strong className="text-accent">Take a screenshot of this page.</strong> You must show this Token at the counter on the day of the event to pay your fee and secure your bracket slot.
        </p>

        <button 
          onClick={() => router.push('/events')}
          className="brand-button-secondary px-8 py-3 uppercase text-sm font-bold"
        >
          Return to Events
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#111] border border-[#262626] rounded-xl p-8 shadow-2xl">
      <div className="mb-8 border-b border-[#262626] pb-6">
        <h1 className="text-3xl font-black uppercase text-white mb-2">
          {isPreReg ? "Pre-Registration" : "Official Registration"}
        </h1>
        <p className="text-text-secondary">
          Fill out the details below to secure your spot. Payment will be collected on-site.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Toggle Type (Only if game allows teams) */}
        {teamSizeLimit > 1 && (
          <div className="flex gap-4 p-1 bg-[#050505] rounded-lg border border-[#262626]">
            <button 
              type="button"
              onClick={() => setRegType("solo")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md uppercase text-xs font-bold transition-colors ${
                regType === "solo" ? 'bg-[#262626] text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              <User className="w-4 h-4" /> Register as Solo
            </button>
            <button 
              type="button"
              onClick={() => setRegType("team")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-md uppercase text-xs font-bold transition-colors ${
                regType === "team" ? 'bg-[#262626] text-white' : 'text-text-secondary hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Register as Team
            </button>
          </div>
        )}

        {/* Solo notice */}
        {regType === "solo" && teamSizeLimit > 1 && (
          <div className="bg-accent/10 border border-accent/30 text-accent p-4 rounded text-sm">
            <strong>Solo Queue Note:</strong> Because this is a team game (up to {teamSizeLimit}v{teamSizeLimit}), you will be matched and placed into a random team by the admins on the day of the event.
          </div>
        )}

        {/* Team Details Section */}
        {regType === "team" && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase text-white tracking-wider border-b border-[#262626] pb-2">Team Details</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">Team Name *</label>
              <input required value={teamName} onChange={e => setTeamName(e.target.value)} type="text" className="w-full bg-[#050505] border border-[#262626] rounded p-4 text-white focus:border-accent outline-none" placeholder="e.g. Sentinels" />
            </div>
          </div>
        )}

        {/* Captain / Solo Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-white tracking-wider border-b border-[#262626] pb-2">
            {regType === "solo" ? "Player Details" : "Captain Details"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">Full Name *</label>
              <input required value={captain.name} onChange={e => setCaptain({...captain, name: e.target.value})} type="text" className="w-full bg-[#050505] border border-[#262626] rounded p-4 text-white focus:border-accent outline-none" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">Phone Number *</label>
              <input required value={captain.phone} onChange={e => setCaptain({...captain, phone: e.target.value})} type="tel" className="w-full bg-[#050505] border border-[#262626] rounded p-4 text-white focus:border-accent outline-none" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">In-Game Name (IGN) *</label>
              <input required value={captain.ign} onChange={e => setCaptain({...captain, ign: e.target.value})} type="text" className="w-full bg-[#050505] border border-[#262626] rounded p-4 text-white focus:border-accent outline-none" placeholder="e.g. TenZ#NA1" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase text-text-secondary tracking-wider">Email Address *</label>
              <input required value={captain.email} onChange={e => setCaptain({...captain, email: e.target.value})} type="email" className="w-full bg-[#050505] border border-[#262626] rounded p-4 text-white focus:border-accent outline-none" placeholder="gamer@example.com" />
            </div>
          </div>
        </div>

        {/* Teammates Section */}
        {regType === "team" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <h3 className="text-sm font-bold uppercase text-white tracking-wider">
                Teammates ({teammates.length} / {teamSizeLimit - 1})
              </h3>
              {teammates.length < teamSizeLimit - 1 && (
                <button type="button" onClick={handleAddTeammate} className="text-accent text-xs font-bold uppercase hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Player
                </button>
              )}
            </div>
            
            {teammates.map((teammate, idx) => (
              <div key={idx} className="bg-[#050505] border border-[#262626] p-4 rounded-lg relative group">
                <button 
                  type="button"
                  onClick={() => handleRemoveTeammate(idx)}
                  className="absolute top-4 right-4 text-text-secondary hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="text-xs font-bold text-text-secondary uppercase mb-3">Player {idx + 2}</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                  <input required value={teammate.name} onChange={e => handleTeammateChange(idx, 'name', e.target.value)} type="text" className="w-full bg-[#111] border border-[#262626] rounded p-3 text-sm text-white focus:border-accent outline-none" placeholder="Full Name *" />
                  <input required value={teammate.ign} onChange={e => handleTeammateChange(idx, 'ign', e.target.value)} type="text" className="w-full bg-[#111] border border-[#262626] rounded p-3 text-sm text-white focus:border-accent outline-none" placeholder="In-Game Name *" />
                </div>
              </div>
            ))}
            
            {teammates.length === 0 && (
              <div className="text-sm text-text-secondary italic bg-[#050505] p-4 rounded border border-[#262626]">
                You haven't added any teammates yet. Are you looking for a group? You can switch to Solo Queue above!
              </div>
            )}
          </div>
        )}

        {/* Price & Submit */}
        <div className="pt-6 border-t border-[#262626]">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-xs font-bold uppercase text-text-secondary">Amount Due (On-Site)</div>
              <div className="text-3xl font-black text-white">₹{totalPrice}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-secondary">{playerCount} Player(s) x ₹{pricePerPlayer}</div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full brand-button-secondary py-4 text-lg font-black uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isPreReg ? "Submit Pre-Registration" : "Confirm Registration"}
          </button>
          <p className="text-center text-xs text-text-secondary mt-4">
            By registering, you agree to the Wild Gaming Cafe Tournament Rules.
          </p>
        </div>
      </form>
    </div>
  );
}
