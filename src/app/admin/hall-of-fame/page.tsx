"use client";

import { useState, useEffect } from "react";
import { Award, Plus, Trash2, Edit } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface HallOfFameItem {
  id: string;
  team_name: string;
  tournament_name: string;
  description: string;
  image_url: string;
  status: string;
  featured?: boolean;
}

export default function AdminHallOfFamePage() {
  const [items, setItems] = useState<HallOfFameItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  
  const [formData, setFormData] = useState<HallOfFameItem>({
    id: "",
    team_name: "",
    tournament_name: "",
    description: "",
    image_url: "",
    status: "Published",
    featured: false,
  });

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/db?collection=hallOfFame");
      if (res.ok) {
         const data = await res.json();
         setItems(data.filter((i: any) => i.status !== "Trashed"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = formData.id ? "PUT" : "POST";
      const payload = formData.id 
        ? { collection: "hallOfFame", id: formData.id, data: formData }
        : { collection: "hallOfFame", data: { ...formData, status: "Published" } };

      const res = await fetch("/api/db", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchItems();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this champion from Hall of Fame?")) return;
    try {
      const res = await fetch("/api/db", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "hallOfFame", id, status: "Trashed" })
      });
      if (res.ok) fetchItems();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Hall of Fame</h1>
          <p className="text-text-secondary">Manage tournament champions and MVP players.</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ id: "", team_name: "", tournament_name: "", description: "", image_url: "", status: "Published", featured: false });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#F4B000] text-black px-4 py-2 rounded-md font-bold uppercase text-sm hover:bg-[#E0A300] transition-colors"
        >
          <Award className="w-4 h-4" /> Add Champion
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-text-secondary">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-surface-100 border border-border rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <Award className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">Hall of Fame is empty</h3>
          <p className="text-text-secondary">Add past tournament winners to showcase their achievements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {items.map(item => (
             <div key={item.id} className="bg-surface-100 border border-border rounded-lg overflow-hidden">
               <div className="aspect-video relative bg-black">
                 {item.image_url && <img src={item.image_url} alt={item.team_name} className="w-full h-full object-cover" />}
               </div>
               <div className="p-4">
                 <div className="flex items-center justify-between mb-1">
                   <div className="text-accent text-xs font-bold uppercase">{item.tournament_name}</div>
                   {item.featured && <div className="bg-accent text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Featured</div>}
                 </div>
                 <h3 className="text-xl font-bold text-white uppercase mb-2">{item.team_name}</h3>
                 <p className="text-text-secondary text-sm mb-4">{item.description}</p>
                 <div className="flex justify-end gap-2 border-t border-border pt-4">
                   <button onClick={() => { setFormData(item); setIsModalOpen(true); }} className="text-blue-500 hover:text-blue-400 p-2"><Edit className="w-4 h-4" /></button>
                   <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400 p-2"><Trash2 className="w-4 h-4" /></button>
                 </div>
               </div>
             </div>
           ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-100 border border-border rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold uppercase mb-4 text-white">{formData.id ? "Edit Champion" : "Add Champion"}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Team/Player Name</label>
                <input value={formData.team_name} onChange={e => setFormData({...formData, team_name: e.target.value})} className="w-full bg-[#111111] border border-border rounded p-2 text-white outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Tournament Name</label>
                <input value={formData.tournament_name} onChange={e => setFormData({...formData, tournament_name: e.target.value})} className="w-full bg-[#111111] border border-border rounded p-2 text-white outline-none focus:border-accent" />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Description / Achievement</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-[#111111] border border-border rounded p-2 text-white outline-none focus:border-accent resize-none" />
              </div>
              <div>
                <label className="block text-xs uppercase font-bold text-text-secondary mb-1">Champion Image</label>
                <div className="flex gap-2">
                  <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="flex-1 bg-[#111111] border border-border rounded p-2 text-white outline-none focus:border-accent" />
                  <button onClick={() => setMediaPickerOpen(true)} className="px-3 bg-white/10 hover:bg-white/20 rounded border border-border text-white text-sm transition-colors">Browse</button>
                </div>
                {formData.image_url && <img src={formData.image_url} alt="Preview" className="mt-2 h-24 w-auto rounded border border-border object-cover" />}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="featured-champ"
                  checked={formData.featured}
                  onChange={e => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 bg-[#111111] border-border rounded text-accent focus:ring-accent accent-accent"
                />
                <label htmlFor="featured-champ" className="text-sm font-semibold uppercase text-text-secondary">Featured Champion</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-transparent text-text-secondary hover:text-white font-bold uppercase text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-accent text-black hover:bg-yellow-400 font-bold uppercase text-sm rounded">Save Champion</button>
            </div>
          </div>
        </div>
      )}

      <MediaPickerModal 
        isOpen={mediaPickerOpen} 
        onClose={() => setMediaPickerOpen(false)} 
        onSuccess={(url) => { setFormData({...formData, image_url: url}); setMediaPickerOpen(false); }} 
      />
    </div>
  );
}
