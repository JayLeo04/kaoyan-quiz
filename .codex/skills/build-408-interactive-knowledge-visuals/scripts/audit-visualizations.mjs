#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

const project = path.resolve(valueAfter("--project") || process.cwd());
const sourceRoot = path.resolve(valueAfter("--source-root") || path.join(project, "..", "local", "kaoyanzahuopu"));

const subjects = [
  { code: "ds", dir: "data_structure" },
  { code: "co", dir: "constitution_principle" },
  { code: "os", dir: "operating_system" },
  { code: "cn", dir: "computer_network" },
];
const selectedSubject = valueAfter("--subject");
if (selectedSubject && !subjects.some((subject) => subject.code === selectedSubject)) {
  throw new Error("--subject 仅支持 ds、co、os、cn 之一");
}
const subjectsToAudit = selectedSubject ? subjects.filter((subject) => subject.code === selectedSubject) : subjects;

const supportedTypes = new Set([
  "growth-curves",
  "algorithm-trace",
  "memory-scale",
  "process-flow",
  "state-machine",
  "timeline",
  "comparison",
  "address-fields",
  "banker-simulator",
  "resource-allocation-graph",
  "semaphore-lab",
  "scheduler-queue",
  "concurrency-lab",
]);

const forbiddenKeys = /^(html|script|style|src|url|href|onclick|onchange|oninput)$/i;
const formulaKeys = /(formula|latex)$/i;
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const markerPattern = /<!--\s*knowledge-visual:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->/g;

const issues = [];
const warnings = [];
const specsById = new Map();
const markersById = new Map();
let manifestCount = 0;
let pageCount = 0;

function issue(file, message) {
  issues.push(`${path.relative(project, file)}: ${message}`);
}

function walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdown(full));
    if (entry.isFile() && entry.name === "index.md") files.push(full);
  }
  return files;
}

function collectConfigFacts(value, file, sourceLatex, trail = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      if (typeof item === "string" && /https?:\/\//i.test(item)) issue(file, `配置字段 ${[...trail, String(index)].join(".")} 含外部 URL`);
      collectConfigFacts(item, file, sourceLatex, [...trail, String(index)]);
    });
    return;
  }
  if (!value || typeof value !== "object") return;

  for (const [key, child] of Object.entries(value)) {
    const nextTrail = [...trail, key];
    if (forbiddenKeys.test(key)) issue(file, `配置字段 ${nextTrail.join(".")} 不允许出现任意 HTML、脚本或外部资源`);
    if (/^on[A-Z]/.test(key)) issue(file, `配置字段 ${nextTrail.join(".")} 疑似事件处理器`);
    if (key === "autoPlay" && child === true) issue(file, "不得默认自动播放动画");
    if (formulaKeys.test(key) && typeof child === "string" && !sourceLatex.includes(child)) {
      issue(file, `公式 ${JSON.stringify(child)} 未原样列入 sourceLatex`);
    }
    if (typeof child === "string" && /https?:\/\//i.test(child)) {
      issue(file, `配置字段 ${nextTrail.join(".")} 含外部 URL`);
    }
    collectConfigFacts(child, file, sourceLatex, nextTrail);
  }
}

