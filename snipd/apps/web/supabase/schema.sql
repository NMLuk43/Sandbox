-- Snipd custom app — Supabase schema
-- Run this in your Supabase SQL editor

create extension if not exists "uuid-ossp";

-- Subscribed podcasts
create table if not exists podcasts (
  id text primary key,
  user_id text not null default 'anonymous',
  title text not null,
  author text,
  description text,
  image_url text,
  feed_url text not null,
  categories text[] default '{}',
  episode_count int,
  subscribed_at timestamptz default now()
);

-- Episode playback progress
create table if not exists episode_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null default 'anonymous',
  episode_id text not null,
  podcast_id text not null,
  playback_position float default 0,
  duration float default 0,
  is_completed boolean default false,
  updated_at timestamptz default now(),
  unique(user_id, episode_id)
);

-- Snips
create table if not exists snips (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null default 'anonymous',
  episode_id text not null,
  episode_title text not null,
  podcast_title text not null,
  podcast_image_url text,
  audio_url text not null,
  start_time float not null,
  end_time float not null,
  title text not null,
  note text,
  transcript text,
  ai_summary text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists snips_user_id_idx on snips(user_id);
create index if not exists snips_created_at_idx on snips(created_at desc);
create index if not exists episode_progress_user_idx on episode_progress(user_id, episode_id);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger snips_updated_at
  before update on snips
  for each row execute function update_updated_at();
