-- Add description and books fields to author_spotlights
ALTER TABLE public.author_spotlights
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS books       TEXT;
