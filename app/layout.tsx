import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") || "http";
  const title = "研刷 408｜考研计算机刷题";
  const description = "面向考研 408 的简洁刷题站，覆盖数据结构、计算机组成原理、操作系统与计算机网络。";
  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/og-408.png", width: 1600, height: 900, alt: "研刷 408：今天，刷到会。" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og-408.png"] },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
