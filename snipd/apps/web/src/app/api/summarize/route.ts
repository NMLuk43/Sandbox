import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { transcript, episodeTitle, podcastTitle } = await req.json();

  if (!transcript) return NextResponse.json({ error: "transcript required" }, { status: 400 });

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 400,
      system: `You are an expert podcast knowledge assistant. Given a transcript excerpt from a podcast, create a concise, insightful summary (2-4 sentences) that captures the key idea or insight. Be direct and informative. Focus on the core takeaway.`,
      messages: [
        {
          role: "user",
          content: `Podcast: "${podcastTitle}"\nEpisode: "${episodeTitle}"\n\nTranscript excerpt:\n${transcript}\n\nWrite a concise summary of the key insight from this excerpt.`,
        },
      ],
    });

    const summary = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ summary });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Summarization failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
