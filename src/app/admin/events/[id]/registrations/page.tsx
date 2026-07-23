import { supabase } from "@/lib/supabase";
import MatchmakerClient from "./MatchmakerClient";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function EventRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  const { data: event, error: eventError } = await supabase.from('events').select('*').eq('id', eventId).single();
  const { data: registrations, error: regError } = await supabase.from('registrations').select('*').eq('event_id', eventId);

  if (eventError || !event) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Event Not Found</h1>
        <Link href="/admin/events" className="text-accent hover:underline">Return to Events</Link>
      </div>
    );
  }

  // Parse Rules for Team Size
  let extra: any = {};
  try { if (event.rules) extra = JSON.parse(event.rules); } catch(e) {}
  const teamSizeLimit = extra.team_size_limit || 1;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/admin/events" className="p-2 bg-surface-100 border border-border rounded hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-3">
            <Users className="w-6 h-6 text-accent" />
            Registrations & Matchmaker
          </h1>
          <p className="text-text-secondary text-sm">Managing roster for: <strong className="text-accent">{event.name}</strong></p>
        </div>
      </div>

      {teamSizeLimit > 1 && (
        <div className="bg-accent/10 border border-accent/20 p-4 rounded text-sm text-accent mb-6">
          <strong>Team Builder Mode Active:</strong> This event requires teams of <strong>{teamSizeLimit}</strong>. You can use the Matchmaker below to shuffle Solo players into teams.
        </div>
      )}

      <MatchmakerClient 
        eventId={eventId} 
        registrations={registrations || []} 
        teamSizeLimit={teamSizeLimit} 
      />
    </div>
  );
}
