import type { Job } from "@/lib/data";

export type JobRow = {
  id?: string | number;
  company_name: string;
  slug: string;
  location: string | null;
  job_title: string | null;
  salary: string | null;
  shift: string | null;
  age_requirement: string | null;
  gender_requirement: string | null;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  hr_name: string | null;
  hr_phone: string | null;
  hr_zalo: string | null;
  image_url: string | null;
  logo_url: string | null;
  is_active: boolean | null;
  is_urgent: boolean | null;
  created_at?: string;
  updated_at?: string;
};

function lines(value: string | null | undefined) {
  return String(value || "").split(/\n+/).map(x => x.trim()).filter(Boolean);
}

export function rowToJob(row: JobRow): Job {
  const pay = lines(row.salary);
  return {
    slug: row.slug,
    company: row.company_name,
    title: row.job_title || "Công nhân sản xuất",
    category: "Tuyển dụng",
    location: row.location || "KCN Đất Đỏ",
    age: row.age_requirement || "Theo yêu cầu",
    gender: row.gender_requirement || "Nam / Nữ",
    hiring: "Đang tuyển",
    shifts: row.shift || "Theo ca",
    pay: pay.length ? pay : ["Liên hệ HR để biết mức lương"],
    benefits: lines(row.benefits),
    requirements: lines(row.requirements),
    contactName: row.hr_name || "HR",
    contactPhone: row.hr_zalo || row.hr_phone || "0868660068",
    badge: row.is_urgent ? "Tuyển gấp" : "Đang tuyển",
    summary: row.description || "Liên hệ HR để được tư vấn chi tiết công việc.",
    image: row.image_url || "/media/hero-workers-clean.jpg",
    logo: row.logo_url || ({ dnp: "/logos/dnp.png", "dnp-chinh-thuc": "/logos/dnp.png", dongjin: "/logos/dongjin.png", "hai-au": "/logos/hai-au.png" } as Record<string,string>)[row.slug]
  };
}

export function jobToRow(job: Job): JobRow {
  return {
    company_name: job.company,
    slug: job.slug,
    location: job.location,
    job_title: job.title,
    salary: job.pay.join("\n"),
    shift: job.shifts,
    age_requirement: job.age,
    gender_requirement: job.gender,
    description: job.summary,
    requirements: job.requirements.join("\n"),
    benefits: job.benefits.join("\n"),
    hr_name: job.contactName,
    hr_phone: job.contactPhone,
    hr_zalo: job.contactPhone,
    image_url: job.image,
    logo_url: job.logo || null,
    is_active: true,
    is_urgent: ["idc-fluid", "hai-au"].includes(job.slug)
  };
}
