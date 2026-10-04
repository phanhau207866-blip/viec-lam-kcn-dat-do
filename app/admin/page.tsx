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
    if(!ses���q�^