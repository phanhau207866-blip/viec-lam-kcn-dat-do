"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { getSupabase } from "@/lib/supabase";
import type { JobRow } from "@/lib/job-db";
import { HomeHeroAdmin } from "@/components/HomeHeroAdmin";

const blank: JobRow = {
  company_name: "", slug: "", location: "KCN Đất Đỏ", job_title: "", salary: "", shift: "", age_requirement: "", gender_requirement: "Nam / Nữ",
  description: "", requirements: "", benefits: "", hr_name: "", hr_phone: "", hr_zalo: "", image_url: "/media/hero-workers-clean.jpg", logo_url: null,
  is_active: true, is_urgent: false
};

function slugify(value:string){
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/đ/g,"d").replace(/Đ/g,"D").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
}

export default function JobsAdmin(){
  const s=getSupabase();
  const [rows,setRows]=useState<JobRow[]>([]);
  const [auth,setAuth]=useState<boolean|null>(null);
  const [loading,setLoading]=useState(true);
  const [editing,setEditing]=useState<JobRow|null>(null);
  const [msg,setMsg]=useState("");
  const [q,setQ]=useState("");
  const [uploading,setUploading]=useState<"logo"|"cover"|null>(null);

  async function load(){
    if(!s){setAuth(false);setLoading(false);return;}
    const {data:{session}}=await s.auth.getSession();
    if(!session){setAuth(false);setLoading(false);return;}
    setAuth(true);
    const {data,error}=await s.from("jobs").select("*").order("created_at",{ascending:true});
    if(error) setMsg(`Lỗi tải tin: ${error.message}`);
    setRows((data||[]) as JobRow[]);setLoading(false);
  }
  useEffect(()=>{load();},[]);

  const visible=useMemo(()=>rows.filter(r=>!q||`${r.company_name} ${r.job_title} ${r.location}`.toLowerCase().includes(q.toLowerCase())),[rows,q]);

  async function save(){
    if(!s||!editing)return;
    if(!editing.company_name.trim()){setMsg("Vui lòng nhập tên công ty");return;}
    const finalSlug=editing.slug.trim() || slugify(editing.company_name);
    if(!finalSlug){setMsg("Vui lòng nhập slug / đường dẫn");return;}
    setMsg("Đang lưu...");
    const payload={...editing,slug:finalSlug,updated_at:new Date().toISOString()};
    let result;
    if(editing.id) result=await s.from("jobs").update(payload).eq("id",editing.id).select().single();
    else { const {id,...insertPayload}=payload as any; result=await s.from("jobs").insert(insertPayload).select().single(); }
    if(result.error){setMsg(`Lỗi: ${result.error.message}`);return;}
    setMsg("✓ Đã lưu tin tuyển dụng");setEditing(null);await load();
  }

  async function uploadMedia(file:File,kind:"logo"|"cover"){
    if(!s||!editing)return;
    if(!file.type.startsWith("image/")){setMsg("Chỉ chọn file hình ảnh.");return;}
    if(file.size>5*1024*1024){setMsg("Ảnh tối đa 5MB. Hãy chọn ảnh nhẹ hơn.");return;}
    setUploading(kind);setMsg(`Đang tải ${kind==="logo"?"logo":"ảnh công việc"}...`);
    const ext=(file.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");
    const folder=editing.slug.trim() || slugify(editing.company_name) || "tin-moi";
    const path=`${folder}/${kind}-${Date.now()}.${ext}`;
    const {error}=await s.storage.from("job-media").upload(path,file,{cacheControl:"3600",upsert:false,contentType:file.type});
    if(error){setMsg(`Lỗi upload: ${error.message}`);setUploading(null);return;}
    const {data}=s.storage.from("job-media").getPublicUrl(path);
    const url=data.publicUrl;
    setEditing(prev=>prev?{...prev,[kind==="logo"?"logo_url":"image_url"]:url}:prev);
    setMsg(`✓ Đã tải ${kind==="logo"?"logo":"ảnh công việc"}. Nhớ bấm “Lưu tin tuyển dụng”.`);
    setUploading(null);
  }

  async function toggle(row:JobRow,key:"is_active"|"is_urgent"){
    if(!s||!row.id)return;
    await s.from("jobs").update({[key]:!row[key],updated_at:new Date().toISOString()}).eq("id",row.id);
    await load();
  }
  async function remove(row:JobRow){
    if(!s||!row.id)return;
    if(!confirm(`Xóa tin ${row.company_name}?`))return;
    await s.from("jobs").delete().eq("id",row.id);await load();
  }
  function duplicate(row:JobRow){
    const {id,created_at,updated_at,...rest}=row;
    setEditing({...rest,company_name:`${row.company_name} - tin mới`,slug:`${row.slug}-moi`,is_active:false});
    setMsg("Đã nhân bản. Chỉnh nội dung rồi bật hiển thị khi sẵn sàng.");
  }

  if(loading)return <><Header/><main className="container admin-page"><p>Đang tải...</p></main></>;
  if(!auth)return <><Header/><main className="container admin-page"><div className="empty"><h1>Quản lý tuyển dụng</h1><p>Vui lòng đăng nhập Admin.</p><Link className="btn primary" href="/login">Đăng nhập</Link></div></main></>;

  return <><Header/><main className="container admin-page">
    <div className="admin-head"><div><span className="eyebrow">SUPER ADMIN</span><h1>Quản lý tin tuyển dụng</h1><p className="admin-sub">Thêm/sửa tin, upload logo & ảnh công việc, đổi HR/Zalo và đánh dấu tuyển gấp.</p></div><div className="admin-head-actions"><Link className="btn soft" href="/admin">← Ứng viên</Link><button className="btn primary" onClick={()=>{setEditing({...blank});setMsg("")}}>+ Thêm tin</button></div></div>
    <div className="admin-tools"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm tên công ty, vị trí..."/></div>
    {msg&&<div className="admin-message">{msg}</div>}
    <HomeHeroAdmin />
        <div className="admin-tip">💡 <b>Mới:</b> Ní có thể upload logo và ảnh công việc trực tiếp. Không cần sửa code khi thêm công ty mới.</div>
    <div className="job-admin-list">{visible.map(r=><article className="job-admin-card" key={String(r.id||r.slug)}>
      <div className="job-admin-summary">
        <div className="job-admin-mini-media">{r.logo_url?<img src={r.logo_url} alt=""/>:<span>{r.company_name.slice(0,3).toUpperCase()}</span>}</div>
        <div><div className="job-admin-title"><strong>{r.company_name}</strong>{r.is_urgent&&<span className="urgent-pill">Tuyển gấp</span>}{!r.is_active&&<span className="off-pill">Đang ẩn</span>}</div><p>{r.job_title}</p><small>📍 {r.location} · HR {r.hr_name} · {r.hr_phone}</small>{r.updated_at&&<small className="updated-note">Cập nhật: {new Date(r.updated_at).toLocaleString("vi-VN")}</small>}</div>
      </div>
      <div className="job-admin-actions"><button onClick={()=>setEditing({...r})}>Sửa</button><button onClick={()=>duplicate(r)}>Nhân bản</button><button onClick={()=>toggle(r,"is_active")}>{r.is_active?"Ẩn tin":"Hiện tin"}</button><button onClick={()=>toggle(r,"is_urgent")}>{r.is_urgent?"Bỏ tuyển gấp":"Đánh dấu tuyển gấp"}</button><button className="danger" onClick={()=>remove(r)}>Xóa</button></div>
    </article>)}</div>

    {editing&&<div className="modal-backdrop" onClick={()=>setEditing(null)}><div className="job-editor" onClick={e=>e.stopPropagation()}>
      <div className="job-editor-head"><div><span className="eyebrow">TIN TUYỂN DỤNG</span><h2>{editing.id?`Sửa ${editing.company_name}`:"Thêm tin mới"}</h2></div><button onClick={()=>setEditing(null)}>✕</button></div>
      <div className="job-editor-grid">
        <label>Tên công ty<input value={editing.company_name} onChange={e=>{const name=e.target.value;setEditing({...editing,company_name:name,slug:editing.id?editing.slug:(editing.slug||slugify(name))})}}/></label>
        <label>Slug / đường dẫn<input value={editing.slug} onChange={e=>setEditing({...editing,slug:slugify(e.target.value)})}/></label>

        <div className="media-upload wide">
          <div className="media-upload-head"><div><b>Logo công ty</b><small>PNG/JPG/WebP · tối đa 5MB · nên dùng nền trong suốt</small></div><label className="upload-btn">{uploading==="logo"?"Đang tải...":"Chọn logo"}<input type="file" accept="image/*" disabled={!!uploading} onChange={e=>e.target.files?.[0]&&uploadMedia(e.target.files[0],"logo")}/></label></div>
          <div className="media-preview logo-preview">{editing.logo_url?<img src={editing.logo_url} alt="Xem trước logo"/>:<span>Chưa có logo — web sẽ dùng chữ viết tắt.</span>}</div>
          {editing.logo_url&&<button className="clear-media" type="button" onClick={()=>setEditing({...editing,logo_url:null})}>Bỏ logo</button>}
        </div>

        <div className="media-upload wide">
          <div className="media-upload-head"><div><b>Ảnh công việc / nhà máy</b><small>Ảnh ngang, có người đang làm việc sẽ đẹp nhất</small></div><label className="upload-btn">{uploading==="cover"?"Đang tải...":"Chọn ảnh"}<input type="file" accept="image/*" disabled={!!uploading} onChange={e=>e.target.files?.[0]&&uploadMedia(e.target.files[0],"cover")}/></label></div>
          <div className="media-preview cover-preview">{editing.image_url?<img src={editing.image_url} alt="Xem trước ảnh công việc"/>:<span>Chưa có ảnh.</span>}</div>
        </div>

        <label className="wide">Vị trí tuyển<input value={editing.job_title||""} onChange={e=>setEditing({...editing,job_title:e.target.value})}/></label>
        <label>Địa điểm<input value={editing.location||""} onChange={e=>setEditing({...editing,location:e.target.value})}/></label>
        <label>Ca làm<input value={editing.shift||""} onChange={e=>setEditing({...editing,shift:e.target.value})}/></label>
        <label>Độ tuổi<input value={editing.age_requirement||""} onChange={e=>setEditing({...editing,age_requirement:e.target.value})}/></label>
        <label>Giới tính<input value={editing.gender_requirement||""} onChange={e=>setEditing({...editing,gender_requirement:e.target.value})}/></label>
        <label>HR phụ trách<input value={editing.hr_name||""} onChange={e=>setEditing({...editing,hr_name:e.target.value})}/></label>
        <label>SĐT HR<input value={editing.hr_phone||""} onChange={e=>setEditing({...editing,hr_phone:e.target.value})}/></label>
        <label>Zalo HR<input value={editing.hr_zalo||""} onChange={e=>setEditing({...editing,hr_zalo:e.target.value})}/></label>
        <label className="wide">URL ảnh thủ công <small>(chỉ dùng nếu không upload)</small><input value={editing.image_url||""} onChange={e=>setEditing({...editing,image_url:e.target.value})}/></label>
        <label className="wide">Mô tả công việc<textarea rows={4} value={editing.description||""} onChange={e=>setEditing({...editing,description:e.target.value})}/></label>
        <label className="wide">Lương / thu nhập <small>(mỗi dòng một ý)</small><textarea rows={5} value={editing.salary||""} onChange={e=>setEditing({...editing,salary:e.target.value})}/></label>
        <label className="wide">Quyền lợi <small>(mỗi dòng một ý)</small><textarea rows={4} value={editing.benefits||""} onChange={e=>setEditing({...editing,benefits:e.target.value})}/></label>
        <label className="wide">Yêu cầu <small>(mỗi dòng một ý)</small><textarea rows={4} value={editing.requirements||""} onChange={e=>setEditing({...editing,requirements:e.target.value})}/></label>
        <label className="checkline"><input type="checkbox" checked={!!editing.is_active} onChange={e=>setEditing({...editing,is_active:e.target.checked})}/> Đang tuyển / hiển thị trên web</label>
        <label className="checkline"><input type="checkbox" checked={!!editing.is_urgent} onChange={e=>setEditing({...editing,is_urgent:e.target.checked})}/> Tuyển gấp</label>
      </div>
      <div className="job-editor-actions"><button className="btn soft" onClick={()=>setEditing(null)}>Hủy</button><button className="btn primary" disabled={!!uploading} onClick={save}>{uploading?"Đợi upload xong...":"Lưu tin tuyển dụng"}</button></div>
    </div></div>}
  </main></>;
}
