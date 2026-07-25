import fs from "node:fs";
import path from "node:path";

const projectRoot = path.resolve(import.meta.dirname, "..");
const questions = JSON.parse(fs.readFileSync(path.join(projectRoot, "app", "data", "questions.json"), "utf8"));
const outputFile = path.join(projectRoot, "app", "data", "analytics.json");
const years = Array.from({ length: 18 }, (_, index) => 2009 + index);
const recentYears = new Set([2022, 2023, 2024, 2025, 2026]);
const previousYears = new Set([2017, 2018, 2019, 2020, 2021]);

const taxonomy = {
  ds: [
    { id: "linear", name: "线性表", keywords: ["线性表", "顺序表", "链表", "数组", "特殊矩阵", "双向链表", "表头", "表尾", "kmp", "字符串", "串"] },
    { id: "stack-queue", name: "栈与队列", keywords: ["栈", "队列", "入栈", "出栈", "递归", "缓冲区"] },
    { id: "tree", name: "树与二叉树", keywords: ["二叉树", "二叉", "树", "森林", "哈夫曼", "b树", "b+树", "avl", "平衡", "堆的概念", "wpl"] },
    { id: "graph", name: "图", keywords: ["有向图", "无向图", "邻接", "拓扑", "关键路径", "最短路径", "最小生成树", "图的", "顶点", "边集"] },
    { id: "search", name: "查找", keywords: ["查找", "散列", "哈希", "平均查找长度", "二叉排序树", "二叉搜索树", "检索"] },
    { id: "sort", name: "排序", keywords: ["排序", "归并", "插入排序", "希尔", "快速排序", "外部排序", "败者树"] },
    { id: "algorithm", name: "算法与复杂度", keywords: ["复杂度", "算法", "时间复杂度", "空间复杂度"] },
  ],
  co: [
    { id: "data", name: "数据表示与运算", keywords: ["补码", "原码", "反码", "浮点", "ieee", "机器数", "溢出", "定点", "类型转换", "运算电路", "算术右移", "算术左移"] },
    { id: "memory", name: "存储系统", keywords: ["cache", "主存", "存储器", "dram", "sram", "tlb", "虚拟页", "虚拟存储", "页表", "缺页", "地址翻译", "局部性", "存储层次"] },
    { id: "instruction", name: "指令系统", keywords: ["指令", "寻址", "操作码", "汇编", "指令集", "isa", "机器代码", "risc", "cisc"] },
    { id: "cpu", name: "CPU 与数据通路", keywords: ["数据通路", "控制器", "控制信号", "寄存器", "cpu", "取指", "微程序", "alu"] },
    { id: "pipeline", name: "流水线", keywords: ["流水", "冒险", "cpi"] },
    { id: "io", name: "总线与 I/O", keywords: ["总线", "i/o", "io", "中断", "dma", "外设", "驱动程序", "输入/输出"] },
    { id: "architecture", name: "体系结构与性能", keywords: ["体系结构", "性能", "系统层次", "计算机系统", "字长", "吞吐", "时钟频率", "性能指标"] },
  ],
  os: [
    { id: "process", name: "进程、线程与调度", keywords: ["进程", "线程", "调度", "时间片", "就绪", "阻塞", "上下文", "处理机"] },
    { id: "sync", name: "同步、互斥与死锁", keywords: ["同步", "互斥", "信号量", "死锁", "银行家", "并发", "临界", "资源分配", "读者", "生产者"] },
    { id: "memory", name: "内存与虚拟存储", keywords: ["内存", "虚拟", "页表", "页面", "页框", "缺页", "地址翻译", "tlb", "段式", "抖动", "工作集", "访存"] },
    { id: "filesystem", name: "文件系统", keywords: ["文件", "目录", "inode", "索引节点", "fcb", "外存空间", "位图", "盘块", "文件物理结构"] },
    { id: "io", name: "I/O 与设备", keywords: ["i/o", "io", "设备", "驱动", "中断", "缓冲", "磁盘调度", "鼠标"] },
    { id: "basics", name: "内核与系统调用", keywords: ["内核", "用户态", "内核态", "系统调用", "操作系统概念", "特权", "内核模式"] },
  ],
  cn: [
    { id: "architecture", name: "体系结构与物理层", keywords: ["分层", "体系结构", "osi", "tcp/ip", "物理层", "信道", "带宽", "信噪", "传输介质", "调制", "奈奎斯特", "香农", "传输时延"] },
    { id: "link", name: "数据链路层", keywords: ["csma", "以太网", "交换机", "vlan", "mac", "数据链路", "数据帧", "无线局域网", "帧"] },
    { id: "network", name: "网络层与路由", keywords: ["ip", "子网", "路由", "ospf", "rip", "bgp", "nat", "arp", "icmp", "最长前缀", "网络号", "dhcp"] },
    { id: "transport", name: "传输层", keywords: ["tcp", "udp", "拥塞", "滑动窗口", "三次握手", "四次挥手", "端口", "传输层", "接收窗口", "mss"] },
    { id: "reliability", name: "可靠传输与接入", keywords: ["arq", "可靠传输", "确认帧", "重传", "信道利用率", "流量控制", "差错", "校验"] },
    { id: "application", name: "应用层", keywords: ["http", "dns", "ftp", "smtp", "电子邮件", "cookie", "应用层", "域名", "服务器", "客户端"] },
  ],
};