function validateTypeConfig(spec, file) {
  const config = spec.config || {};
  const fail = (message) => issue(file, `${spec.id}: ${message}`);
  const list = (key) => Array.isArray(config[key]) ? config[key] : [];

  if (spec.type === "growth-curves") {
    if (![config.min, config.max, config.initial].every(Number.isFinite)) fail("min、max、initial 必须为数字");
    if (Number.isFinite(config.min) && Number.isFinite(config.max) && config.min >= config.max) fail("min 必须小于 max");
    const allowedKinds = new Set(["constant", "log2", "linear", "n-log2-n", "square", "cube", "pow2", "factorial"]);
    if (!list("series").length) fail("series 不能为空");
    for (const series of list("series")) {
      if (!series?.id || !series?.label || !series?.formula) fail("每条 series 都需要 id、label、formula");
      if (!allowedKinds.has(series?.kind)) fail(`不支持的增长 kind：${series?.kind}`);
    }
  }

  if (spec.type === "algorithm-trace") {
    const items = list("items");
    const steps = list("steps");
    const lanes = list("lanes");
    if (!steps.length || (!lanes.length && !items.length)) fail("普通轨迹需要 items 与 steps，多泳道轨迹至少需要 steps");
    if (config.layout !== undefined && config.layout !== "loading-trace") fail("layout 配置无效");
    if (lanes.length) {
      const laneIds = new Set(lanes.map((lane) => lane?.id).filter(Boolean));
      if (laneIds.size < 2 || laneIds.size !== lanes.length) fail("lanes 至少需要两个不重复 id");
      for (const step of steps) {
        if (!step?.state || typeof step.state !== "object" || [...laneIds].some((id) => !Array.isArray(step.state[id]))) fail("多泳道步骤必须为每个 lane 提供数组状态");
      }
      if (config.layout === "loading-trace" && (lanes.some((lane) => !lane?.label) || steps.some((step) => !step?.label || !step?.note || !Array.isArray(step?.activeLanes) || step.activeLanes.some((id) => !laneIds.has(id))))) fail("装入轨迹的泳道或步骤配置无效");
    } else {
      for (const step of steps) {
        const active = Array.isArray(step?.active) ? step.active : [];
        const range = Array.isArray(step?.range) ? step.range : [];
        if (active.some((index) => !Number.isInteger(index) || index < 0 || index >= items.length)) fail("active 含越界下标");
        if (range.length !== 2 || range.some((index) => !Number.isInteger(index) || index < 0 || index >= items.length) || range[0] > range[1]) fail("range 必须是合法闭区间");
      }
    }
  }

  if (spec.type === "memory-scale") {
    if (!list("cases").length) fail("cases 不能为空");
    const allowedKinds = new Set(["constant", "log2", "linear", "n-log2-n", "square", "cube"]);
    for (const item of list("cases")) {
      if (!item?.label || !item?.formula || (!allowedKinds.has(item?.kind) && !(Number.isFinite(item?.units) && item.units > 0))) fail("每个 case 都需要 label、formula，以及合法 kind 或正数兼容 units");
    }
    if (list("cases").some((item) => item?.kind) && ![config.min, config.max, config.initial].every(Number.isFinite)) fail("动态 memory-scale 需要 min、max、initial");
  }

  if (spec.type === "process-flow") {
    const steps = list("steps");
    const ids = new Set(steps.map((step) => step?.id).filter(Boolean));
    if (ids.size < 2) fail("steps 至少需要两个不同 id");
    if (ids.size !== steps.length) fail("每个 step 必须有全站内该图唯一的 id");
    for (const connection of list("connections")) {
      if (!Array.isArray(connection) || connection.length !== 2 || !ids.has(connection[0]) || !ids.has(connection[1])) {
        fail(`连线 ${JSON.stringify(connection)} 的端点不存在`);
      }
    }
    if (config.layout !== undefined && !["computer-timeline", "privilege-switch", "process-family"].includes(config.layout)) fail("layout 配置无效");
    if (config.layout === "computer-timeline") {
      const components = list("components");
      const componentIds = new Set(components.map((component) => component?.id).filter(Boolean));
      if (componentIds.size < 4 || componentIds.size !== components.length || components.some((component) => !component?.label)) fail("计算机示意组件配置无效");
      if (steps.some((step) => !step?.label || !step?.time || !step?.detail || !Array.isArray(step?.components) || !step.components.length || step.components.some((componentId) => !componentIds.has(componentId)))) fail("计算机引导步骤配置无效");
    }
    if (config.layout === "privilege-switch") {
      const actors = list("actors");
      const registers = list("registers");
      const pcbs = list("pcbs");
      const actorIds = new Set(actors.map((actor) => actor?.id).filter(Boolean));
      const registerIds = new Set(registers.map((item) => item?.id).filter(Boolean));
      const pcbIds = new Set(pcbs.map((pcb) => pcb?.id).filter(Boolean));
      if (!config.caveat || actorIds.size < 3 || actorIds.size !== actors.length || registerIds.size < 4 || registerIds.size !== registers.length || pcbIds.size < 2 || pcbIds.size !== pcbs.length || actors.some((actor) => !actor?.label) || registers.some((item) => !item?.label) || pcbs.some((pcb) => !pcb?.label)) fail("特权切换的参与方、寄存器或 PCB 配置无效");
      if (steps.some((step) => !step?.label || !step?.note || !["user", "kernel"].includes(step?.mode) || !step?.cpu || typeof step.cpu !== "object" || [...registerIds].some((id) => !(id in step.cpu)) || !step?.pcbs || typeof step.pcbs !== "object" || [...pcbIds].some((id) => !step.pcbs[id] || typeof step.pcbs[id] !== "object") || !Array.isArray(step?.activeActors) || step.activeActors.some((id) => !actorIds.has(id)) || !Array.isArray(step?.activePcbs) || step.activePcbs.some((id) => !pcbIds.has(id)))) fail("特权切换步骤必须完整描述 CPU、PCB 与参与方状态");
    }
    if (config.layout === "process-family") {
      const members = list("members");
      const memberIds = new Set(members.map((member) => member?.id).filter(Boolean));
      if (!config.intro || memberIds.size !== 2 || !memberIds.has("parent") || !memberIds.has("child") || members.some((member) => !member?.label)) fail("父子进程图需要父、子两个参与方及 intro");
      if (steps.some((step) => !step?.label || !step?.note || !step?.rule || !step?.parent || typeof step.parent !== "object" || !step?.child || typeof step.child !== "object" || !step.parent.state || !step.child.state || !step?.returns || typeof step.returns !== "object" || !("parent" in step.returns) || !("child" in step.returns))) fail("父子进程图的每个场景必须完整描述父、子状态与返回值");
    }
  }

  if (spec.type === "state-machine") {
    const ids = new Set(list("states").map((state) => state?.id).filter(Boolean));
    if (ids.size < 2) fail("states 至少需要两个不同 id");
    if (config.initialState !== undefined && !ids.has(config.initialState)) fail("initialState 不属于 states");
    for (const transition of list("transitions")) {
      if (!ids.has(transition?.from) || !ids.has(transition?.to) || !transition?.event) {
        fail(`状态转换 ${JSON.stringify(transition)} 缺少有效端点或事件`);
      }
    }
  }

  if (spec.type === "timeline") {
    const lanes = list("lanes");
    const laneIds = new Set(lanes.map((lane) => lane?.id).filter(Boolean));
    if (!lanes.length || !list("events").length) fail("lanes 与 events 不能为空");
    if (laneIds.size !== lanes.length) fail("每个 lane 必须有唯一 id");
    if (!config.unit && !config.unitLabel) fail("timeline 必须说明 unit 或 unitLabel");
    if (config.startAt !== undefined && !Number.isFinite(config.startAt)) fail("startAt 必须为数字");
    for (const event of list("events")) {
      if (!Number.isFinite(event?.start) || !Number.isFinite(event?.duration) || event.duration <= 0) {
        fail(`时间事件 ${JSON.stringify(event)} 需要合法 start 与正 duration`);
      }
      if (!laneIds.has(event?.lane ?? event?.laneId)) fail(`时间事件 ${JSON.stringify(event)} 指向不存在的 lane`);
    }
  }

  if (spec.type === "comparison") {
    if (config.layout !== undefined && config.layout !== "layered-stacks") fail("layout 配置无效");
    if (config.layout === "layered-stacks") {
      const columns = list("columns");
      const stacks = list("stacks");
      const columnIds = new Set(columns.map((column) => column?.id).filter(Boolean));
      const stackIds = new Set(stacks.map((stack) => stack?.id).filter(Boolean));
      if (columnIds.size < 2 || columnIds.size !== columns.length || stackIds.size !== columns.length || [...columnIds].some((id) => !stackIds.has(id)) || columns.some((column) => !column?.label) || stacks.some((stack) => !stack?.summary || !Array.isArray(stack?.layers) || stack.layers.length < 2 || stack.layers.some((layer) => !layer?.label))) fail("分层图需要与列一一对应、带说明的两层以上 stack");
    } else if (list("columns").length < 2 || !list("rows").length) fail("columns 至少两列且 rows 不能为空");
  }

  if (spec.type === "address-fields") {
    if (!Number.isInteger(config.totalBits) || config.totalBits <= 0) fail("totalBits 必须为正整数");
    const fields = list("fields");
    const total = fields.reduce((sum, field) => sum + (Number.isInteger(field?.bits) ? field.bits : 0), 0);
    if (!fields.length || fields.some((field) => !field?.label || !Number.isInteger(field?.bits) || field.bits <= 0)) {
      fail("每个 field 都需要 label 和正整数 bits");
    }
    if (Number.isInteger(config.totalBits) && total !== config.totalBits) fail(`字段位数之和 ${total} 不等于 totalBits ${config.totalBits}`);
  }

  if (spec.type === "banker-simulator") {
    const resources = list("resources");
    const processes = list("processes");
    const maximum = list("max");
    const allocation = list("allocation");
    const validVector = (vector, length) => Array.isArray(vector) && vector.length === length && vector.every((item) => Number.isInteger(item) && item >= 0);
    const valid = resources.length > 0 && processes.length > 1 && resources.every((item) => typeof item === "string") && processes.every((item) => typeof item === "string") && validVector(config.available, resources.length) && maximum.length === processes.length && allocation.length === processes.length && maximum.every((row) => validVector(row, resources.length)) && allocation.every((row) => validVector(row, resources.length));
    if (!valid) fail("resources、processes、available、max、allocation 必须构成合法的非负整数矩阵");
    if (valid && maximum.some((row, rowIndex) => row.some((value, columnIndex) => value < allocation[rowIndex][columnIndex]))) fail("Allocation 不能大于对应的 Max");
  }

  if (spec.type === "resource-allocation-graph") {
    const cases = list("cases");
    if (cases.length < 2) fail("至少需要两个对照例子");
    for (const item of cases) {
      const nodes = Array.isArray(item?.nodes) ? item.nodes : [];
      const edges = Array.isArray(item?.edges) ? item.edges : [];
      const ids = new Set(nodes.map((node) => node?.id).filter(Boolean));
      if (!item?.id || !item?.label || !item?.conclusion || ids.size < 4 || ids.size !== nodes.length || nodes.some((node) => !node?.label || !["process", "resource"].includes(node?.kind))) fail("每个例子需要带类型的唯一节点及 conclusion");
      if (!edges.length || edges.some((edge) => !ids.has(edge?.from) || !ids.has(edge?.to) || !["request", "allocation"].includes(edge?.kind))) fail("边必须连接已有节点且标记 request 或 allocation");
    }
  }

  if (spec.type === "semaphore-lab") {
    const mode = config.mode;
    const code = list("code");
    const steps = list("steps");
    const codeById = new Map(code.map((pane) => [pane?.id, pane]));
    const validCode = code.length > 0 && code.every((pane) => pane?.id && pane?.label && Array.isArray(pane?.lines) && pane.lines.length && pane.lines.every((line) => typeof line === "string"));
    const validActiveCode = (activeCode) => Array.isArray(activeCode) && activeCode.every((entry) => {
      const pane = codeById.get(entry?.pane);
      return pane && Array.isArray(pane.lines) && Array.isArray(entry.lines) && entry.lines.every((line) => Number.isInteger(line) && line >= 0 && line < pane.lines.length);
    });
    if (!["bounded-buffer", "dining-philosophers"].includes(mode) || !validCode || !steps.length || steps.some((step) => !step?.label || !step?.note || !validActiveCode(step?.activeCode))) fail("mode、code 与 steps 配置无效");
    if (mode === "bounded-buffer") {
      const counters = list("counters");
      const ids = new Set(counters.map((counter) => counter?.id).filter(Boolean));
      if (!Number.isInteger(config.capacity) || config.capacity < 1 || ids.size < 2 || ids.size !== counters.length || counters.some((counter) => !counter?.label) || steps.some((step) => !Array.isArray(step.buffer) || step.buffer.length !== config.capacity || !step.counters || [...ids].some((id) => !Number.isInteger(step.counters[id]) || step.counters[id] < 0))) fail("有界缓冲区需要完整的槽位和信号量状态");
    }
    if (mode === "dining-philosophers") {
      const philosophers = list("philosophers");
      const forks = list("forks");
      const ids = new Set(philosophers);
      if (philosophers.length < 3 || forks.length !== philosophers.length || ids.size !== philosophers.length || philosophers.some((item) => typeof item !== "string") || forks.some((item) => typeof item !== "string") || steps.some((step) => !Array.isArray(step.forkOwners) || step.forkOwners.length !== forks.length || !Array.isArray(step.states) || step.states.length !== philosophers.length || step.forkOwners.some((owner) => owner && !ids.has(owner)))) fail("哲学家示例需要等长的叉子归属与状态数组");
    }
  }

  if (spec.type === "scheduler-queue") {
    const queues = list("queues");
    const jobs = list("jobs");
    const steps = list("steps");
    const queueIds = new Set(queues.map((queue) => queue?.id).filter(Boolean));
    const jobIds = new Set(jobs.map((job) => job?.id).filter(Boolean));
    const queueStateIsValid = (state) => state && typeof state === "object" && [...queueIds].every((id) => Array.isArray(state[id]) && state[id].every((jobId) => jobIds.has(jobId)));
    if (!["round-robin", "mlfq"].includes(config.mode) || queueIds.size < 1 || queueIds.size !== queues.length || jobIds.size < 2 || jobIds.size !== jobs.length || queues.some((queue) => !queue?.label) || jobs.some((job) => !job?.label || !Number.isFinite(job?.arrival) || !Number.isFinite(job?.service) || job.service <= 0) || steps.length < 4 || steps.some((step) => !step?.label || !step?.note || !jobIds.has(step?.cpu) || !Number.isFinite(step?.duration) || step.duration <= 0 || !queueStateIsValid(step?.queues) || (step?.arrivals && (!Array.isArray(step.arrivals) || step.arrivals.some((jobId) => !jobIds.has(jobId))) || (step?.completed && (!Array.isArray(step.completed) || step.completed.some((jobId) => !jobIds.has(jobId))))))) fail("队列、任务或逐步调度状态无效");
  }

  if (spec.type === "concurrency-lab") {
    const scenarios = list("scenarios");
    const scenarioIds = new Set(scenarios.map((scenario) => scenario?.id).filter(Boolean));
    const codeIsValid = (code) => Array.isArray(code) && code.length && code.every((pane) => pane?.id && pane?.label && Array.isArray(pane.lines) && pane.lines.length && pane.lines.every((line) => typeof line === "string"));
    if (!scenarios.length || scenarioIds.size !== scenarios.length) fail("需要至少一个 id 唯一的并发场景");
    for (const scenario of scenarios) {
      const actors = Array.isArray(scenario?.actors) ? scenario.actors : [];
      const shared = Array.isArray(scenario?.shared) ? scenario.shared : [];
      const queues = Array.isArray(scenario?.queues) ? scenario.queues : [];
      const steps = Array.isArray(scenario?.steps) ? scenario.steps : [];
      const actorIds = new Set(actors.map((actor) => actor?.id).filter(Boolean));
      const sharedIds = new Set(shared.map((item) => item?.id).filter(Boolean));
      const queueIds = new Set(queues.map((queue) => queue?.id).filter(Boolean));
      const panes = new Map((Array.isArray(scenario?.code) ? scenario.code : []).map((pane) => [pane?.id, pane]));
      const activeCodeIsValid = (activeCode) => Array.isArray(activeCode) && activeCode.every((entry) => {
        const pane = panes.get(entry?.pane);
        return pane && Array.isArray(entry?.lines) && entry.lines.every((line) => Number.isInteger(line) && line >= 0 && line < pane.lines.length);
      });
      const completeState = (step) => step?.actors && typeof step.actors === "object" && [...actorIds].every((id) => id in step.actors) && step?.shared && typeof step.shared === "object" && [...sharedIds].every((id) => id in step.shared) && (!queueIds.size || (step?.queues && typeof step.queues === "object" && [...queueIds].every((id) => Array.isArray(step.queues[id]) && step.queues[id].every((actorId) => actorIds.has(actorId)))));
      if (!scenario?.id || !scenario?.label || !scenario?.summary || actorIds.size < 2 || actorIds.size !== actors.length || sharedIds.size < 1 || sharedIds.size !== shared.length || queueIds.size !== queues.length || actors.some((actor) => !actor?.label) || shared.some((item) => !item?.label) || queues.some((queue) => !queue?.label) || !codeIsValid(scenario?.code) || steps.length < 2 || steps.some((step) => !step?.label || !step?.note || !actorIds.has(step?.actor) || !completeState(step) || !activeCodeIsValid(step?.activeCode))) fail(`场景 ${scenario?.id || "?"} 的参与方、共享状态、代码或步骤无效`);
    }
  }
}

