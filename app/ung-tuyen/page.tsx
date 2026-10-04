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
  const zaloName = submitted?.contactName || "Háº­u";

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
    s¶»§q«^