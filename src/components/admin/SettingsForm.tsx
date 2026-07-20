"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Save, CheckCircle2, AlertTriangle, LayoutTemplate, MonitorPlay, Cpu, DollarSign, Globe, Settings as SettingsIcon, Image as ImageIcon, Users, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import MediaPickerModal from "./MediaPickerModal";

interface CMSData {
  global: {
    ticker_active: boolean;
    ticker_text: string;
  };
  hero: {
    video_url: string;
    headline: string;
    subheadline: string;
  };
  hardware: {
    internet: string;
    gpu: string;
    cpu: string;
    monitors: string;
    keyboards: string;
    chairs: string;
  };
  pricing: {
    pc_1h: string;
    pc_2h: string;
    pc_5h: string;
    pc_8h: string;
    ps5_1: string;
    ps5_2: string;
    ps5_4: string;
  };
  faq: {
    q1: string; a1: string;
    q2: string; a2: string;
    q3: string; a3: string;
    q4: string; a4: string;
    q5: string; a5: string;
  };
  zones: { name: string; description: string; image_url: string }[];
  community: { title: string; description: string; cards: { icon: string; title: string; description: string }[] };
  gallery: string[];
  events_hero: { media_url: string; alignment?: string };
  gamelibrary_hero: { media_url: string; alignment?: string };
}

interface SettingsData {
  cafe_name: string;
  email: string;
  phone: string;
  address: string;
  discord_url: string;
  instagram_url: string;
  youtube_url: string;
  cms_data: CMSData;
}

const defaultCMS: CMSData = {
  global: { ticker_active: true, ticker_text: "Welcome to Wild Gaming Cafe! New tournaments announcing soon..." },
  hero: { video_url: "/videos/HomePage.webm", headline: "YOUR NEXT WIN STARTS HERE", subheadline: "High-performance PCs, PS5 Arena, 1 Gbps Internet and a community built for gamers." },
  hardware: { internet: "1 Gbps", gpu: "RTX 4070", cpu: "Intel Core i7", monitors: "144Hz / 240Hz", keyboards: "Mechanical", chairs: "Premium" },
  pricing: { pc_1h: "120", pc_2h: "220", pc_5h: "500", pc_8h: "720", ps5_1: "180", ps5_2: "250", ps5_4: "400" },
  faq: {
    q1: "Do I need to book in advance?", a1: "Walk-ins are welcome, but booking in advance is recommended during weekends and peak hours.",
    q2: "What games are available?", a2: "Wild Gaming offers a large library of popular titles including Valorant, CS2, FC, PUBG, GTA V, Apex Legends and many more.",
    q3: "What internet speed is available?", a3: "The gaming lounge is powered by a 1 Gbps fiber internet connection for low-latency gaming.",
    q4: "Are tournaments open to everyone?", a4: "Most tournaments and community events are open to all players. Event-specific requirements will be listed on the Events page.",
    q5: "What platforms are available?", a5: "Wild Gaming offers high-performance gaming PCs and a dedicated PS5 gaming zone."
  },
  zones: [
    { name: "Pro PC Arena", description: "High-performance gaming PCs with 240Hz monitors.", image_url: "/images/pc-arena.jpg" },
    { name: "PS5 Lounge", description: "Comfortable sofas, 4K TVs, and the latest PS5 titles.", image_url: "/images/ps5-lounge.jpg" }
  ],
  community: {
    title: "Tournaments & Community",
    description: "Join weekly tournaments and climb the leaderboard.",
    cards: [
      { icon: "Calendar", title: "Weekly Gaming Events", description: "Regular community gaming sessions every week." },
      { icon: "Trophy", title: "LAN Tournaments", description: "Compete in high-stakes LAN tournaments for cash prizes." },
      { icon: "Users", title: "Community Nights", description: "Meet, play and connect with Hyderabad's gaming community." },
      { icon: "Swords", title: "Valorant Events", description: "Weekly Valorant scrims, tournaments and ranked nights." },
      { icon: "Gamepad2", title: "FC25 Competitions", description: "FIFA tournaments and casual matches with friends." }
    ]
  },
  gallery: [
    "/images/gallery1.jpg",
    "/images/gallery2.jpg",
    "/images/gallery3.jpg",
    "/images/gallery4.jpg"
  ],
  events_hero: { media_url: "/videos/HomePage.webm", alignment: "center" },
  gamelibrary_hero: { media_url: "/images/ps5-lounge.jpg", alignment: "center" }
};

