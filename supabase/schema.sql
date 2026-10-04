-- Chạy phần này trong Supabase SQL Editor nếu bảng applications đã tồn tại.
-- Script này khớp với cấu trúc mà website đang dùng.

alter table public.applications enable row level security;

-- Xóa policy cũ nếu có để chạy lại script không lỗi.
drop policy if exists "public can submit applications" on public.applications;
drop policy if exists "authenticated can read applications" on public.applications;
drop policy if exists "authenticated can update applications" on public.applications;

-- Người lao động chỉ được GỬI form, không được đọc danh sách ứng viên.
create policy "public can submit applications"
on public.applications for insert
to anon, authenticated
with check (true);

-- Chỉ tài khoản Admin đã đăng nhập mới được xem / sửa danh sách.
create policy "authenticated can read applications"
on public.applications for select
to authenticated
using (true);

create policy "authenticated can update applications"
on public.applications for update
to authenticated
using (true)
with check (true);

-- Chặn một SĐT gửi trùng cùng một công ty nhiều lần.
create unique index if not exists applications_phone_company_unique
on public.applications (phone, company);
