-- ── Team Members (Jamoa section on /team) ────────────────────────────────────
CREATE TABLE public.team_members (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  role        text        NOT NULL,
  image_url   text,
  is_founder  boolean     NOT NULL DEFAULT false,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members_public_read"
  ON public.team_members FOR SELECT USING (true);

CREATE POLICY "team_members_authed_write"
  ON public.team_members FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── Seed: existing hardcoded data ─────────────────────────────────────────────
INSERT INTO public.team_members (name, role, image_url, is_founder, sort_order) VALUES
  ('Akbar Toshtemirov',  'Muharrir',          'https://pngimg.com/d/businessman_PNG6565.png', true,  1),
  ('Jamoa A''zosi',      'Musahhih',          'https://pngimg.com/d/businessman_PNG6565.png', false, 2),
  ('Jamoa A''zosi',      'Badiiy muharrir',   'https://pngimg.com/d/businessman_PNG6571.png', false, 3),
  ('Jamoa A''zosi',      'Muqova Dizayneri',  'https://pngimg.com/d/businessman_PNG6576.png', false, 4),
  ('Jamoa A''zosi',      'Sahifalovchi',      'https://pngimg.com/d/businessman_PNG6565.png', false, 5),
  ('Jamoa A''zosi',      'Tarjimon',          'https://pngimg.com/d/businessman_PNG6571.png', false, 6);

-- ── Author / Translator Spotlight (marquee on /team bottom) ──────────────────
CREATE TABLE public.author_spotlights (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  role        text        NOT NULL CHECK (role IN ('MUALLIF','TARJIMON')),
  image_url   text,
  sort_order  int         NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.author_spotlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "author_spotlights_public_read"
  ON public.author_spotlights FOR SELECT USING (true);

CREATE POLICY "author_spotlights_authed_write"
  ON public.author_spotlights FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ── Seed: existing hardcoded AUTHORS data ─────────────────────────────────────
INSERT INTO public.author_spotlights (name, role, image_url, sort_order) VALUES
  ('Abdulla Qodiriy',        'MUALLIF',  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 1),
  ('Nurbek Alimov',          'TARJIMON', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 2),
  ('Mixail Bulgakov',        'MUALLIF',  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 3),
  ('Sirojuddin To''laganov', 'TARJIMON', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 4),
  ('Fyodor Dostoyevskiy',    'MUALLIF',  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 5),
  ('Genki Kavamura',         'MUALLIF',  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 6),
  ('Aleksandr Dyuma',        'MUALLIF',  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', 7);