export default function SettingsForm({ initialData }: { initialData: Partial<SettingsData> }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "cms_global" | "cms_hero" | "cms_hardware" | "cms_pricing" | "cms_zones" | "cms_community" | "cms_gallery" | "cms_faq" | "cms_pages">("general");

  const [formData, setFormData] = useState<SettingsData>({
    cafe_name: initialData.cafe_name || "",
    email: initialData.email || "",
    phone: initialData.phone || "",
    address: initialData.address || "",
    discord_url: initialData.discord_url || "",
    instagram_url: initialData.instagram_url || "",
    youtube_url: initialData.youtube_url || "",
    cms_data: {
      global: { ...defaultCMS.global, ...initialData.cms_data?.global },
      hero: { ...defaultCMS.hero, ...initialData.cms_data?.hero },
      hardware: { ...defaultCMS.hardware, ...initialData.cms_data?.hardware },
      pricing: { ...defaultCMS.pricing, ...initialData.cms_data?.pricing },
      faq: { ...defaultCMS.faq, ...initialData.cms_data?.faq },
      zones: initialData.cms_data?.zones || defaultCMS.zones,
      community: { ...defaultCMS.community, ...initialData.cms_data?.community },
      gallery: initialData.cms_data?.gallery || defaultCMS.gallery,
      events_hero: { ...defaultCMS.events_hero, ...initialData.cms_data?.events_hero },
      gamelibrary_hero: { ...defaultCMS.gamelibrary_hero, ...initialData.cms_data?.gamelibrary_hero }
    }
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  
  // Media Picker State
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<{ type: string; index?: number } | null>(null);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSaveStatus("idle");
  };

  const handleCMSChange = (section: keyof CMSData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      cms_data: {
        ...prev.cms_data,
        [section]: {
          ...(prev.cms_data[section] as any),
          [field]: value
        }
      }
    }));
    setSaveStatus("idle");
  };

  // Zones Array Handlers
  const handleZoneChange = (index: number, field: string, value: string) => {
    const newZones = [...formData.cms_data.zones];
    newZones[index] = { ...newZones[index], [field]: value };
    setFormData(prev => ({ ...prev, cms_data: { ...prev.cms_data, zones: newZones } }));
    setSaveStatus("idle");
  };

  const addZone = () => {
    setFormData(prev => ({
      ...prev,
      cms_data: { ...prev.cms_data, zones: [...prev.cms_data.zones, { name: "New Zone", description: "", image_url: "" }] }
    }));
  };

  const removeZone = (index: number) => {
    const newZones = [...formData.cms_data.zones];
    newZones.splice(index, 1);
    setFormData(prev => ({ ...prev, cms_data: { ...prev.cms_data, zones: newZones } }));
  };

  // Community Cards Array Handlers
  const handleCommunityCardChange = (index: number, field: string, value: string) => {
    const newCards = [...formData.cms_data.community.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    handleCMSChange("community", "cards", newCards);
  };

  const addCommunityCard = () => {
    const newCards = [...formData.cms_data.community.cards, { icon: "Star", title: "New Feature", description: "" }];
    handleCMSChange("community", "cards", newCards);
  };

  const removeCommunityCard = (index: number) => {
    const newCards = [...formData.cms_data.community.cards];
    newCards.splice(index, 1);
    handleCMSChange("community", "cards", newCards);
  };

  // Gallery Array Handlers
  const removeGalleryImage = (index: number) => {
    const newGallery = [...formData.cms_data.gallery];
    newGallery.splice(index, 1);
    setFormData(prev => ({ ...prev, cms_data: { ...prev.cms_data, gallery: newGallery } }));
  };

  const handleMediaSelect = (url: string) => {
    if (!mediaTarget) return;

    if (mediaTarget.type === "hero_video") {
      handleCMSChange("hero", "video_url", url);
    } else if (mediaTarget.type === "zone_image" && mediaTarget.index !== undefined) {
      handleZoneChange(mediaTarget.index, "image_url", url);
    } else if (mediaTarget.type === "gallery_image") {
      setFormData(prev => ({
        ...prev,
        cms_data: { ...prev.cms_data, gallery: [...prev.cms_data.gallery, url] }
      }));
    } else if (mediaTarget.type === "events_hero") {
      handleCMSChange("events_hero", "media_url", url);
    } else if (mediaTarget.type === "gamelibrary_hero") {
      handleCMSChange("gamelibrary_hero", "media_url", url);
    }
    
    // Close the wrapper modal automatically after successful upload
    setMediaPickerOpen(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");

    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...formData, updated_at: new Date().toISOString() });

    if (error) {
      console.error("Save error:", error);
      setSaveStatus("error");
    } else {
      setSaveStatus("success");
      router.refresh();
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
    setSaving(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-2 sticky top-6 self-start max-h-[calc(100vh-3rem)] overflow-y-auto custom-scrollbar pr-2 pb-4">
        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-4 px-3 pt-2">System</div>
        <button onClick={() => setActiveTab("general")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "general" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <SettingsIcon className="w-5 h-5" /> General Setup
        </button>
        
        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-8 mb-4 px-3">Website CMS</div>
        <button onClick={() => setActiveTab("cms_global")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_global" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <Globe className="w-5 h-5" /> Global (Ticker)
        </button>
        <button onClick={() => setActiveTab("cms_hero")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_hero" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <LayoutTemplate className="w-5 h-5" /> Hero Section
        </button>
        <button onClick={() => setActiveTab("cms_zones")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_zones" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <MonitorPlay className="w-5 h-5" /> Gaming Zones
        </button>
        <button onClick={() => setActiveTab("cms_hardware")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_hardware" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <Cpu className="w-5 h-5" /> Hardware Specs
        </button>
        <button onClick={() => setActiveTab("cms_pricing")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_pricing" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <DollarSign className="w-5 h-5" /> Pricing Tiers
        </button>
        <button onClick={() => setActiveTab("cms_community")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_community" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <Users className="w-5 h-5" /> Tournaments
        </button>
        <button onClick={() => setActiveTab("cms_gallery")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_gallery" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <ImageIcon className="w-5 h-5" /> Lounge Gallery
        </button>
        <button onClick={() => setActiveTab("cms_faq")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_faq" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <LayoutTemplate className="w-5 h-5" /> FAQs
        </button>
        <button onClick={() => setActiveTab("cms_pages")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-left font-medium ${activeTab === "cms_pages" ? "bg-white/10 text-white" : "text-text-secondary hover:bg-white/5 hover:text-white"}`}>
          <LayoutTemplate className="w-5 h-5" /> Subpage Heroes
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 space-y-6">
        {saveStatus === "success" && (
          <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-green-500 font-medium">Changes published successfully to live website.</span>
          </div>
        )}
        
        {saveStatus === "error" && (
          <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 font-medium">Failed to save changes.</span>
          </div>
        )}

        <div className="bg-surface-100 border border-border rounded-lg p-6 min-h-[500px]">
          
          {/* GENERAL TAB */}
          {activeTab === "general" && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white border-b border-border pb-2">Cafe Details</h2>
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">Cafe Name</label>
                  <input name="cafe_name" value={formData.cafe_name} onChange={handleGeneralChange} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase text-text-secondary">Support Email</label>
                    <input name="email" type="email" value={formData.email} onChange={handleGeneralChange} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase text-text-secondary">Support Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleGeneralChange} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">Physical Address</label>
                  <textarea name="address" value={formData.address} onChange={handleGeneralChange} rows={3} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* CMS: GLOBAL TAB */}
          {activeTab === "cms_global" && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white border-b border-border pb-2">Global UI Config</h2>
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between p-4 bg-white/5 border border-border rounded-lg">
                  <div>
                    <h3 className="font-bold text-white">News Ticker Banner</h3>
                    <p className="text-sm text-text-secondary">Show a scrolling banner at the top of the public website.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={formData.cms_data.global.ticker_active} onChange={(e) => handleCMSChange("global", "ticker_active", e.target.checked)} />
                    <div className="w-11 h-6 bg-surface-100 border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-text-secondary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 peer-checked:after:bg-white"></div>
                  </label>
                </div>
                
                {formData.cms_data.global.ticker_active && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-semibold uppercase text-text-secondary">Scrolling Ticker Text</label>
                    <input 
                      value={formData.cms_data.global.ticker_text} 
                      onChange={(e) => handleCMSChange("global", "ticker_text", e.target.value)} 
                      className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" 
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CMS: HERO TAB */}
          {activeTab === "cms_hero" && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white border-b border-border pb-2">Home Page Hero</h2>
              <div className="space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">Background Video URL / Path</label>
                  <div className="flex gap-2">
                    <input value={formData.cms_data.hero.video_url} onChange={(e) => handleCMSChange("hero", "video_url", e.target.value)} className="flex-1 bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                    <button type="button" onClick={() => { setMediaTarget({ type: "hero_video" }); setMediaPickerOpen(true); }} className="px-4 bg-white/10 hover:bg-white/20 rounded border border-border text-white transition-colors">Browse</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">Main Headline</label>
                  <input value={formData.cms_data.hero.headline} onChange={(e) => handleCMSChange("hero", "headline", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">Sub Headline</label>
                  <textarea value={formData.cms_data.hero.subheadline} onChange={(e) => handleCMSChange("hero", "subheadline", e.target.value)} rows={3} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* CMS: ZONES TAB */}
          {activeTab === "cms_zones" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">Gaming Zones</h2>
                <button onClick={addZone} className="flex items-center gap-2 text-sm bg-accent text-black px-3 py-1.5 rounded font-bold hover:bg-yellow-400 transition-colors">
                  <Plus className="w-4 h-4" /> Add Zone
                </button>
              </div>
              <div className="space-y-6">
                {formData.cms_data.zones.map((zone, index) => (
                  <div key={index} className="bg-[#0A0A0A] border border-[#262626] p-4 rounded relative group">
                    <button onClick={() => removeZone(index)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="space-y-4 max-w-2xl">
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-text-secondary">Zone Name</label>
                        <input value={zone.name} onChange={(e) => handleZoneChange(index, "name", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-2 text-white focus:border-accent outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-text-secondary">Description</label>
                        <textarea value={zone.description} onChange={(e) => handleZoneChange(index, "description", e.target.value)} rows={2} className="w-full bg-[#111111] border border-border rounded p-2 text-white focus:border-accent outline-none resize-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase text-text-secondary">Image URL</label>
                        <div className="flex gap-2">
                          <input value={zone.image_url} onChange={(e) => handleZoneChange(index, "image_url", e.target.value)} className="flex-1 bg-[#111111] border border-border rounded p-2 text-white focus:border-accent outline-none" />
                          <button type="button" onClick={() => { setMediaTarget({ type: "zone_image", index }); setMediaPickerOpen(true); }} className="px-3 bg-white/10 hover:bg-white/20 rounded border border-border text-white text-sm transition-colors">Browse</button>
                        </div>
                        {zone.image_url && <img src={zone.image_url} alt={zone.name} className="h-20 w-auto rounded object-cover border border-[#262626] mt-2" />}
                      </div>
                    </div>
                  </div>
                ))}
                {formData.cms_data.zones.length === 0 && (
                  <p className="text-text-secondary text-sm">No gaming zones configured. Click "Add Zone" to create one.</p>
                )}
              </div>
            </div>
          )}

          {/* CMS: HARDWARE TAB */}
          {activeTab === "cms_hardware" && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white border-b border-border pb-2">Hardware Specs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">Internet Speed</label>
                  <input value={formData.cms_data.hardware.internet} onChange={(e) => handleCMSChange("hardware", "internet", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">GPU Standard</label>
                  <input value={formData.cms_data.hardware.gpu} onChange={(e) => handleCMSChange("hardware", "gpu", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">CPU Standard</label>
                  <input value={formData.cms_data.hardware.cpu} onChange={(e) => handleCMSChange("hardware", "cpu", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">Monitors</label>
                  <input value={formData.cms_data.hardware.monitors} onChange={(e) => handleCMSChange("hardware", "monitors", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* CMS: PRICING TAB */}
          {activeTab === "cms_pricing" && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white border-b border-border pb-2">PC Pricing (₹)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">1 Hour</label>
                  <input type="number" value={formData.cms_data.pricing.pc_1h} onChange={(e) => handleCMSChange("pricing", "pc_1h", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">2 Hours</label>
                  <input type="number" value={formData.cms_data.pricing.pc_2h} onChange={(e) => handleCMSChange("pricing", "pc_2h", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">5 Hours</label>
                  <input type="number" value={formData.cms_data.pricing.pc_5h} onChange={(e) => handleCMSChange("pricing", "pc_5h", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">8 Hours</label>
                  <input type="number" value={formData.cms_data.pricing.pc_8h} onChange={(e) => handleCMSChange("pricing", "pc_8h", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
              </div>

              <h2 className="text-lg font-bold uppercase tracking-wide text-white border-b border-border pb-2 mt-8">PS5 Pricing (₹)</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">1 Player (Solo)</label>
                  <input type="number" value={formData.cms_data.pricing.ps5_1} onChange={(e) => handleCMSChange("pricing", "ps5_1", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">1-2 Players (Duo)</label>
                  <input type="number" value={formData.cms_data.pricing.ps5_2} onChange={(e) => handleCMSChange("pricing", "ps5_2", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase text-text-secondary">2-4 Players (Squad)</label>
                  <input type="number" value={formData.cms_data.pricing.ps5_4} onChange={(e) => handleCMSChange("pricing", "ps5_4", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* CMS: COMMUNITY TAB */}
          {activeTab === "cms_community" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">Tournaments & Community</h2>
                <button onClick={addCommunityCard} className="flex items-center gap-2 text-sm bg-accent text-black px-3 py-1.5 rounded font-bold hover:bg-yellow-400 transition-colors">
                  <Plus className="w-4 h-4" /> Add Card
                </button>
              </div>
              <div className="space-y-6">
                <div className="space-y-4 max-w-2xl bg-[#0A0A0A] border border-[#262626] p-4 rounded mb-8">
                  <h3 className="font-bold text-accent mb-2">Section Header</h3>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-text-secondary">Section Title</label>
                    <input value={formData.cms_data.community.title} onChange={(e) => handleCMSChange("community", "title", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-2 text-white focus:border-accent outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-text-secondary">Description</label>
                    <textarea value={formData.cms_data.community.description} onChange={(e) => handleCMSChange("community", "description", e.target.value)} rows={2} className="w-full bg-[#111111] border border-border rounded p-2 text-white focus:border-accent outline-none resize-none" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-accent">Feature Cards</h3>
                  {formData.cms_data.community.cards?.map((card, index) => (
                    <div key={index} className="bg-[#0A0A0A] border border-[#262626] p-4 rounded relative group">
                      <button onClick={() => removeCommunityCard(index)} className="absolute top-4 right-4 text-text-secondary hover:text-red-500 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <div className="space-y-4 max-w-2xl">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-text-secondary">Card Title</label>
                            <input value={card.title} onChange={(e) => handleCommunityCardChange(index, "title", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-2 text-white focus:border-accent outline-none" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase text-text-secondary">Icon</label>
                            <select value={card.icon} onChange={(e) => handleCommunityCardChange(index, "icon", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-2 text-white focus:border-accent outline-none appearance-none">
                              <option value="Calendar">Calendar</option>
                              <option value="Trophy">Trophy</option>
                              <option value="Users">Users (Community)</option>
                              <option value="Swords">Swords (Combat)</option>
                              <option value="Gamepad2">Gamepad</option>
                              <option value="Monitor">Monitor (PC)</option>
                              <option value="Crosshair">Crosshair (FPS)</option>
                              <option value="Star">Star (Featured)</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase text-text-secondary">Description</label>
                          <textarea value={card.description} onChange={(e) => handleCommunityCardChange(index, "description", e.target.value)} rows={2} className="w-full bg-[#111111] border border-border rounded p-2 text-white focus:border-accent outline-none resize-none" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!formData.cms_data.community.cards || formData.cms_data.community.cards.length === 0) && (
                    <p className="text-text-secondary text-sm">No cards configured. Click "Add Card" to create one.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CMS: GALLERY TAB */}
          {activeTab === "cms_gallery" && (
            <div className="space-y-8 animate-in fade-in">
              <div className="flex justify-between items-center border-b border-border pb-2">
                <h2 className="text-lg font-bold uppercase tracking-wide text-white">Lounge Gallery</h2>
                <button onClick={() => { setMediaTarget({ type: "gallery_image" }); setMediaPickerOpen(true); }} className="flex items-center gap-2 text-sm bg-accent text-black px-3 py-1.5 rounded font-bold hover:bg-yellow-400 transition-colors">
                  <Plus className="w-4 h-4" /> Add Image
                </button>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.cms_data.gallery.map((url, index) => (
                  <div key={index} className="relative group aspect-[4/3] rounded overflow-hidden border border-[#262626]">
                    <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => removeGalleryImage(index)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {formData.cms_data.gallery.length === 0 && (
                <p className="text-text-secondary text-sm">No images in gallery. Click "Add Image" to populate the slider.</p>
              )}
            </div>
          )}

          {/* CMS: FAQ TAB */}
          {activeTab === "cms_faq" && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white border-b border-border pb-2">Frequently Asked Questions</h2>
              <div className="space-y-6 max-w-2xl">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div key={`faq-${num}`} className="space-y-2 bg-[#0A0A0A] p-4 border border-[#262626] rounded">
                    <label className="text-sm font-semibold uppercase text-accent">Question {num}</label>
                    <input 
                      value={formData.cms_data.faq[`q${num}` as keyof CMSData['faq']]} 
                      onChange={(e) => handleCMSChange("faq", `q${num}`, e.target.value)} 
                      className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" 
                    />
                    <label className="text-sm font-semibold uppercase text-text-secondary mt-2 block">Answer {num}</label>
                    <textarea 
                      value={formData.cms_data.faq[`a${num}` as keyof CMSData['faq']]} 
                      onChange={(e) => handleCMSChange("faq", `a${num}`, e.target.value)} 
                      rows={2}
                      className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none resize-none" 
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CMS: SUBPAGES TAB */}
          {activeTab === "cms_pages" && (
            <div className="space-y-8 animate-in fade-in">
              <h2 className="text-lg font-bold uppercase tracking-wide text-white border-b border-border pb-2">Subpage Heroes</h2>
              <div className="space-y-8 max-w-2xl">
                <div className="space-y-2">
                  <h3 className="font-bold text-accent mb-4">Game Library Hero Background</h3>
                  <label className="text-sm font-semibold uppercase text-text-secondary">Image or Video URL</label>
                  <div className="flex gap-2">
                    <input value={formData.cms_data.gamelibrary_hero?.media_url || ""} onChange={(e) => handleCMSChange("gamelibrary_hero", "media_url", e.target.value)} className="flex-1 bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                    <button type="button" onClick={() => { setMediaTarget({ type: "gamelibrary_hero" }); setMediaPickerOpen(true); }} className="px-4 bg-white/10 hover:bg-white/20 rounded border border-border text-white transition-colors">Browse</button>
                  </div>
                  <label className="text-sm font-semibold uppercase text-text-secondary mt-4 block">Background Alignment (Crop Position)</label>
                  <select value={formData.cms_data.gamelibrary_hero?.alignment || "center"} onChange={(e) => handleCMSChange("gamelibrary_hero", "alignment", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none appearance-none">
                    <option value="center">Center (Default)</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-accent mb-4">Events Hero Background</h3>
                  <label className="text-sm font-semibold uppercase text-text-secondary">Image or Video URL</label>
                  <div className="flex gap-2">
                    <input value={formData.cms_data.events_hero?.media_url || ""} onChange={(e) => handleCMSChange("events_hero", "media_url", e.target.value)} className="flex-1 bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none" />
                    <button type="button" onClick={() => { setMediaTarget({ type: "events_hero" }); setMediaPickerOpen(true); }} className="px-4 bg-white/10 hover:bg-white/20 rounded border border-border text-white transition-colors">Browse</button>
                  </div>
                  <label className="text-sm font-semibold uppercase text-text-secondary mt-4 block">Background Alignment (Crop Position)</label>
                  <select value={formData.cms_data.events_hero?.alignment || "center"} onChange={(e) => handleCMSChange("events_hero", "alignment", e.target.value)} className="w-full bg-[#111111] border border-border rounded p-3 text-white focus:border-accent outline-none appearance-none">
                    <option value="center">Center (Default)</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Global Save Button */}
        <div className="sticky bottom-0 z-50 flex justify-end p-4 border-t border-border mt-6 bg-[#050505]/95 backdrop-blur-md rounded-b-lg shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-black font-bold uppercase tracking-wide rounded hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saving ? "Publishing..." : "Publish Changes"}
          </button>
        </div>
      </div>
      
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSuccess={handleMediaSelect}
      />
    </div>
  );
}
