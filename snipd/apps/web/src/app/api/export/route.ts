import { NextRequest, NextResponse } from "next/server";
import { Snip } from "@snipd/shared";
import { formatDuration, secondsToTimestamp } from "@snipd/shared";

function snipToMarkdown(snip: Snip): string {
  const lines = [
    `# ${snip.title}`,
    "",
    `**Podcast:** ${snip.podcastTitle}`,
    `**Episode:** ${snip.episodeTitle}`,
    `**Time:** ${secondsToTimestamp(snip.startTime)} → ${secondsToTimestamp(snip.endTime)}`,
    `**Duration:** ${formatDuration(snip.endTime - snip.startTime)}`,
    `**Captured:** ${new Date(snip.createdAt).toLocaleDateString()}`,
    "",
  ];

  if (snip.aiSummary) {
    lines.push("## AI Summary", "", snip.aiSummary, "");
  }

  if (snip.transcript) {
    lines.push("## Transcript", "", `> ${snip.transcript}`, "");
  }

  if (snip.note) {
    lines.push("## My Notes", "", snip.note, "");
  }

  if (snip.tags.length > 0) {
    lines.push(`**Tags:** ${snip.tags.map((t) => `#${t}`).join(" ")}`);
  }

  return lines.join("\n");
}

async function exportToNotion(snip: Snip, token: string, databaseId: string) {
  const markdown = snipToMarkdown(snip);
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties: {
        Name: { title: [{ text: { content: snip.title } }] },
        Podcast: { rich_text: [{ text: { content: snip.podcastTitle } }] },
        Episode: { rich_text: [{ text: { content: snip.episodeTitle } }] },
        Tags: { multi_select: snip.tags.map((t) => ({ name: t })) },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: snip.aiSummary || snip.transcript || "" } }],
          },
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Notion error: ${res.status}`);
  return await res.json();
}

async function exportToReadwise(snip: Snip, token: string) {
  const res = await fetch("https://readwise.io/api/v2/highlights/", {
    method: "POST",
    headers: {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      highlights: [{
        text: snip.transcript || snip.aiSummary || snip.title,
        title: `${snip.podcastTitle} — ${snip.episodeTitle}`,
        author: snip.podcastTitle,
        source_type: "podcast",
        category: "podcasts",
        note: snip.note,
        highlighted_at: snip.createdAt,
      }],
    }),
  });
  if (!res.ok) throw new Error(`Readwise error: ${res.status}`);
  return await res.json();
}

export async function POST(req: NextRequest) {
  const { snip, target, config } = await req.json() as {
    snip: Snip;
    target: "notion" | "obsidian" | "readwise" | "markdown";
    config?: { notionToken?: string; notionDatabaseId?: string; readwiseToken?: string };
  };

  try {
    if (target === "markdown" || target === "obsidian") {
      const md = snipToMarkdown(snip);
      return NextResponse.json({ content: md, filename: `${snip.title.replace(/[^a-z0-9]/gi, "-")}.md` });
    }

    if (target === "notion") {
      const token = config?.notionToken || process.env.NOTION_TOKEN;
      const dbId = config?.notionDatabaseId || process.env.NOTION_DATABASE_ID;
      if (!token || !dbId) return NextResponse.json({ error: "Notion token and database ID required" }, { status: 400 });
      const result = await exportToNotion(snip, token, dbId);
      return NextResponse.json({ url: result.url });
    }

    if (target === "readwise") {
      const token = config?.readwiseToken || process.env.READWISE_TOKEN;
      if (!token) return NextResponse.json({ error: "Readwise token required" }, { status: 400 });
      await exportToReadwise(snip, token);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown export target" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
