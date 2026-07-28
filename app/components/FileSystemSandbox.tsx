"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useState } from "react";

type AllocationMode = "hybrid" | "contiguous" | "linked" | "fat" | "indexed";
type FreeMode = "bitmap" | "table" | "linked" | "grouped";
type SelectedObject = "overview" | "directory" | "inode" | "memory" | "disk" | "blocks" | "free" | "vfs";
type EventTone = "boot" | "path" | "inode" | "memory" | "disk" | "link" | "done";

type Inode = {
  id: number;
  kind: "文件" | "目录" | "软链接";
  size: number;
  links: number;
  direct: number[];
  indirect: number | null;
  status: "稳定" | "待写回" | "已回收";
  note: string;
};

type FsState = {
  boot: "关机" | "固件" | "内核" | "已挂载";
  mounted: boolean;
  mountedSuperblock: boolean;
  externalMounted: boolean;
  fileCreated: boolean;
  fileOpen: boolean;
  fileWritten: boolean;
  synced: boolean;
  hardLink: boolean;
  softLink: boolean;
  originalUnlinked: boolean;
  copyUnlinked: boolean;
  reclaimed: boolean;
  fd: number | null;
  offset: number;
  dirty: boolean;
  activeInodes: number[];
  inodeBitmap: boolean[];
  dataBitmap: boolean[];
  noteInode: Inode | null;
  shortcutInode: Inode | null;
  cacheContent: string;
  diskContent: string;
};

type Change = {
  target: string;
  from: string;
  to: string;
  tone: EventTone;
};

type Frame = {
  id: string;
  action: string;
  icon: string;
  title: string;
  detail: string;
  tone: EventTone;
  state: FsState;
  changes: Change[];
  focus: SelectedObject[];
};

const filePayload = "hello-fs!";
const baseInodes: Inode[] = [
  { id: 2, kind: "目录", size: 128, links: 3, direct: [1], indirect: null, status: "稳定", note: "根目录 /" },
  { id: 3, kind: "目录", size: 96, links: 2, direct: [2], indirect: null, status: "稳定", note: "home 目录" },
  { id: 4, kind: "目录", size: 128, links: 2, direct: [3], indirect: null, status: "稳定", note: "mei 的工作目录" },
  { id: 5, kind: "文件", size: 12, links: 1, direct: [4], indirect: null, status: "稳定", note: "预置 readme" },
];

function initialState(): FsState {
  return {
    boot: "关机",
    mounted: false,
    mountedSuperblock: false,
    externalMounted: false,
    fileCreated: false,
    fileOpen: false,
    fileWritten: false,
    synced: false,
    hardLink: false,
    softLink: false,
    originalUnlinked: false,
    copyUnlinked: false,
    reclaimed: false,
    fd: null,
    offset: 0,
    dirty: false,
    activeInodes: [],
    inodeBitmap: Array.from({ length: 16 }, (_, index) => [2, 3, 4, 5].includes(index)),
    dataBitmap: Array.from({ length: 16 }, (_, index) => [0, 1, 2, 3, 4].includes(index)),
    noteInode: null,
    shortcutInode: null,
    cacheContent: "",
    diskContent: "",
  };
}

function cloneState(state: FsState): FsState {
  return {
    ...state,
    activeInodes: [...state.activeInodes],
    inodeBitmap: [...state.inodeBitmap],
    dataBitmap: [...state.dataBitmap],
    noteInode: state.noteInode ? { ...state.noteInode, direct: [...state.noteInode.direct] } : null,
    shortcutInode: state.shortcutInode ? { ...state.shortcutInode, direct: [...state.shortcutInode.direct] } : null,
  };
}

function initialFrame(): Frame {
  return {
    id: "ready",
    action: "待机",
    icon: "💤",
    title: "小磁盘正在睡觉",
    detail: "磁盘上的分区、超级块、inode 和数据块都还在；只是内存里还没有挂载信息，目录树暂时不能访问。",
    tone: "boot",
    state: initialState(),
    changes: [{ target: "运行时内存", from: "空", to: "等待启动", tone: "boot" }],
    focus: ["overview", "disk"],
  };
}

function frame(
  id: string,
  action: string,
  icon: string,
  title: string,
  detail: string,
  tone: EventTone,
  state: FsState,
  changes: Change[],
  focus: SelectedObject[],
): Frame {
  return { id, action, icon, title, detail, tone, state, changes, focus };
}

function addActive(state: FsState, inode: number) {
  if (!state.activeInodes.includes(inode)) state.activeInodes.push(inode);
}

function removeActive(state: FsState, inode: number) {
  state.activeInodes = state.activeInodes.filter((id) => id !== inode);
}

const allocationLabels: Record<AllocationMode, string> = {
  hybrid: "混合索引",
  contiguous: "连续分配",
  linked: "链式分配",
  fat: "FAT 显式链接",
  indexed: "索引分配",
};

const freeLabels: Record<FreeMode, string> = {
  bitmap: "位图法",
  table: "空闲表法",
  linked: "空闲链表法",
  grouped: "成组链接法",
};

const toneLabel: Record<EventTone, string> = {
  boot: "启动",
  path: "路径",
  inode: "inode",
  memory: "内存",
  disk: "磁盘",
  link: "链接",
  done: "完成",
};

function noteExists(state: FsState) {
  return state.fileCreated && !state.reclaimed && (!state.originalUnlinked || (state.hardLink && !state.copyUnlinked));
}

function fileNameForState(state: FsState) {
  if (!state.originalUnlinked) return "note.txt";
  if (state.hardLink && !state.copyUnlinked) return "note-copy.txt";
  return "已无目录名";
}

function panelFocusClass(selected: SelectedObject, panel: SelectedObject) {
  return selected === panel ? "is-focused" : "";
}

