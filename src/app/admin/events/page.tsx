import { Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import EventActions from "@/components/admin/EventActions";

export const revalidate = 0; // Ensure data is always fresh

export default async function AdminEventsPage() {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
  }

  const mappedEvents = (events || []).map(event => {
    let extra: any = {};
    try {
      if (event.rules) extra = JSON.parse(event.rules);
    } catch(e) {}
    return { ...event, ...extra };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Events Management</h1>
          <p className="text-text-secondary">Manage tournaments and community events.</p>
        </div>
        <Link href="/admin/events/new" className="flex items-center gap-2 bg-[#F4B000] text-black px-4 py-2 rounded-md font-bold uppercase text-sm hover:bg-[#E0A300] transition-colors">
          <Trophy className="w-4 h-4" /> Create Event
        </Link>
      </div>

      {!events || events.length === 0 ? (
        <div className="bg-surface-100 border border-border rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <Trophy className="w-12 h-12 text-text-secondary mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-white mb-2">No events found</h3>
          <p className="text-text-secondary mb-6">You haven't created any events yet.</p>
        </div>
      ) : (
        <div className="bg-surface-100 border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-black/20">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Image</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Event Details</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Date & Prize</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">Status</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mappedEvents.map((event) => (
                <tr key={event.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="relative w-24 h-16 rounded overflow-hidden border border-border/50">
                      {event.image_url ? (
                        <Image
                          src={event.image_url}
                          alt={event.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-black/50 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-text-secondary/50" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white text-lg">{event.name}</p>
                    <p className="text-sm text-[#F4B000] mt-1">{event.game}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-white">
                      {event.date ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBA'}
                    </p>
                    <p className="text-xs text-text-secondary mt-1">{event.prize_pool}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      event.status === 'Completed' 
                        ? 'bg-red-500/10 text-red-400' 
                        : 'bg-green-500/10 text-green-400'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <EventActions eventId={event.id} />
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
