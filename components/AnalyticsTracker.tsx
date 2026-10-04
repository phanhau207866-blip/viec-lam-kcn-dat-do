"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

type AnalyticsEventType = "page_view" | "apply_click" | "zalo_click" | "call_click";

function sessionId() {
  try {
    const key = "vldd_analytics_session";
    let value = sessionStorage.getItem(key);
    if (!value) {
      value = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(key, value);
    }
    return value;
  } catch {
    return "unknown";
  }
}

function referrerHost() {
  try {
    return document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    return "";
  }
}

function deviceType() {
  if (typeof window === "undefined") return "unknown";
  if (/iPad|Tablet/i.test(navigator.userAgent)) return "tablet";
  return window.innerWidth <= 820 ? "mobile" : "desktop";
}

function slugFromPath(path: string) {
  const match = path.match(/^\/viec-lam\/([^/?#]+)/);
  return match?.[1] || null;
}

function slugFromTarget(target: HTMLElement) {
  const card = target.closest<HTMLElement>('[id^="job-"]');
  if (card?.id) return card.id.replace(/^job-/, "");
  return slugFromPath(window.location.pathname);
}

async function record(eventType: AnalyticsEventType, path: string, jobSlug?: string | null) {
  const s = getSupabase();
  if (!s) return;
  await s.from("analytics_events").insert({
    event_type: eventType,
    path,
    job_slug: jobSlug || null,
    referrer: referrerHost() || null,
    session_id: sessionId(),
    device_type: deviceType()
  });
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname === "/login") return;
    void record("page_view", pathname, slugFromPath(pathname));
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (window.location.pathname.startsWith("/admin")) return;
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";
      let eventType: AnalyticsEventType | null = null;
      if (href.startsWith("tel:")) eventType = "call_click";
      else if (href.includes("zalo.me/")) eventType = "zalo_click";
      else if (href.startsWith("/ung-tuyen")) eventType = "apply_click";
      if (!eventType) return;

      void record(eventType, window.location.pathname, slugFromTarget(anchor));
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
