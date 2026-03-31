export interface Post {
  id: string;
  title: string;
  series: string;
  episode: string | null;
  voice: string | null;
  word_count: number | null;
  audio_url: string | null;
  cover_image: string | null;
  content: string | null;
  published_at: string | null;
  created_at: string | null;
}

export interface QueueItem {
  id: string;
  title: string;
  series: string;
  voice: string | null;
  audio_url: string | null;
  word_count: number | null;
}
