import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";
import { marked } from "marked";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scheduleRoot = path.resolve(projectRoot, "..");
const knowledgeRoot = path.join(scheduleRoot, "local", "kaoyanzahuopu");
const mappingPath = path.join(scheduleRoot, "11408", "references", "tag_knowledge_map.json");
const outputPath = path.join(projectRoot, "app", "data", "knowledge.json");
const indexOutputPath = path.join(projectRoot, "app", "data", "knowledge-index.json");
const publicRoot = path.join(projectRoot, "public", "knowledge");

const subjects = {
  ds: { source: "data_structure", sourceName: "数据结构", order: ["basic", "linearlist", "array", "strings", "tree", "graph", "search", "sort"] },
  co: { source: "constitution_principle", sourceName: "组成原理", order: ["overview", "representation", "storage", "instruction", "cpu", "bus"] },
  os: { source: "operating_system", sourceName: "操作系统", order: ["concepts", "process", "memory", "files", "io_device"] },
  cn: { source: "computer_network", sourceName: "计算机网络", order: ["overall", "physical", "datalink", "network", "transport", "application"] },
};

const visualTypes = new Set([
  "growth-curves",
  "algorithm-trace",
  "memory-scale",
  "process-flow",
  "state-machine",
  "timeline",
  "comparison",
  "address-fields",
]);
const visualMarkerPattern = /<!--\s*knowledge-visual:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->/g;
const visualIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const forbiddenVisualKey = /^(html|script|style|src|url|href|onclick|onchange|oninput)$/i;
const visualIds = new Set();

function walkMarkdown(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkMarkdown(target);
    return entry.name === "index.md" ? [target] : [];
  });
}

