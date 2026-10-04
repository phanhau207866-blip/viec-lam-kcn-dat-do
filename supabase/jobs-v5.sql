-- V5: Cho website đọc tin đang tuyển, chỉ Admin đã đăng nhập được thêm/sửa/xóa.
alter table public.jobs enable row level security;

drop policy if exists "public can read active jobs" on public.jobs;
drop policy if exists "authenticated can read jobs" on public.jobs;
drop policy if exists "authenticated can insert jobs" on public.jobs;
drop policy if exists "authenticated can update jobs" on public.jobs;
drop policy if exists "authenticated can delete jobs" on public.jobs;

create policy "public can read active jobs"
on public.jobs for select
to anon
using (is_active = true);

create policy "authenticated can read jobs"
on public.jobs for select
to authenticated
using (true);

create policy "authenticated can insert jobs"
on public.jobs for insert
to authenticated
with check (true);

create policy "authenticated can update jobs"
on public.jobs for update
to authenticated
using (true)
with check (true);

create policy "authenticated can delete jobs"
on public.jobs for delete
to authenticated
using (true);
