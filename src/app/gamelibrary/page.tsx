import LibraryHero from "@/components/gamelibrary/LibraryHero";
import GenreNav from "@/components/gamelibrary/GenreNav";
import InfiniteGameRow from "@/components/gamelibrary/InfiniteGameRow";
import GameRequests from "@/components/gaminglounge/GameRequests";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Always fetch fresh data

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
        
        {/* Center Content */}
        <div className="w-full overflow-x-hidden">
          {/* Featured Section */}
          {featuredGames.length > 0 && (
            <InfiniteGameRow 
              id="featured" 
              title="Featured Games" 
              games={featuredGames.map(g => ({
                id: g.id,
                title: g.title,
                genre: g.genre,
                platforms: g.platform.split(',').map((p: string) => p.trim()),
                coverImage: g.image_url,
                bgImage: g.image_url
              }))} 
            />
          )}

          {/* Genre Rows */}
          {uniqueGenres.map((genre) => {
            const rowGames = gamesByGenre[genre];
            if (!rowGames || rowGames.length === 0) return null;
            
            return (
              <InfiniteGameRow 
                key={genre}
                id={`genre-${genre.toLowerCase().replace(/\s+/g, '-')}`}
                title={genre}
                games={rowGames.map(g => ({
                  id: g.id,
                  title: g.title,
                  genre: g.genre,
                  platforms: g.platform.split(',').map((p: string) => p.trim()),
                  coverImage: g.image_url,
                  bgImage: g.image_url
                }))}
              />
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
