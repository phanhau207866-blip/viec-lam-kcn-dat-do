V6 - UPLOAD LOGO & ẢNH TUYỂN DỤNG TRỰC TIẾP

1) Supabase > SQL Editor > New query
2) Mở file supabase/jobs-media-v6.sql, copy toàn bộ và Run.
3) Copy file .env.local đang chạy tốt sang thư mục V6 (nếu cần).
4) npm install
5) npm run dev
6) Vào http://localhost:3000/admin/jobs

Trong Thêm/Sửa tin:
- Chọn logo công ty (PNG/JPG/WebP, tối đa 5MB)
- Chọn ảnh công việc / nhà máy
- Xem preview ngay
- Bấm "Lưu tin tuyển dụng"

Bổ sung hữu ích trong V6:
- Tự tạo slug từ tên công ty khi thêm tin mới
- Nút "Nhân bản" tin tuyển dụng để tạo tin tương tự nhanh
- Hiển thị thời gian cập nhật gần nhất
- Logo/ảnh mới lưu trên Supabase Storage bucket job-media
- 3 logo DNP/Dongjin/Hải Âu cũ vẫn được giữ nếu chưa upload logo mới

LƯU Ý:
- Chỉ tài khoản Admin đã đăng nhập mới upload/sửa/xóa ảnh.
- Bucket job-media là public để người lao động xem ảnh trên website.
- Không đưa sb_secret key vào .env.local hoặc code frontend.
