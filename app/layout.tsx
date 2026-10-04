import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Việc Làm KCN Đất Đỏ",
  description: "Tổng hợp việc làm tại KCN Đất Đỏ, ứng tuyển nhanh, gọi và Zalo trực tiếp HR."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}<AnalyticsTracker /></body></html>;
}