function collectDelimitedLatex(markdown) {
  const withoutCode = markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]*`/g, "");
  const values = new Set();
  const pattern = /\$\$([\s\S]*?)\$\$|\\{1,2}\(([\s\S]*?)\\{1,2}\)/g;
  for (const match of withoutCode.matchAll(pattern)) values.add((match[1] ?? match[2] ?? "").trim());
  return values;
}

for (const subject of subjectsToAudit) {
  const subjectRoot = path.join(sourceRoot, subject.dir);
  const markdownFiles = walkMarkdown(subjectRoot);
  pageCount += markdownFiles.length;

  for (const file of markdownFiles) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(markerPattern)) {
      const id = match[1];
      const entries = markersById.get(id) || [];
      entries.push(file);
      markersById.set(id, entries);
    }
  }

  const manifestPath = path.join(subjectRoot, "_visualizations.json");
  if (!fs.existsSync(manifestPath)) {
    warnings.push(`${path.relative(project, manifestPath)}: 尚未建立可视化清单`);
    continue;
  }

  manifestCount += 1;
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (error) {
    issue(manifestPath, `JSON 解析失败：${error.message}`);
    continue;
  }

  if (manifest.version !== 1) issue(manifestPath, "version 必须为 1");
  if (manifest.subject !== subject.code) issue(manifestPath, `subject 必须为 ${subject.code}`);
  if (!Array.isArray(manifest.visualizations)) {
    issue(manifestPath, "visualizations 必须为数组");
    continue;
  }

  for (const [index, spec] of manifest.visualizations.entries()) {
    const label = `visualizations[${index}]`;
    if (!spec || typeof spec !== "object" || Array.isArray(spec)) {
      issue(manifestPath, `${label} 必须为对象`);
      continue;
    }

    for (const key of ["id", "route", "type", "title", "summary", "config"]) {
      if (!(key in spec)) issue(manifestPath, `${label} 缺少 ${key}`);
    }

    const id = spec.id;
    if (typeof id !== "string" || !idPattern.test(id)) {
      issue(manifestPath, `${label}.id 只能含小写字母、数字和连字符`);
      continue;
    }
    if (!id.startsWith(`${subject.code}-`)) issue(manifestPath, `${id} 必须以 ${subject.code}- 开头`);
    if (specsById.has(id)) issue(manifestPath, `${id} 与其他清单重复`);

    const route = typeof spec.route === "string" ? spec.route : "";
    if (path.isAbsolute(route) || route.split(/[\\/]/).includes("..")) issue(manifestPath, `${id} 的 route 不安全`);
    if (!supportedTypes.has(spec.type)) issue(manifestPath, `${id} 使用了未支持的 type：${spec.type}`);
    if (typeof spec.title !== "string" || !spec.title.trim()) issue(manifestPath, `${id} 缺少有效 title`);
    if (typeof spec.summary !== "string" || !spec.summary.trim()) issue(manifestPath, `${id} 缺少有效 summary`);
    if (!spec.config || typeof spec.config !== "object" || Array.isArray(spec.config)) issue(manifestPath, `${id}.config 必须为对象`);

    const sourceLatex = spec.sourceLatex === undefined ? [] : spec.sourceLatex;
    if (!Array.isArray(sourceLatex) || sourceLatex.some((item) => typeof item !== "string")) {
      issue(manifestPath, `${id}.sourceLatex 必须为字符串数组`);
    }
    collectConfigFacts(spec.config, manifestPath, Array.isArray(sourceLatex) ? sourceLatex : []);
    validateTypeConfig(spec, manifestPath);

    const pagePath = path.join(subjectRoot, route, "index.md");
    if (!fs.existsSync(pagePath)) issue(manifestPath, `${id} 指向不存在的页面 ${route || "."}`);
    if (fs.existsSync(pagePath) && Array.isArray(sourceLatex)) {
      const markdownSource = fs.readFileSync(pagePath, "utf8");
      const delimitedLatex = collectDelimitedLatex(markdownSource);
      for (const latex of sourceLatex) {
        if (!delimitedLatex.has(latex.trim())) issue(manifestPath, `${id} 的公式 ${JSON.stringify(latex)} 未作为完整的定界 LaTeX 保留在目标 Markdown 中`);
      }
      const markerIndex = markdownSource.indexOf(`<!-- knowledge-visual:${id} -->`);
      const neighborhood = markerIndex >= 0 ? markdownSource.slice(Math.max(0, markerIndex - 280), markerIndex + 280) : "";
      if (/!\[[^\]]*\]\([^)]+\)/.test(neighborhood)) warnings.push(`${path.relative(project, pagePath)}: ${id} 附近仍有图片，请人工确认两者不是同义重复`);
    }
    specsById.set(id, { ...spec, manifestPath, pagePath });
  }
}

for (const [id, spec] of specsById.entries()) {
  const markers = markersById.get(id) || [];
  if (markers.length !== 1) issue(spec.manifestPath, `${id} 应在目标 Markdown 中出现一次，实际 ${markers.length} 次`);
  if (markers.length === 1 && path.resolve(markers[0]) !== path.resolve(spec.pagePath)) {
    issue(markers[0], `${id} 位于错误页面，应位于 ${path.relative(project, spec.pagePath)}`);
  }
}

for (const [id, files] of markersById.entries()) {
  if (!specsById.has(id)) files.forEach((file) => issue(file, `${id} 没有对应的清单 spec`));
  if (files.length > 1) files.forEach((file) => issue(file, `${id} 标记重复出现 ${files.length} 次`));
}

console.log(`408 visual audit: ${issues.length} issue(s)`);
console.log(`manifests=${manifestCount}, specs=${specsById.size}, markers=${markersById.size}, pages=${pageCount}${selectedSubject ? ` (subject: ${selectedSubject})` : ""}`);
warnings.forEach((warning) => console.log(`WARN ${warning}`));
issues.forEach((entry) => console.error(`ERROR ${entry}`));
process.exitCode = issues.length ? 1 : 0;
