import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const query = searchParams.get("query") || "";
    const game = searchParams.get("game") || "";
    const status = searchParams.get("status") || ""; // Upcoming vs Past
    const excludeId = searchParams.get("excludeId") || "";

    let supabaseQuery = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .neq('status', 'Trashed');

    // Filters
    if (query) {
      supabaseQuery = supabaseQuery.ilike('name', `%${query}%`);
    }
    if (game && game !== "All") {
      supabaseQuery = supabaseQuery.eq('game', game);
    }
    
    // Status Filter (Assuming status is 'Upcoming', 'Ongoing', 'Completed' etc)
    if (status && status !== "All") {
      if (status === "Upcoming") {
        supabaseQuery = supabaseQuery.in('status', ['Upcoming', 'Published', 'Registration Open']);
      } else if (status === "Past") {
        supabaseQuery = supabaseQuery.eq('status', 'Completed');
      } else {
        supabaseQuery = supabaseQuery.eq('status', status);
      }
    }

    if (excludeId) {
      supabaseQuery = supabaseQuery.neq('id', excludeId);
    }

    // Pagination (0-indexed for Supabase range)
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data, error, count } = await supabaseQuery
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase paginated events error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Parse rules JSON
    const formattedEvents = (data || []).map(event => {
      let extra: any = {};
      try {
        if (event.rules) extra = JSON.parse(event.rules);
      } catch(e) {}
      return { 
        ...event, 
        ...extra,
        title: event.name 
      };
    });

    return NextResponse.json({
      events: formattedEvents,
      total: count || 0,
      page,
      totalPages: count ? Math.ceil(count / limit) : 0,
      hasMore: count ? from + limit < count : false
    });
  } catch (error) {
    console.error("Pagination API error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
