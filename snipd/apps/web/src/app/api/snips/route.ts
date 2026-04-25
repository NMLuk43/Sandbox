import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    episodeId, episodeTitle, podcastTitle, podcastImageUrl,
    audioUrl, startTime, endTime, title, note, transcript, aiSummary, tags,
  } = body;

  const { data, error } = await supabaseAdmin
    .from("snips")
    .insert({
      episode_id: episodeId,
      episode_title: episodeTitle,
      podcast_title: podcastTitle,
      podcast_image_url: podcastImageUrl,
      audio_url: audioUrl,
      start_time: startTime,
      end_time: endTime,
      title,
      note,
      transcript,
      ai_summary: aiSummary,
      tags,
      user_id: "anonymous",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ snip: data });
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("snips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ snips: data ?? [] });
}
