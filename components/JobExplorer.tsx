"use client";
import { useEffect, useMemo, useState } from "react";
import { jobs as fallbackJobs, type Job } from "@/lib/data";
import { getSupabase } from "@/lib/supabase";
import { rowToJob, type JobRow } from "@/lib/job-db";
import { JobCard } from "./JobCard";

const chips = ["Tất cả", "Việc mới", "Lương cao", "Đi làm ngay", "Không cần kinh nghiệm"];

export function JobExplorer() {
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState("Tất cả");
  const [allJobs, setAllJobs] = useState<Job[]>(fallbackJobs);

  useEffect(() => {
    (async () => {
      const s = getSupabase();
      if (!s) return;
      const { data, error } = await s.from("jobs").select("*").eq("is_active", true).order("created_at", { ascending: true });
      if (!error && data?.length) {
        const dbJobs = (data as JobRow[]).map(rowToJob);
        const dbSlugs = new Set(dbJobs.map(j => j.slug));
        const missingFallbackJobs = fallbackJobs.filter(j => !dbSlugs.has(j.slug));
        setAllJobs([...dbJobs, ...missingFallbackJobs]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = allJobs;
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(j => [j.company,j.title,j.category,j.location,j.summary].join(" ").toLowerCase().includes(q));
    if (chip === "Đi làm ngay") list = list.filter(j => /đi làm|phỏng vấn|tuyển gấp/i.test(j.badge + " " + j.requirements.join(" ")));
    if (chip === "Không cần kinh nghiệm") list = list.filter(j => /không cần kinh nghiệm|được đào tạo/i.test(j.requirements.join(" ") + " " + j.benefits.join(" ")));
    if (chip === "Lương cao") list = list.filter(j => /triệu|4\d{2}\.000|5\d{2}\.000/i.test(j.pay.join(" ")));
    return list;
  }, [allJobs, query, chip]);

  return <>
    <div className="search-panel">
      <div className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm công ty, ngành nghề, từ khóa..." /></div>
      <button className="search-button">Tìm kiếm</button>
    </div>
    <div className="filter-chips">
      {chips.map((c,i)=><button key={c} onClick={()=>setChip(c)} className={chip===c?"active":""}><span>{["●","✦","◉","⚡","●"][i]}</span>{c}</button>)}
    </div>
    <div className="jobs-grid">{filtered.map(job => <JobCard key={job.slug} job={job} />)}</div>
    {filtered.length===0 && <div className="no-results">Chưa thấy công việc phù hợp. Thử từ khóa khác hoặc nhắn Zalo để HR hỗ trợ.</div>}
  </>;
}
