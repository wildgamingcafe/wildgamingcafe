import { Trash2, AlertTriangle, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import TrashActions from "@/components/admin/TrashActions";

export const revalidate = 0; // Ensure data is always fresh

interface TrashedItem {
  id: string;
  title: string;
  type: "Game" | "Event";
  collection: "games" | "events";
  deletedAt: string;
  imageUrl: string;
  daysRemaining: number;
}

export default async function AdminTrashPage() {
  // Fetch from both collections in parallel
  const [gamesRes, eventsRes] = await Promise.all([
    supabase.from('games').select('*').eq('status', 'Trashed'),
    supabase.from('events').select('*').eq('status', 'Trashed')
  ]);

  const games = gamesRes.data || [];
  const events = eventsRes.data || [];

  const now = new Date();
  
  // Normalize and merge data
  const trashedItems: TrashedItem[] = [
    ...games.map(g => {
      const deletedDate = new Date(g.updated_at);
      const daysElapsed = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 3600 * 24));
      return {
        id: g.id,
        title: g.title,
        type: "Game" as const,
        collection: "games" as const,
        deletedAt: g.updated_at,
        imageUrl: g.image_url,
        daysRemaining: Math.max(0, 30 - daysElapsed)
      };
    }),
    ...events.map(e => {
      const deletedDate = new Date(e.updated_at);
      const daysElapsed = Math.floor((now.getTime() - deletedDate.getTime()) / (1000 * 3600 * 24));
      return {
        id: e.id,
        title: e.name, // events table uses 'name'
        type: "Event" as const,
        collection: "events" as const,
        deletedAt: e.updated_at,
        imageUrl: e.image_url, // banner image maps to image_url
        daysRemaining: Math.max(0, 30 - daysElapsed)
      };
    })
  ].sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2 flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-red-500" /> Recycle Bin
          </h1>
          <p className="text-text-secondary">Manage softly deleted items. Items are permanently deleted after 30 days.</p>
        </div>
      </div>

      {trashedItems.length === 0 ? (
        <div className="bg-surface-100 border border-border rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <Trash2 className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">Trash is empty</h3>
          <p className="text-text-secondary mb-6">No items have been deleted recently.</p>
        </div>
      ) : (
        <div className="bg-surface-100 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Image</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Details</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Type</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Time Remaining</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {trashedItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="relative w-16 h-16 rounded overflow-hidden border border-border/50 bg-[#111111]">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-text-secondary/50" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white text-lg">{item.title}</p>
                    <p className="text-xs text-text-secondary mt-1">
                      Deleted on {new Date(item.deletedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      item.type === 'Game' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.daysRemaining <= 5 ? (
                      <span className="flex items-center gap-1 text-red-400 font-bold text-sm">
                        <AlertTriangle className="w-4 h-4" /> {item.daysRemaining} days left
                      </span>
                    ) : (
                      <span className="text-text-secondary font-medium text-sm">
                        {item.daysRemaining} days left
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <TrashActions id={item.id} collection={item.collection} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
