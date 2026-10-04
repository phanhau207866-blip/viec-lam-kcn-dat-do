"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent } from "react";
import type { Job } from "@/lib/data";
import { JobLogo } from "./JobLogo";

export function JobCard({ job }: { job: Job }) {
  const router = useRouter();
  const detailHref = `/viec-lam/${job.slug}`;

  function openDetail() {
    router.push(detailHref);
  }

  function handleCardClick(event: MouseEvent<HTMLElement>) {
    const target = event.target as HTMLElement;
    if (target.closest("a, button, input, select, textarea")) return;
    openDetail();
  }

  function handleCardKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Enter" || event.key === " ") {
      const target = event.target as HTMLElement;
      if (target.closest("a, button, input, select, textarea")) return;
      event.preventDefault();
      openDetail();
    }
  }

  return (
    <article
      id={`job-${job.slug}`}
      className="job-card job-card-clickable"
      role="link"
      tabIndex={0}
      aria-label={`Xem chi tiết công việc ${job.company}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
    >
      <div className="job-thumb-wrap">
        <img className="job-thumb" src={job.image} alt={`Công nhân làm việc tại ${job.company}`} loading="lazy" />
        <span className="job-floating-badge">{job.badge}</span>
      </div>

      <div className="job-card-body">
        <div className="company-line">
          <JobLogo job={job} />
          <span className="location">📍 {job.location}</span>
        </div>

        <h3>{job.company}</h3>
        <p className="job-title">{job.title}</p>

        <div className="compact-meta">
          <span>👥 {job.gender} · {job.age}</span>
          <span>🕒 {job.shifts}</span>
          <span>📌 {job.hiring}</span>
        </div>

        <div className="salary-highlight">💰 {job.pay[0]}</div>

        {job.slug === "dongjin" && (
          <div className="hr-highlight">HR Kim Anh · 0334 677 276</div>
        )}

        {job.slug === "hai-au" && (
          <div className="hr-highlight">HR Trang · 0939 296 153</div>
        )}

        <Link className="btn primary full soft-primary" href={`/ung-tuyen?job=${job.slug}`}>
          Ứng tuyển ngay <span>→</span>
        </Link>

        <div className="card-secondary-actions">
          <a
            className="micro-btn zalo-soft"
            href={`https://zalo.me/${job.contactPhone}`}
            target="_blank"
            rel="noreferrer"
          >
            <b>Z</b> Nhắn Zalo
          </a>
          <a className="micro-btn call-soft" href={`tel:${job.contactPhone}`}>
            <b>☎</b> Liên hệ HR
          </a>
        </div>

        <Link className="detail-link" href={detailHref}>
          Xem chi tiết công việc
        </Link>
      </div>
    </article>
  );
}