const tagAliases = new Map(Object.entries({
  "二叉树遍历": "二叉树的遍历",
  "cache概念": "Cache",
  "cache映射方式": "Cache 映射",
  "IEEE浮点数表示": "IEEE 754 浮点数",
  "中断IO": "中断 I/O",
  "IO软件层次": "I/O 软件层次",
  "虚拟页式管理": "页式虚拟存储",
  "ARQ协议": "ARQ 协议",
  "CSMA-CA": "CSMA/CA",
  "CSMA-CD": "CSMA/CD",
  "CSMA-CD限制条件": "CSMA/CD 限制条件",
}));

function normalizeTag(tag) {
  const trimmed = String(tag || "").trim();
  return tagAliases.get(trimmed) || trimmed;
}

function includesKeyword(text, keyword) {
  return text.includes(keyword.toLowerCase());
}

function scoreArea(question, area) {
  const tags = question.tags.join(" ").toLowerCase();
  const prompt = question.prompt.toLowerCase();
  const fallback = question.tags.length ? "" : question.solution.slice(0, 420).toLowerCase();
  return area.keywords.reduce((score, keyword) => {
    if (includesKeyword(tags, keyword)) score += 5;
    if (includesKeyword(prompt, keyword)) score += 2;
    if (fallback && includesKeyword(fallback, keyword)) score += 0.5;
    return score;
  }, 0);
}

