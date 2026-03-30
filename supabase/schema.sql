create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  series text,
  episode text,
  voice text,
  audio_url text,
  cover_image text,
  word_count integer,
  status text default 'draft',
  published_at timestamptz,
  created_at timestamptz default now()
);
