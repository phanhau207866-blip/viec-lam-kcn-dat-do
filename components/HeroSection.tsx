"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

const DEFAULT_HERO = "/media/hero-workers-clean.jpg";

export function HeroSection(){
  const [heroUrl,setHeroUrl]=useState(DEFAULT_HERO);

  useEffect(()=>{
    const s=getSupabase();
    if(!s) return;
    s.from("site_settings").select("hero_image_url").eq("id","home").maybeSingle()
      .then(({data})=>{
        if(data?.hero_image_url) setHeroUrl(data.hero_image_url);
      });
  },[]);

  return <section className="hero-final">
    <div className="hero-photo hero-photo-bg" style={{backgroundImage:`url(${heroUrl})`}} aria-label="Công nhân đang làm việc trong nhà máy" />
    <div className="hero-overlay" />
    <aside className="social-proof" aria-label="Thống kê quan tâm">
      <div><i className="dot green"/><strong>143</strong><span>Người đang truy cập</span></div>
      <div><i className="dot blue"/><strong>268</strong><span>Người đang quan tâm</span></div>
      <div><i className="dot red"/><strong>962</strong><span>Người đang theo dõi / nhận việc</span></div>
    </aside>
    <div className="wide-container hero-content">
      <div className="hero-copy final-copy">
        <span className="hero-pill">7 công ty đang tuyển</span>
        <h1>tại KCN Đất Đỏ</h1>
        <p className="hero-slogan">Tuyển dụng nhanh – Đi làm sớm – Thu nhập ổn định</p>
        <div className="hero-checks"><span>✓ Nhiều vị trí</span><span>✓ Không cần kinh nghiệm</span><span>✓ Nam / Nữ đều được</span><span>✓ HR hỗ trợ nhanh</span></div>
        <div className="hero-actions">
          <a className="btn hero-blue" href="#viec-dang-tuyen">⌕ Xem việc ngay</a>
          <Link className="btn hero-yellow" href="/ung-tuyen">↗ Ứng tuyển ngay</Link>
        </div>
      </div>
      <div className="hero-note">Việc tốt<br/>Thu nhập ổn định<br/>Tương lai vững vàng</div>
      <div className="hero-trust" aria-label="Điểm nổi bật">
        <div><b>7+</b><span>Công ty uy tín</span></div>
        <div><b>100+</b><span>Vị trí đang tuyển</span></div>
        <div><b>HR</b><span>Hỗ trợ Zalo & điện thoại</span></div>
      </div>
    </div>
  </section>;
}