function DiskCharacter({ state }: { state: FsState }) {
  const face = state.reclaimed ? "😴" : state.mounted ? "🤖" : state.boot === "关机" ? "💤" : "✨";
  const speech = state.reclaimed
    ? "空间已回收，等下一次冒险！"
    : state.fileOpen
      ? "我正在帮你看住打开的文件。"
      : state.mounted
        ? "根文件系统已挂到 / 啦！"
        : "按下启动，让我醒来吧！";
  return <div className="fs-game-mascot" aria-label={speech}><span>{face}</span><p>{speech}</p></div>;
}

function Timeline({ history, cursor, onStep }: { history: Frame[]; cursor: number; onStep: (index: number) => void }) {
  const visible = history.slice(Math.max(0, history.length - 10));
  const offset = history.length - visible.length;
  return (
    <ol className="fs-game-timeline" aria-label="文件系统事件时间线">
      {visible.map((item, index) => {
        const realIndex = offset + index;
        return (
          <li key={`${item.id}-${realIndex}`} className={realIndex === cursor ? "active" : realIndex < cursor ? "done" : ""}>
            <button type="button" onClick={() => onStep(realIndex)} aria-current={realIndex === cursor ? "step" : undefined}>
              <span>{item.icon}</span><b>{realIndex + 1}</b><small>{item.action}</small>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ActionButton({ label, icon, disabled, onClick, hint }: { label: string; icon: string; disabled: boolean; onClick: () => void; hint: string }) {
  return (
    <button className="fs-game-action" type="button" disabled={disabled} onClick={onClick} data-tooltip={hint}>
      <span aria-hidden="true">{icon}</span><b>{label}</b>
    </button>
  );
}

function DirectoryTree({ state, selected, onSelect }: { state: FsState; selected: SelectedObject; onSelect: (value: SelectedObject) => void }) {
  const originalExists = state.fileCreated && !state.originalUnlinked && !state.reclaimed;
  const copyExists = state.hardLink && !state.copyUnlinked && !state.reclaimed;
  const shortcutDangling = state.softLink && state.originalUnlinked;
  return (
    <section className={`fs-game-panel fs-game-directory ${panelFocusClass(selected, "directory")}`}>
      <header><span>🌳</span><div><small>统一目录树</small><h2>路径在这里逐级展开</h2></div><button type="button" onClick={() => onSelect("directory")}>聚焦</button></header>
      <div className="fs-tree" role="tree" aria-label="教学文件系统目录树">
        <button type="button" className="fs-tree-node root" onClick={() => onSelect("directory")}><span>📂</span><b>/</b><small>inode #2</small></button>
        <button type="button" className="fs-tree-node level-1" onClick={() => onSelect("directory")}><span>📁</span><b>home</b><small>inode #3</small></button>
        <button type="button" className="fs-tree-node level-2 selected" onClick={() => onSelect("directory")}><span>🧸</span><b>mei</b><small>inode #4</small></button>
        <div className="fs-tree-dots level-3"><span>·</span><span>·</span></div>
        {originalExists ? <button type="button" className="fs-tree-node level-3 file" onClick={() => onSelect("inode")}><span>📝</span><b>note.txt</b><small>→ inode #7</small></button> : null}
        {copyExists ? <button type="button" className="fs-tree-node level-3 hard" onClick={() => onSelect("inode")}><span>🔗</span><b>note-copy.txt</b><small>→ inode #7</small></button> : null}
        {state.softLink ? <button type="button" className={`fs-tree-node level-3 soft ${shortcutDangling ? "dangling" : ""}`} onClick={() => onSelect("inode")}><span>🪄</span><b>shortcut</b><small>{shortcutDangling ? "悬挂链接" : "→ note.txt"}</small></button> : null}
        <button type="button" className="fs-tree-node level-1" onClick={() => onSelect("directory")}><span>📁</span><b>tmp</b><small>空目录</small></button>
        <button type="button" className="fs-tree-node level-1 mount" onClick={() => onSelect("vfs")}><span>{state.externalMounted ? "🛸" : "📍"}</span><b>mnt / usb</b><small>{state.externalMounted ? "已挂载" : "待挂载"}</small></button>
      </div>
      <p className="fs-panel-note">目录项保存的是“名字 → inode 编号”。`note.txt` 被删掉后，inode 仍可能因打开引用而暂时存在。</p>
    </section>
  );
}

function InodePanel({ state, selected, onSelect }: { state: FsState; selected: SelectedObject; onSelect: (value: SelectedObject) => void }) {
  const rows = [...baseInodes, ...(state.noteInode ? [state.noteInode] : []), ...(state.shortcutInode ? [state.shortcutInode] : [])];
  return (
    <section className={`fs-game-panel fs-game-inodes ${panelFocusClass(selected, "inode")}`}>
      <header><span>🧾</span><div><small>inode 元数据区</small><h2>文件名不住在这里</h2></div><button type="button" onClick={() => onSelect("inode")}>聚焦</button></header>
      <div className="fs-inode-table" role="table" aria-label="inode 表">
        <div className="fs-inode-row fs-inode-head" role="row"><span>编号</span><span>类型</span><span>大小</span><span>链接</span><span>块指针</span></div>
        {rows.map((inode) => <button type="button" key={inode.id} className={`fs-inode-row ${inode.id === 7 ? "note-inode" : ""} ${inode.status === "待写回" ? "dirty" : ""} ${inode.status === "已回收" ? "released" : ""}`} onClick={() => onSelect("blocks")}>
          <span>#{inode.id}</span><span>{inode.kind}</span><span>{inode.size} B</span><span>×{inode.links}</span><span>{inode.direct.length ? inode.direct.map((block) => `B${block}`).join(" · ") : "—"}{inode.indirect !== null ? ` + I${inode.indirect}` : ""}</span>
        </button>)}
      </div>
      <div className="fs-inode-mini">
        <span>当前对象</span>
        <strong>{state.noteInode ? `${fileNameForState(state)} · inode #7` : "还没有新文件"}</strong>
        <p>{state.noteInode ? state.noteInode.note : "创建文件后，这里会出现它的元数据、链接计数与数据块地址。"}</p>
      </div>
    </section>
  );
}

function MemoryPanel({ state, selected, onSelect }: { state: FsState; selected: SelectedObject; onSelect: (value: SelectedObject) => void }) {
  return (
    <section className={`fs-game-panel fs-game-memory ${panelFocusClass(selected, "memory")}`}>
      <header><span>🧠</span><div><small>运行时内存</small><h2>打开时才有的临时伙伴</h2></div><button type="button" onClick={() => onSelect("memory")}>聚焦</button></header>
      <div className="fs-memory-grid">
        <article className={state.mountedSuperblock ? "alive" : ""}><span>超级块</span><strong>{state.mountedSuperblock ? "已挂载" : "未载入"}</strong><small>块大小、总块数、空闲管理方式</small></article>
        <article className={state.activeInodes.length ? "alive" : ""}><span>活动 inode 缓存</span><strong>{state.activeInodes.length ? state.activeInodes.map((id) => `#${id}`).join(" · ") : "空"}</strong><small>按需载入，不是所有 inode</small></article>
        <article className={state.fileOpen ? "alive" : ""}><span>进程 fd 表</span><strong>{state.fd === null ? "空" : `fd ${state.fd} → OFT #1`}</strong><small>进程自己的整数索引</small></article>
        <article className={state.fileOpen ? "alive" : ""}><span>系统打开文件表</span><strong>{state.fileOpen ? `偏移 ${state.offset} B` : "空"}</strong><small>模式 rw · 指向 inode #7</small></article>
        <article className={state.fileWritten ? (state.dirty ? "dirty" : "alive") : ""}><span>页缓存</span><strong>{state.fileWritten ? (state.dirty ? "脏页等待写回" : "已同步") : "空"}</strong><small>{state.cacheContent || "写入数据先来到这里"}</small></article>
      </div>
    </section>
  );
}

function DiskPanel({ state, selected, onSelect }: { state: FsState; selected: SelectedObject; onSelect: (value: SelectedObject) => void }) {
  return (
    <section className={`fs-game-panel fs-game-disk ${panelFocusClass(selected, "disk")}`}>
      <header><span>💿</span><div><small>持久化磁盘剖面</small><h2>盘上真正住着谁</h2></div><button type="button" onClick={() => onSelect("disk")}>聚焦</button></header>
      <div className="fs-disk-track" aria-label="磁盘分区和文件系统结构">
        <button type="button" className="disk-segment boot" onClick={() => onSelect("disk")}><b>引导</b><small>{state.boot === "关机" ? "待读取" : "MBR / GPT"}</small></button>
        <button type="button" className="disk-segment partition" onClick={() => onSelect("disk")}><b>root 分区</b><small>{state.mounted ? "已挂载到 /" : "待挂载"}</small></button>
        <button type="button" className={`disk-segment super ${state.mountedSuperblock ? "hot" : ""}`} onClick={() => onSelect("disk")}><b>超级块</b><small>{state.mountedSuperblock ? "内存有副本" : "磁盘中"}</small></button>
        <button type="button" className={`disk-segment meta ${state.noteInode?.status === "待写回" ? "hot" : ""}`} onClick={() => onSelect("inode")}><b>inode 区</b><small>{state.noteInode ? "#7 可见" : "等待分配"}</small></button>
        <button type="button" className={`disk-segment bitmap ${state.fileCreated ? "hot" : ""}`} onClick={() => onSelect("free")}><b>位图</b><small>分配 / 回收记账</small></button>
        <button type="button" className={`disk-segment data ${state.fileWritten ? "hot" : ""}`} onClick={() => onSelect("blocks")}><b>数据区</b><small>{state.diskContent ? filePayload : "等待写回"}</small></button>
      </div>
      <div className="fs-disk-caption"><span>单位尺</span><b>逻辑扇区 → 盘块 / 簇 → 文件逻辑块 → 字节偏移</b><small>文件系统分配的是盘块 / 簇，不是“一个字符一个扇区”。</small></div>
    </section>
  );
}

function BlockPanel({ state, allocation, selected, onSelect }: { state: FsState; allocation: AllocationMode; selected: SelectedObject; onSelect: (value: SelectedObject) => void }) {
  const status = state.fileWritten
    ? state.diskContent
      ? "数据已同步到 B10"
      : "B10 已分配，数据仍在页缓存"
    : "还没有文件数据块";
  const mapping = allocation === "hybrid"
    ? "inode #7 的直接块指针 → B10"
    : allocation === "contiguous"
      ? "起始块 + 长度：若扩展需连续空位"
      : allocation === "linked"
        ? "块内 next 指针，访问远端需要逐跳"
        : allocation === "fat"
          ? "FAT 表保存 B10 的后继盘块号"
          : "索引块保存逻辑块号 → 物理盘块号";
  return (
    <section className={`fs-game-panel fs-game-blocks ${panelFocusClass(selected, "blocks")}`}>
      <header><span>🧩</span><div><small>逻辑块 → 物理盘块</small><h2>{allocationLabels[allocation]}</h2></div><button type="button" onClick={() => onSelect("blocks")}>聚焦</button></header>
      <div className="fs-block-grid" aria-label="数据盘块位图与占用状态">
        {state.dataBitmap.map((used, index) => {
          const reserved = index < 5;
          const selectedBlock = index === 10 && state.fileWritten;
          return <button type="button" key={index} className={`${used ? "used" : "free"} ${reserved ? "reserved" : ""} ${selectedBlock ? "selected" : ""}`} onClick={() => onSelect("blocks")}><span>B{index}</span><small>{reserved ? "系统" : selectedBlock ? "note" : used ? "占用" : "空闲"}</small></button>;
        })}
      </div>
      <div className="fs-block-summary"><span>{status}</span><b>{mapping}</b></div>
    </section>
  );
}

function FreePanel({ state, freeMode, selected, onSelect }: { state: FsState; freeMode: FreeMode; selected: SelectedObject; onSelect: (value: SelectedObject) => void }) {
  const freeBlocks = state.dataBitmap.map((used, index) => !used ? index : null).filter((value): value is number => value !== null);
  let contents: ReactNode;
  if (freeMode === "bitmap") {
    contents = <div className="fs-free-bitmap">{state.dataBitmap.map((used, index) => <span key={index} className={used ? "taken" : "empty"}><b>{used ? "1" : "0"}</b><small>B{index}</small></span>)}</div>;
  } else if (freeMode === "table") {
    contents = <div className="fs-free-table"><span>起始块</span><b>B{freeBlocks[0] ?? "—"}</b><span>连续空闲</span><b>{freeBlocks.length} 块</b><small>分配后区段会缩短或分裂；回收时可合并相邻区段。</small></div>;
  } else if (freeMode === "linked") {
    contents = <div className="fs-free-chain">{freeBlocks.slice(0, 6).map((block, index) => <span key={block}>B{block}{index < Math.min(5, freeBlocks.length - 1) ? <i>→</i> : null}</span>)}<small>从链表头取块，头插可快速回收。</small></div>;
  } else {
    contents = <div className="fs-free-group"><strong>内存空闲块号栈</strong><div>{freeBlocks.slice(0, 5).map((block) => <span key={block}>B{block}</span>)}</div><small>当前组用尽时，从最后一个盘块补入下一组号码。</small></div>;
  }
  return (
    <section className={`fs-game-panel fs-game-free ${panelFocusClass(selected, "free")}`}>
      <header><span>🍀</span><div><small>空闲空间管理</small><h2>{freeLabels[freeMode]}</h2></div><button type="button" onClick={() => onSelect("free")}>聚焦</button></header>
      {contents}
    </section>
  );
}

function VfsPanel({ state, selected, onSelect }: { state: FsState; selected: SelectedObject; onSelect: (value: SelectedObject) => void }) {
  return (
    <section className={`fs-game-panel fs-game-vfs ${panelFocusClass(selected, "vfs")}`}>
      <header><span>🗺️</span><div><small>VFS 与挂载</small><h2>一棵树，多个文件系统</h2></div><button type="button" onClick={() => onSelect("vfs")}>聚焦</button></header>
      <div className="fs-vfs-flow"><span>open / read / write</span><i>↓</i><b>VFS</b><i>↓</i><strong>{state.externalMounted ? "ext4 root + USB FS" : "root ext4"}</strong></div>
      <div className={`fs-mount-card ${state.externalMounted ? "mounted" : ""}`}><span>{state.externalMounted ? "🛸" : "📍"}</span><div><b>/mnt/usb</b><small>{state.externalMounted ? "外部文件系统已接入目录树" : "点击“挂载 USB”让它出现"}</small></div></div>
    </section>
  );
}

export function FileSystemSandbox() {
  const [history, setHistory] = useState<Frame[]>([initialFrame]);
  const [cursor, setCursor] = useState(0);
  const [selected, setSelected] = useState<SelectedObject>("overview");
  const [allocation, setAllocation] = useState<AllocationMode>("hybrid");
  const [freeMode, setFreeMode] = useState<FreeMode>("bitmap");
  const [playing, setPlaying] = useState(false);
  const current = history[cursor] ?? history[0];
  const state = current.state;
  const previewing = cursor < history.length - 1;

  useEffect(() => {
    if (!playing) return undefined;
    if (cursor >= history.length - 1) {
      const stop = window.setTimeout(() => setPlaying(false), 0);
      return () => window.clearTimeout(stop);
    }
    const timer = window.setTimeout(() => setCursor((value) => Math.min(value + 1, history.length - 1)), 920);
    return () => window.clearTimeout(timer);
  }, [cursor, history.length, playing]);

  useEffect(() => {
    const nextFocus = current.focus.find((item) => item !== "overview");
    if (nextFocus) setSelected(nextFocus);
  }, [current.id, current.focus]);

  const append = (frames: Frame[]) => {
    const prefix = history.slice(0, cursor + 1);
    setHistory([...prefix, ...frames]);
    setCursor(prefix.length);
    setPlaying(false);
  };

  const start = () => {
    if (state.mounted) return;
    const firmware = cloneState(state);
    firmware.boot = "固件";
    const kernel = cloneState(firmware);
    kernel.boot = "内核";
    const superblock = cloneState(kernel);
    superblock.mountedSuperblock = true;
    const mounted = cloneState(superblock);
    mounted.boot = "已挂载";
    mounted.mounted = true;
    addActive(mounted, 2);
    append([
      frame("firmware", "启动", "⚡", "固件找到了启动盘", "BIOS / MBR 或 UEFI / GPT 的路径都在这里分叉；现在它们都会把控制权交给操作系统内核。", "boot", firmware, [{ target: "启动状态", from: "关机", to: "固件已唤醒", tone: "boot" }], ["disk", "overview"]),
      frame("kernel", "内核接管", "🧑‍🚀", "内核认识了根分区", "引导程序把内核和必要环境装入内存。内核接下来要找到哪个分区提供根目录 `/`。", "boot", kernel, [{ target: "根分区", from: "尚未识别", to: "等待挂载", tone: "boot" }], ["disk", "vfs"]),
      frame("superblock", "读取超级块", "📘", "超级块先进入内存", "它告诉内核块大小、总块数和空闲空间怎么管理。不是把所有 inode 和文件数据一次性读进来。", "memory", superblock, [{ target: "内存超级块", from: "空", to: "已挂载副本", tone: "memory" }], ["memory", "disk"]),
      frame("mount-root", "挂载 /", "🌳", "根文件系统可以从路径访问了", "VFS 把根文件系统接到 `/`。首次浏览根目录时，相关 inode 会按需进入活动缓存。", "done", mounted, [{ target: "VFS 挂载表", from: "空", to: "root FS → /", tone: "done" }, { target: "活动 inode", from: "空", to: "#2（根目录）", tone: "memory" }], ["vfs", "directory", "memory"]),
    ]);
  };

  const createFile = () => {
    if (!state.mounted || state.fileCreated) return;
    const path = cloneState(state);
    const inode = cloneState(path);
    inode.inodeBitmap[7] = true;
    inode.noteInode = { id: 7, kind: "文件", size: 0, links: 1, direct: [], indirect: null, status: "待写回", note: "刚分到的空文件 inode；还没有数据块。" };
    addActive(inode, 7);
    const created = cloneState(inode);
    created.fileCreated = true;
    created.dirty = true;
    append([
      frame("resolve-parent", "新建文件", "🔎", "先沿路径找到 mei 目录", "VFS 从 `/` 逐级解析 `home` 和 `mei`。目录项把文件名翻译成 inode 编号，父目录 inode #4 负责容纳新名字。", "path", path, [{ target: "路径解析", from: "/", to: "/home/mei", tone: "path" }], ["directory", "vfs"]),
      frame("allocate-inode", "分配 inode", "🎟️", "inode 位图找到了一个 0", "inode #7 被标记为已占用，内存中也出现活动 inode。此时还没有任何文件数据块。", "inode", inode, [{ target: "inode 位图[7]", from: "0（空闲）", to: "1（已占用）", tone: "inode" }, { target: "inode #7", from: "不存在", to: "空文件元数据", tone: "inode" }], ["inode", "memory", "free"]),
      frame("directory-entry", "写入目录项", "📝", "note.txt 终于有名字了", "父目录的数据块增加 `note.txt → inode #7`。大小仍为 0 B，所以数据块位图和数据区还没有变化。", "disk", created, [{ target: "mei 目录项", from: "没有 note.txt", to: "note.txt → #7", tone: "path" }, { target: "数据块位图", from: "不变", to: "不变（空文件）", tone: "disk" }], ["directory", "inode", "disk"]),
    ]);
  };

  const openFile = () => {
    if (!noteExists(state) || state.fileOpen) return;
    const opened = cloneState(state);
    opened.fileOpen = true;
    opened.fd = 3;
    opened.offset = 0;
    addActive(opened, 7);
    append([frame("open", "打开文件", "🔓", "fd 3 指向系统打开文件表", "进程 fd 表得到一个小整数；系统打开文件表记录这次打开的模式与偏移。目录项和文件数据并没有因此改变。", "memory", opened, [{ target: "进程 fd 表", from: "空闲", to: "fd 3 → OFT #1", tone: "memory" }, { target: "系统打开文件表", from: "无", to: "inode #7 · 偏移 0", tone: "memory" }], ["memory", "inode"])]);
  };

  const writeFile = () => {
    if (!state.fileOpen || state.fileWritten) return;
    const cache = cloneState(state);
    cache.fileWritten = true;
    cache.cacheContent = filePayload;
    cache.dirty = true;
    cache.synced = false;
    if (cache.noteInode) cache.noteInode.status = "待写回";
    const allocated = cloneState(cache);
    allocated.dataBitmap[10] = true;
    if (allocated.noteInode) {
      allocated.noteInode.direct = [10];
      allocated.noteInode.size = filePayload.length;
      allocated.noteInode.note = "直接块 B10 已分配；内容仍在页缓存等待写回。";
    }
    allocated.offset = filePayload.length;
    append([
      frame("cache-write", "写入", "🫧", "数据先进入页缓存", "`hello-fs!` 先由用户缓冲区进入页缓存，页面变成脏页。此刻还不能说它已经持久化。", "memory", cache, [{ target: "页缓存", from: "空", to: filePayload, tone: "memory" }, { target: "脏页状态", from: "干净", to: "等待写回", tone: "memory" }], ["memory", "blocks"]),
      frame("allocate-block", "分配数据块", "🧩", "数据块位图占用了 B10", "默认的位图法把 B10 从 0 改成 1；inode #7 的直接块指针指向它，文件大小与打开偏移一起更新。目录项无需改变。", "disk", allocated, [{ target: "数据块位图[10]", from: "0（空闲）", to: "1（note 数据）", tone: "disk" }, { target: "inode #7", from: "大小 0 · 无块", to: `大小 ${filePayload.length} · B10`, tone: "inode" }, { target: "OFT 偏移", from: "0 B", to: `${filePayload.length} B`, tone: "memory" }], ["blocks", "inode", "free", "memory"]),
    ]);
  };

  const syncFile = () => {
    if (!state.fileOpen || !state.fileWritten || state.synced) return;
    const syncing = cloneState(state);
    const persisted = cloneState(syncing);
    persisted.synced = true;
    persisted.dirty = false;
    persisted.diskContent = persisted.cacheContent;
    if (persisted.noteInode) {
      persisted.noteInode.status = "稳定";
      persisted.noteInode.note = "inode、位图和数据块已在教学模型中同步到磁盘。";
    }
    append([
      frame("fsync-ready", "同步", "📮", "fsync 收集脏页和元数据", "这一步明确要求把当前文件相关的页缓存、inode、位图等更新写回持久化层。", "memory", syncing, [{ target: "写回任务", from: "等待", to: "选择 B10 + inode #7", tone: "memory" }], ["memory", "disk"]),
      frame("fsync-done", "写入磁盘", "💾", "数据和元数据都同步了", "B10 的数据、inode #7 的大小与指针、位图变化都体现在磁盘剖面中；脏页标记被清除。", "done", persisted, [{ target: "B10 持久化内容", from: "等待写回", to: filePayload, tone: "disk" }, { target: "inode #7 状态", from: "待写回", to: "稳定", tone: "inode" }, { target: "页缓存", from: "脏", to: "干净", tone: "memory" }], ["disk", "blocks", "inode", "memory"]),
    ]);
  };

  const addHardLink = () => {
    if (!state.fileCreated || state.hardLink || state.originalUnlinked || state.reclaimed) return;
    const linked = cloneState(state);
    linked.hardLink = true;
    linked.dirty = true;
    if (linked.noteInode) {
      linked.noteInode.links += 1;
      linked.noteInode.status = "待写回";
      linked.noteInode.note = "两个目录项现在共同指向同一份元数据和数据块。";
    }
    append([frame("hard-link", "硬链接", "🔗", "多一个名字，不多一份数据", "`note-copy.txt` 是新目录项，仍指向 inode #7。链接计数从 1 变为 2；不会分配新 inode 或复制 B10。", "link", linked, [{ target: "mei 目录项", from: "一个名字", to: "新增 note-copy.txt → #7", tone: "link" }, { target: "inode #7 链接计数", from: "1", to: "2", tone: "inode" }, { target: "数据块 B10", from: "不变", to: "不变（共享）", tone: "disk" }], ["directory", "inode", "blocks"])]);
  };

  const addSoftLink = () => {
    if (!state.fileCreated || state.softLink || state.reclaimed) return;
    const linked = cloneState(state);
    linked.softLink = true;
    linked.inodeBitmap[8] = true;
    linked.dataBitmap[11] = true;
    linked.shortcutInode = { id: 8, kind: "软链接", size: 8, links: 1, direct: [11], indirect: null, status: "待写回", note: "B11 保存目标路径字符串 note.txt，而不是目标 inode。" };
    append([frame("soft-link", "软链接", "🪄", "shortcut 保存的是一段路径", "软链接有自己的目录项、inode #8 和数据块 B11；访问时会先读出 `note.txt`，再重新解析目标路径。", "link", linked, [{ target: "inode 位图[8]", from: "0", to: "1（软链接 inode）", tone: "inode" }, { target: "数据块位图[11]", from: "0", to: "1（目标路径字符串）", tone: "disk" }, { target: "shortcut", from: "不存在", to: "→ note.txt", tone: "link" }], ["directory", "inode", "blocks"])]);
  };

  const unlinkOriginal = () => {
    if (!state.fileCreated || state.originalUnlinked || state.reclaimed) return;
    const removed = cloneState(state);
    removed.originalUnlinked = true;
    if (removed.noteInode) {
      removed.noteInode.links = Math.max(0, removed.noteInode.links - 1);
      removed.noteInode.status = "待写回";
      removed.noteInode.note = removed.noteInode.links ? "原名字消失，但 note-copy.txt 仍指向它。" : "目录名已经没有了，但打开引用仍让它暂时存活。";
    }
    append([frame("unlink-original", "删除名字", "🗑️", "note.txt 从目录树中消失", "`unlink` 删除的是目录项。若还有硬链接或打开文件表引用，inode #7 与 B10 仍不能回收。软链接因为目标路径不存在，会变成悬挂链接。", "link", removed, [{ target: "mei 目录项", from: "note.txt → #7", to: "已移除", tone: "link" }, { target: "inode #7 链接计数", from: state.noteInode?.links.toString() ?? "—", to: removed.noteInode?.links.toString() ?? "—", tone: "inode" }, { target: "B10", from: "不变", to: "不变（尚不可回收）", tone: "disk" }], ["directory", "inode", "blocks"])]);
  };

  const unlinkCopy = () => {
    if (!state.hardLink || state.copyUnlinked || state.reclaimed) return;
    const removed = cloneState(state);
    removed.copyUnlinked = true;
    if (removed.noteInode) {
      removed.noteInode.links = Math.max(0, removed.noteInode.links - 1);
      removed.noteInode.status = "待写回";
      removed.noteInode.note = "最后一个硬链接已删除；因为文件仍打开，所以先等待 close。";
    }
    append([frame("unlink-copy", "删除最后链接", "🧹", "链接计数归零，但文件还没消失", "目录树现在找不到 inode #7 的名字了。可系统打开文件表仍持有它，因此数据块 B10 继续保留到最后一个 `close`。", "link", removed, [{ target: "inode #7 链接计数", from: state.noteInode?.links.toString() ?? "—", to: "0", tone: "inode" }, { target: "系统打开文件表", from: state.fileOpen ? "仍引用 #7" : "无引用", to: state.fileOpen ? "延迟回收" : "可回收", tone: "memory" }], ["directory", "inode", "memory"])]);
  };

  const closeFile = () => {
    if (!state.fileOpen) return;
    const closed = cloneState(state);
    closed.fileOpen = false;
    closed.fd = null;
    closed.offset = 0;
    const shouldReclaim = closed.noteInode?.links === 0;
    if (!shouldReclaim) {
      append([frame("close", "关闭", "🔐", "fd 3 已归还给进程", "fd 表与系统打开文件表的运行时引用被释放。inode 仍可留在缓存中；`close` 本身不是持久化命令。", "memory", closed, [{ target: "进程 fd 表", from: "fd 3 → OFT #1", to: "空闲", tone: "memory" }, { target: "系统打开文件表", from: "inode #7", to: "引用归零，回收表项", tone: "memory" }], ["memory", "inode"])]);
      return;
    }
    const reclaimed = cloneState(closed);
    reclaimed.reclaimed = true;
    reclaimed.fileCreated = false;
    reclaimed.fileWritten = false;
    reclaimed.synced = false;
    reclaimed.dirty = false;
    reclaimed.cacheContent = "";
    reclaimed.diskContent = "";
    reclaimed.inodeBitmap[7] = false;
    reclaimed.dataBitmap[10] = false;
    removeActive(reclaimed, 7);
    if (reclaimed.noteInode) {
      reclaimed.noteInode.status = "已回收";
      reclaimed.noteInode.size = 0;
      reclaimed.noteInode.direct = [];
      reclaimed.noteInode.note = "最后一个打开引用释放后，inode #7 和 B10 回到空闲池。";
    }
    append([
      frame("close-last", "关闭", "🔐", "最后一个打开引用离开了", "现在 fd 表和系统打开文件表都不再持有 inode #7；链接计数早已是 0，因此回收条件已经满足。", "memory", closed, [{ target: "系统打开文件表", from: "仍引用 inode #7", to: "引用归零", tone: "memory" }], ["memory", "inode"]),
      frame("reclaim", "回收空间", "♻️", "inode #7 和 B10 回到空闲池", "inode 位图和数据块位图对应位清零；目录树中没有名字，数据区与 inode 区的占用也被释放。", "done", reclaimed, [{ target: "inode 位图[7]", from: "1", to: "0（空闲）", tone: "inode" }, { target: "数据块位图[10]", from: "1", to: "0（空闲）", tone: "disk" }, { target: "inode #7 / B10", from: "占用", to: "已回收", tone: "done" }], ["inode", "blocks", "free", "directory"]),
    ]);
  };

  const mountUsb = () => {
    if (!state.mounted || state.externalMounted) return;
    const mounting = cloneState(state);
    const mounted = cloneState(mounting);
    mounted.externalMounted = true;
    append([
      frame("recognize-usb", "挂载 USB", "🔌", "VFS 认识了一个外部文件系统", "外部设备的分区与文件系统被识别。VFS 准备用统一接口把它接到现有目录树。", "boot", mounting, [{ target: "外部文件系统", from: "未接入", to: "等待挂载 /mnt/usb", tone: "boot" }], ["vfs", "disk"]),
      frame("mount-usb", "挂载 USB", "🛸", "/mnt/usb 现在通向另一棵树", "挂载点原有内容在挂载期间被暂时遮蔽；从这个路径访问时，VFS 会分派给外部文件系统实现。", "done", mounted, [{ target: "VFS 挂载表", from: "root FS → /", to: "root FS → / · USB FS → /mnt/usb", tone: "done" }], ["vfs", "directory"]),
    ]);
  };

  const reset = () => {
    setHistory([initialFrame()]);
    setCursor(0);
    setPlaying(false);
    setSelected("overview");
    setAllocation("hybrid");
    setFreeMode("bitmap");
  };

  const recommendation = useMemo(() => {
    if (previewing) return "先沿时间线走完这组变化，再进行下一次操作";
    if (!state.mounted) return "先启动并挂载根文件系统";
    if (!state.fileCreated) return "下一步：新建一个空文件";
    if (!state.fileOpen && noteExists(state)) return "下一步：打开文件，观察 fd 表";
    if (state.fileOpen && !state.fileWritten) return "下一步：写入 hello-fs!";
    if (state.fileOpen && state.fileWritten && !state.synced) return "下一步：同步脏页到磁盘";
    if (state.fileOpen && !state.hardLink) return "可以先加一个硬链接，再删除名字";
    if (state.fileOpen && state.hardLink && !state.originalUnlinked) return "下一步：删除原来的 note.txt";
    if (state.fileOpen && state.hardLink && state.originalUnlinked && !state.copyUnlinked) return "下一步：删除最后一个硬链接";
    if (state.fileOpen) return "最后关闭 fd，看看空间何时回收";
    return "可以挂载 USB，或重置后再走一遍";
  }, [previewing, state]);

  return (
    <main className="fs-game-page">
      <div className="fs-game-stars" aria-hidden="true"><i>✦</i><i>✦</i><i>✦</i><i>✦</i><i>✦</i></div>
      <header className="fs-game-topbar">
        <Link href="/" className="fs-game-brand"><span>🧠</span><b>研刷 408</b></Link>
        <div className="fs-game-title"><span>OS · FILE SYSTEM</span><strong>文件系统冒险岛</strong></div>
        <div className="fs-game-top-actions"><Link href="/knowledge/os/files">原文资料</Link><button type="button" onClick={reset}>重新开局 ↻</button></div>
      </header>

      <section className="fs-game-hero">
        <div>
          <p>单人互动沙盘 · 每一步都能回看</p>
          <h1>让一个文件<br /><em>活</em>起来</h1>
          <p className="fs-game-hero-copy">从开机挂载到最后回收：目录项、inode、位图、数据块与内存状态会一起改变。你不需要答题，只要看见它们怎样协作。</p>
          <div className="fs-game-status"><span className={`state-${state.boot}`}>● {state.boot}</span><span>{state.mounted ? "根文件系统已挂载" : "目录树未挂载"}</span><span>{state.fileOpen ? "fd 3 打开中" : "没有打开的文件"}</span></div>
        </div>
        <DiskCharacter state={state} />
      </section>

      <section className="fs-game-control-strip" aria-label="沙盘操作">
        <div className="fs-game-recommendation"><span>下一步建议</span><strong>{recommendation}</strong></div>
        <div className="fs-game-actions">
          <ActionButton label="启动" icon="⚡" disabled={previewing || state.mounted} onClick={start} hint="从固件、内核到挂载根文件系统" />
          <ActionButton label="新建文件" icon="📝" disabled={previewing || !state.mounted || state.fileCreated} onClick={createFile} hint="分配 inode 并写入目录项" />
          <ActionButton label="打开" icon="🔓" disabled={previewing || !noteExists(state) || state.fileOpen} onClick={openFile} hint="建立 fd 表与系统打开文件表" />
          <ActionButton label="写入" icon="✍️" disabled={previewing || !state.fileOpen || state.fileWritten} onClick={writeFile} hint="先进入页缓存，再分配数据块" />
          <ActionButton label="同步" icon="💾" disabled={previewing || !state.fileOpen || !state.fileWritten || state.synced} onClick={syncFile} hint="fsync：将脏页与元数据写回磁盘" />
          <ActionButton label="硬链接" icon="🔗" disabled={previewing || !state.fileCreated || state.hardLink || state.originalUnlinked || state.reclaimed} onClick={addHardLink} hint="只增加目录项和链接计数，不复制数据" />
          <ActionButton label="软链接" icon="🪄" disabled={previewing || !state.fileCreated || state.softLink || state.reclaimed} onClick={addSoftLink} hint="创建独立 inode，保存目标路径字符串" />
          <ActionButton label="删 note" icon="🗑️" disabled={previewing || !state.fileCreated || state.originalUnlinked || state.reclaimed} onClick={unlinkOriginal} hint="unlink：删除目录项，不一定马上回收空间" />
          <ActionButton label="删最后链接" icon="🧹" disabled={previewing || !state.hardLink || state.copyUnlinked || state.reclaimed} onClick={unlinkCopy} hint="让 inode 链接计数归零" />
          <ActionButton label="关闭" icon="🔐" disabled={previewing || !state.fileOpen} onClick={closeFile} hint="释放 fd；若没有链接和打开引用才回收空间" />
          <ActionButton label="挂载 USB" icon="🛸" disabled={previewing || !state.mounted || state.externalMounted} onClick={mountUsb} hint="把外部文件系统接到 /mnt/usb" />
        </div>
      </section>

      <section className="fs-game-story" aria-live="polite">
        <div className={`fs-story-card tone-${current.tone}`}>
          <span>{current.icon}</span><div><small>{toneLabel[current.tone]} · 第 {cursor + 1} 步</small><h2>{current.title}</h2><p>{current.detail}</p></div>
        </div>
        <div className="fs-story-controls">
          <button type="button" onClick={() => setCursor((value) => Math.max(0, value - 1))} disabled={cursor === 0}>← 上一步</button>
          <button type="button" onClick={() => setPlaying((value) => !value)} disabled={cursor >= history.length - 1}>{playing ? "暂停" : "自动播放"}</button>
          <button type="button" onClick={() => setCursor((value) => Math.min(history.length - 1, value + 1))} disabled={cursor >= history.length - 1}>下一步 →</button>
        </div>
        <Timeline history={history} cursor={cursor} onStep={(index) => { setCursor(index); setPlaying(false); }} />
      </section>

      <section className="fs-game-diff" aria-label="本步骤变化清单">
        <div><span>本步骤变化</span><strong>{current.action}</strong></div>
        <ul>{current.changes.map((change, index) => <li key={`${change.target}-${index}`} className={`change-${change.tone}`}><b>{change.target}</b><span>{change.from}</span><i>→</i><strong>{change.to}</strong></li>)}</ul>
      </section>

      <section className="fs-game-workbench">
        <div className="fs-game-workbench-main">
          <DirectoryTree state={state} selected={selected} onSelect={setSelected} />
          <InodePanel state={state} selected={selected} onSelect={setSelected} />
          <MemoryPanel state={state} selected={selected} onSelect={setSelected} />
          <DiskPanel state={state} selected={selected} onSelect={setSelected} />
        </div>
        <aside className="fs-game-workbench-side">
          <section className="fs-game-mode-picker">
            <div><span>结构透视镜</span><strong>同一文件，换一种组织方式</strong></div>
            <div className="fs-mode-buttons" role="group" aria-label="选择文件分配方式">{(Object.keys(allocationLabels) as AllocationMode[]).map((mode) => <button key={mode} type="button" className={allocation === mode ? "active" : ""} aria-pressed={allocation === mode} onClick={() => setAllocation(mode)}>{allocationLabels[mode]}</button>)}</div>
          </section>
          <BlockPanel state={state} allocation={allocation} selected={selected} onSelect={setSelected} />
          <section className="fs-game-mode-picker free-picker">
            <div><span>空闲空间小管家</span><strong>同一批空闲块，换一种记账法</strong></div>
            <div className="fs-mode-buttons" role="group" aria-label="选择空闲空间管理方式">{(Object.keys(freeLabels) as FreeMode[]).map((mode) => <button key={mode} type="button" className={freeMode === mode ? "active" : ""} aria-pressed={freeMode === mode} onClick={() => setFreeMode(mode)}>{freeLabels[mode]}</button>)}</div>
          </section>
          <FreePanel state={state} freeMode={freeMode} selected={selected} onSelect={setSelected} />
          <VfsPanel state={state} selected={selected} onSelect={setSelected} />
        </aside>
      </section>

      <section className="fs-game-footer-note">
        <span>🧡 观察提醒</span>
        <p>这是一个用于理解关系与顺序的教学模型：具体文件系统的写回时机、缓存策略和底层实现会不同；这里保持的是 inode、目录项、打开文件表、位图、数据块与挂载的正确层次。</p>
      </section>
    </main>
  );
}
