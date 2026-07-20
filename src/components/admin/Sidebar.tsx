"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Trash2, 
  Trophy, 
  Gamepad2, 
  Camera, 
  MonitorPlay, 
  Settings, 
  Users,
  Award,
  MessageSquarePlus,
  Aperture
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "Events", href: "/admin/events", icon: Trophy },
  { name: "Game Library", href: "/admin/games", icon: Gamepad2 },
  { name: "Game Requests", href: "/admin/requests", icon: MessageSquarePlus },
  { name: "Gallery", href: "/admin/gallery", icon: Camera },
  { name: "Community Moments", href: "/admin/community-moments", icon: Aperture },
  { name: "Registrations", href: "/admin/registrations", icon: Users },
  { name: "Hall of Fame", href: "/admin/hall-of-fame", icon: Award },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-100 border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold uppercase tracking-wider text-white">
          Wild <span className="text-accent">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                isActive 
                  ? "bg-accent/10 text-accent font-medium" 
                  : "text-text-secondary hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-accent" : "text-text-secondary"}`} />
              <span className="text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/admin/trash"
          className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
            pathname === "/admin/trash"
              ? "bg-red-500/10 text-red-500 font-medium"
              : "text-text-secondary hover:text-red-400 hover:bg-white/5"
          }`}
        >
          <Trash2 className="w-5 h-5" />
          <span className="text-sm">Trash</span>
        </Link>
      </div>
    </aside>
  );
}
