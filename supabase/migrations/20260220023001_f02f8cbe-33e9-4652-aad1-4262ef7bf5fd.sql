
-- Add multilingual columns to books
ALTER TABLE public.books
  ADD COLUMN IF NOT EXISTS title_ru text DEFAULT '',
  ADD COLUMN IF NOT EXISTS title_en text DEFAULT '',
  ADD COLUMN IF NOT EXISTS author_ru text DEFAULT '',
  ADD COLUMN IF NOT EXISTS author_en text DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_ru text DEFAULT '',
  ADD COLUMN IF NOT EXISTS description_en text DEFAULT '';

-- Add multilingual columns to articles
ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS title_ru text DEFAULT '',
  ADD COLUMN IF NOT EXISTS title_en text DEFAULT '',
  ADD COLUMN IF NOT EXISTS excerpt_ru text DEFAULT '',
  ADD COLUMN IF NOT EXISTS excerpt_en text DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_ru text DEFAULT '',
  ADD COLUMN IF NOT EXISTS content_en text DEFAULT '';
