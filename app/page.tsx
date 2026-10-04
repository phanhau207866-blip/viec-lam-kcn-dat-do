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
          <div className="section-head final-head"><div><span className="eyebrow">VIỆC MỚI TẠI KCN ĐẤT ĐỎ</span><h2>6 công ty đang tuyển</h2></div><p>Chọn công việc phù hợp, xem chi tiết rồi ứng tuyển ngay.</p></div>
          <JobExplorer />
        </section>

        <section id="huong-dan" className="feature-row wide-container">
          <div className="feature-card urgent"><div><span className="feature-kicker">🔥 Tuyển gấp hôm nay</span><h3>IDC Fluid & Hải Âu đang cần người đi làm sớm</h3><p>Thông tin rõ ràng, hồ sơ đơn giản, HR hỗ trợ trực tiếp.</p><div className="urgent-links"><a href="#job-idc-fluid">IDC Fluid</a><a href="#job-hai-au">Hải Âu</a></div><a className="urgent-main" href="#job-idc-fluid">Xem việc tuyển gấp →</a></div><Image src="/media/urgent-worker.jpg" alt="Nhân viên nhà máy" width={460} height={270}/></div>
          <div className="feature-card process"><div className="feature-kicker">⚙ Quy trình ứng tuyển 3 bước</div><���q�^