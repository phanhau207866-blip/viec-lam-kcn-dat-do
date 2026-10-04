-- V6: Upload logo + ảnh tuyển dụng từ Admin, lưu trên Supabase Storage.
-- Chạy toàn bộ file này MỘT LẦN trong Supabase SQL Editor.

-- 1) Thêm cột logo cho bảng jobs.
alter table public.jobs
add column if not exists logo_url text;

-- 2) Tạo bucket công khai để website có thể hiển thị logo/ảnh đã upload.
insert into storage.buckets (id, name, public)
values ('job-media', 'job-media', true)
on conflict (id) do update set public = true;

-- 3) Policy Storage: mọi người được xem ảnh, chỉ Admin đã đăng nhập mới upload/sửa/xóa.
drop policy if exists "public can view job media" on storage.objects;
drop policy if exists "authenticated can upload job media" on storage.objects;
drop policy if exists "authenticated can update job media" on storage.objects;
drop policy if exists "authenticated can delete job media" on storage.objects;

create policy "public can view job media"
on storage.objects for select
to public
using (bucket_id = 'job-media');

create policy "authenticated can upload job media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'job-media');

create policy "authenticated can update job media"
on storage.objects for update
to authenticated
using (bucket_id = 'job-media')
with check (bucket_id = 'job-media');

create policy "authenticated can delete job media"
on storage.objects for delete
to authenticated
using (bucket_id = 'job-media');

-- 4) Gắn lại 3 logo thật có sẵn trong project cho dữ liệu cũ nếu logo_url đang trống.
-- Đây là đường dẫn local, web vẫn hiển thị bình thường. Khi Admin upload logo mới,
-- logo_url sẽ được thay bằng URL Supabase Storage.
update public.jobs set logo_url = '/logos/dnp.png' where slug = 'dnp' and (logo_url is null or logo_url = '');
update public.jobs set logo_url = '/logos/dongjin.png' where slug = 'dongjin' and (logo_url is null or logo_url = '');
update public.jobs set logo_url = '/logos/hai-au.png' where slug = 'hai-au' and (logo_url is null or logo_url = '');
