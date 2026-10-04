import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { jobs as fallbackJobs } from "@/lib/data";

function cleanPhone(value: unknown) { return String(value || "").replace(/[^0-9+]/g, "").trim(); }

export async function POST(req: Request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase chưa cấu hình" }, { status: 503 });
  try {
    const body = await req.json();
    const fullName = String(body.full_name || "").trim();
    const phone = cleanPhone(body.phone);
    const jobSlug = String(body.job_slug || "").trim();
    let company = "Cần HR tư vấn";
    if(jobSlug){
      const {data}=await supabase.from("jobs").select("company_name").eq("slug",jobSlug).eq("is_active",true).maybeSingle();
      company = data?.company_name || fallbackJobs.find(j=>j.slug===jobSlug)?.company || company;
    }
    const availableDate = body.available_date ? String(body.available_date) : null;
    if (!fullName || !phone) return NextResponse.json({ error: "Vui lòng nhập họ tên và số điện thoại." }, { status: 400 });
    if (!/^(0|\+84)[0-9]{8,10}$/.test(phone)) return NextResponse.json({ error: "Số điện thoại chưa đúng định dạng." }, { status: 400 });
    const payload = {
      full_name: fullName, phone,
      birth_year: body.birth_year ? Number(body.birth_year) : null,
      gender: body.gender ? String(body.gender) : null,
      area: body.area ? String(body.area).trim() : null,
      company, available_date: availableDate,
      note: body.note ? String(body.note).trim() : null,
      status: "Chưa gọi", hr_note: null
    };
    const { error } = await supabase.from("applications").insert(payload);
    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "Số điện thoại này đã ứng tuyển công ty này rồi. HR sẽ liên hệ lại nếu cần." }, { status: 409 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, company });
  } catch { return NextResponse.json({ error: "Không xử lý được yêu cầu." }, { status: 500 }); }
}
