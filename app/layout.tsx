import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  metadataBase: new URL("https://vieclamdatdo.id.vn"),
  title: "Việc Làm KCN Đất Đỏ",
  description: "Tổng hợp việc làm tại KCN Đất Đỏ, ứng tuyển nhanh, gọi và Zalo trực tiếp HR.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "Việc Làm KCN Đất Đỏ",
    title: "Việc Làm KCN Đất Đỏ",
    description: "Tổng hợp việc làm tại KCN Đất Đỏ, ứng tuyển nhanh, gọi và Zalo trực tiếp HR.",
    images: [
      {
        url: "/media/hero-workers-clean.jpg",
        width: 1200,
        height: 630,
        alt: "Việc Làm KCN Đất Đỏ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Việc Làm KCN Đất Đỏ",
    description: "Tổng hợp việc làm tại KCN Đất Đỏ, ứng tuyển nhanh, gọi và Zalo trực tiếp HR.",
    images: ["/media/hero-workers-clean.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}<AnalyticsTracker /></body></html>;
}
