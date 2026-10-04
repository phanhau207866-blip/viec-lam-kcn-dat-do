export type Job = {
  slug: string;
  company: string;
  title: string;
  category: string;
  location: string;
  age: string;
  gender: string;
  hiring: string;
  shifts: string;
  pay: string[];
  benefits: string[];
  requirements: string[];
  contactName: string;
  contactPhone: string;
  badge: string;
  summary: string;
  image: string;
  logo?: string;
};

export const GLOBAL_ZALO = "0868660068";

export const jobs: Job[] = [
  {
    slug: "idc-fluid",
    company: "IDC Fluid",
    title: "Sản xuất kim loại, vòi nước inox rửa tay",
    category: "Kim loại · Inox",
    location: "KCN Đất Đỏ",
    age: "22+",
    gender: "Nam / Nữ",
    hiring: "Không giới hạn",
    shifts: "Xoay ca được",
    pay: ["Thu nhập khoảng 10–15 triệu/tháng", "Lắp ráp/gia công: ca ngày 250.000đ, ca đêm 310.000đ", "Ren/dập: ca ngày 280.000đ, ca đêm 340.000đ"],
    benefits: ["Được đào tạo nếu chưa có kinh nghiệm", "BHXH, BHYT theo chính sách", "Hỗ trợ ứng lương hàng tuần theo chính sách"],
    requirements: ["Sức khỏe phù hợp công việc nhà máy", "Có thể xoay ca"],
    contactName: "Hậu",
    contactPhone: "0868660068",
    badge: "Thu nhập tốt",
    summary: "Sản xuất kim loại và vòi nước inox rửa tay. Công việc gồm lắp ráp, gia công, kiểm hàng, đứng máy, kho và các công đoạn ren/dập.",
    image: "/media/idc-fluid.jpg"
  },
  {
    slug: "dnp",
    com���q�^