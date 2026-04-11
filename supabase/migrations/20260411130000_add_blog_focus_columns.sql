-- Add dual focal-point columns to blog_posts for device-specific image crops
alter table blog_posts
  add column if not exists focus_desktop_x numeric default 50,
  add column if not exists focus_desktop_y numeric default 50,
  add column if not exists focus_mobile_x  numeric default 50,
  add column if not exists focus_mobile_y  numeric default 50;
