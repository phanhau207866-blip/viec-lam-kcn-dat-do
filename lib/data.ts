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
    company: "DNP",
    title: "Công nhân sản xuất nhựa, bao bì nhựa",
    category: "Nhựa · Bao bì",
    location: "KCN Đất Đỏ",
    age: "18+",
    gender: "Nam / Nữ",
    hiring: "Không giới hạn",
    shifts: "Ca 12 tiếng",
    pay: ["Ca ngày 12h: 408.000đ", "Ca đêm 12h: 497.000đ", "Chủ nhật ca ngày 12h: 690.000đ", "Tăng ca ngày thường: 42.000đ/giờ", "Tăng ca Chủ nhật: 57.500đ/giờ", "Chuyên cần: 300.000đ/25 công"],
    benefits: ["BHXH, BHYT, BHTN", "Thưởng lễ, Tết, tháng 13 theo chính sách", "Công việc ổn định, có tăng ca"],
    requirements: ["CCCD bản gốc"],
    contactName: "Hậu",
    contactPhone: "0868660068",
    badge: "Đang tuyển nhiều",
    summary: "Sản xuất nhựa, bao bì nhựa và các công đoạn hỗ trợ trong nhà máy. Phù hợp người muốn đi làm sớm và có nhu cầu tăng ca.",
    image: "/media/dnp.jpg",
    logo: "/logos/dnp.png"
  },
  {
    slug: "dongjin",
    company: "Dongjin",
    title: "Lắp ráp mô tơ, dây điện & linh kiện ô tô",
    category: "Ô tô · Điện điện tử",
    location: "KCN Đất Đỏ",
    age: "16+",
    gender: "Nam / Nữ",
    hiring: "Không giới hạn",
    shifts: "7h–15h + tăng ca",
    pay: ["8h ngày: 251.500đ", "12h ngày: 377.700đ", "8h đêm: 301.500đ", "Tăng ca khoảng 35.000–61.000đ/giờ"],
    benefits: ["Chuyên cần 300.000đ/26 công", "Năng suất + đứng máy: 200.000–1.000.000đ", "BHXH, BHYT, BHTN"],
    requirements: ["Có thể làm việc trong môi trường sản xuất công nghiệp"],
    contactName: "Kim Anh",
    contactPhone: "0334677276",
    badge: "Từ 16 tuổi",
    summary: "Sản xuất mô tơ tản nhiệt ô tô, động cơ làm mát, motor DC công nghiệp; dây điện ô tô (wire harness), máy đề, máy phát điện và phụ kiện động cơ.",
    image: "/media/dongjin.jpg",
    logo: "/logos/dongjin.png"
  },
  {
    slug: "djm-solution",
    company: "DJ&M Solution",
    title: "Dây điện ô tô, mô tơ & linh kiện điện",
    category: "Dây điện · Ô tô",
    location: "Suối Rao, Châu Đức",
    age: "17–45",
    gender: "Nam / Nữ",
    hiring: "Khoảng 50 người",
    shifts: "7h–15h, tăng ca đến 18h hoặc 21h",
    pay: ["8h ngày: 251.500đ", "12h ngày: 377.700đ", "8h đêm: 301.500đ", "Tăng ca khoảng 35.000–61.000đ/giờ"],
    benefits: ["Có tăng ca", "Thu nhập tăng theo số giờ làm"],
    requirements: ["CCCD bản gốc", "Phỏng vấn đạt có thể đi làm ngay"],
    contactName: "Ms Hoa",
    contactPhone: "0886935805",
    badge: "Đi làm nhanh",
    summary: "Sản xuất dây điện ô tô (wire harness), mô tơ tản nhiệt, động cơ làm mát, motor DC công nghiệp, máy đề, máy phát điện và các phụ kiện liên quan.",
    image: "/media/djm-solution.jpg"
  },
  {
    slug: "an-an",
    company: "An An",
    title: "Sản xuất da nhân tạo",
    category: "Da nhân tạo",
    location: "KCN Đất Đỏ",
    age: "18–45",
    gender: "Nam / Nữ",
    hiring: "Không giới hạn",
    shifts: "Xoay ca 12 tiếng",
    pay: ["Ca ngày: 430.000đ", "Ca đêm: 490.000đ", "Chuyên cần: 260.000đ"],
    benefits: ["BHXH theo quy định", "Công việc ổn định"],
    requirements: ["CCCD bản gốc hoặc VNeID"],
    contactName: "Ms Hoa",
    contactPhone: "0886935805",
    badge: "Ca 12 tiếng",
    summary: "Sản xuất da nhân tạo trong nhà máy, làm việc với các cuộn vật liệu và công đoạn sản xuất theo dây chuyền. Có ca ngày và ca đêm.",
    image: "/media/an-an.jpg"
  },
  {
    slug: "hai-au",
    company: "Hải Âu",
    title: "Mài, xi mạ, đúc kim loại, phun sơn & kho",
    category: "Kim loại · Xi mạ",
    location: "KCN Đất Đỏ",
    age: "18+",
    gender: "Nam / Nữ",
    hiring: "Không giới hạn",
    shifts: "Hành chính + tăng ca, xoay ca được",
    pay: ["Thử việc: 6.730.000đ", "Chính thức: 7.700.000đ", "Thợ tay nghề ≥1 năm: 8.400.000đ", "Có thêm các khoản phụ cấp khác"],
    benefits: ["Hỗ trợ cơm ca", "BHXH, BHYT", "Thưởng lễ, Tết", "Lương hàng tháng đúng hạn"],
    requirements: ["CCCD + hồ sơ", "Không cần kinh nghiệm, được đào tạo"],
    contactName: "Trang",
    contactPhone: "0939296153",
    badge: "Được đào tạo",
    summary: "Gia công nội thất vòi inox và các bộ phận mài kẽm/mài đồng, xi mạ kẽm/xi mạ đồng, đúc kim loại, phun sơn, gia công và kho.",
    image: "/media/hai-au.jpg",
    logo: "/logos/hai-au.png"
  }
];