function areasForQuestion(question, areas) {
  const ranked = areas
    .map((area) => ({ area, score: scoreArea(question, area) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.area.name.localeCompare(b.area.name, "zh-CN"));
  if (!ranked.length) return [areas.at(-1).id];
  const selected = [ranked[0].area.id];
  if (ranked[1] && ranked[1].score >= Math.max(2, ranked[0].score * 0.62)) selected.push(ranked[1].area.id);
  return selected;
}

function longestStreak(activeYears) {
  let best = 0;
  let current = 0;
  let previous = null;
  for (const year of activeYears) {
    current = previous === year - 1 ? current + 1 : 1;
    best = Math.max(best, current);
    previous = year;
  }
  return best;
}

function round(value, digits = 1) {
  return Number(value.toFixed(digits));
}

function buildSubject(subjectId) {
  const rows = questions.filter((question) => question.subject === subjectId);
  const areas = taxonomy[subjectId];
  const areaById = new Map(areas.map((area) => [area.id, area]));
  const enriched = rows.map((question) => ({ ...question, analyticsAreas: areasForQuestion(question, areas) }));
  const yearStats = years.map((year) => {
    const yearRows = enriched.filter((question) => question.year === year);
    return {
      year,
      questions: yearRows.length,
      choice: yearRows.filter((question) => question.questionType === "choice").length,
      answer: yearRows.filter((question) => question.questionType === "answer").length,
      tagged: yearRows.filter((question) => question.tags.length > 0).length,
      areas: Object.fromEntries(areas.map((area) => [area.id, yearRows.filter((question) => question.analyticsAreas.includes(area.id)).length])),
    };
  });

  const areaStats = areas.map((area) => {
    const matching = enriched.filter((question) => question.analyticsAreas.includes(area.id));
    const activeYears = years.filter((year) => matching.some((question) => question.year === year));
    const recentCount = matching.filter((question) => recentYears.has(question.year)).length;
    const previousCount = matching.filter((question) => previousYears.has(question.year)).length;
    const recentTotal = enriched.filter((question) => recentYears.has(question.year)).length;
    const previousTotal = enriched.filter((question) => previousYears.has(question.year)).length;
    const recentRate = recentCount / recentTotal * 100;
    const previousRate = previousCount / previousTotal * 100;
    const tags = new Map();
    for (const question of matching) {
      for (const rawTag of question.tags) {
        const normalized = normalizeTag(rawTag);
        if (!scoreArea({ ...question, tags: [rawTag] }, area)) continue;
        tags.set(normalized, (tags.get(normalized) || 0) + 1);
      }
    }
    return {
      id: area.id,
      name: area.name,
      count: matching.length,
      share: round(matching.length / rows.length * 100),
      answerCount: matching.filter((question) => question.questionType === "answer").length,
      yearsCount: activeYears.length,
      lastYear: activeYears.at(-1) || null,
      longestStreak: longestStreak(activeYears),
      recentCount,
      previousCount,
      recentRate: round(recentRate),
      previousRate: round(previousRate),
      momentum: round(recentRate - previousRate),
      yearSeries: yearStats.map((year) => year.areas[area.id]),
      topTags: [...tags].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN")).slice(0, 5).map(([name, count]) => ({ name, count })),
    };
  });

  const tagStats = new Map();
  for (const question of enriched) {
    for (const rawTag of question.tags) {
      const normalized = normalizeTag(rawTag);
      const matchingArea = areas
        .map((area) => ({ area, score: scoreArea({ ...question, tags: [rawTag] }, area) }))
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score || Number(question.analyticsAreas.includes(b.area.id)) - Number(question.analyticsAreas.includes(a.area.id)) || a.area.name.localeCompare(b.area.name, "zh-CN"))[0]?.area;
      if (!matchingArea) continue;
      const current = tagStats.get(normalized) || { name: normalized, count: 0, answerCount: 0, years: new Set(), recentCount: 0, questionIds: [], areaCounts: new Map(), series: Object.fromEntries(years.map((year) => [year, 0])) };
      current.count += 1;
      current.answerCount += question.questionType === "answer" ? 1 : 0;
      current.years.add(question.year);
      current.recentCount += recentYears.has(question.year) ? 1 : 0;
      if (!current.questionIds.includes(question.id)) current.questionIds.push(question.id);
      current.areaCounts.set(matchingArea.id, (current.areaCounts.get(matchingArea.id) || 0) + 1);
      current.series[question.year] += 1;
      tagStats.set(normalized, current);
    }
  }

  const fineTags = [...tagStats.values()]
    .sort((a, b) => b.count - a.count || b.years.size - a.years.size || a.name.localeCompare(b.name, "zh-CN"))
    .map((tag) => ({
      name: tag.name,
      areaId: [...tag.areaCounts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0],
      count: tag.count,
      answerCount: tag.answerCount,
      yearsCount: tag.years.size,
      lastYear: Math.max(...tag.years),
      recentCount: tag.recentCount,
      longestStreak: longestStreak([...tag.years].sort()),
      yearSeries: years.map((year) => tag.series[year]),
      questionIds: tag.questionIds,
    }));
  const topTags = fineTags.slice(0, 20);

  const relationStats = new Map();
  for (const question of enriched) {
    if (question.analyticsAreas.length < 2) continue;
    const pair = [...question.analyticsAreas].sort();
    const key = pair.join("::");
    const current = relationStats.get(key) || { source: pair[0], target: pair[1], count: 0, years: new Set(), answerCount: 0 };
    current.count += 1;
    current.answerCount += question.questionType === "answer" ? 1 : 0;
    current.years.add(question.year);
    relationStats.set(key, current);
  }

  const relations = [...relationStats.values()]
    .sort((a, b) => b.count - a.count || b.years.size - a.years.size)
    .slice(0, 10)
    .map((relation) => ({
      source: relation.source,
      sourceName: areaById.get(relation.source).name,
      target: relation.target,
      targetName: areaById.get(relation.target).name,
      count: relation.count,
      yearsCount: relation.years.size,
      lastYear: Math.max(...relation.years),
      answerCount: relation.answerCount,
    }));

  const unmatched = enriched.filter((question) => !question.analyticsAreas.length);
  if (unmatched.length) throw new Error(`${subjectId} 存在未分类题目：${unmatched.map((question) => question.id).join(", ")}`);

  return {
    totals: {
      questions: rows.length,
      years: years.length,
      choice: rows.filter((question) => question.questionType === "choice").length,
      answer: rows.filter((question) => question.questionType === "answer").length,
      uniqueTags: tagStats.size,
      taggedQuestions: rows.filter((question) => question.tags.length).length,
      inferredQuestions: rows.filter((question) => !question.tags.length).length,
      averagePerYear: round(rows.length / years.length),
    },
    yearStats,
    areas: areaStats.sort((a, b) => b.count - a.count),
    fineTags,
    topTags,
    relations,
  };
}

const analytics = {
  range: { from: years[0], to: years.at(-1), years },
  methodology: {
    areaAssignment: "按科目独立词表，综合原始标签与题干关键词，每题最多归入两个核心模块。",
    recentWindow: "近五年为 2022—2026，对照窗口为 2017—2021。",
    fineTagCoverage: "细粒度原始标签覆盖 2009—2025；2026 通过题干关键词进入模块级趋势。",
  },
  subjects: Object.fromEntries(Object.keys(taxonomy).map((subjectId) => [subjectId, buildSubject(subjectId)])),
};

for (const [subjectId, subject] of Object.entries(analytics.subjects)) {
  if (subject.yearStats.reduce((sum, year) => sum + year.questions, 0) !== subject.totals.questions) {
    throw new Error(`${subjectId} 年度题量汇总不一致`);
  }
  if (subject.areas.some((area) => area.yearSeries.length !== years.length)) {
    throw new Error(`${subjectId} 时间序列长度异常`);
  }
  if (subject.fineTags.length !== subject.totals.uniqueTags || subject.fineTags.some((tag) => tag.yearSeries.length !== years.length)) {
    throw new Error(`${subjectId} 细分考点统计异常`);
  }
}

fs.writeFileSync(outputFile, `${JSON.stringify(analytics, null, 2)}\n`);
console.log(`已生成四科分析数据：${outputFile}`);
for (const [subjectId, subject] of Object.entries(analytics.subjects)) {
  console.log(subjectId, `${subject.totals.questions} 题`, `${subject.totals.uniqueTags} 个有效标签`, `${subject.areas.length} 个模块`, `${subject.relations.length} 组联合考察`);
}
