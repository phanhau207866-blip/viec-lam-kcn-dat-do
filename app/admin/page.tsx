"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { jobs } from "@/lib/data";

type AppRow={id:string;created_at:string;full_name:string;phone:string;birth_year:number|null;gender:string|null;area:string|null;company:string;available_date:string|null;status:string;note:string|null;hr_note:string|null};
const statuses=["Chưa gọi","Đã gọi","Hẹn phỏng vấn","Nhận việc","Không phù hợp"];

function cleanPhone(phone:string){return phone.replace(/[^0-9]/g,"");}
function statusClass(status:string){
  if(status==="Nhận việc") return "is-hired";
  if(status==="Không phù hợp") return "is-rejected";
  if(status==="Hẹn phỏng vấn") return "is-interview";
  if(status==="Đã gọi") return "is-called";
  return "is-new";
}

export default function Admin(){
  const [rows,setRows]=useState<AppRow[]>([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("all");
  const [statusFilter,setStatusFilter]=useState("all");
  const [auth,setAuth]=useState<boolean|null>(null);
  const [q,setQ]=useState("");
  const [savingId,setSavingId]=useState<string|null>(null);
  const [savedId,setSavedId]=useState<string|null>(null);
  const s=getSupabase();

  useEffect(()=>{(async()=>{
    if(!s){setAuth(false);setLoading(false);return;}
    const {data:{session}}=await s.auth.getSession();
    if(!session){setAuth(false);setLoading(false);return;}
    setAuth(true);
    const {data}=await s.from("applications").select("*").order("created_at",{ascending:false});
    setRows((data||[]) as AppRow[]);
    setLoading(false);
  })();},[]);

  const companies=useMemo(()=>Array.from(new Set(jobs.map(j=>j.company))),[]);
  const visible=useMemo(()=>rows.filter(r=>
    (filter==="all"||r.company===filter) &&
    (statusFilter==="all"||r.status===statusFilter) &&
    (!q||`${r.full_name} ${r.phone} ${r.area||""} ${r.company||""} ${r.hr_note||""}`.toLowerCase().includes(q.toLowerCase()))
  ),[rows,filter,statusFilter,q]);

  async function updateStatus(id:string,status:string){
    if(!s)return;
    setSavingId(id);
    const {error}=await s.from("applications").update({status}).eq("id",id);
    setSavingId(null);
    if(!error){
      setRows(r=>r.map(x=>x.id===id?{...x,status}:x));
      flashSaved(id);
    }
  }
  async function updateNote(id:string,hr_note:string){
    if(!s)return;
    setSavingId(id);
    const {error}=await s.from("applications").update({hr_note}).eq("id",id);
    setSavingId(null);
    if(!error){
      setRows(r=>r.map(x=>x.id===id?{...x,hr_note}:x));
      flashSaved(id);
    }
  }
  function flashSaved(id:string){setSavedId(id);setTimeout(()=>setSavedId(x=>x===id?null:x),1500)}
  async function logout(){if(s)await s.auth.signOut();location.href="/login";}

  function exportCsv(){
    const header=["Ngày","Họ tên","SĐT","Năm sinh","Giới tính","Khu vực","Công ty","Ngày có thể đi làm","Trạng thái","Ghi chú ứng tuyển","Ghi chú HR"];
    const lines=visible.map(r=>[new Date(r.created_at).toLocaleDateString("vi-VN"),r.full_name,r.phone,r.birth_year||"",r.gender||"",r.area||"",r.company||"Cần tư vấn",r.available_date||"",r.status,r.note||"",r.hr_note||""]);
    const csv="\ufeff"+[header,...lines].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`ung-vien-kcn-dat-do-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
  }

  if(loading)return <><Header/><main className="container admin-page"><p>Đang tải...</p></main></>;
  if(!auth)return <><Header/><main className="container admin-page"><div className="empty"><h1>Trang quản trị</h1><p>Vui lòng đăng nhập để xem ứng viên.</p><Link className="btn primary" href="/login">Đăng nhập Admin</Link></div></main></>;

  const today=new Date().toISOString().slice(0,10);
  const todayCount=rows.filter(r=>r.created_at.slice(0,10)===today).length;
  const uncalled=rows.filter(r=>r.status==="Chưa gọi").length;
  const hired=rows.filter(r=>r.status==="Nhận việc").length;

  return <><Header/><main className="container admin-page">
    <div className="admin-head"><div><span className="eyebrow">SUPER ADMIN</span><h1>Quản lý ứng viên</h1><p className="admin-sub">Tìm nhanh, gọi/Zalo ngay, đổi trạng thái, ghi chú và xuất danh sách để làm việc hằng ngày.</p></div><div className="admin-head-actions"><Link className="btn soft" href="/admin/analytics">📊 Thống kê truy cập</Link><Link className="btn primary" href="/admin/jobs">Quản lý tin tuyển dụng</Link><button className="btn soft" onClick={logout}>Đăng xuất</button></div></div>

    <div className="stats"><div><strong>{rows.length}</strong><span>Tổng ứng viên</span></div><div><strong>{todayCount}</strong><span>Hôm nay</span></div><div><strong>{uncalled}</strong><span>Chưa gọi</span></div><div><strong>{hired}</strong><span>Đã nhận việc</span></div></div>

    <div className="admin-tools admin-tools-v3">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Tìm tên, SĐT, khu vực, ghi chú..."/>
      <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Tất cả công ty</option>{companies.map(c=><option key={c} value={c}>{c}</option>)}</select>
      <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">Tất cả trạng thái</option>{statuses.map(x=><option key={x} value={x}>{x}</option>)}</select>
      <button className="btn primary" onClick={exportCsv}>Xuất Excel/CSV</button>
    </div>

    <div className="admin-result-bar"><strong>{visible.length}</strong> ứng viên đang hiển thị</div>

    <div className="table-wrap desktop-admin-table"><table><thead><tr><th>Ngày</th><th>Ứng viên</th><th>Liên hệ</th><th>Công ty</th><th>Khu vực</th><th>Có thể đi làm</th><th>Trạng thái</th><th>Ghi chú HR</th></tr></thead><tbody>{visible.map(r=><tr key={r.id}>
      <td>{new Date(r.created_at).toLocaleDateString("vi-VN")}</td>
      <td><strong>{r.full_name}</strong><br/><small>{r.gender||""} {r.birth_year?`· ${r.birth_year}`:""}</small>{r.note&&<div className="candidate-note">ỨV: {r.note}</div>}</td>
      <td><div className="admin-contact-actions"><a className="mini-action call" href={`tel:${r.phone}`}>📞 Gọi</a><a className="mini-action zalo" href={`https://zalo.me/${cleanPhone(r.phone)}`} target="_blank" rel="noreferrer">💬 Zalo</a><span className="phone-text">{r.phone}</span></div></td>
      <td>{r.company || "Cần tư vấn"}</td><td>{r.area||"—"}</td><td>{r.available_date?new Date(r.available_date+"T00:00:00").toLocaleDateString("vi-VN"):"—"}</td>
      <td><select className={`status-select ${statusClass(r.status)}`} value={r.status} onChange={e=>updateStatus(r.id,e.target.value)}>{statuses.map(x=><option key={x}>{x}</option>)}</select>{savingId===r.id&&<small className="save-hint">Đang lưu...</small>}{savedId===r.id&&<small className="save-ok">✓ Đã lưu</small>}</td>
      <td><div className="note-save-wrap"><input className="note-input" value={r.hr_note||""} placeholder="VD: gọi lại 15h..." onChange={e=>setRows(list=>list.map(x=>x.id===r.id?{...x,hr_note:e.target.value}:x))}/><button className="note-save-btn" onClick={()=>updateNote(r.id,r.hr_note||"")}>Lưu</button></div></td>
    </tr>)}</tbody></table>{!visible.length&&<div className="empty">Chưa có ứng viên trong bộ lọc này.</div>}</div>

    <div className="mobile-admin-list">{visible.map(r=><article className="candidate-card" key={r.id}>
      <div className="candidate-card-head"><div><strong>{r.full_name}</strong><span>{r.gender||""}{r.birth_year?` · ${r.birth_year}`:""}</span></div><span className={`status-badge ${statusClass(r.status)}`}>{r.status}</span></div>
      <div className="candidate-card-meta"><span>🏭 {r.company||"Cần tư vấn"}</span><span>📍 {r.area||"Chưa ghi"}</span>{r.available_date&&<span>📅 Đi làm: {new Date(r.available_date+"T00:00:00").toLocaleDateString("vi-VN")}</span>}</div>
      <div className="candidate-mobile-actions"><a href={`tel:${r.phone}`}>📞 Gọi {r.phone}</a><a href={`https://zalo.me/${cleanPhone(r.phone)}`} target="_blank" rel="noreferrer">💬 Nhắn Zalo</a></div>
      <label>Trạng thái<select className={`status-select ${statusClass(r.status)}`} value={r.status} onChange={e=>updateStatus(r.id,e.target.value)}>{statuses.map(x=><option key={x}>{x}</option>)}</select></label>
      {r.note&&<div className="candidate-note mobile">Ứng viên ghi: {r.note}</div>}
      <label>Ghi chú HR<div className="note-save-wrap"><input className="note-input" value={r.hr_note||""} placeholder="VD: hẹn 8h sáng mai..." onChange={e=>setRows(list=>list.map(x=>x.id===r.id?{...x,hr_note:e.target.value}:x))}/><button className="note-save-btn" onClick={()=>updateNote(r.id,r.hr_note||"")}>Lưu</button></div></label>
      {(savingId===r.id||savedId===r.id)&&<div className={savedId===r.id?"save-ok":"save-hint"}>{savedId===r.id?"✓ Đã lưu":"Đang lưu..."}</div>}
    </article>)}{!visible.length&&<div className="empty">Chưa có ứng viên trong bộ lọc này.</div>}</div>
  </main></>;
}
