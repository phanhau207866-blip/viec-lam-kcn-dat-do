# Việc Làm KCN Đất Đỏ — V3 hoàn thiện giao diện

## Chạy thử trên Windows
1. Giải nén thư mục.
2. Mở CMD tại thư mục dự án.
3. Chạy:
   npm install
   npm run dev
4. Mở http://localhost:3000

## Giao diện đã hoàn thiện
- Khung trang chủ đúng mẫu đã chốt: header, banner nhà máy, thanh tìm kiếm, 6 card công ty, khối tuyển gấp, quy trình 3 bước, lý do chọn việc, footer.
- Ảnh công nhân đang làm việc theo đúng nhóm ngành thay cho poster tuyển dụng.
- Logo thật: DNP, Dongjin, Hải Âu. IDC Fluid, DJ&M Solution, An An dùng nhận diện chữ sạch gọn.
- Font Be Vietnam Pro, phong cách xanh dương nhạt - trắng - vàng.
- Nút Ứng tuyển / Zalo / Liên hệ HR mềm hơn và tối ưu mobile.
- Trang chi tiết công ty dùng cùng phong cách.
- Dongjin: HR Kim Anh 0334 677 276.
- Hải Âu: HR Trang 0939 296 153.
- Zalo chung: 0868 660 068 - Hậu.

## Lưu ý về box thống kê
Box 143 / 268 / 962 đang được ghi là “Số liệu minh họa”. Trước khi đưa web chạy chính thức nên thay bằng số liệu thật từ analytics/database để tránh hiển thị số liệu không thực.

## Database / Admin
Phần Supabase giữ cấu trúc từ bản trước. Copy `.env.example` thành `.env.local`, điền URL và anon key Supabase để bật lưu form ứng viên và admin dữ liệu.

## Cập nhật cuối 04/10/2026
- Header vẫn dùng số ���q�^