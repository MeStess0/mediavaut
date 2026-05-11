-- ============================================================
-- MediaVault — Supabase SQL Schema
-- ============================================================
-- Run this entire file in the Supabase SQL Editor:
-- https://supabase.com → SQL Editor → New Query → paste → Run
-- ============================================================

-- ── 1. Users (public profile) ────────────────────────────────
-- Supabase manages authentication in auth.users.
-- This table stores the public profile data.
create table if not exists public.users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text unique not null,
  username     text unique not null,
  avatar_url   text,
  bio          text,
  birth_date   date,
  preferences  jsonb default '{}'::jsonb,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── 2. Media (external API cache) ────────────────────────────
-- Stores data fetched from external APIs.
-- The ID is composite: "<type>-<external_id>", e.g. "anime-16498"
create table if not exists public.media (
  id           text primary key,           -- e.g. "anime-16498"
  type         text not null,              -- anime | manga | film | serie_tv | libro
  external_id  text not null,
  title        text not null,
  cover_url    text,
  synopsis     text,
  extra_data   jsonb default '{}'::jsonb,  -- score, genres, episodes, etc.
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── 3. Tracked Media (user's personal library entries) ────────
create table if not exists public.tracked_media (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id)  on delete cascade,
  media_id   text not null references public.media(id)  on delete cascade,
  status     text not null default 'planned'            -- watching | completed | planned | dropped
               check (status in ('watching', 'completed', 'planned', 'dropped')),
  progress   int  not null default 0,
  rating     numeric(3,1) check (rating >= 1 and rating <= 10),
  review     text,
  is_favorite boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, media_id)                            -- one entry per user per media
);

-- ── 4. User Tags (custom tags for library entries) ────────────
create table if not exists public.user_tags (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  name       text not null,
  created_at timestamptz default now(),
  unique (user_id, name)
);

-- ── 5. Tag assignments ────────────────────────────────────────
create table if not exists public.tracked_media_tags (
  tracked_media_id uuid references public.tracked_media(id) on delete cascade,
  tag_id           uuid references public.user_tags(id)     on delete cascade,
  primary key (tracked_media_id, tag_id)
);

-- ── 6. Follows ────────────────────────────────────────────────
create table if not exists public.follows (
  follower_id uuid references public.users(id) on delete cascade,
  following_id uuid references public.users(id) on delete cascade,
  created_at  timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)           -- can't follow yourself
);

-- ── Auto-update updated_at trigger ───────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace trigger set_users_updated_at
  before update on public.users
  for each row execute function update_updated_at();

create or replace trigger set_media_updated_at
  before update on public.media
  for each row execute function update_updated_at();

create or replace trigger set_tracked_updated_at
  before update on public.tracked_media
  for each row execute function update_updated_at();

-- ── Row Level Security (RLS) ──────────────────────────────────
-- RLS ensures users can only read/write their own data.

alter table public.users         enable row level security;
alter table public.tracked_media enable row level security;
alter table public.user_tags     enable row level security;
alter table public.tracked_media_tags enable row level security;
alter table public.follows       enable row level security;
alter table public.media         enable row level security;

-- Users: anyone can read public profiles, only owner can update
create policy "Public profiles are readable"
  on public.users for select using (true);

create policy "Users can update their own profile"
  on public.users for update using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.users for insert with check (auth.uid() = id);

-- Media cache: anyone can read, logged-in users can insert/update
create policy "Anyone can read media"
  on public.media for select using (true);

create policy "Logged-in users can upsert media"
  on public.media for insert with check (auth.uid() is not null);

create policy "Logged-in users can update media"
  on public.media for update using (auth.uid() is not null);

-- Tracked media: users can read their own + public profiles' entries
create policy "Users can read own tracked media"
  on public.tracked_media for select using (auth.uid() = user_id);

create policy "Users can insert their own tracked media"
  on public.tracked_media for insert with check (auth.uid() = user_id);

create policy "Users can update their own tracked media"
  on public.tracked_media for update using (auth.uid() = user_id);

create policy "Users can delete their own tracked media"
  on public.tracked_media for delete using (auth.uid() = user_id);

-- User tags
create policy "Users manage their own tags"
  on public.user_tags for all using (auth.uid() = user_id);

-- Follows: anyone can read, only owner can insert/delete
create policy "Follows are readable"
  on public.follows for select using (true);

create policy "Users manage their own follows"
  on public.follows for insert with check (auth.uid() = follower_id);

create policy "Users can delete their own follows"
  on public.follows for delete using (auth.uid() = follower_id);
