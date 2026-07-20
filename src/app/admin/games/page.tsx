import { Gamepad2 } from "lucide-react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { AddGameButton, EditGameButton, DeleteGameButton } from "@/components/admin/GameActions";

export const revalidate = 0; // Ensure data is always fresh

export default async function AdminGameLibraryPage() {
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .neq('status', 'Trashed')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching games:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Game Library Management</h1>
          <p className="text-text-secondary">Manage available PC and PS5 games.</p>
        </div>
        <AddGameButton />
      </div>

      {!games || games.length === 0 ? (
        <div className="bg-surface-100 border border-border rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <Gamepad2 className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">No games found</h3>
          <p className="text-text-secondary mb-6">You haven't added any games to the library yet.</p>
        </div>
      ) : (
        <div className="bg-surface-100 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Image</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Title & Platform</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Genre</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Featured</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {games.map((game) => (
                <tr key={game.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="relative w-16 h-20 rounded overflow-hidden border border-border/50">
                        <Image
                          src={game.image_url}
                          alt={game.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white">{game.title}</p>
                    <p className="text-xs text-text-secondary mt-1">{game.platform}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-text-secondary">{game.genre}</span>
                  </td>
                  <td className="p-4">
                    {game.is_featured ? (
                      <span className="px-2 py-1 text-xs font-bold rounded-full bg-accent/10 text-accent border border-accent/20">Featured</span>
                    ) : (
                      <span className="text-xs text-text-secondary">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      game.status === 'Active' 
                        ? 'bg-green-500/10 text-green-400' 
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {game.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <EditGameButton game={game} />
                    <DeleteGameButton gameId={game.id} />
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
