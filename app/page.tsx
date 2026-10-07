import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { JobExplorer } from "@/components/JobExplorer";
import { HeroSection } from "@/components/HeroSection";
import { GLOBAL_ZALO } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />

        <section id="viec-dang-tuyen" className="jobs-section wide-container">
          <div className="section-head final-head"><div><span className="eyebrow">VIỆC MỚI TẠI KCN ĐẤT ĐỎ</span><h2>8 tin tuyển dụng</h2></div><p>Chọn công việc phù hợp, xem chi tiết rồi ứng tuyển ngay.</p></div>
          <JobExplorer />
        </section>

        <section id="huong-dan" className="feature-row wide-container">
          <div className="feature-card urgent"><div><span className="feature-kicker">🔥 Tuyển gấp hôm nay</span><h3>IDC Fluid & Hải Âu đang cần người đi làm sớm</h3><p>Thông tin rõ ràng, hồ sơ đơn giản, HR hỗ trợ trực tiếp.</p><div className="urgent-links"><a href="#job-idc-fluid">IDC Fluid</a><a href="#job-hai-au">Hải Âu</a></div><a className="urgent-main" href="#job-idc-fluid">Xem việc tuyển gấp →</a></div><Image src="/media/urgent-worker.jpg" alt="Nhân viên nhà máy" width={460} height={270}/></div>
          <div className="feature-card process"><div className="feature-kicker">⚙ Quy trình ứng tuyển 3 bước</div><div className="steps"><div><b>1</b><span>Chọn công việc<br/>phù hợp</span></div><em>›</em><div><b>2</b><span>Liên hệ qua Zalo<br/>hoặc gọi HR</span></div><em>›</em><div><b>3</b><span>Nhận hướng dẫn<br/>đi làm sớm</span></div></div></div>
          <div className="feature-card why"><div><span className="feature-kicker">● Vì sao chọn việc tại Thành Tín Đạt KCN Đất Đỏ?</span><ul><li>HR Thành Tín Đạt hỗ trợ tư vấn trực tiếp, rõ ràng</li><li>Nhiều việc làm phù hợp tại KCN Đất Đỏ và khu vực lân cận</li><li>Thu nhập ổn định, cơ hội đi làm nhanh</li><li>Hỗ trợ ứng tuyển qua Zalo và điện thoại</li></ul></div><Image src="/media/support-worker.jpg" alt="Nhân viên hỗ trợ tuyển dụng" width={300} height={230}/></div>
        </section>
      </main>

      <footer id="lien-he" className="site-footer">
        <div className="wide-container footer-grid">
          <div className="footer-brand"><img src="/logo-thanh-tin-dat.png" alt="Thành Tín Đạt"/><div><strong>Việc Làm KCN Đất Đỏ</strong><span>Kết nối việc làm · Ổn định cuộc sống</span></div></div>
          <div><h4>Về chúng tôi</h4><a href="#viec-dang-tuyen">Danh sách công ty</a><a href="#viec-dang-tuyen">Cẩm nang việc làm</a></div>
          <div><h4>Hỗ trợ</h4><Link href="/ung-tuyen">Hướng dẫn ứng tuyển</Link><a href={`https://zalo.me/${GLOBAL_ZALO}`}>Zalo tuyển dụng</a></div>
          <div><h4>Liên hệ nhanh</h4><a href="tel:0868660068">☎ 0868 660 068 – Hậu</a><a href={`https://zalo.me/${GLOBAL_ZALO}`}>Zalo 0868 660 068</a><span>📍 KCN Đất Đỏ, Bà Rịa – Vũng Tàu</span></div>
        </div>
        <div className="footer-bottom">© 2026 Việc Làm KCN Đất Đỏ · Thành Tín Đạt</div>
      </footer>
      <div className="mobile-bar"><Link href="/ung-tuyen">Ứng tuyển</Link><a href={`https://zalo.me/${GLOBAL_ZALO}`}>Zalo</a><a href="tel:0868660068">Gọi HR</a></div>
    </>
  );
}
