export type SubjectId = "ds" | "co" | "os" | "cn";

export type SubjectMeta = {
  id: SubjectId;
  index: string;
  shortName: string;
  name: string;
  english: string;
  description: string;
  topics: string[];
  accent: string;
};

export const subjectCatalog: SubjectMeta[] = [
  {
    id: "ds",
    index: "01",
    shortName: "数据结构",
    name: "数据结构",
    english: "Data Structures",
    description: "把算法过程画出来，再落到复杂度。",
    topics: ["线性表", "树与图", "查找排序"],
    accent: "violet",
  },
  {
    id: "co",
    index: "02",
    shortName: "组成原理",
    name: "计算机组成原理",
    english: "Computer Organization",
    description: "沿着数据通路，理解每一拍发生什么。",
    topics: ["数据表示", "存储系统", "指令系统"],
    accent: "blue",
  },
  {
    id: "os",
    index: "03",
    shortName: "操作系统",
    name: "操作系统",
    english: "Operating Systems",
    description: "从资源约束出发，串起机制与策略。",
    topics: ["进程管理", "内存管理", "文件与 I/O"],
    accent: "green",
  },
  {
    id: "cn",
    index: "04",
    shortName: "计算机网络",
    name: "计算机网络",
    english: "Computer Networks",
    description: "分层追踪一次完整的数据传输。",
    topics: ["网络体系", "传输层", "网络层"],
    accent: "orange",
  },
];

export const subjectById = new Map(subjectCatalog.map((subject) => [subject.id, subject]));
