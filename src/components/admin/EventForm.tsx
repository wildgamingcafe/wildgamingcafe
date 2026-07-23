"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import MediaPickerModal from "./MediaPickerModal";
import { supabase } from "@/lib/supabase";

export default function EventForm({ eventId }: { eventId?: string }) {
  const router = useRouter();
  const isNew = !eventId;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  
  // Media Picker State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [activeMediaField, setActiveMediaField] = useState<"banner" | "featured" | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    game: "Valorant",
    description: "",
    date: "",
    time: "",
    format: "",
    prizePool: "",
    entryFee: "",
    registrationLink: "",
    status: "Draft",
    featured: false,
    bannerImageId: "",
    bannerImageUrl: "",
    featuredImageId: "",
    featuredImageUrl: "",
    registrationStartDate: "",
    registrationEndDate: "",
    enablePreRegister: false,
    rescheduleMessage: "",
    winnersData: { first: "", second: "" },
    teamSizeLimit: 1,
    pricePerPlayer: 0
  });

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
        if (data) {
          // Parse JSON from rules column if it exists
          let extra: any = {};
          try {
            if (data.rules) extra = JSON.parse(data.rules);
          } catch (e) {
            console.error("Failed to parse event rules JSON", e);
          }

          // Map DB schema back to form state
          setFormData({
            title: data.name || "",
            game: data.game || "Valorant",
            description: data.description || "",
            date: data.date ? data.date.split('T')[0] : "",
            time: extra.time || "",
            format: extra.format || "",
            prizePool: data.prize_pool || "",
            entryFee: extra.entry_fee || "",
            registrationLink: extra.registration_link || "",
            status: data.status || "Draft",
            featured: extra.is_featured || false,
            bannerImageId: "",
            bannerImageUrl: data.image_url || "",
            featuredImageId: "",
            featuredImageUrl: extra.thumbnail_image_url || "",
            registrationStartDate: extra.registration_start_date ? new Date(extra.registration_start_date).toISOString().slice(0, 16) : "",
            registrationEndDate: extra.registration_end_date ? new Date(extra.registration_end_date).toISOString().slice(0, 16) : "",
            enablePreRegister: extra.enable_pre_register || false,
            rescheduleMessage: extra.reschedule_message || "",
            winnersData: extra.winners_data || { first: "", second: "" },
            teamSizeLimit: extra.team_size_limit || 1,
            pricePerPlayer: extra.price_per_player || (extra.entry_fee ? parseInt(String(extra.entry_fee).replace(/\D/g, ''), 10) || 0 : 0)
          });
        }
        setLoading(false);
      };
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith("winner_")) {
      const winnerKey = name.split("_")[1];
      setFormData(prev => ({ 
        ...prev, 
        winnersData: { ...prev.winnersData, [winnerKey]: value } 
      }));
    } else if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaSelect = (url: string) => {
    if (activeMediaField === "banner") {
      setFormData(prev => ({ ...prev, bannerImageUrl: url }));
    } else if (activeMediaField === "featured") {
      setFormData(prev => ({ ...prev, featuredImageUrl: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        name: formData.title,
        game: formData.game,
        description: formData.description,
        date: formData.date ? new Date(formData.date).toISOString() : null,
        prize_pool: formData.prizePool,
        status: formData.status,
        image_url: formData.bannerImageUrl,
        rules: JSON.stringify({
          time: formData.time,
          format: formData.format,
          entry_fee: formData.entryFee,
          registration_link: formData.registrationLink,
          is_featured: formData.featured,
          thumbnail_image_url: formData.featuredImageUrl,
          registration_start_date: formData.registrationStartDate ? new Date(formData.registrationStartDate).toISOString() : null,
          registration_end_date: formData.registrationEndDate ? new Date(formData.registrationEndDate).toISOString() : null,
          enable_pre_register: formData.enablePreRegister,
          reschedule_message: formData.rescheduleMessage,
          winners_data: formData.winnersData,
          team_size_limit: Number(formData.teamSizeLimit),
          price_per_player: Number(formData.pricePerPlayer),
        })
      };

      if (isNew) {
        const { error } = await supabase.from('events').insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('events').update(payload).eq('id', eventId);
        if (error) throw error;
      }

      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      console.error("Save failed", error);
      alert("Failed to save event. Check console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/events" className="p-2 bg-surface-100 border border-border rounded hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white">
          {isNew ? "Create New Event" : "Edit Event"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="bg-surface-100 border border-border p-6 rounded-md space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white border-b border-border pb-2">Basic Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Event Title *</label>
              <input required name="title" value={formData.title} onChange={handleChange} type="text" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Game Category *</label>
              <select name="game" value={formData.game} onChange={handleChange} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none transition-colors">
                <option value="Valorant">Valorant</option>
                <option value="CS2">CS2</option>
                <option value="FC25">FC25</option>
                <option value="Mobile">Mobile</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase text-text-secondary">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none transition-colors" />
          </div>
        </div>

        {/* Media Integration */}
        <div className="bg-surface-100 border border-border p-6 rounded-md space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white border-b border-border pb-2">Media Assets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Banner Image */}
            <div className="space-y-3">
              <label className="text-sm font-semibold uppercase text-text-secondary">Banner Image</label>
              <div 
                className="w-full aspect-[21/9] bg-[#111111] border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors relative overflow-hidden group"
                onClick={() => { setActiveMediaField("banner"); setIsMediaPickerOpen(true); }}
              >
                {formData.bannerImageUrl ? (
                  <>
                    <Image src={formData.bannerImageUrl} alt="Banner" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-sm font-semibold uppercase text-white px-4 py-2 bg-black/50 border border-white/20 rounded">Change Media</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-text-secondary group-hover:text-accent transition-colors">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-xs font-semibold uppercase">Choose Media</span>
                  </div>
                )}
              </div>
            </div>

            {/* Featured Image */}
            <div className="space-y-3">
              <label className="text-sm font-semibold uppercase text-text-secondary">Featured Thumbnail</label>
              <div 
                className="w-full aspect-video bg-[#111111] border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-colors relative overflow-hidden group"
                onClick={() => { setActiveMediaField("featured"); setIsMediaPickerOpen(true); }}
              >
                {formData.featuredImageUrl ? (
                  <>
                    <Image src={formData.featuredImageUrl} alt="Featured" fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-sm font-semibold uppercase text-white px-4 py-2 bg-black/50 border border-white/20 rounded">Change Media</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-text-secondary group-hover:text-accent transition-colors">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-xs font-semibold uppercase">Choose Media</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Logistics */}
        <div className="bg-surface-100 border border-border p-6 rounded-md space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white border-b border-border pb-2">Logistics & Prizes</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Date</label>
              <input name="date" value={formData.date} onChange={handleChange} type="date" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none color-scheme-dark" style={{ colorScheme: 'dark' }} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Time</label>
              <input name="time" value={formData.time} onChange={handleChange} type="time" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none color-scheme-dark" style={{ colorScheme: 'dark' }} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Format</label>
              <input name="format" value={formData.format} onChange={handleChange} type="text" placeholder="e.g. 5v5 Single Elim" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Entry Fee</label>
              <input name="entryFee" value={formData.entryFee} onChange={handleChange} type="text" placeholder="e.g. ₹500/Team" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Total Prize Pool</label>
              <input name="prizePool" value={formData.prizePool} onChange={handleChange} type="text" placeholder="e.g. ₹50,000" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Price Per Player (₹)</label>
              <input name="pricePerPlayer" value={formData.pricePerPlayer} onChange={handleChange} type="number" placeholder="500" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Team Size Limit</label>
              <input name="teamSizeLimit" value={formData.teamSizeLimit} onChange={handleChange} type="number" min="1" max="10" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-semibold uppercase text-text-secondary">Reschedule / Postpone Message</label>
            <input name="rescheduleMessage" value={formData.rescheduleMessage} onChange={handleChange} type="text" placeholder="e.g. Postponed to next Sunday due to rain" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
          </div>
        </div>

        {/* Automated Lifecycle (New) */}
        <div className="bg-surface-100 border border-border p-6 rounded-md space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white border-b border-border pb-2">Automated Registration Lifecycle</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Registration Opens</label>
              <input name="registrationStartDate" value={formData.registrationStartDate} onChange={handleChange} type="datetime-local" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none color-scheme-dark" style={{ colorScheme: 'dark' }} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Registration Closes</label>
              <input name="registrationEndDate" value={formData.registrationEndDate} onChange={handleChange} type="datetime-local" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none color-scheme-dark" style={{ colorScheme: 'dark' }} />
            </div>
          </div>

          <div className="flex flex-col pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="enablePreRegister" checked={formData.enablePreRegister} onChange={handleChange} className="w-5 h-5 accent-accent" />
              <span className="text-sm font-semibold uppercase text-white">Enable Pre-Registration</span>
            </label>
            <p className="text-xs text-text-secondary mt-1 ml-8">If enabled, users can pre-register before the 'Registration Opens' date.</p>
          </div>
        </div>

        {/* Tournament Results */}
        {formData.status === "Completed" && (
          <div className="bg-surface-100 border border-border p-6 rounded-md space-y-6">
            <h2 className="text-lg font-bold uppercase tracking-wider text-accent border-b border-border pb-2">Tournament Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase text-text-secondary">1st Place (Winner)</label>
                <input name="winner_first" value={formData.winnersData.first} onChange={handleChange} type="text" placeholder="Team / Player Name" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase text-text-secondary">2nd Place (Runner Up)</label>
                <input name="winner_second" value={formData.winnersData.second} onChange={handleChange} type="text" placeholder="Team / Player Name" className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
              </div>
            </div>
          </div>
        )}

        {/* Publishing */}
        <div className="bg-surface-100 border border-border p-6 rounded-md space-y-6">
          <h2 className="text-lg font-bold uppercase tracking-wider text-white border-b border-border pb-2">Publishing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase text-text-secondary">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none">
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Registration Open">Registration Open</option>
                <option value="Filling Fast">Filling Fast</option>
                <option value="Almost Full">Almost Full</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            
            <div className="flex flex-col justify-center pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="w-5 h-5 accent-accent" />
                <span className="text-sm font-semibold uppercase text-white">Set as Featured Event</span>
              </label>
              <p className="text-xs text-text-secondary mt-1 ml-8">Only one event should be featured at a time.</p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4 border-t border-border pt-8">
          <Link href="/admin/events" className="px-8 py-3 font-semibold uppercase text-sm border border-border hover:bg-white/5 transition-colors rounded">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 font-semibold uppercase text-sm bg-accent text-black hover:bg-[#E0A300] transition-colors rounded"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isNew ? "Create Event" : "Save Changes"}
          </button>
        </div>
      </form>

      {isMediaPickerOpen && (
        <MediaPickerModal 
          onSuccess={(url) => {
            handleMediaSelect(url);
            setIsMediaPickerOpen(false);
          }}
          onClose={() => setIsMediaPickerOpen(false)} 
          aspectRatio={activeMediaField === "banner" ? 21/9 : 16/9}
        />
      )}
    </div>
  );
}
