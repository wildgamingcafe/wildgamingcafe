import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("game_requests")
    .select("*")
    .order("likes", { ascending: false })
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ requests: data || [] });
}

export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const cleanTitle = title.trim();

    // Check if the game already exists (case-insensitive)
    // Supabase ilike is case-insensitive
    const { data: existing, error: existError } = await supabase
      .from("game_requests")
      .select("*")
      .ilike("title", cleanTitle)
      .single();

    if (existing) {
      // If exists, just increment likes
      const { data, error } = await supabase
        .from("game_requests")
        .update({ likes: existing.likes + 1 })
        .eq("id", existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return NextResponse.json({ request: data });
    }

    // Check limit
    const { count, error: countError } = await supabase
      .from("game_requests")
      .select("*", { count: "exact", head: true });

    if (countError) throw countError;

    if (count !== null && count >= 5) {
      return NextResponse.json(
        { error: "Limit reached. Please DM support." },
        { status: 403 }
      );
    }

    const { data, error } = await supabase
      .from("game_requests")
      .insert([{ title: cleanTitle, likes: 1 }])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ request: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
