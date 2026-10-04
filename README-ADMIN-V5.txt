V5 - QUẢN LÝ TIN TUYỂN DỤNG

1) Trong Supabase > SQL Editor:
   - Chạy supabase/jobs-v5.sql
   - Sau đó chạy supabase/seed-jobs-v5.sql

2) Copy file .env.local đang chạy tốt từ bản cũ sang bản V5.

3) Chạy:
   npm install
   npm run dev

4) Đăng nhập /admin
   - Bấm "Quản lý tin tuyển dụng"
   - Hoặc mở /admin/jobs

Tại đây có thể:
- Thêm tin mới
- Sửa lương / ca / mô tả / quyền lợi / yêu cầu
- Đổi HR, SĐT, Zalo
- Ẩn/hiện tin
- Đánh dấu tuyển gấp
- Xóa tin

Trang chủ sẽ tự đọc các tin đang bật từ Supabase. Nếu Supabase chưa có dữ liệu, trang chủ vẫn dùng 6 tin mặc định để không bị trống.
