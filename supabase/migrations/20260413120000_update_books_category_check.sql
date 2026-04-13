-- Drop old category check constraint and replace with new categories
ALTER TABLE public.books
  DROP CONSTRAINT IF EXISTS books_category_check;

ALTER TABLE public.books
  ADD CONSTRAINT books_category_check
  CHECK (category IN (
    'new',
    'soon',
    'gold',
    'jahon',
    'ilmiy',
    'amir-temur',
    'erkin-millat'
  ));
