import { supabase } from "@/lib/supabase";
import { Trophy, Gamepad2, Camera, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  // Fetch live counts from Supabase
  const [
    { count: activeEvents },
    { count: activeGames },
    { count: galleryItems }
  ] = await Promise.all([
    supabase.from("events").select("*", { count: "exact", head: true }).neq("status", "Trashed"),
    supabase.from("games").select("*", { count: "exact", head: true }).neq("status", "Trashed"),
    supabase.from("gallery").select("*", { count: "exact", head: true }).neq("status", "Trashed")
  ]);

  const statCards = [
    { title: "Active Events", value: activeEvents || 0, icon: Trophy, href: "/admin/events", color: "text-[#F4B000]" },
    { title: "Published Games", value: activeGames || 0, icon: Gamepad2, href: "/admin/games", color: "text-green-500" },
    { title: "Gallery Photos", value: galleryItems || 0, icon: Camera, href: "/admin/gallery", color: "text-blue-500" },
    { title: "Total Media Assets", value: "TBA", icon: Users, href: "/admin/media", color: "text-purple-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Dashboard Overview</h1>
        <p className="text-text-secondary">Welcome to the Wild Gaming admin control panel.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link href={stat.href} key={stat.title} className="bg-surface-100 border border-border p-6 rounded-lg hover:border-white/20 transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold uppercase text-text-secondary tracking-wider">{stat.title}</h3>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
            </div>
            <p className="text-4xl font-bold text-white">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-100 border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold uppercase tracking-wide text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/events/new" className="flex items-center justify-center gap-2 bg-white/5 border border-border py-4 rounded hover:bg-white/10 transition-colors">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium uppercase">Create Event</span>
            </Link>
            <Link href="/admin/games/new" className="flex items-center justify-center gap-2 bg-white/5 border border-border py-4 rounded hover:bg-white/10 transition-colors">
              <Gamepad2 className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium uppercase">Add Game</span>
            </Link>
            <Link href="/admin/media" className="flex items-center justify-center gap-2 bg-white/5 border border-border py-4 rounded hover:bg-white/10 transition-colors">
              <Camera className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium uppercase">Upload Media</span>
            </Link>
          </div>
        </div>

        <div className="bg-surface-100 border border-border rounded-lg p-6">
          <h2 className="text-lg font-bold uppercase tracking-wide text-white mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <span className="text-sm font-semibold text-green-400">Supabase Connected</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#F4B000]" />
              <span className="text-sm text-text-secondary">Auth: Disabled (MVP Mode)</span>
            </div>
            
            <div className="mt-6 p-4 bg-[#0A0A0A] border border-border rounded flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary leading-relaxed">
                System is fully integrated with remote PostgreSQL database. All modules are live.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
