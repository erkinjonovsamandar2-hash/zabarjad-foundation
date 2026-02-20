
-- Books table
CREATE TABLE public.books (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT DEFAULT '',
  description TEXT DEFAULT '',
  price INTEGER DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'Yangi Nashrlar',
  bg_color TEXT DEFAULT '210 60% 15%',
  enable_3d_flip BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Articles table
CREATE TABLE public.articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT DEFAULT '',
  content TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quiz config table (single row)
CREATE TABLE public.quiz_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  config JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_config ENABLE ROW LEVEL SECURITY;

-- Public read policies (frontend needs to read)
CREATE POLICY "Anyone can read books" ON public.books FOR SELECT USING (true);
CREATE POLICY "Anyone can read articles" ON public.articles FOR SELECT USING (true);
CREATE POLICY "Anyone can read quiz config" ON public.quiz_config FOR SELECT USING (true);

-- Admin write policies (for now allow authenticated users, will tighten with roles later)
CREATE POLICY "Authenticated users can insert books" ON public.books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update books" ON public.books FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete books" ON public.books FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update articles" ON public.articles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete articles" ON public.articles FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert quiz config" ON public.quiz_config FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update quiz config" ON public.quiz_config FOR UPDATE TO authenticated USING (true);

-- Storage bucket for media
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

CREATE POLICY "Anyone can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media');
CREATE POLICY "Authenticated users can update media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media');
CREATE POLICY "Authenticated users can delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media');

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quiz_config_updated_at BEFORE UPDATE ON public.quiz_config FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial books
INSERT INTO public.books (title, author, description, price, category, bg_color, enable_3d_flip, featured, sort_order) VALUES
  ('Muz va Olov Qo''shig''i', 'Jorj R.R. Martin', 'Epik fantezi seriyasi', 89000, 'Yangi Nashrlar', '210 60% 15%', true, true, 1),
  ('Hobbit', 'J.R.R. Tolkien', 'Klassik fantezi sarguzasht', 65000, 'Oltin Kolleksiya', '120 40% 12%', true, true, 2),
  ('1984', 'Jorj Oruell', 'Distopik roman', 55000, 'Oltin Kolleksiya', '0 30% 14%', true, true, 3),
  ('Duna', 'Frank Herbert', 'Ilmiy-fantastika shoh asari', 95000, 'Tez Kunda', '35 50% 13%', true, true, 4),
  ('Xarri Potter', 'J.K. Rouling', 'Sehr va sarguzasht dunyosi', 75000, 'Yangi Nashrlar', '270 40% 14%', true, true, 5),
  ('Narnia Kundaliklari', 'K.S. Lyuis', 'Bolalar uchun fantezi', 60000, 'Tez Kunda', '180 30% 12%', false, false, 6),
  ('Ender O''yini', 'Orson Skott Kard', 'Kosmik strategiya', 70000, 'Yangi Nashrlar', '200 40% 14%', false, false, 7),
  ('Witcher', 'Andrzej Sapkovski', 'Qorong''u fantezi', 85000, 'Oltin Kolleksiya', '150 30% 10%', true, false, 8),
  ('Yulduzlar Urushi', 'Timothy Zan', 'Kosmik opera', 78000, 'Tez Kunda', '220 50% 12%', false, false, 9),
  ('Asoslar', 'Ayzek Azimov', 'Ilmiy-fantastika klassikasi', 72000, 'Oltin Kolleksiya', '45 30% 12%', true, false, 10);

-- Seed initial articles
INSERT INTO public.articles (title, excerpt, date, published) VALUES
  ('Fantastika janrining kelajagi', 'O''zbek adabiyotida fantastika qanday rivojlanmoqda?', '2026-02-15', true),
  ('Martin va uning olami', 'Muz va Olov Qo''shig''i seriyasining yaratilish tarixi.', '2026-02-10', true),
  ('Tarjima san''ati', 'Zabarjad Media tarjima jarayoniga qanday yondashadi.', '2026-02-05', true),
  ('Eng ko''p o''qilgan 5 kitob', '2026-yil yanvar oyida eng mashhur kitoblar ro''yxati.', '2026-01-28', true),
  ('Fantastik dunyo yaratish', 'Yozuvchilar qanday qilib o''z olamlarini qurishadi?', '2026-01-20', true),
  ('Kitobxonlar uchun tavsiyalar', 'Qish oqshomlari uchun eng yaxshi kitoblar tanlovi.', '2026-01-15', true);
