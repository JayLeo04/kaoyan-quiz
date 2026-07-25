export type SectionSegment = {
  id: string;
  title: string;
  core_start: number;
  core_end: number;
  slice_start: number;
  slice_end: number;
  file: string;
};

export type KnowledgePoint = {
  id: string;
  title: string;
  level: number;
  page: number | null;
  parentId: string | null;
  segmentId: string | null;
};

export type StudyQuestion = {
  id: string;
  number: string;
  title: string;
  prompt: string;
  status: "真题" | "自录题";
  tags: string[];
  knowledgeIds: string[];
  year: number | null;
  questionNumber: number | null;
  questionType: "choice" | "answer" | "custom";
  section: string;
  options: { label: string; text: string }[];
  answer: string;
  solution: string;
  sourceUrl: string;
  sourceNote: string;
  images: string[];
};

export const sectionSegments: SectionSegment[] = [
  {
    "id": "os-1-1",
    "title": "1.1　简约不简单：从Hello World说起",
    "core_start": 28,
    "core_end": 28,
    "slice_start": 27,
    "slice_end": 29,
    "file": "os-1-1-p027-029.pdf"
  },
  {
    "id": "os-1-2",
    "title": "1.2　什么是操作系统",
    "core_start": 29,
    "core_end": 30,
    "slice_start": 28,
    "slice_end": 31,
    "file": "os-1-2-p028-031.pdf"
  },
  {
    "id": "os-1-3",
    "title": "1.3　操作系统简史",
    "core_start": 31,
    "core_end": 35,
    "slice_start": 30,
    "slice_end": 36,
    "file": "os-1-3-p030-036.pdf"
  },
  {
    "id": "os-1-4",
    "title": "1.4　操作系统接口",
    "core_start": 36,
    "core_end": 37,
    "slice_start": 35,
    "slice_end": 38,
    "file": "os-1-4-p035-038.pdf"
  },
  {
    "id": "os-2-1",
    "title": "2.1　操作系统的机制与策略",
    "core_start": 40,
    "core_end": 40,
    "slice_start": 39,
    "slice_end": 41,
    "file": "os-2-1-p039-041.pdf"
  },
  {
    "id": "os-2-2",
    "title": "2.2　操作系统复杂性的管理方法",
    "core_start": 41,
    "core_end": 42,
    "slice_start": 40,
    "slice_end": 43,
    "file": "os-2-2-p040-043.pdf"
  },
  {
    "id": "os-2-3",
    "title": "2.3　操作系统内核架构",
    "core_start": 43,
    "core_end": 51,
    "slice_start": 42,
    "slice_end": 52,
    "file": "os-2-3-p042-052.pdf"
  },
  {
    "id": "os-2-4",
    "title": "2.4　操作系统框架结构",
    "core_start": 52,
    "core_end": 54,
    "slice_start": 51,
    "slice_end": 55,
    "file": "os-2-4-p051-055.pdf"
  },
  {
    "id": "os-2-5",
    "title": "2.5　操作系统设计：Worse is better？",
    "core_start": 55,
    "core_end": 56,
    "slice_start": 54,
    "slice_end": 57,
    "file": "os-2-5-p054-057.pdf"
  },
  {
    "id": "os-2-6",
    "title": "2.6　ChCore：教学科研型微内核操作系统",
    "core_start": 57,
    "core_end": 57,
    "slice_start": 56,
    "slice_end": 58,
    "file": "os-2-6-p056-058.pdf"
  },
  {
    "id": "os-3-1",
    "title": "3.1　应用程序的硬件运行环境",
    "core_start": 61,
    "core_end": 79,
    "slice_start": 60,
    "slice_end": 80,
    "file": "os-3-1-p060-080.pdf"
  },
  {
    "id": "os-3-2",
    "title": "3.2　操作系统的硬件运行环境",
    "core_start": 80,
    "core_end": 92,
    "slice_start": 79,
    "slice_end": 93,
    "file": "os-3-2-p079-093.pdf"
  },
  {
    "id": "os-3-3",
    "title": "3.3　操作系统提供的基本抽象与接口",
    "core_start": 93,
    "core_end": 105,
    "slice_start": 92,
    "slice_end": 106,
    "file": "os-3-3-p092-106.pdf"
  },
  {
    "id": "os-4-1",
    "title": "4.1　CPU的职责：内存地址翻译",
    "core_start": 110,
    "core_end": 121,
    "slice_start": 109,
    "slice_end": 122,
    "file": "os-4-1-p109-122.pdf"
  },
  {
    "id": "os-4-2",
    "title": "4.2　操作系统的职责：管理页表映射",
    "core_start": 122,
    "core_end": 137,
    "slice_start": 121,
    "slice_end": 138,
    "file": "os-4-2-p121-138.pdf"
  },
  {
    "id": "os-4-3",
    "title": "4.3　案例分析：ChCore虚拟内存管理",
    "core_start": 138,
    "core_end": 143,
    "slice_start": 137,
    "slice_end": 144,
    "file": "os-4-3-p137-144.pdf"
  },
  {
    "id": "os-5-1",
    "title": "5.1　操作系统的职责：管理物理内存资源",
    "core_start": 148,
    "core_end": 159,
    "slice_start": 147,
    "slice_end": 160,
    "file": "os-5-1-p147-160.pdf"
  },
  {
    "id": "os-5-2",
    "title": "5.2　操作系统如何获得更多物理内存资源",
    "core_start": 160,
    "core_end": 168,
    "slice_start": 159,
    "slice_end": 169,
    "file": "os-5-2-p159-169.pdf"
  },
  {
    "id": "os-5-3",
    "title": "5.3　性能导向的内存分配扩展机制",
    "core_start": 169,
    "core_end": 176,
    "slice_start": 168,
    "slice_end": 177,
    "file": "os-5-3-p168-177.pdf"
  },
  {
    "id": "os-6-1",
    "title": "6.1　进程的内部表示与管理接口",
    "core_start": 180,
    "core_end": 194,
    "slice_start": 179,
    "slice_end": 195,
    "file": "os-6-1-p179-195.pdf"
  },
  {
    "id": "os-6-2",
    "title": "6.2　案例分析：ChCore微内核的进程管理",
    "core_start": 195,
    "core_end": 197,
    "slice_start": 194,
    "slice_end": 198,
    "file": "os-6-2-p194-198.pdf"
  },
  {
    "id": "os-6-3",
    "title": "6.3　案例分析：Linux的进程创建",
    "core_start": 198,
    "core_end": 204,
    "slice_start": 197,
    "slice_end": 205,
    "file": "os-6-3-p197-205.pdf"
  },
  {
    "id": "os-6-4",
    "title": "6.4　进程切换",
    "core_start": 205,
    "core_end": 216,
    "slice_start": 204,
    "slice_end": 217,
    "file": "os-6-4-p204-217.pdf"
  },
  {
    "id": "os-6-5",
    "title": "6.5　线程及其实现",
    "core_start": 217,
    "core_end": 227,
    "slice_start": 216,
    "slice_end": 228,
    "file": "os-6-5-p216-228.pdf"
  },
  {
    "id": "os-6-6",
    "title": "6.6　纤程",
    "core_start": 228,
    "core_end": 234,
    "slice_start": 227,
    "slice_end": 235,
    "file": "os-6-6-p227-235.pdf"
  },
  {
    "id": "os-7-1",
    "title": "7.1　处理器调度机制",
    "core_start": 236,
    "core_end": 239,
    "slice_start": 235,
    "slice_end": 240,
    "file": "os-7-1-p235-240.pdf"
  },
  {
    "id": "os-7-2",
    "title": "7.2　处理器调度指标",
    "core_start": 240,
    "core_end": 241,
    "slice_start": 239,
    "slice_end": 242,
    "file": "os-7-2-p239-242.pdf"
  },
  {
    "id": "os-7-3",
    "title": "7.3　经典调度策略",
    "core_start": 242,
    "core_end": 247,
    "slice_start": 241,
    "slice_end": 248,
    "file": "os-7-3-p241-248.pdf"
  },
  {
    "id": "os-7-4",
    "title": "7.4　优先级调度策略",
    "core_start": 248,
    "core_end": 254,
    "slice_start": 247,
    "slice_end": 255,
    "file": "os-7-4-p247-255.pdf"
  },
  {
    "id": "os-7-5",
    "title": "7.5　公平共享调度策略",
    "core_start": 255,
    "core_end": 261,
    "slice_start": 254,
    "slice_end": 262,
    "file": "os-7-5-p254-262.pdf"
  },
  {
    "id": "os-7-6",
    "title": "7.6　多核处理器调度机制",
    "core_start": 262,
    "core_end": 264,
    "slice_start": 261,
    "slice_end": 265,
    "file": "os-7-6-p261-265.pdf"
  },
  {
    "id": "os-7-7",
    "title": "7.7　案例分析：Linux调度器",
    "core_start": 265,
    "core_end": 271,
    "slice_start": 264,
    "slice_end": 272,
    "file": "os-7-7-p264-272.pdf"
  },
  {
    "id": "os-8-1",
    "title": "8.1　进程间通信基础",
    "core_start": 276,
    "core_end": 289,
    "slice_start": 275,
    "slice_end": 290,
    "file": "os-8-1-p275-290.pdf"
  },
  {
    "id": "os-8-2",
    "title": "8.2　文件接口IPC：管道",
    "core_start": 290,
    "core_end": 295,
    "slice_start": 289,
    "slice_end": 296,
    "file": "os-8-2-p289-296.pdf"
  },
  {
    "id": "os-8-3",
    "title": "8.3　内存接口IPC：共享内存",
    "core_start": 296,
    "core_end": 298,
    "slice_start": 295,
    "slice_end": 299,
    "file": "os-8-3-p295-299.pdf"
  },
  {
    "id": "os-8-4",
    "title": "8.4　消息接口IPC：消息队列",
    "core_start": 299,
    "core_end": 300,
    "slice_start": 298,
    "slice_end": 301,
    "file": "os-8-4-p298-301.pdf"
  },
  {
    "id": "os-8-5",
    "title": "8.5　案例分析：L4微内核的IPC优化",
    "core_start": 301,
    "core_end": 305,
    "slice_start": 300,
    "slice_end": 306,
    "file": "os-8-5-p300-306.pdf"
  },
  {
    "id": "os-8-6",
    "title": "8.6　案例分析：LRPC的迁移线程模型",
    "core_start": 306,
    "core_end": 308,
    "slice_start": 305,
    "slice_end": 309,
    "file": "os-8-6-p305-309.pdf"
  },
  {
    "id": "os-8-7",
    "title": "8.7　案例分析：ChCore进程间通信机制",
    "core_start": 309,
    "core_end": 310,
    "slice_start": 308,
    "slice_end": 311,
    "file": "os-8-7-p308-311.pdf"
  },
  {
    "id": "os-8-8",
    "title": "8.8　案例分析：Binder IPC",
    "core_start": 311,
    "core_end": 316,
    "slice_start": 310,
    "slice_end": 317,
    "file": "os-8-8-p310-317.pdf"
  },
  {
    "id": "os-9-1",
    "title": "9.1　同步场景",
    "core_start": 321,
    "core_end": 324,
    "slice_start": 320,
    "slice_end": 325,
    "file": "os-9-1-p320-325.pdf"
  },
  {
    "id": "os-9-2",
    "title": "9.2　同步原语",
    "core_start": 325,
    "core_end": 343,
    "slice_start": 324,
    "slice_end": 344,
    "file": "os-9-2-p324-344.pdf"
  },
  {
    "id": "os-9-3",
    "title": "9.3　死锁",
    "core_start": 344,
    "core_end": 351,
    "slice_start": 343,
    "slice_end": 352,
    "file": "os-9-3-p343-352.pdf"
  },
  {
    "id": "os-9-4",
    "title": "9.4　活锁",
    "core_start": 352,
    "core_end": 352,
    "slice_start": 351,
    "slice_end": 353,
    "file": "os-9-4-p351-353.pdf"
  },
  {
    "id": "os-10-1",
    "title": "10.1　互斥锁的实现",
    "core_start": 362,
    "core_end": 377,
    "slice_start": 361,
    "slice_end": 378,
    "file": "os-10-1-p361-378.pdf"
  },
  {
    "id": "os-10-4",
    "title": "10.4　读写锁的实现",
    "core_start": 378,
    "core_end": 381,
    "slice_start": 377,
    "slice_end": 382,
    "file": "os-10-4-p377-382.pdf"
  },
  {
    "id": "os-10-5",
    "title": "10.5　案例分析：Linux中的futex",
    "core_start": 382,
    "core_end": 385,
    "slice_start": 381,
    "slice_end": 386,
    "file": "os-10-5-p381-386.pdf"
  },
  {
    "id": "os-10-6",
    "title": "10.6　案例分析：微内核中的同步原语",
    "core_start": 386,
    "core_end": 386,
    "slice_start": 385,
    "slice_end": 387,
    "file": "os-10-6-p385-387.pdf"
  },
  {
    "id": "os-11-1",
    "title": "11.1　基于inode的文件系统",
    "core_start": 393,
    "core_end": 407,
    "slice_start": 392,
    "slice_end": 408,
    "file": "os-11-1-p392-408.pdf"
  },
  {
    "id": "os-11-2",
    "title": "11.2　基于表的文件系统",
    "core_start": 408,
    "core_end": 417,
    "slice_start": 407,
    "slice_end": 418,
    "file": "os-11-2-p407-418.pdf"
  },
  {
    "id": "os-11-3",
    "title": "11.3　虚拟文件系统",
    "core_start": 418,
    "core_end": 427,
    "slice_start": 417,
    "slice_end": 428,
    "file": "os-11-3-p417-428.pdf"
  },
  {
    "id": "os-11-4",
    "title": "11.4　VFS与缓存",
    "core_start": 428,
    "core_end": 430,
    "slice_start": 427,
    "slice_end": 431,
    "file": "os-11-4-p427-431.pdf"
  },
  {
    "id": "os-11-5",
    "title": "11.5　用户态文件系统",
    "core_start": 431,
    "core_end": 435,
    "slice_start": 430,
    "slice_end": 436,
    "file": "os-11-5-p430-436.pdf"
  },
  {
    "id": "os-12-1",
    "title": "12.1　崩溃一致性",
    "core_start": 441,
    "core_end": 442,
    "slice_start": 440,
    "slice_end": 443,
    "file": "os-12-1-p440-443.pdf"
  },
  {
    "id": "os-12-2",
    "title": "12.2　同步写入与文件系统一致性检查",
    "core_start": 443,
    "core_end": 446,
    "slice_start": 442,
    "slice_end": 447,
    "file": "os-12-2-p442-447.pdf"
  },
  {
    "id": "os-12-3",
    "title": "12.3　原子更新技术：日志",
    "core_start": 447,
    "core_end": 452,
    "slice_start": 446,
    "slice_end": 453,
    "file": "os-12-3-p446-453.pdf"
  },
  {
    "id": "os-12-4",
    "title": "12.4　原子更新技术：写时拷贝",
    "core_start": 453,
    "core_end": 456,
    "slice_start": 452,
    "slice_end": 457,
    "file": "os-12-4-p452-457.pdf"
  },
  {
    "id": "os-12-5",
    "title": "12.5　Soft updates",
    "core_start": 457,
    "core_end": 463,
    "slice_start": 456,
    "slice_end": 464,
    "file": "os-12-5-p456-464.pdf"
  },
  {
    "id": "os-12-6",
    "title": "12.6　案例分析：日志结构文件系统",
    "core_start": 464,
    "core_end": 471,
    "slice_start": 463,
    "slice_end": 472,
    "file": "os-12-6-p463-472.pdf"
  },
  {
    "id": "os-13-1",
    "title": "13.1　硬件设备基础",
    "core_start": 476,
    "core_end": 482,
    "slice_start": 475,
    "slice_end": 483,
    "file": "os-13-1-p475-483.pdf"
  },
  {
    "id": "os-13-2",
    "title": "13.2　设备发现与交互",
    "core_start": 483,
    "core_end": 500,
    "slice_start": 482,
    "slice_end": 501,
    "file": "os-13-2-p482-501.pdf"
  },
  {
    "id": "os-13-3",
    "title": "13.3　设备管理的共性功能",
    "core_start": 501,
    "core_end": 509,
    "slice_start": 500,
    "slice_end": 510,
    "file": "os-13-3-p500-510.pdf"
  },
  {
    "id": "os-13-4",
    "title": "13.4　应用I/O框架",
    "core_start": 510,
    "core_end": 513,
    "slice_start": 509,
    "slice_end": 514,
    "file": "os-13-4-p509-514.pdf"
  },
  {
    "id": "os-13-5",
    "title": "13.5　案例分析：Android操作系统的硬件抽象层",
    "core_start": 514,
    "core_end": 515,
    "slice_start": 513,
    "slice_end": 516,
    "file": "os-13-5-p513-516.pdf"
  },
  {
    "id": "os-14-1",
    "title": "14.1　系统虚拟化技术概述",
    "core_start": 520,
    "core_end": 521,
    "slice_start": 519,
    "slice_end": 522,
    "file": "os-14-1-p519-522.pdf"
  },
  {
    "id": "os-14-2",
    "title": "14.2　“下陷-模拟”方法",
    "core_start": 522,
    "core_end": 538,
    "slice_start": 521,
    "slice_end": 539,
    "file": "os-14-2-p521-539.pdf"
  },
  {
    "id": "os-14-4",
    "title": "14.4　内存虚拟化",
    "core_start": 539,
    "core_end": 548,
    "slice_start": 538,
    "slice_end": 549,
    "file": "os-14-4-p538-549.pdf"
  },
  {
    "id": "os-14-5",
    "title": "14.5　I/O虚拟化",
    "core_start": 549,
    "core_end": 557,
    "slice_start": 548,
    "slice_end": 558,
    "file": "os-14-5-p548-558.pdf"
  },
  {
    "id": "os-14-6",
    "title": "14.6　中断虚拟化",
    "core_start": 558,
    "core_end": 559,
    "slice_start": 557,
    "slice_end": 560,
    "file": "os-14-6-p557-560.pdf"
  },
  {
    "id": "os-14-7",
    "title": "14.7　案例分析：QEMU/KVM",
    "core_start": 560,
    "core_end": 564,
    "slice_start": 559,
    "slice_end": 565,
    "file": "os-14-7-p559-565.pdf"
  }
];

export const knowledgePoints: KnowledgePoint[] = [
  {
    "id": "OS-KP-1",
    "title": "第1章　操作系统概述",
    "level": 0,
    "page": 28,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-1-1",
    "title": "1.1　简约不简单：从Hello World说起",
    "level": 1,
    "page": 28,
    "parentId": "OS-KP-1",
    "segmentId": "os-1-1"
  },
  {
    "id": "OS-KP-1-2",
    "title": "1.2　什么是操作系统",
    "level": 1,
    "page": 29,
    "parentId": "OS-KP-1",
    "segmentId": "os-1-2"
  },
  {
    "id": "OS-KP-1-3",
    "title": "1.3　操作系统简史",
    "level": 1,
    "page": 31,
    "parentId": "OS-KP-1",
    "segmentId": "os-1-3"
  },
  {
    "id": "OS-KP-1-3-1",
    "title": "1.3.1　GM-NAA I/O：第一个（批处理）操作系统",
    "level": 2,
    "page": 31,
    "parentId": "OS-KP-1-3",
    "segmentId": "os-1-3"
  },
  {
    "id": "OS-KP-1-3-2",
    "title": "1.3.2　OS/360：从专用走向通用",
    "level": 2,
    "page": 32,
    "parentId": "OS-KP-1-3",
    "segmentId": "os-1-3"
  },
  {
    "id": "OS-KP-1-3-3",
    "title": "1.3.3　Multics/UNIX/Linux：分时与多任务",
    "level": 2,
    "page": 32,
    "parentId": "OS-KP-1-3",
    "segmentId": "os-1-3"
  },
  {
    "id": "OS-KP-1-3-4",
    "title": "1.3.4　macOS/Windows：以人为本的人机交互",
    "level": 2,
    "page": 33,
    "parentId": "OS-KP-1-3",
    "segmentId": "os-1-3"
  },
  {
    "id": "OS-KP-1-3-5",
    "title": "1.3.5　iOS/Android：移动互联网时代的操作系统",
    "level": 2,
    "page": 34,
    "parentId": "OS-KP-1-3",
    "segmentId": "os-1-3"
  },
  {
    "id": "OS-KP-1-4",
    "title": "1.4　操作系统接口",
    "level": 1,
    "page": 36,
    "parentId": "OS-KP-1",
    "segmentId": "os-1-4"
  },
  {
    "id": "OS-KP-2",
    "title": "第2章　操作系统结构",
    "level": 0,
    "page": 39,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-2-1",
    "title": "2.1　操作系统的机制与策略",
    "level": 1,
    "page": 40,
    "parentId": "OS-KP-2",
    "segmentId": "os-2-1"
  },
  {
    "id": "OS-KP-2-2",
    "title": "2.2　操作系统复杂性的管理方法",
    "level": 1,
    "page": 41,
    "parentId": "OS-KP-2",
    "segmentId": "os-2-2"
  },
  {
    "id": "OS-KP-2-3",
    "title": "2.3　操作系统内核架构",
    "level": 1,
    "page": 43,
    "parentId": "OS-KP-2",
    "segmentId": "os-2-3"
  },
  {
    "id": "OS-KP-2-3-1",
    "title": "2.3.1　简要结构",
    "level": 2,
    "page": 44,
    "parentId": "OS-KP-2-3",
    "segmentId": "os-2-3"
  },
  {
    "id": "OS-KP-2-3-2",
    "title": "2.3.2　宏内核",
    "level": 2,
    "page": 44,
    "parentId": "OS-KP-2-3",
    "segmentId": "os-2-3"
  },
  {
    "id": "OS-KP-2-3-3",
    "title": "2.3.3　微内核",
    "level": 2,
    "page": 46,
    "parentId": "OS-KP-2-3",
    "segmentId": "os-2-3"
  },
  {
    "id": "OS-KP-2-3-4",
    "title": "2.3.4　外核",
    "level": 2,
    "page": 48,
    "parentId": "OS-KP-2-3",
    "segmentId": "os-2-3"
  },
  {
    "id": "OS-KP-2-3-5",
    "title": "2.3.5　其他操作系统内核架构",
    "level": 2,
    "page": 50,
    "parentId": "OS-KP-2-3",
    "segmentId": "os-2-3"
  },
  {
    "id": "OS-KP-2-4",
    "title": "2.4　操作系统框架结构",
    "level": 1,
    "page": 52,
    "parentId": "OS-KP-2",
    "segmentId": "os-2-4"
  },
  {
    "id": "OS-KP-2-4-1",
    "title": "2.4.1　Android系统框架",
    "level": 2,
    "page": 52,
    "parentId": "OS-KP-2-4",
    "segmentId": "os-2-4"
  },
  {
    "id": "OS-KP-2-4-2",
    "title": "2.4.2　ROS系统框架",
    "level": 2,
    "page": 54,
    "parentId": "OS-KP-2-4",
    "segmentId": "os-2-4"
  },
  {
    "id": "OS-KP-2-5",
    "title": "2.5　操作系统设计：Worse is better？",
    "level": 1,
    "page": 55,
    "parentId": "OS-KP-2",
    "segmentId": "os-2-5"
  },
  {
    "id": "OS-KP-2-6",
    "title": "2.6　ChCore：教学科研型微内核操作系统",
    "level": 1,
    "page": 57,
    "parentId": "OS-KP-2",
    "segmentId": "os-2-6"
  },
  {
    "id": "OS-KP-3",
    "title": "第3章　硬件环境与软件抽象",
    "level": 0,
    "page": 61,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-3-1",
    "title": "3.1　应用程序的硬件运行环境",
    "level": 1,
    "page": 61,
    "parentId": "OS-KP-3",
    "segmentId": "os-3-1"
  },
  {
    "id": "OS-KP-3-1-1",
    "title": "3.1.1　程序的运行：用指令序列控制处理器",
    "level": 2,
    "page": 62,
    "parentId": "OS-KP-3-1",
    "segmentId": "os-3-1"
  },
  {
    "id": "OS-KP-3-1-2",
    "title": "3.1.2　处理数据：寄存器、运算和访存",
    "level": 2,
    "page": 64,
    "parentId": "OS-KP-3-1",
    "segmentId": "os-3-1"
  },
  {
    "id": "OS-KP-3-1-3",
    "title": "3.1.3　条件结构：程序分支和条件码",
    "level": 2,
    "page": 69,
    "parentId": "OS-KP-3-1",
    "segmentId": "os-3-1"
  },
  {
    "id": "OS-KP-3-1-4",
    "title": "3.1.4　函数的调用、返回与栈",
    "level": 2,
    "page": 72,
    "parentId": "OS-KP-3-1",
    "segmentId": "os-3-1"
  },
  {
    "id": "OS-KP-3-1-5",
    "title": "3.1.5　函数的调用惯例",
    "level": 2,
    "page": 76,
    "parentId": "OS-KP-3-1",
    "segmentId": "os-3-1"
  },
  {
    "id": "OS-KP-3-1-6",
    "title": "3.1.6　小结：应用程序依赖的处理器状态",
    "level": 2,
    "page": 78,
    "parentId": "OS-KP-3-1",
    "segmentId": "os-3-1"
  },
  {
    "id": "OS-KP-3-2",
    "title": "3.2　操作系统的硬件运行环境",
    "level": 1,
    "page": 80,
    "parentId": "OS-KP-3",
    "segmentId": "os-3-2"
  },
  {
    "id": "OS-KP-3-2-1",
    "title": "3.2.1　特权级别与系统ISA",
    "level": 2,
    "page": 80,
    "parentId": "OS-KP-3-2",
    "segmentId": "os-3-2"
  },
  {
    "id": "OS-KP-3-2-2",
    "title": "3.2.2　异常机制与异常向量表",
    "level": 2,
    "page": 83,
    "parentId": "OS-KP-3-2",
    "segmentId": "os-3-2"
  },
  {
    "id": "OS-KP-3-2-3",
    "title": "3.2.3　案例分析：ChCore启动与异常向量表初始化",
    "level": 2,
    "page": 86,
    "parentId": "OS-KP-3-2",
    "segmentId": "os-3-2"
  },
  {
    "id": "OS-KP-3-2-4",
    "title": "3.2.4　用户态与内核态的切换",
    "level": 2,
    "page": 87,
    "parentId": "OS-KP-3-2",
    "segmentId": "os-3-2"
  },
  {
    "id": "OS-KP-3-2-5",
    "title": "3.2.5　系统调用",
    "level": 2,
    "page": 90,
    "parentId": "OS-KP-3-2",
    "segmentId": "os-3-2"
  },
  {
    "id": "OS-KP-3-2-6",
    "title": "3.2.6　系统调用的优化",
    "level": 2,
    "page": 92,
    "parentId": "OS-KP-3-2",
    "segmentId": "os-3-2"
  },
  {
    "id": "OS-KP-3-3",
    "title": "3.3　操作系统提供的基本抽象与接口",
    "level": 1,
    "page": 93,
    "parentId": "OS-KP-3",
    "segmentId": "os-3-3"
  },
  {
    "id": "OS-KP-3-3-1",
    "title": "3.3.1　进程：对处理器的抽象",
    "level": 2,
    "page": 95,
    "parentId": "OS-KP-3-3",
    "segmentId": "os-3-3"
  },
  {
    "id": "OS-KP-3-3-2",
    "title": "3.3.2　案例分析：使用POSIX进程接口实现shell",
    "level": 2,
    "page": 96,
    "parentId": "OS-KP-3-3",
    "segmentId": "os-3-3"
  },
  {
    "id": "OS-KP-3-3-3",
    "title": "3.3.3　虚拟内存：对内存的抽象",
    "level": 2,
    "page": 99,
    "parentId": "OS-KP-3-3",
    "segmentId": "os-3-3"
  },
  {
    "id": "OS-KP-3-3-4",
    "title": "3.3.4　进程的虚拟内存布局",
    "level": 2,
    "page": 101,
    "parentId": "OS-KP-3-3",
    "segmentId": "os-3-3"
  },
  {
    "id": "OS-KP-3-3-5",
    "title": "3.3.5　文件：对存储设备的抽象",
    "level": 2,
    "page": 103,
    "parentId": "OS-KP-3-3",
    "segmentId": "os-3-3"
  },
  {
    "id": "OS-KP-3-3-6",
    "title": "3.3.6　文件：对所有设备的抽象",
    "level": 2,
    "page": 105,
    "parentId": "OS-KP-3-3",
    "segmentId": "os-3-3"
  },
  {
    "id": "OS-KP-4",
    "title": "第4章　虚拟内存管理",
    "level": 0,
    "page": 109,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-4-1",
    "title": "4.1　CPU的职责：内存地址翻译",
    "level": 1,
    "page": 110,
    "parentId": "OS-KP-4",
    "segmentId": "os-4-1"
  },
  {
    "id": "OS-KP-4-1-1",
    "title": "4.1.1　地址翻译",
    "level": 2,
    "page": 110,
    "parentId": "OS-KP-4-1",
    "segmentId": "os-4-1"
  },
  {
    "id": "OS-KP-4-1-2",
    "title": "4.1.2　分页机制",
    "level": 2,
    "page": null,
    "parentId": "OS-KP-4-1",
    "segmentId": "os-4-1"
  },
  {
    "id": "OS-KP-4-1-4",
    "title": "4.1.4　页表项与大页",
    "level": 2,
    "page": 117,
    "parentId": "OS-KP-4-1",
    "segmentId": "os-4-1"
  },
  {
    "id": "OS-KP-4-1-5",
    "title": "4.1.5　TLB：页表的缓存",
    "level": 2,
    "page": 119,
    "parentId": "OS-KP-4-1",
    "segmentId": "os-4-1"
  },
  {
    "id": "OS-KP-4-2",
    "title": "4.2　操作系统的职责：管理页表映射",
    "level": 1,
    "page": 122,
    "parentId": "OS-KP-4",
    "segmentId": "os-4-2"
  },
  {
    "id": "OS-KP-4-2-1",
    "title": "4.2.1　操作系统为自己配置页表",
    "level": 2,
    "page": 122,
    "parentId": "OS-KP-4-2",
    "segmentId": "os-4-2"
  },
  {
    "id": "OS-KP-4-2-2",
    "title": "4.2.2　如何填写进程页表",
    "level": 2,
    "page": 123,
    "parentId": "OS-KP-4-2",
    "segmentId": "os-4-2"
  },
  {
    "id": "OS-KP-4-2-3",
    "title": "4.2.3　何时填写进程页表：立即映射",
    "level": 2,
    "page": 127,
    "parentId": "OS-KP-4-2",
    "segmentId": "os-4-2"
  },
  {
    "id": "OS-KP-4-2-4",
    "title": "4.2.4　何时填写进程页表：延迟映射",
    "level": 2,
    "page": 130,
    "parentId": "OS-KP-4-2",
    "segmentId": "os-4-2"
  },
  {
    "id": "OS-KP-4-2-5",
    "title": "4.2.5　常见的改变虚拟内存区域的接口",
    "level": 2,
    "page": 134,
    "parentId": "OS-KP-4-2",
    "segmentId": "os-4-2"
  },
  {
    "id": "OS-KP-4-2-6",
    "title": "4.2.6　虚拟内存扩展功能",
    "level": 2,
    "page": 135,
    "parentId": "OS-KP-4-2",
    "segmentId": "os-4-2"
  },
  {
    "id": "OS-KP-4-3",
    "title": "4.3　案例分析：ChCore虚拟内存管理",
    "level": 1,
    "page": 138,
    "parentId": "OS-KP-4",
    "segmentId": "os-4-3"
  },
  {
    "id": "OS-KP-4-3-1",
    "title": "4.3.1　ChCore内核页表初始化",
    "level": 2,
    "page": 138,
    "parentId": "OS-KP-4-3",
    "segmentId": "os-4-3"
  },
  {
    "id": "OS-KP-4-3-2",
    "title": "4.3.2　ChCore内存管理",
    "level": 2,
    "page": 141,
    "parentId": "OS-KP-4-3",
    "segmentId": "os-4-3"
  },
  {
    "id": "OS-KP-5",
    "title": "第5章　物理内存管理",
    "level": 0,
    "page": 148,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-5-1",
    "title": "5.1　操作系统的职责：管理物理内存资源",
    "level": 1,
    "page": 148,
    "parentId": "OS-KP-5",
    "segmentId": "os-5-1"
  },
  {
    "id": "OS-KP-5-1-1",
    "title": "5.1.1　目标与评价维度",
    "level": 2,
    "page": 148,
    "parentId": "OS-KP-5-1",
    "segmentId": "os-5-1"
  },
  {
    "id": "OS-KP-5-1-2",
    "title": "5.1.2　基于位图的连续物理页分配方法",
    "level": 2,
    "page": 149,
    "parentId": "OS-KP-5-1",
    "segmentId": "os-5-1"
  },
  {
    "id": "OS-KP-5-1-3",
    "title": "5.1.3　伙伴系统原理",
    "level": 2,
    "page": 152,
    "parentId": "OS-KP-5-1",
    "segmentId": "os-5-1"
  },
  {
    "id": "OS-KP-5-1-4",
    "title": "5.1.4　案例分析：ChCore中伙伴系统的实现",
    "level": 2,
    "page": 153,
    "parentId": "OS-KP-5-1",
    "segmentId": "os-5-1"
  },
  {
    "id": "OS-KP-5-1-5",
    "title": "5.1.5　SLAB分配器的基本设计",
    "level": 2,
    "page": 157,
    "parentId": "OS-KP-5-1",
    "segmentId": "os-5-1"
  },
  {
    "id": "OS-KP-5-1-6",
    "title": "5.1.6　常用的空闲链表",
    "level": 2,
    "page": 159,
    "parentId": "OS-KP-5-1",
    "segmentId": "os-5-1"
  },
  {
    "id": "OS-KP-5-2",
    "title": "5.2　操作系统如何获得更多物理内存资源",
    "level": 1,
    "page": 160,
    "parentId": "OS-KP-5",
    "segmentId": "os-5-2"
  },
  {
    "id": "OS-KP-5-2-1",
    "title": "5.2.1　换页机制",
    "level": 2,
    "page": 160,
    "parentId": "OS-KP-5-2",
    "segmentId": "os-5-2"
  },
  {
    "id": "OS-KP-5-2-2",
    "title": "5.2.2　页替换策略",
    "level": 2,
    "page": 163,
    "parentId": "OS-KP-5-2",
    "segmentId": "os-5-2"
  },
  {
    "id": "OS-KP-5-2-3",
    "title": "5.2.3　页表项中的访问位与页替换策略实现",
    "level": 2,
    "page": 166,
    "parentId": "OS-KP-5-2",
    "segmentId": "os-5-2"
  },
  {
    "id": "OS-KP-5-2-4",
    "title": "5.2.4　工作集模型",
    "level": 2,
    "page": 167,
    "parentId": "OS-KP-5-2",
    "segmentId": "os-5-2"
  },
  {
    "id": "OS-KP-5-2-5",
    "title": "5.2.5　利用虚拟内存抽象节约物理内存资源",
    "level": 2,
    "page": 168,
    "parentId": "OS-KP-5-2",
    "segmentId": "os-5-2"
  },
  {
    "id": "OS-KP-5-3",
    "title": "5.3　性能导向的内存分配扩展机制",
    "level": 1,
    "page": 169,
    "parentId": "OS-KP-5",
    "segmentId": "os-5-3"
  },
  {
    "id": "OS-KP-5-3-1",
    "title": "5.3.1　物理内存与CPU缓存",
    "level": 2,
    "page": 170,
    "parentId": "OS-KP-5-3",
    "segmentId": "os-5-3"
  },
  {
    "id": "OS-KP-5-3-2",
    "title": "5.3.2　物理内存分配与CPU缓存",
    "level": 2,
    "page": 172,
    "parentId": "OS-KP-5-3",
    "segmentId": "os-5-3"
  },
  {
    "id": "OS-KP-5-3-3",
    "title": "5.3.3　多核与内存分配",
    "level": 2,
    "page": 173,
    "parentId": "OS-KP-5-3",
    "segmentId": "os-5-3"
  },
  {
    "id": "OS-KP-5-3-4",
    "title": "5.3.4　CPU缓存的硬件划分",
    "level": 2,
    "page": 173,
    "parentId": "OS-KP-5-3",
    "segmentId": "os-5-3"
  },
  {
    "id": "OS-KP-5-3-5",
    "title": "5.3.5　非一致内存访问（NUMA架构）",
    "level": 2,
    "page": 175,
    "parentId": "OS-KP-5-3",
    "segmentId": "os-5-3"
  },
  {
    "id": "OS-KP-5-3-6",
    "title": "5.3.6　NUMA架构与内存分配",
    "level": 2,
    "page": 176,
    "parentId": "OS-KP-5-3",
    "segmentId": "os-5-3"
  },
  {
    "id": "OS-KP-6",
    "title": "第6章　进程与线程",
    "level": 0,
    "page": 180,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-6-1",
    "title": "6.1　进程的内部表示与管理接口",
    "level": 1,
    "page": 180,
    "parentId": "OS-KP-6",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-1-1",
    "title": "6.1.1　进程的内部表示—PCB",
    "level": 2,
    "page": 180,
    "parentId": "OS-KP-6-1",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-1-2",
    "title": "6.1.2　进程创建的实现",
    "level": 2,
    "page": 181,
    "parentId": "OS-KP-6-1",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-1-3",
    "title": "6.1.3　进程退出的实现",
    "level": 2,
    "page": 185,
    "parentId": "OS-KP-6-1",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-1-4",
    "title": "6.1.4　进程等待的实现",
    "level": 2,
    "page": 186,
    "parentId": "OS-KP-6-1",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-1-5",
    "title": "6.1.5　exit与waitpid之间的信息传递",
    "level": 2,
    "page": 188,
    "parentId": "OS-KP-6-1",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-1-6",
    "title": "6.1.6　进程等待的范围与父子进程关系",
    "level": 2,
    "page": 190,
    "parentId": "OS-KP-6-1",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-1-7",
    "title": "6.1.7　进程睡眠的实现",
    "level": 2,
    "page": 192,
    "parentId": "OS-KP-6-1",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-1-8",
    "title": "6.1.8　进程执行状态及其管理",
    "level": 2,
    "page": 192,
    "parentId": "OS-KP-6-1",
    "segmentId": "os-6-1"
  },
  {
    "id": "OS-KP-6-2",
    "title": "6.2　案例分析：ChCore微内核的进程管理",
    "level": 1,
    "page": 195,
    "parentId": "OS-KP-6",
    "segmentId": "os-6-2"
  },
  {
    "id": "OS-KP-6-2-1",
    "title": "6.2.1　进程管理器与分离式PCB",
    "level": 2,
    "page": 195,
    "parentId": "OS-KP-6-2",
    "segmentId": "os-6-2"
  },
  {
    "id": "OS-KP-6-2-2",
    "title": "6.2.2　ChCore的进程操作：以进程创建为例",
    "level": 2,
    "page": 196,
    "parentId": "OS-KP-6-2",
    "segmentId": "os-6-2"
  },
  {
    "id": "OS-KP-6-3",
    "title": "6.3　案例分析：Linux的进程创建",
    "level": 1,
    "page": 198,
    "parentId": "OS-KP-6",
    "segmentId": "os-6-3"
  },
  {
    "id": "OS-KP-6-3-1",
    "title": "6.3.1　经典的进程创建方法：fork",
    "level": 2,
    "page": 198,
    "parentId": "OS-KP-6-3",
    "segmentId": "os-6-3"
  },
  {
    "id": "OS-KP-6-3-2",
    "title": "6.3.2　其他进程创建方法",
    "level": 2,
    "page": 201,
    "parentId": "OS-KP-6-3",
    "segmentId": "os-6-3"
  },
  {
    "id": "OS-KP-6-4",
    "title": "6.4　进程切换",
    "level": 1,
    "page": 205,
    "parentId": "OS-KP-6",
    "segmentId": "os-6-4"
  },
  {
    "id": "OS-KP-6-4-1",
    "title": "6.4.1　进程的处理器上下文",
    "level": 2,
    "page": 206,
    "parentId": "OS-KP-6-4",
    "segmentId": "os-6-4"
  },
  {
    "id": "OS-KP-6-4-2",
    "title": "6.4.2　进程的切换节点",
    "level": 2,
    "page": 206,
    "parentId": "OS-KP-6-4",
    "segmentId": "os-6-4"
  },
  {
    "id": "OS-KP-6-4-3",
    "title": "6.4.3　进程切换的全过程",
    "level": 2,
    "page": 207,
    "parentId": "OS-KP-6-4",
    "segmentId": "os-6-4"
  },
  {
    "id": "OS-KP-6-4-4",
    "title": "6.4.4　案例分析：ChCore的进程切换实现",
    "level": 2,
    "page": 208,
    "parentId": "OS-KP-6-4",
    "segmentId": "os-6-4"
  },
  {
    "id": "OS-KP-6-5",
    "title": "6.5　线程及其实现",
    "level": 1,
    "page": 217,
    "parentId": "OS-KP-6",
    "segmentId": "os-6-5"
  },
  {
    "id": "OS-KP-6-5-1",
    "title": "6.5.1　为什么需要线程",
    "level": 2,
    "page": 217,
    "parentId": "OS-KP-6-5",
    "segmentId": "os-6-5"
  },
  {
    "id": "OS-KP-6-5-2",
    "title": "6.5.2　用户视角看线程",
    "level": 2,
    "page": 218,
    "parentId": "OS-KP-6-5",
    "segmentId": "os-6-5"
  },
  {
    "id": "OS-KP-6-5-3",
    "title": "6.5.3　线程的实现：内核数据结构",
    "level": 2,
    "page": 220,
    "parentId": "OS-KP-6-5",
    "segmentId": "os-6-5"
  },
  {
    "id": "OS-KP-6-5-4",
    "title": "6.5.4　线程的实现：管理接口",
    "level": 2,
    "page": 221,
    "parentId": "OS-KP-6-5",
    "segmentId": "os-6-5"
  },
  {
    "id": "OS-KP-6-5-5",
    "title": "6.5.5　线程切换",
    "level": 2,
    "page": 226,
    "parentId": "OS-KP-6-5",
    "segmentId": "os-6-5"
  },
  {
    "id": "OS-KP-6-5-6",
    "title": "6.5.6　内核态线程与用户态线程",
    "level": 2,
    "page": 226,
    "parentId": "OS-KP-6-5",
    "segmentId": "os-6-5"
  },
  {
    "id": "OS-KP-6-6",
    "title": "6.6　纤程",
    "level": 1,
    "page": 228,
    "parentId": "OS-KP-6",
    "segmentId": "os-6-6"
  },
  {
    "id": "OS-KP-6-6-1",
    "title": "6.6.1　对纤程的需求：一个简单的例子",
    "level": 2,
    "page": 229,
    "parentId": "OS-KP-6-6",
    "segmentId": "os-6-6"
  },
  {
    "id": "OS-KP-6-6-2",
    "title": "6.6.2　POSIX的纤程支持：ucontext",
    "level": 2,
    "page": 230,
    "parentId": "OS-KP-6-6",
    "segmentId": "os-6-6"
  },
  {
    "id": "OS-KP-6-6-3",
    "title": "6.6.3　纤程切换",
    "level": 2,
    "page": 232,
    "parentId": "OS-KP-6-6",
    "segmentId": "os-6-6"
  },
  {
    "id": "OS-KP-7",
    "title": "第7章　处理器调度",
    "level": 0,
    "page": 236,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-7-1",
    "title": "7.1　处理器调度机制",
    "level": 1,
    "page": 236,
    "parentId": "OS-KP-7",
    "segmentId": "os-7-1"
  },
  {
    "id": "OS-KP-7-1-1",
    "title": "7.1.1　处理器调度对象",
    "level": 2,
    "page": 237,
    "parentId": "OS-KP-7-1",
    "segmentId": "os-7-1"
  },
  {
    "id": "OS-KP-7-1-2",
    "title": "7.1.2　处理器调度概览",
    "level": 2,
    "page": 237,
    "parentId": "OS-KP-7-1",
    "segmentId": "os-7-1"
  },
  {
    "id": "OS-KP-7-2",
    "title": "7.2　处理器调度指标",
    "level": 1,
    "page": 240,
    "parentId": "OS-KP-7",
    "segmentId": "os-7-2"
  },
  {
    "id": "OS-KP-7-3",
    "title": "7.3　经典调度策略",
    "level": 1,
    "page": 242,
    "parentId": "OS-KP-7",
    "segmentId": "os-7-3"
  },
  {
    "id": "OS-KP-7-3-1",
    "title": "7.3.1　先到先得",
    "level": 2,
    "page": 242,
    "parentId": "OS-KP-7-3",
    "segmentId": "os-7-3"
  },
  {
    "id": "OS-KP-7-3-2",
    "title": "7.3.2　最短任务优先",
    "level": 2,
    "page": 244,
    "parentId": "OS-KP-7-3",
    "segmentId": "os-7-3"
  },
  {
    "id": "OS-KP-7-3-3",
    "title": "7.3.3　最短完成时间优先",
    "level": 2,
    "page": 245,
    "parentId": "OS-KP-7-3",
    "segmentId": "os-7-3"
  },
  {
    "id": "OS-KP-7-3-4",
    "title": "7.3.4　时间片轮转",
    "level": 2,
    "page": 246,
    "parentId": "OS-KP-7-3",
    "segmentId": "os-7-3"
  },
  {
    "id": "OS-KP-7-3-5",
    "title": "7.3.5　经典调度策略的比较",
    "level": 2,
    "page": 247,
    "parentId": "OS-KP-7-3",
    "segmentId": "os-7-3"
  },
  {
    "id": "OS-KP-7-4",
    "title": "7.4　优先级调度策略",
    "level": 1,
    "page": 248,
    "parentId": "OS-KP-7",
    "segmentId": "os-7-4"
  },
  {
    "id": "OS-KP-7-4-1",
    "title": "7.4.1　高响应比优先",
    "level": 2,
    "page": 249,
    "parentId": "OS-KP-7-4",
    "segmentId": "os-7-4"
  },
  {
    "id": "OS-KP-7-4-2",
    "title": "7.4.2　多级队列与多级反馈队列",
    "level": 2,
    "page": 249,
    "parentId": "OS-KP-7-4",
    "segmentId": "os-7-4"
  },
  {
    "id": "OS-KP-7-4-3",
    "title": "7.4.3　优先级调度策略的比较",
    "level": 2,
    "page": 255,
    "parentId": "OS-KP-7-4",
    "segmentId": "os-7-4"
  },
  {
    "id": "OS-KP-7-5",
    "title": "7.5　公平共享调度策略",
    "level": 1,
    "page": 255,
    "parentId": "OS-KP-7",
    "segmentId": "os-7-5"
  },
  {
    "id": "OS-KP-7-5-1",
    "title": "7.5.1　彩票调度",
    "level": 2,
    "page": 257,
    "parentId": "OS-KP-7-5",
    "segmentId": "os-7-5"
  },
  {
    "id": "OS-KP-7-5-2",
    "title": "7.5.2　步幅调度",
    "level": 2,
    "page": 259,
    "parentId": "OS-KP-7-5",
    "segmentId": "os-7-5"
  },
  {
    "id": "OS-KP-7-5-3",
    "title": "7.5.3　份额与优先级的比较",
    "level": 2,
    "page": 261,
    "parentId": "OS-KP-7-5",
    "segmentId": "os-7-5"
  },
  {
    "id": "OS-KP-7-6",
    "title": "7.6　多核处理器调度机制",
    "level": 1,
    "page": 262,
    "parentId": "OS-KP-7",
    "segmentId": "os-7-6"
  },
  {
    "id": "OS-KP-7-6-1",
    "title": "7.6.1　运行队列",
    "level": 2,
    "page": 262,
    "parentId": "OS-KP-7-6",
    "segmentId": "os-7-6"
  },
  {
    "id": "OS-KP-7-6-2",
    "title": "7.6.2　负载均衡与负载追踪",
    "level": 2,
    "page": 263,
    "parentId": "OS-KP-7-6",
    "segmentId": "os-7-6"
  },
  {
    "id": "OS-KP-7-6-3",
    "title": "7.6.3　处理器亲和性",
    "level": 2,
    "page": 264,
    "parentId": "OS-KP-7-6",
    "segmentId": "os-7-6"
  },
  {
    "id": "OS-KP-7-7",
    "title": "7.7　案例分析：Linux调度器",
    "level": 1,
    "page": 265,
    "parentId": "OS-KP-7",
    "segmentId": "os-7-7"
  },
  {
    "id": "OS-KP-7-7-1",
    "title": "7.7.1　O（N）调度器",
    "level": 2,
    "page": 266,
    "parentId": "OS-KP-7-7",
    "segmentId": "os-7-7"
  },
  {
    "id": "OS-KP-7-7-2",
    "title": "7.7.2　O（1）调度器",
    "level": 2,
    "page": 267,
    "parentId": "OS-KP-7-7",
    "segmentId": "os-7-7"
  },
  {
    "id": "OS-KP-7-7-3",
    "title": "7.7.3　完全公平调度器",
    "level": 2,
    "page": 268,
    "parentId": "OS-KP-7-7",
    "segmentId": "os-7-7"
  },
  {
    "id": "OS-KP-7-7-4",
    "title": "7.7.4　Linux的细粒度负载追踪",
    "level": 2,
    "page": 270,
    "parentId": "OS-KP-7-7",
    "segmentId": "os-7-7"
  },
  {
    "id": "OS-KP-7-7-5",
    "title": "7.7.5　Linux的NUMA感知调度",
    "level": 2,
    "page": 271,
    "parentId": "OS-KP-7-7",
    "segmentId": "os-7-7"
  },
  {
    "id": "OS-KP-8",
    "title": "第8章　进程间通信",
    "level": 0,
    "page": 275,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-8-1",
    "title": "8.1　进程间通信基础",
    "level": 1,
    "page": 276,
    "parentId": "OS-KP-8",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-1",
    "title": "8.1.1　进程间通信接口",
    "level": 2,
    "page": 276,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-2",
    "title": "8.1.2　一个简单的进程间通信设计",
    "level": 2,
    "page": 279,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-3",
    "title": "8.1.3　数据传递",
    "level": 2,
    "page": 281,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-4",
    "title": "8.1.4　通知机制",
    "level": 2,
    "page": 283,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-5",
    "title": "8.1.5　单向和双向",
    "level": 2,
    "page": 283,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-6",
    "title": "8.1.6　同步和异步",
    "level": 2,
    "page": 284,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-7",
    "title": "8.1.7　超时机制",
    "level": 2,
    "page": 285,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-8",
    "title": "8.1.8　通信连接",
    "level": 2,
    "page": 286,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-9",
    "title": "8.1.9　权限检查",
    "level": 2,
    "page": 287,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-10",
    "title": "8.1.10　命名服务",
    "level": 2,
    "page": 288,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-1-11",
    "title": "8.1.11　总结",
    "level": 2,
    "page": 289,
    "parentId": "OS-KP-8-1",
    "segmentId": "os-8-1"
  },
  {
    "id": "OS-KP-8-2",
    "title": "8.2　文件接口IPC：管道",
    "level": 1,
    "page": 290,
    "parentId": "OS-KP-8",
    "segmentId": "os-8-2"
  },
  {
    "id": "OS-KP-8-2-1",
    "title": "8.2.1　Linux管道使用案例",
    "level": 2,
    "page": 291,
    "parentId": "OS-KP-8-2",
    "segmentId": "os-8-2"
  },
  {
    "id": "OS-KP-8-2-2",
    "title": "8.2.2　Linux中管道进程间通信的实现",
    "level": 2,
    "page": 293,
    "parentId": "OS-KP-8-2",
    "segmentId": "os-8-2"
  },
  {
    "id": "OS-KP-8-2-3",
    "title": "8.2.3　命名管道和匿名管道",
    "level": 2,
    "page": 295,
    "parentId": "OS-KP-8-2",
    "segmentId": "os-8-2"
  },
  {
    "id": "OS-KP-8-3",
    "title": "8.3　内存接口IPC：共享内存",
    "level": 1,
    "page": 296,
    "parentId": "OS-KP-8",
    "segmentId": "os-8-3"
  },
  {
    "id": "OS-KP-8-3-1",
    "title": "8.3.1　共享内存",
    "level": 2,
    "page": 296,
    "parentId": "OS-KP-8-3",
    "segmentId": "os-8-3"
  },
  {
    "id": "OS-KP-8-3-2",
    "title": "8.3.2　基于共享内存的进程间通信",
    "level": 2,
    "page": 298,
    "parentId": "OS-KP-8-3",
    "segmentId": "os-8-3"
  },
  {
    "id": "OS-KP-8-4",
    "title": "8.4　消息接口IPC：消息队列",
    "level": 1,
    "page": 299,
    "parentId": "OS-KP-8",
    "segmentId": "os-8-4"
  },
  {
    "id": "OS-KP-8-4-1",
    "title": "8.4.1　消息队列的结构",
    "level": 2,
    "page": 300,
    "parentId": "OS-KP-8-4",
    "segmentId": "os-8-4"
  },
  {
    "id": "OS-KP-8-4-2",
    "title": "8.4.2　基本操作",
    "level": 2,
    "page": 300,
    "parentId": "OS-KP-8-4",
    "segmentId": "os-8-4"
  },
  {
    "id": "OS-KP-8-5",
    "title": "8.5　案例分析：L4微内核的IPC优化",
    "level": 1,
    "page": 301,
    "parentId": "OS-KP-8",
    "segmentId": "os-8-5"
  },
  {
    "id": "OS-KP-8-5-1",
    "title": "8.5.1　L4消息传递",
    "level": 2,
    "page": 301,
    "parentId": "OS-KP-8-5",
    "segmentId": "os-8-5"
  },
  {
    "id": "OS-KP-8-5-2",
    "title": "8.5.2　L4控制流转移",
    "level": 2,
    "page": 303,
    "parentId": "OS-KP-8-5",
    "segmentId": "os-8-5"
  },
  {
    "id": "OS-KP-8-5-3",
    "title": "8.5.3　L4通信连接",
    "level": 2,
    "page": 305,
    "parentId": "OS-KP-8-5",
    "segmentId": "os-8-5"
  },
  {
    "id": "OS-KP-8-5-4",
    "title": "8.5.4　L4通信控制（权限检查）",
    "level": 2,
    "page": 305,
    "parentId": "OS-KP-8-5",
    "segmentId": "os-8-5"
  },
  {
    "id": "OS-KP-8-6",
    "title": "8.6　案例分析：LRPC的迁移线程模型",
    "level": 1,
    "page": 306,
    "parentId": "OS-KP-8",
    "segmentId": "os-8-6"
  },
  {
    "id": "OS-KP-8-6-1",
    "title": "8.6.1　迁移线程模型",
    "level": 2,
    "page": 307,
    "parentId": "OS-KP-8-6",
    "segmentId": "os-8-6"
  },
  {
    "id": "OS-KP-8-6-2",
    "title": "8.6.2　LRPC设计",
    "level": 2,
    "page": 307,
    "parentId": "OS-KP-8-6",
    "segmentId": "os-8-6"
  },
  {
    "id": "OS-KP-8-7",
    "title": "8.7　案例分析：ChCore进程间通信机制",
    "level": 1,
    "page": 309,
    "parentId": "OS-KP-8",
    "segmentId": "os-8-7"
  },
  {
    "id": "OS-KP-8-8",
    "title": "8.8　案例分析：Binder IPC",
    "level": 1,
    "page": 311,
    "parentId": "OS-KP-8",
    "segmentId": "os-8-8"
  },
  {
    "id": "OS-KP-8-8-1",
    "title": "8.8.1　总览",
    "level": 2,
    "page": 312,
    "parentId": "OS-KP-8-8",
    "segmentId": "os-8-8"
  },
  {
    "id": "OS-KP-8-8-2",
    "title": "8.8.2　Binder IPC内核设计",
    "level": 2,
    "page": 312,
    "parentId": "OS-KP-8-8",
    "segmentId": "os-8-8"
  },
  {
    "id": "OS-KP-8-8-3",
    "title": "8.8.3　匿名共享内存",
    "level": 2,
    "page": 316,
    "parentId": "OS-KP-8-8",
    "segmentId": "os-8-8"
  },
  {
    "id": "OS-KP-9",
    "title": "第9章　并发与同步",
    "level": 0,
    "page": 320,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-9-1",
    "title": "9.1　同步场景",
    "level": 1,
    "page": 321,
    "parentId": "OS-KP-9",
    "segmentId": "os-9-1"
  },
  {
    "id": "OS-KP-9-1-1",
    "title": "9.1.1　一个例子：多线程计数器",
    "level": 2,
    "page": 321,
    "parentId": "OS-KP-9-1",
    "segmentId": "os-9-1"
  },
  {
    "id": "OS-KP-9-1-2",
    "title": "9.1.2　同步的典型场景",
    "level": 2,
    "page": 323,
    "parentId": "OS-KP-9-1",
    "segmentId": "os-9-1"
  },
  {
    "id": "OS-KP-9-2",
    "title": "9.2　同步原语",
    "level": 1,
    "page": 325,
    "parentId": "OS-KP-9",
    "segmentId": "os-9-2"
  },
  {
    "id": "OS-KP-9-2-1",
    "title": "9.2.1　互斥锁",
    "level": 2,
    "page": 326,
    "parentId": "OS-KP-9-2",
    "segmentId": "os-9-2"
  },
  {
    "id": "OS-KP-9-2-2",
    "title": "9.2.2　读写锁",
    "level": 2,
    "page": 328,
    "parentId": "OS-KP-9-2",
    "segmentId": "os-9-2"
  },
  {
    "id": "OS-KP-9-2-3",
    "title": "9.2.3　条件变量",
    "level": 2,
    "page": 330,
    "parentId": "OS-KP-9-2",
    "segmentId": "os-9-2"
  },
  {
    "id": "OS-KP-9-2-4",
    "title": "9.2.4　信号量",
    "level": 2,
    "page": 339,
    "parentId": "OS-KP-9-2",
    "segmentId": "os-9-2"
  },
  {
    "id": "OS-KP-9-2-5",
    "title": "9.2.5　同步原语的比较",
    "level": 2,
    "page": 342,
    "parentId": "OS-KP-9-2",
    "segmentId": "os-9-2"
  },
  {
    "id": "OS-KP-9-3",
    "title": "9.3　死锁",
    "level": 1,
    "page": 344,
    "parentId": "OS-KP-9",
    "segmentId": "os-9-3"
  },
  {
    "id": "OS-KP-9-3-1",
    "title": "9.3.1　死锁的定义",
    "level": 2,
    "page": 344,
    "parentId": "OS-KP-9-3",
    "segmentId": "os-9-3"
  },
  {
    "id": "OS-KP-9-3-2",
    "title": "9.3.2　死锁检测与恢复",
    "level": 2,
    "page": 346,
    "parentId": "OS-KP-9-3",
    "segmentId": "os-9-3"
  },
  {
    "id": "OS-KP-9-3-3",
    "title": "9.3.3　死锁预防",
    "level": 2,
    "page": 347,
    "parentId": "OS-KP-9-3",
    "segmentId": "os-9-3"
  },
  {
    "id": "OS-KP-9-3-4",
    "title": "9.3.4　死锁避免",
    "level": 2,
    "page": 348,
    "parentId": "OS-KP-9-3",
    "segmentId": "os-9-3"
  },
  {
    "id": "OS-KP-9-3-5",
    "title": "9.3.5　哲学家问题",
    "level": 2,
    "page": 351,
    "parentId": "OS-KP-9-3",
    "segmentId": "os-9-3"
  },
  {
    "id": "OS-KP-9-4",
    "title": "9.4　活锁",
    "level": 1,
    "page": 352,
    "parentId": "OS-KP-9",
    "segmentId": "os-9-4"
  },
  {
    "id": "OS-KP-10",
    "title": "第10章　同步原语的实现",
    "level": 0,
    "page": 362,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-10-1",
    "title": "10.1　互斥锁的实现",
    "level": 1,
    "page": 362,
    "parentId": "OS-KP-10",
    "segmentId": "os-10-1"
  },
  {
    "id": "OS-KP-10-1-1",
    "title": "10.1.1　临界区问题",
    "level": 2,
    "page": 362,
    "parentId": "OS-KP-10-1",
    "segmentId": "os-10-1"
  },
  {
    "id": "OS-KP-10-1-2",
    "title": "10.1.2　硬件实现：关闭中断",
    "level": 2,
    "page": 363,
    "parentId": "OS-KP-10-1",
    "segmentId": "os-10-1"
  },
  {
    "id": "OS-KP-10-1-3",
    "title": "10.1.3　软件实现：皮特森算法",
    "level": 2,
    "page": 363,
    "parentId": "OS-KP-10-1",
    "segmentId": "os-10-1"
  },
  {
    "id": "OS-KP-10-1-4",
    "title": "10.1.4　软硬件协同：使用原子操作实现互斥锁",
    "level": 2,
    "page": 366,
    "parentId": "OS-KP-10-1",
    "segmentId": "os-10-1"
  },
  {
    "id": "OS-KP-10-2",
    "title": "10.2　条件变量的实现",
    "level": 1,
    "page": null,
    "parentId": "OS-KP-10",
    "segmentId": "os-10-1"
  },
  {
    "id": "OS-KP-10-3-1",
    "title": "10.3.1　非阻塞信号量",
    "level": 2,
    "page": 373,
    "parentId": "OS-KP-10-2",
    "segmentId": "os-10-1"
  },
  {
    "id": "OS-KP-10-3-2",
    "title": "10.3.2　阻塞信号量",
    "level": 2,
    "page": 374,
    "parentId": "OS-KP-10-2",
    "segmentId": "os-10-1"
  },
  {
    "id": "OS-KP-10-4",
    "title": "10.4　读写锁的实现",
    "level": 1,
    "page": 378,
    "parentId": "OS-KP-10",
    "segmentId": "os-10-4"
  },
  {
    "id": "OS-KP-10-4-1",
    "title": "10.4.1　偏向读者的读写锁",
    "level": 2,
    "page": 379,
    "parentId": "OS-KP-10-4",
    "segmentId": "os-10-4"
  },
  {
    "id": "OS-KP-10-4-2",
    "title": "10.4.2　偏向写者的读写锁",
    "level": 2,
    "page": 380,
    "parentId": "OS-KP-10-4",
    "segmentId": "os-10-4"
  },
  {
    "id": "OS-KP-10-5",
    "title": "10.5　案例分析：Linux中的futex",
    "level": 1,
    "page": 382,
    "parentId": "OS-KP-10",
    "segmentId": "os-10-5"
  },
  {
    "id": "OS-KP-10-6",
    "title": "10.6　案例分析：微内核中的同步原语",
    "level": 1,
    "page": 386,
    "parentId": "OS-KP-10",
    "segmentId": "os-10-6"
  },
  {
    "id": "OS-KP-11",
    "title": "第11章　文件系统",
    "level": 0,
    "page": 392,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-11-1",
    "title": "11.1　基于inode的文件系统",
    "level": 1,
    "page": 393,
    "parentId": "OS-KP-11",
    "segmentId": "os-11-1"
  },
  {
    "id": "OS-KP-11-1-1",
    "title": "11.1.1　一个不用inode的简单文件系统",
    "level": 2,
    "page": 393,
    "parentId": "OS-KP-11-1",
    "segmentId": "os-11-1"
  },
  {
    "id": "OS-KP-11-1-2",
    "title": "11.1.2　inode与文件",
    "level": 2,
    "page": 394,
    "parentId": "OS-KP-11-1",
    "segmentId": "os-11-1"
  },
  {
    "id": "OS-KP-11-1-3",
    "title": "11.1.3　多级inode",
    "level": 2,
    "page": 396,
    "parentId": "OS-KP-11-1",
    "segmentId": "os-11-1"
  },
  {
    "id": "OS-KP-11-1-4",
    "title": "11.1.4　文件名与目录",
    "level": 2,
    "page": 400,
    "parentId": "OS-KP-11-1",
    "segmentId": "os-11-1"
  },
  {
    "id": "OS-KP-11-1-5",
    "title": "11.1.5　存储布局",
    "level": 2,
    "page": 403,
    "parentId": "OS-KP-11-1",
    "segmentId": "os-11-1"
  },
  {
    "id": "OS-KP-11-1-6",
    "title": "11.1.6　从文件名到链接",
    "level": 2,
    "page": 404,
    "parentId": "OS-KP-11-1",
    "segmentId": "os-11-1"
  },
  {
    "id": "OS-KP-11-1-7",
    "title": "11.1.7　符号链接（软链接）",
    "level": 2,
    "page": 407,
    "parentId": "OS-KP-11-1",
    "segmentId": "os-11-1"
  },
  {
    "id": "OS-KP-11-2",
    "title": "11.2　基于表的文件系统",
    "level": 1,
    "page": 408,
    "parentId": "OS-KP-11",
    "segmentId": "os-11-2"
  },
  {
    "id": "OS-KP-11-2-1",
    "title": "11.2.1　FAT文件系统",
    "level": 2,
    "page": 408,
    "parentId": "OS-KP-11-2",
    "segmentId": "os-11-2"
  },
  {
    "id": "OS-KP-11-2-2",
    "title": "11.2.2　NTFS",
    "level": 2,
    "page": 412,
    "parentId": "OS-KP-11-2",
    "segmentId": "os-11-2"
  },
  {
    "id": "OS-KP-11-3",
    "title": "11.3　虚拟文件系统",
    "level": 1,
    "page": 418,
    "parentId": "OS-KP-11",
    "segmentId": "os-11-3"
  },
  {
    "id": "OS-KP-11-3-1",
    "title": "11.3.1　文件系统的内存结构",
    "level": 2,
    "page": 418,
    "parentId": "OS-KP-11-3",
    "segmentId": "os-11-3"
  },
  {
    "id": "OS-KP-11-3-2",
    "title": "11.3.2　面向文件系统的接口",
    "level": 2,
    "page": 420,
    "parentId": "OS-KP-11-3",
    "segmentId": "os-11-3"
  },
  {
    "id": "OS-KP-11-3-3",
    "title": "11.3.3　多文件系统的组织和管理",
    "level": 2,
    "page": 424,
    "parentId": "OS-KP-11-3",
    "segmentId": "os-11-3"
  },
  {
    "id": "OS-KP-11-3-4",
    "title": "11.3.4　伪文件系统",
    "level": 2,
    "page": 426,
    "parentId": "OS-KP-11-3",
    "segmentId": "os-11-3"
  },
  {
    "id": "OS-KP-11-4",
    "title": "11.4　VFS与缓存",
    "level": 1,
    "page": 428,
    "parentId": "OS-KP-11",
    "segmentId": "os-11-4"
  },
  {
    "id": "OS-KP-11-4-1",
    "title": "11.4.1　访问粒度不一致问题和一些优化",
    "level": 2,
    "page": 428,
    "parentId": "OS-KP-11-4",
    "segmentId": "os-11-4"
  },
  {
    "id": "OS-KP-11-4-2",
    "title": "11.4.2　读缓存",
    "level": 2,
    "page": 429,
    "parentId": "OS-KP-11-4",
    "segmentId": "os-11-4"
  },
  {
    "id": "OS-KP-11-4-3",
    "title": "11.4.3　写缓冲区与写合并",
    "level": 2,
    "page": 429,
    "parentId": "OS-KP-11-4",
    "segmentId": "os-11-4"
  },
  {
    "id": "OS-KP-11-4-4",
    "title": "11.4.4　页缓存",
    "level": 2,
    "page": 429,
    "parentId": "OS-KP-11-4",
    "segmentId": "os-11-4"
  },
  {
    "id": "OS-KP-11-4-5",
    "title": "11.4.5　直接I/O和缓存I/O",
    "level": 2,
    "page": 430,
    "parentId": "OS-KP-11-4",
    "segmentId": "os-11-4"
  },
  {
    "id": "OS-KP-11-4-6",
    "title": "11.4.6　内存映射",
    "level": 2,
    "page": 431,
    "parentId": "OS-KP-11-4",
    "segmentId": "os-11-4"
  },
  {
    "id": "OS-KP-11-5",
    "title": "11.5　用户态文件系统",
    "level": 1,
    "page": 431,
    "parentId": "OS-KP-11",
    "segmentId": "os-11-5"
  },
  {
    "id": "OS-KP-11-5-1",
    "title": "11.5.1　为什么需要用户态文件系统",
    "level": 2,
    "page": 432,
    "parentId": "OS-KP-11-5",
    "segmentId": "os-11-5"
  },
  {
    "id": "OS-KP-11-5-2",
    "title": "11.5.2　FUSE",
    "level": 2,
    "page": 432,
    "parentId": "OS-KP-11-5",
    "segmentId": "os-11-5"
  },
  {
    "id": "OS-KP-11-5-3",
    "title": "11.5.3　ChCore的文件系统架构",
    "level": 2,
    "page": 433,
    "parentId": "OS-KP-11-5",
    "segmentId": "os-11-5"
  },
  {
    "id": "OS-KP-12",
    "title": "第12章　文件系统崩溃一致性",
    "level": 0,
    "page": 440,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-12-1",
    "title": "12.1　崩溃一致性",
    "level": 1,
    "page": 441,
    "parentId": "OS-KP-12",
    "segmentId": "os-12-1"
  },
  {
    "id": "OS-KP-12-2",
    "title": "12.2　同步写入与文件系统一致性检查",
    "level": 1,
    "page": 443,
    "parentId": "OS-KP-12",
    "segmentId": "os-12-2"
  },
  {
    "id": "OS-KP-12-2-1",
    "title": "12.2.1　同步写入",
    "level": 2,
    "page": 443,
    "parentId": "OS-KP-12-2",
    "segmentId": "os-12-2"
  },
  {
    "id": "OS-KP-12-2-2",
    "title": "12.2.2　文件系统一致性检查",
    "level": 2,
    "page": 444,
    "parentId": "OS-KP-12-2",
    "segmentId": "os-12-2"
  },
  {
    "id": "OS-KP-12-2-3",
    "title": "12.2.3　fsck的局限和问题",
    "level": 2,
    "page": 446,
    "parentId": "OS-KP-12-2",
    "segmentId": "os-12-2"
  },
  {
    "id": "OS-KP-12-3",
    "title": "12.3　原子更新技术：日志",
    "level": 1,
    "page": 447,
    "parentId": "OS-KP-12",
    "segmentId": "os-12-3"
  },
  {
    "id": "OS-KP-12-3-1",
    "title": "12.3.1　日志机制的原理",
    "level": 2,
    "page": 447,
    "parentId": "OS-KP-12-3",
    "segmentId": "os-12-3"
  },
  {
    "id": "OS-KP-12-3-2",
    "title": "12.3.2　日志的批量化与合并优化",
    "level": 2,
    "page": 449,
    "parentId": "OS-KP-12-3",
    "segmentId": "os-12-3"
  },
  {
    "id": "OS-KP-12-3-3",
    "title": "12.3.3　日志应用实例：JBD2",
    "level": 2,
    "page": 449,
    "parentId": "OS-KP-12-3",
    "segmentId": "os-12-3"
  },
  {
    "id": "OS-KP-12-3-4",
    "title": "12.3.4　讨论和小结",
    "level": 2,
    "page": 453,
    "parentId": "OS-KP-12-3",
    "segmentId": "os-12-3"
  },
  {
    "id": "OS-KP-12-4",
    "title": "12.4　原子更新技术：写时拷贝",
    "level": 1,
    "page": 453,
    "parentId": "OS-KP-12",
    "segmentId": "os-12-4"
  },
  {
    "id": "OS-KP-12-4-1",
    "title": "12.4.1　写时拷贝的原理",
    "level": 2,
    "page": 454,
    "parentId": "OS-KP-12-4",
    "segmentId": "os-12-4"
  },
  {
    "id": "OS-KP-12-4-2",
    "title": "12.4.2　写时拷贝在文件系统中的应用",
    "level": 2,
    "page": 455,
    "parentId": "OS-KP-12-4",
    "segmentId": "os-12-4"
  },
  {
    "id": "OS-KP-12-4-3",
    "title": "12.4.3　写时拷贝的问题与优化",
    "level": 2,
    "page": 456,
    "parentId": "OS-KP-12-4",
    "segmentId": "os-12-4"
  },
  {
    "id": "OS-KP-12-4-4",
    "title": "12.4.4　讨论和小结",
    "level": 2,
    "page": 456,
    "parentId": "OS-KP-12-4",
    "segmentId": "os-12-4"
  },
  {
    "id": "OS-KP-12-5",
    "title": "12.5　Soft updates",
    "level": 1,
    "page": 457,
    "parentId": "OS-KP-12",
    "segmentId": "os-12-5"
  },
  {
    "id": "OS-KP-12-5-1",
    "title": "12.5.1　Soft updates的三条规则",
    "level": 2,
    "page": 458,
    "parentId": "OS-KP-12-5",
    "segmentId": "os-12-5"
  },
  {
    "id": "OS-KP-12-5-2",
    "title": "12.5.2　依赖追踪",
    "level": 2,
    "page": 460,
    "parentId": "OS-KP-12-5",
    "segmentId": "os-12-5"
  },
  {
    "id": "OS-KP-12-5-3",
    "title": "12.5.3　撤销和重做",
    "level": 2,
    "page": 461,
    "parentId": "OS-KP-12-5",
    "segmentId": "os-12-5"
  },
  {
    "id": "OS-KP-12-5-4",
    "title": "12.5.4　文件系统恢复",
    "level": 2,
    "page": 463,
    "parentId": "OS-KP-12-5",
    "segmentId": "os-12-5"
  },
  {
    "id": "OS-KP-12-5-5",
    "title": "12.5.5　讨论和小结",
    "level": 2,
    "page": 463,
    "parentId": "OS-KP-12-5",
    "segmentId": "os-12-5"
  },
  {
    "id": "OS-KP-12-6",
    "title": "12.6　案例分析：日志结构文件系统",
    "level": 1,
    "page": 464,
    "parentId": "OS-KP-12",
    "segmentId": "os-12-6"
  },
  {
    "id": "OS-KP-12-6-1",
    "title": "12.6.1　基本概念与空间布局",
    "level": 2,
    "page": 464,
    "parentId": "OS-KP-12-6",
    "segmentId": "os-12-6"
  },
  {
    "id": "OS-KP-12-6-2",
    "title": "12.6.2　数据访问与操作",
    "level": 2,
    "page": 465,
    "parentId": "OS-KP-12-6",
    "segmentId": "os-12-6"
  },
  {
    "id": "OS-KP-12-6-3",
    "title": "12.6.3　基于段的空间管理",
    "level": 2,
    "page": 467,
    "parentId": "OS-KP-12-6",
    "segmentId": "os-12-6"
  },
  {
    "id": "OS-KP-12-6-4",
    "title": "12.6.4　检查点和前滚",
    "level": 2,
    "page": 470,
    "parentId": "OS-KP-12-6",
    "segmentId": "os-12-6"
  },
  {
    "id": "OS-KP-12-6-5",
    "title": "12.6.5　小结",
    "level": 2,
    "page": 472,
    "parentId": "OS-KP-12-6",
    "segmentId": "os-12-6"
  },
  {
    "id": "OS-KP-13",
    "title": "第13章　设备管理",
    "level": 0,
    "page": 475,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-13-1",
    "title": "13.1　硬件设备基础",
    "level": 1,
    "page": 476,
    "parentId": "OS-KP-13",
    "segmentId": "os-13-1"
  },
  {
    "id": "OS-KP-13-1-1",
    "title": "13.1.1　总线互联",
    "level": 2,
    "page": 477,
    "parentId": "OS-KP-13-1",
    "segmentId": "os-13-1"
  },
  {
    "id": "OS-KP-13-1-2",
    "title": "13.1.2　设备的硬件接口",
    "level": 2,
    "page": 478,
    "parentId": "OS-KP-13-1",
    "segmentId": "os-13-1"
  },
  {
    "id": "OS-KP-13-1-3",
    "title": "13.1.3　几种常见的设备",
    "level": 2,
    "page": 478,
    "parentId": "OS-KP-13-1",
    "segmentId": "os-13-1"
  },
  {
    "id": "OS-KP-13-2",
    "title": "13.2　设备发现与交互",
    "level": 1,
    "page": 483,
    "parentId": "OS-KP-13",
    "segmentId": "os-13-2"
  },
  {
    "id": "OS-KP-13-2-1",
    "title": "13.2.1　CPU与设备的交互方式概览",
    "level": 2,
    "page": 484,
    "parentId": "OS-KP-13-2",
    "segmentId": "os-13-2"
  },
  {
    "id": "OS-KP-13-2-2",
    "title": "13.2.2　设备发现",
    "level": 2,
    "page": 486,
    "parentId": "OS-KP-13-2",
    "segmentId": "os-13-2"
  },
  {
    "id": "OS-KP-13-2-3",
    "title": "13.2.3　设备寄存器的访问",
    "level": 2,
    "page": 489,
    "parentId": "OS-KP-13-2",
    "segmentId": "os-13-2"
  },
  {
    "id": "OS-KP-13-2-4",
    "title": "13.2.4　中断",
    "level": 2,
    "page": 492,
    "parentId": "OS-KP-13-2",
    "segmentId": "os-13-2"
  },
  {
    "id": "OS-KP-13-2-5",
    "title": "13.2.5　直接内存访问",
    "level": 2,
    "page": 496,
    "parentId": "OS-KP-13-2",
    "segmentId": "os-13-2"
  },
  {
    "id": "OS-KP-13-3",
    "title": "13.3　设备管理的共性功能",
    "level": 1,
    "page": 501,
    "parentId": "OS-KP-13",
    "segmentId": "os-13-3"
  },
  {
    "id": "OS-KP-13-3-1",
    "title": "13.3.1　设备的文件抽象",
    "level": 2,
    "page": 501,
    "parentId": "OS-KP-13-3",
    "segmentId": "os-13-3"
  },
  {
    "id": "OS-KP-13-3-2",
    "title": "13.3.2　设备的逻辑分类",
    "level": 2,
    "page": 503,
    "parentId": "OS-KP-13-3",
    "segmentId": "os-13-3"
  },
  {
    "id": "OS-KP-13-3-3",
    "title": "13.3.3　设备的缓冲区管理",
    "level": 2,
    "page": 504,
    "parentId": "OS-KP-13-3",
    "segmentId": "os-13-3"
  },
  {
    "id": "OS-KP-13-3-4",
    "title": "13.3.4　设备的使用接口",
    "level": 2,
    "page": 508,
    "parentId": "OS-KP-13-3",
    "segmentId": "os-13-3"
  },
  {
    "id": "OS-KP-13-4",
    "title": "13.4　应用I/O框架",
    "level": 1,
    "page": 510,
    "parentId": "OS-KP-13",
    "segmentId": "os-13-4"
  },
  {
    "id": "OS-KP-13-4-1",
    "title": "13.4.1　应用层I/O库",
    "level": 2,
    "page": 510,
    "parentId": "OS-KP-13-4",
    "segmentId": "os-13-4"
  },
  {
    "id": "OS-KP-13-4-2",
    "title": "13.4.2　用户态I/O",
    "level": 2,
    "page": 512,
    "parentId": "OS-KP-13-4",
    "segmentId": "os-13-4"
  },
  {
    "id": "OS-KP-13-5",
    "title": "13.5　案例分析：Android操作系统的硬件抽象层",
    "level": 1,
    "page": 514,
    "parentId": "OS-KP-13",
    "segmentId": "os-13-5"
  },
  {
    "id": "OS-KP-14",
    "title": "第14章　系统虚拟化",
    "level": 0,
    "page": 519,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-14-1",
    "title": "14.1　系统虚拟化技术概述",
    "level": 1,
    "page": 520,
    "parentId": "OS-KP-14",
    "segmentId": "os-14-1"
  },
  {
    "id": "OS-KP-14-1-1",
    "title": "14.1.1　系统虚拟化及其组成部分",
    "level": 2,
    "page": 520,
    "parentId": "OS-KP-14-1",
    "segmentId": "os-14-1"
  },
  {
    "id": "OS-KP-14-1-2",
    "title": "14.1.2　虚拟机监控器的类型",
    "level": 2,
    "page": 521,
    "parentId": "OS-KP-14-1",
    "segmentId": "os-14-1"
  },
  {
    "id": "OS-KP-14-2",
    "title": "14.2　“下陷-模拟”方法",
    "level": 1,
    "page": 522,
    "parentId": "OS-KP-14",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-2-1",
    "title": "14.2.1　版本零：用进程模拟虚拟机内核态",
    "level": 2,
    "page": 523,
    "parentId": "OS-KP-14-2",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-2-2",
    "title": "14.2.2　版本一：模拟时钟中断",
    "level": 2,
    "page": 524,
    "parentId": "OS-KP-14-2",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-2-3",
    "title": "14.2.3　版本二：模拟用户态与系统调用",
    "level": 2,
    "page": 526,
    "parentId": "OS-KP-14-2",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-2-4",
    "title": "14.2.4　版本三：虚拟机内支持多个用户态线程",
    "level": 2,
    "page": 527,
    "parentId": "OS-KP-14-2",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-2-5",
    "title": "14.2.5　版本四：用线程模拟多个vCPU",
    "level": 2,
    "page": 528,
    "parentId": "OS-KP-14-2",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-2-6",
    "title": "14.2.6　小结",
    "level": 2,
    "page": 530,
    "parentId": "OS-KP-14-2",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-3",
    "title": "14.3　CPU虚拟化",
    "level": 1,
    "page": null,
    "parentId": "OS-KP-14",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-3-2",
    "title": "14.3.2　解释执行",
    "level": 2,
    "page": 532,
    "parentId": "OS-KP-14-3",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-3-3",
    "title": "14.3.3　动态二进制翻译",
    "level": 2,
    "page": 533,
    "parentId": "OS-KP-14-3",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-3-4",
    "title": "14.3.4　扫描-翻译",
    "level": 2,
    "page": 534,
    "parentId": "OS-KP-14-3",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-3-5",
    "title": "14.3.5　半虚拟化技术",
    "level": 2,
    "page": 535,
    "parentId": "OS-KP-14-3",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-3-6",
    "title": "14.3.6　硬件虚拟化技术",
    "level": 2,
    "page": 535,
    "parentId": "OS-KP-14-3",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-3-7",
    "title": "14.3.7　小结",
    "level": 2,
    "page": 538,
    "parentId": "OS-KP-14-3",
    "segmentId": "os-14-2"
  },
  {
    "id": "OS-KP-14-4",
    "title": "14.4　内存虚拟化",
    "level": 1,
    "page": 539,
    "parentId": "OS-KP-14",
    "segmentId": "os-14-4"
  },
  {
    "id": "OS-KP-14-4-1",
    "title": "14.4.1　影子页表机制",
    "level": 2,
    "page": 540,
    "parentId": "OS-KP-14-4",
    "segmentId": "os-14-4"
  },
  {
    "id": "OS-KP-14-4-2",
    "title": "14.4.2　直接页表映射机制",
    "level": 2,
    "page": 543,
    "parentId": "OS-KP-14-4",
    "segmentId": "os-14-4"
  },
  {
    "id": "OS-KP-14-4-3",
    "title": "14.4.3　两阶段地址翻译机制",
    "level": 2,
    "page": 544,
    "parentId": "OS-KP-14-4",
    "segmentId": "os-14-4"
  },
  {
    "id": "OS-KP-14-4-4",
    "title": "14.4.4　换页和气球机制",
    "level": 2,
    "page": 547,
    "parentId": "OS-KP-14-4",
    "segmentId": "os-14-4"
  },
  {
    "id": "OS-KP-14-4-5",
    "title": "14.4.5　小结",
    "level": 2,
    "page": 549,
    "parentId": "OS-KP-14-4",
    "segmentId": "os-14-4"
  },
  {
    "id": "OS-KP-14-5",
    "title": "14.5　I/O虚拟化",
    "level": 1,
    "page": 549,
    "parentId": "OS-KP-14",
    "segmentId": "os-14-5"
  },
  {
    "id": "OS-KP-14-5-1",
    "title": "14.5.1　软件模拟方法",
    "level": 2,
    "page": 550,
    "parentId": "OS-KP-14-5",
    "segmentId": "os-14-5"
  },
  {
    "id": "OS-KP-14-5-2",
    "title": "14.5.2　半虚拟化方法",
    "level": 2,
    "page": 552,
    "parentId": "OS-KP-14-5",
    "segmentId": "os-14-5"
  },
  {
    "id": "OS-KP-14-5-3",
    "title": "14.5.3　设备直通方法：IOMMU和SR-IOV",
    "level": 2,
    "page": 554,
    "parentId": "OS-KP-14-5",
    "segmentId": "os-14-5"
  },
  {
    "id": "OS-KP-14-5-4",
    "title": "14.5.4　小结",
    "level": 2,
    "page": 557,
    "parentId": "OS-KP-14-5",
    "segmentId": "os-14-5"
  },
  {
    "id": "OS-KP-14-6",
    "title": "14.6　中断虚拟化",
    "level": 1,
    "page": 558,
    "parentId": "OS-KP-14",
    "segmentId": "os-14-6"
  },
  {
    "id": "OS-KP-14-7",
    "title": "14.7　案例分析：QEMU/KVM",
    "level": 1,
    "page": 560,
    "parentId": "OS-KP-14",
    "segmentId": "os-14-7"
  },
  {
    "id": "OS-KP-14-7-1",
    "title": "14.7.1　KVM API和一个简单的虚拟机监控器",
    "level": 2,
    "page": 560,
    "parentId": "OS-KP-14-7",
    "segmentId": "os-14-7"
  },
  {
    "id": "OS-KP-14-7-2",
    "title": "14.7.2　KVM和QEMU",
    "level": 2,
    "page": 562,
    "parentId": "OS-KP-14-7",
    "segmentId": "os-14-7"
  },
  {
    "id": "OS-KP-14-7-3",
    "title": "14.7.3　KVM内部实现简介",
    "level": 2,
    "page": 564,
    "parentId": "OS-KP-14-7",
    "segmentId": "os-14-7"
  },
  {
    "id": "OS-KP-15",
    "title": "第15章　多核与多处理器",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-16",
    "title": "第16章　可扩展同步原语",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-17",
    "title": "第17章　多场景文件系统",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-18",
    "title": "第18章　存储系统",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-19",
    "title": "第19章　轻量级虚拟化",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-20",
    "title": "第20章　网络与系统",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-21",
    "title": "第21章　操作系统安全",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-22",
    "title": "第22章　操作系统调测",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-23",
    "title": "第23章　形式化证明",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-24",
    "title": "第24章　云操作系统",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-LAB-1",
    "title": "实验1：机器启动",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-LAB-2",
    "title": "实验2：内存管理",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-LAB-3",
    "title": "实验3：进程与线程、异常处理",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-LAB-4",
    "title": "实验4：多核、多进程、调度与IPC",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-LAB-5",
    "title": "实验5：文件系统与shell",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-LAB-6",
    "title": "实验6：设备驱动与持久化",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  },
  {
    "id": "OS-KP-LAB-7",
    "title": "实验7：进阶实践",
    "level": 0,
    "page": null,
    "parentId": null,
    "segmentId": null
  }
];

export const questionSeeds: StudyQuestion[] = [
  {
    "id": "real-2026-23",
    "number": "2026 年 · 第 23 题",
    "title": "2026 年 408 操作系统 · 第 23 题",
    "prompt": "下列操作中，在内核模式执行的是（）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-1",
      "OS-KP-3-2-4"
    ],
    "year": 2026,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "编译程序"
      },
      {
        "label": "B",
        "text": "链接程序"
      },
      {
        "label": "C",
        "text": "装入程序"
      },
      {
        "label": "D",
        "text": "命令解释程序"
      }
    ],
    "answer": "C",
    "solution": "【解析】 在操作系统中，内核模式用于执行特权指令和访问核心资源，如硬件管理和进程控制。编译程序、链接程序和命令解释程序通常作为用户空间的应用程序运行，在用户模式下执行；而装入程序负责将可执行文件加载到内存并启动进程，这一过程涉及内存分配和进程创建等特权操作，因此由操作系统内核在内核模式下执行。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#23",
    "sourceNote": "依据 2026 真题手册审计：内核模式与用户/内核态。",
    "images": []
  },
  {
    "id": "real-2026-24",
    "number": "2026 年 · 第 24 题",
    "title": "2026 年 408 操作系统 · 第 24 题",
    "prompt": "在支持虚拟存储器系统下的指令执行过程中，正确的是（）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-4-2-2",
      "OS-KP-3-2-2"
    ],
    "year": 2026,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "地址转换由操作系统完成"
      },
      {
        "label": "B",
        "text": "页表项的内容由编译器确定"
      },
      {
        "label": "C",
        "text": "缺页中断由硬件直接处理"
      },
      {
        "label": "D",
        "text": "异常由操作系统处理"
      }
    ],
    "answer": "D",
    "solution": "【解析】 在支持虚拟存储器的系统中，地址转换由硬件（如内存管理单元 MMU）完成，操作系统仅负责管理页表；页表项的内容由操作系统在运行时动态设置，而非编译器；缺页中断由硬件触发，但实际处理（如加载页面）由操作系统完成；异常（包括缺页异常、非法指令等）在触发后统一由操作系统处理。因此，选项 D 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#24",
    "sourceNote": "依据 2026 真题手册审计：MMU、地址翻译与异常入口。",
    "images": []
  },
  {
    "id": "real-2026-25",
    "number": "2026 年 · 第 25 题",
    "title": "2026 年 408 操作系统 · 第 25 题",
    "prompt": "下列关于的线程描述中，正确的是（）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-6-5-2",
      "OS-KP-6-5-6"
    ],
    "year": 2026,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "内核级线程和用户级线程都由操作系统创建"
      },
      {
        "label": "B",
        "text": "多个内核级线程可以映射到一个用户级线程"
      },
      {
        "label": "C",
        "text": "同一个进程下的多个内核级线程共享进程栈"
      },
      {
        "label": "D",
        "text": "同一个进程下的多个线程共享进程堆"
      }
    ],
    "answer": "D",
    "solution": "【解析】用户级线程由用户空间的线程库创建和管理，操作系统内核不参与其创建，因此 A 错误。在线程映射模型中，常见的是多个用户级线程映射到一个内核级线程（多对一模型），或多个用户级线程映射到多个内核级线程（多对多模型），但多个内核级线程映射到一个用户级线程并不符合典型模型，故 B 错误。栈是线程私有的，每个线程（包括内核级线程）都有自己的栈，因此同一进程下的多个内核级线程不共享进程栈，C 错误。堆是进程级别的资源，同一进程下的所有线程（包括用户级和内核级线程）共享进程堆，因此 D 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#25",
    "sourceNote": "依据 2026 真题手册审计：线程模型与实现。",
    "images": []
  },
  {
    "id": "real-2026-26",
    "number": "2026 年 · 第 26 题",
    "title": "2026 年 408 操作系统 · 第 26 题",
    "prompt": "系统中有 8 个进程，执行下图的操作，资源 S 的初始值为 5。若此时 S 的值为 -2，其中 m 表示执行到访问资源的进程个数，n 表示阻塞的进程个数，则 m 和 n 的值分别是（ ）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-4",
      "OS-KP-9-1-2"
    ],
    "year": 2026,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "5, 2"
      },
      {
        "label": "B",
        "text": "5, 1"
      },
      {
        "label": "C",
        "text": "6, 2"
      },
      {
        "label": "D",
        "text": "7, 1"
      }
    ],
    "answer": "A",
    "solution": "【解析】资源 S 是一个计数信号量，初始值为 5，表示最多允许 5 个进程同时访问资源。当信号量值 S 为负数时，其绝对值表示阻塞的进程数。当前 S = -2，因此阻塞进程数 n = 2。同时，当 S < 0 时，所有初始资源均被占用，即有 5 个进程正在访问资源（处于临界区）。m 表示执行到访问资源的进程个数，在此情境下理解为正在访问资源的进程数，故 m = 5。因此，m 和 n 的值分别为 5 和 2。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#26",
    "sourceNote": "依据 2026 真题手册审计：P/V 操作与信号量；题库版本表述以本地资料为准。",
    "images": [
      "/questions/2026/assets/q26-question-01.png"
    ]
  },
  {
    "id": "real-2026-27",
    "number": "2026 年 · 第 27 题",
    "title": "2026 年 408 操作系统 · 第 27 题",
    "prompt": "假设进程 P 的读、写进程集合分别是 R(P) 和 W(P) ，进程 Q 的读、写进程集合分别为 R(Q) 和 W(Q) ，则进程 P 和 Q 并发执行中，不会发生错误的并发执行充要条件是（ ） I. R(Q)∩W(P)=∅II. R(P)∩R(Q)=∅III. W(P)∩W(Q)=∅IV. R(P)∩W(Q)=∅",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-9-1-2",
      "OS-KP-9-2-1"
    ],
    "year": 2026,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "I、II"
      },
      {
        "label": "B",
        "text": "I、II、III"
      },
      {
        "label": "C",
        "text": "I、III、IV"
      },
      {
        "label": "D",
        "text": "II、III"
      }
    ],
    "answer": "C",
    "solution": "【解析】在进程并发执行中，不发生错误（即避免数据竞争和冲突）的充要条件基于 Bernstein 条件。Bernstein 条件指出，两个进程 P 和 Q 可安全并发执行当且仅当满足以下三个条件：W(P)∩R(Q)=∅ （避免写后读冲突）；R(P)∩W(Q)=∅ （避免读后写冲突）；W(P)∩W(Q)=∅ （避免写后写冲突）。读 - 读冲突（即 R(P)∩R(Q) ）不会导致数据不一致，因此不是必要条件。对比题目中的条件：I 对应 W(P)∩R(Q)=∅ ，III 对应 W(P)∩W(Q)=∅ ，IV 对应 R(P)∩W(Q)=∅ ，而 II 是 R(P)∩R(Q)=∅ ，无需满足。因此，充要条件是 I、III 和 IV，对应选项 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#27",
    "sourceNote": "依据 2026 真题手册审计：Bernstein 条件与互斥。",
    "images": []
  },
  {
    "id": "real-2026-28",
    "number": "2026 年 · 第 28 题",
    "title": "2026 年 408 操作系统 · 第 28 题",
    "prompt": "若 64 位的系统采用三级虚拟分页存储管理方式，其结构如下图所示，第三级页表所占用的页框数是（ ） | 补充位（25） | 一级页表（9） | 二级页表（9） | 三级页表（9） | 页内偏移（12） |",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2",
      "OS-KP-4-1-4"
    ],
    "year": 2026,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "256"
      },
      {
        "label": "C",
        "text": "256K"
      },
      {
        "label": "D",
        "text": "256M"
      }
    ],
    "answer": "C",
    "solution": "在三级虚拟分页存储管理方式中，虚拟地址结构包括一级页表索引（9 位）、二级页表索引（9 位）、三级页表索引（9 位）和页内偏移（12 位）。页内偏移 12 位对应页面大小为 4 KB（ 212 字节）。每个页表索引为 9 位，因此每个页表有 29=512 个页表项。假设每个页表项大小为 8 字节（典型 64 位系统），则每个页表大小为 512×8=4096 字节，恰好占用一个页框。三级页表的数量由一级和二级页表决定：一级页表有 512 个条目，每个条目指向一个二级页表，因此最多有 512 个二级页表；每个二级页表有 512 个条目，每个条目指向一个三级页表，因此三级页表的最大数量为 512×512=262144 个。每个三级页表占用一个页框，所以三级页表总共占用的页框数为 262144，即 256 K（因为 256×1024=262144 ）。因此，正确答案为 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#28",
    "sourceNote": "依据 2026 真题手册审计：多级页表。",
    "images": []
  },
  {
    "id": "real-2026-29",
    "number": "2026 年 · 第 29 题",
    "title": "2026 年 408 操作系统 · 第 29 题",
    "prompt": "下列方法中能够有效降低系统平均访存时间的是（） I. TLBII. 多级页表III. 工作集概念IV. 页表缓冲队列",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-5",
      "OS-KP-5-2-4",
      "OS-KP-5-2-2"
    ],
    "year": 2026,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "I、III"
      },
      {
        "label": "B",
        "text": "II、III"
      },
      {
        "label": "C",
        "text": "I、III、IV"
      },
      {
        "label": "D",
        "text": "I、II、IV"
      }
    ],
    "answer": "C",
    "solution": "【解析】 TLB（快表）能够缓存虚拟地址到物理地址的转换结果，在 TLB 命中时直接获取物理地址，避免访问内存中的页表，从而有效降低访存延迟。工作集概念用于指导页面置换算法，通过维持进程最近访问的页面集合在内存中，减少缺页中断的发生，降低缺页率，进而减少平均访存时间。页表缓冲队列可以缓存页表项，减少访问主存页表的次数，加速地址转换过程，也有助于降低平均访存时间。多级页表的主要目的是节省页表占用的内存空间，但可能增加地址转换的步数，导致访存延迟增加，因此不能有效降低平均访存时间。故正确选项为 I、III、IV，即 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#29",
    "sourceNote": "依据 2026 真题手册审计：TLB、工作集与页缓冲；题库版本表述以本地资料为准。",
    "images": []
  },
  {
    "id": "real-2026-30",
    "number": "2026 年 · 第 30 题",
    "title": "2026 年 408 操作系统 · 第 30 题",
    "prompt": "进程 P1 和 P2 共享一个文件 R，该文件的页表项分别是 R1 和 R2，其在 2 个进程中的虚拟地址分别是 W1 和 W2，则下列说法中正确的是（ ）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-4-2-5",
      "OS-KP-11-4-6"
    ],
    "year": 2026,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "页表项 R1 和 R2 的内容完全不同"
      },
      {
        "label": "B",
        "text": "W1 和 W2 映射的物理地址相同"
      },
      {
        "label": "C",
        "text": "进程 P1 对 W1 的修改不会影响 P2 对 W2 的访问"
      },
      {
        "label": "D",
        "text": "W1 和 W2 虚拟地址相同"
      }
    ],
    "answer": "B",
    "solution": "【解析】进程 P1 和 P2 共享文件 R，这意味着它们通过各自的页表项 R1 和 R2 将虚拟地址 W1 和 W2 映射到相同的物理内存区域，因此 W1 和 W2 映射的物理地址相同。选项 A 错误，因为页表项 R1 和 R2 至少物理地址部分相同，内容并非完全不同；选项 C 错误，由于共享物理内存，P1 对 W1 的修改会影响 P2 对 W2 的访问；选项 D 错误，虚拟地址是进程独立的，W1 和 W2 不一定相同。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#30",
    "sourceNote": "依据 2026 真题手册审计：共享页、内存映射与文件接口；存在资料版本差异。",
    "images": []
  },
  {
    "id": "real-2026-31",
    "number": "2026 年 · 第 31 题",
    "title": "2026 年 408 操作系统 · 第 31 题",
    "prompt": "下列关于驱动程序的描述中，错误的是（）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-13-3-2",
      "OS-KP-13-5"
    ],
    "year": 2026,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "驱动程序是硬件与操作系统之间的接口程序"
      },
      {
        "label": "B",
        "text": "驱动程序需根据硬件特性定制开发"
      },
      {
        "label": "C",
        "text": "驱动程序需要设置统一的接口"
      },
      {
        "label": "D",
        "text": "字符设备、块设备都是同一种 IO 方式"
      }
    ],
    "answer": "D",
    "solution": "【解析】驱动程序是硬件与操作系统之间的接口程序，使操作系统能够控制和管理硬件，因此 A 正确；由于不同硬件具有不同的特性和操作方式，驱动程序需要针对具体硬件进行定制开发，因此 B 正确；为了便于操作系统统一管理和调用，驱动程序需要遵循操作系统提供的统一接口规范，因此 C 正确；字符设备和块设备是两种不同的 I/O 方式：字符设备以字符流为单位进行数据传输（例如键盘），而块设备以固定大小的数据块为单位（例如硬盘），因此 D 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#31",
    "sourceNote": "依据 2026 真题手册审计：设备驱动与 HAL。",
    "images": []
  },
  {
    "id": "real-2026-32",
    "number": "2026 年 · 第 32 题",
    "title": "2026 年 408 操作系统 · 第 32 题",
    "prompt": "下列操作中，鼠标中断处理程序完成的是（）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-13-2-4",
      "OS-KP-13-2-3"
    ],
    "year": 2026,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "解析鼠标的输入指令含义"
      },
      {
        "label": "B",
        "text": "将鼠标数据同步到用户应用程序缓冲区"
      },
      {
        "label": "C",
        "text": "将数据从输入设备传输到数据寄存器"
      },
      {
        "label": "D",
        "text": "将数据从数据寄存器传输到内核缓冲区"
      }
    ],
    "answer": "D",
    "solution": "【解析】 鼠标中断处理程序的主要职责是在硬件中断触发时，快速从数据寄存器中读取鼠标的原始数据，并将其送入内核缓冲区，以便操作系统内核或输入子系统后续处理。选项 D 直接描述了这一核心操作；而选项 A 涉及高级解析，通常由驱动程序或应用程序完成；选项 B 涉及用户空间同步，一般由内核的其他部分负责；选项 C 涉及硬件传输，可能由硬件或 DMA 完成，并非中断处理程序的主要职责。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#32",
    "sourceNote": "依据 2026 真题手册审计：中断驱动 I/O 与寄存器访问。",
    "images": []
  },
  {
    "id": "real-2026-45",
    "number": "2026 年 · 第 45 题",
    "title": "2026 年 408 操作系统 · 第 45 题",
    "prompt": "（本题满分 7 分） 系统采用优先级（优先级越大表示优先级越高）与时间片轮转调度算法，仅当发生时钟中断时才触发抢占 CPU 操作，时钟中断间隔为 10 ms。进程首次进入就绪队列时，其时间片为 50 ms。若进程因时间片用完而返回就绪队列，其优先级值减 1；若进程被更高优先级进程抢占而返回就绪队列，其优先级值保持不变。当多个进程优先级相同时，先进入就绪队列的进程优先被调度。四个进程的到达时刻、初始优先级与 CPU 运行时间如下表所示： 进程到达就绪队列时间（ms）优先级CPU 运行时间（ms）P110395P210420P312240P414560 （1）从 10 ms 开始进程调度，直至所有进程调度结束，此时中断次数与 CPU 调度次数分别为多少？P1、P2、P3、P4 各自的首次调度发生在哪个时刻？（5 分） （2）若时间片由 50 ms 改为 100 ms，CPU 调度次数将增大、不变还是减少？若时钟中断间隔由 10 ms 改为 1 ms，系统开销将增大、不变还是减少？（2 分）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-7-1-2",
      "OS-KP-7-3-4",
      "OS-KP-7-4"
    ],
    "year": 2026,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "（1）中断次数、CPU 调度次数与各进程首次调度时刻模拟调度过程，考虑时钟中断每 10 ms 发生一次，进程到达、完成及调度事件如下：10 ms：P1、P2 到达，CPU 空闲，调度 P2 运行（首次调度）。20 ms：时钟中断，P2 运行 10 ms 后被更高优先级的 P4 抢占，调度 P4 运行（首次调度）。70 ms：时钟中断，P4 时间片用完，优先级减 1，调度 P2 运行。80 ms：时钟中断，P2 完成，调度 P4 运行。90 ms：时钟中断，P4 完成，调度 P1 运行（首次调度）。140 ms：时钟中断，P1 时间片用完，优先级减 1，调度 P3 运行（首次调度）。180 ms：时钟中断，P3 完成，调度 P1 运行。225 ms：P1 完成，所有进程结束。中断次数：从 10 ms 开始，时钟中断时刻为 10, 20, …, 220 ms，共 22 次。CPU 调度次数：共 7 次（10 ms、20 ms、70 ms、80 ms、90 ms、140 ms、180 ms）。首次调度时刻：P1:90 msP2:10 msP3:140 msP4:20 ms（2）参数变化的影响时间片由 50 ms 改为 100 ms：时间片增大，进程因时间片用完而让出 CPU 的次数减少，更多进程可能一次运行完成，从而降低进程切换频率，CPU 调度次数减少。时钟中断间隔由 10 ms 改为 1 ms：中断更频繁，每次中断均需进行调度检查，可能增加上下文切换次数与中断处理时间，系统开销增大。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#45",
    "sourceNote": "依据 2026 真题手册审计：调度事件、时间片轮转与优先级策略。",
    "images": []
  },
  {
    "id": "real-2026-46",
    "number": "2026 年 · 第 46 题",
    "title": "2026 年 408 操作系统 · 第 46 题",
    "prompt": "（本题满分 8 分） 文件系统的目录项包括文件名和索引节点号。磁盘包含索引节点表、位图、目录、文件数据等元数据。若盘块大小为 4 KB，盘块号占 4 B，索引节点表存放了系统的所有文件，从 0 开始编号，存放在盘块号 100 开始连续的 4096 个盘块中。索引节点占用 128 B，包含直接地址项 5 个，一级间接地址项、二级间接地址项、三级间接地址项各 1 个。磁盘位示图和索引节点位示图分别记录磁盘和索引节点的使用情况，0 表示未使用，1 表示已使用。其中目录结构图与文件的索引节点表如下所示（此处假定图中信息已给出），file 文件占 30 KB。 （1）file 的索引节点所在的盘块号是多少？若 file 的索引节点已经读取到内存，要访问 file 文件中偏移地址 21460 的一个字节数据，则最多需要读多少个盘块？如果文件系统中有足够的磁盘空间，则最多可以存放多少个文件？（3 分） （2）如果要删除目录 dir1，则需要对元数据进行哪些操作？（5 分）",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-2",
      "OS-KP-11-1-3",
      "OS-KP-11-1-4",
      "OS-KP-11-1-5"
    ],
    "year": 2026,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "（1）文件的索引节点所在盘块号：盘块大小为 4 KB，索引节点占用 128 B，每个盘块可存放 4096÷128=32 个索引节点。索引节点表从盘块号 100 开始，连续占用 4096 个盘块，索引节点从 0 开始编号。对于索引节点号 1000，块内偏移为 1000÷32=31 （余 8），因此 盘块号为 100+31=131 。访问偏移地址 21460 的一个字节最多需要读的盘块数：盘块大小为 4 KB，逻辑块号为 ⌊21460÷4096⌋=5 ，块内偏移为 21460mod4096=980 。索引节点有 5 个直接地址项（对应逻辑块号 0～4），逻辑块号 5 需通过一级间接地址项访问。索引节点已在内存，但一级间接块需从磁盘读取，再读取数据块，因此 最多需要读 2 个盘块（一级间接块和数据块）。最多可存放的文件数：索引节点表占用 4096 个盘块，每个盘块含 32 个索引节点，因此索引节点总数为 4096×32=131072 。每个文件（含目录）占用一个索引节点，故 最多可存放 131072 个文件。（2）删除目录 dir1（非空）需递归删除其下文件 file，再删除自身，对元数据的操作包括：删除文件 file：根据 file 的索引节点（节点号 1000）释放其占用的所有数据块（包括直接块、间接块及间接块本身），在磁盘位示图中将对应位清零。在索引节点位示图中将节点 1000 对应位清零。修改 dir1 的目录数据块，删除 file 的目录项。删除目录 dir1：释放 dir1 目录文件占用的数据块（存放目录项的数据块），在磁盘位示图中将对应位清零。在索引节点位示图中将 dir1 的索引节点（节点号 201）对应位清零。修改父目录 dir 的目录数据块，删除 dir1 的目录项。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2026/#46",
    "sourceNote": "依据 2026 真题手册审计：inode、多级索引、目录与删除元数据；存在资料版本差异。",
    "images": [
      "/questions/2026/assets/q46-question-01.png"
    ]
  },
  {
    "id": "real-2025-23",
    "number": "2025 年 · 第 23 题",
    "title": "2025 年 408 操作系统 · 第 23 题",
    "prompt": "在采用页式虚拟存储管理方式的系统中，当发生上下文切换时，下列寄存器中操作系统不需要更新的是（ ）。",
    "status": "真题",
    "tags": [
      "虚拟页式管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2",
      "OS-KP-4-2"
    ],
    "year": 2025,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "通用寄存器"
      },
      {
        "label": "B",
        "text": "页表基址寄存器"
      },
      {
        "label": "C",
        "text": "程序计数器"
      },
      {
        "label": "D",
        "text": "内核中断向量表基址寄存器"
      }
    ],
    "answer": "D",
    "solution": "在 上下文切换 时，操作系统需要保存和恢复与当前进程相关的状态信息。通用寄存器、页表基址寄存器和程序计数器通常会在上下文切换时更新，以切换到新进程的上下文。然而，内核 中断向量表 基址寄存器通常是系统级的，通常不会在每次上下文切换时更改，因此操作系统不需要在上下文切换时更新该寄存器。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-24",
    "number": "2025 年 · 第 24 题",
    "title": "2025 年 408 操作系统 · 第 24 题",
    "prompt": "关于虚拟化技术，下列说法错误的是（ ）。",
    "status": "真题",
    "tags": [
      "操作系统概念"
    ],
    "knowledgeIds": [
      "OS-KP-1-2"
    ],
    "year": 2025,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "操作系统可以在虚拟机上运行"
      },
      {
        "label": "B",
        "text": "一台主机可以支持多个虚拟机"
      },
      {
        "label": "C",
        "text": "VMM 与操作系统特权级相同"
      },
      {
        "label": "D",
        "text": "通过虚拟机技术，可以用一台主机上模拟多种 ISA"
      }
    ],
    "answer": "C",
    "solution": "A. 操作系统可以在虚拟机上运行 ✅正确。虚拟机（VM）提供了一个与真实硬件类似的环境，操作系统可以像在物理机上一样运行在虚拟机中。B. 一台主机可以支持多个虚拟机 ✅正确。虚拟化的核心能力之一就是在同一物理主机上运行多个虚拟机实例，每个实例看起来像是一台独立的机器。C. VMM 与操作系统特权级相同 ❌错误。VMM（虚拟机监控器或 Hypervisor）通常运行在比普通操作系统更高的特权级，因为它需要控制底层硬件资源，并管理多个客户操作系统。例如在 x86 架构中，VMM 通常在Ring -1（即硬件支持的更低层）运行，而操作系统在 Ring 0。 即使是某些 Type 2 Hypervisor（如 VMware Workstation）运行在宿主操作系统上，也会通过硬件辅助（如 Intel VT-x）获得高特权级访问。D. 通过虚拟机技术，可以用一台主机上模拟多种 ISA ✅正确，尽管这项功能涉及更多的是 仿真（emulation） 而非传统虚拟化。例如使用 QEMU 可以在 x86 主机上模拟 ARM、MIPS 等架构。不过现代虚拟化系统也可以部分结合硬件虚拟化技术来提高效率。所以正确答案是：C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-25",
    "number": "2025 年 · 第 25 题",
    "title": "2025 年 408 操作系统 · 第 25 题",
    "prompt": "在优先权调度中，采用单链表保存进程就绪队列，高优先级进程在队头。若就绪队列长度为 n，则插入进程、选出进程的时间复杂度为（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2025,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "O(1),O(1)"
      },
      {
        "label": "B",
        "text": "O(1),O(n)"
      },
      {
        "label": "C",
        "text": "O(n),O(1)"
      },
      {
        "label": "D",
        "text": "O(n),O(n)"
      }
    ],
    "answer": "C",
    "solution": "在 优先级调度 中，如果我们采用单链表来保存进程就绪队列，并且高优先级进程在队头，那么：插入进程时，需要根据优先级找到合适的位置插入，因此时间复杂度为 O(n)。选出进程（即从队头选出最高优先级的进程）是一个 O(1) 的操作，因为高优先级的进程总是在队头。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-26",
    "number": "2025 年 · 第 26 题",
    "title": "2025 年 408 操作系统 · 第 26 题",
    "prompt": "现有一 LRU 算法，采用固定分配局部置换的页面置换策略，已为进程分配 3 个页框，页面访问序列为 {0,1,2,0,5,1,4,3,0,2,3,2,0 }，其中 0,1,2 已调入内存。则缺页次数是（ ）。",
    "status": "真题",
    "tags": [
      "页面置换算法",
      "LRU"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-2"
    ],
    "year": 2025,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "5"
      },
      {
        "label": "B",
        "text": "6"
      },
      {
        "label": "C",
        "text": "7"
      },
      {
        "label": "D",
        "text": "8"
      }
    ],
    "answer": "B",
    "solution": "在 LRU 算法中，每当需要访问一个不在当前内存中的页面时，就需要进行置换操作，并选择当前内存中最久未使用的页面进行替换。我们按照给定的页面访问序列进行模拟：初始状态：内存中页面为 {0, 1, 2}，访问序列：访问页面是否命中/缺页之后的内存页面0命中{1, 2, 0}1命中{2, 0, 1}2命中{0, 1, 2}0命中{1, 2, 0}5缺页，替换页面 1{2, 0, 5}1缺页，替换页面 2{0, 5, 1}4缺页，替换页面 0{5, 1, 4}3缺页，替换页面 5{1, 4, 3}0缺页，替换页面 1{4, 3, 0}2缺页，替换页面 4{3, 0, 2}3命中{0, 2, 3}2命中{0, 3, 2}0命中{3, 2, 0}总计缺页次数为 6 次。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-27",
    "number": "2025 年 · 第 27 题",
    "title": "2025 年 408 操作系统 · 第 27 题",
    "prompt": "确定进程运行所需的最少页框数时，要考虑的指标是（ ）。",
    "status": "真题",
    "tags": [
      "虚拟页式管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2",
      "OS-KP-4-2"
    ],
    "year": 2025,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "代码段长"
      },
      {
        "label": "B",
        "text": "虚拟地址空间大小"
      },
      {
        "label": "C",
        "text": "物理地址空间大小"
      },
      {
        "label": "D",
        "text": "指令系统支持的寻址方式"
      }
    ],
    "answer": "D",
    "solution": "确定进程运行所需的最少页框数时，主要需考虑以下指标：D. 指令系统支持的寻址方式指令系统的寻址方式直接影响进程执行时可能访问的页框数量。例如，若指令支持间接寻址，则需更多页框以处理跨页访问的情况。每条指令若仅包含一个内存地址，则至少需1个页框；若涉及跨页访问或间接寻址，则需更多页框（如4个页框）。其他选项分析A. 代码段长‌：代码段长度影响总页框需求，但并非决定“最少”页框数的关键因素。B. 虚拟地址空间大小‌：虚拟地址空间大小决定进程可访问的地址范围，但实际所需页框数取决于当前执行需求而非虚拟空间上限。C. 物理地址空间大小‌：物理内存容量限制实际可分配的页框数，但与“最少”页框数的计算无关。综上，正确答案为 ‌D‌。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-28",
    "number": "2025 年 · 第 28 题",
    "title": "2025 年 408 操作系统 · 第 28 题",
    "prompt": "关于虚拟文件系统，下列说法正确的是（ ）。",
    "status": "真题",
    "tags": [
      "虚拟文件系统"
    ],
    "knowledgeIds": [
      "OS-KP-11-3"
    ],
    "year": 2025,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "虚拟文件系统是运行在虚拟内存的文件系统"
      },
      {
        "label": "B",
        "text": "VFS 可以加快文件系统的访问速度"
      },
      {
        "label": "C",
        "text": "VFS 定义了可访问不同文件系统的统一接口"
      },
      {
        "label": "D",
        "text": "VFS 只能访问本地文件系统，不能访问网络文件系统"
      }
    ],
    "answer": "C",
    "solution": "虚拟文件系统 是一个抽象层，提供了一种统一的接口，使操作系统能够支持不同类型的文件系统。它通过这种抽象，使得上层应用程序可以通过统一的接口访问不同的底层文件系统，而不需要关心底层文件系统的具体实现细节。A 是错误的：虚拟文件系统不是运行在虚拟内存的文件系统，而是一个抽象层。B 是错误的：VFS 的主要目的是提供统一接口，而不是直接加快访问速度，尽管统一接口可以间接提升开发效率。D 是错误的：VFS 能够支持访问包括本地和网络文件系统在内的多种文件系统类型。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-29",
    "number": "2025 年 · 第 29 题",
    "title": "2025 年 408 操作系统 · 第 29 题",
    "prompt": "某文件系统采用索引节点方式。用户在目录中新建文件 F 时，文件系统不会做的是（ ）。",
    "status": "真题",
    "tags": [
      "进程文件管理"
    ],
    "knowledgeIds": [
      "OS-KP-11-3-1"
    ],
    "year": 2025,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "初始化文件 F 的索引节点"
      },
      {
        "label": "B",
        "text": "在目录文件中写入 F 的索引节点号"
      },
      {
        "label": "C",
        "text": "在目录文件中写入 F 的访问权限信息"
      },
      {
        "label": "D",
        "text": "在目录文件中增加一条文件 F 对应的目录项"
      }
    ],
    "answer": "C",
    "solution": "当用户在目录中新建文件 F 时，文件系统通常会执行以下操作：A. 初始化文件 F 的 索引节点：为新文件创建一个索引节点，并初始化相关信息。B. 在 目录文件 中写入 F 的索引节点号：在目录中为文件 F 创建一个目录项，该目录项包含文件名和其对应的索引节点号。D. 在目录文件中增加一条文件 F 对应的目录项：在目录中增加一个新的目录项来表示新文件 F。选项 C 是错误的，因为访问权限信息通常存储在文件的索引节点中，而不是在目录文件中。目录文件只记录文件名及其对应的索引节点号。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-30",
    "number": "2025 年 · 第 30 题",
    "title": "2025 年 408 操作系统 · 第 30 题",
    "prompt": "关于内存映射文件，下列说法正确的是（ ）。 I. 可实现进程间通信 II. 实现了页面到磁盘块的映射 III. 将文件映射到进程的虚拟地址空间 IV. 将文件映射到系统的物理地址空间",
    "status": "真题",
    "tags": [
      "内存映射文件"
    ],
    "knowledgeIds": [
      "OS-KP-11-4-6"
    ],
    "year": 2025,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "I、III"
      },
      {
        "label": "B",
        "text": "I、IV"
      },
      {
        "label": "C",
        "text": "II、III"
      },
      {
        "label": "D",
        "text": "I、II、III"
      }
    ],
    "answer": "A",
    "solution": "本题考察 内存映射文件，现对选项进行逐一分析：I. 内存映射文件可以用于进程间通信，因为多个进程可以将同一个文件映射到各自的虚拟地址空间，从而共享数据。✅II. 这个选项比较有争议，按照大家的反馈，出题人想考查的应该是 磁盘块 → 页面的映射。❌III. 内存映射文件的核心概念就是将文件映射到进程的虚拟地址空间，使得进程可以通过访问内存来操作文件。✅IV. 内存映射文件是将文件映射到进程的虚拟地址空间，而不是直接映射到物理地址空间。虚拟地址空间最终会通过操作系统的内存管理单元（MMU）映射到物理地址空间。❌所以正确的是 I、III，选择 A。【注意】 严格来说，II 的描述是符合现代操作系统的实现的（比如 linux 中的 mmap 接口中如果开启 MAP_SHARED（共享映射），写入页面即写入磁盘，即 页面 和 磁盘块 是双向映射关系）。估计出卷人的意思是内存映射文件 语义 是 磁盘块 → 页面的映射，而不是 页面 → 磁盘块，所以 II 是错误的，从这种角度来看也说得通。要是考场上这种题真的错了那就认了吧，毕竟这种概念题有分歧在 408 是很正常的，但是数量也会比较少就是了。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-31",
    "number": "2025 年 · 第 31 题",
    "title": "2025 年 408 操作系统 · 第 31 题",
    "prompt": "下列选项中，可被文件系统用于外存空间使用情况的是（ ）。",
    "status": "真题",
    "tags": [
      "外存空间管理"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-5"
    ],
    "year": 2025,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "目录"
      },
      {
        "label": "B",
        "text": "系统打开文件表"
      },
      {
        "label": "C",
        "text": "文件分配表（FAT）"
      },
      {
        "label": "D",
        "text": "文件控制块（FCB）"
      }
    ],
    "answer": "C",
    "solution": "文件分配表（FAT）是文件系统用来记录磁盘块（簇）使用情况的数据结构。它记录了哪些磁盘块是空闲的，哪些已经被文件占用，因此文件系统可以通过 FAT 来管理空闲空间。A. 目录用于存储文件和子目录的元数据（如文件名、位置等），但不直接管理空闲空间。B. 系统打开文件表：用于记录当前打开的文件及其状态，与空闲空间管理无关。D. 文件控制块（FCB）：FCB 记录单个文件的元数据（如大小、位置等），不直接记录整个外存空间使用情况。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-32",
    "number": "2025 年 · 第 32 题",
    "title": "2025 年 408 操作系统 · 第 32 题",
    "prompt": "下列选项中，文件系统能为温彻斯特硬盘和固态硬盘提供的功能是（ ）。",
    "status": "真题",
    "tags": [
      "磁盘概念"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3"
    ],
    "year": 2025,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "划分扇区"
      },
      {
        "label": "B",
        "text": "确定盘块大小"
      },
      {
        "label": "C",
        "text": "降低寻道时间"
      },
      {
        "label": "D",
        "text": "实现均衡磨损"
      }
    ],
    "answer": "B",
    "solution": "关于文件系统能为温彻斯特硬盘（HDD）和固态硬盘（SSD）提供的功能，分析如下：A. 划分扇区‌扇区是磁盘物理结构的固有属性，由硬盘制造商在出厂时划分，文件系统不参与扇区的物理划分。B. 确定盘块大小‌文件系统通过逻辑格式化设定文件存储的基本单位（如 4KB 的块大小），这是文件系统对物理存储的逻辑抽象，适用于 HDD 和 SSD。C. 降低寻道时间‌寻道时间是 HDD 特有的机械性能指标，文件系统无法直接优化；而 SSD 无机械部件，不存在寻道时间问题。D. 实现均衡磨损‌这是 SSD 特有的功能，由 SSD 控制器通过磨损均衡算法实现，文件系统仅能通过 Trim 指令辅助，并非直接控制。正确答案：B（确定盘块大小）‌ 文件系统通过逻辑格式化统一管理存储空间，为 HDD 和 SSD 定义逻辑块大小，这是两者共有的功能。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-45",
    "number": "2025 年 · 第 45 题",
    "title": "2025 年 408 操作系统 · 第 45 题",
    "prompt": "三个人一起植树，甲挖坑，乙放树苗入坑并填土，丙负责为新种树苗浇水。步骤依次为：挖树坑，放树苗，填土和浇水。现在有铁锹和水桶各一个，铁锹用于挖树坑，填土。水桶用于浇水。当树坑数量小于 3 时，甲才可以挖树坑。设初始坑 = 0，铁锹水桶均可用，定义尽可能少的信号量，用 wait() 和 signal() 操作描述植树过程中三人的同步互斥关系，并说明所用信号量的作用及其初值。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2025,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "这题是一个近似于流水线的结构，其过程为：挖树坑（甲）→ 放树苗、填土（乙）→ 浇水（丙）。不过甲最多可以同时挖三个树苗，也就是说不允许同时存在 4 个未被乙使用的树坑，这是比较复杂的一点。实现甲和乙之间的同步需要使用到 pits 和 empty 这两个信号量，同时还需要一个 water 信号量来实现乙和丁的同步，代码实现如下：semaphore mutex = 1; // 对铁锹的使用需要互斥 semaphore pits = 3; // 甲还能挖洞的数量 sempahore empty = 0; // 可以使用的树坑数量 sempahore water = 0; // 需要浇水的水苗数量 甲() { while (1) { wait(pits); // 最多只能挖三个未被乙使用的坑 wait(mutex); // 占用铁锹 挖树坑； signal(mutex); // 释放铁锹 signal(empty); // 通知乙可以放树苗和填土了 } } 乙() { while (1) { wait(empty); // 等待到有树坑为止 wait(mutex); // 占用铁锹 放树苗、填土； signal(mutex); // 释放铁锹 signal(pits); // 通知甲可以继续挖坑了 signal(water); // 通知丙可以浇水了 } } 丙() { while (1) { wait(water); 浇水； } }",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2025-46",
    "number": "2025 年 · 第 46 题",
    "title": "2025 年 408 操作系统 · 第 46 题",
    "prompt": "某进程的虚拟地址空间如图，阴影部分为未占用区域，有 C 程序： char * ptr; void main() { int length; ptr=(char*) malloc(100); scanf(\"%s\", ptr); length = strlen(ptr); printf(\"length=%d\\n\", length); free(ptr) ; } (1) 上述程序执行时，PCB 位于哪个区域，执行 scanf () 等待键盘输入时，该进程处于什么状态？ (2) main() 函数的代码位于哪个区域？其直接调用的哪些函数的功能需要通过执行驱动程序实现？ (3) 变量 ptr 被分配在哪个区域？若变量 length 没有被分配在寄存器中，则会被分配在哪个区域？ptr 指向的字符串位于哪个区域？",
    "status": "真题",
    "tags": [
      "进程内存空间"
    ],
    "knowledgeIds": [
      "OS-KP-3-3-4"
    ],
    "year": 2025,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "本题考察 进程内存空间，题目中给出的内存结构和标准 linux 进程结构由些许差异，主要不同点在于图中的 读/写代码段 将 .bss 和 .data 融合了，考生看到能够理解就可以。1）进程管理属于操作系统提供的功能，所以 PCB（进程）位于内核区，执行 scanf() 时，进程在等待键盘 I/O，处于阻塞态。2）main() 函数的代码位于只读代码段（.text），其直接调用的 scanf() 和 printf() 需要执行驱动程序。3）ptr 是作为全局变量定义的，所以其位于读/写数据段，length 变量在 main 函数中定义，如果该变量不在寄存器中被分配的话，那么就位于用户栈段，ptr 指针指向的内存单元是使用 malloc 函数动态分配的，位于堆区。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2025/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2025/assets/q46-question-01.png"
    ]
  },
  {
    "id": "real-2024-23",
    "number": "2024 年 · 第 23 题",
    "title": "2024 年 408 操作系统 · 第 23 题",
    "prompt": "下面关于中断和异常的说法中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "异常和中断"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-2",
      "OS-KP-13-2-4"
    ],
    "year": 2024,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "中断或异常发生时，CPU 处于内核态"
      },
      {
        "label": "B",
        "text": "每个系统调用都有对应的内核服务例程"
      },
      {
        "label": "C",
        "text": "中断处理程序开始执行时，CPU 处于内核态"
      },
      {
        "label": "D",
        "text": "系统添加新类型设备时，需注册相应的中断服务例程"
      }
    ],
    "answer": "A",
    "solution": "本题考查 中断和异常。A 错误。中断或异常发生时，CPU 处于用户态。当中断或异常发生时，CPU 会从用户态切换到内核态，然后开始执行相应的中断处理程序或异常处理程序。B 正确。操作系统为每种系统调用提供了对应的内核服务例程，这些例程负责处理用户程序发起的系统调用，以及管理内核资源和执行相应的操作。当用户程序发起系统调用时，处理器会从用户态切换到内核态，并执行与该系统调用对应的内核服务例程。C 正确。当中断发生时，CPU 会从用户态切换到内核态，并开始执行相应的中断处理程序。因为中断处理程序需要访问和操作受保护的内核资源，如管理设备、执行特权指令等，所以中断处理程序必须在内核态下执行。D 正确。系统添加新类型设备时，需注册相应的中断服务例程。因为许多设备在发生特定事件时会触发中断，需要相应的中断处理程序来进行处理，该中断处理程序就是中断服务例程。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-24",
    "number": "2024 年 · 第 24 题",
    "title": "2024 年 408 操作系统 · 第 24 题",
    "prompt": "下列选项中，操作系统在终止进程时不一定执行的是（）。",
    "status": "真题",
    "tags": [
      "进程概念"
    ],
    "knowledgeIds": [
      "OS-KP-6-1"
    ],
    "year": 2024,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "终止子进程"
      },
      {
        "label": "B",
        "text": "回收分配的内存资源"
      },
      {
        "label": "C",
        "text": "撤销进程 PCB"
      },
      {
        "label": "D",
        "text": "回收进程占用的设备"
      }
    ],
    "answer": "A",
    "solution": "当用户终止进程时，不一定终止子进程。因为子进程的生命周期并不总是与父进程紧密相关联，在某些情况下，即使父进程被终止，子进程也可以继续运行，如 孤儿进程 和 僵尸进程。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-25",
    "number": "2024 年 · 第 25 题",
    "title": "2024 年 408 操作系统 · 第 25 题",
    "prompt": "在支持页式存储管理的系统中，进程切换时 OS 要执行（）。 I. 更新 PC（程序计数器）值II. 更新栈基址寄存器值（ebp）III. 更新页表基址寄存器值",
    "status": "真题",
    "tags": [
      "寄存器类型",
      "虚拟页式管理"
    ],
    "knowledgeIds": [
      "OS-KP-3-1-2",
      "OS-KP-4-1-2",
      "OS-KP-4-2"
    ],
    "year": 2024,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 III"
      },
      {
        "label": "B",
        "text": "仅 I、II"
      },
      {
        "label": "C",
        "text": "仅 I、III"
      },
      {
        "label": "D",
        "text": "I、II、III"
      }
    ],
    "answer": "D",
    "solution": "I. 更新程序计数器的值：程序计数器存储了下一条要执行的指令的地址。当进程切换时 ，操作系统需要更新程序计数器的值，以便于新的进程能从正确的位置开始执行。II. 更新栈基址寄存器的值：栈基址寄存器存储了当前进程栈的基址。当进程切换时，操作系统 需要更新栈基址寄存器的值，以确保新的进程使用正确的栈。III. 更新页表基址寄存器值：页基址寄存器存储了当前进程的页表基址。当进程切换时，操作系 统需要更新页基址寄存器的值，以确保新的进程能正确地访问其内存空间。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-26",
    "number": "2024 年 · 第 26 题",
    "title": "2024 年 408 操作系统 · 第 26 题",
    "prompt": "文件系统需要额外的外存空间记录空闲块的位置，占用外存空间大小与当前空闲块数量无关的是（）。",
    "status": "真题",
    "tags": [
      "外存空间管理"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-5"
    ],
    "year": 2024,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "位示图"
      },
      {
        "label": "B",
        "text": "空闲表"
      },
      {
        "label": "C",
        "text": "成组链接"
      },
      {
        "label": "D",
        "text": "空闲链表"
      }
    ],
    "answer": "A",
    "solution": "A. 文件系统需要额外的外存空间记录空闲块的位置，占用外存空间大小与当前空闲块数 量无关的是位示图。位示图是一种常用的记录空闲块位置的方法，它使用一个位来表示一个块是 否空闲。位示图的大小取决于磁盘的总块数，而与当前的空闲块数量无关。B. 空闲表：空闲表是一种记录磁盘空闲块位置的方法它使用一个表来记录空闲块的位置。空闲 表的大小会随着空闲块的数量的变化而变化。C. 成组链接：成组链接是一种记录该组中其他块的位置。成组链接的大小会随着空闲块数量的变 化而变化。D. 空闲链表：空闲链表是一种记录酸盘空闲块位置的方法，它使用一个链表来记录所有空闲块的 位置。空闲链表的大小会随着空闲块数量的变化而变化。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-27",
    "number": "2024 年 · 第 27 题",
    "title": "2024 年 408 操作系统 · 第 27 题",
    "prompt": "回收分区时，仅合并大小相等的空闲分区的算法是（）。",
    "status": "真题",
    "tags": [
      "动态内存管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-5"
    ],
    "year": 2024,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "伙伴算法"
      },
      {
        "label": "B",
        "text": "最佳适应算法"
      },
      {
        "label": "C",
        "text": "最坏适应算法"
      },
      {
        "label": "D",
        "text": "首次适应算法"
      }
    ],
    "answer": "A",
    "solution": "A. 伙伴算法 是一种特殊的内存分配算法，他在分配和回收内存时，只合并大小相等的空 闲分区。这种算法的优点是简单且执行速度快，但可能会导致内存碎片：B. 最佳适应算法：它在分配内存时，会选择大小最接近所需的空闲分区。这种算法的优点是可以 减少内存的浪费，但可能会导致大量的小碎片。C. 最坏适应算法：它在分配内存时，会选择最大的空闲分区。这种算法的优点是可以减沙内存的 碎片，但可能会导致大量的大碎片。D.首次适应算法：它在分配内存时，会选择第一个满足所需的空闲分区。这种算法的优点是简单 且执行速度快，但可能会导致内存的碎片。动态分区分配算法具体参考该节。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-28",
    "number": "2024 年 · 第 28 题",
    "title": "2024 年 408 操作系统 · 第 28 题",
    "prompt": "若进程 P 中有一个线程 T，打开文件后获得 fd，再创建线程 Ta、Tb，则线程 Ta、Tb 可共享的资源是（）。 I. 进程 P 的地址空间II. 线程 T 的栈III. fd",
    "status": "真题",
    "tags": [
      "进程和线程"
    ],
    "knowledgeIds": [
      "OS-KP-6-5-2"
    ],
    "year": 2024,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I"
      },
      {
        "label": "B",
        "text": "仅 I、III"
      },
      {
        "label": "C",
        "text": "仅 II、III"
      },
      {
        "label": "D",
        "text": "I、II、III"
      }
    ],
    "answer": "B",
    "solution": "I. 进程 P 的地址空间：在同一进程中的所有线程共享该进程的地址空间。这意味着，线程 Ta 和 Tb 可以访问进程 P 的全局变量，因为这些变量存储在进程的地址空间中。此外，如果线程 T 在堆上分配了内存，那么线程 T 和 Tb 也可以访问这些内存，因为堆是存储在进程的地址空间中的。II. 线程 T 的栈：每个线程都有自己的栈，这是线程的私有资源，不会被其他线程共享。栈用于存储函数调用的局部变量和返回地址。由于每个线程可能有不同的函数调用序列，因此每个线程需要由自己的栈，因此，线程 Ta 和 Tb 不能访问线程 T 的栈。III. 文件描述符 fd：同进程中的所有线程共享该进程打开的文件描述符。文件描述符是一个整数，用于表示进程打开的文件。当线程打开一个文件时，操作系统会返回一个文件描述符，然后线程 T、T 和 Tb 都可以使用这个文件描述符来读写该文件，这是因为，尽管每个线程有自己的栈，但是它们共享其余的进程资源，包括文件描述符。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-29",
    "number": "2024 年 · 第 29 题",
    "title": "2024 年 408 操作系统 · 第 29 题",
    "prompt": "以下系统调用中，包含文件按名查找功能的系统调用是（）。",
    "status": "真题",
    "tags": [
      "进程文件管理",
      "系统调用"
    ],
    "knowledgeIds": [
      "OS-KP-11-3-1",
      "OS-KP-3-2-5"
    ],
    "year": 2024,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "open()"
      },
      {
        "label": "B",
        "text": "read()"
      },
      {
        "label": "C",
        "text": "write()"
      },
      {
        "label": "D",
        "text": "close()"
      }
    ],
    "answer": "A",
    "solution": "A. open() 系统调用用于打开一个文件。它需要一个文件名作为参数，因此它包含了按名 查找文件的功能。如果文件存在并且进程有足够的权限，open() 会成功打开文件并返回一个文件 描述符，否则，它会返回一个错误。B. read() 系统调用用于从已打开的文件中读取数据。C. write() 系统调用用于向已打开的文件中写入数据。D. close() 系统调用用于关闭已打开的文件。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-30",
    "number": "2024 年 · 第 30 题",
    "title": "2024 年 408 操作系统 · 第 30 题",
    "prompt": "假设某系统使用时间片轮转调度算法进行 CPU 调度，时间片大小为 5 ms，系统共有 10 个进程，初始时均处于就绪队列，执行结束前仅处于执行态或就绪态。若队尾的进程 P 所需 CPU 时间最短，时间为 25 ms。在不考虑系统开销的情况下，则进程 P 的周转时间为（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法",
      "时间片轮转"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4",
      "OS-KP-7-3-4"
    ],
    "year": 2024,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "200ms"
      },
      {
        "label": "B",
        "text": "205ms"
      },
      {
        "label": "C",
        "text": "250ms"
      },
      {
        "label": "D",
        "text": "295ms"
      }
    ],
    "answer": "C",
    "solution": "由于使用的是轮转调度算法，进程即在每次执行一个时间片后，都需要重新回到就绪队列的末尾等待下一次的时间片。所以，实际上，进程 P 的每一个时间片之间都有一个完整的轮转周期的等待时间：10×5ms=50ms，进程 P 需要执行 25/5 个时间片，所有中间有 4 个完整的轮转周期再加上 P 的周转时间为，总共需要 5 个轮转周期：5×50ms=250s。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-31",
    "number": "2024 年 · 第 31 题",
    "title": "2024 年 408 操作系统 · 第 31 题",
    "prompt": "键盘中断服务例程执行结束时，所输入的数据存放位置是（） 。",
    "status": "真题",
    "tags": [
      "中断IO"
    ],
    "knowledgeIds": [
      "OS-KP-13-2-4"
    ],
    "year": 2024,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "用户缓冲区"
      },
      {
        "label": "B",
        "text": "CPU 的通用寄存器"
      },
      {
        "label": "C",
        "text": "内核缓冲区"
      },
      {
        "label": "D",
        "text": "键盘控制器的数据缓冲区"
      }
    ],
    "answer": "C",
    "solution": "当键盘输入数据时，首先会将数据发送到键盘控制器的数据寄存器中。当键盘控制器的数据寄存器接收到数据后，它会触发一个中断请求 (IRQ1)，通知 CPU 有数据等待处理。CPU 响应中断请求后，会执行键盘中断服务例程。在中断服务例程中，CPU 从键盘控制器的数据寄存器读取输入数据，并将其存放到内核缓冲区中。A 错误。用户缓冲区通常指的是应用程序为接收输入数据而分配的缓冲区。在键盘中断服务例程执行结束时，输入数据并不会直接存放在用户缓冲区中，而是先存放在内核缓冲区中。应用程序可以通过系统调用或其他机制从内核缓冲区读取输入数据，并将其复制到用户缓冲区中。B 错误。CPU 中的通用寄存器并不是输入数据的最终存放位置。在键盘中断服务例程执行过程中，输入数据可能会暂时存放在 CPU 的通用寄存器中，但最终会被存放到内核缓冲区中。C 正确。内核缓冲区是操作系统用于暂存输入数据的内存区域。在键盘中断服务例程执行过程中，输入数据被读取并存入内核缓冲区，以便后续的系统调用或应用程序访问。内核缓冲区通常由操作系统管理，确保数据的正确性和一致性。D 错误。键盘控制器的数据寄存器是输入数据的初始存放位置，但并不是中断服务例程执行结束时的最终存放位置。本题选 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-32",
    "number": "2024 年 · 第 32 题",
    "title": "2024 年 408 操作系统 · 第 32 题",
    "prompt": "某磁盘的磁道数为 400（磁道号为 0~399），采用循环扫描算法 (CSCAN) 进行磁盘调度，完成对 200 号磁道的请求后，磁头向磁道号减小的方向移动，若还有 7 个请求，对应的磁道号分别为 300, 120, 110, 0, 160, 210, 399，则完成上述磁盘请求后磁头移动的距离是（ ）。",
    "status": "真题",
    "tags": [
      "磁盘调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3"
    ],
    "year": 2024,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "599"
      },
      {
        "label": "B",
        "text": "619"
      },
      {
        "label": "C",
        "text": "788"
      },
      {
        "label": "D",
        "text": "799"
      }
    ],
    "answer": "C",
    "solution": "在 CSCAN 中，磁头会在一个方向上移动，直到达到磁道的一端，然后立即返回到另一端，再次开始扫描。首先磁头会移动到 160 号磁道，然后依次是 120 号、110 号、0 号，接着磁头移动到开头，然后向磁道号减少的方向移动：依次移动到 399 号、300 号、210 号，完成所有请求后，磁头移动的总距离为：200-160=40；160-110=50；110-0=110；399-0=399；399-300=90；300-210=90；磁头移动的总距离为 40+50+110+399+99+90=788",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2024-45",
    "number": "2024 年 · 第 45 题",
    "title": "2024 年 408 操作系统 · 第 45 题",
    "prompt": "某计算机按字节编址，采用页式虚拟存储管理方式，虚拟地址和物理地址的长度均为 32 位，页表项的大小为 4 字节，页大小为 4MB，虚拟地址结构如下： 进程 Р 的页表起始虚拟地址为 B8C0 0000H，被装载到从物理地址 6540 0000H 开始的连续主存空间中。请回答下列问题： （1）若 CPU 在执行进程 P 的过程中，访问虚拟地址 1234 5678H 时发生了缺页异常，经过缺页异常处理和 MMU 地址转换后得到的物理地址是 BAB4 5678H。在此次缺页异常的处理中，需要为新缺页分配页框并更新相应的页表项，则该页表项的虚拟地址和物理地址分别是什么？该页表项中的页框号更新后的值是什么？（3 分） （2）进程 P 的页表所在页的页号是什么？该页对应的页表项的虚拟地址是什么？该页表项中的页框号是多少？（4 分）",
    "status": "真题",
    "tags": [
      "缺页异常",
      "虚拟页式管理",
      "页表"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-4",
      "OS-KP-5-2-1",
      "OS-KP-4-1-2",
      "OS-KP-4-2",
      "OS-KP-4-1-4",
      "OS-KP-4-2-2"
    ],
    "year": 2024,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）首先，我们需要确定虚拟地址 12345678H 对应页号。由于页号占 10 位， 1234 5678H = 0001 0010 0011 0100 0101 0110 0111 1000B。计算得到：页内偏移量（22 位）= 11 0100 0101 0110 0111 1000B = 345678H页号（10 位）= 00 0100 1000B = 048H然后，我们需要找到这个页号对应的页表项的虚拟地址和物理地址。由于页表项的大小为字节，我们可以通过将页号乘以 4 得到页表项的偏移量。然后将这个偏移量加到页表的起始地址上，就可以得到页表项的虚拟地址和物理地址。进程 P 的页表起始虚拟地址为 B8C0 0000H，物理地址 654 0000H。计算得到：页表项虚拟地址 = 页表起始虚拟地址 + 页号×4 = B8C00000H + 048H×4 = B8C00120，页表项物理地址 = 页表起始物理地址 + 页号×4 = 65400000H + 048H×4 = 65400120H。最后，我们需要更新页表项中的页框号。由于经过 U 地址转换后得到的物理地址是 BAB4 5678H，我们可以通过右移 22 位得到页框号。计算得到：页框号 = 物理地址 BAB45678H 的前 10 位，即 10 1110 1010B = 2EAH。2）首先，我们需要确定进程即的页表所在页的页号。由于页表起始虚拟地址位 B8C00000H，我们可以通过右移 22 位得到页号。计算得到：进程 P 的页表所在页的页号等于 B8C0 0000 的前 10 位，即 10 1110 0011B = 2E3H。 然后，我们需要找到这个页号对应的页表项的虚拟地址。由于页表项的大小为 4 字节，我们可以通过将页号 乘以 4 得到页表项的偏移量。然后将这个偏移量加到页表的起始地址上，就可以得到顷表项的虚拟地址。计算得到：该页对应的页表项的虚拟地址 = B8C0 0000H + 2E3H*4 = B8C0 0B8CH。最后，我们需要确定贡表项中的页框号。由于页表被装在到从物理地址 65400000 开始的连续主存空间中，我们可以通过右移 22 位得到页框号。计算得到：该页表项中的页框号等于物理地址 6540 0000H 的前 10 位，即 01 1001 0101B = 195H。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2024/assets/q45-question-01.png"
    ]
  },
  {
    "id": "real-2024-46",
    "number": "2024 年 · 第 46 题",
    "title": "2024 年 408 操作系统 · 第 46 题",
    "prompt": "计算机系统中的进程之间往往需要相互协作以完成一个任务，在某网络系统中缓冲区 B 用于存放一个数据分组，对 B 的操作有 C1、C2 和 C3。C1 将一个数据分组写入 B 中，C2 从 B 中读出一个数据分组，C3 对 B 中的数据分组进行修改。要求 B 为空时才能执行 C1，B 非空时才能执行 C2 和 C3。请回答下列问题。 （1）假设进程 P1 和 P2 均需执行 C1，实现 C1 的代码是否为临界区？为什么？(2 分） （2）假设 B 初始为空，进程 P1 执行 C1 一次，进程 P2 执行 C2 一次。请定义尽可能少的信号量。并用 wait()，signal() 操作描述进程 P1、P2 之间的同步或互斥关系，说明所用信号量的作用及初值。（3 分） （3）假设 B 初始不为空，进程 P1 和 P2 各执行 C3 一次，请定义尽可能少的信号量。并用 wait()、signal() 操作描述进程 P1 和 P2 之间的同步或互斥关系，说明所用信号量的作用及初值。（3 分）",
    "status": "真题",
    "tags": [
      "进程概念",
      "信号量"
    ],
    "knowledgeIds": [
      "OS-KP-6-1",
      "OS-KP-9-2-4"
    ],
    "year": 2024,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）是的，实现 C1 的代码可以被视为临界区。临界区是指在并发编程中，当多个进程同时访问和修改共享数据时，必须进行互斥访问的代码区域。在这个例子中，进程 P1 和 P2 都需要执行 C1，即它们都需要将一个数据分组写入缓冲区 B。如果这两个进程同时执行 C1，那么它们可能会试图同时写入数据分组，这可能会导致数据的不一致性。因此，我们需要确保在任何时刻，只有一个进程可以执行 C1。这就需要将执行 C1 的代码区域定义为临界区，并使用适当的同步机制（如互斥锁或信号量）来保证在同一时刻只有个进程可以进入临界区。所以，实现 C1 的代码是临界区，因为它涉及到对共享资源（在这里是缓冲区 B) 的修改，而这个修改需要被同步，以防止数据的不一致性。2）在这个问题中，我们可以使用两个信号量：一个用于保护缓使区 B（我们称之为 mutex），另一个用于同步进程 PI 和 P2（我们称之为 full）。mutex 用于确保在同一时刻只有一个进程可以访问缓冲区 B，而 full 用于表示缓冲区 B 是否已满。初始时，mutex 的值为 1，表示缓冲区 B 是可用的：fu1I 的值为 0，表示缓冲区 B 是空的。以下是进程 P1 和 P2 的代码：semaphore mutex = 1; semaphore full = 0; // 进程 P1 P1() { wait(mutex); // 请求访问缓冲区 B 执行 C1，将一个数据分组写入 B 中 signal(mutex); // 释放缓冲区 B 的使用权 signal(full); // 表示缓冲区 B 已满 } // 进程 P2 P2() { wait(full); // 等待缓冲区 B 变满 wait(mutex); // 请求访问缓冲区 B 执行 C1，从 B 中读出一个数组分组 signal(mutex); // 释放缓冲区 B 的使用权 } 在这个代码中，wait() 操作表示请求一个信号量，如果信号量的值大于 0，那么就将其减 1：如果信号量的值为 0，那么就阻塞，直到信号量的值大于 0。signal() 操作表示释放一个信号量，将其值加 1。3）在这个问题中，我们可以使用一个信号量：一个用于保护缓冲区 B（我们称之为 mutex）。mutex 用于确保在同一时刻只有一个进程可以访问缓冲区 B。初始时，mutex 的值为 1，表示缓冲区 B 是可用的。以下是进程 P1 和 P2 的代码：semaphore mutex=1; // 进程 P1 P1() { wait(mutex); // 请求访问缓冲区 B 执行 C3,对 B 中的数据分组进行修改 signal(mutex); // 释放对缓冲区 B 的访问 } // 进程 P2 P2() { wait(mutex); // 请求访问缓冲区 B 执行 C3,对 B 中的数据分组进行修 signal(mutex); // 释放对缓冲区 B 的访问 } 在这个代码中，wait() 操作表示请求一个信号量，如果信号量的值大于 0，那么就将其减 1；如果信号量的值为 0，那么就阻塞，直到信号量的值大于 0。signal() 操作表示释放一个信号量，将其值加 1。所以，实现 C3 的代码是临界区，因为它涉及到共享资源（在这里是缓冲区 B）的修改，而这个修改需要被同步，以防止数据的不一致性。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2024/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-23",
    "number": "2023 年 · 第 23 题",
    "title": "2023 年 408 操作系统 · 第 23 题",
    "prompt": "与宏内核操作系统相比，下列特征中微内核操作系统具有的是（ ）。 Ⅰ. 较好的性能 Ⅱ. 较高的可靠性 Ⅲ. 较高的安全性 Ⅳ. 较强的可扩展性",
    "status": "真题",
    "tags": [
      "操作系统概念"
    ],
    "knowledgeIds": [
      "OS-KP-1-2"
    ],
    "year": 2023,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "Ⅱ、Ⅳ"
      },
      {
        "label": "B",
        "text": "Ⅰ、Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "Ⅰ、Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "Ⅱ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "参考微内核和宏内核， 选项 II 较高的可靠性：微内核操作系统将核心功能模块化，将部分操作系统功能移出 内核，以减少内核的复杂性和错误的影响范围，从而提高系统的可靠性，由于微内核中只包含 最基本的功能，因此可以更容易地对其进行验证和测试，减少错误的概率。选项 III 较高的安 全性：微内核操作系统通过将一些非核心功能移出内核，以降低系统的攻击面，只有核心的、 必要的功能位于内核中，而其他的服务和驱动程序则在用户空间运行，减少了恶意代码对内核 的直接访问，这有助于提高系统的安全性，并减少潜在的漏洞。选项 IV 较强的可扩展性：微 内核操作系统的设计使得新增功能或服务更容易添加到系统中。由于非核心功能运行在用户空 间，可以通过插件或模块的形式进行扩展，而无需对内核进行大规模的修改，这使得微内核操 作系统更具有灵活性和可扩展性。微内核操作系统采用模块化设计，将一部分功能移至用户空 间，这就需要通过进程间通信（IPC）机制来实现内核与用户空间的交互。这种通信会引入额 外的开销，包括上下文切换、数据拷贝等，从而影响系统的性能。所以选项 I 不是微内核操作 系统所具有的特点，正确的选项为 II，III，IV，选择 D 选项。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-24",
    "number": "2023 年 · 第 24 题",
    "title": "2023 年 408 操作系统 · 第 24 题",
    "prompt": "在操作系统内核中，中断向量表适合采用的数据结构是（ ）。",
    "status": "真题",
    "tags": [
      "中断IO"
    ],
    "knowledgeIds": [
      "OS-KP-13-2-4"
    ],
    "year": 2023,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "数组"
      },
      {
        "label": "B",
        "text": "队列"
      },
      {
        "label": "C",
        "text": "单向链表"
      },
      {
        "label": "D",
        "text": "双向链表"
      }
    ],
    "answer": "A",
    "solution": "在操作系统内核中，中断向量表 适合采用的数据结构是数组（选项 A）。中断向量表 是一种用于存储中断处理程序入口地址的数据结构，它以中断号作为索引，将中断号映射到相 应的中断处理程序入口地址。由于中断号是一个固定的范围（例如，0~255）采用数组可以实 现快速的索引和访问，具有较高的效率。使用数组可以直接根据中断号计算出对应的数组索引 而不需要遍历链表或队列来查找对应的处理程序入口地址，从而提高中断处理的效率。所以本 题的正确选项为 A。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-25",
    "number": "2023 年 · 第 25 题",
    "title": "2023 年 408 操作系统 · 第 25 题",
    "prompt": "某系统采用页式存储管理，用位图管理空闲页框。若页大小为 4 KB，物理内存大小为 16 GB，则位图所占空间的大小是（ ）。",
    "status": "真题",
    "tags": [
      "位图法"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-5"
    ],
    "year": 2023,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "128 B"
      },
      {
        "label": "B",
        "text": "128 KB"
      },
      {
        "label": "C",
        "text": "512 KB"
      },
      {
        "label": "D",
        "text": "4 MB"
      }
    ],
    "answer": "C",
    "solution": "物理内存大小为 16GB ，每页大小为 4KB ，因此物理内存总共包含的页框数为 (16GB)/(4KB)=234/212=222 。位图需要管理每个页框的空闲状态，因此位图的位数应该等于物理 内存中页框的数量。每个位表示一个页框的空闲状态，所以位图所占空间大小应为 （位图所占位数）/8=(222)/8=219bytes=512KB ，因此，位图所占空间的大小为 512KB ，选项 C 为正确答案。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-26",
    "number": "2023 年 · 第 26 题",
    "title": "2023 年 408 操作系统 · 第 26 题",
    "prompt": "下列操作完成时，导致 CPU 从内核态转为用户态的是（ ）。",
    "status": "真题",
    "tags": [
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-4"
    ],
    "year": 2023,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "阻塞过程"
      },
      {
        "label": "B",
        "text": "执行 CPU 调度"
      },
      {
        "label": "C",
        "text": "唤醒进程"
      },
      {
        "label": "D",
        "text": "执行系统调用"
      }
    ],
    "answer": "D",
    "solution": "来看每个选项的含义和状态切换：对于 A 选项，阻塞过程属于进程状态切换，不直接涉及CPU模式转换。对于 B 选项，执行 CPU 调度属于内核调度器行为，通常保持在内核态。对于 C 选项，唤醒进程属于进程管理操作，不直接触发模式切换对于 D 选项，当用户程序需要访问特权指令或执行需要操作系统提供的服务时，它会通过 系统调用 请求进人内核态。在系统调用期间，CPU 会切换到内核态执行相应的内核代码来满足用户程序的需求。一旦系统调用执行完毕，CPU 会从内核态返回到用户态继续执行用户程序。所以，执行系统调用是导致 CPU 从内核态转为用户态的关键操作。所以该题的正确选项为 D 选项。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-27",
    "number": "2023 年 · 第 27 题",
    "title": "2023 年 408 操作系统 · 第 27 题",
    "prompt": "下列出当前线程引起的事件或执行的操作中，可能导致该线程由执行态变为就绪态的是（ ）。",
    "status": "真题",
    "tags": [
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-8"
    ],
    "year": 2023,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "键盘输入"
      },
      {
        "label": "B",
        "text": "缺页异常"
      },
      {
        "label": "C",
        "text": "主动出让 CPU"
      },
      {
        "label": "D",
        "text": "执行信号量的 wait() 操作"
      }
    ],
    "answer": "C",
    "solution": "参考 状态转化， B 缺页异常：当线程访问的页面不在内存中时，会触发缺页异常，处理缺页异常时， 线程可能需要等待操作系统将所需页面加载到内存中，这会导致线程由执行态变为阻塞态。C 主动让出 CPU：线程可以通过主动让出 CPU 的方式，将自身的执行权限交给其他就绪态的线 程。这会导致线程由执行态变为就绪态。D 执行信号量的 wait() 操作：在多线程编程中，信 号量通常用于线程间的同步和互斥。当一个线程执行信号量的 wait() 操作时，如果信号量的 计数值不满足条件，线程会进入阻塞状态，从执行态变为阻塞态。键盘输入（选项 A）通常不 会直接导致线程状态变化，它可能触发其他事件或操作，进而影响线程的状态。所以本题的正 确选项为 C 选项。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-28",
    "number": "2023 年 · 第 28 题",
    "title": "2023 年 408 操作系统 · 第 28 题",
    "prompt": "对于采用虚拟内存管理方式的系统，下列关于进程虚拟地址空间的叙述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "虚拟页式管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2",
      "OS-KP-4-2"
    ],
    "year": 2023,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "每个进程都有自己独立的虚拟地址空间"
      },
      {
        "label": "B",
        "text": "C 语言中 malloc() 函数返回的是虚拟地址"
      },
      {
        "label": "C",
        "text": "进程对数据段和代码段可以有不同的访问权限"
      },
      {
        "label": "D",
        "text": "虚拟地址的大小由主存和硬盘的大小决定"
      }
    ],
    "answer": "D",
    "solution": "A：虚拟地址空间是一个进程所使用的虚拟内存地址的集合，每个进程都有自己的虚拟 地址空间，这个空间是独立于其他进程的，每个进程都认为自己在访问整个系统的内存空间， 但实际上，它们只访问到了被分配给它们的部分内存。B：malloc 返回虚拟地址，当调用 malloc 时，分配出来的空间，只是在虚拟内存中是连续的，从实际的物理空间到虚拟内存空间还有一 个映射的关系。C：不同的段访问权限可以是不同的。一般来说，代码段可读可执行，并且只 能在特权模式下执行，但是不可写；数据段可以读写，不能执行。D：主存和硬盘的大小不直 接影响虚拟地址的实际大小，虚拟地址的大小由底层的虚拟内存管理机制和操作系统定义决定， 通常在不同的系统中有所不同。虚拟地址空间的大小可以在操作系统中进行配置和限制，而主 存和硬盘的大小影响的是实际可用的物理内存和存储容量，而非虚拟地址的大小，虚拟内存管 理机制通过将虚拟地址映射到物理内存或硬盘上的页面来提供更大的虚拟地址空间。因此，主 存和硬盘的大小可以影响实际可用的虚拟内存空间的大小，但并不直接决定虚拟地址的大小。 所以本题的答案为 D 选项。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-29",
    "number": "2023 年 · 第 29 题",
    "title": "2023 年 408 操作系统 · 第 29 题",
    "prompt": "进程 P1、P2 和 P3 进入就绪队列的的时刻，优先值（越大优先权越高）以及 CPU 的执行时间如下表所示。 进程名进入就绪队列的时刻优先级CPU 执行时间P10 ms160 msP220 ms1042 msP330 ms10013 ms 系统采用基于优先权的抢占式 CPU 调度算法，从 0ms 时刻开始进行调度，则 P1、P2 和 P3 的平均周转时间为（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法",
      "调度指标"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4",
      "OS-KP-7-2"
    ],
    "year": 2023,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "60 ms"
      },
      {
        "label": "B",
        "text": "61 ms"
      },
      {
        "label": "C",
        "text": "70 ms"
      },
      {
        "label": "D",
        "text": "71 ms"
      }
    ],
    "answer": "B",
    "solution": "具体的调度表如下图所示。周转时间 = 完成时间 - 到达时间，进程 1 的周转时间为 115ms-0ms=115ms，进程 2 的周转时间为 75ms-20ms=55ms，进程 3 的周转时间为 43ms- 30ms=13ms。平均周转时间为 (115+55+13)/3=61ms。所以该题的答案为 B 选项。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-30",
    "number": "2023 年 · 第 30 题",
    "title": "2023 年 408 操作系统 · 第 30 题",
    "prompt": "进程 R 和 S 共享数据 data，若 data 在 R 和 S 中所在页的页号分别为 p1 和 p2，两个页所对应的页框号分别为 f1 和 f2，则下列叙述中，正确的是（ ）。",
    "status": "真题",
    "tags": [
      "虚拟页式管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2",
      "OS-KP-4-2"
    ],
    "year": 2023,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "p1 和 p2 一定相等，f1 和 f2 一定相等"
      },
      {
        "label": "B",
        "text": "p1 和 p2 一定相等，f1 和 f2 不一定相等"
      },
      {
        "label": "C",
        "text": "p1 和 p2 不一定相等，f1 和 f2 一定相等"
      },
      {
        "label": "D",
        "text": "p1 和 p2 不一定相等，f1 和 f2 不一定相等"
      }
    ],
    "answer": "C",
    "solution": "对于进程 R 和 S 共享数据 data 的情况，它们在各自的虚拟地址空间中有自己的页表， 虚拟地址到物理地址的转换是通过页表完成的。因此，对于同一虚拟地址，R 和 S 的页号 p1 和 p2 可能不相等，因为它们对应于各自的页表中的不同页项。然而，当数据 data 在内存中时， 它被映射到物理内存的同一页框中，即 f1 和 f2 是相等的，这是因为共享的数据页被映射到相 同的物理页框中，不同进程的虚拟地址映射到相同的物理地址。所以本题的正确选项为 C 选项。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-31",
    "number": "2023 年 · 第 31 题",
    "title": "2023 年 408 操作系统 · 第 31 题",
    "prompt": "若文件 F 仅被进程 P 打开并访问，则当进程 P 关闭 F 时，下列操作中，文件系统需要完成的是（ ）。",
    "status": "真题",
    "tags": [
      "inode"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-2",
      "OS-KP-11-1-3"
    ],
    "year": 2023,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "删除目录中文件 F 的目录项"
      },
      {
        "label": "B",
        "text": "释放 F 的索引节点所占的内存空间"
      },
      {
        "label": "C",
        "text": "释放 F 的索引节点所占的外存空间"
      },
      {
        "label": "D",
        "text": "将文件磁盘索引节点中的链接计数减 1"
      }
    ],
    "answer": "B",
    "solution": "索引节点是指文件系统中的一种数据结构，每个索引节点保存了文件系统中的一个文 件系统对象的元信息数据，但不包括数据内容或者文件名。内存索引节点是存放在内存中的索 引节点，文件被打开时，需要将磁盘索引节点复制到内存索引节点中。因此本题进程 P 关闭 F 时，需释放 F 的索引节点所占的内存空间。所以该题的正确答案为 B 选项。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-32",
    "number": "2023 年 · 第 32 题",
    "title": "2023 年 408 操作系统 · 第 32 题",
    "prompt": "下列因素中，设备分配需要考虑的是（ ）。 Ⅰ. 设备的类型 Ⅱ. 设备的访问权限 Ⅲ. 设备的占用状态 Ⅳ. 逻辑设备与物理设备的映射关系",
    "status": "真题",
    "tags": [
      "设备分配和回收"
    ],
    "knowledgeIds": [
      "OS-KP-13-3"
    ],
    "year": 2023,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "Ⅰ、Ⅱ"
      },
      {
        "label": "B",
        "text": "Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "I.设备类型：不同类型的设备有不同的特性和接口，需要根据设备类型进行适当的分 配和管理。II.设备使用状态：需要考虑设备的当前使用状态，即设备是否已经被其他进程占用 或者正在执行某个操作，设备分配时需要避免资源冲突。III.逻辑设备和物理设备的映射：在系 统中，逻辑设备和物理设备之间存在映射关系。逻辑设备是用户程序或操作系统中对设备的抽 象表示，而物理设备是实际的硬件设备。设备分配需要确保逻辑设备与物理设备之间的正确映 射。IV.进程对设备的访问权限：不同的进程可能对设备的访问有不同的权限要求。设备分配时 需要考虑进程的访问权限，确保只有具有适当权限的进程能够访问和使用设备。因此，正确的 选项是 I、II、III、IV。本题的正确选项为 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2023-45",
    "number": "2023 年 · 第 45 题",
    "title": "2023 年 408 操作系统 · 第 45 题",
    "prompt": "现要求学生使用 swap 指令和布尔型变量 lock 实现临界区互斥。lock 为线程间共享的变量。lock 的值为 TRUE 时线程不能进入临界区，为 FALSE 时线程能够进入临界区。某同学编写的实现临界区互斥的伪代码如题 45(a) 图所示。 (1) 题 45(a) 图中伪代码中哪些语句存在错误？将其改为正确的语句（不增加语句条数）。 (2) 题 45(b) 图中给出了两个变量值的函数 newSwap() 的代码是否可以用函数调用语句“newSwap(&key, &lock)”代替指令“swap key, lock”以实现临界区的互斥？为什么？",
    "status": "真题",
    "tags": [
      "软件互斥算法"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-1"
    ],
    "year": 2023,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）进入区中的语句 if (key == TRUE) swap key，lock 存在错误，修改为 while (key ==TRUE) swap key, lock。 退出区中的语句 lock=TRUE 存在错误，修改为 lock=FALSE。2）否。因为多个线程可以并发执行 newSwap()，newSwap() 执行时传递给形参 b 的是共享变 量 lock 的地址，在 newSwap() 中对 lock 既有读操作又有写操作，并发执行时不能保证实现两 个变量值的原子交换，从而会导致并发执行的线程同时进入临界区。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2023/assets/q45-question-01.png"
    ]
  },
  {
    "id": "real-2023-46",
    "number": "2023 年 · 第 46 题",
    "title": "2023 年 408 操作系统 · 第 46 题",
    "prompt": "进程 P 通过执行系统调用从键盘接收一个字符的输入，已知此过程中与进程 P 相关的操作包括：①将进程 P 插入就绪队列；②将进程 P 插入阻塞队列；③将字符从键盘控制器读入系统缓冲区；④启动键盘中断处理程序；⑤进程 P 从系统调用返回；⑥用户在键盘上输入字符。以上编号①~⑥仅用于标记操作，与操作的先后顺序无关。请回答下列问题。 (1) 按照正确的操作顺序，操作①的前一个和后一个操作分别是上述操作中的哪一个？操作⑥的后一个操作上述操作中的哪一个？ (2) 在上述哪个操作之后 CPU 一定从进程 P 切换到其他进程？在上述哪个操作之后 CPU 调度程序才能选择进程 P 执行？ (3) 完成上述哪个操作的代码属于键盘驱动程序？ (4) 键盘中断处理程序执行时，进程 P 处于什么状态？CPU 处于内核态还是用户态？",
    "status": "真题",
    "tags": [
      "用户态和内核态",
      "中断IO",
      "IO软件层次"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-4",
      "OS-KP-13-2-4",
      "OS-KP-13-3"
    ],
    "year": 2023,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）在操作①的前操作是③，后一个操作是⑤。操作⑥的后一个操作是④。2）在操作②之后 CPU 一定从进程 P 切换到其他进程。在操作①之后 CPU 调度程序才能选中进程 P 执行。3）完成操作③的代码属于键盘驱动程序。4）进程 P 处于阻塞状态。CPU 处于内核态。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2023/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-23",
    "number": "2022 年 · 第 23 题",
    "title": "2022 年 408 操作系统 · 第 23 题",
    "prompt": "下列关于多道程序系统的叙述中，不正确的是（ ）。",
    "status": "真题",
    "tags": [
      "操作系统概念"
    ],
    "knowledgeIds": [
      "OS-KP-1-2"
    ],
    "year": 2022,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "支持进程的并发执行"
      },
      {
        "label": "B",
        "text": "不必支持虚拟存储管理"
      },
      {
        "label": "C",
        "text": "需要实现对共享资源的管理"
      },
      {
        "label": "D",
        "text": "进程数越多 CPU 利用率越高"
      }
    ],
    "answer": "D",
    "solution": "操作系统的 基本特点：并发、共享、虚拟、异步，其中最基本、一定要实现的是并发和共享，A、C 正确。早期的多道批处理操作系统会将所有进程的数据全部调入主存，再让多道程序并发执行，即使不支持虚拟存储管理，也能实现“多道程序并发”，B 正确。进程多并不意味着 CPU 利用率高，进程数量越多，进程之间的资源竞争越激烈，甚至可能因为资源竞争而出现死锁现象，导致 CPU 利用率低，D 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-24",
    "number": "2022 年 · 第 24 题",
    "title": "2022 年 408 操作系统 · 第 24 题",
    "prompt": "下列选项中，需要在操作系统进行初始化过程中创建的是（ ）。",
    "status": "真题",
    "tags": [
      "中断IO"
    ],
    "knowledgeIds": [
      "OS-KP-13-2-4"
    ],
    "year": 2022,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "中断向量表"
      },
      {
        "label": "B",
        "text": "文件系统的根目录"
      },
      {
        "label": "C",
        "text": "硬盘分区表"
      },
      {
        "label": "D",
        "text": "文件系统的索引节点表"
      }
    ],
    "answer": "A",
    "solution": "解析：中断向量表：在操作系统启动时，必须初始化中断向量表，用于存储中断服务例程的入口地址，以便处理硬件或软件中断。这是操作系统初始化过程中的关键步骤。文件系统的根目录：根目录通常在文件系统格式化时创建，而不是操作系统初始化过程中。硬盘分区表：分区表是在磁盘分区时创建的，通常在安装操作系统之前完成。文件系统的索引节点表：索引节点表（inode 表）是在文件系统创建时生成的，不是操作系统初始化的一部分。因此，正确答案是 A。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-25",
    "number": "2022 年 · 第 25 题",
    "title": "2022 年 408 操作系统 · 第 25 题",
    "prompt": "进程 P0、P1、P2 和 P3 进入就绪队列的时刻、优先级（值越小优先权越高）及 CPU 执行时间如下表所示。 进程进入就绪队列的时刻优先级CPU 执行时间P00 ms15100 msP110 ms2060 msP210 ms1020 msP315 ms610 ms 若系统采用基于优先权的抢占式进程调度算法，则从 0ms 时刻开始调度，到 4 个进程都运行结束为止，发生进程调度的总次数为（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2022,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "4"
      },
      {
        "label": "B",
        "text": "5"
      },
      {
        "label": "C",
        "text": "6"
      },
      {
        "label": "D",
        "text": "7"
      }
    ],
    "answer": "C",
    "solution": "本题考察 优先级调度：0 时刻调度进程 P0 获得 CPU；1Oms 时 P2 进入就绪队列，调度 P2 抢占获得 CPU；15ms 时 P3 进入就绪队列，调度 P3 抢占获得 CPU；25ms 时 P3 执行完毕，调度 P2 获得 CPU；40ms 时 P2 执行完毕，调度 P0 获得 CPU；130ms 时 P2 执行完毕，调度 P1 获得 CPU；190ms 时 P2 执行完毕，结束；总共调度 6 次。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-26",
    "number": "2022 年 · 第 26 题",
    "title": "2022 年 408 操作系统 · 第 26 题",
    "prompt": "系统中有三个进程 P0、P1、P2 及三类资源 A. B. C。若某时刻系统分配资源的情况如下表所示，则此时系统中存在的安全序列的个数为（ ）。",
    "status": "真题",
    "tags": [
      "银行家算法"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-4"
    ],
    "year": 2022,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "2"
      },
      {
        "label": "C",
        "text": "3"
      },
      {
        "label": "D",
        "text": "4"
      }
    ],
    "answer": "B",
    "solution": "初始时系统中的可用资源数为 <1,3,2>，只能满足 P0 的需求 <0,2,1>，所以 安全分配序列 第一个只能是 P0， 将资源分配给 P0 后，P0 执行完释放所占资源，可用资源数变为 <1,3,2> + <2,0,1> = <3,3,3>， 此时可用资源数既能满足 P1，也能满足 P2，可以先分配给 P1，P1 执行完释放资源再分配给 P2， 也可以先分配给 P2，P2 执行完释放资源再分配给 P1。 所以安全序列可以是 ①P0、P1、P2 或 ②P0、P2、P1。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2022/assets/q26-question-01.png"
    ]
  },
  {
    "id": "real-2022-27",
    "number": "2022 年 · 第 27 题",
    "title": "2022 年 408 操作系统 · 第 27 题",
    "prompt": "下列关于 CPU 模式的叙述中，正确的是（ ）。",
    "status": "真题",
    "tags": [
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-4"
    ],
    "year": 2022,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "CPU 处于用户态时只能执行特权指令"
      },
      {
        "label": "B",
        "text": "CPU 处于内核态时只能执行特权指令"
      },
      {
        "label": "C",
        "text": "CPU 处于用户态时只能执行非特权指令"
      },
      {
        "label": "D",
        "text": "CPU 处于内核态时只能执行非特权指令"
      }
    ],
    "answer": "C",
    "solution": "CPU 在 用户态 时只能执行非特权指令，在 内核态 时可以执行特权指令和非特权指令。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-28",
    "number": "2022 年 · 第 28 题",
    "title": "2022 年 408 操作系统 · 第 28 题",
    "prompt": "下列事件或操作中，可能导致进程 P 由执行态变为阻塞态的是（ ）。 Ⅰ. 进程 P 读文件 Ⅱ. 进程 P 的时间片用完 Ⅲ. 进程 P 申请外设 Ⅳ. 进程 P 执行信号量的 wait() 操作",
    "status": "真题",
    "tags": [
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-8"
    ],
    "year": 2022,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅳ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "仅Ⅰ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "参考 状态转化。 进程 P 读文件时，进程从执行态进入阻塞态，等待磁盘 I/O 完成，I 正确。进程 P4 的时间片用完，导致进程从执行态进入就绪态，转入就绪队列等待下次被调度，Ⅱ错误。进 程 P 申请外设，若外设是独占设备且正在被其他进程使用，则进程 P 从执行态进入阻塞态， 等待系统分配外设，Ⅲ 正确。进程 P 执行信号量的 wait() 操作，如果信号量的值小于等于 0，则进程进入阻塞态，等待其他进程用 signal() 操作唤醒，V 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-29",
    "number": "2022 年 · 第 29 题",
    "title": "2022 年 408 操作系统 · 第 29 题",
    "prompt": "某进程访问的页 b 不在内存中，导致产生缺页异常，该缺页异常处理过程中不一定包含的操作是（ ）。",
    "status": "真题",
    "tags": [
      "缺页异常"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-4",
      "OS-KP-5-2-1"
    ],
    "year": 2022,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "淘汰内存中的页"
      },
      {
        "label": "B",
        "text": "建立页号与页框号的对应关系"
      },
      {
        "label": "C",
        "text": "将页 b 从外存读入内存"
      },
      {
        "label": "D",
        "text": "修改页表中页 b 对应的存在位"
      }
    ],
    "answer": "A",
    "solution": "缺页异常 需要从磁盘调页到内存中，将新调入的页与页框建立对应关系，并修改 该页的存在位，B、C、D 正确：如果内存中有空闲页框，就不需要淘汰其他页，A 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-30",
    "number": "2022 年 · 第 30 题",
    "title": "2022 年 408 操作系统 · 第 30 题",
    "prompt": "下列选项中，不会影响系统缺页率的是（ ）。",
    "status": "真题",
    "tags": [
      "缓冲区",
      "页面置换算法"
    ],
    "knowledgeIds": [
      "OS-KP-13-3-3",
      "OS-KP-5-2-2"
    ],
    "year": 2022,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "页面置换算法"
      },
      {
        "label": "B",
        "text": "工作集的大小"
      },
      {
        "label": "C",
        "text": "进程的数量"
      },
      {
        "label": "D",
        "text": "页缓冲队列的长度"
      }
    ],
    "answer": "D",
    "solution": "页置换算法会影响缺页率，例如，LRU 算法的缺页率通常要比 FIFO 算法的缺页 率低，排除 A。工作集的大小决定了分配给进程的物理块数，分配给进程的物理块数越多， 缺页率就越低，排除 B。进程的数量越多，对内存资源的竞争越激烈，每个进程被分配的物 理块数越少，缺页率也就越高，排除 C。页缓冲队列是将被淘汰的页面缓存下来，暂时不写 回磁盘，队列长度会影响页面置换的速度，但不会影响缺页率，答案选 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-31",
    "number": "2022 年 · 第 31 题",
    "title": "2022 年 408 操作系统 · 第 31 题",
    "prompt": "执行系统调用的过程涉及下列操作，其中由操作系统完成的是（ ）。 Ⅰ. 保存断点和程序状态字 Ⅱ. 保存通用寄存器的内容 Ⅲ. 执行系统调用服务程序 Ⅳ. 将 CPU 模式改为内核态",
    "status": "真题",
    "tags": [
      "系统调用"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-5"
    ],
    "year": 2022,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅲ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅱ、Ⅳ"
      },
      {
        "label": "D",
        "text": "仅Ⅱ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "B",
    "solution": "对四个选项进行逐一分析：Ⅰ. 保存断点和程序状态字 ❌参考中断处理过程，保存断点由中断隐指令完成，即由硬件完成。Ⅱ. 保存通用寄存器的内容 ✅为了防止系统调用覆盖用户程序中的数据，操作系统在进入系统调用处理程序时会保存用户程序的寄存器内容（这属于上下文切换的一部分）。Ⅲ. 执行系统调用服务程序 ✅系统调用就是要求操作系统执行某项服务，服务程序是操作系统的一部分，由操作系统调度执行。Ⅳ. 将 CPU 模式改为内核态 ❌这一点不是由操作系统主动完成，而是由硬件自动完成的：当执行陷阱指令（如 int 0x80）或发生中断时，CPU 自动将模式从用户态切换为内核态，然后跳转到操作系统提供的中断向量地址。所以，这属于硬件响应的一部分，不是由操作系统“显式”控制的。所以正确答案选择 B。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-32",
    "number": "2022 年 · 第 32 题",
    "title": "2022 年 408 操作系统 · 第 32 题",
    "prompt": "下列关于驱动程序的叙述中，不正确的是（ ）。",
    "status": "真题",
    "tags": [
      "IO软件层次"
    ],
    "knowledgeIds": [
      "OS-KP-13-3"
    ],
    "year": 2022,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "驱动程序与 I/O 控制方式无关"
      },
      {
        "label": "B",
        "text": "初始化设备是由驱动程序控制完成的"
      },
      {
        "label": "C",
        "text": "进程在执行驱动程序时可能进入阻塞态"
      },
      {
        "label": "D",
        "text": "读/写设备的操作是由驱动程序控制完成的"
      }
    ],
    "answer": "A",
    "solution": "厂家在设计一个设备时，通常会为该设备编写 设备驱动程序，主机需要先安装驱动程序，才能使用设备。当一个设备被连接到主机时，驱动程序负责初始化设备（如将设备控制器中的寄存器初始化），B 正确。当进程在执行驱动程序时，可能会因为设备忙碌而进入阻塞态，C 正确。设备的读/写操作本质就是在设备控制器和主机之间传送数据，而只有厂家知道 设备控制器的内部实现，因此也只有厂家提供的驱动程序能控制设备的读/写操作，D 正确。厂家会根据设备特性，在驱动程序中实现一种合适的 I/O 控制方式，A 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2022-45",
    "number": "2022 年 · 第 45 题",
    "title": "2022 年 408 操作系统 · 第 45 题",
    "prompt": "某文件系统的磁盘块大小为 4KB，目录项由文件名和索引节点号构成，每个索引节点占 256 字节，其中包含直接地址项 10 个，一级、二级和三级间接地址项各 1 个，每个地址项占 4 字节。该文件系统中子目录 stu 的结构如题 45(a) 图所示，stu 包含子目录 course 和文件 doc，course 子目录包含文件 course1 和 course2。各文件的文件名、索引节点号、占用磁盘块的块号如题 45(b) 图所示。 请回答下列问题。 (1) 目录文件 stu 中每个目录项的内容是什么？ (2) 文件 doc 占用的磁盘块的块号 x 的值是多少？ (3) 若目录文件 course 的内容已在内存，则打开文件 course1 并将其读入内存，需要读几个磁盘块？说明理由。 (4) 若文件 course2 的大小增长到 6MB，为了存取 course2 需要使用该文件索引节点的哪几级间接地址项？说明理由。",
    "status": "真题",
    "tags": [
      "目录",
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-4",
      "OS-KP-11-1-3"
    ],
    "year": 2022,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）在该文件系统中，目录项由文件名和索引结点号构成。由图 a 可知，stu 目录下有两个文 件，分别是 course 和 doc。由图 b 可知，这两个文件分别对应索引结点号 2 和 10。因此， 目录文件 stu 中两个目录项的内容是2）由图 b 可知，文件 doc 和文件 course1 对应的索引结点号都是 10。说明 doc 和 course1 两 个目录项共享同一个索引结点，本质上对应同一个文件。而文件 course1 存储在 30 号磁盘 块，因此文件 doc 占用的磁盘块的块号 x 为 30。3）需要读 2 个磁盘块。先读 course1 的索引结点所在的磁盘块，再读 course1 的内容所在的 磁盘块。目录文件 course 的内容已在内存中，即 coursel、course2 对应的目录项己在内存 中，根据 coursel 对应的目录项可以知道其索引结点号，即可读入 course1 的索引结点所 在的磁盘块：根据 course1 的索引结点可知该文件存储在 30 号磁盘块，因此可再读入 coursel 的内容所在的磁盘块。4）存取 course2 需要使用索引结点的一级和二级间接地址项。6MB 大小的文件需要占用 6MB/4KB=1536 个磁盘块。直接地址项可以记录 10 个磁盘块号，一级间接地址块可以记 录 4KB/4B=1024 个磁盘块号，二级间接地址块可以记录 1024×1024 个磁盘块号，而 10+1024<1536<10+1024+1024×1024 。因此，6MB 大小的文件，需要使用一级间接地址 项和二级间接地址项（拓展：若文件的总大小超出 10+1024+1024×1024 块，则还需使 用三级间接地址项）。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2022/assets/q45-question-01.png"
    ]
  },
  {
    "id": "real-2022-46",
    "number": "2022 年 · 第 46 题",
    "title": "2022 年 408 操作系统 · 第 46 题",
    "prompt": "某进程的两个线程 T1 和 T2 并发执行 A. B. C. D. E 和 F 共 6 个操作，其中 T1 执行 A. E 和 F，T2 执行 B. C 和 D。题 46 图表示上述 6 个操作的执行顺序所必须满足的约束：C 在 A 和 B 完成后执行，D 和 E 在 C 完成后执行，F 在 E 完成后执行。请使用信号量的 wait()、signal() 操作描述 T1 和 T2 之间的同步关系，并说明所用信号量的作用及其初值。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2022,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "进程 T1 要依次执行 A、E、F。进程 T2 要执行 B、C、D。由图可知，T2 执行 C 必须在 T1 执行完 A 之后；T1 执行 E 必须在 T2 执行完 C 之后。因此，有两对同步关系。信号量的定义 和同步关系的描述如下：semaphore AC = 0; semaphore CE = 0; T1() { A; signal(AC); wait(CE); E; F; } T2() { B; wait(AC); C; signal(CE); D; }",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2022/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2022/assets/q46-question-01.png"
    ]
  },
  {
    "id": "real-2021-23",
    "number": "2021 年 · 第 23 题",
    "title": "2021 年 408 操作系统 · 第 23 题",
    "prompt": "下列指令中，只能在内核态执行的是（ ）。",
    "status": "真题",
    "tags": [
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-4"
    ],
    "year": 2021,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "trap 指令"
      },
      {
        "label": "B",
        "text": "I/O 指令"
      },
      {
        "label": "C",
        "text": "数据传送指令"
      },
      {
        "label": "D",
        "text": "设置断点指令"
      }
    ],
    "answer": "B",
    "solution": "在 内核态 下，CPU 可执行任何指令，在用户态下 CPU 只能执行非特权指令，而特权指令只能在内核态下执行。常见的 特权指令 有：有关对 IO 设备操作的指令；有关访问程序状态的指令；存取特殊寄存器指令；其他指令。A、C 和 D 都是提供给用户使用的指令，可以在用户态执行，只是可能会使 CPU 从用户态切换到内核态。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-24",
    "number": "2021 年 · 第 24 题",
    "title": "2021 年 408 操作系统 · 第 24 题",
    "prompt": "下列操作中，操作系统在创建新进程时，必须完成的是（ ）。 I. 申请空白的进程控制块 II. 初始化进程控制块 III. 设置进程状态为执行态",
    "status": "真题",
    "tags": [
      "进程控制块",
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-1",
      "OS-KP-6-1-8"
    ],
    "year": 2021,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I"
      },
      {
        "label": "B",
        "text": "仅 I、II"
      },
      {
        "label": "C",
        "text": "仅 I、III"
      },
      {
        "label": "D",
        "text": "仅 II、III"
      }
    ],
    "answer": "B",
    "solution": "操作系统感知进程的唯一方式是通过进程控制块 PCB，所以创建一个新进程时就是为其申请一个空白的进程控制块，并初始化一些必要的进程信息，如初始化进程标志信息、初始化处理机状态信息、设置进程优先级等。I、Ⅱ正确。创建一个进程时，一般会为其分配除 CPU 外的大多数资源，所以一般是将其设置为就绪态，让其等待调度程序的调度。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-25",
    "number": "2021 年 · 第 25 题",
    "title": "2021 年 408 操作系统 · 第 25 题",
    "prompt": "下列内核的数据结构或程序中，分时系统实现时间片轮转调度需要使用的是（ ）。 I. 进程控制块 II. 时钟中断处理程序 III. 进程就绪队列 IV. 进程阻塞队列",
    "status": "真题",
    "tags": [
      "处理机调度算法",
      "时间片轮转"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4",
      "OS-KP-7-3-4"
    ],
    "year": 2021,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 II、III"
      },
      {
        "label": "B",
        "text": "仅 I、IV"
      },
      {
        "label": "C",
        "text": "仅 I、II、III"
      },
      {
        "label": "D",
        "text": "仅 I、II、IV"
      }
    ],
    "answer": "C",
    "solution": "在分时系统的 时间片轮转 中，当系统检测到时钟中断时，会引出时钟中断处理程序调度程序从就绪队列中选择一个进程为其分配时间片，并修改该进程的进程控制块中的进程状态等信息，同时将时间片用完的进程放入就绪队列或让其结束运行。I、II、Ⅲ 正确。阻塞队列中的进程只有被唤醒进入就绪队列后，才能参与调度，所以该调度过程不使用阻塞队列。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-26",
    "number": "2021 年 · 第 26 题",
    "title": "2021 年 408 操作系统 · 第 26 题",
    "prompt": "某系统中磁盘的磁道数为 200 (0~199), 磁头当前在 184 号磁道上。用户进程提出的磁盘访问请求对应的磁道号依次为 184, 187, 176, 182, 199。若采用最短寻道时间优先调度算法 (SSTF) 完成磁盘访问，则磁头移动的距离（磁道数）是（ ）。",
    "status": "真题",
    "tags": [
      "磁盘调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3"
    ],
    "year": 2021,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "37"
      },
      {
        "label": "B",
        "text": "38"
      },
      {
        "label": "C",
        "text": "41"
      },
      {
        "label": "D",
        "text": "42"
      }
    ],
    "answer": "C",
    "solution": "最短寻道时间优先算法 总是选择调度与当前磁头所在磁道距离最近的磁道。可以得出访问序列 184,182,187,176,199，从而求出移动距离之和是 0+2+5+11+23=41。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-27",
    "number": "2021 年 · 第 27 题",
    "title": "2021 年 408 操作系统 · 第 27 题",
    "prompt": "下列事件中，可能引起进程调度程序执行的是（ ）。 I. 中断处理结束 II. 进程阻塞 III. 进程执行结束 IV. 进程的时间片用完",
    "status": "真题",
    "tags": [
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-8"
    ],
    "year": 2021,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I、III"
      },
      {
        "label": "B",
        "text": "仅 II、IV"
      },
      {
        "label": "C",
        "text": "仅 III、IV"
      },
      {
        "label": "D",
        "text": "I、II、III、 IV"
      }
    ],
    "answer": "D",
    "solution": "当进程 状态转化 时，需要由进程调度程序执行。 。在时间片调度算法中，中断处理结束后，系统检测当前进程的时间片是否用完，如果用完，则将其设为就绪态或让其结束运行，若就绪队列不空，则调度就绪队列的队首进程执行，I 可能。当前进程阻塞时，将其放入阻塞队列，若就绪队列不空，则调度新进程执行，Ⅱ 可能。进程执行结束会导致当前进程释放 CPU，并从就绪队列中选择一个进程获得 CPU，III 可能。进程时间片用完，会导致当前进程让出 CPU，同时选择就绪队列的队首进程获得 CPU，IV 可能。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-28",
    "number": "2021 年 · 第 28 题",
    "title": "2021 年 408 操作系统 · 第 28 题",
    "prompt": "某请求分页存储系统的页大小为 4KB，按字节编址。系统给进程 P 分配 2 个固定的页框并采用改进型 Clock 置换算法，进程 P 页表的部分内容如下表所示： 若 P 访问虚拟地址为 02A01H 的存储单元，则经地址变换后得到的物理地址是（）。",
    "status": "真题",
    "tags": [
      "页面置换算法",
      "clock算法"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-2"
    ],
    "year": 2021,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "00A01H"
      },
      {
        "label": "B",
        "text": "20A01H"
      },
      {
        "label": "C",
        "text": "60A01H"
      },
      {
        "label": "D",
        "text": "80A01H"
      }
    ],
    "answer": "C",
    "solution": "页面大小为 4KB，低 12 位是页内偏移。虚拟地址为 02A01H，页号为 02H，02H 页对应的页表项中存在位为 0，进程 P 分配的页框固定为 2，且内存中已有两个页面存在。根据 CLOCK 算法，选择将 3 号页换出，将 2 号页放入 60H 页框，经过地址变换后得到的物理地址是 60A01H。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2021/assets/q28-question-01.png"
    ]
  },
  {
    "id": "real-2021-29",
    "number": "2021 年 · 第 29 题",
    "title": "2021 年 408 操作系统 · 第 29 题",
    "prompt": "在采用二级页表的分页系统中，CPU 页表基址寄存器中的内容是（ ）。",
    "status": "真题",
    "tags": [
      "页表"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-4",
      "OS-KP-4-2-2"
    ],
    "year": 2021,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "当前进程的一级页表的起始虚拟地址"
      },
      {
        "label": "B",
        "text": "当前进程的一级页表的起始物理地址"
      },
      {
        "label": "C",
        "text": "当前进程的二级页表的起始虚拟地址"
      },
      {
        "label": "D",
        "text": "当前进程的二级页表的起始物理地址"
      }
    ],
    "answer": "B",
    "solution": "页表基址寄存器（PTBR，Page Table Base Register）中存储的是进程一级页表的物理地址。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-30",
    "number": "2021 年 · 第 30 题",
    "title": "2021 年 408 操作系统 · 第 30 题",
    "prompt": "若目录 dir 下有文件 file1，则为删除该文件内核不必完成的工作是（ ）。",
    "status": "真题",
    "tags": [
      "文件链接"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-6",
      "OS-KP-11-1-7"
    ],
    "year": 2021,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "删除 file1 的快捷方式"
      },
      {
        "label": "B",
        "text": "释放 file1 的文件控制块"
      },
      {
        "label": "C",
        "text": "释放 file1 占用的磁盘空间"
      },
      {
        "label": "D",
        "text": "删除目录 dir 中与 file1 对应的目录项"
      }
    ],
    "answer": "A",
    "solution": "当你删除某个目录 dir 下的文件 file1 时，操作系统内核必须完成以下几项操作：首先，内核会在目录 dir 中找到 file1 对应的目录项，并将其删除。目录项是文件名与其 inode（文件控制块）之间的映射。然后，内核检查这个 inode 是否还有其他硬链接引用。如果 file1 是最后一个链接，那么系统会释放掉该 inode，以及文件占用的磁盘数据块。也就是说，释放文件控制块（inode）和释放磁盘空间，都是删除文件过程中内核必须做的事情。但如果有其他“快捷方式”指向 file1，比如 软链接（symbolic link），这些快捷方式本身是独立的文件。删除原文件不会影响这些快捷方式，它们会变成“悬挂链接”（指向一个不存在的文件）。因此，内核在删除文件时不需要去删除这些快捷方式。所以，正确答案是：A. 删除 file1 的快捷方式 —— 这是内核不必完成的工作。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-31",
    "number": "2021 年 · 第 31 题",
    "title": "2021 年 408 操作系统 · 第 31 题",
    "prompt": "若系统中有 n (n≥2) 个进程，每个进程均需要使用某类临界资源 2 个，则系统不会发生死锁所需的该类资源总数至少是（ ）。",
    "status": "真题",
    "tags": [
      "死锁产生的必要条件"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-1"
    ],
    "year": 2021,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "n"
      },
      {
        "label": "C",
        "text": "n+1"
      },
      {
        "label": "D",
        "text": "2n"
      }
    ],
    "answer": "C",
    "solution": "考虑极端情况，当临界资源数为 n 时，每个进程都拥有 1 个临界资源并等待另一个资源，会发生死锁。当临界资源数为 n+1 时，则 n 个进程中至少有一个进程可以获得 2 个临界资源，顺利运行完后释放自己的临界资源，使得其他进程也能顺利运行，不会产生死锁。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-32",
    "number": "2021 年 · 第 32 题",
    "title": "2021 年 408 操作系统 · 第 32 题",
    "prompt": "下列选项中，通过系统调用完成的操作是（ ）。",
    "status": "真题",
    "tags": [
      "系统调用"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-5"
    ],
    "year": 2021,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "页置换"
      },
      {
        "label": "B",
        "text": "进程调度"
      },
      {
        "label": "C",
        "text": "创建新进程"
      },
      {
        "label": "D",
        "text": "生成随机整数"
      }
    ],
    "answer": "C",
    "solution": "系统调用是由用户进程发起的，请求操作系统的服务。对于 A，当内存中的空闲页框不够时，操作系统会将某些页面调出，并将要访问的页面调入，这个过程完全由操作系统完成不涉及系统调用。对于 B，进程调度完全由操作系统完成，无法通过系统调用完成。对于 C，创建新进程可以通过系统调用来完成，如 Linux 中通过 fork 系统调用来创建子进程。对于 D，生成随机数只需要普通的函数调用，不涉及请求操作系统的服务，如 C 语言中 random() 函数。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-45",
    "number": "2021 年 · 第 45 题",
    "title": "2021 年 408 操作系统 · 第 45 题",
    "prompt": "下表给出了整型信号量 S 的 wait() 和 signal() 操作的功能描述，以及采用开/关中断指令实现信号量操作互斥的两种方法。 功能描述 Semaphore S; wait(S) { while (S <= 0); S = S-1; } signal(S) { S = S+1; } 方法 1 Semaphore S; wait(S) { 关中断； while(S <= 0); S = S-1; 开中断； } signal(S) { 关中断； S = S+1; 开中断； } 方法 2 Semaphore S; wait(S) { 关中断； while(S <= 0) { 开中断； 关中断； } S = S-1; 开中断； } signal(S) { 关中断； S = S+1; 开中断； } 请回答下列问题。 (1) 为什么在 wait() 和 signal() 操作中对信号量 S 的访问必须互斥执行？ (2) 分别说明方法 1 和方法 2 是否正确。若不正确，请说明理由。 (3) 用户程序能否使用开/关中断指令实现临界区互斥？为什么？",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2021,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）信号量 S 是能被多个进程共享的变量，多个进程都可通过 wait() 和 signal() 对 S 进行读、写操作。所以，wait() 和 signal() 操作中对 S 的访问必须是互斥的。2）方法 1 错误。在 wait() 中，当 S≤0 时，关中断后，其他进程无法修改 S 的值，while 语句陷入死循环。方法 2 正确。方法 2 在循环体中有一个开中断操作，这样就可以使 其他进程修改 S 的值，从而避免 while 语句陷入死循环。3）用户程序不能使用开/关中断指令实现临界区互斥。因为开中断和关中断指令都是特权 指令，不能在用户态下执行，只能在内核态下执行。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2021-46",
    "number": "2021 年 · 第 46 题",
    "title": "2021 年 408 操作系统 · 第 46 题",
    "prompt": "某计算机用硬盘作为启动盘，硬盘第一个扇区存放主引导记录，其中包含磁盘引导程序和分区表。磁盘引导程序用于选择要引导哪个分区的操作系统，分区表记录硬盘上各分区的位置等描述信息。硬盘被划分成若干个分区，每个分区的第一个扇区存放分区引导程序，用于引导该分区中的操作系统。系统采用多阶段引导方式，除了执行磁盘引导程序和分区引导程序外，还需要执行 ROM 中的引导程序。请回答下列问题。 (1) 系统启动过程中操作系统的初始化程序、分区引导程序、ROM 中的引导程序、磁盘引导程序的执行顺序是什么？ (2) 把硬盘制作为启动盘时，需要完成操作系统的安装、磁盘的物理格式化、逻辑格式化、对磁盘进行分区，执行这 4 个操作的正确顺序是什么？ (3) 磁盘扇区的划分和文件系统根目录的建立分别是在第 (2) 问的哪个操作中完成的？",
    "status": "真题",
    "tags": [
      "磁盘格式化",
      "系统引导流程"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3",
      "OS-KP-3-2-3"
    ],
    "year": 2021,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）参考 系统引导流程，执行顺序依次是 ROM 中的引导程序、磁盘引导程序、分区引导程序、操作系统的初始化程序。启动系统时，首先运行 ROM 中的引导代码（bootstrap）。为执行某个分区的 操作系统的初始化程序，需要先执行磁盘引导程序以指示引导到哪个分区，然后执行 该分区的引导程序，用于引导该分区的操作系统。2）4 个操作的执行顺序依次是磁盘的物理格式化、对磁盘进行分区、逻辑格式化、操作系 统的安装。磁盘只有通过分区和逻辑格式化后才能安装系统和存储信息。物理格式化 （又称低级格式化，通常出厂时就已完成）的作用是为每个磁道划分扇区，安排扇区在 磁道中的排列顺序，并对已损坏的磁道和扇区做“坏”标记等。随后将磁盘的整体存 储空间划分为相互独立的多个分区（如 Windows 中划分 C 盘、D 盘等），这些分区可以 用作多种用途，如安装不同的操作系统和应用程序、存储文件等。然后进行逻辑格式 化（又称高级格式化），其作用是对扇区进行逻辑编号、建立逻辑盘的引导记录、文件 分配表、文件目录表和数据区等。最后才是操作系统的安装。3）由上述解析可知，磁盘扇区的划分是在磁盘的物理格式化操作中完成的，文件系统根目 录的建立是在逻辑格式化操作中完成的。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2021/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-23",
    "number": "2020 年 · 第 23 题",
    "title": "2020 年 408 操作系统 · 第 23 题",
    "prompt": "若多个进程共享同一个文件 F，则下列叙述中，正确的是（ ）。",
    "status": "真题",
    "tags": [
      "进程文件管理"
    ],
    "knowledgeIds": [
      "OS-KP-11-3-1"
    ],
    "year": 2020,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "各进程只能用“读”方式打开文件 F"
      },
      {
        "label": "B",
        "text": "在系统打开文件表中仅有一个表项包含 F 的属性"
      },
      {
        "label": "C",
        "text": "各进程的用户打开文件表中关于 F 的表项内容相同"
      },
      {
        "label": "D",
        "text": "进程关闭 F 时，系统删除 F 在系统打开文件表中的表项"
      }
    ],
    "answer": "B",
    "solution": "多个进程可同时以“读”或“写”方式打开文件，操作系统并不保证写操作的互斥性，进程可通过系统调用对文件加锁，保证互斥写（读者 - 写者问题），选项 A 错误。整个系统只有一个 系统文件打开表，同一个文件打开多次只需改变引用计数，选项 B 正确。用户进程的打开文件表关于同一个文件不一定相同，例如读写指针位置不一定相同，选项 C 错误。进程关闭文件时，文件的引用计数减 1 , 引用计数变为 0 时才删除系统打开文件表中的表项，选项 D 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-24",
    "number": "2020 年 · 第 24 题",
    "title": "2020 年 408 操作系统 · 第 24 题",
    "prompt": "下列选项中，支持文件长度可变、随机访问的磁盘存储空间分配方式是（ ）。",
    "status": "真题",
    "tags": [
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3"
    ],
    "year": 2020,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "索引分配"
      },
      {
        "label": "B",
        "text": "链接分配"
      },
      {
        "label": "C",
        "text": "连续分配"
      },
      {
        "label": "D",
        "text": "动态分区分配"
      }
    ],
    "answer": "A",
    "solution": "索引分配 支持变长的文件，同时可以随机访问文件的指定数据块，选项 A 正确。链接分配 不支持随机访问，需要依靠指针依次访问，选项 B 错误。连续分配的文件长度固定，不支持 可变文件长度（连续分配的文件长度虽然也可变，但是需大量移动数据，代价较大，相比之 下不太合适），选项 C 错误。动态分区分配是内存管理方式，不是磁盘空间的管理方式，选 项 D 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-25",
    "number": "2020 年 · 第 25 题",
    "title": "2020 年 408 操作系统 · 第 25 题",
    "prompt": "下列与中断相关的操作中，由操作系统完成的是（）。 Ⅰ、保存被中断程序的中断点 Ⅱ、提供中断服务 Ⅲ、初始化中断向量表 Ⅳ、保存中断屏蔽字",
    "status": "真题",
    "tags": [
      "中断IO"
    ],
    "knowledgeIds": [
      "OS-KP-13-2-4"
    ],
    "year": 2020,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "B",
        "text": "仅Ⅰ、Ⅱ、Ⅳ"
      },
      {
        "label": "C",
        "text": "仅Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "仅Ⅱ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "当 CPU 检测到中断信号后，由硬件自动保存被中断程序的断点（即程序计数器 PC）, I 错 误。之后，硬件找到该中断信号对应的中断向量，中断向量指明中断服务程序入口地址（各 中断向量统一存放在中断向量表中，该表由操作系统初始化，Ⅲ 正确）。接下来开始执行 中断服务程序，保存 PSW、保存中断屏蔽字、保存各通用寄存器的值，并提供与中断信号 对应的中断服务，中断服务程序属于操作系统内核，Ⅱ 和 Ⅳ 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-26",
    "number": "2020 年 · 第 26 题",
    "title": "2020 年 408 操作系统 · 第 26 题",
    "prompt": "下列与进程调度有关的因素中，在设计多级反馈队列调度算法时需要考虑的是（ ）。 Ⅰ. 就绪队列的数量 Ⅱ. 就绪队列的优先级 Ⅲ. 各就绪队列的调度算法 Ⅳ. 进程在就绪队列间的迁移条件",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2020,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "B",
        "text": "仅Ⅲ、Ⅳ"
      },
      {
        "label": "C",
        "text": "仅Ⅱ、Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ和Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "多级反馈队列 调度算法需要综合考虑优先级数量、优先级之间的转换规则等，就绪队列的 数量会影响长进程的最终完成时间，I 正确；就绪队列的优先级会影响进程执行的顺序，II 正确；各就绪队列的调度算法会影响各队列中进程的调度顺序，m 正确；进程在就绪队列 中的迁移条件会影响各进程在各队列中的执行时间，IV 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-27",
    "number": "2020 年 · 第 27 题",
    "title": "2020 年 408 操作系统 · 第 27 题",
    "prompt": "某系统中有 A、B 两类资源各 6 个，t 时刻资源分配及需求情况如下表所示。 进程A 已分配数量B 已分配数量A 需求总量B 需求总量P12344P22131P31234 t 时刻安全性检测结果是（ ）。",
    "status": "真题",
    "tags": [
      "银行家算法"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-4"
    ],
    "year": 2020,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "存在安全序列 P1、P2、P3"
      },
      {
        "label": "B",
        "text": "存在安全序列 P2、P1、P3"
      },
      {
        "label": "C",
        "text": "存在安全序列 P2、P3、P1"
      },
      {
        "label": "D",
        "text": "不存在安全序列"
      }
    ],
    "answer": "B",
    "solution": "首先求出 需求矩阵： 由 Allocation 得知当前 Available 为 (1,0)。由需求矩阵可知，初始只能满足 P2 的需求，选 项 A 错误。P2 释放资源后 Available 变为 (3,1)，此时仅能满足 P1 的需求，选 项 C 错误。 P1 释放资源后 Available 变为 (5,4)，可以满足 P 3 的需求，得到的安全序列为 P2, Pl, P3, 选项 B 正确，选项 D 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-28",
    "number": "2020 年 · 第 28 题",
    "title": "2020 年 408 操作系统 · 第 28 题",
    "prompt": "下列因素中，影响请求分页系统有效（平均）访存时间的是（ ）。 Ⅰ. 缺页率 Ⅱ. 磁盘读写时间 Ⅲ. 内存访问时间 Ⅳ. 执行缺页处理程序的 CPU 时间",
    "status": "真题",
    "tags": [
      "访存过程"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1"
    ],
    "year": 2020,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "B",
        "text": "仅Ⅰ、Ⅳ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ和Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "I 影响缺页中断的频率，缺页率越高，平均访存时间越长；Ⅱ 和 Ⅳ 影响缺页中断的处理时 间，中断处理时间越长，平均访存时间越长；皿影响访问页表和访问目标物理地址的时间， 故Ⅰ、Ⅱ、Ⅲ 和Ⅳ 均正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-29",
    "number": "2020 年 · 第 29 题",
    "title": "2020 年 408 操作系统 · 第 29 题",
    "prompt": "下列关于父进程与子进程的叙述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "进程概念"
    ],
    "knowledgeIds": [
      "OS-KP-6-1"
    ],
    "year": 2020,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "父进程与子进程可以并发执行"
      },
      {
        "label": "B",
        "text": "父进程与子进程共享虚拟地址空间"
      },
      {
        "label": "C",
        "text": "父进程与子进程有不同的进程控制块"
      },
      {
        "label": "D",
        "text": "父进程与子进程不能同时使用同一临界资源"
      }
    ],
    "answer": "B",
    "solution": "父进程与子进程 当然可以并发执行，选项 A 正确。父进程可与子进程共享一部分资源，但 不能共享虚拟地址空间，在创建子进程时，会为子进程分配资源，如虚拟地址空间等，选 项 B 错误。临界资源一次只能为一个进程所用，选项 D 正确。进程控制块 PCB 是进程存 在的唯一标志，每个进程都有自己的 PCB，选项 C 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-30",
    "number": "2020 年 · 第 30 题",
    "title": "2020 年 408 操作系统 · 第 30 题",
    "prompt": "对于具备设备独立性的系统，下列叙述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "设备分配和回收"
    ],
    "knowledgeIds": [
      "OS-KP-13-3"
    ],
    "year": 2020,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "可以使用文件名访问物理设备"
      },
      {
        "label": "B",
        "text": "用户程序使用逻辑设备名访问物理设备"
      },
      {
        "label": "C",
        "text": "需要建立逻辑设备与物理设备之间的映射关系"
      },
      {
        "label": "D",
        "text": "更换物理设备后必须修改访问该设备的应用程序"
      }
    ],
    "answer": "D",
    "solution": "设备可视为特殊文件，选项 A 正确。用户使用 逻辑设备名 来访问物理文件，有利于设备独 立性，选项 B 正确。通过逻辑设备名访问物理设备时，需要建立逻辑设备和物理设备之间 的 映射关系，选项 C 正确。应用程序按逻辑设备名访问设备，再经驱动程序的处理来控制物理设备，若更换物理设备，则只需更换驱动程序，而无须修改应用程序，选项 D 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-31",
    "number": "2020 年 · 第 31 题",
    "title": "2020 年 408 操作系统 · 第 31 题",
    "prompt": "某文件系统的目录项由文件名和索引结点号构成。若每个目录项长度为 64 字节，其中 4 字节存放索引结点号，60 字节存放文件名。文件名由小写英文字母构成，则该文件系统能创建的文件数量的上限为（ ）。",
    "status": "真题",
    "tags": [
      "目录",
      "inode"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-4",
      "OS-KP-11-1-2",
      "OS-KP-11-1-3"
    ],
    "year": 2020,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "226"
      },
      {
        "label": "B",
        "text": "232"
      },
      {
        "label": "C",
        "text": "260"
      },
      {
        "label": "D",
        "text": "264"
      }
    ],
    "answer": "B",
    "solution": "在总长为 64 字节的目录项中，索引结点占 4 字节，即 32 位。不同目录下的文件的文件名可以相同，所以在考虑系统创建最多文件数量时，只需考虑索引结点的个数，即创建文件数量上限 = 索引结点数量上限。整个系统中最多存储 232 个索引结点，因此整个系统最多可以表示 232 个文件，选项 B 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-32",
    "number": "2020 年 · 第 32 题",
    "title": "2020 年 408 操作系统 · 第 32 题",
    "prompt": "下列准则中，实现临界区互斥机制必须遵循的是（ ）。 Ⅰ、两个进程不能同时进入临界区 Ⅱ、允许进程访问空闲的临界资源 Ⅲ、进程等待进入临界区的时间是有限的 Ⅳ、不能进入临界区的执行态进程立即放弃 CPU",
    "status": "真题",
    "tags": [
      "同步原则"
    ],
    "knowledgeIds": [
      "OS-KP-9-1-2"
    ],
    "year": 2020,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅳ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅱ、Ⅲ"
      },
      {
        "label": "D",
        "text": "仅Ⅰ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "C",
    "solution": "实现临界区互斥需满足多个准则。“忙则等待”准则，即两个进程不能同时访问临界区，Ⅰ 正确。 “空闲让进”准则，若临界区空闲，则允许其他进程访问，Ⅱ 正确。 “有限等待” 准则，即进程应该在有限时间内访问临界区，Ⅲ 正确。Ⅰ、Ⅱ 和 Ⅲ 是互斥机制必须遵循的 原则。Ⅳ 是“让权等待”准则，不一定非得实现，如皮特森算法。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-45",
    "number": "2020 年 · 第 45 题",
    "title": "2020 年 408 操作系统 · 第 45 题",
    "prompt": "现有 5 个操作 A、B、C、D 和 E，操作 C 必须在 A 和 B 完成后执行，操作 E 必须在 C 和 D 完成后执行，请使用信号量的 wait()、signal() 操作（P、V 操作）描述上述操作之间的同步关系，并说明所用信号量及其初值。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2020,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "本题要求实现操作的先后顺序，没有互斥关系，是一个简单的同步问题。 本题虽然有 5 个操作，但是只有 4 个同步关系，因此分别设置信号量 SAC、SBC、SCE 和 SDE 对应 4 个同步关系。semaphore SAC = 0; // 实现 A 是 C 的前驱关系 semaphore SBC = 0; // 实现 B 是 C 的前驱关系 semaphore SCE = 0; // 实现 C 是 E 的前驱关系 semaphore SDE = 0; // 实现 D 是 E 的前驱关系 A() { 操作A; V(SAC); } B() { 操作B; V(SBC); } C() { P(SAC); P(SBC); 操作C; V(SCE); } D() { 操作D; V(SDE); } E() { P(SCE); P(SDE); 操作E; }",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2020-46",
    "number": "2020 年 · 第 46 题",
    "title": "2020 年 408 操作系统 · 第 46 题",
    "prompt": "某 32 位系统采用基于二级页表的请求分页存储管理方式，按字节编址，页目录项和页表项长度均为 4 字节，虚拟地址结构如下所示。 页目录号（10 位）​页号（10 位）​页内偏移量（12 位）​​ 某 C 程序中数组 a[1024][1024]的起始虚拟地址为 1080 0000H，数组元素占 4 字节，该程序运行时，其进程的页目录起始物理地址为 0020 1000H，请回答下列问题。 (1) 数组元素 a[1][2]的虚拟地址是什么？对应的页目录号和页号分别是什么？对应的页目录项的物理地址是什么？若该目录项中存放的页框号为 00301H，则 a[1][2]所在页对应的页表项的物理地址是什么？ (2) 数组 a 在虚拟地址空间中所占区域是否必须连续？在物理地址空间中所占区域是否必须连续？ (3) 已知数组 a 按行优先方式存放，若对数组 a 分别按行遍历和按列遍历，则哪一种遍历方式的局部性更好？",
    "status": "真题",
    "tags": [
      "地址翻译",
      "虚拟页式管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-4-1-2",
      "OS-KP-4-2"
    ],
    "year": 2020,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1） ①页面大小= 212 B = 4096B = 4KB。每个数组元素 4B，每个页面可以存放 4KB/4B= 1024 个数组元素，正好是数组的一行，数组 a 按行优先方式存放。10800000H 的虚 页号为 10800H，因此 a[0] 行存放在虚页号为 10800H 的页面中，a[1] 行存放在页号 为 10801H 的页面中。a[1][2] 的虚拟地址为 10801000H+4×2=10801008H。②转换为二进制 0001 0000 1000 0000 0001 0000 0000 1000，根据虚拟地址结构可知，对 应的页目录号为 042H，页号为 001H。③进程的页目录表起始地址为 00201000H，每个页目录项长 4B，因此 042H 号页目录 项的物理地址是 00201000H+4×42H=00201108H。④页目录项存放的页框号为 00301H，二级页表的起始地址为 00301000H，因此 a[1][2] 所在页的页号为 001H，每个页表项 4B，因此对应的页表项物理地址是 00301000H + 001H×4 = 00301004H。2）根据数组的随机存取特点，数组 a 在虚拟地址空间中所占的区域必须连续，由于数组 a 不止占用一页，相邻逻辑页在物理上不一定相邻，因此数组 a 在物理地址空间中所占的 区域可以不连续。3）由 1）可知每个页面正好可以存放一整行的数组元素，“按行优先方式存放”意味着数 组的同一行的所有元素都存放在同一个页面中，同一列的各个元素都存放在不同的页面 中，因此数组 a 按行遍历的局部性较好。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2020/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-23",
    "number": "2019 年 · 第 23 题",
    "title": "2019 年 408 操作系统 · 第 23 题",
    "prompt": "下列关于线程的描述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "用户级和内核级线程"
    ],
    "knowledgeIds": [
      "OS-KP-6-5-6"
    ],
    "year": 2019,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "内核级线程的调度由操作系统完成"
      },
      {
        "label": "B",
        "text": "操作系统为每个用户级线程建立一个线程控制块"
      },
      {
        "label": "C",
        "text": "用户级线程间的切换比内核级线程间的切换效率高"
      },
      {
        "label": "D",
        "text": "用户级线程可以在不支持内核级线程的操作系统上实现"
      }
    ],
    "answer": "B",
    "solution": "应用程序没有进行线程管理的代码，只有一个到内核级线程的编程接口，内核为进程及其内部的每个线程维护上下文信息，调度也是在内核中由操作系统完成的，选项 A 正确。在多线程模型中，用户级线程和内核级线程 的连接方式分为多对一、一对一、多对多，“操作系统为每个用户线程建立一个线程控制块”属于一对一模型，选项 B 错误。用户级线程的切换可以在用户空间完成，内核级线程的切换需要操作系统帮助进行调度，故用户级线程的切换效率更高，选项 C 正确。用户级线程的管理工作可以只在用户空间中进行，故可以在不支持内核级线程的操作系统上实现，选项 D 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-24",
    "number": "2019 年 · 第 24 题",
    "title": "2019 年 408 操作系统 · 第 24 题",
    "prompt": "下列选项中，可能将进程唤醒的事件是（ ）。 Ⅰ.I/O 结束 Ⅱ.某进程退出临界区 Ⅲ.当前进程的时间片用完",
    "status": "真题",
    "tags": [
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-8"
    ],
    "year": 2019,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ"
      },
      {
        "label": "B",
        "text": "仅Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ"
      }
    ],
    "answer": "C",
    "solution": "参考 进程状态转化，当被阻塞进程等待的某资源为可用时，进程将会被唤醒。I/O 结束后，等待该 I/O 结束而被阻塞的有关进程就会被唤醒，Ⅰ正确；某进程退出临界区后，之前因需要进入该临界区而被阻塞的有关进程就会被唤醒，Ⅱ正确，当前进程的时间片用完后进入就绪队列等待重新调度，优先级最高的进程将获得处理机资源从就绪态变成执行态，Ⅲ错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-25",
    "number": "2019 年 · 第 25 题",
    "title": "2019 年 408 操作系统 · 第 25 题",
    "prompt": "下列关于系统调用的叙述中，正确的是（ ）。 Ⅰ.在执行系统调用服务程序的过程中，CPU 处于内核态 Ⅱ.操作系统通过提供系统调用避免用户程序直接访问外设 Ⅲ.不同的操作系统为应用程序提供了统一的系统调用接口 Ⅳ.系统调用是操作系统内核为应用程序提供服务的接口",
    "status": "真题",
    "tags": [
      "系统调用",
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-5",
      "OS-KP-3-2-4"
    ],
    "year": 2019,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅳ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅱ、Ⅳ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "C",
    "solution": "用户可以在用户态调用操作系统的服务，但执行具体的系统调用服务程序是处于内核态的，Ⅰ正确：设备管理属于操作系统的职能之一，包括对输入/输出设备的分配、初始化、维护等，用户程序需要通过系统调用使用操作系统的设备管理服务，Ⅱ正确：操作系统不同，底层逻辑、实现方式均不相同，为应用程序提供的系统调用接口也不同，Ⅲ错误：系统调用是用户在程序中调用操作系统提供的子功能，Ⅳ正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-26",
    "number": "2019 年 · 第 26 题",
    "title": "2019 年 408 操作系统 · 第 26 题",
    "prompt": "下列选项中，可用于文件系统管理空闲磁盘块的数据结构是（ ）。 Ⅰ. 位图 Ⅱ. 索引结点 Ⅲ. 空闲磁盘块链 Ⅳ. 文件分配表 (FAT)",
    "status": "真题",
    "tags": [
      "外存空间管理"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-5"
    ],
    "year": 2019,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "B",
        "text": "仅Ⅰ、Ⅲ、Ⅳ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅲ"
      },
      {
        "label": "D",
        "text": "仅Ⅱ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "B",
    "solution": "传统的文件系统 管理空间磁盘的方法 包括空闲表法、空闲链表法、位示图和成组链接法，Ⅰ、Ⅲ 正确。文件分配表（FAT）的表项与物理磁盘块一一对应，并且可以用一个特殊的数字 -1 表示文件的最后一块，用 -2 表示这个磁盘块是空闲的（当然，规定用 -3、-4 来表示也是可行的）。因此文件分配表（FAT）不仅记录了文件中各个块的先后链接关系，同时还标记了空闲的磁盘块，操作系统可以通过 FAT 对文件存储空间进行管理，Ⅳ正确。索引结点是操作系统为了实现文件名与文件信息分开而设计的数据结构，存储了文件描述信息，索引结点属于文件目录管理部分的内容，Ⅱ错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-27",
    "number": "2019 年 · 第 27 题",
    "title": "2019 年 408 操作系统 · 第 27 题",
    "prompt": "系统采用二级反馈队列调度算法进行进程调度。就绪队列 Q1 采用时间片轮转调度算法，时间片为 10ms；就绪队列 Q2 采用短进程优先调度算法；系统优先调度 Q1 队列中的进程，当 Q1 为空时系统才会调度 Q2 中的进程；新创建的进程首先进入 Q1;Q1 中的进程执行一个时间片后，若未结束，则转入 Q2。若当前 Q1，Q2 为空，系统依次创建进程 P1，P2 后即开始进程调度，P1,P2 需要的 CPU 时间分别为 30ms 和 20ms，则进程 P1，P2 在系统中的平均等待时间为（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2019,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "25ms"
      },
      {
        "label": "B",
        "text": "20ms"
      },
      {
        "label": "C",
        "text": "15ms"
      },
      {
        "label": "D",
        "text": "10ms"
      }
    ],
    "answer": "C",
    "solution": "参考 多级反馈队列。进程 P1、P2 依次创建后进入队列 Q1，根据时间片调度算法的规则，进程 P1、P2 将依次被分配 10ms 的 CPU 时间，两个进程分别执行完一个时间片后都会被转入队列 Q2，就绪队列 Q2 采用短进程优先调度算法，此时 P1 还需要 20ms 的 CPU 时间，P2 还需要 10ms 的 CPU 时间，所以 P2 会被优先调度执行，10ms 后进程 P2 执行完成，之后 P1 再调度执行，再过 20ms 后 P1 也执行完成。平均等待时间 = (P1 等待时间 + P2 等待时间) / 2 = (20 + 10) / 2 = 15。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-28",
    "number": "2019 年 · 第 28 题",
    "title": "2019 年 408 操作系统 · 第 28 题",
    "prompt": "在分段存储管理系统中，用共享段表描述所有共享的段。若进程 P1 和 P2 共享段 S，下列叙述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "段式内存管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1"
    ],
    "year": 2019,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "在物理内存中仅保存一份段 S 的内容"
      },
      {
        "label": "B",
        "text": "段 S 在 P1 和 P2 中应该具有相同的段号"
      },
      {
        "label": "C",
        "text": "P1 和 P2 共享段 S 在共享段表中的段表项"
      },
      {
        "label": "D",
        "text": "P1 和 P2 都不再使用段 S 时才回收段 S 所占的内存空间"
      }
    ],
    "answer": "B",
    "solution": "本题考察 段式管理。段的共享是通过两个作业的段表中相应表项指向被共享的段的同一个物理副本来实现的，因此在内存中仅保存一份段 s 的内容。选项 A 正确。段 S 对于进程 P1，P2 来说，使用位置可能不同，所以在不同进程中的逻辑段号可能不同，选项 B 错误。段表项存放的是段的物理地址，对于共享段 S 来说物理地址唯一，选项 C 正确。为了保证进程可以顺利使用段 S，段 S 必须确保在没有任何进程使用它后才能被删除，选项 D 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-29",
    "number": "2019 年 · 第 29 题",
    "title": "2019 年 408 操作系统 · 第 29 题",
    "prompt": "某系统采用 LRU 页置换算法和局部置换策略，若系统为进程 P 预分配了 4 个页框，进程 P 访问页号的序列为 0, 1, 2, 7, 0, 5, 3, 5, 0, 2, 7, 6，则进程访问上述页的过程中，产生页置换的总次数是（ ）。",
    "status": "真题",
    "tags": [
      "手册审计路由"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-2"
    ],
    "year": 2019,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "3"
      },
      {
        "label": "B",
        "text": "4"
      },
      {
        "label": "C",
        "text": "5"
      },
      {
        "label": "D",
        "text": "6"
      }
    ],
    "answer": "C",
    "solution": "LRU 每次执行页面置换时会换出最近最久没有使用过的页面。第一次访问 5 页面时，会把最久未被使用的 1 页面换出，第一次访问 3 页面时，会把最久未访问的 2 页面换出。具体的页面置换情况如下图所示：访问页面012705350276物理块100000000000物理块11115555556物理块2222333377物理块777777222缺页否√√√√√√√√√需要注意的是：题中问的是页置换算法，而不是缺页次数，所以前 4 次缺页未还也的操作不考虑在内，答案为 5 次，故选 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#29",
    "sourceNote": "题库没有标签；根据 LRU 与局部置换题干路由，待人工复核。",
    "images": []
  },
  {
    "id": "real-2019-30",
    "number": "2019 年 · 第 30 题",
    "title": "2019 年 408 操作系统 · 第 30 题",
    "prompt": "下列关于死锁的叙述中，正确的是（ ）。 Ⅰ、可以通过剥夺进程资源解除死锁 Ⅱ、死锁的预防方法能确保系统不发生死锁 Ⅲ、银行家算法可以判断系统是否处于死锁状态 Ⅳ、当系统出现死锁时，必然有两个或两个以上的进程处于阻塞态",
    "status": "真题",
    "tags": [
      "死锁产生的必要条件"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-1"
    ],
    "year": 2019,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "B",
        "text": "仅Ⅰ、Ⅱ、Ⅳ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅱ、Ⅲ"
      },
      {
        "label": "D",
        "text": "仅Ⅰ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "B",
    "solution": "本题考察 死锁 相关知识。剥夺进程资源，将其分配给其他死锁进程，可以解除死锁，Ⅰ正确。死锁预防是死锁处理策略（死锁预防、死锁避免、死锁检测）中最为严苛的一种策略，破坏死锁产生的 4 个必要条件之一。可以确保系统不发生死锁，Ⅱ正确。银行家算法是一种死锁避免算法，用于计算动态资源分配的完全性以避免系统进入死锁状态，不能用于判断系统是否处于死锁，Ⅲ错误。通过简化资源分配图可以检测系统是否为死锁状态，当系统出现死锁时，资源分配图不可完全简化。只有两个成两个以上的进程才会出现“环”而不能被简化，Ⅳ正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-31",
    "number": "2019 年 · 第 31 题",
    "title": "2019 年 408 操作系统 · 第 31 题",
    "prompt": "某计算机主存按字节编址，采用二级分页存储管理，地址结构如下所示： 虚拟地址 20501225H 对应的页目录号、页号分别是（ ）。",
    "status": "真题",
    "tags": [
      "地址翻译",
      "页表"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-4-1-4",
      "OS-KP-4-2-2"
    ],
    "year": 2019,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "081H、101H"
      },
      {
        "label": "B",
        "text": "081H、401H"
      },
      {
        "label": "C",
        "text": "201H、101H"
      },
      {
        "label": "D",
        "text": "201H、401H"
      }
    ],
    "answer": "A",
    "solution": "题中给出的是十六进制地址，首先将它转化为二进制地址，然后用二进制地址去匹配题中对应的地址结构。转换为进制地址和地址结构的对应关系如下所示。2050 1225H = 0010 0000 01010000 00010010 00100101前 10 位、1120 位、2132 位分别对应页目录号、页号和页内偏移。把页目录号、页号单独拿出，转换为十六进制时缺少的位数在高位补零，0000 1000 0001、0001 0000 0001 分别对应 081H、101H，选项 A 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2019/assets/q31-question-01.png"
    ]
  },
  {
    "id": "real-2019-32",
    "number": "2019 年 · 第 32 题",
    "title": "2019 年 408 操作系统 · 第 32 题",
    "prompt": "在下列动态分区分配算法中，最容易产生内存碎片的是（ ）。",
    "status": "真题",
    "tags": [
      "动态内存管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-5"
    ],
    "year": 2019,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "首次适应算法"
      },
      {
        "label": "B",
        "text": "最坏适应算法"
      },
      {
        "label": "C",
        "text": "最佳适应算法"
      },
      {
        "label": "D",
        "text": "循环首次适应算法"
      }
    ],
    "answer": "C",
    "solution": "最佳适应算法总是匹配与当前大小要求最接近的空闲分区，但是大多数情况下空闲分区的大小不可能完全和当前要求的大小相等，几乎每次分配内存都会产生很小的难以利用的内存块，所以最佳适应算法最容易产生最多的内存碎片，选项 C 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-43",
    "number": "2019 年 · 第 43 题",
    "title": "2019 年 408 操作系统 · 第 43 题",
    "prompt": "有 n（n ≥ 3）位哲学家围坐在一张圆桌边，每位哲学家交替地就餐和思考。在圆桌中心有 m（m ≥ 1）个碗，每两位哲学家之间有一根筷子。每位哲学家必须取到一个碗和两侧的筷子后，才能就餐，进餐完毕，将碗和筷子放回原位，并继续思考。为使尽可能多的哲学家同时就餐，且防止出现死锁现象，请使用信号量的 P、V 操作（wait()、signal() 操作）描述上述过程中的互斥与同步，并说明所用信号量及初值的含义。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2019,
    "questionNumber": 43,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "回顾传统的哲学家就餐问题，假设餐桌上有 n 个哲学家、根筷子，那么可以用这种方法避免死锁：限制至多允许 n-1 个哲学家同时“抢”筷子，那么至少会有 1 个哲学家可以获得两根筷子并顺利进餐，于是不可能发生死锁的情况。本题可以用碗这个限制资源来避免死锁：当碗的数量 m 小于哲学家的数量 n 时，可以直接让碗的资源量等于 m，确保不会出现所有哲学家都拿一侧筷子而无限等待另一侧筷子进而造成死锁的情况；当碗的数量大于等于哲学家的数量时，为了让碗起到同样的限制效果，我们让碗的资源量等于 -1，这样就能保证最多只有 n-1 个哲学家同时进餐，所以得到碗的资源量为 min{n-1, m}。在进 PV 操作时，碗的资源量起限制哲学家取筷子的作用，所以需要先对碗的资源量进行 P 操作。具体过程如下：// 限制哲学家能同时拿到盘子的数量 semaphore fork[n] = {1}; // 并发盘子数量 < n semaphore plate = min(m, n-1); philosopher(int i) { while (1) { think(); P(plate); P(fork[i]); P(fork[(i + 1) % n]); eat(); V(fork[i]); V(fork[(i + 1) % n]); V(plate); } }",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#43",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2019-44",
    "number": "2019 年 · 第 44 题",
    "title": "2019 年 408 操作系统 · 第 44 题",
    "prompt": "某计算机系统中的磁盘有 300 个柱面，每个柱面有 10 个磁道，每个磁道有 200 个扇区，扇区大小为 512B。文件系统的每个簇包含 2 个扇区。请回答下列问题： (1) 磁盘的容量是多少？ (2) 假设磁头在 85 号柱面上，此时有 4 个磁盘访问请求，簇号分别为 100260、60005、101660 和 110560。若采用最短寻道时间优先 (SSTF) 调度算法，则系统访问簇的先后次序是什么？ (3) 第 100530 簇在磁盘上的物理地址是什么？将簇号转换成磁盘物理地址的过程是由 I/O 系统的什么程序完成的？",
    "status": "真题",
    "tags": [
      "机械硬盘",
      "CHS地址",
      "IO软件层次"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3",
      "OS-KP-13-3"
    ],
    "year": 2019,
    "questionNumber": 44,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）磁盘容量 = 磁盘的柱面数每个柱面的磁道数每个磁道的扇区数每个扇区的大小 = (300×10×200×512/1024)KB=3×105KB 。2）磁头在 85 号柱面上，对 SSTF 算法而言，总是访问当前柱面距离最近的地址。注意每 个簇包含 2 个扇区，通过计算得到，85 号柱面对应的簇号为 85000～85999。通过比较得 出，系统最先访问离 85000～85999 最近的 100260，随后访问离 100260 最近的 101660， 然后访问 110560，最后访问 60005。顺序为 100260、101660、110560、60005。3）参考 CHS 地址，第 100530 簇在磁盘上的物理地址由其所在的柱面号、磁道号、扇区号构成。柱面号= ⌊簇号/每个柱面的簇数⌋ = ⌊100530/(10×200/2)⌋ = 100。磁道号 = ⌊(簇号%每个柱面的簇数)/每个磁道的簇数⌋ = ⌊530/(200/2)⌋ = 5。扇区号 = 扇区地址%每个磁道的扇区数 = (530×2) % 200 = 60。将簇号转换成磁盘物理地址的过程由磁盘驱动程序完成。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2019/#44",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-23",
    "number": "2018 年 · 第 23 题",
    "title": "2018 年 408 操作系统 · 第 23 题",
    "prompt": "下列关于多任务操作系统的叙述中，正确的是（ ）。 Ⅰ.具有并发和并行的特点 Ⅱ.需要实现对共享资源的保护 Ⅲ.需要运行在多 CPU 的硬件平台上",
    "status": "真题",
    "tags": [
      "操作系统概念"
    ],
    "knowledgeIds": [
      "OS-KP-1-2"
    ],
    "year": 2018,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ"
      }
    ],
    "answer": "C",
    "solution": "多任务操作系统可以在同一时间内运行多个应用程序，故 Ⅰ 正确。多个任务必须互斥地访问共享资源，为达到这一目标必须对共享资源进行必要的保护，故 Ⅱ 正确。现代操作系统都是多任务的（主要特点是并发和并行），并不一定需要运行在多 CPU 的硬件上，单个 CPU 也可以满足要求，Ⅲ 错误。综上所述，Ⅰ、Ⅱ 正确，Ⅲ 错误，故选 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-24",
    "number": "2018 年 · 第 24 题",
    "title": "2018 年 408 操作系统 · 第 24 题",
    "prompt": "某系统采用基于优先权的非抢占式进程调度策略，完成一次进程调度和进程切换的系统时间开销为 1us。在 T 时刻就绪队列中有 3 个进程 P1、P2 和 P3，其在就绪队列中的等待时间、需要的 CPU 时间和优先权如下表所示。若优先权值大的进程优先获得 CPU，从 T 时刻起系统开始进程调度，则系统的平均周转时间为（）。 进程等待时间需要的 CPU 时间优先级P130us12us10P215us24us30P318us36us20",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2018,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "54us"
      },
      {
        "label": "B",
        "text": "73us"
      },
      {
        "label": "C",
        "text": "74us"
      },
      {
        "label": "D",
        "text": "75us"
      }
    ],
    "answer": "D",
    "solution": "本题考察 非抢占式优先级调度，由优先权可知，进程的执行顺序为 P2 → P3 → P1。P2 的周转时间：1 +15+24= 40μsP3 的周转时间：18+1+24+1 +36= 80μsP1 的周转时间：30+1+24 +1 +36+1 +12=105μs平均周转时间： (40+80+105) /3= 225/3= 75μs, 故选 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-25",
    "number": "2018 年 · 第 25 题",
    "title": "2018 年 408 操作系统 · 第 25 题",
    "prompt": "属于同一进程的两个线程 thread1 和 thread2 并发执行，共享初值为 0 的全局变量 x。thread1 和 thread2 实现对全局变量 x 加 1 的机器级代码描述如下： thread1 mov R1, x // (x) → R1 inc R1 // (R1) + 1 → R1 mov x, R1 // (R1) → x thread2 mov R2, x // (x) → R2 inc R2 // (R2) + 1 → R2 mov x, R2 // (R2) → x 在所有可能的指令执行序列中，使 x 的值为 2 的序列个数是（）。",
    "status": "真题",
    "tags": [
      "进程和线程"
    ],
    "knowledgeIds": [
      "OS-KP-6-5-2"
    ],
    "year": 2018,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "2"
      },
      {
        "label": "C",
        "text": "3"
      },
      {
        "label": "D",
        "text": "4"
      }
    ],
    "answer": "B",
    "solution": "仔细阅读两个线程代码可知，threadl 和 thread2 均是对 x 进行加 1 操作，x 初始值为 0，若要使得最终 x = 2，只有先执行 thread1 再执行 thread2，或先执行 thread2 再执行 threadl，故只有 2 种可能，选 B。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-26",
    "number": "2018 年 · 第 26 题",
    "title": "2018 年 408 操作系统 · 第 26 题",
    "prompt": "假设系统中有 4 个同类资源，进程 P1、P2 和 P3 需要的资源数分别为 4、3 和 1，P1、P2 和 P3 已申请到的资源数分别为 2、1 和 0，则执行安全性检测算法的结果是（）。",
    "status": "真题",
    "tags": [
      "银行家算法"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-4"
    ],
    "year": 2018,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "不存在安全序列，系统处于不安全状态"
      },
      {
        "label": "B",
        "text": "存在多个安全序列，系统处于安全状态"
      },
      {
        "label": "C",
        "text": "存在唯一安全序列 P3、P1、P2，系统处于安全状态"
      },
      {
        "label": "D",
        "text": "存在唯一安全序列 P3、P2、P1，系统处于安全状态"
      }
    ],
    "answer": "A",
    "solution": "本题考察安全性检查，由题中数据可知，仅剩最后一个同类资源，若将其分给 P1 或 P2，则均无法正常执行；若分给 P3，则 P3 正常执行完成后，释放的这个资源仍无法使 P1、P2 正常执行，故不存在安全序列，选 A。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-27",
    "number": "2018 年 · 第 27 题",
    "title": "2018 年 408 操作系统 · 第 27 题",
    "prompt": "下列选项中，可能导致当前进程 P 阻塞的事件是（ ）。 Ⅰ.进程 P 申请临界资源 Ⅱ.进程 P 从磁盘读数据 Ⅲ.系统将 CPU 分配给高优先级的进程",
    "status": "真题",
    "tags": [
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-8"
    ],
    "year": 2018,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ"
      }
    ],
    "answer": "C",
    "solution": "本题考察 进程的状态转化，进程等待某资源为可用（不包括处理机）或等待输入／输出完成均会进入阻塞状态，故 I、II 正确；III 中情况发生时，进程进入就绪状态，故 III 错误，答案选 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-28",
    "number": "2018 年 · 第 28 题",
    "title": "2018 年 408 操作系统 · 第 28 题",
    "prompt": "若 x 是管程内的条件变量，则当进程执行 x.wait() 时所做的工作是（）。",
    "status": "真题",
    "tags": [
      "管程",
      "条件变量"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-3"
    ],
    "year": 2018,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "实现对变量 x 的互斥访问"
      },
      {
        "label": "B",
        "text": "唤醒一个在 x 上阻塞的进程"
      },
      {
        "label": "C",
        "text": "根据 x 的值判断该进程是否进入阻塞态"
      },
      {
        "label": "D",
        "text": "阻塞该进程，并将之插入 x 的阻塞队列中"
      }
    ],
    "answer": "D",
    "solution": "条件变量 是 管程 内部说明和使用的一种特殊变量，其作用类似于信号量机制中的信号量，都是用于实现进程同步的。需要注意的是，在同一时刻，管程中只能有一个进程在执行。如果进程 A 执行了 x.wait() 操作，那么该进程会阻塞，并挂到条件变量 x 对应的阻塞队列上。这样，管程的使用权被释放，就可以有另一个进程进入管程。如果进程 B 执行了 x.signal() 操作，那么会唤醒 x 对应的阻塞队列队头进程。在 Pascal 语言的管程中，规定只有一个进程要离开管程时才能调用 signal() 操作。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-29",
    "number": "2018 年 · 第 29 题",
    "title": "2018 年 408 操作系统 · 第 29 题",
    "prompt": "定时器产生时钟中断后，由时钟中断服务程序更新的部分内容是（ ）。 Ⅰ.内核中时钟变量的值 Ⅱ.当前进程占用 CPU 的时间 Ⅲ.当前进程在时间片内的剩余执行时间",
    "status": "真题",
    "tags": [
      "中断IO"
    ],
    "knowledgeIds": [
      "OS-KP-13-2-4"
    ],
    "year": 2018,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅲ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ"
      }
    ],
    "answer": "D",
    "solution": "时钟中断的主要工作是处理和时间有关的信息以及决定是否执行调度程序，和时间有关的所有信息，包括系统时间、进程的时间片、延时、使用 CPU 的时间、各种定时器，故 Ⅰ、Ⅱ、Ⅲ 均正确，选 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-30",
    "number": "2018 年 · 第 30 题",
    "title": "2018 年 408 操作系统 · 第 30 题",
    "prompt": "系统总是访问磁盘的某个磁道而不响应对其他磁道的访问请求，这种现象称为磁臂黏着。下列磁盘调度算法中，不会导致磁臂粘着的是（ ）。",
    "status": "真题",
    "tags": [
      "磁盘调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3"
    ],
    "year": 2018,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "先来先服务 (FCFS)"
      },
      {
        "label": "B",
        "text": "最短寻道时间优先 (SSTF)"
      },
      {
        "label": "C",
        "text": "扫描算法 (SCAN)"
      },
      {
        "label": "D",
        "text": "循环扫描算法 (CSCAN)"
      }
    ],
    "answer": "A",
    "solution": "参考 机械硬盘调度算法，当系统总是持续出现某个磁道的访问请求时，均持续满足最短寻道时间优先、扫描算法和循环扫描算法的访问条件，会一直服务该访问请求。因此，先来先服务按照请求次序进行调度，比较公平，故选 A。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-31",
    "number": "2018 年 · 第 31 题",
    "title": "2018 年 408 操作系统 · 第 31 题",
    "prompt": "下列优化方法中，可以提高文件访问速度的是（ ）。 Ⅰ. 提前读 Ⅱ. 为文件分配连续的簇 Ⅲ. 延迟写 Ⅳ. 采用磁盘高速缓存",
    "status": "真题",
    "tags": [
      "缓冲区"
    ],
    "knowledgeIds": [
      "OS-KP-13-3-3"
    ],
    "year": 2018,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "II 和 IV 显然均能提高文件访问速度。对于 I，提前读是指在读当前盘块时，将下一个可能要访问的盘块数据读入缓冲区，以便需要时直接从缓冲区中读取，提高了文件的访问速度。对于 III，延迟写是先将写数据写入缓冲区，并置上“延迟写”标志，以备不久之后访问，当缓冲区需要再次被分配出去时才将缓冲区数据写入磁盘，减少了访问磁盘的次数，提高了文件的访问速度，III 也正确，答案选 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-32",
    "number": "2018 年 · 第 32 题",
    "title": "2018 年 408 操作系统 · 第 32 题",
    "prompt": "在下列同步机制中，可以实现让权等待的是（ ）。",
    "status": "真题",
    "tags": [
      "信号量",
      "硬件互斥指令"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-4",
      "OS-KP-9-2-1"
    ],
    "year": 2018,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "Peterson 方法"
      },
      {
        "label": "B",
        "text": "swap 指令"
      },
      {
        "label": "C",
        "text": "信号量方法"
      },
      {
        "label": "D",
        "text": "TestAndSet 指令"
      }
    ],
    "answer": "C",
    "solution": "硬件方法实现进程同步需要通过 自旋锁，不能实现让权等待，故 B、D 错误；Peterson 算法满足有限等待但不满足让权等待，故 A 错误；记录型信号量由千引入阻塞机制，消除了不让权等待的情况，故 C 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-45",
    "number": "2018 年 · 第 45 题",
    "title": "2018 年 408 操作系统 · 第 45 题",
    "prompt": "请根据题 44 图给出的虚拟存储管理方式，回答下列问题。 (1) 某虚拟地址对应的页目录号为 6，在相应的页表中对应的页号为 6，页内偏移量为 8，该虚拟地址的十六进制表示是什么？ (2) 寄存器 PDBR 用于保存当前进程的页目录起始地址，该地址是物理地址还是虚拟地址？进程切换时，PDBR 的内容是否会变化？说明理由。同一进程的线程切换时，PDBR 的内容是否会变化？说明理由。 (3) 为了支持改进型 CLOCK 置换算法，需要在页表项中设置哪些字段？",
    "status": "真题",
    "tags": [
      "地址翻译",
      "clock算法"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-5-2-2"
    ],
    "year": 2018,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）由图可知，地址总长度为 32 位，高 20 位为虚页号，低 12 位为页内地址，且虚页号高 10 位为页目录号，低 10 位为页号。十六进制表示为 01806008H。2）PDBR 为页目录基址地址寄存器（Page-Directory Base Register），其存储页目录表物理内存基地址。进程切换时，PDBR 的内容会变化；同一进程的线程切换时，PDBR 的内容不会变化。每个进程的地址空间、页目录和 PDBR 的内容存在一一对应的关系。进程切换时，地址空间发生了变化，对应的页目录及其起始地址也相应变化，因此需要用进程切换后当前进程的页目录起始地址刷新 PDBR。同一进程中的线程共享该进程的地址空间，其线程发生切换时，地址空间不变，线程使用的页目录不变，因此 PDBR 的内容也不变。3）改进型 Clock 置换算法需要用到使用位和修改位，故需要设置访问字段（使用位）和修改字段（脏位）。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2018-46",
    "number": "2018 年 · 第 46 题",
    "title": "2018 年 408 操作系统 · 第 46 题",
    "prompt": "某文件系统采用索引节点存放文件的属性和地址信息，簇大小为 4KB。每个文件索引节点占 64B，有 11 个地址项，其中直接地址项 8 个，一级、二级和三级间接地址项各 1 个，每个地址项长度为 4B。请回答下列问题。 (1) 该文件系统能支持的最大文件长度是多少？（给出计算表达式即可） (2) 文件系统用 1M（1M= 220 ）个簇存放文件索引节点，用 512M 个簇存放文件数据。若一个图像文件的大小为 5600B，则该文件系统最多能存放多少个这样的图像文件？ (3) 若文件 F1 的大小为 6KB，文件 F2 的大小为 40KB，则该文件系统获取 F1 和 F2 最后一个簇的簇号需要的时间是否相同？为什么？",
    "status": "真题",
    "tags": [
      "文件物理结构",
      "文件系统"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3",
      "OS-KP-11-1"
    ],
    "year": 2018,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）簇大小为 4KB，每个地址项长度为 4B，故每簇有 4KB/4B = 1024 个地址项。最大文件的物理块数可达 8+1×1024+1×10242+1×10243 ，每个物理块（簇）大小为 4KB，故最大文件长度为 (8+1×1024+1×10242+1×10243)×4KB=32KB+4MB+4GB+4TB 。2）文件索引节点总个数为 1M×4KB/64B=64M，5600B 的文件占 2 个簇，512M 个簇可存放的文件总个数为 512M/2=256M。可表示的文件总个数受限于文件索引节点总个数，故能存储 64M 个大小为 5600B 的图像文件。3）文件 F1 的大小为 6KB<4KB×8=32KB ，故获取文件 F1 的最后一个簇的簇号只需要访问索引节点的直接地址项。文件 F2 的大小为 40KB， 4KB×8<40KB<4KB×8+4KB×1024 ，故获取 F2 的最后一个簇的簇号还需要读一级索引表。综上，需要的时间不相同。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2018/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-23",
    "number": "2017 年 · 第 23 题",
    "title": "2017 年 408 操作系统 · 第 23 题",
    "prompt": "假设 4 个作业到达系统的时刻和运行时间如下表所示。 作业达到时刻 t运行时间J1​03J2​13J3​12J4​31 系统在 t=2 时开始作业调度。若分别采用先来先服务和短作业优先调度算法，则选中的作业分别是（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2017,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "J2​ 、 J3​"
      },
      {
        "label": "B",
        "text": "J1​ 、 J4​"
      },
      {
        "label": "C",
        "text": "J2​ 、 J4​"
      },
      {
        "label": "D",
        "text": "J1​ 、 J3​"
      }
    ],
    "answer": "D",
    "solution": "先来先服务 是作业来得越早，优先级越高，因此会选择 J1​ 。最短作业优先是作业运行时间越短，优先级越高，因此会选择 J3​ 。所以 D 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-24",
    "number": "2017 年 · 第 24 题",
    "title": "2017 年 408 操作系统 · 第 24 题",
    "prompt": "执行系统调用的过程包括如下主要操作： ①返回用户态 ②执行陷入（trap）指令 ③传递系统调用参数 ④执行相应的服务程序 正确的执行顺序是（ ）。",
    "status": "真题",
    "tags": [
      "系统调用"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-5"
    ],
    "year": 2017,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "②→③→①→④"
      },
      {
        "label": "B",
        "text": "②→④→③→①"
      },
      {
        "label": "C",
        "text": "③→②→④→①"
      },
      {
        "label": "D",
        "text": "③→④→②→①"
      }
    ],
    "answer": "C",
    "solution": "执行 系统调用 的过程是这样的：正在运行的进程先传递系统调用参数，然后由 陷入指令 负责将用户态转化为内核态，并将返回地址压入堆栈以备后用，接下来 CPU 执行相应的内核态服务程序，最后返回用户态。所以 C 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-25",
    "number": "2017 年 · 第 25 题",
    "title": "2017 年 408 操作系统 · 第 25 题",
    "prompt": "某计算机按字节编址，其动态分区内存管理采用最佳适应算法，每次分配和回收内存后都对空闲分区链重新排序。当前空闲分区信息如下表所示。 分区起始地址20K500K1000K200K分区大小40KB80KB100KB200KB 回收起始地址为 60K、大小为 140KB 的分区后，系统中空闲分区的数量、空闲分区链第一个分区的起始地址和大小分别是（ ）。",
    "status": "真题",
    "tags": [
      "动态内存管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-5"
    ],
    "year": 2017,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "3、20K、380KB"
      },
      {
        "label": "B",
        "text": "3、500K、80KB"
      },
      {
        "label": "C",
        "text": "4、20K、180KB"
      },
      {
        "label": "D",
        "text": "4、500K、80KB"
      }
    ],
    "answer": "B",
    "solution": "参考 动态内存内存回收过程，回收起始地址为 60K、大小为 140KB 的分区时，它与表中第一个分区和第四个分区合并，成为起始地址为 20K、大小为 380KB 的分区，剩余 3 个空闲分区。在回收内存后，算法会对空闲分区链按分区大小由小到大进行排序，表中的第二个分区排第一。所以选择 B。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-26",
    "number": "2017 年 · 第 26 题",
    "title": "2017 年 408 操作系统 · 第 26 题",
    "prompt": "某文件系统的簇和磁盘扇区大小分别为 1KB 和 512B。若一个文件的大小为 1026B，则系统分配给该文件的磁盘空间大小是（ ）。",
    "status": "真题",
    "tags": [
      "外存空间管理"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-5"
    ],
    "year": 2017,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "1026B"
      },
      {
        "label": "B",
        "text": "1536B"
      },
      {
        "label": "C",
        "text": "1538B"
      },
      {
        "label": "D",
        "text": "2048B"
      }
    ],
    "answer": "D",
    "solution": "在文件系统中，磁盘空间 以簇为单位 分配，每个簇的大小为 1KB（1024B）。而磁盘扇区大小为 512B，但分配时只考虑簇的整数倍。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-27",
    "number": "2017 年 · 第 27 题",
    "title": "2017 年 408 操作系统 · 第 27 题",
    "prompt": "下列有关基于时间片的进程调度的叙述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法",
      "时间片轮转"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4",
      "OS-KP-7-3-4"
    ],
    "year": 2017,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "时间片越短，进程切换的次数越多，系统开销也越大"
      },
      {
        "label": "B",
        "text": "当前进程的时间片用完后，该进程状态由执行态变为阻塞态"
      },
      {
        "label": "C",
        "text": "时钟中断发生后，系统会修改当前进程在时间片内的剩余时间"
      },
      {
        "label": "D",
        "text": "影响时间片大小的主要因素包括响应时间、系统开销和进程数量等"
      }
    ],
    "answer": "B",
    "solution": "进程切换带来系统开销，切换次数越多，开销越大，A 正确。当前进程的时间片用完后，它的状态由执行态变为就绪态，B 错误。时钟中断是系统中特定的周期性时钟节拍。操作系统通过它来确定时间间隔，实现时间的延时和任务的超时，C 正确。现代操作系统为了保证性能最优，通常根据响应时间、系统开销、进程数量、进程运行时间、进程切换开销等因素确定 时间片大小，D 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-28",
    "number": "2017 年 · 第 28 题",
    "title": "2017 年 408 操作系统 · 第 28 题",
    "prompt": "与单道程序系统相比，多道程序系统的优点是（ ） Ⅰ.CPU 利用率高 Ⅱ.系统开销小 Ⅲ.系统吞吐量大 Ⅳ.I/O 设备利用率高",
    "status": "真题",
    "tags": [
      "操作系统概念"
    ],
    "knowledgeIds": [
      "OS-KP-1-2"
    ],
    "year": 2017,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅲ"
      },
      {
        "label": "B",
        "text": "仅Ⅰ、Ⅳ"
      },
      {
        "label": "C",
        "text": "仅Ⅱ 、Ⅲ"
      },
      {
        "label": "D",
        "text": "仅Ⅰ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "多道程序系统通过组织作业（编码或数据）使 CPU 总有一个作业可执行，从而提高了 CPU 的利用率、系统吞吐量和 I/O 设备利用率，I、III、IV 是优点。但系统要付出额外的开销来组织作业和切换作业，II 错误。所以选 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-29",
    "number": "2017 年 · 第 29 题",
    "title": "2017 年 408 操作系统 · 第 29 题",
    "prompt": "下列选项中，磁盘逻辑格式化程序所做的工作是（ ）。 Ⅰ. 对磁盘进行分区 Ⅱ. 建立文件系统的根目录 Ⅲ. 确定磁盘扇区校验码所占位数 Ⅳ. 对保存空闲磁盘块信息的数据结构进行初始化",
    "status": "真题",
    "tags": [
      "磁盘格式化"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3"
    ],
    "year": 2017,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅱ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅳ"
      },
      {
        "label": "C",
        "text": "仅Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "仅Ⅰ、Ⅱ、Ⅳ"
      }
    ],
    "answer": "B",
    "solution": "一个新的磁盘是一个空白盘，必须分成扇区以便磁盘控制器能读和写，这个过程称为 物理格式化。低级格式化为磁盘的每个扇区采用特别的数据结构，包括校验码，III 错误。为了使用磁盘存储文件，操作系统还需要将其数据结构记录在磁盘上。这分为两步。第一步是将磁盘分为由一个或多个柱面组成的分区，每个分区可以作为一个独立的磁盘，I 错误。在分区之后，第二步是 逻辑格式化（创建文件系统）。在这一步，操作系统将初始的文件系统数据结构存储到磁盘上。这些数据结构包括空闲和已分配的空间和一个初始 为空的目录，II、IV 正确。所以选 B。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-30",
    "number": "2017 年 · 第 30 题",
    "title": "2017 年 408 操作系统 · 第 30 题",
    "prompt": "某文件系统中，针对每个文件，用户类别分为 4 类：安全管理员、文件主、文件主的伙伴、其他用户；访问权限分为 5 种：完全控制、执行、修改、读取、写入。若文件控制块中用二进制位串表示文件权限，为表示不同类别用户对一个文件的访问权限，则描述文件权限的位数至少应为（ ）。",
    "status": "真题",
    "tags": [
      "inode"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-2",
      "OS-KP-11-1-3"
    ],
    "year": 2017,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "5"
      },
      {
        "label": "B",
        "text": "9"
      },
      {
        "label": "C",
        "text": "12"
      },
      {
        "label": "D",
        "text": "20"
      }
    ],
    "answer": "D",
    "solution": "可以把用户访问权限抽象为一个矩阵，行代表用户，列代表访问权限。这个矩阵有 4 行 5 列，1 代表 true，0 代表 false，所以需要 20 位，选 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-31",
    "number": "2017 年 · 第 31 题",
    "title": "2017 年 408 操作系统 · 第 31 题",
    "prompt": "若文件 f1 的硬链接为 f2，两个进程分别打开 f1 和 f2，获得对应的文件描述符为 fd1 和 fd2，则下列叙述中，正确的是（ ）。 Ⅰ. f1 和 f2 的读写指针位置保持相同 Ⅱ. f1 和 f2 共享同一个内存索引结点 Ⅲ. fd1 和 fd2 分别指向各自的用户打开文件表中的一项",
    "status": "真题",
    "tags": [
      "文件链接",
      "inode"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-6",
      "OS-KP-11-1-7",
      "OS-KP-11-1-2",
      "OS-KP-11-1-3"
    ],
    "year": 2017,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅲ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ和Ⅲ"
      }
    ],
    "answer": "B",
    "solution": "背景知识：硬链接：f1 和 f2 是同一个 inode 的两个目录项（即它们指向同一个文件的 inode），共享 相同的索引节点（inode） 和数据块。打开文件的过程： 每个进程在打开文件时会创建：一个对应的 用户级打开文件表项（即 fd 指向它）用户打开文件表项再指向 系统级打开文件表项（Open File Table）系统级表项包含文件的读写偏移量（读写指针）和对 inode 的引用分析选项：Ⅰ. f1 和 f2 的读写指针位置保持相同❌ 错误。 虽然 f1 和 f2 是同一个文件（硬链接），但两个进程分别打开它们时，会在系统级打开文件表中生成两个不同的表项，每个表项维护独立的文件偏移量（读写指针），所以互不影响。Ⅱ. f1 和 f2 共享同一个内存索引结点✅ 正确。 硬链接的本质就是多个目录项共享同一个 inode。即使路径不同（f1 和 f2），它们最终指向的是同一个 inode。Ⅲ. fd1 和 fd2 分别指向各自的用户打开文件表中的一项✅ 正确。 每个进程维护自己的文件描述符表（用户级文件表），fd1 和 fd2 分别是两个不同进程打开文件得到的描述符，它们自然是指向各自进程的用户打开文件表项。Ⅱ 和 Ⅲ 正确，因此，正确答案为 B。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-32",
    "number": "2017 年 · 第 32 题",
    "title": "2017 年 408 操作系统 · 第 32 题",
    "prompt": "系统将数据从磁盘读到内存的过程包括以下操作： ① DMA 控制器发出中断请求 ② 初始化 DMA 控制器并启动磁盘 ③ 从磁盘传输一块数据到内存缓冲区 ④ 执行“DMA 结束”中断服务程序 正确的执行顺序是（ ）。",
    "status": "真题",
    "tags": [
      "DMA"
    ],
    "knowledgeIds": [
      "OS-KP-13-2-5"
    ],
    "year": 2017,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "③→①→②→④"
      },
      {
        "label": "B",
        "text": "②→③→①→④"
      },
      {
        "label": "C",
        "text": "②→①→③→④"
      },
      {
        "label": "D",
        "text": "①→②→④→③"
      }
    ],
    "answer": "B",
    "solution": "在开始 DMA 传输时，主机向内存写入 DMA 命令块，向 DMA 控制器写入该命令块的地址，启动 I/O 设备。然后，CPU 继续其他工作，DMA 控制器则继续下去直接操作内存总线，将地址放到总线上开始传输。当整个传输完成后，DMA 控制器中断 CPU。因此执行顺序是 ②→③→①→④ 选 B。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-45",
    "number": "2017 年 · 第 45 题",
    "title": "2017 年 408 操作系统 · 第 45 题",
    "prompt": "假定题 44 给出的计算机 M 采用二级分页虚拟存储管理方式，虚拟地址格式如下： 页目录号（10 位）页表索引（10 位）页内偏移量（12 位） 请针对题 43 的函数 f1 和题 44 中的机器指令代码，回答下列问题。 (1) 函数 f1 的机器指令代码占多少页？ (2) 取第 1 条指令（push ebp）时，若在进行地址变换的过程中需要访问内存中的页目录和页表，则会分别访问它们各自的第几个表项（编号从 0 开始）？ (3) M 的 I/O 采用中断控制方式。若进程 P 在调用 f1 之前通过 scanf() 获取 n 的值，则在执行 scanf() 的过程中，进程 P 的状态会如何变化？CPU 是否会进入内核态？",
    "status": "真题",
    "tags": [
      "地址翻译",
      "页表",
      "中断IO"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-4-1-4",
      "OS-KP-4-2-2",
      "OS-KP-13-2-4"
    ],
    "year": 2017,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）函数 1 的代码段中所有指令的虚拟地址的高 20 位相同，因此 1 的机器指令代码在同 一页中，仅占用 1 页。（1 分）页目录号用于寻找页目录的表项，该表项包含页表的位置。页表 索引用于寻找页表的表项，该表项包含页的位置。2）push ebp 指令的虚拟地址的最高 10 位（页目录号）为 0000000001，中间 10 位（页 表索引）为 0000000001，所以，取该指令时访问了页目录的第 1 个表项，（1 分）在对应的页 表中访问了第 1 个表项。（1 分）3）在执行 scanf0 的过程中，进程 P 因等待输入而从执行态变为阻塞态。（1 分）输入结束 时，P 被中断处理程序唤醒，变为就绪态。（1 分）P 被调度程序调度，变为运行态。（1 分）CPU 状态会从用户态变为内核态。（1 分）",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2017-46",
    "number": "2017 年 · 第 46 题",
    "title": "2017 年 408 操作系统 · 第 46 题",
    "prompt": "某进程中有 3 个并发执行的线程 thread1、thread2、thread3，其伪代码如下所示。 //复数的结构类型定义 typedef struct { float a; float b; } cnum; //全局变量 cnum x,y,z; //计算两个复数之和 cnum add(cnum p,cnum q) { cnum s; s.a=p.a+q.a; s.b=p.b+q.b; return s; } thread1 { cnum w; w=add(x,y); ... } thread2 { cnum w; w=add(y,z); ... } thread3 { cnum w; w.a=1; w.b=2; z=add(z,w); y=add(y,w); ... } 请添加必要的信号量和 P、V（或 wait()、signal()）操作，要求确保线程互斥访问临界资源，并且最大程度地并发执行。",
    "status": "真题",
    "tags": [
      "信号量"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-4"
    ],
    "year": 2017,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "先找出线程对在各个变量上的互斥、并发关系。如果是一读一写或两个都是写，那么这就是互斥关系。每一个互斥关系都需要一个信号量进行调节。// 冲突： // t1 和 t3 关于 y 有读写冲突 // t2 和 t3 关于 y, z 都有读写冲突 // 解决 t1 和 t3 关于 y 读写冲突 semaphore y_mutex1 = 1; semaphore y_mutex2 = 1; semaphore z_mutex = 1; // 全局变量 x y z cnum x, y, z; thread1() { cnum w; // 读 x, y P(y_mutex1); w = add(x, y); V(y_mutex1); // ... } thread2() { cnum w; // 读 y, z P(z_mutex); P(y_mutex2); w = add(y, z); V(y_mutex2); V(z_mutex); // ... } thread3() { cnum w; w.a = 1; w.b = 1; // 写 z P(z_mutex); z = add(z, w); V(z_mutex); // 写 y P(y_mutex1); P(y_mutex2); y = add(y, w); V(y_mutex2); V(y_mutex1); // ... } 【评分标准】① 各线程与变量之间的互斥、并发情况及相应评分见下表。变量/线程对thread1 和 thread2thread2 和 thread3thread3 和 thread4给分x不共享不共享不共享1 分y同时读读写互斥读写互斥3 分z不共享读写互斥不共享1 分② 考生仅使用一个互斥信号量，互斥代码部分的得分最多给 2 分。③ 答案部分正确，酌情给分。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2017/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-23",
    "number": "2016 年 · 第 23 题",
    "title": "2016 年 408 操作系统 · 第 23 题",
    "prompt": "下列关于批处理系统的叙述中，正确的是（ ） Ⅰ.批处理系统允许多个用户与计算机直接交互 Ⅱ.批处理系统分为单道批处理系统和多道批处理系统 Ⅲ.中断技术使得多道批处理系统和 I/O 设备可与 CPU 并行工作",
    "status": "真题",
    "tags": [
      "操作系统概念"
    ],
    "knowledgeIds": [
      "OS-KP-1-2"
    ],
    "year": 2016,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "D",
        "text": "仅Ⅰ、Ⅲ"
      }
    ],
    "answer": "A",
    "solution": "本题考察操作系统 发展历程。批处理系统中，作业执行时用户无法干预其运行，只能通过事先配置作业控制来间接干预，缺少交互能力，也因此才发展出分时系统，I 错误。批处理系统按发展历程又分为单道批处理系统、多道批处理系统，II 正确。多道程序设计技术允许同时把多个程序放入内存，并允许它们交替在 CPU 中运行，它们共享系统中的各种硬、软件资源，当 一道程序因 1/0 请求而暂停运行时，CPU 便立即转去运行另 一道程序，即多道批处理系统的 1/0 设备可与 CPU 并行工作，这都是借助于中断技术实现的，III 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-24",
    "number": "2016 年 · 第 24 题",
    "title": "2016 年 408 操作系统 · 第 24 题",
    "prompt": "某单 CPU 系统中有输入和输出设备各 1 台，现有 3 个并发执行的作业，每个作业的输入、计算和输出时间均分别为 2ms，3ms 和 4ms，且都按输入、计算和输出的顺序执行，则执行完 3 个作业需要的时间最少是（）。",
    "status": "真题",
    "tags": [
      "处理机调度概念"
    ],
    "knowledgeIds": [
      "OS-KP-7-1"
    ],
    "year": 2016,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "15ms"
      },
      {
        "label": "B",
        "text": "17ms"
      },
      {
        "label": "C",
        "text": "22ms"
      },
      {
        "label": "D",
        "text": "27ms"
      }
    ],
    "answer": "B",
    "solution": "这类调度题目最好画图。因 CPU、输入设备、输出设备都只有一个，因此各操作步骤不能重叠，画出运行时的甘特图后就能清楚地看到不同作业间的时序关系，如下表所示。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-25",
    "number": "2016 年 · 第 25 题",
    "title": "2016 年 408 操作系统 · 第 25 题",
    "prompt": "系统中有 3 个不同的临界资源 R1​ 、 R2​ 和 R3​ ，被 4 个进程 p1​ 、 p2​ 、 p3​ 及 p4​ 共享。各进程对资源的需求为： p1​ 申请 R1​ 和 R2​ ， p2​ 申请 R2​ 和 R3​ ， p3​ 申请 R1​ 和 R3​ ， p4​ 申请 R2​ 。若系统出现死锁，则处于死锁状态的进程数至少是（ ）。",
    "status": "真题",
    "tags": [
      "临界资源",
      "死锁预防"
    ],
    "knowledgeIds": [
      "OS-KP-9-1-2",
      "OS-KP-9-3-3"
    ],
    "year": 2016,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "1"
      },
      {
        "label": "B",
        "text": "2"
      },
      {
        "label": "C",
        "text": "3"
      },
      {
        "label": "D",
        "text": "4"
      }
    ],
    "answer": "C",
    "solution": "对于本题，先满足一个进程的资源需求，再看其他进程是否能出现死锁状态。因为 p4​ 只申请一个资源，当将 R2​ 分配给 p4​ 后， p4​ 执行完后将 R2​ 释放，这时使得系统满足死锁的条件是 R1​ 分配给 p1​ ， R2​ 分配给 p2​ ， R3​ 分配给 p3​ （或者 R2​ 分配给 p1​ ， R3​ 分配给 p2​ ， R1​ 分配给 p3​ ）。穷举其他情况如 p1​ 申请的资源 R1​ 和 R2​ ，先都分配给 p1​ ，运行完并释放占有的资源后，可以分别将 R1​ 、 R2​ 和 R3​ 分配给 p3​ 、 p4​ 和 p2​ ，也满足系统死锁的条件。各种情况需要使得处于死锁状态的进程数至少为 3。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-26",
    "number": "2016 年 · 第 26 题",
    "title": "2016 年 408 操作系统 · 第 26 题",
    "prompt": "某系统采用改进型 CLOCK 置换算法，页表项中字段 A 为访问位，M 为修改位。A=0 表示页最近没有被访问，A=1 表示页最近被访问过。M=0 表示页没有被修改过，M=1 表示页被修改过。按 (A, M) 所有可能的取值，将页分为四类：(0, 0)、(1, 0)、(0, 1) 和 (1, 1)，则该算法淘汰页的次序为（ ）。",
    "status": "真题",
    "tags": [
      "页面置换算法",
      "clock算法"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-2"
    ],
    "year": 2016,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "(0, 0), (0, 1), (1,0), (1, 1)"
      },
      {
        "label": "B",
        "text": "(0, 0), (1, 0), (0, 1), (1, 1)"
      },
      {
        "label": "C",
        "text": "(0, 0), (0, 1), (1, 1), (1, 0)"
      },
      {
        "label": "D",
        "text": "(0, 0), (1, 1), (0, 1), (1, 0)"
      }
    ],
    "answer": "A",
    "solution": "改进型 Clock 也称为 “二次机会（Second-Chance）算法的增强版”，依据页的访问位 A 和修改位 M 将页分成四类：(0, 0)：最近未被访问，未被修改 —— 优先淘汰(0, 1)：最近未被访问，但被修改 —— 淘汰代价较大（需写回磁盘），次优先(1, 0)：最近被访问，未被修改 —— 说明该页仍有用，再次保留(1, 1)：最近被访问，已被修改 —— 最不愿意淘汰因此，淘汰顺序是按照代价和“是否有用”排序的：👉 (0, 0) < (0, 1) < (1, 0) < (1, 1)✅ 正确答案是：A. (0, 0), (0, 1), (1, 0), (1, 1)",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-27",
    "number": "2016 年 · 第 27 题",
    "title": "2016 年 408 操作系统 · 第 27 题",
    "prompt": "使用 TSL (Test and Set Lock) 指令实现进程互斥的伪代码如下所示。 do { ... while (TSL(&lock)); critical section; lock = FALSE; ... } while (TRUE); 下列与该实现机制相关的叙述中，正确的是（ ）。",
    "status": "真题",
    "tags": [
      "硬件互斥指令"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-1"
    ],
    "year": 2016,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "退出临界区的进程负责唤醒阻塞态进程"
      },
      {
        "label": "B",
        "text": "等待进入临界区的进程不会主动放弃 CPU"
      },
      {
        "label": "C",
        "text": "上述伪代码满足“让权等待”的同步准则"
      },
      {
        "label": "D",
        "text": "while (TSL(&lock)) 应在关中断状态下执行"
      }
    ],
    "answer": "B",
    "solution": "本题考察 硬件互斥，当进程退出临界区时置 lock 为 FALSE，会负责唤醒处于就绪状态的进程，A 错误。若等待进入临界区的进程会一直停留在执行 while(TSL(&lock)) 的循环中，不会主动放弃 CPU, B 正确。让权等待，即当进程不能进入临界区时，应立即释放处理器，防止进程忙等待。通过 B 选项的分析中发现上述伪代码并不满足“让权等待”的同步准则，C 错误。若 while(TSL(&lock)) 在关中断状态下执行，当 TSL(&lock) 一直为 true 时，不再开中断，则系统可能会因此终止，D 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-28",
    "number": "2016 年 · 第 28 题",
    "title": "2016 年 408 操作系统 · 第 28 题",
    "prompt": "某进程的段表内容如下所示。 当访问段号为 2、段内地址为 400 的逻辑地址时，进行地址转换的结果是（ ）。",
    "status": "真题",
    "tags": [
      "地址翻译",
      "分段内存管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1"
    ],
    "year": 2016,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "段缺失异常"
      },
      {
        "label": "B",
        "text": "得到内存地址 4400"
      },
      {
        "label": "C",
        "text": "越权异常"
      },
      {
        "label": "D",
        "text": "越界异常"
      }
    ],
    "answer": "D",
    "solution": "分段系统的逻辑地址 A 到物理地址 E 之间的地址变换过程参考 该节。题目中段号为 2 的段长为 300，小于段内地址为 400，故发生越界异常，D 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2016/assets/q28-question-01.png"
    ]
  },
  {
    "id": "real-2016-29",
    "number": "2016 年 · 第 29 题",
    "title": "2016 年 408 操作系统 · 第 29 题",
    "prompt": "某进程访问页面的序列如下所示。 若工作集的窗口大小为 6，则在 t 时刻的工作集为（ ）。",
    "status": "真题",
    "tags": [
      "驻留集"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-4"
    ],
    "year": 2016,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "{6, 0, 3, 2}"
      },
      {
        "label": "B",
        "text": "{2, 3, 0, 4}"
      },
      {
        "label": "C",
        "text": "{0, 4, 3, 2, 9}"
      },
      {
        "label": "D",
        "text": "{4, 5, 6, 0, 3, 2}"
      }
    ],
    "answer": "A",
    "solution": "在任一时刻 t，都存在一个 集合，它包含所有最近 k 次（该题窗口大小为 6）内存访问所访问过的页面。这个集合 w(k, t) 就是工作集。该题中最近 6 次访问的页面分别为 6, 0, 3, 2, 3, 2, 再去除重复的页面，形成的工作集为 {6, 0, 3, 2}。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2016/assets/q29-question-01.png"
    ]
  },
  {
    "id": "real-2016-30",
    "number": "2016 年 · 第 30 题",
    "title": "2016 年 408 操作系统 · 第 30 题",
    "prompt": "进程 P1 和 P2 均包含并发执行的线程，部分伪代码描述如下所示。 进程 P1 int x = 0; Thread1() { int a; a = 1; x += 1; } Thread2() { int a; a = 2; x += 2; } 进程 P2 int x = 0; Thread3() { int a; a = x; x += 3; } Thread4() { int b; b = x; x += 4; } 下列选项中，需要互斥执行的操作是（ ）。",
    "status": "真题",
    "tags": [
      "进程的互斥"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-1"
    ],
    "year": 2016,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "a=1 与 a=2"
      },
      {
        "label": "B",
        "text": "a=x 与 b=x"
      },
      {
        "label": "C",
        "text": "x+=1 与 x+=2"
      },
      {
        "label": "D",
        "text": "x+=1 与 x+=3"
      }
    ],
    "answer": "C",
    "solution": "P1 中对 a 进行赋值，并不影响最终的结果，故 a = l 与 a = 2 不需要互斥执行；a = x 与 b = x 执行先后不影响 a 与 b 的结果，无须互斥执行；x+=1 与 x+=2 执行先后会影响 x 的结果，需要互斥执行；P1 中的 x 和 P2 中的 x 是不同范围中的 X，互不影响，不需要互斥执行。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-31",
    "number": "2016 年 · 第 31 题",
    "title": "2016 年 408 操作系统 · 第 31 题",
    "prompt": "下列关于 SPOOLing 技术的叙述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "SPOOLing"
    ],
    "knowledgeIds": [
      "OS-KP-13-3-3"
    ],
    "year": 2016,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "需要外存的支持"
      },
      {
        "label": "B",
        "text": "需要多道程序设计技术的支持"
      },
      {
        "label": "C",
        "text": "可以让多个作业共享一台独占设备"
      },
      {
        "label": "D",
        "text": "由用户作业控制设备与输入/输出井之间的数据传送"
      }
    ],
    "answer": "D",
    "solution": "SPOOLing 是利用专门的外围控制机，将低速 I/O 设备上的数据传送到高速磁盘上，或者相反。SPOOLing 的意思是外部设备同时联机操作，又称为假脱机输入／输出操作，是操作系统中采用的一项将独占设备改造成共享设备的技术。高速磁盘即外存，A 正确。SPOOLing 技术需要进行输入/输出操作，单道批处理系统无法满足，B 正确。SPOOLing 技术实现了将独占设备改造成共享设备的技术，C 正确。设备与输入／输出井之间数据的传送是由系统实现的，D 错误。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-32",
    "number": "2016 年 · 第 32 题",
    "title": "2016 年 408 操作系统 · 第 32 题",
    "prompt": "下列关于管程的叙述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "管程"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-3"
    ],
    "year": 2016,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "管程只能用于实现进程的互斥"
      },
      {
        "label": "B",
        "text": "管程是由编程语言支持的进程同步机制"
      },
      {
        "label": "C",
        "text": "任何时候只能有一个进程在管程中执行"
      },
      {
        "label": "D",
        "text": "管程中定义的变量只能被管程内的过程访问"
      }
    ],
    "answer": "A",
    "solution": "管程 是由一组数据以及定义在这组数据之上的对这组数据的操作组成的软件模块，这组操作能初始化并改变管程中的数据和同步进程。管程不仅能实现进程间的互斥，而且能实现进程间的同步，故 A 错误、B 正确。管程具有特性：①局部于管程的数据只能被局部于管程内的过程所访问；②一个进程只有通过调用管程内的过程才能进入管程访问共享数据；③每次仅允许一个进程在管程内执行某个内部过程，故 C 和 D 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-46",
    "number": "2016 年 · 第 46 题",
    "title": "2016 年 408 操作系统 · 第 46 题",
    "prompt": "某进程调度程序采用基于优先数 (priority) 的调度策略，即选择优先数最小的进程运行，进程创建时由用户指定一个 nice 作为静态优先数。为了动态调整优先数，引入运行时间 cpuTime 和等待时间 waitTime，初值均为 0。进程处于执行态时，cpuTime 定时加 1，且 waitTime 置 0；进程处于就绪态时，cpuTime 置 0，waitTime 定时加 1。请回答下列问题。 (1) 若调度程序只将 nice 的值作为进程的优先数，即 priority=nice，则可能会出现饥饿现象，为什么？ (2) 使用 nice、cpuTime 和 waitTime 设计一种动态优先数计算方法，以避免产生饥饿现象，并说明 waitTime 的作用。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2016,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）由于采用了静态优先数，当就绪队列中总有优先数较小的进程时，优先数较大的进程一直没有机会运行，因而会出现饥饿现象。（2 分）2）优先数 priority 的计算公式为 priority = nice + k1 × cpuTime - k2 × waitTime，其中 k1 > 0，k2 > 0，用来分别调整 cpuTime 和 waitTime 在 priority 中所占的比例。（3 分）waitTime 可使长时间等待的进程优先数减少，从而避免出现饥饿现象。（1 分）【评分说明】①公式中包含 nice 给 1 分，利用 cpuTime 增大优先数给 1 分，利用 waitTime 减少优先数 给 1 分；部分正确，酌情给分。②若考生给出包含 nice、cpuTime 和 waitTime 的其他合理的优先数计算方法，同样给分。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2016-47",
    "number": "2016 年 · 第 47 题",
    "title": "2016 年 408 操作系统 · 第 47 题",
    "prompt": "某磁盘文件系统使用链接分配方式组织文件，簇大小为 4KB。目录文件的每个目录项包括文件名和文件的第一个簇号，其他簇号存放在文件分配表 FAT 中。 (1) 假定目录树如下图所示，各文件占用的簇号及顺序如下表所示，其中 dir、dir1 是目录，file1、file2 是用户文件。请给出所有目录文件的内容。 (2) 若 FAT 的每个表项仅存放簇号，占 2 个字节，则 FAT 的最大长度为多少字节？该文件系统支持的文件长度最大是多少？ (3) 系统通过目录文件和 FAT 实现对文件的按名存取，说明 file1 的 106、108 两个簇号分别存放在 FAT 的哪个表项中。 (4) 假设仅 FAT 和 dir 目录文件已读入内存，若需将文件 dir/dir1/file1 的第 5000 个字节读入内存，则要访问哪几个簇？",
    "status": "真题",
    "tags": [
      "目录",
      "文件分配表"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-4",
      "OS-KP-11-2-1"
    ],
    "year": 2016,
    "questionNumber": 47,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）两个目录文件 dir 和 dirl 的内容如下表所示。（3 分）【评分说明】每个目录项的内容正确给 1 分，共 3 分。2）由于 FAT 的簇号为 2 个字节，即 16 比特，因此在 FAT 表中最多允许 2¹⁶（65536）个表项，一个 FAT 文件最多包含 2¹⁶（65536）个簇。FAT 的最大长度为 2¹⁶×2B=128KB。（1 分）文件的最大长度是 2¹⁶×4B=256MB。（1 分）【评分说明】若考生考虑到文件结束标志、坏块标志等，且答案正确，同样给分。3）在 FAT 的每个表项中存放下一个簇号。file1 的簇号 106 存放在 FAT 的 100 号表项中，（1 分）簇号 108 存放在 FAT 的 106 号表项中。（1 分）4）先在 dir 目录文件里找到 dir1 的簇号，然后读取 48 号簇，得到 dir1 目录文件，接着找到 file1 的第一个簇号，据此在 FAT 里查找 file1 的第 5000 个字节所在的簇号，最后访问磁盘中的该簇。因此，需要访问目录文件 dir1 所在的 48 号簇，（1 分）及文件 file1 的 106 号簇。（1 分）",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2016/#47",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2016/assets/q47-question-01.png"
    ]
  },
  {
    "id": "real-2015-23",
    "number": "2015 年 · 第 23 题",
    "title": "2015 年 408 操作系统 · 第 23 题",
    "prompt": "处理外部中断时，应该由操作系统保存的是（ ）。",
    "status": "真题",
    "tags": [
      "寄存器类型",
      "中断IO"
    ],
    "knowledgeIds": [
      "OS-KP-3-1-2",
      "OS-KP-13-2-4"
    ],
    "year": 2015,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "程序计数器（PC）的内容"
      },
      {
        "label": "B",
        "text": "通用寄存器的内容"
      },
      {
        "label": "C",
        "text": "块表（TLB）中的内容"
      },
      {
        "label": "D",
        "text": "Cache 中的内容"
      }
    ],
    "answer": "B",
    "solution": "外部中断处理过程 中，PC 值由中断隐指令自动保存，而通用寄存器 内容由操作系统保存。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-24",
    "number": "2015 年 · 第 24 题",
    "title": "2015 年 408 操作系统 · 第 24 题",
    "prompt": "假定下列指令已装入指令寄存器，则执行时不可能导致 CPU 从用户态变为内核态（系统态）的是（ ）。",
    "status": "真题",
    "tags": [
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-4"
    ],
    "year": 2015,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "DIV R0, R1; (R0)/(R1)→R0"
      },
      {
        "label": "B",
        "text": "INT n; 产生软中断"
      },
      {
        "label": "C",
        "text": "NOT R0; 寄存器 R0 的内容取非"
      },
      {
        "label": "D",
        "text": "MOV R0, addr; 把地址 addr 的内存数据放入寄存器 R0 中"
      }
    ],
    "answer": "C",
    "solution": "考虑到部分指令可能出现异常（导致中断），从而转到 内核模式。指令 A 有除零异常的可能，指令 B 为中断指令，指令 D 有缺页异常的可能，指令 C 不会发生异常。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-25",
    "number": "2015 年 · 第 25 题",
    "title": "2015 年 408 操作系统 · 第 25 题",
    "prompt": "下列选项中，会导致进程从执行态变为就绪态的事件是（ ）。",
    "status": "真题",
    "tags": [
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-8"
    ],
    "year": 2015,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "执行 P(wait) 操作"
      },
      {
        "label": "B",
        "text": "申请内存失败"
      },
      {
        "label": "C",
        "text": "启动 I/O 设备"
      },
      {
        "label": "D",
        "text": "被高优先级进程抢占"
      }
    ],
    "answer": "D",
    "solution": "参考 状态转化，A、B 和 C 都 因为请求某一资源会进入阻塞态，而 D 只是被剥夺了处理机资源，进入就绪态，一 旦得到处理机即可运行。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-26",
    "number": "2015 年 · 第 26 题",
    "title": "2015 年 408 操作系统 · 第 26 题",
    "prompt": "若系统 S1 采用死锁避免方法，S2 采用死锁检测方法。下列叙述中，正确的是（）。 Ⅰ、S1 会限制用户申请资源的顺序，而 S2 不会 Ⅱ、S1 需要进程运行所需的资源总量信息，而 S2 不需要 Ⅲ、S1 不会给可能导致死锁的进程分配资源，而 S2 会",
    "status": "真题",
    "tags": [
      "死锁的处理方法"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-2"
    ],
    "year": 2015,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "B",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅰ、Ⅲ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ、Ⅲ"
      }
    ],
    "answer": "B",
    "solution": "死锁处理 采用三种策略：死锁预防、死锁避免、死锁检测和解除。死锁预防，采用破坏产生死锁的四个必要条件中的一个或几个，以防止发生死锁。其中之一的“破坏循环等待条件”，一般采用顺序资源分配法，首先给系统的资源编号，规定每个进程必须按编号递增的顺序请求资源，也就是限制了用户申请资源的顺序，故 I 的前半句属于死锁预防的范畴。银行家算法是最著名的死锁避免算法，其中的最大需求矩阵 MAX 定义了每一个进程对 m 类资源的最大需求量，系统在执行安全性算法中都会检查此次资源试分配后，系统是否处于安全状态，若不安全则将本次的试探分配作废。在死锁的检测和解除中，在系统为进程分配资源时不采取任何措施，但提供死锁的检测和解除的手段。故 II、III 正确。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-27",
    "number": "2015 年 · 第 27 题",
    "title": "2015 年 408 操作系统 · 第 27 题",
    "prompt": "系统为某进程分配了 4 个页框，该进程已访问的页号序列为 2, 0, 2, 9, 3, 4, 2, 8, 2, 4, 8, 4, 5。若进程要访问的下一页的页号为 7，依据 LRU 算法，应淘汰页的页号是（ ）。",
    "status": "真题",
    "tags": [
      "页面置换算法",
      "LRU"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-2"
    ],
    "year": 2015,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "3"
      },
      {
        "label": "C",
        "text": "4"
      },
      {
        "label": "D",
        "text": "8"
      }
    ],
    "answer": "A",
    "solution": "参考 LRU，对页号序列从后往前计数，直到数到 4（页框数）个不同的数字为止，这个停止的数字就是要淘汰的页号（最近最久未使用的页），题中为页号 2。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-28",
    "number": "2015 年 · 第 28 题",
    "title": "2015 年 408 操作系统 · 第 28 题",
    "prompt": "在系统内存中设置磁盘缓冲区的主要目的是（ ）。",
    "status": "真题",
    "tags": [
      "缓冲区"
    ],
    "knowledgeIds": [
      "OS-KP-13-3-3"
    ],
    "year": 2015,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "减少磁盘 I/O 次数"
      },
      {
        "label": "B",
        "text": "减少平均寻道时间"
      },
      {
        "label": "C",
        "text": "提高磁盘数据可靠性"
      },
      {
        "label": "D",
        "text": "实现设备无关性"
      }
    ],
    "answer": "A",
    "solution": "磁盘和内存的速度差异，决定了可以将内存经常访问的文件调入磁盘缓冲区，从高速缓存中复制的访问比磁盘 I/O 的机械操作要快很多。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-29",
    "number": "2015 年 · 第 29 题",
    "title": "2015 年 408 操作系统 · 第 29 题",
    "prompt": "在文件的索引节点中存放直接索引指针 10 个，一级和二级索引指针各 1 个。磁盘块大小为 1KB，每个索引指针占 4 个字节。若某文件的索引节点已在内存中，则把该文件偏移量（按字节编址）为 1234 和 307400 处所在的磁盘块读入内存，需访问的磁盘块个数分别是（ ）。",
    "status": "真题",
    "tags": [
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3"
    ],
    "year": 2015,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "1、2"
      },
      {
        "label": "B",
        "text": "1、3"
      },
      {
        "label": "C",
        "text": "2、3"
      },
      {
        "label": "D",
        "text": "2、4"
      }
    ],
    "answer": "B",
    "solution": "本题考察 混合索引：其中 10 个直接索引指针指向的数据块大小为 10×1KB = 10KB。每个索引指针占 4B，则每个磁盘块可存放 1KB/4B = 256 个索引指针，一级索引指针指向的数据块大小为 256×1KB = 256KB，二级索引指针指向的数据块大小为 256×256×1KB = 216KB = 64MB。按字节编址，偏移量为 1234 时，因 1234B < 10KB，则由直接索引指针可得到其所在的磁盘块地址。文件的索引结点已在内存中，则地址可直接得到，故仅需 1 次访盘即可。偏移量为 307400 时，因 10KB+256KB < 307400B < 64MB，可知该偏移量的内容在二级索引指针所指向的某个磁盘块中，索引结点已在内存中，故先访盘 2 次得到文件所在的磁盘块地址，再访盘 1 次即可读出内容，故共需 3 次访盘。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-30",
    "number": "2015 年 · 第 30 题",
    "title": "2015 年 408 操作系统 · 第 30 题",
    "prompt": "在请求分页系统中，页面分配策略与页面置换策略不能组合使用的是（ ）。",
    "status": "真题",
    "tags": [
      "页框分配和置换策略"
    ],
    "knowledgeIds": [
      "OS-KP-5-1",
      "OS-KP-5-2-2"
    ],
    "year": 2015,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "可变分配，全局置换"
      },
      {
        "label": "B",
        "text": "可变分配，局部置换"
      },
      {
        "label": "C",
        "text": "固定分配，全局置换"
      },
      {
        "label": "D",
        "text": "固定分配，局部置换"
      }
    ],
    "answer": "C",
    "solution": "本题考察内存置换策略：对各进程进行固定分配时页面数不变，不可能出现全局置换。而 A、B、D 是现代操作系统中常见的 3 种策略。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-31",
    "number": "2015 年 · 第 31 题",
    "title": "2015 年 408 操作系统 · 第 31 题",
    "prompt": "文件系统用 位图法 表示磁盘空间的分配情况，位图存于磁盘的 32～127 号块中，每个盘块占 1024 个字节，盘块和块内字节均从 0 开始编号。假设要释放的盘块号为 409612，则位图中要修改的位所在的盘块号和块内字节序号分别是（ ）。",
    "status": "真题",
    "tags": [
      "位图法"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-5"
    ],
    "year": 2015,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "81、1"
      },
      {
        "label": "B",
        "text": "81、2"
      },
      {
        "label": "C",
        "text": "82、1"
      },
      {
        "label": "D",
        "text": "82、2"
      }
    ],
    "answer": "C",
    "solution": "盘块号＝起始块号 + ⌊盘块号/(1024x8)」= 32 + ⌊409612/(1024x8)」= 32 + 50 = 82，这里问的是块内字节号而不是位号，因此还需要除以 8（1 字节=8 位），块内字节号= ⌊（盘块号%(1024x8))/8」= 1。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-32",
    "number": "2015 年 · 第 32 题",
    "title": "2015 年 408 操作系统 · 第 32 题",
    "prompt": "某硬盘有 200 个磁道（最外侧磁道号为 0），磁道访问请求序列为：130，42，180，15，199，当前磁头位于第 58 号磁道并从外侧向内侧移动。按照 SCAN 调度方法处理完上述请求后，磁头移过的磁道数是（ ）。",
    "status": "真题",
    "tags": [
      "磁盘调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3"
    ],
    "year": 2015,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "208"
      },
      {
        "label": "B",
        "text": "287"
      },
      {
        "label": "C",
        "text": "325"
      },
      {
        "label": "D",
        "text": "382"
      }
    ],
    "answer": "C",
    "solution": "SCAN 算法就是电梯调度算法。顾名思义，如果开始时磁头向外移动就一直要到最外侧，然后再返回向内侧移动，就像电梯若往下则一直要下到最底层需求才会再上升一样。当期磁头位于 58 号并从外侧向内侧移动，先依次访问 130 和 199, 然后再返回向外侧移动，依次访问 42 和 15, 故磁头移过的磁道数是：(199-58)+(199-15) = 325。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-45",
    "number": "2015 年 · 第 45 题",
    "title": "2015 年 408 操作系统 · 第 45 题",
    "prompt": "有 A、B 两人通过信箱进行辩论，每个人都从自己的信箱中取得对方的问题，将答案和向对方提出的新问题组成一个邮件放人对方的信箱中。假设 A 的信箱最多放 M 个邮件，B 的信箱最多放 N 个邮件。初始时 A 的信箱中有 x 个邮件 ( 0<x<M )，B 的的信箱中有 y 个邮件 ( 0<y<N )。辩论者每取出一个邮件，邮件数减 1。A 和 B 两人的操作过程描述如下： A { while (true) { 从 A 的信箱中取出一个邮件； 回答问题并提出一个新问题； 将新邮件放入 B 的信箱； } } B { while (true) { 从 B 的信箱中取出一个邮件； 回答问题并提出一个新问题； 将新邮件放入 A 的信箱； } } 当信箱不为空时，辩论者才能从信箱中取邮件，否则等待。当信箱不满时，辩论者才能将新邮件放入信箱，否则等待。请添加必要的信号量和 P、V（或 wait、signal）操作，以实现上述过程的同步。要求写出完整的过程，并说明信号量的含义和初值。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2015,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "semaphore A_full = x; // A 信箱中已有的邮件个数 semaphore A_empty = M - x; // A 信箱还可以放多少个邮件 semaphore B_full = y; // B 信箱中已有的邮件个数 semaphore B_empty = N - y; // B 信箱中还能放多少个邮件 semaphore A_mutex = 1; // 互斥访问 A 信箱 semaphore B_mutex = 1; // 互斥访问 B 信箱 A() { while (1) { P(A_full); P(A_mutex); 从A信箱中取出一个邮件; V(A_mutex); V(A_empty); 回答问题并提出新问题; P(B_empty); P(B_mutex); 将信件放入B邮箱; V(B_mutex); V(B_full); } } B() { while (1) { P(B_full); P(B_mutex); 从B信箱中取出一个邮件; V(B_mutex); V(B_empty); 回答问题并提出新问题; P(A_empty); P(A_mutex); 将信件放入A邮箱; V(A_mutex); V(A_full); } } 【评分说明】 1）每对信号量的定义及初值正确，给分。2）每个互斥信号量的 P、V 操作使用正确，各给分。3）每个同步信号量的 P、V 操作使用正确，各给分。4）其他答案酌情给分。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2015-46",
    "number": "2015 年 · 第 46 题",
    "title": "2015 年 408 操作系统 · 第 46 题",
    "prompt": "某计算机系统按字节编址，采用二级页表的分页存储管理方式，虚拟地址格式如下所示： 页目录号（10 位）页表索引（10 位）页内偏移量（12 位） 请回答下列问题。 (1) 页和页框的大小各为多少字节？进程的虚拟地址空间大小为多少页？ (2) 假定页目录项和页表项均占 4 个字节，则进程的页目录和页表共占多少页？要求写出计算过程。 (3) 若某指令周期内访问的虚拟地址为 0100 0000H 和 0111 2048H，则进行地址转换时共访问多少个二级页表？要求说明坪由。",
    "status": "真题",
    "tags": [
      "虚拟页式管理",
      "页表"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2",
      "OS-KP-4-2",
      "OS-KP-4-1-4",
      "OS-KP-4-2-2"
    ],
    "year": 2015,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）在分页存储管理方式 中，将用户程序的地址空间分为若干固定大小的区域，称为“页”或“页面”。相应地，将内存空间分为若干物理块或页框（frame），页和页框大小相同。因此，页和页框大小均为 212 B = 4 KB。进程的虚拟地址空间大小为 232/212=220 页。2） (210×4)/212 （页目录所占页数）+ (220×4)/212 （页表所占页数）= 1025 页。3）需要访问一个二级页表。因为虚拟地址 01000000H 和 01112048H 的最高 10 位的值都是 4，页目录号相同，访问的是同一个二级页表。【评分说明】用其他方法计算，思路和结果正确同样给分。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2015/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-23",
    "number": "2014 年 · 第 23 题",
    "title": "2014 年 408 操作系统 · 第 23 题",
    "prompt": "下列调度算法中，不可能导致饥饿现象的是（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2014,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "时间片轮转"
      },
      {
        "label": "B",
        "text": "静态优先数调度"
      },
      {
        "label": "C",
        "text": "非抢占式短作业优先"
      },
      {
        "label": "D",
        "text": "抢占式短作业优先"
      }
    ],
    "answer": "A",
    "solution": "采用 静态优先级调度 时，当系统总是出现优先级高的任务时，优先级低的任务会总是得不到处理机而产生饥饿现象；短任务优先调度不管是抢占式或是非抢占的，当系统总是出现新来的短任务时，长任务会总是得不到处理机，产生饥饿现象，因此 B、C、D 都错误，选 A。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-24",
    "number": "2014 年 · 第 24 题",
    "title": "2014 年 408 操作系统 · 第 24 题",
    "prompt": "某系统有 n 台互斥使用的同类设备，三个并发进程分别需要 3、4、5 台设备，可确保系统不发生死锁的设备数 n 最小为（ ）。",
    "status": "真题",
    "tags": [
      "死锁产生的必要条件"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-1"
    ],
    "year": 2014,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "9"
      },
      {
        "label": "B",
        "text": "10"
      },
      {
        "label": "C",
        "text": "11"
      },
      {
        "label": "D",
        "text": "12"
      }
    ],
    "answer": "B",
    "solution": "本题考察 死锁产生的必要条件，三个并发进程分别需要 3、4、5 台设备，当系统只有 (3-1) + (4-1) + (5-1) =9 台设备时，第一个进程分配 2 台，第二个进程分配 3 台，第三个进程分配 4 台。这种情况下，三个进程均无法继续执行下去，发生死锁。当系统中再增加 1 台设备，也就是总共 10 台设备时，这最后 1 台设备分配给任意一个进程都可以顺利执行完成，因此保证系统不发生死锁的最小设备数为 10。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-25",
    "number": "2014 年 · 第 25 题",
    "title": "2014 年 408 操作系统 · 第 25 题",
    "prompt": "下列指令中，不能在用户态执行的是（ ）。",
    "status": "真题",
    "tags": [
      "陷阱指令",
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-2",
      "OS-KP-3-2-5",
      "OS-KP-3-2-4"
    ],
    "year": 2014,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "trap 指令"
      },
      {
        "label": "B",
        "text": "跳转指令"
      },
      {
        "label": "C",
        "text": "压栈指令"
      },
      {
        "label": "D",
        "text": "关中断指令"
      }
    ],
    "answer": "D",
    "solution": "trap 指令、跳转指令和压栈指令均可以在用户态执行，其中 trap 指令负责由用户态转换成为内核态，而关中断指令为特权指令，必须在核心态才能执行，选 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-26",
    "number": "2014 年 · 第 26 题",
    "title": "2014 年 408 操作系统 · 第 26 题",
    "prompt": "一个进程的读磁盘操作完成后，操作系统针对该进程必做的是（ ）。",
    "status": "真题",
    "tags": [
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-8"
    ],
    "year": 2014,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "修改进程状态为就绪态"
      },
      {
        "label": "B",
        "text": "降低进程优先级"
      },
      {
        "label": "C",
        "text": "给进程分配用户内存空间"
      },
      {
        "label": "D",
        "text": "增加进程时间片大小"
      }
    ],
    "answer": "A",
    "solution": "本题考察 状态种类，进程申请读磁盘操作的时候，因为要等待 I/O 操作完成，会把自身阻塞，此时进程就变为了阻塞状态，当 I/O 操作完成后，进程得到了想要的资源，就会从阻塞态转换到就绪态（这是操作系统的行为）。而降低进程优先级、分配用户内存空间和增加进程的时间片大小都不一定会发生，选 A。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-27",
    "number": "2014 年 · 第 27 题",
    "title": "2014 年 408 操作系统 · 第 27 题",
    "prompt": "现有一个容量为 10GB 的磁盘分区，磁盘空间以簇 (Cluster) 为单位进行分配，簇的大小为 4KB，若采用位图法管理该分区的空闲空间，即用一位 (bit) 标识一个簇是否被分配，则存放该位图所需簇的个数为（ ）。",
    "status": "真题",
    "tags": [
      "外存空间管理",
      "位图法"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-5"
    ],
    "year": 2014,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "80"
      },
      {
        "label": "B",
        "text": "320"
      },
      {
        "label": "C",
        "text": "80K"
      },
      {
        "label": "D",
        "text": "320K"
      }
    ],
    "answer": "A",
    "solution": "簇 的总数为 10GB/4KB = 2.5M, 用一位标识一簇是否被分配，则整个磁盘共需要 2.5M 位，即需要 2.5M/8 =320KB, 因此共需要 320KB/4KB = 80 个簇，选 A。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-28",
    "number": "2014 年 · 第 28 题",
    "title": "2014 年 408 操作系统 · 第 28 题",
    "prompt": "下列措施中，能加快虚实地址转换的是（ ）。 I. 增大快表 (TLB) 容量 II. 让页表常驻内存 III. 增大交换区 (swap)",
    "status": "真题",
    "tags": [
      "地址翻译",
      "页表",
      "TLB"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-4-1-4",
      "OS-KP-4-2-2",
      "OS-KP-4-1-5"
    ],
    "year": 2014,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I"
      },
      {
        "label": "B",
        "text": "仅 II"
      },
      {
        "label": "C",
        "text": "仅 I、II"
      },
      {
        "label": "D",
        "text": "仅 II、IIII"
      }
    ],
    "answer": "C",
    "solution": "虚实地址转换 是指逻辑地址和物理地址的转换。增大快表容量能把更多的表项装入快表中，会加快虚实地址转换的平均速率；让页表常驻内存可以省去一 些不在内存中的页表从磁盘上调入的过程，也能加快虚实地址转换；增大交换区对虚实地址转换速度无影响，因此 I、II 正确，选 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-29",
    "number": "2014 年 · 第 29 题",
    "title": "2014 年 408 操作系统 · 第 29 题",
    "prompt": "在一个文件被用户进程首次打开的过程中，操作系统需要做的是（ ）。",
    "status": "真题",
    "tags": [
      "文件概念",
      "inode"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-2",
      "OS-KP-11-1-3"
    ],
    "year": 2014,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "将文件内容读到内存中"
      },
      {
        "label": "B",
        "text": "将文件控制块读到内存中"
      },
      {
        "label": "C",
        "text": "修改文件控制块中的读写权限"
      },
      {
        "label": "D",
        "text": "将文件的数据缓冲区首指针返回给用户进程"
      }
    ],
    "answer": "B",
    "solution": "一个文件被用户进程首次打开即被执行了 open 操作，会把文件的 FCB 调入内存，而不会把文件内容读到内存中，只有进程希望获取文件内容的时候才会读入文件内容；C、D 明显错误，选 B。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-30",
    "number": "2014 年 · 第 30 题",
    "title": "2014 年 408 操作系统 · 第 30 题",
    "prompt": "在页式虚拟存储管理系统中，采用某些页面置换算法，会出现 Belady 异常现象，即进程的缺页次数会随着分配给该进程的页框个数的增加而增加。下列算法中，可能出现 Belady 异常现象的是（ ）。 I. LRU 算法 II. FIFO 算法 III. OPT 算法",
    "status": "真题",
    "tags": [
      "Belady异常"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-2"
    ],
    "year": 2014,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 II"
      },
      {
        "label": "B",
        "text": "仅 I、II"
      },
      {
        "label": "C",
        "text": "仅 I、III"
      },
      {
        "label": "D",
        "text": "仅 II、III"
      }
    ],
    "answer": "A",
    "solution": "只有 FIFO 算法才会导致 Belady 异常，选 A。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-31",
    "number": "2014 年 · 第 31 题",
    "title": "2014 年 408 操作系统 · 第 31 题",
    "prompt": "下列关于管道（Pipe）通信的叙述中，正确的是（ ）。",
    "status": "真题",
    "tags": [
      "进程间通信"
    ],
    "knowledgeIds": [
      "OS-KP-8-1"
    ],
    "year": 2014,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "一个管道可实现双向数据传输"
      },
      {
        "label": "B",
        "text": "管道的容量仅受磁盘容量大小限制"
      },
      {
        "label": "C",
        "text": "进程对管道进行读操作和写操作都可能被阻塞"
      },
      {
        "label": "D",
        "text": "一个管道只能有一个读进程或一个写进程对其操作"
      }
    ],
    "answer": "C",
    "solution": "管道 实际上是一种固定大小的缓冲区，管道对于管道两端的进程而言，就是一个文件，但它不是普通的文件，它不属于某种文件系统，而是自立门户，单独构成一种文件系统，并且只存在于内存中。它类似于通信中半双工信道的进程通信机制，一个管道可以实现双向的数据传输，而同一个时刻只能最多有一个方向的传输，不能两个方向同时进行。管道的容量大小通常为内存上的一页，它的大小并不是受磁盘容量大小的限制。当管道满时，进程在写管道会被阻塞，而当管道空时，进程在读管道会被阻塞，因此选 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-32",
    "number": "2014 年 · 第 32 题",
    "title": "2014 年 408 操作系统 · 第 32 题",
    "prompt": "下列选项中，属于多级页表优点的是（ ）。",
    "status": "真题",
    "tags": [
      "页表"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-4",
      "OS-KP-4-2-2"
    ],
    "year": 2014,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "加快地址变换速度"
      },
      {
        "label": "B",
        "text": "减少缺页中断次数"
      },
      {
        "label": "C",
        "text": "减少页表项所占字节数"
      },
      {
        "label": "D",
        "text": "减少页表所占的连续内存空间"
      }
    ],
    "answer": "D",
    "solution": "多级页表 不仅不会加快地址的变换速度，而且会因为增加更多的查表过程，使地址转换速度减慢；也不会减少缺页中断的次数，反而如果访问过程中多级的页表都不在内存中，会大大增加缺页的次数，也并不会减少页表项所占的字节数，而多级页表能够减少页表所占的连续内存空间，即当页表太大时，将页表再分级，可以把每张页表控制在一页之内，减少页表所占的连续内存空间，因此选 D。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-46",
    "number": "2014 年 · 第 46 题",
    "title": "2014 年 408 操作系统 · 第 46 题",
    "prompt": "文件 F 由 200 条记录组成，记录从 1 开始编号。用户打开文件后，欲将内存中的一条记录插入文件 F 中，作为其第 30 条记录。请回答下列问题，并说明理由。 (1) 若文件系统采用连续分配方式，每个磁盘块存放一条记录，文件 F 存储区域前后均有足够的空闲磁盘空间，则完成上述插入操作最少需要访问多少次磁盘块？F 的文件控制块内容会发生哪些改变？ (2) 若文件系统采用链接分配方式，每个磁盘块存放一条记录和一个链接指针，则完成上述插入操作需要访问多少次磁盘块？若每个存储块大小为 1KB，其中 4B 存放链接指针，则该文件系统支持的文件最大长度是多少？",
    "status": "真题",
    "tags": [
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3"
    ],
    "year": 2014,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）系统采用顺序分配方式时，插入记录需要移动其他的记录块，整个文件共有 200 条记录，要插入新记录作为第 30 条，而存储区前后均有足够的磁盘空间，且要求最少的访问存储块数，则要把文件前 29 条记录前移，若算访盘次数移动一条记录读出和存回磁盘各是一次访盘，29 条记录共访盘 58 次，存回第 30 条记录访盘 1 次，共访盘 59 次。（1 分）F 的文件控制区的起始块号和文件长度的内容会因此改变。（1 分）2）文件系统采用链接分配方式时，插入记录并不用移动其他记录，只需找到相应的记录，修改指针即可。插入的记录为其第 30 条记录，那么 需要找到文件系统的第 29 块，一共需要访盘 29 次，然后把第 29 块的下块地址部分赋给新块，把新块存回内存会访盘 1 次，然后修改内存中第 29 块的下块地址字段，再存回磁盘（1 分），一共访盘 31 次。（1 分）4 字节共 32 位，可以寻址 232=4G 块存储块，每块的大小为 1KB，即 1024B，其中下块地址部分占 4B，数据部分占 1020B，那么该系统的文件最大长度是 4G×1020B=4080GB。（2 分）【评分说明】①第 1 小题的第 2 小问，若答案中不包含文件的起始地址和文件大小，则不给分。②若按 1024×232B=4096GB 计算最大长度，给 1 分。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2014-47",
    "number": "2014 年 · 第 47 题",
    "title": "2014 年 408 操作系统 · 第 47 题",
    "prompt": "系统中有多个生产者进程和多个消费者进程，共享一个能存放 1000 件产品的环形缓冲区（初始为空）。当缓冲区未满时，生产者进程可以放入其生产的一件产品，否则等待；当缓冲区未空时，消费者进程可以从缓冲区取走一件产品，否则等待。要求一个消费者进程从缓冲区连续取出 10 件产品后，其他消费者进程才可以取产品。请使用信号量 P、V（wait()，signal()）操作实现进程间的互斥与同步，要求写出完整的过程，并说明所用信号量的含义和初值。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2014,
    "questionNumber": 47,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "这是典型的生产者和消费者问题，只对典型问题加了一个条件，只需在标准模型上新加一 个信号量，即可完成指定要求。设置四个变量 consumer_mutex、buffer_mutex、empty 和 full, consumer_mutex 用于一个控制一个消费者进程一个 周期（10 次）内对于缓冲区的控制，初值为 1；buffer_mutex 用于进程单次互斥的访问缓冲区，初值 为 1；empty 代表缓冲区的空位数，初值为 0；full 代表缓冲区的产品数，初值为 1000，具体进 程的描述如下：semaphore consumer_mutex = 1; semaphore buffer_mutex = 1; semaphore full = 0; semaphore empty = 1000; Consumer() { while (1) { P(consumer_mutex); for (int i = 0; i < 10; i++) { P(full); P(buffer_mutex); 从缓冲区取出产品; V(buffer_mutex); V(empty); 消费产品; } V(consumer_mutex); } } Producer() { while (1) { P(empty); 生产产品; P(buffer_mutex); 将产品放入缓冲区; V(buffer_mutex); V(full); } } 【评分说明】①信号量的初值和含义都正确给 2 分。②生产者之间的互斥操作正确给 1 分；生产者与消费者之间的同步操作正确给 2 分；消费者之间互斥操作正确给 1 分。③控制消费者连续取产品数量正确给 2 分。④仅给出经典生产者 - 消费者问题的信号量定义和伪代码描述最多给 3 分。⑤若考生将题意理解成缓冲区至少有 10 件产品，消费者才能开始取，其他均正确，得 6 分。⑥部分完全正确，酌情给分。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2014/#47",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-23",
    "number": "2013 年 · 第 23 题",
    "title": "2013 年 408 操作系统 · 第 23 题",
    "prompt": "用户在删除某文件的过程中，操作系统不可能执行的操作是（ ）。",
    "status": "真题",
    "tags": [
      "文件概念"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-2"
    ],
    "year": 2013,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "删除此文件所在的目录"
      },
      {
        "label": "B",
        "text": "删除与此文件关联的目录项"
      },
      {
        "label": "C",
        "text": "删除与此文件对应的文件控制块"
      },
      {
        "label": "D",
        "text": "释放与此文件关联的内存缓冲区"
      }
    ],
    "answer": "A",
    "solution": "此文件所在目录下可能还存在其他文件，因此删除文件时不能（也不需要）删除文件所在的目录，而与此文件关联的目录项和文件控制块需要随着文件一同删除，同时释放文件关联的内存缓冲区。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-24",
    "number": "2013 年 · 第 24 题",
    "title": "2013 年 408 操作系统 · 第 24 题",
    "prompt": "为支持 CD-ROM 中视频文件的快速随机播放，播放性能最好的文件数据块组织方式是（ ）。",
    "status": "真题",
    "tags": [
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3"
    ],
    "year": 2013,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "连续结构"
      },
      {
        "label": "B",
        "text": "链式结构"
      },
      {
        "label": "C",
        "text": "直接索引结构"
      },
      {
        "label": "D",
        "text": "多级索引结构"
      }
    ],
    "answer": "A",
    "solution": "为了实现快速随机播放，要保证最短的查询时间，即不能选取链表和索引结构，因此 连续分配方案 最优。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-25",
    "number": "2013 年 · 第 25 题",
    "title": "2013 年 408 操作系统 · 第 25 题",
    "prompt": "用户程序发出磁盘 I/O 请求后，系统的处理流程是：用户程序→系统调用处理程序→设备驱动程序→中断处理程序。其中，计算数据所在磁盘的柱面号、磁头号、扇区号的程序是（ ）。",
    "status": "真题",
    "tags": [
      "CHS地址",
      "IO软件层次"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3",
      "OS-KP-13-3"
    ],
    "year": 2013,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "用户程序"
      },
      {
        "label": "B",
        "text": "系统调用处理程序"
      },
      {
        "label": "C",
        "text": "设备驱动程序"
      },
      {
        "label": "D",
        "text": "中断处理程序"
      }
    ],
    "answer": "C",
    "solution": "计算磁盘号、磁头号和扇区号的工作是由 设备驱动程序 完成的。题中的功能因设备硬件的不同而不同，因此应由厂家提供的设备驱动程序实现。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-26",
    "number": "2013 年 · 第 26 题",
    "title": "2013 年 408 操作系统 · 第 26 题",
    "prompt": "若某文件系统索引结点 (inode) 中有直接地址项和间接地址项，则下列选项中，与单个文件长度无关的因素是（ ）。",
    "status": "真题",
    "tags": [
      "inode"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-2",
      "OS-KP-11-1-3"
    ],
    "year": 2013,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "索引结点的总数"
      },
      {
        "label": "B",
        "text": "间接地址索引的级数"
      },
      {
        "label": "C",
        "text": "地址项的个数"
      },
      {
        "label": "D",
        "text": "文件块大小"
      }
    ],
    "answer": "A",
    "solution": "四个选项中，只有 A 选项是与单个文件长度无关的。索引结点 的总数即文件的总数，与单个文件的长度无关；间接地址级数越多、地址项数越多、文件块越大，单个文件的长度就会越大。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-27",
    "number": "2013 年 · 第 27 题",
    "title": "2013 年 408 操作系统 · 第 27 题",
    "prompt": "设系统缓冲区和用户工作区均采用单缓冲，从外设读入 1 个数据块到系统缓冲区的时间为 100，从系统缓冲区读入 1 个数据块到用户工作区的时间为 5，对用户工作区中的 1 个数据块进行分析的时间为 90（如下图所示）。 进程从外设读入并分析 2 个数据块的最短时间是（ ）。",
    "status": "真题",
    "tags": [
      "缓冲区"
    ],
    "knowledgeIds": [
      "OS-KP-13-3-3"
    ],
    "year": 2013,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "200"
      },
      {
        "label": "B",
        "text": "295"
      },
      {
        "label": "C",
        "text": "300"
      },
      {
        "label": "D",
        "text": "390"
      }
    ],
    "answer": "C",
    "solution": "在 单缓冲 中，数据块 1 从外设到用户工作区的总时间为 105，在这段时间中，数据块 2 没有进行操作。在数据块 1 进行分析处理 时，数据块 2 从外设到用户工作区的总时间为 105，这段时间是并行的。再加上处理数据块 2 的时间 90，总时间为 300，答案为 C。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2013/assets/q27-question-01.png"
    ]
  },
  {
    "id": "real-2013-28",
    "number": "2013 年 · 第 28 题",
    "title": "2013 年 408 操作系统 · 第 28 题",
    "prompt": "下列选项中，会导致用户进程从用户态切换到内核态的操作是（ ）。 I. 整数除以零 II. sin() 函数调用 III. read 系统调用",
    "status": "真题",
    "tags": [
      "系统调用",
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-5",
      "OS-KP-3-2-4"
    ],
    "year": 2013,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I、II"
      },
      {
        "label": "B",
        "text": "仅 I、III"
      },
      {
        "label": "C",
        "text": "仅 II、III"
      },
      {
        "label": "D",
        "text": "I、II 和 III"
      }
    ],
    "answer": "B",
    "solution": "需要在系统 内核态 执行的操作是整数除零操作（需要中断处理）和 read 系统调用函数，sin() 函数调用是在用户态下进行的。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-29",
    "number": "2013 年 · 第 29 题",
    "title": "2013 年 408 操作系统 · 第 29 题",
    "prompt": "计算机开机后，操作系统最终被加载到（ ）。",
    "status": "真题",
    "tags": [
      "系统引导流程"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-3"
    ],
    "year": 2013,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "BIOS"
      },
      {
        "label": "B",
        "text": "ROM"
      },
      {
        "label": "C",
        "text": "EPROM"
      },
      {
        "label": "D",
        "text": "RAM"
      }
    ],
    "answer": "D",
    "solution": "此题为基本常识题，送分题。系统开机后，操作系统的程序会被自动加载到内存中的系统区，这段区域是 RAM。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-30",
    "number": "2013 年 · 第 30 题",
    "title": "2013 年 408 操作系统 · 第 30 题",
    "prompt": "若用户进程访问内存时产生缺页，则下列选项中，操作系统可能执行的操作是（ ）。 I. 处理越界错 II. 置换页 III. 分配内存",
    "status": "真题",
    "tags": [
      "缺页异常"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-4",
      "OS-KP-5-2-1"
    ],
    "year": 2013,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I、II"
      },
      {
        "label": "B",
        "text": "仅 II、III"
      },
      {
        "label": "C",
        "text": "仅 I、III"
      },
      {
        "label": "D",
        "text": "I、II 和 III"
      }
    ],
    "answer": "B",
    "solution": "用户进程访问内存时缺页会发生缺页中断。发生 缺页中断，系统会执行的操作可能是置换页面或分配内存。系统内没有越界的错误，不会进行越界出错处理。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-31",
    "number": "2013 年 · 第 31 题",
    "title": "2013 年 408 操作系统 · 第 31 题",
    "prompt": "某系统正在执行三个进程 P1​ 、 P2​ 和 P3​ ，各进程的计算 (CPU) 时间和 I/O 时间比例如下表所示。 进程计算时间I/O 时间P1​90%10%P2​50%50%P3​15%85% 为提高系统资源利用率，合理的进程优先级设置应为（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度概念"
    ],
    "knowledgeIds": [
      "OS-KP-7-1"
    ],
    "year": 2013,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "P1​>P2​>P3​"
      },
      {
        "label": "B",
        "text": "P3​>P2​>P1​"
      },
      {
        "label": "C",
        "text": "P2​>P1​=P3​"
      },
      {
        "label": "D",
        "text": "P1​>P2​=P3​"
      }
    ],
    "answer": "B",
    "solution": "为了合理地设置进程优先级，应该将进程的 CPU 时间和 I/0 时间做综合考虑，对千 CPU 占用时间较少而 I/O 占用时间较多的进程，优先调度能让 I/O 更早地得到使用，提高了系统的资源利用率，显然应该具有更高的优先级。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-32",
    "number": "2013 年 · 第 32 题",
    "title": "2013 年 408 操作系统 · 第 32 题",
    "prompt": "下列关于银行家算法的叙述中，正确的是（ ）。",
    "status": "真题",
    "tags": [
      "银行家算法"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-4"
    ],
    "year": 2013,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "银行家算法可以预防死锁"
      },
      {
        "label": "B",
        "text": "当系统处于安全状态时，系统中一定无死锁进程"
      },
      {
        "label": "C",
        "text": "当系统处于不安全状态时，系统中一定会出现死锁进程"
      },
      {
        "label": "D",
        "text": "银行家算法破坏了死锁必要条件中的“请求和保持”条件"
      }
    ],
    "answer": "B",
    "solution": "银行家算法 是避免死锁的方法，破坏死锁产生的必要条件是预防死锁的方法。利用银行家算法，系统处于安全状态时就可以避免死锁（即此时必然无死锁）；当系统进入不安全状态后便可能进入死锁状态（但也不是必然）。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-45",
    "number": "2013 年 · 第 45 题",
    "title": "2013 年 408 操作系统 · 第 45 题",
    "prompt": "某博物馆最多可以容纳 500 人同时参观，有一个出入口，该出入口一次仅允许一个人通过。参观者的活动描述如下： cobegin 参观者进程 i: { ... 进门； ... 参观； ... 出门； ... } coend 请添加必要的信号量和 P、V（或 wait()、signal()）操作，以实现上述过程中的互斥与同步。要求写出完整的过程，说明信号量的含义并赋初值。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2013,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "出入口一次仅允许一个人通过，设置互斥信号量 mutex, 初值为 1。博物馆最多可同时容 纳 500 人，故设置信号量 empty, 初值为 500。semaphore empty = 500; semaphore mutex = 1; visitor() { P(empty); P(mutex); 进门; V(mutex); 参观; P(mutex); 出门; V(mutex); V(empty); } 【评分说明】①信号量初值给 1 分，说明含义给 1 分，两个信号量的初值和含义共 4 分。②对 mutex 的 P、V 操作正确给 2 分。③对 empty 的 P、V 操作正确给 1 分。④其他答案，参照①~③的标准给分。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2013-46",
    "number": "2013 年 · 第 46 题",
    "title": "2013 年 408 操作系统 · 第 46 题",
    "prompt": "某计算机主存按字节编址，逻辑地址和物理地址都是 32 位，页表项大小为 4 字节。请回答下列问题。 (1) 若使用一级页表的分页存储管理方式，逻辑地址结构为： 则页的大小是多少字节？页表最大占用多少字节？ (2) 若使用二级页表的分页存储管理方式，逻辑地址结构为： 设逻辑地址为 LA，请分别给出其对应的页目录号和页表索引的表达式。 (3) 采用 (1) 中的分页存储管理方式，一个代码段起始逻辑地址为 0000 8000H，其长度为 8KB，被装载到从物理地址 0090 0000H 开始的连续主存空间中。页表从主存 0020 0000H 开始的物理地址处连续存放，如下图所示（地址大小自下向上递增）。请计算出该代码段对应的两个页表项的物理地址、这两个页表项中的页框号以及代码页面 2 的起始物理地址。",
    "status": "真题",
    "tags": [
      "虚拟页式管理",
      "页表"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2",
      "OS-KP-4-2",
      "OS-KP-4-1-4",
      "OS-KP-4-2-2"
    ],
    "year": 2013,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）因为主存按字节编址，页内偏移量是 12 位，所以页大小为 212 B= 4 KB。（1 分）页表项数为 220 ，故该一级页表最大为 220×4 B = 4 MB。（2 分）2）页目录号可表示为：(((unsigned int)(LA)) >> 22) & 0x3FF。（1 分）页表索引可表示为：(((unsigned int)(LA)) >> 12) & 0x3FF。（1 分）【评分说明】①页目录号也可以写成 (unsigned int)(LA) > 22；如果两个表达式没有对 LA 进行类型转换，同样给分。②如果用除法和其他开销很大的运算方法，但对基本原理是理解的，同样给分。③参考答案给出的是 C 语言的描述，用其他语言（包括自然语言）正确地表述了，同样给分。3）代码页面 1 的逻辑地址为 00008000H，表明其位于第 8 个页的位置，对应页表中的第 8 个页表项，所以第 8 个页表项的物理地址 = 页表起始地址 + 8×页表项的字节数 = 00200000H + 8×4 = 00200020H。由此可得如下图所示的答案。（3 分）【评分说明】共 5 个答数。物理地址 1 和物理地址 2 共 1 分；页框号 1 和页框号 2 共 1 分；物理地址 3 给 1 分。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2013/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2013/assets/q46-question-01.png",
      "/questions/2013/assets/q46-question-02.png",
      "/questions/2013/assets/q46-question-03.png"
    ]
  },
  {
    "id": "real-2012-23",
    "number": "2012 年 · 第 23 题",
    "title": "2012 年 408 操作系统 · 第 23 题",
    "prompt": "下列选项中，不可能在用户态发生的事件是（ ）。",
    "status": "真题",
    "tags": [
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-4"
    ],
    "year": 2012,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "系统调用"
      },
      {
        "label": "B",
        "text": "外部中断"
      },
      {
        "label": "C",
        "text": "进程切换"
      },
      {
        "label": "D",
        "text": "缺页"
      }
    ],
    "answer": "C",
    "solution": "本题关键是对 “在用户态 发生”（与上题的 “执行” 区分）的理解。对于 A，系统调用是操作系统提供给用户程序的接口，系统调用发生在用户态，被调用程序在核心态下执行。对于 B，外部中断是用户态到核心态的 “门”，也发生在用户态，在核心态完成中断过程。对于 C，进程切换属于系统调用执行过程中的事件，只能发生在核心态。对于 D，缺页产生后，在用户态发生缺页中断，然后进入核心态执行缺页中断服务程序。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-24",
    "number": "2012 年 · 第 24 题",
    "title": "2012 年 408 操作系统 · 第 24 题",
    "prompt": "中断处理和子程序调用都需要压栈以保护现场，中断处理一定会保存而子程序调用不需要保存其内容的是（ ）。",
    "status": "真题",
    "tags": [
      "寄存器类型"
    ],
    "knowledgeIds": [
      "OS-KP-3-1-2"
    ],
    "year": 2012,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "程序计数器"
      },
      {
        "label": "B",
        "text": "程序状态字寄存器"
      },
      {
        "label": "C",
        "text": "通用数据寄存器"
      },
      {
        "label": "D",
        "text": "通用地址寄存器"
      }
    ],
    "answer": "B",
    "solution": "子程序调用只需保存程序断点，即该指令的下一条指令的地址；中断调用子程序不仅要保护断点（PC 的内容），而且要保护程序状态字寄存器的内容 PSW。在中断处理中，最重要的两个寄存器是 PC 和 PSWR。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-25",
    "number": "2012 年 · 第 25 题",
    "title": "2012 年 408 操作系统 · 第 25 题",
    "prompt": "下列关于虚拟存储器的叙述中，正确的是（ ）。",
    "status": "真题",
    "tags": [
      "虚拟页式管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2",
      "OS-KP-4-2"
    ],
    "year": 2012,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "虚拟存储只能基于连续分配技术"
      },
      {
        "label": "B",
        "text": "虚拟存储只能基于非连续分配技术"
      },
      {
        "label": "C",
        "text": "虚拟存储容量只受外存容量的限制"
      },
      {
        "label": "D",
        "text": "虚拟存储容量只受内存容量的限制"
      }
    ],
    "answer": "B",
    "solution": "在程序装入时，可以只将程序的一部分装入内存，而将其余部分留在外存，就可以自动程序执行。采用连续分配方式时，会使相当一部分内存空间都处于暂时或 “永久” 的空闲状态，造成内存资源的严重浪费，也无法从逻辑上扩大内存容量，因此虚拟内存的实现只能建立在离散分配的内存管理的基础上。有以下三种实现方式：①请求分页存储管理；②请求分段存储管理；③请求段页式存储管理。虚拟存储器容量既不受外存容量限制，也不受内存容量限制，而是由 CPU 的寻址范围决定的。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-26",
    "number": "2012 年 · 第 26 题",
    "title": "2012 年 408 操作系统 · 第 26 题",
    "prompt": "用户程序发出磁盘 I/O 请求后，系统的正确处理流程是操作系统的 I/O 子系统通常由四个层次组成，每一层明确定义了与邻近层次的接口。其合理的层次组织排列顺序是（ ）。",
    "status": "真题",
    "tags": [
      "IO软件层次"
    ],
    "knowledgeIds": [
      "OS-KP-13-3"
    ],
    "year": 2012,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "用户级 I/O 软件、设备无关软件、设备驱动程序、中断处理程序"
      },
      {
        "label": "B",
        "text": "用户级 I/O 软件、设备无关软件、中断处理程序、设备驱动程序"
      },
      {
        "label": "C",
        "text": "用户级 I/O 软件、设备驱动程序、设备无关软件、中断处理程序"
      },
      {
        "label": "D",
        "text": "用户级 I/O 软件、中断处理程序、设备无关软件、设备驱动程序"
      }
    ],
    "answer": "A",
    "solution": "设备管理软件一般分为 以下层次：用户层、与设备无关的系统调用处理层、设备驱动程序以及中断处理程序。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-27",
    "number": "2012 年 · 第 27 题",
    "title": "2012 年 408 操作系统 · 第 27 题",
    "prompt": "假设 5 个进程 P0​ 、 P1​ 、 P2​ 、 P3​ 、 P4​ 共享三类资源 R1​ 、 R2​ 、 R3​ ，这些资源总数分别为 18、6、22。T0 时刻的资源分配情况如下表所示，此时存在的一个安全序列是（ ）。",
    "status": "真题",
    "tags": [
      "银行家算法"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-4"
    ],
    "year": 2012,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "P0​,P2​,P4​,P1​,P3​"
      },
      {
        "label": "B",
        "text": "P1​,P0​,P3​,P4​,P2​"
      },
      {
        "label": "C",
        "text": "P2​,P1​,P0​,P3​,P4​"
      },
      {
        "label": "D",
        "text": "P3​,P4​,P2​,P1​,P0​"
      }
    ],
    "answer": "D",
    "solution": "首先求得各进程的需求矩阵 Need 与可利用资源矢量 Available：比较 Need 和 Available 可以发现，初始时进程 P1​ 与 P3​ 可满足需求，排除 A、C。尝试给 P1​ 分配资源，则 P1​ 完成后 Available 将变为 (6,3,6)，无法满足 P0​ 的需求，排除 B。尝试给 P3​ 分配资源，则 P3​ 完成后 Available 将变为 (4,3,7)，该向量能满足其他所有进程的需求。所以，以 P3​ 开头的所有序列都是 安全序列。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2012/assets/q27-question-01.png"
    ]
  },
  {
    "id": "real-2012-28",
    "number": "2012 年 · 第 28 题",
    "title": "2012 年 408 操作系统 · 第 28 题",
    "prompt": "若一个用户进程通过 read 系统调用读取一个磁盘文件中的数据，则下列关于此过程的叙述中，正确的是（ ）。 Ⅰ. 若该文件的数据不在内存中，则该进程进入睡眠等待状态 Ⅱ. 请求 read 系统调用会导致 CPU 从用户态切换到核心态 Ⅲ. read 系统调用的参数应包含文件的名称",
    "status": "真题",
    "tags": [
      "缺页异常",
      "系统调用"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-4",
      "OS-KP-5-2-1",
      "OS-KP-3-2-5"
    ],
    "year": 2012,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅Ⅰ、Ⅱ"
      },
      {
        "label": "B",
        "text": "仅Ⅰ、Ⅲ"
      },
      {
        "label": "C",
        "text": "仅Ⅱ、Ⅲ"
      },
      {
        "label": "D",
        "text": "Ⅰ、Ⅱ和Ⅲ"
      }
    ],
    "answer": "A",
    "solution": "对于 I，当所读文件的数据不在内存时，产生中断（缺页中断），原进程进入阻塞状态，直到所需数据从外存调入内存后，才将该进程唤醒。对于 II，read 系统调用通过陷入将 CPU 从用户态切换到核心态，从而获取操作系统提供的服务。对于Ⅲ，要读一个文件首先要用 open 系统调用打开该文件。open 中的参数包含文件的路径名与文件名，而 read 只需要使用 open 返回的文件描述符，并不使用文件名作为参数。read 要求用户提供三个输入参数：①文件描述符 fd；②buf 缓冲区首址；③传送的字节数 n。read 的功能是试图从 fd 所指示的文件中读入 n 个字节的数据，并将它们送至由指针 buf 所指示的缓冲区中。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-29",
    "number": "2012 年 · 第 29 题",
    "title": "2012 年 408 操作系统 · 第 29 题",
    "prompt": "一个多道批处理系统中仅有 P1​ 和 P2​ 两个作业， P2​ 比 P1​ 晚 5ms 到达，它们的计算和 I/O 操作顺序如下： P1​ ：计算 60ms，I/O 80ms，计算 20ms P2​ ：计算 120ms，I/O 40ms，计算 40ms 若不考虑调度和切换时间，则完成两个作业需要的时间最少是（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2012,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "240ms"
      },
      {
        "label": "B",
        "text": "260ms"
      },
      {
        "label": "C",
        "text": "340ms"
      },
      {
        "label": "D",
        "text": "360ms"
      }
    ],
    "answer": "B",
    "solution": "由于 P2​ 比 P1​ 晚 5ms 到达， P1​ 先占用 CPU, 作业运行的甘特图如下所示。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-30",
    "number": "2012 年 · 第 30 题",
    "title": "2012 年 408 操作系统 · 第 30 题",
    "prompt": "若某单处理器多进程系统中有多个就绪态进程，则下列关于处理机调度的叙述中，错误的是（ ）。",
    "status": "真题",
    "tags": [
      "进程状态"
    ],
    "knowledgeIds": [
      "OS-KP-6-1-8"
    ],
    "year": 2012,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "在进程结束时能进行处理机调度"
      },
      {
        "label": "B",
        "text": "创建新进程后能进行处理机调度"
      },
      {
        "label": "C",
        "text": "在进程处于临界区时不能进行处理机调度"
      },
      {
        "label": "D",
        "text": "在系统调用完成并返回用户态时能进行处理机调度"
      }
    ],
    "answer": "C",
    "solution": "选项 A、B、D 显然是可以进行 处理机调度 的情况。对于 C，当进程处于临界区时，说明进程正在占用处理机，只要不破坏临界资源的使用规侧，是不会影响处理机调度的。比如，通常访问的临界资源可能是慢速的外设（如打印机），如果在进程访问打印机时，不能进行处理机调度，那么系统的性能将是非常差的。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-31",
    "number": "2012 年 · 第 31 题",
    "title": "2012 年 408 操作系统 · 第 31 题",
    "prompt": "下列关于进程和线程的叙述中，正确的是（ ）。",
    "status": "真题",
    "tags": [
      "进程和线程"
    ],
    "knowledgeIds": [
      "OS-KP-6-5-2"
    ],
    "year": 2012,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "不管系统是否支持线程，进程都是资源分配的基本单位"
      },
      {
        "label": "B",
        "text": "线程是资源分配的基本单位，进程是调度的基本单位"
      },
      {
        "label": "C",
        "text": "系统级线程和用户级线程的切换都需要内核的支持"
      },
      {
        "label": "D",
        "text": "同一进程中的各个线程拥有各自不同的地址空间"
      }
    ],
    "answer": "A",
    "solution": "在引入 线程 后，进程依然还是资源分配的基本单位，线程是调度的基本单位，同一进程中的各个线程共享进程的地址空间。在用户级线程中，有关线程管理的所有工作都由应用程序完成，无须内核的干预，内核意识不到线程的存在。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-32",
    "number": "2012 年 · 第 32 题",
    "title": "2012 年 408 操作系统 · 第 32 题",
    "prompt": "下列选项中，不能改善磁盘设备 I/O 性能的是（ ）。",
    "status": "真题",
    "tags": [
      "磁盘概念"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3"
    ],
    "year": 2012,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "重排 I/O 请求次序"
      },
      {
        "label": "B",
        "text": "在一个磁盘上设置多个分区"
      },
      {
        "label": "C",
        "text": "预读和滞后写"
      },
      {
        "label": "D",
        "text": "优化文件物理块的分布"
      }
    ],
    "answer": "B",
    "solution": "对于 A，重排 I/O 请求次序也就是进行 I/O 调度，从而使进程之间公平地共享磁盘访问，减少 I/O 完成所需要的平均等待时间。对于 C，缓冲区结合预读和滞后写技术对于具有重复性及阵发性的 I/O 进程改善磁盘 I/O 性能很有帮助。对于 D，优化文件物理块的分布可以减少寻找时间与延迟时间，从而提高磁盘性能。在一个磁盘上设置多个分区与改善设备/O 性能并无多大联系，相反还会带来处理的复杂和降低利用率。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-45",
    "number": "2012 年 · 第 45 题",
    "title": "2012 年 408 操作系统 · 第 45 题",
    "prompt": "某请求分页系统的局部页面置换策略如下：系统从 0 时刻开始扫描，每隔 5 个时间单位扫描一轮驻留集（扫描时间忽略不计），本轮没有被访问过的页框将被系统回收，并放入到空闲页框链尾，其中内容在下一次被分配之前不被清空。当发生缺页时，如果该页曾被使用过且还在空闲页框链表中，则重新放回进程的驻留集中；否则，从空闲页框链表头部取出一个页框。 假设不考虑其他进程的影响和系统开销，初始时进程驻留集为空。目前系统空闲页框链表中页框号依次为 32、15、21、41。进程 P 依次访问的 <虚拟页号，访问时刻> 是： <1, 1>、<3, 2>、<0, 4>、<0, 6>、<1, 11>、<0, 13>、<2, 14>。请回答下列问题。 (1) 访问<0, 4>时，对应的页框号是什么？ (2) 访问<1, 11>时，对应的页框号是什么？说明理由。 (3) 访问<2, 14>时，对应的页框号是什么？说明理由。 (4) 该策略是否适合于时间局部性好的程序？说明理由。",
    "status": "真题",
    "tags": [
      "驻留集"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-4"
    ],
    "year": 2012,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）页框号为 21。理由：因为起始 驻留集 为空，因此 0 页对应的页框为空闲链表中的第三个空闲页框 21，其对应的页框号为 21。2）页框号为 32。理由：因 11>10 故发生第三轮扫描，页号为 1 的页框在第二轮已处于空闲页框链表中，此刻该页又被重新访问，因此应被重新放回驻留集中，其页框号为 32。3）页框号为 41。理由：因为第 2 页从来没有被访问过，它不在驻留集中，因此从空闲页框链表中取出链表头的页框 41，页框号为 41。4）合适。理由：如果程序的时间局部性越好，那么从空闲页框链表中重新取回的机会越大，该策略的优势越明显。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2012-46",
    "number": "2012 年 · 第 46 题",
    "title": "2012 年 408 操作系统 · 第 46 题",
    "prompt": "某文件系统空间的最大容量为 4TB（1TB= 240 B），以磁盘块为基本分配单位。磁盘块大小为 1KB。文件控制块 (FCB) 包含一个 512B 的索引表区。请回答下列问题。 (1) 假设索引表区仅采用直接索引结构，索引表区存放文件占用的磁盘块号，索引表项中块号最少占多少字节？可支持的单个文件最大长度是多少字节？ (2) 假设索引表区采用如下结构：第 0～7 字节采用 <起始块号，块数> 格式表示文件创建时预分配的连续存储空间，其中起始块号占 6B，块数占 2B；剩余 504 字节采用直接索引结构，一个索引项占 6B，那么可支持的单个文件最大长度是多少字节？为了使单个文件的长度达到最大，请指出起始块号和块数分别所占字节数的合理值并说明理由。",
    "status": "真题",
    "tags": [
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3"
    ],
    "year": 2012,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）文件系统中所能容纳的磁盘块总数为 4TB/1KB=2³²。要完全表示所有磁盘块，索引项中的块号最少要占 32/8=4B。而索引表区仅采用直接索引结构，故 512B 的索引表区能容纳512B/4B=128 个索引项。每个索引项对应一个磁盘块，所以该系统可支持的单个文件最大长度是 128×1KB=128KB.2）这里的考查的分配方式不同于我们所熟悉的三种经典分配方式，但是题目中给出了详细的解释，这个小问采用 混合索引 的方式。所求的单个文件最大长度一共包含两部分：预分配的连续空间和直接索引区。连续区块数占 2B，共可以表示 2¹⁶ 个磁盘块，即 2²⁶B。直接索引区共 504B/6B=84 个索引项。所以该系统可支持的单个文件最大长度是 2²⁶B+84KB。为了使单个文件的长度达到最大，应使连续区的块数字段表示的空间大小尽可能接近系统最大容量 4TB。分别设起始块号和块数分别占 4B，这样起始块号可以寻址的范围是 2³² 个磁盘块，共 4TB，即整个系统空间。同样，块数字段可以表示最多 2³² 个磁盘块，共 4TB。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2012/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-23",
    "number": "2011 年 · 第 23 题",
    "title": "2011 年 408 操作系统 · 第 23 题",
    "prompt": "下列选项中，满足短任务优先且不会发生饥饿现象的调度算法是（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2011,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "先来先服务"
      },
      {
        "label": "B",
        "text": "高响应比优先"
      },
      {
        "label": "C",
        "text": "时间片轮转"
      },
      {
        "label": "D",
        "text": "非抢占式短任务优先"
      }
    ],
    "answer": "B",
    "solution": "最高响应比优先 是一种综合考虑任务长度和等待时间的调度算法，响应比＝（等待时间＋执行时间）／执行时间。高响应比优先算法在等待时间相同的情况下，作业执行时间越短则响应比越高，满足短任务优先。随着长任务的等待时间增加，响应比也会变大，执行机会也就增大，所以不会发生饥饿现象。先来先服务和时间片轮转不符合短任务优先，非抢占式短任务优先会产生饥饿现象。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-24",
    "number": "2011 年 · 第 24 题",
    "title": "2011 年 408 操作系统 · 第 24 题",
    "prompt": "下列选项中，在用户态执行的是（ ）。",
    "status": "真题",
    "tags": [
      "用户态和内核态"
    ],
    "knowledgeIds": [
      "OS-KP-3-2-4"
    ],
    "year": 2011,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "命令解释程序"
      },
      {
        "label": "B",
        "text": "缺页处理程序"
      },
      {
        "label": "C",
        "text": "进程调度程序"
      },
      {
        "label": "D",
        "text": "时钟中断处理程序"
      }
    ],
    "answer": "A",
    "solution": "缺页处理和时钟中断都属于中断，在 内核态 执行；进程调度是操作系统内核进程，无须用户干预，在核心态执行；命令解释程序属于命令接口，是四个选项中唯一能面对用户的，它在 用户态 执行。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-25",
    "number": "2011 年 · 第 25 题",
    "title": "2011 年 408 操作系统 · 第 25 题",
    "prompt": "在支持多线程的系统中，进程 P 创建的若干线程不能共享的是（ ）。",
    "status": "真题",
    "tags": [
      "进程和线程"
    ],
    "knowledgeIds": [
      "OS-KP-6-5-2"
    ],
    "year": 2011,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "进程 P 的代码段"
      },
      {
        "label": "B",
        "text": "进程 P 中打开的文件"
      },
      {
        "label": "C",
        "text": "进程 P 的全局变量"
      },
      {
        "label": "D",
        "text": "进程 P 中某线程的栈指针"
      }
    ],
    "answer": "D",
    "solution": "进程是资源分配的基本单位，线程 是处理机调度的基本单位。因此，进程的代码段、进程打开的文件、进程的全局变量等都是进程的资源，唯有进程中某线程的栈指针是属于线程的，属于进程的资源可以共享，属于线程的栈是独享的，对其他线程透明。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-26",
    "number": "2011 年 · 第 26 题",
    "title": "2011 年 408 操作系统 · 第 26 题",
    "prompt": "用户程序发出磁盘 I/O 请求后，系统的正确处理流程是（ ）。",
    "status": "真题",
    "tags": [
      "IO软件层次"
    ],
    "knowledgeIds": [
      "OS-KP-13-3"
    ],
    "year": 2011,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "用户程序→系统调用处理程序→中断处理程序→设备驱动程序"
      },
      {
        "label": "B",
        "text": "用户程序→系统调用处理程序→设备驱动程序→中断处理程序"
      },
      {
        "label": "C",
        "text": "用户程序→设备驱动程序→系统调用处理程序→中断处理程序"
      },
      {
        "label": "D",
        "text": "用户程序→设备驱动程序→中断处理程序→系统调用处理程序"
      }
    ],
    "answer": "B",
    "solution": "I/O 软件 一般从上到下分为四个层次：用户层、与设备无关的软件层、设备驱动程序以及中断处理程序。与设备无关的软件层也就是系统调用的处理程序。当用户使用设备时，首先在用户程序中发起一次系统调用，操作系统的内核接到该调用请求后请求调用处理程序进行处理，再转到相应的设备驱动程序，当设备准备好或所需数据到达后设备硬件发出中断，将数据按上述调用顺序逆向回传到用户程序中。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-27",
    "number": "2011 年 · 第 27 题",
    "title": "2011 年 408 操作系统 · 第 27 题",
    "prompt": "某时刻进程的资源使用情况如下表所示。 此时的安全序列是（ ）。",
    "status": "真题",
    "tags": [
      "银行家算法"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-4"
    ],
    "year": 2011,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "P1​,P2​,P3​,P4​"
      },
      {
        "label": "B",
        "text": "P1​,P4​,P3​,P2​"
      },
      {
        "label": "C",
        "text": "P1​,P3​,P2​,P4​"
      },
      {
        "label": "D",
        "text": "不存在"
      }
    ],
    "answer": "D",
    "solution": "题应采用排除法，逐个代入分析。当剩余资源分配给 P1​ ，待 P1​ 执行完后，可用资源数为 (2,2,1)，此时仅能满足 P4​ 的需求，排除 A、B；接着分配给 P4​ ，待 P4​ 执行完后，可用资源数为 (2,2,2)，此时已无法满足任何进程的需求，排除 C。此外，本题还可以使用 银行家算法 求解（对于选择题来说，显得过于复杂）。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2011/assets/q27-question-01.png"
    ]
  },
  {
    "id": "real-2011-28",
    "number": "2011 年 · 第 28 题",
    "title": "2011 年 408 操作系统 · 第 28 题",
    "prompt": "在缺页处理过程中，操作系统执行的操作可能是（）。 I、修改页表 II、磁盘 I/O III、分配页框",
    "status": "真题",
    "tags": [
      "缺页异常"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-4",
      "OS-KP-5-2-1"
    ],
    "year": 2011,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I、II"
      },
      {
        "label": "B",
        "text": "仅 II"
      },
      {
        "label": "C",
        "text": "仅 III"
      },
      {
        "label": "D",
        "text": "I、II 和 III"
      }
    ],
    "answer": "D",
    "solution": "缺页中断 产生后，需要在内存中找到空闲页框并分配给需要访问的页（可能涉及页面置换），之后缺页中断处理程序调用设备驱动程序做磁盘/O，将位于外存上的页面调入内存，调入后需要修改页表，将页表中代表该页是否在内存的标志位（或有效位）置为 1，并将物理页框号填入相应位置，若必要还需修改其他相关表项等。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-29",
    "number": "2011 年 · 第 29 题",
    "title": "2011 年 408 操作系统 · 第 29 题",
    "prompt": "当系统发生抖动 (thrashing) 时，可以采取的有效措施是（ ）。 I. 撤销部分进程 II. 增加磁盘交换区的容量 III. 提高用户进程的优先级",
    "status": "真题",
    "tags": [
      "抖动"
    ],
    "knowledgeIds": [
      "OS-KP-5-2-4"
    ],
    "year": 2011,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I"
      },
      {
        "label": "B",
        "text": "仅 II"
      },
      {
        "label": "C",
        "text": "仅 III"
      },
      {
        "label": "D",
        "text": "仅 I、II"
      }
    ],
    "answer": "A",
    "solution": "在具有对换功能的操作系统中，通常把外存分为文件区和对换区。前者用于存放文件，后者用于存放从内存换出的进程。抖动 现象是指刚刚被换出的页很快又要被访问，为此又要换出其他页，而该页又很快被访问，如此频繁地置换页面，以致大部分时间都花在页面置换上，引起系统 性能下降。撤销部分进程可以减少所要用到的页面数，防止抖动。对换区大小和进程优先级都与抖动无关。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-30",
    "number": "2011 年 · 第 30 题",
    "title": "2011 年 408 操作系统 · 第 30 题",
    "prompt": "在虚拟内存管理中，地址变换机构将逻辑地址变换为物理地址，形成该逻辑地址的阶段是（）。",
    "status": "真题",
    "tags": [
      "程序的链接",
      "程序的装入"
    ],
    "knowledgeIds": [
      "OS-KP-3-1-4",
      "OS-KP-6-1-2"
    ],
    "year": 2011,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "编辑"
      },
      {
        "label": "B",
        "text": "编译"
      },
      {
        "label": "C",
        "text": "链接"
      },
      {
        "label": "D",
        "text": "装载"
      }
    ],
    "answer": "C",
    "solution": "编译后的模块需要经过链接才能装载，而链接后形成的地址才是整个程序的完整逻辑地址空间。以 C 语言为例：C 语言经过预处理 (cpp)→编译 (ccl)→汇编 (as)→链接 (ld) 产生可执行文件。其中链接的前一步，产生了可重定位的二进制的目标文件。C 语言采用源文件独立编译的方法，如程序 main.c，file1.c,file2.c,file1.h,file2.h，在链接的前一步生成了 main.o,file1.o,file2.o，这些目标模块采用的逻辑地址都从 0 开始，但只是相对于该模块的逻辑地址。链接器将这三个文件，libc 和其他的库文件链接成一个可执行文件。链接阶段主要完成了重定位，形成整个程序的完整逻辑地址空间。例如，file1.o 的逻辑地址为 01023，main.o 的逻辑地址为 01023，假设链接时将 file1.o 链接在 main.o 之后，则重定位之后 file1.o 对应的逻辑地址就应为 1024~2047。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-31",
    "number": "2011 年 · 第 31 题",
    "title": "2011 年 408 操作系统 · 第 31 题",
    "prompt": "某文件占 10 个磁盘块，现要把该文件磁盘块逐个读入主存缓冲区，并送用户区进行分析，假设一个缓冲区与一个磁盘块大小相同，把一个磁盘块读入缓冲区的时间为 100μs，将缓冲区的数据传送到用户区的时间是 50μs，CPU 对一块数据进行分析的时间为 50μs。在单缓冲区和双缓冲区结构下，读入并分析完该文件的时间分别是（ ）。",
    "status": "真题",
    "tags": [
      "缓冲区"
    ],
    "knowledgeIds": [
      "OS-KP-13-3-3"
    ],
    "year": 2011,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "1500μs、1000μs"
      },
      {
        "label": "B",
        "text": "1550μs、1100μs"
      },
      {
        "label": "C",
        "text": "1550μs、1550μs"
      },
      {
        "label": "D",
        "text": "2000μs、2000μs"
      }
    ],
    "answer": "B",
    "solution": "在 单缓冲区 中，当上一个磁盘块从缓冲区读入用户区完成时，下一磁盘块才能开始读入，也就是当最后一块磁盘块读入用户区完毕时所用时间为 150×10=1500μs，加上处理最后一个磁盘块的时间 50μs，得 1550μs。在 双缓冲 中，不存在等待磁盘块从缓冲区读入用户区的问题，10 个磁盘块可以连续从外存读入主存缓冲区，加上将最后一个磁盘块从缓冲区送到用户区的传输时间 50μs 以及处理时间 50μs，也就是 100×10+50+50=1100μs。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-32",
    "number": "2011 年 · 第 32 题",
    "title": "2011 年 408 操作系统 · 第 32 题",
    "prompt": "有两个并发执行的进程 P1 和 P2，共享初值为 1 的变量 x。P1 对 x 加 1，P2 对 x 减 1。加 1 和减 1 操作的指令序列分别如下所示。 P1 // 加 1 操作 load R1, x // 取 x 到寄存器 R1 中 inc R1 store x, R1 // 将 R1 的内容存入 x P2 // 减 1 操作 load R2, x // 取 x 到寄存器 R2 中 dec R2 store x, R2 // 将 R2 的内容存入 x 两个操作完成后，x 的值（ ）。",
    "status": "真题",
    "tags": [
      "进程和线程"
    ],
    "knowledgeIds": [
      "OS-KP-6-5-2"
    ],
    "year": 2011,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "可能为 -1 或 3"
      },
      {
        "label": "B",
        "text": "只能为 1"
      },
      {
        "label": "C",
        "text": "可能为 0、1 或 2"
      },
      {
        "label": "D",
        "text": "可能为 -1、0、1 或 2"
      }
    ],
    "answer": "C",
    "solution": "将 P1​ 中 3 条语句依次编号为 1,2,3； P2​ 中 3 条语句依次编号为 4,5,6。依次执行 1,2,3,4,5,6 得结果 1，依次执行 1,2,4,5,6,3 得结果 2，执行 4,5,1,2,3,6 得结果 0。因此结果 -1 不可能得出。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-45",
    "number": "2011 年 · 第 45 题",
    "title": "2011 年 408 操作系统 · 第 45 题",
    "prompt": "某银行提供 1 个服务窗口和 10 个顾客等待座位。顾客到达银行时，若有空座位，则到取号机领取一个号，等待叫号。取号机每次仅允许一位顾客使用。当营业员空闲时，通过叫号选取一位顾客，并为其服务。顾客和营业员的活动过程描述如下： cobegin { process 顾客 i { 从取号机获得一个号码; 等待叫号; 获得服务; } process 营业员 { while (TRUE) { 叫号; 为顾客服务; } } }coend 请添加必要的信号量和 P、V（或 wait()、signal()）操作实现上述过程的互斥和同步。要求写出完整的过程，说明信号量的含义并赋初值。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2011,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）互斥资源：取号机（一次只一位顾客领号），因此设一个互斥信号量 mutex。2）同步问题：顾客需要获得空座位等待叫号，当营业员空闲时，将选取一位顾客并为其服务。空座位的有、无影响等待顾客数量，顾客的有、无决定了营业员是否能开始服务，故分别设置信号量 empty 和 full 来实现这一同步关系。另外，顾客获得空座位后，需要等待叫号和被服务。这样，顾客与营业员就服务何时开始又构成了一个同步关系，定义信号量 service 来完成这一同步过程。semaphore empty = 10; // 空座位的数量 semaphore mutex = 1; // 互斥使用取号机 semaphore full = 0; // 已占座位的数量 semaphore service = 0; // 等待叫号 process 顾客 i { P(empty); // 等空位 P(mutex); // 申请使用取号机 从取号机上取号; V(mutex); // 取号完毕 V(fu11); // 通知营业员有新顾客 P(service); // 等待营业员叫号 接受服务; } process 营业员 { while(True) ( P(fu11); // 没有顾客则休息 叫号; V(empty); // 离开座位 V(service); // 叫号 为顾客服务; } }",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2011-46",
    "number": "2011 年 · 第 46 题",
    "title": "2011 年 408 操作系统 · 第 46 题",
    "prompt": "某文件系统为一级目录结构，文件的数据一次性写入磁盘，已写入的文件不可修改，但可多次创建新文件。请回答如下问题∶ (1) 在连续、链式、索引二种文件的数据块组织方式中。哪种更合适？要求说明理由。为定位文件数据块，需要在 FCB 中设计哪些相关描述字段？ (2) 为快速找到文件，对于 FCB，是集中存储好，还是与对应的文件数据块连续存储好？要求说明理由。",
    "status": "真题",
    "tags": [
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3"
    ],
    "year": 2011,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）在磁盘中连续存放（采取连续结构），磁盘寻道时间更短，文件随机访问效率更高；在 FCB 中加入的字段为：<起始块号，块数> 或者 <起始块号，结束块号>。2）将所有的 FCB 集中存放，文件数据集中存放。这样在随机查找文件名时，只需访问 FCB 对应的块，可减少磁头移动和磁盘 I/O 访问次数。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2011/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-23",
    "number": "2010 年 · 第 23 题",
    "title": "2010 年 408 操作系统 · 第 23 题",
    "prompt": "下列选项中，操作系统提供给应用程序的接口是（ ）。",
    "status": "真题",
    "tags": [
      "操作系统概念"
    ],
    "knowledgeIds": [
      "OS-KP-1-2"
    ],
    "year": 2010,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "系统调用"
      },
      {
        "label": "B",
        "text": "中断"
      },
      {
        "label": "C",
        "text": "库函数"
      },
      {
        "label": "D",
        "text": "原语"
      }
    ],
    "answer": "A",
    "solution": "操作系统提供的接口主要有两类：命令接口和系统调用。系统调用是能完成特定功能的子程序，当应用程序请求操作系统提供某种服务时，便调用具有相应功能的系统调用。库函数则是高级语言中提供的与系统调用对应的函数（也有些库函数与系统调用无关），目的是隐藏访管指令的细节，使系统调用更为方便、抽象。但要注意，库函数属于用户程序而非系统调用，是系统调用的上层。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-24",
    "number": "2010 年 · 第 24 题",
    "title": "2010 年 408 操作系统 · 第 24 题",
    "prompt": "下列选项中，导致创建新进程的操作是（ ）。 I.用户登录成功 II.设备分配 III.启动程序执行",
    "status": "真题",
    "tags": [
      "进程概念"
    ],
    "knowledgeIds": [
      "OS-KP-6-1"
    ],
    "year": 2010,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "仅 I 和 II"
      },
      {
        "label": "B",
        "text": "仅 II 和 III"
      },
      {
        "label": "C",
        "text": "仅 I 和 III"
      },
      {
        "label": "D",
        "text": "I、II 和 III"
      }
    ],
    "answer": "C",
    "solution": "引起进程创建的事件有：用户登录、作业调度、提供服务、应用请求等。I. 用户登录成功后，系统要为此创建一个用户管理的进程，包括用户桌面、环境等。所有的用户进程会在该进程下创建和管理。II. 设备分配是通过在系统中设置相应的数据结构实现的，不需要创建进程。III. 启动程序执行是典型的引起创建进程的事件。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-25",
    "number": "2010 年 · 第 25 题",
    "title": "2010 年 408 操作系统 · 第 25 题",
    "prompt": "设与某资源关联的信号量初值为 3，当前值为 1。若 M 表示该资源的可用个数，N 表示等待该资源的进程数，则 M、N 分别是（ ）。",
    "status": "真题",
    "tags": [
      "信号量"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-4"
    ],
    "year": 2010,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "0、1"
      },
      {
        "label": "B",
        "text": "1、0"
      },
      {
        "label": "C",
        "text": "1、2"
      },
      {
        "label": "D",
        "text": "2、0"
      }
    ],
    "answer": "B",
    "solution": "信号量 表示相关资源的当前可用数量。当信号量 K>0 时，表示还有 K 个相关资源可用，所以该资源的可用个数是 1。而当信号量 K<0 时，表示有 |K| 个进程在等待该资源。由于资源有剩余，可见没有其他进程等待使用该资源，故进程数为 0。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-26",
    "number": "2010 年 · 第 26 题",
    "title": "2010 年 408 操作系统 · 第 26 题",
    "prompt": "下列选项中，降低进程优先级的合理时机是（ ）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2010,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "进程时间片用完"
      },
      {
        "label": "B",
        "text": "进程刚完成 I/O 操作，进入就绪队列"
      },
      {
        "label": "C",
        "text": "进程长期处于就绪队列"
      },
      {
        "label": "D",
        "text": "进程从就绪状态转为运行状态"
      }
    ],
    "answer": "A",
    "solution": "进程时间片用完，可降低其优先级以让别的进程被调度进入执行状态。B 选项中进程刚完成 I/O，进入就绪队列等待被处理机调度，为了让其尽快处理 I/O 结果，故应提高优先权。C 选项中进程长期处于就绪队列，为不至于产生饥饿现象，也应适当提高优先级。D 选项中进程的优先级不应该在此时降低，而应在时间片用完后再降低。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-27",
    "number": "2010 年 · 第 27 题",
    "title": "2010 年 408 操作系统 · 第 27 题",
    "prompt": "进程 P0​ 和 P1​ 的共享变量定义及其初值为 boolean flag[2]; int turn = 0; flag[0] = FALSE; flag[1] = FALSE; 若进程 P0​ 和 P1​ 访问临界资源的类 C 伪代码实现如下： 进程 P0 void P0() { while (TRUE) { flag[0] = TRUE; turn = 1; while (flag[1] && (turn == 1)); 临界区； flag[0] = FALSE; } } 进程 P1 void P1() { while (TRUE) { flag[1] = TRUE; turn = 0; while (flag[0] && (turn == 0)); 临界区； flag[1] = FALSE; } } 则并发执行进程 P0​ 和 P1​ 时产生的情形是（ ）。",
    "status": "真题",
    "tags": [
      "软件互斥算法"
    ],
    "knowledgeIds": [
      "OS-KP-9-2-1"
    ],
    "year": 2010,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "不能保证进程互斥进入临界区，会出现“饥饿”现象"
      },
      {
        "label": "B",
        "text": "不能保证进程互斥进入临界区，不会出现“饥饿”现象"
      },
      {
        "label": "C",
        "text": "能保证进程互斥进入临界区，会出现“饥饿”现象"
      },
      {
        "label": "D",
        "text": "能保证进程互斥进入临界区，不会出现“饥饿”现象"
      }
    ],
    "answer": "D",
    "solution": "这是 Peterson 算法 的实际实现，保证进入临界区的进程合理安全。该算法为了防止两个进程为进入临界区而无限期等待，设置变量 u，表示不允许进入临界区的编号，每个进程在先设置自己标志后再设置 u 标志，不允许另一个进程进入，这时，再同时检测另一个进程状态标志和不允许进入表示，这样可以保证当两个进程同时要求进入临界区时只允许一个进程进入临界区。保存的是较晚的一次赋值，因此较晚的进程等待，较早的进程进入。先到先入，后到等待，从而完成临界区访问的要求。其实这里可以想象为两个人进门，每个人进门前都会和对方客套一句“你先走”。如果进门时没别人，就当和空气说句废话，然后大步登门入室；如果两人同时进门，就互相请先，但各自只客套一次，所以先客套的人请完对方，就等着对方请自己，然后光明正大地进门。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-28",
    "number": "2010 年 · 第 28 题",
    "title": "2010 年 408 操作系统 · 第 28 题",
    "prompt": "某基于动态分区存储管理的计算机，其主存容量为 55MB（初始为空闲），采用最佳适配 (Best Fit) 算法，分配和释放的顺序为：分配 15MB、分配 30MB、释放 15MB、分配 8MB、分配 6MB，此时主存中最大空闲分区的大小是（ ）。",
    "status": "真题",
    "tags": [
      "动态内存管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-2-5"
    ],
    "year": 2010,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "7MB"
      },
      {
        "label": "B",
        "text": "9MB"
      },
      {
        "label": "C",
        "text": "10MB"
      },
      {
        "label": "D",
        "text": "15MB"
      }
    ],
    "answer": "B",
    "solution": "最佳适应 算法是指每次为作业分配内存空间时，总是找到能满足空间大小需要的最小的空闲分区给作业，可以产生最小的内存空闲分区，如下图所示。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-29",
    "number": "2010 年 · 第 29 题",
    "title": "2010 年 408 操作系统 · 第 29 题",
    "prompt": "某计算机采用二级页表的分页存储管理方式，按字节编址，页大小为 210 B，页表项大小为 2B，逻辑地址结构为 | 页目录号 | 页号 |页内偏移量 |。逻辑地址空间大小为 216 页，则表示整个逻辑地址空间的页目录表中包含表项的个数至少是（）。",
    "status": "真题",
    "tags": [
      "页表"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-4",
      "OS-KP-4-2-2"
    ],
    "year": 2010,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "64"
      },
      {
        "label": "B",
        "text": "128"
      },
      {
        "label": "C",
        "text": "256"
      },
      {
        "label": "D",
        "text": "512"
      }
    ],
    "answer": "B",
    "solution": "页大小为 210 B，页表项大小为 2B，故一页可以存放 29 个页表项，逻辑地址空间大小为 216 页，即共需 216 个页表项，则需要 216/29=27=128 个页面保存页表项，即页目录表中包含表项的个数至少是 128 。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-30",
    "number": "2010 年 · 第 30 题",
    "title": "2010 年 408 操作系统 · 第 30 题",
    "prompt": "设文件索引结点中有 7 个地址项，其中 4 个地址项是直接地址索引，2 个地址项是一级间接地址索引，1 个地址项是二级间接地址索引，每个地址项大小为 4B，若磁盘索引块和磁盘数据块大小均为 256B，则可表示的单个文件最大长度是（）。",
    "status": "真题",
    "tags": [
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3"
    ],
    "year": 2010,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "33KB"
      },
      {
        "label": "B",
        "text": "519KB"
      },
      {
        "label": "C",
        "text": "1057KB"
      },
      {
        "label": "D",
        "text": "1651KB"
      }
    ],
    "answer": "C",
    "solution": "每个磁盘索引块和磁盘数据块大小均为 256B，每个磁盘索引块有 256/4=64 个地址项。因 此，4 个直接地址索引指向的数据块大小为 4×256B;2 个一级间接索引包含的直接地址索引数 为 2×(256/4)，即其指向的数据块大小为 2×(256/4)×256B。1 个二级间接索引所包含的直接地址 索引数为 (256/4)×(256/4)，即其所指向的数据块大小为 (256/4)×(256/4)×256B。即 7 个地址项所 指向的数据块总大小为 4×256+2×(256/4)×256+(256/4)×(256/4)×256=1082368B=1057KB。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-31",
    "number": "2010 年 · 第 31 题",
    "title": "2010 年 408 操作系统 · 第 31 题",
    "prompt": "设置当前工作目录的的主要目的是（ ）。",
    "status": "真题",
    "tags": [
      "目录"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-4"
    ],
    "year": 2010,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "节省外存空间"
      },
      {
        "label": "B",
        "text": "节省内存空间"
      },
      {
        "label": "C",
        "text": "加快文件的检索速度"
      },
      {
        "label": "D",
        "text": "加快文件的读/写速度"
      }
    ],
    "answer": "C",
    "solution": "当一个文件系统含有多级目录时，每访问一个文件，都要使用从树根开始到树叶为止、包括各中间结点名的全路径名。当前目录又称工作目录，进程对各个文件的访问都相对于当前目录进行，而不需要从根目录一层一层的检索，加快了文件的检索速度。选项 A 和 B 都与相对目录无关；选项 D，文件的读/写速度取决于磁盘的性能。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-32",
    "number": "2010 年 · 第 32 题",
    "title": "2010 年 408 操作系统 · 第 32 题",
    "prompt": "本地用户通过键盘登录系统时，首先获得键盘输入信息的程序是（ ）。",
    "status": "真题",
    "tags": [
      "中断IO"
    ],
    "knowledgeIds": [
      "OS-KP-13-2-4"
    ],
    "year": 2010,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "命令解释程序"
      },
      {
        "label": "B",
        "text": "中断处理程序"
      },
      {
        "label": "C",
        "text": "系统调用服务程序"
      },
      {
        "label": "D",
        "text": "用户登录程序"
      }
    ],
    "answer": "B",
    "solution": "键盘是典型的通过 中断 I/O 方式 工作的外设，当用户输入信息时，计算机响应中断并通过中断处理程序获得输入信息。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2010-45",
    "number": "2010 年 · 第 45 题",
    "title": "2010 年 408 操作系统 · 第 45 题",
    "prompt": "假设计算机系统采用 CSCAN（循环扫描）磁盘调度策略，使用 2KB 的内存空间记录 16384 个磁盘块的空闲状态。 (1) 请说明在上述条件如何进行磁盘块空闲状态的管理。 (2) 设某单面磁盘的旋转速度为 6000rpm，每个磁道有 100 个扇区，相邻磁道间的平均移动的时间为 1ms。若在某时刻，磁头位于 100 号磁道处，并沿着磁道号增大的方向移动（见下图），磁道号的请求队列为 50, 90, 30, 120，对请求队列中的每个磁道需读取 1 个随机分布的扇区，则读完这个扇区点共需要多少时间？需要给出计算过程。 (3) 如果将磁盘替换为随机访问的 Flash 半导体存储器（如 U 盘、SSD 等），是否有比 CSCAN 更高效的磁盘调度策略？若有，给出磁盘调度策略的名称并说明理由；若无，说明理由。",
    "status": "真题",
    "tags": [
      "磁盘调度算法",
      "外存空间管理"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3",
      "OS-KP-11-1-5"
    ],
    "year": 2010,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）用 位图 表示磁盘的空闲状态。每位表示一个磁盘块的空闲状态，共需要 16384/32 = 512字 = 512×4字节 = 2KB，正好可放在系统提供的内存中。2）采用 C-SCAN 调度算法，访问磁道的顺序和移动的磁道数见下表。被访问的下一个磁道号移动距离（磁道数）12020309050209040移动的磁道数为 20+90+20+40 = 170，故总的移动磁道时间为 170ms。由于转速为 6000rpm，则平均旋转延迟为 5ms，总的旋转延迟时间 = 20ms。由于转速为 6000rpm，则读取一个磁道上一个扇区的平均读取时间为 0.1ms，总的读取扇区的时间为 0.4ms。综上，读取上述磁道上 所有扇区所花的总时间为 190.4ms。3）采用 FCFS 调度策略更高效。因为 Flash 半导体存储器的物理结构不需要考虑寻道时间和旋转延迟，可直接按 I/O 请求的先后顺序服务。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2010/assets/q45-question-01.png"
    ]
  },
  {
    "id": "real-2010-46",
    "number": "2010 年 · 第 46 题",
    "title": "2010 年 408 操作系统 · 第 46 题",
    "prompt": "设某计算机的逻辑地址空间和物理地址空间均为 64KB，按字节编址。若某进程最多需要 6 页（Page）数据存储空间，页的大小为 1KB，操作系统采用固定分配局部置换策略为此进程分配 4 个页框（Page Frame）。在时刻 260 前该进程访问情况见下表（访问位即使用位）。 页号页框号装入时刻访问位071301142301222001392601 当该进程执行到时刻 260 时，要访问逻辑地址为 17CAH 的数据。请回答下列问题： (1) 该逻辑地址对应的页号是多少？ (2) 若采用先进先出 (FIFO) 置换算法，该逻辑地址对应的物理地址？要求给出计算过程。 (3) 采用时钟 (CLOCK) 置换算法，该逻辑地址对应的物理地址是多少？要求给出计算过程（设搜索下一页的指针按顺时针方向移动，且指向当前 2 号页框，示意图如下图）。",
    "status": "真题",
    "tags": [
      "地址翻译",
      "页框分配和置换策略"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-5-1",
      "OS-KP-5-2-2"
    ],
    "year": 2010,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1） 由于该计算机的逻辑地址空间和物理地址空间均为 64KB=216 B，按字节编址，且页的大小为 1KB=210 B，故逻辑地址和物理地址的地址格式均为| 页框号（6 位） | 页内偏移（10 位） |17CAH = 0001 0111 1100 1010B，可知该逻辑地址的页号为 000101B = 5。2） 根据 FIFO 算法，需要替换装入时间最早的页，故需要置换装入时间最早的 0 号页，即将 5 号页装入 7 号页框中，所以物理地址为 0001 1111 1100 1010B = 1FCAH。3） 根据 Clock 算法，如果当前指针所指页框的使用位为 0，则替换该页；否则将使用位清零，并将指针指向下一个页框，继续查找。根据题设和示意图，将从 2 号页框开始，前 4 次查找页框号的顺序为 2→4→7→9，并将对应页框的使用位清零。在第 5 次查找中，指针指向 2 号页框，因 2 号页框的使用位为 0，故淘汰 2 号页框对应的 2 号页，把 5 号页装入 2 号页框中，并将对应使用位设置为 1，所以对应的物理地址为 0000 1011 1100 1010B = 0BCAH。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2010/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": [
      "/questions/2010/assets/q46-question-01.png"
    ]
  },
  {
    "id": "real-2009-23",
    "number": "2009 年 · 第 23 题",
    "title": "2009 年 408 操作系统 · 第 23 题",
    "prompt": "单处理机系统中，可并行的是（）。 Ⅰ. 进程与进程 Ⅱ. 处理机与设备 Ⅲ. 处理机与通道 Ⅳ. 设备与设备",
    "status": "真题",
    "tags": [
      "操作系统概念"
    ],
    "knowledgeIds": [
      "OS-KP-1-2"
    ],
    "year": 2009,
    "questionNumber": 23,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "Ⅰ、Ⅱ、Ⅲ"
      },
      {
        "label": "B",
        "text": "Ⅰ、Ⅱ、Ⅳ"
      },
      {
        "label": "C",
        "text": "Ⅰ、Ⅲ、Ⅳ"
      },
      {
        "label": "D",
        "text": "Ⅱ、Ⅲ、Ⅳ"
      }
    ],
    "answer": "D",
    "solution": "在单处理机系统（不包含多核的情况）中，同一时刻只能有一个进程占用处理机，因此进程之间不能并行执行。通道是独立于 CPU 的控制输入／输出的设备，两者可以并行，显然，设备与设备之间也是可以并行的。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#23",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-24",
    "number": "2009 年 · 第 24 题",
    "title": "2009 年 408 操作系统 · 第 24 题",
    "prompt": "下列进程调度算法中，综合考虑进程等待时间和执行时间的是（）。",
    "status": "真题",
    "tags": [
      "处理机调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-7-3",
      "OS-KP-7-4"
    ],
    "year": 2009,
    "questionNumber": 24,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "时间片轮转调度算法"
      },
      {
        "label": "B",
        "text": "短进程优先调度算法"
      },
      {
        "label": "C",
        "text": "先来先服务调度算法"
      },
      {
        "label": "D",
        "text": "高响应比优先调度算法"
      }
    ],
    "answer": "D",
    "solution": "在 最高响应比优先算法 中，选出响应比最高的进程投入执行，响应比 R 定义如下：响应比 R = (等待时间＋执行时间) / 执行时间。它综合考虑了每个进程的等待时间和执行时间，对于同时到达的长进程和短进程，短进程会优先执行，以提高系统吞吐量；而长进程的响应比可以随等待时间的增加而提高，不会产生进程无法调度的情况。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#24",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-25",
    "number": "2009 年 · 第 25 题",
    "title": "2009 年 408 操作系统 · 第 25 题",
    "prompt": "某计算机系统中有 8 台打印机，由 K 个进程竞争使用，每个进程最多需要 3 台打印机。该系统可能会发生死锁的 K 的最小值是（）。",
    "status": "真题",
    "tags": [
      "死锁概念"
    ],
    "knowledgeIds": [
      "OS-KP-9-3-1"
    ],
    "year": 2009,
    "questionNumber": 25,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "2"
      },
      {
        "label": "B",
        "text": "3"
      },
      {
        "label": "C",
        "text": "4"
      },
      {
        "label": "D",
        "text": "5"
      }
    ],
    "answer": "C",
    "solution": "这种题用到组合数学中鸽巢原理的思想。考虑最极端情况，因为每个进程最多需要 3 台打印机，如果每个进程已经占有了 2 台打印机，那么只要还有多的打印机，总能满足一个进程达到 3 台的条件，然后顺利执行，所以将 8 台打印机分给 K 个进程，每个进程有 2 台打印机，这 个情况就是极端情况，K 为 4。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#25",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-26",
    "number": "2009 年 · 第 26 题",
    "title": "2009 年 408 操作系统 · 第 26 题",
    "prompt": "分区分配内存管理方式的主要保护措施是（）。",
    "status": "真题",
    "tags": [
      "内存管理方式"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-2"
    ],
    "year": 2009,
    "questionNumber": 26,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "界地址保护"
      },
      {
        "label": "B",
        "text": "程序代码保护"
      },
      {
        "label": "C",
        "text": "数据保护"
      },
      {
        "label": "D",
        "text": "栈保护"
      }
    ],
    "answer": "A",
    "solution": "每个进程都拥有自己独立的 内存空间，若一个进程在运行时所产生的地址在其地址空间之外，则发生地址越界，因此需要进行界地址保护，即当程序要访问某个内存单元时，由硬件检查是否允许，如果允许则执行，否则产生地址越界中断。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#26",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-27",
    "number": "2009 年 · 第 27 题",
    "title": "2009 年 408 操作系统 · 第 27 题",
    "prompt": "一个分段存储管理系统中，地址长度为 32 位，其中段号占 8 位，则最大段长是（）。",
    "status": "真题",
    "tags": [
      "段式内存管理"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1"
    ],
    "year": 2009,
    "questionNumber": 27,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "28 字节"
      },
      {
        "label": "B",
        "text": "216 字节"
      },
      {
        "label": "C",
        "text": "224 字节"
      },
      {
        "label": "D",
        "text": "232 字节"
      }
    ],
    "answer": "C",
    "solution": "段式管理 的逻辑地址分为段号和位移量两部分，段内位移的最大值就是最大段长。地址长度为 32 位，段号占 8 位，则位移量占 32-8=24 位，故最大段长为 224 B。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#27",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-28",
    "number": "2009 年 · 第 28 题",
    "title": "2009 年 408 操作系统 · 第 28 题",
    "prompt": "下列文件物理结构中，适合随机访问且易于文件扩展的是（）。",
    "status": "真题",
    "tags": [
      "文件物理结构"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-3"
    ],
    "year": 2009,
    "questionNumber": 28,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "连续结构"
      },
      {
        "label": "B",
        "text": "索引结构"
      },
      {
        "label": "C",
        "text": "链式结构且磁盘块定长"
      },
      {
        "label": "D",
        "text": "链式结构且磁盘块变长"
      }
    ],
    "answer": "B",
    "solution": "文件的物理结构包括连续、链式、索引三种，其中链式结构不能 实现随机访问，连续结构的文件不易于扩展。因此随机访问且易于扩展是索引结构的特性。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#28",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-29",
    "number": "2009 年 · 第 29 题",
    "title": "2009 年 408 操作系统 · 第 29 题",
    "prompt": "假设磁头当前位于第 105 道，正在向磁道序号增加的方向移动。现有一个磁道访问请求序列为 35，45，12，68，110，180，170，195，采用 SCAN 调度（电梯调度）算法得到的磁道访问序列是（）。",
    "status": "真题",
    "tags": [
      "磁盘调度算法"
    ],
    "knowledgeIds": [
      "OS-KP-13-1-3"
    ],
    "year": 2009,
    "questionNumber": 29,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "110,170,180,195,68,45,35,12"
      },
      {
        "label": "B",
        "text": "110,68,45,35,12,170,180,195"
      },
      {
        "label": "C",
        "text": "110,170,180,195,12,35,45,68"
      },
      {
        "label": "D",
        "text": "12,35,45,68,110,170,180,195"
      }
    ],
    "answer": "A",
    "solution": "SCAN 算法类似电梯的工作原理。首先，当磁头从 105 道向序号增加的方向移动时，便会按照从小到大的顺序服务 所有大于 105 的磁道号 (110,170,180,195)；往回移动时又会按照从大到小的顺序进行服务 (68, 45,35, 12)。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#29",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-30",
    "number": "2009 年 · 第 30 题",
    "title": "2009 年 408 操作系统 · 第 30 题",
    "prompt": "文件系统中，文件访问控制信息存储的合理位置是（）。",
    "status": "真题",
    "tags": [
      "inode"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-2",
      "OS-KP-11-1-3"
    ],
    "year": 2009,
    "questionNumber": 30,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "文件控制块"
      },
      {
        "label": "B",
        "text": "文件分配表"
      },
      {
        "label": "C",
        "text": "用户口令表"
      },
      {
        "label": "D",
        "text": "系统注册表"
      }
    ],
    "answer": "A",
    "solution": "为了实现“按名存取”，在文件系统中为每个文件设置用于描述和控制文件的数据结构，称之为文件控制块 (FCB )。在文件控制块中，通常包含以下三类信息，即基本信息、存取控制信息及使用信息。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#30",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-31",
    "number": "2009 年 · 第 31 题",
    "title": "2009 年 408 操作系统 · 第 31 题",
    "prompt": "设文件 F1 的当前引用计数值为 1，先建立 F1 的符号链接（软链接）文件 F2，再建立 F1 的硬链接文件 F3，然后删除 F1。此时，F2 和 F3 的引用计数值分别是（）。",
    "status": "真题",
    "tags": [
      "文件链接"
    ],
    "knowledgeIds": [
      "OS-KP-11-1-6",
      "OS-KP-11-1-7"
    ],
    "year": 2009,
    "questionNumber": 31,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "0、1"
      },
      {
        "label": "B",
        "text": "1、1"
      },
      {
        "label": "C",
        "text": "1、2"
      },
      {
        "label": "D",
        "text": "2、1"
      }
    ],
    "answer": "B",
    "solution": "符号链接 是一个单独的文件，创建时它的引用计数值为 1；建立 硬链接 时，源文件引用计数值加 1。删除文件时，删除操作 对于符号链接是不可见的，这并不影响文件系统，当以后再通过符号链接访问时，发现文件不存在，直接删除符号链接；但对于硬链接则不可以直接删除，引用计数值减 1, 若值不为 0, 则不能删除此文件，因为还有其他硬链接指向此文件。当建立 F2 时，Fl 和 F2 的引用计数值都为 1。当再建立 F3 时，Fl 和 F3 的引用计数值就都变成了 2。当后来删除 Fl 时，F3 的引用计数值为 2-1 = 1, F2 的引用计数值 一直不变。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#31",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-32",
    "number": "2009 年 · 第 32 题",
    "title": "2009 年 408 操作系统 · 第 32 题",
    "prompt": "程序员利用系统调用打开 I/O 设备时，通常使用的设备标识是（）。",
    "status": "真题",
    "tags": [
      "设备分配和回收"
    ],
    "knowledgeIds": [
      "OS-KP-13-3"
    ],
    "year": 2009,
    "questionNumber": 32,
    "questionType": "choice",
    "section": "选择题",
    "options": [
      {
        "label": "A",
        "text": "逻辑设备名"
      },
      {
        "label": "B",
        "text": "物理设备名"
      },
      {
        "label": "C",
        "text": "主设备号"
      },
      {
        "label": "D",
        "text": "从设备号"
      }
    ],
    "answer": "A",
    "solution": "设备管理具有设备独立性的特点，操作系统以系统调用方式来请求某类设备时，使用的是 逻辑设备名。而在程序实际执行时，将逻辑设备名 转换为对应的 物理设备名。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#32",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-45",
    "number": "2009 年 · 第 45 题",
    "title": "2009 年 408 操作系统 · 第 45 题",
    "prompt": "三个进程 P1​ 、 P2​ 、 P3​ 互斥使用一个包含 N(N>0) 个单元的缓冲区。 P1​ 每次用 produce() 生成一个正整数并用 put() 送入缓冲区某一空单元中； P2​ 每次用 getodd() 从该缓冲区中取出一个奇数并用 countodd() 统计奇数个数； P3​ 每次用 geteven() 从该缓冲区中取出一个偶数并用 counteven() 统计偶数个数。请用信号量机制实现这三个进程的同步与互斥活动，并说明所定义信号量的含义。要求用伪代码描述。",
    "status": "真题",
    "tags": [
      "同步问题设计"
    ],
    "knowledgeIds": [
      "OS-KP-9-1"
    ],
    "year": 2009,
    "questionNumber": 45,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "互斥资源：缓冲区只能互斥访问，因此设置互斥信号量 mutex。同步问题： P1​ 、 P2​ 因为奇数的放置与取用而同步，设同步信号量 odd； P1​ 、 P3​ 因为偶数的放置与取用而同步，设置同步信号量 even； P1​ 、 P2​ 、 P3​ 因为共享缓冲区，设同步信号量 empty, 初值为 N。程序如下：semaphore mutex=1; semaphore odd=0, even=0; semaphore empty=N; P1() { while (true) { x = produce(); // 生成一个数 P(empty); // 判断缓冲区是否有空单元 P(mutex); // 缓冲区是否被占用 put(); V(mutex); // 释放缓冲区 if (x % 2 == 0) V(even); // 如果是偶数，向 P3 发出信号 else V(odd); // 如果是奇数，向 P2 发出信号 } } P2() { while (true) { P(odd); // 收到 P1 发来的信号，已产生一个奇数 P(mutex); // 缓冲区是否被占用 getodd(); V(mutex); // 释放缓冲区 V(empty); // 向 P1 发信号，多出一个空单元 countodd(); } } P3() { while (true) { P(even); // 收到 P1 发来的信号，已产生一个偶数 P(mutex); // 缓冲区是否被占用 geteven(); V(mutex); // 释放缓冲区 V(empty); // 向 P1 发信号，多出一个空单元 counteven(); } }",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#45",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  },
  {
    "id": "real-2009-46",
    "number": "2009 年 · 第 46 题",
    "title": "2009 年 408 操作系统 · 第 46 题",
    "prompt": "请求分页管理系统中，假设某进程的页表内容如下表所示： 页号页框（Page Frame）号有效位（存在位）0101H1102254H1 页面大小为 4KB，一次内存的访问时间是 100ns，一次快表（TLB）的访问时间是 10ns，处理一次缺页的平均时间 10⁸ ns（已含更新 TLB 和页表的时间），进程的驻留集大小固定为 2，采用最近最少使用置换算法 (LRU) 和局部淘汰策略。假设 ① TLB 初始为空； ② 地址转换时先访问 TLB，若 TLB 未命中，再访问页表（忽略访问页表之后的 TLB 更新时间）； ③ 有效位为 0 表示页面不在内存，产生缺页中断，缺页中断处理后，返回到产生缺页中断的指令处重新执行。 设有虚地址访问序列 2362H、1565H、25A5H，请问： (1) 依次访问上述三个虚地址，各需多少时间？给出计算过程。 (2) 基于上述访问序列，虚地址 1565H 的物理地址是多少？请说明理由。",
    "status": "真题",
    "tags": [
      "地址翻译",
      "虚拟页式管理",
      "TLB"
    ],
    "knowledgeIds": [
      "OS-KP-4-1-1",
      "OS-KP-4-1-2",
      "OS-KP-4-2",
      "OS-KP-4-1-5"
    ],
    "year": 2009,
    "questionNumber": 46,
    "questionType": "answer",
    "section": "解答题",
    "options": [],
    "answer": "",
    "solution": "1）根据页式管理的工作原理，应先考虑页面大小，以便将页号和页内位移分解出来。页面大小为 4KB, 即 2¹²B，则得到页内位移占虚地址的低 12 位，页号占剩余高位。可得三个虚地址的页号 P 如下（十六进制的一位数字转换成 4 位二进制，因此，十六进制的低三位正好为页内位移，最高位为页号）：2362H：P=2，访问快表 10ns，因初始为空，访问页表 100ns 得到页框号，合成物理地址后访问主存 100ns，共计 10ns+100ns+100ns=210ns。1565H：P=1，访问快表 10ns，落空，访问页表 100ns 落空，进行缺页中断处理 10⁸ns，访问快表 10ns，合成物理地址后访问主存 100ns，共计 10ns+100ns+10⁸ns+10ns+100ns=100000220ns.25A5H：P=2，访问快表，因第一次访问已将该页号放入快表，因此花费 10ns 便可合成物理地址，访问主存 100ns，共计 10ns+100ns=110ns。2）当访问虚地址 1565H 时，产生缺页中断，合法驻留集为 2，必须从页表中淘汰一个页面，根据题目的置换算法，应淘汰 0 号页面，因此 1565H 的对应页框号为 101H。由此可得 1565H 的物理地址为 101565H。",
    "sourceUrl": "https://www.csgraduates.com/study_methods/408quiz/2009/#46",
    "sourceNote": "按本地题库原始标签映射到教材小节。",
    "images": []
  }
];

export const knowledgeById = new Map(knowledgePoints.map((point) => [point.id, point]));

export const segmentById = new Map(sectionSegments.map((segment) => [segment.id, segment]));

export function segmentHref(segmentId: string | null) {
  const segment = segmentId ? segmentById.get(segmentId) : undefined;
  return segment ? `/sections/${segment.file}` : null;
}
