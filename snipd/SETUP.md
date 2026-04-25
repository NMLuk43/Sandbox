# Snipd — Setup Guide

## Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Accounts for: Supabase, OpenAI, Anthropic, Podcast Index

---

## 1. Install dependencies

```bash
cd snipd
pnpm install
```

---

## 2. Get your API keys

### Supabase (database + auth)
1. Go to [supabase.com](https://supabase.com) → New project
2. Copy **Project URL** and **anon key** from Settings → API
3. Copy the **service_role key** from the same page
4. In the SQL editor, paste and run the contents of `apps/web/supabase/schema.sql`

### Podcast Index (podcast search — free)
1. Go to [podcastindex.org](https://podcastindex.org) → API Access
2. Register for a free account → get your **API Key** and **API Secret**

### OpenAI (Whisper transcription)
1. Go to [platform.openai.com](https://platform.openai.com) → API Keys
2. Create a new secret key
3. Whisper costs ~$0.006/minute of audio

### Anthropic (Claude AI summaries)
1. Go to [console.anthropic.com](https://console.anthropic.com) → API Keys
2. Create a new key
3. Summaries use claude-sonnet-4-6 (~$0.003 per summary)

### Notion (optional export)
1. Go to [notion.so/my-integrations](https://notion.so/my-integrations)
2. Create a new integration → copy the **Internal Integration Token**
3. Create a database in Notion, open it, copy the ID from the URL (the 32-char string after the last `/`)
4. Share the database with your integration

### Readwise (optional export)
1. Go to [readwise.io/access_token](https://readwise.io/access_token)
2. Copy your token

---

## 3. Configure environment variables

```bash
cd apps/web
cp .env.example .env.local
```

Fill in your keys in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
SUPABASE_SERVICE_ROLE_KEY=eyJh...

PODCAST_INDEX_API_KEY=your-key
PODCAST_INDEX_API_SECRET=your-secret

OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=your-db-id
READWISE_TOKEN=your-token
```

---

## 4. Run the web app

```bash
cd snipd
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 5. Run the iOS app

```bash
cd apps/mobile
pnpm start
# Press 'i' to open in iOS simulator
# Or scan the QR code with Expo Go on your iPhone
```

> **Important:** Update `apps/mobile/app.json` → `extra.apiBaseUrl` to your
> web app's URL. For local dev, use your machine's LAN IP (e.g. `http://192.168.1.x:3000`)
> because the simulator can't reach `localhost` on your Mac.

---

## Architecture

```
snipd/
├── apps/
│   ├── web/          # Next.js 14 — web app + all API routes
│   └── mobile/       # Expo (React Native) — iOS app
└── packages/
    └── shared/       # Shared TypeScript types + utilities
```

The iOS app calls the same API routes as the web app — no duplicated backend logic.

---

## Feature overview

| Feature | Web | iOS |
|---|---|---|
| Podcast search | ✅ | ✅ |
| RSS episode list | ✅ | ✅ |
| Audio playback | ✅ | ✅ |
| Snip / clip capture | ✅ | ✅ |
| AI transcription (Whisper) | ✅ | ✅ |
| AI summary (Claude) | ✅ | ✅ |
| Snip notes & tags | ✅ | ✅ |
| Export: Markdown | ✅ | — |
| Export: Notion | ✅ | — |
| Export: Readwise | ✅ | — |
| Export: Obsidian | ✅ | — |
| Background audio | — | ✅ |
| Haptic feedback | — | ✅ |
