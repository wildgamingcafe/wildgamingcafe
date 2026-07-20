"use client";

import { RefreshCw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

interface TrashActionsProps {
  id: string;
  collection: "games" | "events";
}

export default function TrashActions({ id, collection }: TrashActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    setLoading(true);
    const newStatus = collection === "events" ? "Draft" : "Active";
    
    const { error } = await supabase
      .from(collection)
      .update({ status: newStatus })
      .eq("id", id);
      
    if (!error) {
      router.refresh();
    } else {
      alert("Failed to restore item.");
    }
    setLoading(false);
  };

  const handlePermanentDelete = async () => {
    if (confirm(`Are you sure you want to PERMANENTLY delete this item? This action cannot be undone.`)) {
      setLoading(true);
      const { error } = await supabase
        .from(collection)
        .delete()
        .eq("id", id);
        
      if (!error) {
        router.refresh();
      } else {
        alert("Failed to permanently delete item.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        onClick={handleRestore}
        disabled={loading}
        className="flex items-center gap-2 p-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20 transition-colors disabled:opacity-50" 
        title="Restore"
      >
        <RefreshCw className="w-4 h-4" /> Restore
      </button>
      <button 
        onClick={handlePermanentDelete}
        disabled={loading}
        className="flex items-center gap-2 p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors disabled:opacity-50" 
        title="Permanently Delete"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
    </div>
  );
}
