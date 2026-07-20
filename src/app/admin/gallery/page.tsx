"use client";

import { useState, useEffect } from "react";
import { Camera, Trash2, Plus, Loader2 } from "lucide-react";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/db?collection=gallery");
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
    fetchGallery();
  }, []);

  const handleMediaSuccess = async (url: string) => {
    setMediaPickerOpen(false);
    try {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "gallery",
          data: { url, status: "Published" }
        })
      });
      if (res.ok) fetchGallery();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this image from the gallery?")) return;
    try {
      const res = await fetch("/api/db", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "gallery", id, status: "Trashed" })
      });
      if (res.ok) fetchGallery();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Gallery Management</h1>
          <p className="text-text-secondary">Curate photos and videos for the public gallery.</p>
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
          <h3 className="text-lg font-bold text-white mb-2">Gallery is empty</h3>
          <p className="text-text-secondary">Upload memorable moments from recent tournaments to display them publicly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="relative group aspect-square rounded overflow-hidden border border-[#262626]">
              <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(item.id)} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
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
