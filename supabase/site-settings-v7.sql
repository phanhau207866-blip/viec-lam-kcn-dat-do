-- V7: Cấu hình ảnh bìa trang chủ từ Admin.
-- Chạy toàn bộ file này MỘT LẦN trong Supabase SQL Editor.

create table if not exists public.site_settings (
  id text primary key,
  hero_image_url text,
  updated_at timestamptz default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "public can read site settings" on public.site_settings;
drop policy if exists "authenticated can insert site settings" on public.site_settings;
drop policy if exists "authenticated can update site settings" on public.site_settings;

create policy "public can read site settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "authenticated can insert site settings"
on public.site_settings for insert
to authenticated
with check (true);

create policy "authenticated can update site settings"
on public.site_settings for update
to authenticated
using (true)
with check (true);

insert into public.site_settings (id, hero_image_url)
values ('home', '/media/hero-workers-clean.jpg')
on conflict (id) do nothing;
