import Link from "next/link";
import { GLOBAL_ZALO } from "@/lib/data";

export function Header() {
  return (
    <header className="topbar">
      <div className="wide-container header-inner">
        <Link href="/" className="brand">
          <img src="/logo-thanh-tin-dat.png" alt="Thành Tín Đạt" />
          <div><strong>Việc Làm KCN Đất Đỏ</strong><span>Kết nối việc làm · Ổn định cuộc sống</span></div>
        </Link>
        <nav className="main-nav">
          <Link href="/">Trang chủ</Link>
          <Link href="/#viec-dang-tuyen">Danh sách công ty</Link>
          <Link href="/#viec-dang-tuyen">Việc làm theo ngành</Link>
          <Link href="/#huong-dan">Cẩm nang</Link>
          <Link href="/#lien-he">Liên hệ</Link>
        </nav>
        <div className="header-cta">
          <a className="header-zalo" href={`https://zalo.me/${GLOBAL_ZALO}`} target="_blank" rel="noreferrer"><b>Zalo</b><span>0868 660 068<small>Hậu · Tư vấn việc làm</small></span></a>
          <a className="header-call" href="tel:0868660068">☎ <span>Gọi HR<strong>0868 660 068</strong></span></a>
        </div>
      </div>
    </header>
  );
}
