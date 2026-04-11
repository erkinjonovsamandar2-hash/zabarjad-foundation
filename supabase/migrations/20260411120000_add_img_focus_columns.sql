-- Add focal point columns to books table for image object-position control
alter table books
  add column if not exists img_focus_x numeric default 50,
  add column if not exists img_focus_y numeric default 20;
