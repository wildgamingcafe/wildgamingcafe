import fs from 'fs';
import path from 'path';

// This utility manages our local JSON database.
// It is structured asynchronously so that replacing these functions 
// with Supabase calls later will not break the application logic.

const dbPath = path.join(process.cwd(), 'local-db.json');

export interface Database {
  events: any[];
  games: any[];
  gallery: any[];
  hallOfFame: any[];
  media: any[];
  settings: any;
  registrations: any[];
  communityMoments: any[];
}

export async function getDB(): Promise<Database> {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    return {
      events: [],
      games: [],
      gallery: [],
      hallOfFame: [],
      media: [],
      settings: {},
      registrations: [],
      communityMoments: [],
      ...parsed
    };
  } catch (error) {
    console.error("Error reading database:", error);
    // Return empty state if file doesn't exist
    return {
      events: [],
      games: [],
      gallery: [],
      hallOfFame: [],
      media: [],
      settings: {},
      registrations: [],
      communityMoments: []
    };
  }
}

export async function saveDB(data: Database): Promise<void> {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error("Error saving database:", error);
    throw new Error("Failed to save data");
  }
}
