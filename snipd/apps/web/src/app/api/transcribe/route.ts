import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Readable } from "stream";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { audioUrl, startTime, endTime } = await req.json();

  if (!audioUrl) return NextResponse.json({ error: "audioUrl required" }, { status: 400 });

  try {
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) throw new Error("Failed to fetch audio");

    const buffer = await audioRes.arrayBuffer();
    const uint8 = new Uint8Array(buffer);

    const file = new File([uint8], "audio.mp3", { type: "audio/mpeg" });

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    let text = transcription.text;

    if (startTime !== undefined && endTime !== undefined && "segments" in transcription) {
      const segments = (transcription as { segments?: { start: number; end: number; text: string }[] }).segments ?? [];
      const filtered = segments
        .filter((s) => s.end >= startTime && s.start <= endTime)
        .map((s) => s.text)
        .join(" ")
        .trim();
      if (filtered) text = filtered;
    }

    return NextResponse.json({ transcript: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcription failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
