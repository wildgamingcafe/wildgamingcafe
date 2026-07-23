import { Metadata } from "next";
import HeroSection from "@/components/events/HeroSection";
import TournamentShowcase from "@/components/events/TournamentShowcase";
import PaginatedEventGrid from "@/components/events/PaginatedEventGrid";
import LeaderboardPreview from "@/components/events/LeaderboardPreview";
import HallOfFamePreview from "@/components/events/HallOfFamePreview";
import CommunityGallery from "@/components/events/CommunityGallery";
import SeasonBanner from "@/components/events/SeasonBanner";
import { leaderboardData } from "@/data/mockData";
import { supabase } from "@/lib/supabase";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Events Hub | Wild Gaming Cafe",
  description: "Join the best LAN tournaments in Hyderabad. Compete in Valorant, CS2, BGMI, and more.",
};

export default async function EventsPage() {
  const [
    { data: ongoingData },
    { data: upcomingData },
    { data: recentData },
    { data: archiveData },
    { data: settingsRes }
  ] = await Promise.all([
    supabase.from('events').select('*').in('status', ['Ongoing', 'Registration Open', 'Live']).order('created_at', { ascending: false }).limit(3),
    supabase.from('events').select('*').in('status', ['Upcoming', 'Published']).order('created_at', { ascending: false }).limit(6),
    supabase.from('events').select('*').eq('status', 'Completed').order('created_at', { ascending: false }).limit(4),
    supabase.from('events').select('*').neq('status', 'Trashed').order('created_at', { ascending: false }).limit(10),
    supabase.from('settings').select('cms_data').eq('id', 1).single()
  ]);

  const cmsData = settingsRes?.cms_data || {};

  // Helper to parse rules for display
  const formatEvents = (arr: any[]) => (arr || []).map(event => {
    let extra: any = {};
    try {
      if (event.rules) extra = JSON.parse(event.rules);
    } catch(e) {}
    return { ...event, ...extra, title: event.name };
  });

  const ongoingEvents = formatEvents(ongoingData || []);
  const upcomingEvents = formatEvents(upcomingData || []);
  const recentEvents = formatEvents(recentData || []);
  const initialArchive = formatEvents(archiveData || []);

  return (
    <>
      <HeroSection 
        mediaUrl={cmsData.events_hero?.media_url} 
        alignment={cmsData.events_hero?.alignment}
      />
      <TournamentShowcase 
        ongoing={ongoingEvents}
        upcoming={upcomingEvents}
        recent={recentEvents}
      />
      <PaginatedEventGrid initialEvents={initialArchive} />
      <LeaderboardPreview leaderboard={leaderboardData} />
      {/* <SeasonBanner /> */}
      <HallOfFamePreview />
      <CommunityGallery />
    </>
  );
}
