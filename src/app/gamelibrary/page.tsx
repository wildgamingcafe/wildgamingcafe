import LibraryHero from "@/components/gamelibrary/LibraryHero";
import GenreNav from "@/components/gamelibrary/GenreNav";
import CoverFlowFeatured from "@/components/gamelibrary/CoverFlowFeatured";
import MasonryGameGrid from "@/components/gamelibrary/MasonryGameGrid";
import GameRequests from "@/components/gaminglounge/GameRequests";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Cache for 60 seconds (massive speed boost)

export const metadata = {
  title: "Game Library | Wild Gaming Cafe",
  description: "Explore our massive collection of PC and PS5 games available at Wild Gaming Cafe.",
};

export default async function GameLibraryPage() {
  const [{ data: games, error }, { data: settingsRes }] = await Promise.all([
    supabase
      .from('games')
      .select('*')
      .neq('status', 'Trashed')
      .order('title', { ascending: true }),
    supabase.from('settings').select('cms_data').eq('id', 1).single()
  ]);

  const cmsData = settingsRes?.cms_data || {};

  if (error) {
    console.error("Failed to fetch games for public library", error);
  }

  const allGames = games || [];

  // Categorize Games
  const featuredGames = allGames.filter(game => game.is_featured);
  
  // Extract all unique genres
  const uniqueGenres = Array.from(new Set(allGames.map(g => g.genre))).filter(Boolean) as string[];

  // Group games by genre
  const gamesByGenre: Record<string, any[]> = {};
  uniqueGenres.forEach(genre => {
    gamesByGenre[genre] = allGames.filter(g => g.genre === genre);
  });

  return (
    <main className="min-h-screen bg-[#050505]">
      
      <LibraryHero 
        mediaUrl={cmsData.gamelibrary_hero?.media_url} 
        alignment={cmsData.gamelibrary_hero?.alignment}
      />
      <GenreNav genres={uniqueGenres} />
      
      {/* Main Layout (Banners Removed) */}
      <div className="w-full relative">
        
        <div className="w-full overflow-x-hidden container mx-auto px-4 md:px-8 mt-12">
          {/* Featured Section */}
          {featuredGames.length > 0 && (
            <div id="featured">
              <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 border-l-4 border-accent pl-4 text-white">
                Featured Games
              </h2>
              <CoverFlowFeatured 
                games={featuredGames.map(g => ({
                  id: g.id,
                  title: g.title,
                  genre: g.genre,
                  platforms: g.platform.split(',').map((p: string) => p.trim()),
                  coverImage: g.image_url,
                  bgImage: g.image_url
                }))} 
              />
            </div>
          )}

          {/* Genre Rows */}
          {uniqueGenres.map((genre) => {
            const rowGames = gamesByGenre[genre];
            if (!rowGames || rowGames.length === 0) return null;
            
            return (
              <div id={`genre-${genre.toLowerCase().replace(/\s+/g, '-')}`} key={genre}>
                <MasonryGameGrid 
                  genre={genre}
                  games={rowGames.map(g => ({
                    id: g.id,
                    title: g.title,
                    genre: g.genre,
                    platforms: g.platform.split(',').map((p: string) => p.trim()),
                    coverImage: g.image_url,
                    bgImage: g.image_url
                  }))}
                />
              </div>
            );
          })}

          <div className="py-24">
            <GameRequests />
          </div>
        </div>
      </div>
      
    </main>
  );
}
