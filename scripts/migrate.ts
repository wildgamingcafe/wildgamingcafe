import { createClient } from '@supabase/supabase-js';
import { gamesData } from '../src/data/gameLibraryData';
import { tournamentsData, galleryImages } from '../src/data/mockData';

// Load environment variables manually since we are running outside Next.js
const supabaseUrl = 'https://xvsxuauhmmkjirmyhsyz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2c3h1YXVobW1ramlybXloc3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5Nzg2MDksImV4cCI6MjA5NjU1NDYwOX0.9o_ugKizYuuBSU9Ycg0WMEUUl5E2WwkjROwjzoWtKLQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateGames() {
  console.log(`Migrating ${gamesData.length} games...`);
  const formattedGames = gamesData.map(game => ({
    title: game.title,
    genre: game.genres.join(', '),
    platform: game.platforms.join(', '),
    image_url: game.coverImage,
    featured: game.featured || false,
    status: game.available ? 'Active' : 'Inactive'
  }));

  const { error } = await supabase.from('games').insert(formattedGames);
  if (error) console.error("Error migrating games:", error.message);
  else console.log("Games migrated successfully!");
}

async function migrateEvents() {
  console.log(`Migrating ${tournamentsData.length} events...`);
  const formattedEvents = tournamentsData.map(event => ({
    name: event.title,
    date: new Date().toISOString(), // Mocking current date since 'Completed' is string in local data
    prize_pool: event.prizePool,
    game: event.game,
    status: event.status,
    image_url: event.image
  }));

  const { error } = await supabase.from('events').insert(formattedEvents);
  if (error) console.error("Error migrating events:", error.message);
  else console.log("Events migrated successfully!");
}

async function migrateGallery() {
  console.log(`Migrating ${galleryImages.length} gallery images...`);
  const formattedGallery = galleryImages.map(img => ({
    image_url: img
  }));

  const { error } = await supabase.from('gallery').insert(formattedGallery);
  if (error) console.error("Error migrating gallery:", error.message);
  else console.log("Gallery migrated successfully!");
}

async function run() {
  console.log("Starting Supabase Migration...");
  await migrateGames();
  await migrateEvents();
  await migrateGallery();
  console.log("Migration Complete!");
}

run();
