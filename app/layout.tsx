import type { Metadata } from "next";
import { GitHubPagesNavigation } from "@/app/components/GitHubPagesNavigation";
import "katex/dist/katex.min.css";
import "./globals.css";

const title = "408 真题｜研刷";
const description = "2009–2026 年 408 真题，覆盖数据结构、计算机组成原理、操作系统与计算机网络；每页一题并保留练习记录。";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title,
  description,
  openGraph: { title, description, type: "website" },
  twitter: { card: "summary", title, description },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body><GitHubPagesNavigation />{children}</body>
    </html>
  );
}
