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
      <Link href="/" className="back">ⶻ�q�^