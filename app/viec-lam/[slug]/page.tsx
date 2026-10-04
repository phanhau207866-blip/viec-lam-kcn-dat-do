"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { JobLogo } from "@/components/JobLogo";
import { jobs as fallbackJobs, type Job } from "@/lib/data";
import { getSupabase } from "@/lib/supabase";
import { rowToJob, type JobRow } from "@/lib/job-db";

export default function JobPage() {
  const params = useParams<{slug:string}>();
  const slug = String(params?.slug || "");
  const fallback = useMemo(()=>fallbackJobs.find(j=>j.slug===slug),[slug]);
  const [job,setJob] = useState<Job|undefined>(fallback);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    (async()=>{
      setJob(fallback);
      const s=getSupabase();
      if(s && slug){
        const {data,error}=await s.from("jobs").select("*").eq("slug",slug).eq("is_active",true).maybeSingle();
        if(!error && data) setJob(rowToJob(data as JobRow));
      }
      setLoading(false);
    })();
  },[slug,fallback]);

  if(loading && !job) return <><Header/><main className="container detail-page"><p>Đang tải...</p></main></>;
  if(!job) return <><Header/><main className="container detail-page"><div className="empty"><h1>Tin tuyển dụng không còn hiển thị</h1><Link className="btn primary" href="/">Về trang chủ</Link></div></main></>;

  return <>
    <Header/>
    <main className="container detail-page">
      <Link href="/" className="back">← Về trang chủ</Link>
      <div className="detail-hero detail-hero-rich">
        <div className="detail-hero-copy">
          <JobLogo job={job}/>
          <span className="badge">{job.badge}</span>
          <h1>{job.company}</h1><h2>{job.title}</h2><p>📍 {job.location}</p>
          <div className="meta-grid large"><span>👥 {job.gender}</span><span>🎂 {job.age}</span><span>🕒 {job.shifts}</span><span>📌 {job.hiring}</span></div>
        </div>
        <img className="detail-cover" src={job.image} alt={`Công nhân làm việc tại ${job.company}`} />
      </div>
      <div className="detail-columns">
        <section className="detail-card"><h3>🧰 Mô tả công việc</h3><p>{job.summary}</p></section>
        <section className="detail-card"><h3>💰 Lương & thu nhập</h3><ul>{job.pay.map(x=><li key={x}>{x}</li>)}</ul></section>
        <section className="detail-card"><h3>🎁 Quyền lợi</h3><ul>{job.benefits.map(x=><li key={x}>{x}</li>)}</ul></section>
        <section className="detail-card"><h3>✅ Yêu cầu</h3><ul>{job.requirements.map(x=><li key={x}>{x}</li>)}</ul></section>
      </div>
      <section className="contact-card"><div><strong>HR phụ trách: {job.contactName}</strong><span>{job.contactPhone}</span><small>Nhắn Zalo hoặc gọi trực tiếp đúng HR phụ trách dự án này.</small></div><div className="contact-actions"><Link className="btn primary" href={`/ung-tuyen?job=${job.slug}`}>Ứng tuyển ngay</Link><a className="btn zalo" href={`https://zalo.me/${job.contactPhone}`} target="_blank" rel="noreferrer">Nhắn Zalo {job.contactName}</a><a className="btn call" href={`tel:${job.contactPhone}`}>Gọi {job.contactName}</a></div></section>
    </main>
    <div className="mobile-bar"><Link href={`/ung-tuyen?job=${job.slug}`}>Ứng tuyển</Link><a href={`https://zalo.me/${job.contactPhone}`} target="_blank" rel="noreferrer">Zalo HR</a><a href={`tel:${job.contactPhone}`}>Gọi ngay</a></div>
  </>;
}
