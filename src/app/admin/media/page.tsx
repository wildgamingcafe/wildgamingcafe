"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Search, FileImage, FileVideo, Loader2, Plus } from "lucide-react";
import Image from "next/image";
import MediaPickerModal from "@/components/admin/MediaPickerModal";

interface MediaItem {
  id: string;
  url: string;
  type: string;
  name: string;
  createdAt: string;
  status: string;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      setMedia(data.filter((m: MediaItem) => m.status !== "Trashed"));
    } catch (error) {
      console.error("Failed to fetch media", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  const handleMediaSuccess = async (url: string) => {
    setMediaPickerOpen(false);
    setUploading(true);
    try {
      const type = url.match(/\.(mp4|webm|mov)$/i) ? "video" : "image";
      const name = url.split('/').pop() || "uploaded-media";
      
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collection: "media",
          data: {
            url,
            type,
            name,
            status: "Published"
          }
        })
      });
      if (res.ok) {
        await fetchMedia();
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Move this item to trash?")) return;
    
    try {
      const res = await fetch("/api/db", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collection: "media", id, status: "Trashed" })
      });
      if (res.ok) {
        await fetchMedia();
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white">Media Library</h1>
          <p className="text-text-secondary text-sm">Centralized asset manager for the entire website.</p>
        </div>
        
        <div>
          <button 
            onClick={() => setMediaPickerOpen(true)}
            disabled={uploading}
            className={`flex items-center gap-2 px-6 py-3 font-semibold uppercase text-sm transition-colors ${
              uploading ? "bg-accent/50 text-black/50 cursor-not-allowed" : "bg-accent text-black hover:bg-[#E0A300]"
            }`}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {uploading ? "Processing..." : "Upload via Cloudinary"}
          </button>
        </div>
      </div>

      <div className="bg-surface-100 border border-border p-4 flex items-center gap-3 rounded-md">
        <Search className="w-5 h-5 text-text-secondary" />
        <input 
          type="text" 
          placeholder="Search media by name..." 
          className="bg-transparent border-none outline-none text-white w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="py-20 text-center border border-border bg-surface-100 rounded-md">
          <p className="text-text-secondary">No media files found. Upload some assets to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div key={item.id} className="group relative border border-border bg-surface-100 rounded-md overflow-hidden hover:border-accent transition-colors">
              <div className="aspect-square relative bg-black flex items-center justify-center">
                {item.type === "image" ? (
                  <Image src={item.url} alt={item.name} fill className="object-cover" unoptimized />
                ) : (
                  <video src={item.url} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded hover:bg-white/20 text-white">
                    {item.type === "image" ? <FileImage className="w-5 h-5" /> : <FileVideo className="w-5 h-5" />}
                  </a>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-red-500/20 rounded hover:bg-red-500/40 text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-text-secondary truncate" title={item.name}>{item.name}</p>
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