function cleanInlineMarkdown(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`>#]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function firstSummary(markdown, title) {
  const paragraphs = markdown.split(/\n\s*\n/).map(cleanInlineMarkdown).filter(Boolean);
  return paragraphs.find((paragraph) => paragraph !== title && !/^[-*]\s/.test(paragraph) && !/^🔥|^⭐|^💡/.test(paragraph))?.slice(0, 150) || "本地整理的 408 知识点资料。";
}

function slugFor(relativePath) {
  return relativePath === "index.md" ? "" : relativePath.replace(/\/index\.md$/, "");
}

function routeFor(subjectId, relativePath) {
  const slug = slugFor(relativePath);
  return slug ? `/knowledge/${subjectId}/${slug}` : `/knowledge/${subjectId}`;
}

function copyAssets(sourcePage, subjectId, relativeDirectory) {
  const sourceAssets = path.join(path.dirname(sourcePage), "assets");
  if (!fs.existsSync(sourceAssets)) return 0;
  const destination = path.join(publicRoot, subjectId, relativeDirectory, "assets");
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(sourceAssets, destination, { recursive: true, force: true });
  for (const asset of walkFiles(destination)) {
    if (!asset.endsWith(".svg")) continue;
    const source = fs.readFileSync(asset, "utf8");
    // The offline export contains draw.io SVGs whose HTML text branch has
    // malformed quoted styles. Browsers reject the whole image as XML even
    // though every switch also contains a valid SVG/image fallback.
    const sanitized = source
      .replace(
        /<switch\b[^>]*>\s*<foreignObject\b[\s\S]*?<\/foreignObject>([\s\S]*?)<\/switch>/gi,
        "$1",
      )
      .replace(/&nbsp;/g, "&#160;");
    if (sanitized !== source) fs.writeFileSync(asset, sanitized);
  }
  return walkFiles(sourceAssets).length;
}

function walkFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walkFiles(target) : [target];
  });
}

function svgPresentation(sourcePage, assetUrl) {
  const filename = decodeURIComponent(assetUrl.split("/").at(-1) || "");
  const sourceAsset = path.join(path.dirname(sourcePage), "assets", filename);
  if (!filename.endsWith(".svg") || !fs.existsSync(sourceAsset)) return null;
  const svg = fs.readFileSync(sourceAsset, "utf8");
  const openingTag = svg.match(/<svg\b[^>]*>/i)?.[0] || "";
  const numberAttribute = (name) => {
    const raw = openingTag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1];
    const value = raw && /^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(raw) ? Number(raw) : 0;
    return Number.isFinite(value) ? value : 0;
  };
  const viewBox = openingTag.match(/viewBox=["']([^"']+)["']/i)?.[1]?.trim().split(/[\s,]+/).map(Number) || [];
  const width = numberAttribute("width") || (viewBox.length === 4 ? Math.abs(viewBox[2]) : 0);
  const height = numberAttribute("height") || (viewBox.length === 4 ? Math.abs(viewBox[3]) : 0);
  const uiArtifact = /aria-hidden=["']true["']|class=["'][^"']*(?:anchor-icon|icon)[^"']*["']/i.test(openingTag) && Math.max(width, height) <= 64;
  return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)), uiArtifact };
}

function normalizeTex(source) {
  return source
    .trim()
    .replace(/\\([_\[\]=])/g, "$1");
}

function escapeHtmlAttribute(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderMathExpression(source, displayMode, legacy = false) {
  try {
    const rendered = katex.renderToString(normalizeTex(source), {
      displayMode,
      throwOnError: false,
      strict: "ignore",
    });
    const sourceAttribute = escapeHtmlAttribute(source.trim());
    return displayMode
      ? `<div class="knowledge-math-block${legacy ? " knowledge-math-legacy" : ""}" data-tex-source="${sourceAttribute}">${rendered}</div>`
      : `<span class="knowledge-math-inline" data-tex-source="${sourceAttribute}">${rendered}</span>`;
  } catch {
    return source;
  }
}

function collectMarkdownLatex(markdown) {
  const sources = [];
  const pattern = /\$\$([\s\S]*?)\$\$|\\{1,2}\(([\s\S]*?)\\{1,2}\)/g;
  for (const match of markdown.matchAll(pattern)) {
    const source = (match[1] ?? match[2] ?? "").trim();
    if (source && !sources.includes(source)) sources.push(source);
  }
  return sources;
}

function assertVisualConfig(value, manifestPath, trail = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertVisualConfig(item, manifestPath, [...trail, String(index)]));
    return;
  }
  if (!value || typeof value !== "object") {
    if (typeof value === "string" && /https?:\/\//i.test(value)) {
      throw new Error(`${manifestPath}: ${trail.join(".")} 不得包含外部 URL`);
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    const nextTrail = [...trail, key];
    if (forbiddenVisualKey.test(key) || /^on[A-Z]/.test(key)) {
      throw new Error(`${manifestPath}: 不允许可视化配置字段 ${nextTrail.join(".")}`);
    }
    if (key === "autoPlay" && child === true) {
      throw new Error(`${manifestPath}: 可视化不得默认自动播放`);
    }
    assertVisualConfig(child, manifestPath, nextTrail);
  }
}

function assertVisualTypeConfig(spec, manifestPath) {
  const config = spec.config;
  const list = (key) => Array.isArray(config[key]) ? config[key] : [];
  const fail = (message) => { throw new Error(`${manifestPath}: ${spec.id} ${message}`); };

  if (spec.type === "growth-curves") {
    if (![config.min, config.max, config.initial].every(Number.isFinite) || config.min >= config.max) fail("需要合法的 min、max、initial");
    if (config.initial < config.min || config.initial > config.max) fail("initial 必须位于 min 与 max 之间");
    const kinds = new Set(["constant", "log2", "linear", "n-log2-n", "square", "cube", "pow2", "factorial"]);
    if (!list("series").length || list("series").some((series) => !series?.id || !series?.label || !series?.formula || !kinds.has(series?.kind))) fail("series 配置无效");
  }
  if (spec.type === "algorithm-trace" && (!list("items").length || !list("steps").length)) fail("items 与 steps 不能为空");
  if (spec.type === "memory-scale") {
    const spaceKinds = new Set(["constant", "log2", "linear", "n-log2-n", "square", "cube"]);
    if (!list("cases").length || list("cases").some((item) => !item?.label || !item?.formula || (!Number.isFinite(item?.units) && !spaceKinds.has(item?.kind)))) fail("cases 配置无效");
  }
  if (spec.type === "process-flow") {
    const ids = new Set(list("steps").map((step) => step?.id).filter(Boolean));
    if (ids.size < 2 || list("connections").some((edge) => !Array.isArray(edge) || edge.length !== 2 || !ids.has(edge[0]) || !ids.has(edge[1]))) fail("steps 或 connections 配置无效");
  }
  if (spec.type === "state-machine") {
    const ids = new Set(list("states").map((state) => state?.id).filter(Boolean));
    if (ids.size < 2 || list("transitions").some((edge) => !ids.has(edge?.from) || !ids.has(edge?.to) || !edge?.event)) fail("states 或 transitions 配置无效");
  }
  if (spec.type === "timeline" && (!list("lanes").length || !list("events").length || list("events").some((event) => !Number.isFinite(event?.start) || !Number.isFinite(event?.duration) || event.duration <= 0))) fail("lanes 或 events 配置无效");
  if (spec.type === "comparison" && (list("columns").length < 2 || !list("rows").length)) fail("columns 至少两列且 rows 不能为空");
  if (spec.type === "address-fields") {
    const fields = list("fields");
    const sum = fields.reduce((total, field) => total + (Number.isInteger(field?.bits) ? field.bits : 0), 0);
    if (!Number.isInteger(config.totalBits) || config.totalBits <= 0 || !fields.length || fields.some((field) => !field?.label || !Number.isInteger(field?.bits) || field.bits <= 0) || sum !== config.totalBits) fail("totalBits 与 fields 配置无效");
  }
}

function loadVisualManifest(subjectId, sourceDirectory) {
  const manifestPath = path.join(sourceDirectory, "_visualizations.json");
  if (!fs.existsSync(manifestPath)) return { manifestPath, byRoute: new Map(), specs: [] };
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.version !== 1 || manifest.subject !== subjectId || !Array.isArray(manifest.visualizations)) {
    throw new Error(`${manifestPath}: 可视化清单顶层格式无效`);
  }
  const byRoute = new Map();
  for (const spec of manifest.visualizations) {
    if (!spec || typeof spec !== "object" || !visualIdPattern.test(spec.id || "") || !spec.id.startsWith(`${subjectId}-`) || visualIds.has(spec.id)) {
      throw new Error(`${manifestPath}: 可视化 ID ${JSON.stringify(spec?.id)} 无效或重复`);
    }
    if (typeof spec.route !== "string" || path.isAbsolute(spec.route) || spec.route.split(/[\\/]/).includes("..")) throw new Error(`${manifestPath}: ${spec.id} 的 route 不安全`);
    if (!visualTypes.has(spec.type) || typeof spec.title !== "string" || !spec.title.trim() || typeof spec.summary !== "string" || !spec.summary.trim()) throw new Error(`${manifestPath}: ${spec.id} 的通用字段无效`);
    if (!spec.config || typeof spec.config !== "object" || Array.isArray(spec.config)) throw new Error(`${manifestPath}: ${spec.id}.config 必须为对象`);
    if (spec.sourceLatex !== undefined && (!Array.isArray(spec.sourceLatex) || spec.sourceLatex.some((item) => typeof item !== "string"))) throw new Error(`${manifestPath}: ${spec.id}.sourceLatex 必须为字符串数组`);
    const sourceLatex = spec.sourceLatex || [];
    assertVisualConfig(spec.config, manifestPath);
    assertVisualTypeConfig(spec, manifestPath);
    const configFormulas = [];
    const collectFormulas = (value) => {
      if (!value || typeof value !== "object") return;
      for (const [key, child] of Object.entries(value)) {
        if (/(formula|latex)$/i.test(key) && typeof child === "string") configFormulas.push(child);
        collectFormulas(child);
      }
    };
    collectFormulas(spec.config);
    if (configFormulas.some((formula) => !sourceLatex.includes(formula))) throw new Error(`${manifestPath}: ${spec.id} 的 config 公式必须原样列入 sourceLatex`);
    const formulaHtml = Object.fromEntries(sourceLatex.map((latex) => [latex, katex.renderToString(normalizeTex(latex), { throwOnError: false, strict: "ignore" })]));
    const enriched = { ...spec, sourceLatex, formulaHtml };
    visualIds.add(spec.id);
    byRoute.set(spec.route, [...(byRoute.get(spec.route) || []), enriched]);
  }
  return { manifestPath, byRoute, specs: manifest.visualizations };
}

function normalizeLegacyTex(source) {
  return normalizeTex(source)
    .replace(/[\u200b\u00a0]/g, " ")
    .replace(/−/g, "-")
    .replace(/×/g, "\\times ")
    .replace(/⋅/g, "\\cdot ")
    .replace(/⋯/g, "\\cdots ")
    .replace(/≥/g, "\\ge ")
    .replace(/≤/g, "\\le ")
    .replace(/≈/g, "\\approx ")
    .replace(/≠/g, "\\ne ")
    .replace(/⊕/g, "\\oplus ")
    .replace(/∑/g, "\\sum ")
    .replace(/⌈/g, "\\lceil ")
    .replace(/⌉/g, "\\rceil ")
    .replace(/\bmod\b|mod(?=[A-Za-z0-9(])/g, "\\bmod ");
}

function legacyFormulaKey(source) {
  return normalizeTex(source)
    .replace(/[\u200b]/g, "")
    .replace(/[\u00a0]/g, " ")
    .replace(/−/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

const legacyTexOverrides = new Map([
  ["Cn=n+11(n2n)", String.raw`C_n=\frac{1}{n+1}\binom{2n}{n}`],
  ["Addr(a[i][j])=A+(i×C+j)×B", String.raw`\operatorname{Addr}(a[i][j])=A+(i\times C+j)\times B`],
  ["k=1+2+⋯+(i-1)+j-1=i(i-1)/2+j-1", String.raw`k=1+2+\cdots +(i-1)+j-1=\frac{i(i-1)}{2}+j-1`],
  ["k=n+(n-1)⋯+(n-i+2)+(j-i+1)-1=(i-1)(2n-i+2)/2+(j-i)", String.raw`k=n+(n-1)+\cdots +(n-i+2)+(j-i+1)-1=\frac{(i-1)(2n-i+2)}{2}+j-i`],
  ["dist[i][j]=min(dist[i][j],dist[i][k]+dist[k][j])", String.raw`\operatorname{dist}[i][j]=\min\!\left(\operatorname{dist}[i][j],\operatorname{dist}[i][k]+\operatorname{dist}[k][j]\right)`],
  ["vl(j)-ve(i)-dij=0", String.raw`v_l(j)-v_e(i)-d_{ij}=0`],
  ["ve(i)=vl(i)且ve(j)=vl(j)", String.raw`v_e(i)=v_l(i)\quad\text{且}\quad v_e(j)=v_l(j)`],
  ["ve(k)=vj∈Pred(vk)max{ve(j)+weight(vj,vk)}", String.raw`v_e(k)=\max_{v_j\in\operatorname{Pred}(v_k)}\{v_e(j)+\operatorname{weight}(v_j,v_k)\}`],
  ["vl(k)=vj∈Succ(vk)min{vl(j)-weight(vk,vj)}", String.raw`v_l(k)=\min_{v_j\in\operatorname{Succ}(v_k)}\{v_l(j)-\operatorname{weight}(v_k,v_j)\}`],
  ["L=(a1,a2,⋯,ai,ai+1,⋯,an)", String.raw`L=(a_1,a_2,\cdots ,a_i,a_{i+1},\cdots ,a_n)`],
  ["Hi=(Hash1(key)+i×Hash2(key))modn", String.raw`H_i=(\operatorname{Hash}_1(key)+i\times\operatorname{Hash}_2(key))\bmod n`],
  ["l=⌈log2n⌉", String.raw`l=\lceil\log_2 n\rceil`],
  ["WPL=i=1∑nfi⋅li", String.raw`WPL=\sum_{i=1}^{n}f_i\cdot l_i`],
  ["L=∑i=1nfi∑i=1nfi⋅li", String.raw`L=\frac{\sum_{i=1}^{n}f_i l_i}{\sum_{i=1}^{n}f_i}`],
  ["L=i=1∑npi⋅li", String.raw`L=\sum_{i=1}^{n}p_i\cdot l_i`],
  ["WPL=50⋅1+20⋅2+20⋅3+10⋅3=50+40+60+30=180 位", String.raw`WPL=50\cdot1+20\cdot2+20\cdot3+10\cdot3=180\ \text{位}`],
  ["L=50+20+20+10180=100180=1.8 位/符号", String.raw`L=\frac{180}{50+20+20+10}=\frac{180}{100}=1.8\ \text{位/符号}`],
  ["L=0.5⋅1+0.2⋅2+0.2⋅3+0.1⋅3=0.5+0.4+0.6+0.3=1.8 位/符号", String.raw`L=0.5\cdot1+0.2\cdot2+0.2\cdot3+0.1\cdot3=1.8\ \text{位/符号}`],
  ["TP=Tkn", String.raw`TP=\frac{n}{T_k}`],
  ["TP=(k+n-1)×Tcn", String.raw`TP=\frac{n}{(k+n-1)T_c}`],
  ["S=TpipelineTserial=k+n-1nk", String.raw`S=\frac{T_{serial}}{T_{pipeline}}=\frac{nk}{k+n-1}`],
  ["Frequency=Clock Cycle1", String.raw`\mathrm{Frequency}=\frac{1}{\mathrm{Clock\ Cycle}}`],
  ["IPC=CPI1", String.raw`IPC=\frac{1}{CPI}`],
  ["IPS=CPI主频", String.raw`IPS=\frac{\text{主频}}{CPI}`],
  ["1MIPS=106IPS", String.raw`1\,MIPS=10^6\,IPS`],
  ["[A-B]补=A补+(-B)补", String.raw`[A-B]_{\text{补}}=A_{\text{补}}+(-B)_{\text{补}}`],
  ["dmdm-1⋯d1d0⋅d-1d-2⋯d-n", String.raw`d_m d_{m-1}\cdots d_1d_0\mathbin{.}d_{-1}d_{-2}\cdots d_{-n}`],
  ["b=i=-n∑m2i×bi", String.raw`b=\sum_{i=-n}^{m}2^i\times b_i`],
  ["(-1)s×1.frac×2exp-127", String.raw`(-1)^s\times 1.\mathrm{frac}\times 2^{\mathrm{exp}-127}`],
  ["(-1)s×1.frac×2exp-1023", String.raw`(-1)^s\times 1.\mathrm{frac}\times 2^{\mathrm{exp}-1023}`],
  ["value=(-1)sign×0.f×21-bias", String.raw`\mathrm{value}=(-1)^{\mathrm{sign}}\times 0.f\times 2^{1-\mathrm{bias}}`],
  ["±1.f×2e-bias", String.raw`\pm1.f\times2^{e-\mathrm{bias}}`],
  ["(-1)s×1.frac×2exp-bias", String.raw`(-1)^s\times1.\mathrm{frac}\times2^{\mathrm{exp}-\mathrm{bias}}`],
  ["2.25=1.125×21=89×21=(1+81)×21=(1+2-3)×21", String.raw`2.25=1.125\times2^1=\frac{9}{8}\times2^1=(1+\frac18)\times2^1=(1+2^{-3})\times2^1`],
  ["1.2=(1+51)×21", String.raw`1.2=(1+\frac15)\times2^0`],
  ["i=0∑3f×2i,f∈{0,1}", String.raw`\sum_{i=0}^{3}f_i\times2^i,\quad f_i\in\{0,1\}`],
  ["0,2231,2232,2233,⋯,223223-1,1", String.raw`0,\frac{1}{2^{23}},\frac{2}{2^{23}},\frac{3}{2^{23}},\cdots,\frac{2^{23}-1}{2^{23}},1`],
  ["0,2521,2522,2523,⋯,252252-1,1", String.raw`0,\frac{1}{2^{52}},\frac{2}{2^{52}},\frac{3}{2^{52}},\cdots,\frac{2^{52}-1}{2^{52}},1`],
  ["Udecimal=i=0∑n-12i⋅bi", String.raw`U_{decimal}=\sum_{i=0}^{n-1}2^i\cdot b_i`],
  ["Sdecimal=i=0∑n-22i⋅bi-2n-1⋅bn-1", String.raw`S_{decimal}=\sum_{i=0}^{n-2}2^i b_i-2^{n-1}b_{n-1}`],
  ["S=2n-U=Uˉ+1", String.raw`S=2^n-U=\overline{U}+1`],
  ["cache 块号=kmodM", String.raw`\text{Cache 块号}=k\bmod M`],
  ["Dr=rN", String.raw`D_r=rN`],
  ["利用率=FP", String.raw`\text{利用率}=\frac{P}{F}`],
  ["Response Ratio=BTWT+BT=BTTAT", String.raw`\mathrm{Response\ Ratio}=\frac{WT+BT}{BT}=\frac{TAT}{BT}`],
  ["2r≥k+r+1", String.raw`2^r\ge k+r+1`],
  ["Ws+Wr≤2n", String.raw`W_s+W_r\le2^n`],
  ["U=TtotalTdata", String.raw`U=\frac{T_{data}}{T_{total}}`],
  ["U=RTT+Td+TaN⋅Td", String.raw`U=\frac{N\cdot T_d}{RTT+T_d+T_a}`],
  ["U=RTT+Td+TaTd", String.raw`U=\frac{T_d}{RTT+T_d+T_a}`],
  ["S⋅T=m1i=1∑mSiTi=0", String.raw`S\cdot T=\frac{1}{m}\sum_{i=1}^{m}S_iT_i=0`],
  ["S⋅S=m1i=1∑mSi⋅Si=-1", String.raw`S\cdot\overline S=\frac{1}{m}\sum_{i=1}^{m}S_i\overline S_i=-1`],
  ["C=2W⋅log2V", String.raw`C=2W\cdot\log_2V`],
  ["C=B∗log2(1+NS)", String.raw`C=B\cdot\log_2\!\left(1+\frac{S}{N}\right)`],
  ["S/NdB=10⋅log10NS", String.raw`(S/N)_{dB}=10\cdot\log_{10}\!\left(\frac{S}{N}\right)`],
  ["NS=1010S/NdB", String.raw`\frac{S}{N}=10^{(S/N)_{dB}/10}`],
  ["Ttotal=Tsetup+Ttransmission", String.raw`T_{total}=T_{setup}+T_{transmission}`],
  ["seqno=(ISN+1+absolute index)mod232", String.raw`seqno=(ISN+1+absolute\ index)\bmod2^{32}`],
  ["absolute index≈(seqno-ISN-1)mod232+k⋅232", String.raw`absolute\ index\approx(seqno-ISN-1)\bmod2^{32}+k\cdot2^{32}`],
  ["swnd=min(cwnd,rwnd)", String.raw`swnd=\min(cwnd,rwnd)`],
  ["RTOEstimatedRTTDevRTT=EstimatedRTT+4∗DevRTT=(1-α)∗EstimatedRTT+α∗SampleRTT=(1-β)∗DevRTT+β∗∣SampleRTT-EstimatedRTT∣", String.raw`\begin{aligned}RTO&=EstimatedRTT+4\cdot DevRTT\\EstimatedRTT&=(1-\alpha)EstimatedRTT+\alpha SampleRTT\\DevRTT&=(1-\beta)DevRTT+\beta\lvert SampleRTT-EstimatedRTT\rvert\end{aligned}`],
]);

function renderLegacyFormulaLine(line) {
  const source = line.trim();
  const key = legacyFormulaKey(source);
  const chineseCharacters = source.match(/[\u4e00-\u9fff]/g)?.length || 0;
  const formulaLike = /\\=|[=≥≤≈≠∑⋅×⋯⊕⌈⌉]/.test(source);
  if (
    !source || source.length >= 220 || chineseCharacters > 3 || !formulaLike || !/[A-Za-z0-9]/.test(source) || source.endsWith("=")
    || /^(?:#|[-*>]|\d+\.\s|!\[|\[|`|<)/.test(source) || /^-?2\d+=-?\d+$/.test(key) || key === "C=A+B 的符号"
  ) return line;
  return renderMathExpression(legacyTexOverrides.get(key) || normalizeLegacyTex(source), true, true);
}

