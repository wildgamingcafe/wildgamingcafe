import { Metadata } from "next";
import HeroSection from "@/components/events/HeroSection";
import FeaturedTournament from "@/components/events/FeaturedTournament";
import UpcomingTournaments from "@/components/events/UpcomingTournaments";
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
  const [{ data: events, error }, { data: settingsRes }] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .neq('status', 'Trashed')
      .order('created_at', { ascending: false }),
    supabase.from('settings').select('cms_data').eq('id', 1).single()
  ]);

  const cmsData = settingsRes?.cms_data || {};

  if (error) {
    console.error("Failed to fetch events:", error);
  }

  const activeEvents = (events || []).map(event => {
    let extra: any = {};
    try {
      if (event.rules) extra = JSON.parse(event.rules);
    } catch(e) {}
    // Map DB fields to the expected component format
    return { 
      ...event, 
      ...extra,
      title: event.name 
    };
  });

  // Find the featured event (first one that has is_featured = true)
  const featuredEvent = activeEvents.find(t => t.is_featured) || activeEvents[0];
  
  // All other events
  const upcomingEvents = activeEvents.filter(t => t.id !== featuredEvent?.id);

  return (
    <>
      <HeroSection 
        mediaUrl={cmsData.events_hero?.media_url} 
        alignment={cmsData.events_hero?.alignment}
      />
      {featuredEvent && <FeaturedTournament tournament={featuredEvent} />}
      {upcomingEvents.length > 0 && <UpcomingTournaments tournaments={upcomingEvents} />}
      <LeaderboardPreview leaderboard={leaderboardData} />
      {/* <SeasonBanner /> */}
      <HallOfFamePreview />
      <CommunityGallery />
    </>
  );
}
