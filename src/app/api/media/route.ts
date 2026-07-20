import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const db = await getDB();
    // Return all media, frontend can filter out 'Trashed' if needed, or we filter here.
    // Let's return all, so the Trash module can also fetch them from here, or we pass a query param.
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    
    let media = db.media || [];
    if (status) {
      media = media.filter(m => m.status === status);
    }

    return NextResponse.json(media);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
