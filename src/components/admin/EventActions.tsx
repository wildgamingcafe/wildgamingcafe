"use client";

import { Edit, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EventActions({ eventId }: { eventId: string }) {
  const router = useRouter();

  const handleUpdate = () => {
    router.push(`/admin/events/${eventId}`);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to move this event to the Trash?")) {
      const { error } = await supabase
        .from('events')
        .update({ status: 'Trashed' })
        .eq('id', eventId);

      if (!error) {
        router.refresh();
      } else {
        alert("Failed to delete event.");
      }
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link 
        href={`/admin/events/${eventId}/registrations`}
        className="p-2 bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors" 
        title="Registrations & Matchmaker"
      >
        <Users className="w-4 h-4" />
      </Link>
      <button 
        onClick={handleUpdate}
        className="p-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors" 
        title="Update"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button 
        onClick={handleDelete}
        className="p-2 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20 transition-colors" 
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
