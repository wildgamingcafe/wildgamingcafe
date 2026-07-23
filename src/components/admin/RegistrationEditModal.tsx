"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function RegistrationEditModal({
  registration,
  onClose,
  onSuccess
}: {
  registration: any;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    teamName: registration.team_name || "",
    captainName: registration.captain_details?.name || "",
    captainPhone: registration.captain_details?.phone || "",
    captainIgn: registration.captain_details?.ign || "",
    paymentStatus: registration.payment_status || "Unpaid"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedCaptain = {
        ...registration.captain_details,
        name: formData.captainName,
        phone: formData.captainPhone,
        ign: formData.captainIgn
      };

      const { error } = await supabase.from('registrations').update({
        team_name: registration.registration_type === 'team' ? formData.teamName : null,
        captain_details: updatedCaptain,
        payment_status: formData.paymentStatus
      }).eq('id', registration.id);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Failed to update registration.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-surface-100 border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border bg-[#0A0A0A]">
          <h2 className="text-xl font-bold uppercase text-white">Edit Registration</h2>
          <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          {registration.registration_type === 'team' && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-secondary">Team Name</label>
              <input 
                name="teamName" 
                value={formData.teamName} 
                onChange={handleChange} 
                type="text" 
                className="w-full bg-[#050505] border border-border rounded p-3 text-white focus:border-accent outline-none" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-text-secondary">
              {registration.registration_type === 'team' ? 'Captain Name' : 'Player Name'}
            </label>
            <input 
              name="captainName" 
              value={formData.captainName} 
              onChange={handleChange} 
              type="text" 
              className="w-full bg-[#050505] border border-border rounded p-3 text-white focus:border-accent outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-secondary">In-Game Name (IGN)</label>
              <input 
                name="captainIgn" 
                value={formData.captainIgn} 
                onChange={handleChange} 
                type="text" 
                className="w-full bg-[#050505] border border-border rounded p-3 text-white focus:border-accent outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-text-secondary">Phone</label>
              <input 
                name="captainPhone" 
                value={formData.captainPhone} 
                onChange={handleChange} 
                type="text" 
                className="w-full bg-[#050505] border border-border rounded p-3 text-white focus:border-accent outline-none" 
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <label className="text-xs font-bold uppercase text-text-secondary">Payment Status</label>
            <select 
              name="paymentStatus" 
              value={formData.paymentStatus} 
              onChange={handleChange} 
              className="w-full bg-[#050505] border border-border rounded p-3 text-white focus:border-accent outline-none"
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid (Cash/Online)</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-3 font-semibold uppercase text-xs border border-border text-white hover:bg-white/5 transition-colors rounded"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 font-bold uppercase text-xs bg-accent text-black hover:bg-[#E0A300] transition-colors rounded"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
