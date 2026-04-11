-- Dedicated table for upcoming/new-release books shown in YangiNashrlar carousel
create table if not exists new_books (
  id             uuid primary key default gen_random_uuid(),
  title          text not null,
  title_en       text,
  title_ru       text,
  author         text not null default '',
  author_en      text,
  author_ru      text,
  description    text,
  description_en text,
  description_ru text,
  cover_url      text,
  bg_color       text,
  category       text not null default 'soon',
  price          numeric,
  enable_3d_flip boolean default false,
  featured       boolean default false,
  sort_order     integer default 0,
  img_focus_x    numeric default 50,
  img_focus_y    numeric default 20,
  -- Dual device focal points
  focus_desktop_x numeric default 50,
  focus_desktop_y numeric default 50,
  focus_mobile_x  numeric default 50,
  focus_mobile_y  numeric default 50,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Keep updated_at in sync
create or replace function update_new_books_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trg_new_books_updated_at
  before update on new_books
  for each row execute function update_new_books_updated_at();

-- RLS: public read, authenticated write
alter table new_books enable row level security;
create policy "new_books_public_read"  on new_books for select using (true);
create policy "new_books_authed_write" on new_books for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
