"use client";

import { useState } from "react";
import { X, Save, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import MediaPickerModal from "./MediaPickerModal";
import Image from "next/image";

interface GameFormModalProps {
  onClose: () => void;
  // If game is passed, we are in Edit mode. Otherwise Add mode.
  game?: any; 
}

export default function GameFormModal({ onClose, game }: GameFormModalProps) {
  const router = useRouter();
  
  const [title, setTitle] = useState(game?.title || "");
  const [genre, setGenre] = useState(game?.genre || "");
  const [platform, setPlatform] = useState(game?.platform || "");
  const [imageUrl, setImageUrl] = useState(game?.image_url || "");
  const [isFeatured, setIsFeatured] = useState(game?.is_featured || false);
  
  const [existingGenres, setExistingGenres] = useState<string[]>([]);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch unique genres on mount
  useState(() => {
    const fetchGenres = async () => {
      const { data } = await supabase.from('games').select('genre');
      if (data) {
        const unique = Array.from(new Set(data.map(g => g.genre))).filter(Boolean);
        setExistingGenres(unique as string[]);
      }
    };
    fetchGenres();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !genre || !platform || !imageUrl) {
      setError("All fields (including the cover image) are required.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const payload = {
      title,
      genre,
      platform,
      image_url: imageUrl,
      is_featured: isFeatured,
      // If we are adding a new game, set status to Active by default
      status: game?.status || "Active" 
    };

    try {
      if (game?.id) {
        // UPDATE
        const { error } = await supabase.from('games').update(payload).eq('id', game.id);
        if (error) throw error;
      } else {
        // INSERT
        const { error } = await supabase.from('games').insert(payload);
        if (error) throw error;
      }

      router.refresh(); // Instantly re-fetch the Server Component data
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save game");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
        <div className="bg-surface-100 border border-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border bg-black/20">
            <h2 className="text-2xl font-bold text-white uppercase tracking-tight">
              {game ? "Update Game" : "Add New Game"}
            </h2>
            <button onClick={onClose} className="p-2 text-text-secondary hover:text-white rounded-full hover:bg-white/10 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Image */}
              <div className="space-y-2">
                <label className="text-sm font-semibold uppercase tracking-wider text-text-secondary">Cover Image</label>
                <div 
                  className="w-full aspect-[3/4] bg-black/30 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors relative overflow-hidden"
                  onClick={() => setIsMediaPickerOpen(true)}
                >
                  {imageUrl ? (
                    <>
                      <Image src={imageUrl} alt="Cover Preview" fill sizes="200px" className="object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white font-bold text-sm uppercase">Change Image</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-text-secondary mb-2" />
                      <span className="text-sm text-text-secondary font-semibold">Click to upload</span>
                      <span className="text-xs text-text-secondary/50 mt-1">Cloudinary Crop & Preview</span>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Text Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-text-secondary mb-2">Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black/30 border border-border rounded p-3 text-white focus:outline-none focus:border-accent"
                    placeholder="e.g. Valorant"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-text-secondary mb-2">Platform</label>
                  <input 
                    type="text" 
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-black/30 border border-border rounded p-3 text-white focus:outline-none focus:border-accent"
                    placeholder="e.g. PC, PS5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold uppercase tracking-wider text-text-secondary mb-2">Genre</label>
                  <input 
                    type="text" 
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    list="genre-options"
                    className="w-full bg-black/30 border border-border rounded p-3 text-white focus:outline-none focus:border-accent"
                    placeholder="e.g. FPS, Multiplayer"
                  />
                  <datalist id="genre-options">
                    {existingGenres.map(g => (
                      <option key={g} value={g} />
                    ))}
                  </datalist>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-black/30 border border-border rounded mt-2">
                  <div className="pr-4">
                    <label className="block text-sm font-bold uppercase tracking-wider text-white">Featured Game</label>
                    <p className="text-xs text-text-secondary mt-1">Display this game prominently on the public library page.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsFeatured(!isFeatured)}
                    className={`relative flex-shrink-0 inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black ${isFeatured ? 'bg-accent' : 'bg-[#262626]'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFeatured ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-accent text-black px-6 py-3 rounded font-bold uppercase tracking-wide hover:bg-[#E0A300] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? "Saving..." : "Save Game"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isMediaPickerOpen && (
        <MediaPickerModal 
          onClose={() => setIsMediaPickerOpen(false)}
          onSuccess={(url) => {
            setImageUrl(url);
            setIsMediaPickerOpen(false);
          }}
        />
      )}
    </>
  );
}
