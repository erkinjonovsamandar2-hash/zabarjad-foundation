-- Enable Supabase Realtime for new_books so DataContext subscriptions fire
-- on INSERT / UPDATE / DELETE without polling.
alter publication supabase_realtime add table new_books;
