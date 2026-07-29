import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import LoungeHero from "@/components/gaminglounge/HeroSection";
import WhyWild from "@/components/gaminglounge/WhyWild";
import GameLibrary from "@/components/gaminglounge/GameLibrary";
import PricingSection from "@/components/gaminglounge/PricingSection";
import GamingZones from "@/components/gaminglounge/GamingZones";
import HardwareSpecs from "@/components/gaminglounge/HardwareSpecs";
import TournamentsCommunity from "@/components/gaminglounge/TournamentsCommunity";
import LoungeGallery from "@/components/gaminglounge/LoungeGallery";
import FAQ from "@/components/gaminglounge/FAQ";
import FinalCTA from "@/components/gaminglounge/FinalCTA";
import { getDB } from "@/lib/db";

export const metadata: Metadata = {
  title: "Wild Gaming Cafe | Hyderabad's Premium Gaming Lounge",
  description:
    "Hyderabad's premier gaming lounge. 20 high-performance PCs, PS5 Arena, 1 Gbps fiber internet, weekly tournaments and a competitive gaming community.",
  openGraph: {
    title: "Wild Gaming Cafe | Hyderabad's Premium Gaming Lounge",
    description: "Hyderabad's premier gaming lounge. 20 high-performance PCs, PS5 Arena, 1 Gbps fiber internet, weekly tournaments and a competitive gaming community.",
    url: "https://wildgamingcafe.com",
  },
  alternates: {
    canonical: "/",
  },
};

export const revalidate = 60; // Cache for 60 seconds (massive speed boost)

export default async function Home() {
  const [gamesRes, settingsRes, localDb] = await Promise.all([
    supabase.from('games').select('*').neq('status', 'Trashed'),
    supabase.from('settings').select('cms_data').eq('id', 1).single(),
    getDB()
  ]);
  
  const activeGames = gamesRes.data || [];
  const cmsData = settingsRes.data?.cms_data || { hero: {}, hardware: {}, pricing: {}, faq: {} };
  const activeGalleryDb = localDb.gallery?.filter((g: any) => g.status !== 'Trashed').map((g: any) => g.url) || [];
  const galleryImages = activeGalleryDb.length > 0 ? activeGalleryDb : (cmsData.gallery || []);

  const dynamicFaqItems = cmsData.faq?.q1 ? [
    { question: cmsData.faq.q1, answer: cmsData.faq.a1 },
    { question: cmsData.faq.q2, answer: cmsData.faq.a2 },
    { question: cmsData.faq.q3, answer: cmsData.faq.a3 },
    { question: cmsData.faq.q4, answer: cmsData.faq.a4 },
    { question: cmsData.faq.q5, answer: cmsData.faq.a5 },
  ] : undefined;

  return (
    <main>
      <LoungeHero data={cmsData.hero} />
      <WhyWild />
      <GameLibrary games={activeGames} />
      <PricingSection data={cmsData.pricing} />
      <GamingZones data={cmsData.zones} />
      <HardwareSpecs data={cmsData.hardware} />
      <TournamentsCommunity data={cmsData.community} />
      <LoungeGallery data={galleryImages} />
      <FAQ items={dynamicFaqItems} />
      <FinalCTA />
    </main>
  );
}
