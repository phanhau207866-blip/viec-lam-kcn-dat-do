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
      if (!error && data?.length) setAllJobs((data as JobRow[]).map(rowToJob));
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = allJobs;
    const q = query.trim().toLowerCase();
    if (q) list = list.filter(j => [j.company,j.title,j.category,j.location,j.summary].join(" ").toLowerCase().includes(q));
    if (chip === "Đi làm ngay") list = list.filter(j => /đi làm|phỏng vấn|tuyển gấp/i.test(j.badge + " " + j.requirements.join(" ")));
    if (chip === "Không cần kinh nghiệm") list = list.filter(j => /không cần kinh nghiệm|được đào tạo/i.test(j.requirements.join(" ") + " " + j.benefits.join(" ")));
    if (chip === "Lương cao") list = list.filter(j => /tr���q�^