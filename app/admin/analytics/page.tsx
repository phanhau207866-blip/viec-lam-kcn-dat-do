"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { getSupabase } from "@/lib/supabase";
import { jobs } from "@/lib/data";

type EventRow = {
  id: number;
  created_at: string;
  event_type: "page_view" | "apply_click" | "zalo_click" | "call_click";
  path: string;
  job_slug: string | null;
  referrer: string | null;
  session_id: string | null;
  device_type: string | null;
};

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function sinceDays(days: number) {
  const d = startOfToday();
  d.setDate(d.getDate() - (days - 1));
  return d;
}

function labelForSlug(slug: string) {
  return jobs.find(j => j.slug === slug)?.company || slug;
}

export default function AnalyticsAdminPage() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const s = getSupabase();

  useEffect(() => {
    (async () => {
      if (!s) {
        setAuth(false);
        setLoading(false);
        return;
      }

      const { data: { session } } = await s.auth.getSession();
      if (!session) {
        setAuth(false);
        setLoading(false);
        return;
      }

      setAuth(true);
      const from = new Date();
      from.setDate(from.getDate() - 89);
      from.setHours(0, 0, 0, 0);

      const { data, error: queryError } = await s
        .from("analytics_events")
        .select("id,created_at,event_type,path,job_slug,referrer,session_id,device_type")
        .gte("created_at", from.toISOString())
        .order("created_at", { ascending: false })
        .limit(10000);

      if (queryError) {
        setError("Chưa có bảng thống kê trong Supabase. Cần chạy file supabase/analytics-v10.sql một lần.");
      } else {
        setRows((data || []) as EventRow[]);
      }
      setLoading(false);
    })();
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const t0 = startOfToday().getTime();
    const d7 = sinceDays(7).getTime();
    const d30 = sinceDays(30).getTime();

    const views = rows.filter(r => r.event_type === "page_view");
    const today = views.filter(r => new Date(r.created_at).getTime() >= t0).length;
    const week = views.filter(r => new Date(r.created_at).getTime() >= d7).length;
    const monthRows = rows.filter(r => new Date(r.created_at).getTime() >= d30);
    const monthViews = monthRows.filter(r => r.event_type === "page_view");
    const month = monthViews.length;
    const sessions = new Set(monthViews.map(r => r.session_id).filter(Boolean)).size;

    const clicks = {
      apply: monthRows.filter(r => r.event_type === "apply_click").length,
      zalo: monthRows.filter(r => r.event_type === "zalo_click").length,
      call: monthRows.filter(r => r.event_type === "call_click").length
    };

    const jobsMap = new Map<string, number>();
    monthViews.forEach(r => {
      if (!r.job_slug) return;
      jobsMap.set(r.job_slug, (jobsMap.get(r.job_slug) || 0) + 1);
    });
    const topJobs = [...jobsMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);

    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const count = views.filter(r => {
        const time = new Date(r.created_at).getTime();
        return time >= d.getTime() && time < next.getTime();
      }).length;
      return { label: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }), count };
    });

    return { today, week, month, sessions, clicks, topJobs, days };
  }, [rows]);

  if (loading) return <><Header/><main className="container analytics-page"><p>Đang tải thống kê...</p></main></>;

  if (!auth) return <><Header/><main className="container analytics-page"><div className="empty"><h1>Thống kê truy cập</h1><p>Vui lòng đăng nhập Admin.</p><Link className="btn primary" href="/login">Đăng nhập Admin</Link></div></main></>;

  const maxDay = Math.max(...stats.days.map(d => d.count), 1);

  return <><Header/><main className="container analytics-page">
    <div className="analytics-head">
      <div><span className="eyebrow">ADMIN · THỐNG KÊ RIÊNG</span><h1>Thống kê truy cập</h1><p>Chỉ tài khoản Admin mới xem được. Số liệu bắt đầu được ghi nhận từ khi tính năng này được bật, không hồi lại lượt truy cập cũ.</p></div>
      <Link className="btn soft" href="/admin">← Quản lý ứng viên</Link>
    </div>

    {error && <div className="analytics-error">{error}</div>}

    <div className="analytics-grid">
      <div className="analytics-stat"><strong>{stats.today.toLocaleString("vi-VN")}</strong><span>Lượt xem hôm nay</span></div>
      <div className="analytics-stat"><strong>{stats.week.toLocaleString("vi-VN")}</strong><span>Lượt xem 7 ngày</span></div>
      <div className="analytics-stat"><strong>{stats.month.toLocaleString("vi-VN")}</strong><span>Lượt xem 30 ngày</span></div>
      <div className="analytics-stat"><strong>{stats.sessions.toLocaleString("vi-VN")}</strong><span>Phiên truy cập 30 ngày (ước tính)</span></div>
    </div>

    <div className="analytics-sections">
      <section className="analytics-panel">
        <h2>7 ngày gần nhất</h2>
        <div className="analytics-days">
          {stats.days.map(day => <div className="analytics-day" key={day.label}><span>{day.label}</span><div className="analytics-bar"><i style={{width:`${Math.max(3, day.count / maxDay * 100)}%`}}/></div><strong>{day.count}</strong></div>)}
        </div>
      </section>

      <section className="analytics-panel">
        <h2>Hành động 30 ngày</h2>
        <div className="analytics-clicks">
          <div className="analytics-click"><strong>{stats.clicks.apply}</strong><span>Bấm Ứng tuyển</span></div>
          <div className="analytics-click"><strong>{stats.clicks.zalo}</strong><span>Bấm Zalo</span></div>
          <div className="analytics-click"><strong>{stats.clicks.call}</strong><span>Bấm Gọi HR</span></div>
        </div>
      </section>

      <section className="analytics-panel">
        <h2>Việc làm được xem nhiều · 30 ngày</h2>
        {stats.topJobs.length ? stats.topJobs.map(([slug, count]) => <div className="analytics-row" key={slug}><div><b>{labelForSlug(slug)}</b><small>/viec-lam/{slug}</small></div><strong>{count}</strong></div>) : <div className="analytics-empty">Chưa có lượt xem chi tiết công việc.</div>}
      </section>

      <section className="analytics-panel">
        <h2>Ghi chú số liệu</h2>
        <div className="analytics-note">“Lượt xem” là số lần trang được mở. “Phiên truy cập” dùng mã ngẫu nhiên trong phiên trình duyệt nên chỉ là số ước tính, không thu thập tên, số điện thoại hay địa chỉ IP của khách.</div>
      </section>
    </div>
  </main></>;
}
