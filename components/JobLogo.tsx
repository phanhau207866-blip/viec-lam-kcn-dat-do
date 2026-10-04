import type { Job } from "@/lib/data";

export function JobLogo({ job }: { job: Job }) {
  if (job.logo) {
    return <div className="company-logo"><img src={job.logo} alt={`Logo ${job.company}`} loading="lazy" /></div>;
  }
  const initials = job.company === "DJ&M Solution" ? "DJ&M" : job.company.replace(/[^A-Za-zÀ-ỹ]/g, "").slice(0, 3).toUpperCase();
  return <div className={`company-logo company-logo-fallback ${job.slug}`}><span>{initials}</span></div>;
}
