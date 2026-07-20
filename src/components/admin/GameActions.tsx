"use client";

import { useState } from "react";
import { Gamepad2, Edit, Trash2 } from "lucide-react";
import GameFormModal from "./GameFormModal";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function AddGameButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-[#F4B000] text-black px-4 py-2 rounded-md font-bold uppercase text-sm hover:bg-[#E0A300] transition-colors"
      >
        <Gamepad2 className="w-4 h-4" /> Add Game
      </button>

      {isOpen && <GameFormModal onClose={() => setIsOpen(false)} />}
    </>
  );
}

export function EditGameButton({ game }: { game: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors" title="Update"
      >
        <Edit className="w-4 h-4" />
      </button>

      {isOpen && <GameFormModal game={game} onClose={() => setIsOpen(false)} />}
    </>
  );
}

export function DeleteGameButton({ gameId }: { gameId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to trash this game?")) return;
    setIsDeleting(true);
    await supabase.from('games').update({ status: 'Trashed' }).eq('id', gameId);
    router.refresh();
    setIsDeleting(false);
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors disabled:opacity-50" 
      title="Trash"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
