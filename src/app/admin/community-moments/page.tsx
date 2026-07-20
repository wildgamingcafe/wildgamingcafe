"use client";

import { useState, useEffect } from "react";
import { Camera, Trash2, Plus, Loader2 } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

export default function AdminCommunityMomentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const fetchMoments = async () => {
    try {
      const res = await fetch("/api/db?collection=communityMoments");
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
    fetchMoments();
  }, []);

  const handleMediaSuccess = async (url: string) => {
    setMediaPickerOpen(false);
    try {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "communityMoments",
          data: { url, featured: false, status: "Published" }
        })
      });
      if (res.ok) fetchMoments();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image?")) return;
    try {
      const res = await fetch("/api/db", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "communityMoments", id, status: "Trashed" })
      });
      if (res.ok) fetchMoments();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFeatured = async (item: any) => {
    try {
      const res = await fetch("/api/db", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "communityMoments", id: item.id, featured: !item.featured })
      });
      if (res.ok) fetchMoments();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Community Moments</h1>
          <p className="text-text-secondary">Upload images and select which ones are featured on the Events page.</p>
        </div>
        <button 
          onClick={() => setMediaPickerOpen(true)}
          className="flex items-center gap-2 bg-[#F4B000] text-black px-4 py-2 rounded-md font-bold uppercase text-sm hover:bg-[#E0A300] transition-colors"
        >
          <Camera className="w-4 h-4" /> Upload Photo
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
      ) : items.length === 0 ? (
        <div className="bg-surface-100 border border-border rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <Camera className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">No moments uploaded</h3>
          <p className="text-text-secondary">Upload action shots from tournaments to display them.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className={`relative group aspect-video rounded overflow-hidden border ${item.featured ? 'border-accent border-2' : 'border-[#262626]'}`}>
              <img src={item.url} alt="Community Moment" className="w-full h-full object-cover" />
              
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                <button 
                  onClick={() => toggleFeatured(item)} 
                  className={`px-4 py-2 rounded font-bold text-sm uppercase tracking-wider ${item.featured ? 'bg-black text-accent border border-accent' : 'bg-accent text-black hover:bg-yellow-400'}`}
                >
                  {item.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors mt-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {item.featured && (
                <div className="absolute top-2 left-2 bg-accent text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-md pointer-events-none">
                  Featured
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <MediaPickerModal 
        isOpen={mediaPickerOpen} 
        onClose={() => setMediaPickerOpen(false)} 
        onSuccess={handleMediaSuccess} 
      />
    </div>
  );
}
