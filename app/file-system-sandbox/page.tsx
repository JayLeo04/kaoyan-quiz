import type { Metadata } from "next";
import { FileSystemSandbox } from "@/app/components/FileSystemSandbox";

export const metadata: Metadata = {
  title: "文件系统沙盘｜研刷 408",
  description: "从开机挂载到新建、写入、同步、链接和删除，观察文件系统内部状态如何联动变化。",
  openGraph: {
    title: "文件系统沙盘｜研刷 408",
    description: "把目录项、inode、位图、数据块和内存状态放在同一张可操作地图上。",
    images: ["/file-system-sandbox-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "文件系统沙盘｜研刷 408",
    description: "把目录项、inode、位图、数据块和内存状态放在同一张可操作地图上。",
    images: ["/file-system-sandbox-og.png"],
  },
};

export default function FileSystemSandboxPage() {
  return <FileSystemSandbox />;
}