function renderMathMarkdown(markdown) {
  return markdown
    .split(/(```[\s\S]*?```|`[^`\n]*`|\$\$[\s\S]*?\$\$|\\{1,2}\([\s\S]*?\\{1,2}\))/g)
    .map((segment) => {
      if (segment.startsWith("`")) return segment;
      if (segment.startsWith("$$") && segment.endsWith("$$")) {
        return renderMathExpression(segment.slice(2, -2), true);
      }
      const inlineMath = segment.match(/^\\{1,2}\(([\s\S]*)\\{1,2}\)$/);
      if (inlineMath) return renderMathExpression(inlineMath[1], false);
      return segment.split("\n").map(renderLegacyFormulaLine).join("\n");
    })
    .join("");
}

function rewritePracticeMarker(markdown, practiceHref) {
  let markerWritten = false;
  return markdown.replace(/\[真题练习\]\([^)]+\)/g, () => {
    if (!practiceHref || markerWritten) return "";
    markerWritten = true;
    return `[真题练习](${practiceHref})`;
  });
}

function renderMarkdown(markdown, subjectId, relativeDirectory, sourcePage, pageTitle, practiceHref) {
  const assetBase = `/knowledge/${subjectId}${relativeDirectory ? `/${relativeDirectory}` : ""}/assets/`;
  const rewritten = renderMathMarkdown(rewritePracticeMarker(markdown, practiceHref))
    .replace(/\]\(\.\/assets\//g, `](${assetBase}`)
    .replace(/\]\((?:\.\.\/)+images\//g, "](https://www.csgraduates.com/images/")
    .replace(/\]\(http:\/\/csgraduates\.com\//g, "](https://www.csgraduates.com/");
  return marked.parse(rewritten, { gfm: true, breaks: false })
    .replace(/<a href="(https?:\/\/[^\"]+)"/g, '<a target="_blank" rel="noreferrer" href="$1"')
    .replace(/<img src="([^"]+)" alt="([^"]*)">/g, (image, src, alt) => {
      const presentation = svgPresentation(sourcePage, src);
      const accessibleAlt = /^inline svg \d+$/i.test(alt.trim()) ? `${pageTitle}知识示意图` : alt;
      if (!presentation) return `<img class="knowledge-diagram knowledge-diagram-auto" src="${src}" alt="${accessibleAlt}" loading="lazy" decoding="async">`;
      const className = presentation.uiArtifact ? "knowledge-ui-artifact" : "knowledge-diagram";
      const intrinsicWidth = presentation.uiArtifact ? "" : ` style="--knowledge-image-width: ${presentation.width}px"`;
      const loading = presentation.uiArtifact ? "" : ' loading="lazy" decoding="async"';
      const hidden = presentation.uiArtifact ? ' aria-hidden="true"' : "";
      return `<img class="${className}" src="${src}" alt="${accessibleAlt}" width="${presentation.width}" height="${presentation.height}"${intrinsicWidth}${loading}${hidden}>`;
    })
    .replace(/<p>\s*<img class="knowledge-ui-artifact"[^>]*>\s*<\/p>/g, "")
    .replace(/<p>\s*(<img class="knowledge-diagram"[^>]*>)\s*<\/p>/g, '<figure class="knowledge-figure">$1</figure>')
    .replace(/<p>(?:🔥 高优先级|⭐ 中优先级|💡 低优先级)<\/p>/g, "")
    .replace(/<p>(补充|注意|例子|示例|解释|证明|总结)<\/p>/g, '<p class="knowledge-callout-label">$1</p>');
}

if (!fs.existsSync(knowledgeRoot) || !fs.existsSync(mappingPath)) {
  throw new Error("找不到 schedule 本地知识库或 tag_knowledge_map.json");
}

const mappingData = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
const mappingsByPath = new Map();
for (const mapping of mappingData.mappings) {
  const current = mappingsByPath.get(mapping.knowledge_path) || [];
  current.push(mapping);
  mappingsByPath.set(mapping.knowledge_path, current);
}

fs.rmSync(publicRoot, { recursive: true, force: true });
fs.mkdirSync(publicRoot, { recursive: true });

const knowledgeData = { generatedAt: new Date().toISOString(), source: "schedule/local/kaoyanzahuopu", subjects: {} };
const knowledgeIndex = { generatedAt: knowledgeData.generatedAt, subjects: {} };
let totalAssets = 0;

for (const [subjectId, config] of Object.entries(subjects)) {
  const sourceDirectory = path.join(knowledgeRoot, config.source);
  const visualManifest = loadVisualManifest(subjectId, sourceDirectory);
  const resolvedVisualIds = new Set();
  const pages = walkMarkdown(sourceDirectory).map((sourcePage) => {
    const relativeSourcePath = path.relative(knowledgeRoot, sourcePage).split(path.sep).join("/");
    const relativePath = path.relative(sourceDirectory, sourcePage).split(path.sep).join("/");
    const relativeDirectory = path.posix.dirname(relativePath) === "." ? "" : path.posix.dirname(relativePath);
    const slug = slugFor(relativePath);
    const markdown = fs.readFileSync(sourcePage, "utf8");
    const pageVisualizations = visualManifest.byRoute.get(slug) || [];
    const pageMarkers = [...markdown.matchAll(visualMarkerPattern)].map((match) => match[1]);
    const expectedIds = new Set(pageVisualizations.map((spec) => spec.id));
    if (pageMarkers.length !== new Set(pageMarkers).size) throw new Error(`${sourcePage}: 可视化标记不可重复`);
    for (const markerId of pageMarkers) {
      if (!expectedIds.has(markerId)) throw new Error(`${sourcePage}: ${markerId} 没有匹配当前页面的清单 spec`);
    }
    for (const spec of pageVisualizations) {
      if (pageMarkers.filter((id) => id === spec.id).length !== 1) throw new Error(`${visualManifest.manifestPath}: ${spec.id} 必须在目标 Markdown 中恰好出现一次`);
      const delimitedLatex = new Set(collectMarkdownLatex(markdown));
      for (const latex of spec.sourceLatex) {
        if (!delimitedLatex.has(latex.trim())) throw new Error(`${visualManifest.manifestPath}: ${spec.id} 的公式 ${JSON.stringify(latex)} 未作为完整的定界 LaTeX 保留在目标 Markdown`);
      }
      resolvedVisualIds.add(spec.id);
    }
    const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || path.basename(relativeDirectory || config.source);
    const headings = [...markdown.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => cleanInlineMarkdown(match[1])).filter(Boolean);
    const mappings = mappingsByPath.get(relativeSourcePath) || [];
    const questionIds = [...new Set(mappings.flatMap((mapping) => mapping.source_questions.map((id) => `real-${id}`)))];
    const years = [...new Set(mappings.flatMap((mapping) => mapping.years))].sort((left, right) => left - right);
    const tags = mappings.map((mapping) => ({ name: mapping.tag, questionCount: mapping.question_count }));
    totalAssets += copyAssets(sourcePage, subjectId, relativeDirectory);
    return {
      id: `${subjectId}:${slug || "root"}`,
      slug,
      route: routeFor(subjectId, relativePath),
      sourcePath: relativeSourcePath,
      title,
      summary: firstSummary(markdown, title),
      priority: markdown.includes("🔥 高优先级") ? "high" : markdown.includes("⭐ 中优先级") ? "medium" : markdown.includes("💡 低优先级") ? "low" : null,
      depth: relativeDirectory ? relativeDirectory.split("/").length : 0,
      parentSlug: !slug ? null : slug.includes("/") ? slug.split("/").slice(0, -1).join("/") : "",
      headings,
      tags,
      questionIds,
      years,
      sourceLatex: [...new Set([...collectMarkdownLatex(markdown), ...pageVisualizations.flatMap((spec) => spec.sourceLatex)])],
      visualizations: pageVisualizations,
      html: renderMarkdown(
        markdown,
        subjectId,
        relativeDirectory,
        sourcePage,
        title,
        questionIds.length && slug ? `/subject/${subjectId}?view=questions&knowledge=${encodeURIComponent(slug)}` : null,
      ),
    };
  });

  if (resolvedVisualIds.size !== visualManifest.specs.length) {
    throw new Error(`${visualManifest.manifestPath}: 有可视化未匹配到知识页面`);
  }

  pages.sort((left, right) => {
    if (!left.slug) return -1;
    if (!right.slug) return 1;
    const leftTop = left.slug.split("/")[0];
    const rightTop = right.slug.split("/")[0];
    const orderDelta = config.order.indexOf(leftTop) - config.order.indexOf(rightTop);
    return orderDelta || left.depth - right.depth || left.slug.localeCompare(right.slug);
  });

  const tagRoutes = {};
  for (const page of pages) {
    for (const tag of page.tags) tagRoutes[tag.name] = { href: page.route, title: page.title };
  }
  knowledgeData.subjects[subjectId] = { sourceName: config.sourceName, pageCount: pages.length, mappedTagCount: Object.keys(tagRoutes).length, pages };
  knowledgeIndex.subjects[subjectId] = {
    pageCount: pages.length,
    mappedTagCount: Object.keys(tagRoutes).length,
    tagRoutes,
    pages: pages.map((page) => ({
      slug: page.slug,
      route: page.route,
      title: page.title,
      questionIds: page.questionIds,
    })),
  };
}

fs.writeFileSync(outputPath, `${JSON.stringify(knowledgeData)}\n`);
fs.writeFileSync(indexOutputPath, `${JSON.stringify(knowledgeIndex, null, 2)}\n`);

console.log(`Imported ${Object.values(knowledgeData.subjects).reduce((sum, subject) => sum + subject.pageCount, 0)} local knowledge pages and ${totalAssets} assets.`);
