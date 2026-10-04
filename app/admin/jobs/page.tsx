"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { getSupabase } from "@/lib/supabase";
import type { JobRow } from "@/lib/job-db";
import { HomeHeroAdmin } from "@/components/HomeHeroAdmin";

const blank: JobRow = {
  company_name: "", slug: "", location: "KCN ƒê·∫•t ƒê·ªè", job_title: "", salary: "", shift: "", age_requirement: "", gender_requirement: "Nam / N·ªØ",
  description: "", requirements: "", benefits: "", hr_name: "", hr_phone: "", hr_zalo: "", image_url: "/media/hero-workers-clean.jpg", logo_url: null,
  is_active: true, is_urgent: false
};

function slugify(value:string){
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ƒë/g,"d").replace(/ƒê/g,"D").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
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
    const {data,error}=a∂ªßq´^