"use client";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { GLOBAL_ZALO, jobs as fallbackJobs, type Job } from "@/lib/data";
import { getSupabase } from "@/lib/supabase";
import { rowToJob, type JobRow } from "@/lib/job-db";

function ApplyPageContent() {
  const sp = useSearchParams();
  const preset = sp.get("job") || "";
  const [allJobs,setAllJobs] = useState<Job[]>(fallbackJobs);
  const [status,setStatus] = useState<"idle"|"sending"|"done"|"error">("idle");
  const [message,setMessage] = useState("");
  const [submittedJob,setSubmittedJob] = useState(preset);
  const selected = useMemo(()=>allJobs.find(j=>j.slug===preset),[preset,allJobs]);
  const submitted = useMemo(()=>allJobs.find(j=>j.slug===submittedJob),[submittedJob,allJobs]);
  const zaloPhone = submitted?.contactPhone || GLOBAL_ZALO;
  const zaloName = submitted?.contactName || "Hậu";

  useEffect(()=>{
    (async()=>{
      const s=getSupabase(); if(!s)return;
      const {data,error}=await s.from("jobs").select("*").eq("is_active",true).order("created_at",{ascending:true});
      if(!error && data?.length) setAllJobs((data as JobRow[]).map(rowToJob));
    })();
  },[]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending"); setMessage("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setSubmittedJob(String(data.job_slug || ""));
    try {
      const res = await fetch("/api/applications", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
      const result = await res.json().catch(()=>({}));
      if (res.ok) setStatus("done");
      else {setStatus("error");setMessage(result.error || "Chưa gửi được thông tin. Vui lòng thử lại.");}
    } catch {setStatus("error");setMessage("Không kết nối được hệ thống. Vui lòng thử lại hoặc nhắn Zalo HR.");}
  }

  return <><Header/><main className="container form-page"><div className="form-intro"><span className="eyebrow">ỨNG TUYỂN NHANH</span><h1>Điền thông tin trong khoảng 1 phút</h1><p>HR sẽ liên hệ lại để tư vấn công việc phù hợp.</p></div>
    {status==="done" ? <div className="success"><h2>✅ Đã nhận thông tin</h2><p>Thông tin đã được lưu vào hệ thống. HR sẽ liên hệ lại sớm.</p><a className="btn zalo big" href={`https://zalo.me/${zaloPhone}`} target="_blank" rel="noreferrer">Nhắn Zalo {zaloName}</a></div> :
    <form className="apply-form" onSubmit={submit}>
      <label>Họ và tên<input name="full_name" required autoComplete="name" placeholder="Nguyễn Văn A"/></label>
      <label>Số điện thoại<input name="phone" required inputMode="tel" autoComplete="tel" pattern="(0|\\+84)[0-9]{8,10}" placeholder="09xxxxxxxx"/></label>
      <div className="two"><label>Năm sinh<input name="birth_year" inputMode="numeric" min="1950" max="2010" type="number" placeholder="2000"/></label><label>Giới tính<select name="gender" defaultValue=""><option value="">Chọn</option><option>Nam</option><option>Nữ</option><option>Khác</option></select></label></div>
      <label>Khu vực đang ở<input name="area" placeholder="VD: Đất Đỏ, Long Hải..."/></label>
      <label>Công ty muốn ứng tuyển<select name="job_slug" defaultValue={selected?.slug || preset}><option value="">Chưa biết, cần HR tư vấn</option>{allJobs.map(j=><option key={j.slug} value={j.slug}>{j.company} – {j.title}</option>)}</select></label>
      <label>Ngày có thể đi làm<input name="available_date" type="date"/><small>Nếu có thể đi làm ngay, chọn ngày hôm nay.</small></label>
      <label className="consent"><input type="checkbox" required name="consent" value="yes"/> Tôi đồng ý để website lưu thông tin và liên hệ tư vấn tuyển dụng.</label>
      <button className="btn primary big full" disabled={status==="sending"}>{status==="sending"?"Đang gửi...":"Gửi thông tin ứng tuyển"}</button>
      {status==="error" && <p className="error">{message}</p>}
    </form>}
  </main></>;
}


export default function ApplyPage() {
  return (
    <Suspense fallback={<main className="container form-page"><p>Đang tải form ứng tuyển...</p></main>}>
      <ApplyPageContent />
    </Suspense>
  );
}
