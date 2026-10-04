"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Header } from "@/components/Header";

export default function Login(){
  const router=useRouter(); const [msg,setMsg]=useState("");
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const s=getSupabase();if(!s){setMsg("Chưa cấu hình Supabase");return;}const f=new FormData(e.currentTarget);const {error}=await s.auth.signInWithPassword({email:String(f.get("email")),password:String(f.get("password"))});if(error)setMsg(error.message);else router.push("/admin");}
  return <><Header/><main className="container form-page"><div className="form-intro"><span className="eyebrow">QUẢN TRỊ</span><h1>Đăng nhập Admin</h1><p>Dành cho quản lý website và HR được cấp quyền.</p></div><form className="apply-form" onSubmit={submit}><label>Email<input name="email" type="email" required/></label><label>Mật khẩu<input name="password" type="password" required/></label><button className="btn primary big full">Đăng nhập</button>{msg&&<p className="error">{msg}</p>}</form></main></>
}
