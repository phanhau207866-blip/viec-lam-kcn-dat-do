"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

const DEFAULT_HERO = "/media/hero-workers-clean.jpg";

export function HomeHeroAdmin(){
  const s=getSupabase();
  const [url,setUrl]=useState(DEFAULT_HERO);
  const [uploading,setUploading]=useState(false);
  const [msg,setMsg]=useState("");

  useEffect(()=>{
    if(!s) return;
    s.from("site_settings").select("hero_image_url").eq("id","home").maybeSingle().then(({data})=>{
      if(data?.hero_image_url) setUrl(data.hero_image_url);
    });
  },[]);

  async function persist(nextUrl:string){
    if(!s) return;
    const {error}=await s.from("site_settings").upsert({id:"home",hero_image_url:nextUrl,updated_at:new Date().toISOString()});
    if(error){setMsg(`Lỗi: ${error.message}`);return false;}
    setUrl(nextUrl);setMsg("✓ Đã cập nhật ảnh bìa trang chủ");return true;
  }

  async function upload(file:File){
    if(!s) return;
    if(!file.type.startsWith("image/")){setMsg("Chỉ chọn file hình ảnh.");return;}
    if(file.size>8*1024*1024){setMsg("Ảnh bìa tối đa 8MB.");return;}
    setUploading(true);setMsg("Đang tải ảnh bìa...");
    const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
    const path=`site/hero-${Date.now()}.${ext}`;
    const {error}=await s.storage.from("job-media").upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type});
    if(error){setMsg(`Lỗi upload: ${error.message}`);setUploading(false);return;}
    const {data}=s.storage.from("job-media").getPublicUrl(path);
    await persist(data.publicUrl);
    setUploading(false);
  }

  return <section className="hero-admin-panel">
    <div className="hero-admin-copy">
      <span className="eyebrow">TRANG CHỦ</span>
      <h2>Ảnh bìa trang chủ</h2>
      <p>Ảnh cũ đã được khôi phục. Sau này ní có thể đổi ảnh bìa tại đây mà không cần sửa code.</p>
      <div className="hero-admin-actions">
        <label className="upload-btn">{uploading?"Đang tải...":"Đổi ảnh bìa"}<input type="file" accept="image/*" disabled={uploading} onChange={e=>e.target.files?.[0]&&upload(e.target.files[0])}/></label>
        <button className="btn soft" type="button" disabled={uploading} onClick={()=>persist(DEFAULT_HERO)}>Dùng lại ảnh cũ</button>
      </div>
      {msg&&<small className="hero-admin-msg">{msg}</small>}
    </div>
    <div className="hero-admin-preview"><img src={url} alt="Xem trước ảnh bìa"/></div>
  </section>;
}
