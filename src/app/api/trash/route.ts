import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = await getDB();
    
    // Flatten all trashed items from supported collections
    const collections = ["events", "games", "gallery", "hallOfFame", "media"];
    let trashedItems: any[] = [];

    collections.forEach((col) => {
      const data = db[col as keyof typeof db] as any[];
      if (Array.isArray(data)) {
        const trashed = data
          .filter(item => item.status === "Trashed")
          .map(item => ({ ...item, _collection: col })); // attach collection name for frontend UI
        trashedItems = [...trashedItems, ...trashed];
      }
    });

    // Sort by created/deleted date if available, or just return
    return NextResponse.json(trashedItems);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trash" }, { status: 500 });
  }
}
