"use client";

import { type CSSProperties, type KeyboardEvent, useRef, useState } from "react";
import type { KnowledgeVisualizationSpec } from "./types";

type UnknownRecord = Record<string, unknown>;

const visualTypeLabels: Record<KnowledgeVisualizationSpec["type"], string> = {
  "growth-curves": "增长关系",
  "algorithm-trace": "执行轨迹",
  "memory-scale": "空间尺度",
  "process-flow": "过程流",
  "state-machine": "状态转换",
  timeline: "时序",
  comparison: "概念对照",
  "address-fields": "位域拆分",
  "banker-simulator": "安全性检查",
  "resource-allocation-graph": "资源分配图",
  "semaphore-lab": "信号量实验",
  "scheduler-queue": "调度队列",
  "concurrency-lab": "并发步骤",
};

const toneNames = new Set(["violet", "blue", "mint", "amber", "coral", "rose", "slate"]);

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as UnknownRecord : {};
}

function records(value: unknown): UnknownRecord[] {
  return Array.isArray(value) ? value.map(record) : [];
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" || typeof value === "number" ? String(value) : fallback;
}

function number(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function tone(value: unknown) {
  const candidate = text(value, "violet");
  return toneNames.has(candidate) ? candidate : "violet";
}

function Latex({ source, spec }: { source: string; spec: KnowledgeVisualizationSpec }) {
  const html = spec.formulaHtml[source];
  if (!html) return <code className="knowledge-visual-latex-source" data-tex-source={source}>{source}</code>;
  return <span className="knowledge-visual-latex" data-tex-source={source} dangerouslySetInnerHTML={{ __html: html }} />;
}

function frameStyle(name: string, value: string): CSSProperties {
  return { [name]: value } as CSSProperties;
}

function useArrowNavigation(length: number, index: number, setIndex: (next: number) => void, focusIndex?: (next: number) => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (!length || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + length) % length;
    setIndex(next);
    focusIndex?.(next);
  };
}

function factorial(value: number) {
  let result = 1;
  for (let index = 2; index <= value; index += 1) {
    result *= index;
    if (!Number.isFinite(result)) return Number.POSITIVE_INFINITY;
  }
  return result;
}

function growthValue(kind: string, input: number) {
  if (kind === "constant") return 1;
  if (kind === "log2") return Math.log2(Math.max(1, input));
  if (kind === "linear") return input;
  if (kind === "n-log2-n") return input * Math.log2(Math.max(1, input));
  if (kind === "square") return input ** 2;
  if (kind === "cube") return input ** 3;
  if (kind === "pow2") return 2 ** input;
  if (kind === "factorial") return factorial(input);
  return 0;
}

function formatQuantity(value: number) {
  if (!Number.isFinite(value)) return "超出常规数值范围";
  if (value >= 1e9) return value.toExponential(3);
  if (value >= 1000) return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 }).format(value);
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value);
}

function GrowthCurves({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const config = spec.config;
  const minimum = Math.round(number(config.min, 2));
  const maximum = Math.round(number(config.max, 64));
  const initial = Math.round(number(config.initial, minimum));
  const series = records(config.series);
  const [input, setInput] = useState(initial);
  const [selected, setSelected] = useState(text(series[0]?.id));
  const values = series.map((item) => ({ item, value: growthValue(text(item.kind), input) }));
  const maxLog = Math.max(1, ...values.map(({ value }) => Number.isFinite(value) ? Math.log10(Math.max(1, value)) : 309));
  const active = values.find(({ item }) => text(item.id) === selected) || values[0];

  return (
    <div className="knowledge-growth">
      <div className="knowledge-visual-control-row">
        <label htmlFor={`${spec.id}-input`}>{text(config.inputLabel, "输入规模 n")} <b>{input}</b></label>
        <input id={`${spec.id}-input`} type="range" min={minimum} max={maximum} step="1" value={input} onChange={(event) => setInput(Number(event.currentTarget.value))} />
        <span>{minimum}</span><span>{maximum}</span>
      </div>
      <div className="knowledge-growth-bars" aria-label="各增长函数在当前输入规模下的代表函数值，柱长使用对数归一化">
        {values.map(({ item, value }) => {
          const id = text(item.id);
          const percent = Math.max(4, (Number.isFinite(value) ? Math.log10(Math.max(1, value)) : 309) / maxLog * 100);
          return (
            <button key={id} type="button" className={`knowledge-growth-row tone-${tone(item.tone)} ${id === selected ? "is-selected" : ""}`} onClick={() => setSelected(id)} aria-pressed={id === selected}>
              <span className="knowledge-growth-label"><strong>{text(item.label)}</strong><Latex source={text(item.formula)} spec={spec} /></span>
              <span className="knowledge-growth-track"><i style={frameStyle("--knowledge-growth", `${percent}%`)} /><b>{formatQuantity(value)}</b></span>
            </button>
          );
        })}
      </div>
      <p className="knowledge-visual-caption">柱长采用 log₁₀ 对数归一化；右侧为同阶代表函数值，用于比较增长趋势，不等同于某个具体算法的实际操作次数。</p>
      <p className="knowledge-visual-live" aria-live="polite">{active ? `${text(active.item.label)}：n = ${input} 时代表函数值为 ${formatQuantity(active.value)}` : ""}</p>
    </div>
  );
}

function StandardAlgorithmTrace({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const items = Array.isArray(spec.config.items) ? spec.config.items : [];
  const steps = records(spec.config.steps);
  const lanes = records(spec.config.lanes);
  const hasFrozenStates = steps.some((item) => Array.isArray(item.frozen) && item.frozen.length > 0);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const laneState = record(step.state);
  const previousStep = steps[Math.max(0, stepIndex - 1)] || {};
  const previousLaneState = record(previousStep.state);
  const stepEmptyLabels = record(step.emptyLabels);
  const frozenValues = new Set(Array.isArray(step.frozen) ? step.frozen.map((item) => text(item)) : []);
  const activeIndexes = new Set((Array.isArray(step.active) ? step.active : []).filter((item): item is number => Number.isInteger(item)));
  const range = Array.isArray(step.range) && step.range.length === 2 ? step.range.map((value) => number(value)) : null;
  const stepButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const onStepKeyDown = useArrowNavigation(steps.length, stepIndex, setStepIndex, (next) => stepButtons.current[next]?.focus());

  return (
    <div className="knowledge-trace">
      {lanes.length ? (
        <div className="knowledge-trace-lanes" aria-label={`第 ${stepIndex + 1} 步的文件与工作区状态`}>
          <div className="knowledge-trace-run">
            <span>RUN {text(step.run, "1")}</span>
            <strong>{step.boundary ? "当前归并段生成完成" : "正在生成当前归并段"}</strong>
          </div>
          {lanes.map((lane) => {
            const laneId = text(lane.id);
            const values = Array.isArray(laneState[laneId]) ? laneState[laneId] : [];
            const previousValues = text(previousStep.run) === text(step.run) && Array.isArray(previousLaneState[laneId]) ? previousLaneState[laneId] : [];
            return (
              <section key={laneId} className={`knowledge-trace-lane lane-${laneId}`} aria-label={text(lane.label, laneId)}>
                <header><span>{text(lane.shortLabel, laneId.toUpperCase())}</span><div><strong>{text(lane.label, laneId)}</strong><small>{text(lane.detail)}</small></div></header>
                <div className="knowledge-trace-cells">
                  {values.length ? values.map((value, index) => {
                    const label = text(value);
                    const isFrozen = laneId === "workspace" && frozenValues.has(label);
                    const isEmitted = laneId === "output" && index >= previousValues.length;
                    const statusLabel = isFrozen ? "冻结" : isEmitted ? "刚输出" : "";
                    return <span key={`${laneId}-${label}-${index}`} className={`${isFrozen ? "is-frozen" : ""} ${isEmitted ? "is-emitted" : ""}`}>{label}{statusLabel ? <small>{statusLabel}</small> : null}</span>;
                  }) : <em>{text(stepEmptyLabels[laneId], stepIndex > 0 ? text(lane.completedEmptyLabel, text(lane.emptyLabel, "空")) : text(lane.emptyLabel, "空"))}</em>}
                </div>
              </section>
            );
          })}
          <div className="knowledge-trace-legend"><span><i className="is-emitted" />刚输出</span>{hasFrozenStates ? <span><i className="is-frozen" />留待下一归并段</span> : null}</div>
        </div>
      ) : (
        <div className="knowledge-trace-items" role="img" aria-label={`第 ${stepIndex + 1} 步的数据状态`}>
          {items.map((item, index) => {
            const inRange = !range || (index >= range[0] && index <= range[1]);
            return <span key={`${text(item)}-${index}`} className={`${inRange ? "is-in-range" : "is-out-range"} ${activeIndexes.has(index) ? "is-active" : ""}`}><small>{index}</small><b>{text(item)}</b></span>;
          })}
        </div>
      )}
      <div className="knowledge-visual-stepper" role="group" aria-label="执行步骤" onKeyDown={onStepKeyDown}>
        <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>← 上一步</button>
        <div className="knowledge-step-dots">
          {steps.map((item, index) => <button ref={(node) => { stepButtons.current[index] = node; }} key={`${text(item.label)}-${index}`} type="button" tabIndex={index === stepIndex ? 0 : -1} aria-label={`第 ${index + 1} 步：${text(item.label)}`} aria-current={index === stepIndex ? "step" : undefined} onClick={() => setStepIndex(index)}>{index + 1}</button>)}
        </div>
        <button type="button" onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))} disabled={stepIndex >= steps.length - 1}>下一步 →</button>
      </div>
      <div className="knowledge-visual-observation" aria-live="polite"><span>{String(stepIndex + 1).padStart(2, "0")}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
    </div>
  );
}

function HanoiRecursionTrace({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const pegs = records(spec.config.pegs);
  const steps = records(spec.config.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const towers = record(step.towers);
  const stack = Array.isArray(step.stack) ? step.stack.map((frame) => text(frame)).filter(Boolean) : [];

  return (
    <div className="knowledge-hanoi-trace">
      <div className="knowledge-hanoi-meta" aria-label="当前递归位置">
        <span>DEPTH <b>{number(step.depth)}</b></span>
        <span>LINE <b>{text(step.lines, "—")}</b></span>
        <span>TOP <b>{stack.length ? "栈顶在前" : "栈空"}</b></span>
      </div>
      <div className="knowledge-hanoi-board">
        <section className="knowledge-hanoi-stack" aria-label="递归工作栈，栈顶在前">
          <header><span>CALL STACK</span><strong>工作记录</strong><small>返回地址，n，x，y，z</small></header>
          <div className="knowledge-hanoi-frames">
            {stack.length ? stack.map((frame, index) => (
              <div key={frame + "-" + index} className={index === 0 ? "is-active" : ""}>
                <i>{index === 0 ? "TOP" : "#" + (stack.length - index)}</i>
                <b>{frame}</b>
              </div>
            )) : <p>递归工作栈已清空</p>}
          </div>
        </section>
        <section className="knowledge-hanoi-towers" aria-label="三根柱与圆盘状态">
          {pegs.map((peg, index) => {
            const id = text(peg.id, String(index));
            const disks = Array.isArray(towers[id]) ? towers[id].filter((disk): disk is number => Number.isInteger(disk)) : [];
            const label = text(peg.label, id);
            return (
              <section className="knowledge-hanoi-peg" key={id} aria-label={label + "：" + (disks.length ? "圆盘 " + disks.join("、") : "无圆盘")}>
                <strong>{label}</strong>
                <div className="knowledge-hanoi-rod" aria-hidden="true">
                  <div className="knowledge-hanoi-disks">
                    {disks.map((disk) => <span key={disk} className={"disk-" + disk}>盘 {disk}</span>)}
                  </div>
                </div>
                <small>{disks.length ? "底 → 顶：" + disks.join("、") : "空柱"}</small>
              </section>
            );
          })}
        </section>
      </div>
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label="Hanoi 递归工作栈步骤" />
      <div className="knowledge-visual-observation" aria-live="polite"><span>{String(stepIndex + 1).padStart(2, "0")}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
    </div>
  );
}

function BankEventQueueTrace({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const windows = records(spec.config.windows);
  const steps = records(spec.config.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const previous = steps[Math.max(0, stepIndex - 1)] || {};
  const queues = record(step.queues);
  const previousQueues = record(previous.queues);
  const eventList = Array.isArray(step.eventList) ? step.eventList.map((event) => text(event)).filter(Boolean) : [];
  const previousEventList = new Set(Array.isArray(previous.eventList) ? previous.eventList.map((event) => text(event)) : []);

  return (
    <div className="knowledge-bank-trace">
      <div className="knowledge-bank-meta" aria-label="当前处理事件">
        <span>TIME <b>t={number(step.time)}</b></span>
        <span>处理 <b>{text(step.currentEvent, "—")}</b></span>
        <span>随机数 <b>{text(step.random, "—")}</b></span>
      </div>
      <div className="knowledge-bank-board">
        <section className="knowledge-bank-events" aria-label="有序事件表">
          <header><div><span>EVENT LIST</span><strong>按发生时刻有序</strong></div><small>ev.first ↓</small></header>
          <ol>
            {eventList.map((event, index) => <li key={event + "-" + index} className={[
              index === 0 ? "is-first" : "",
              stepIndex > 0 && !previousEventList.has(event) ? "is-added" : "",
            ].filter(Boolean).join(" ")}>
              <b>{"(" + event + ")"}</b><small>{index === 0 ? "下一个事件" : "待处理"}</small>
            </li>)}
          </ol>
        </section>
        <section className="knowledge-bank-queues" aria-label="四个客户队列">
          {windows.map((window, index) => {
            const id = text(window.id, "q" + (index + 1));
            const customers = Array.isArray(queues[id]) ? queues[id].map((customer) => text(customer)).filter(Boolean) : [];
            const prior = Array.isArray(previousQueues[id]) ? previousQueues[id].map((customer) => text(customer)).filter(Boolean) : [];
            const changed = stepIndex > 0 && customers.join("|") !== prior.join("|");
            const label = text(window.label, id);
            return (
              <section key={id} className={"knowledge-bank-queue" + (changed ? " is-changed" : "")} aria-label={label + "：" + (customers.length ? customers.map((customer) => "客户 " + customer).join("；") : "空")}>
                <header><span>{id.toUpperCase()}</span><strong>{label}</strong><small>{customers.length ? customers.length + " 人" : "空"}</small></header>
                <div>
                  {customers.length ? customers.map((customer, customerIndex) => <b key={customer + "-" + customerIndex} className={customerIndex === 0 ? "is-front" : ""}>{"(" + customer + ")"}{customerIndex === 0 ? <small>队头</small> : null}</b>) : <em>空队列</em>}
                </div>
              </section>
            );
          })}
        </section>
      </div>
      <p className="knowledge-bank-rule"><strong>队列规则：</strong>到达客户进入当前最短队列；若并列，选择编号最小的窗口。事件（t,0）为到达，（t,1…4）为对应窗口离开。</p>
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label="银行离散事件模拟步骤" />
      <div className="knowledge-visual-observation" aria-live="polite"><span>{"T=" + number(step.time)}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
    </div>
  );
}

function LoadingTrace({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const lanes = records(spec.config.lanes);
  const steps = records(spec.config.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const laneState = record(step.state);
  const activeLanes = new Set(Array.isArray(step.activeLanes) ? step.activeLanes.map((item) => text(item)) : []);

  return (
    <div className="knowledge-loading-trace">
      <div className="knowledge-loading-rule"><span>{text(spec.config.modeLabel, "地址转换")}</span><p>{text(spec.config.principle)}</p></div>
      <div className="knowledge-loading-lanes" aria-label={`第 ${stepIndex + 1} 步的地址与装入状态`}>
        {lanes.map((lane, laneIndex) => {
          const laneId = text(lane.id, String(laneIndex));
          const values = Array.isArray(laneState[laneId]) ? laneState[laneId] : [];
          return (
            <section key={laneId} className={`knowledge-loading-lane tone-${tone(lane.tone)} ${activeLanes.has(laneId) ? "is-active" : ""}`} aria-label={text(lane.label, laneId)}>
              <header><span>{text(lane.shortLabel, laneId.toUpperCase())}</span><div><strong>{text(lane.label, laneId)}</strong><small>{text(lane.detail)}</small></div></header>
              <div className="knowledge-loading-cells">
                {values.length ? values.map((value, valueIndex) => <b key={`${laneId}-${text(value)}-${valueIndex}`}>{text(value)}</b>) : <em>当前无变化</em>}
              </div>
            </section>
          );
        })}
      </div>
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label="装入与地址转换步骤" />
      <div className="knowledge-visual-observation" aria-live="polite"><span>{text(step.phase, String(stepIndex + 1).padStart(2, "0"))}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
      {text(step.rule) ? <p className="knowledge-loading-key"><strong>此刻要记住：</strong>{text(step.rule)}</p> : null}
    </div>
  );
}

function KmpNextTrace({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const main = Array.from(text(spec.config.main));
  const pattern = Array.from(text(spec.config.pattern));
  const nextValues = Array.isArray(spec.config.next) ? spec.config.next.map((value) => number(value)) : [];
  const steps = records(spec.config.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const i = Math.max(1, Math.round(number(step.i, 1)));
  const j = Math.max(0, Math.round(number(step.j, 0)));
  const patternStart = Math.max(1, Math.round(number(step.patternStart, 1)));
  const matched = Math.max(0, Math.min(pattern.length, Math.round(number(step.matched, 0))));
  const knownPrefix = Math.max(0, Math.min(pattern.length, Math.round(number(step.knownPrefix, 0))));
  const nextJump = typeof step.nextJump === "number" ? step.nextJump : null;
  const activePatternIndex = j >= 1 && j <= pattern.length ? j - 1 : -1;
  const boardStyle = frameStyle("--kmp-columns", String(Math.max(1, main.length)));

  return (
    <div className="knowledge-kmp-trace">
      <div className="knowledge-kmp-meta" aria-label="当前 KMP 指针状态">
        <span>ROUND <b>{text(step.round, String(stepIndex + 1))}</b></span>
        <span>主串指针 <b>i={i}</b></span>
        <span>模式指针 <b>j={j}</b></span>
        <span><Latex source={"\\operatorname{next}[j]"} spec={spec} /> <b>{nextJump === null ? "—" : "=" + nextJump}</b></span>
        <span className={text(step.status) === "匹配成功" ? "is-success" : ""}>{text(step.status, "比较中")}</span>
      </div>

      <div className="knowledge-kmp-board" role="img" aria-label={`第 ${stepIndex + 1} 步：主串指针 i 为 ${i}，模式指针 j 为 ${j}，状态为 ${text(step.status, "比较中")}`}>
        <section className="knowledge-kmp-string">
          <header><span>MAIN STRING</span><strong>主串 S</strong><small>紫色单元是 i 当前停留的位置</small></header>
          <div className="knowledge-kmp-cells" style={boardStyle}>
            {main.map((character, index) => {
              const position = index + 1;
              const inAlignment = position >= patternStart && position < patternStart + pattern.length;
              return <span key={`${character}-${position}`} className={`${inAlignment ? "is-aligned" : ""} ${position === i ? "is-active" : ""}`}><small>{position}</small><b>{character}</b>{position === i ? <i>i</i> : null}</span>;
            })}
          </div>
        </section>
        <section className="knowledge-kmp-string knowledge-kmp-pattern">
          <header><span>PATTERN</span><strong>模式 T</strong><small>与主串按当前起点对齐；绿色为已知相等的前缀</small></header>
          <div className="knowledge-kmp-cells knowledge-kmp-pattern-cells" style={boardStyle}>
            {pattern.map((character, index) => {
              const position = patternStart + index;
              const className = [
                index < matched ? "is-matched" : "",
                index === activePatternIndex ? "is-active" : "",
                index < knownPrefix ? "is-known-prefix" : "",
              ].filter(Boolean).join(" ");
              return <span key={`${character}-${index}`} className={className} style={{ gridColumnStart: position }}><small>p{index + 1}</small><b>{character}</b>{index === activePatternIndex ? <i>j</i> : null}</span>;
            })}
          </div>
        </section>
      </div>

      <div className="knowledge-kmp-next-table" aria-label="模式串 next 函数表">
        <header><span>FALLBACK TABLE</span><strong><Latex source={"\\operatorname{next}[j]"} spec={spec} /> 的回退位置</strong></header>
        <div>
          {nextValues.map((value, index) => <span key={`${value}-${index}`} className={index === activePatternIndex ? "is-active" : ""}><small>j={index + 1}</small><b>{value}</b></span>)}
        </div>
      </div>

      <p className="knowledge-kmp-rule"><strong>回退规则：</strong>失配时 i 不动、j 变为 <Latex source={"\\operatorname{next}[j]"} spec={spec} />；仅当 j=0，i 与 j 才同时增 1。{knownPrefix ? ` 当前已保留 p₁…p${knownPrefix} 的已知相等前缀。` : ""}</p>
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label="KMP next 回退步骤" />
      <div className="knowledge-visual-observation" aria-live="polite"><span>{String(stepIndex + 1).padStart(2, "0")}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
    </div>
  );
}

function AlgorithmTrace({ spec }: { spec: KnowledgeVisualizationSpec }) {
  if (text(spec.config.variant) === "hanoi-recursion") return <HanoiRecursionTrace spec={spec} />;
  if (text(spec.config.variant) === "bank-event-queue") return <BankEventQueueTrace spec={spec} />;
  if (text(spec.config.variant) === "kmp-next-fallback") return <KmpNextTrace spec={spec} />;
  if (text(spec.config.layout) === "loading-trace") return <LoadingTrace spec={spec} />;
  return <StandardAlgorithmTrace spec={spec} />;
}

function MemoryScale({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const cases = records(spec.config.cases);
  const [selected, setSelected] = useState(0);
  const minimum = Math.round(number(spec.config.min, 2));
  const maximum = Math.round(number(spec.config.max, 64));
  const [input, setInput] = useState(Math.round(number(spec.config.initial, 16)));
  const kindFor = (item: UnknownRecord) => {
    if (typeof item.kind === "string") return item.kind;
    return ({ "O(1)": "constant", "O(\\log n)": "log2", "O(n)": "linear", "O(n^2)": "square" } as Record<string, string>)[text(item.formula)] || "units";
  };
  const valueFor = (item: UnknownRecord) => kindFor(item) === "units" ? number(item.units, 0) : growthValue(kindFor(item), input);
  const maxUnits = Math.max(1, ...cases.map(valueFor));
  const active = cases[selected] || {};
  return (
    <div className="knowledge-memory">
      <div className="knowledge-visual-control-row">
        <label htmlFor={`${spec.id}-space-input`}>输入规模 n <b>{input}</b></label>
        <input id={`${spec.id}-space-input`} type="range" min={minimum} max={maximum} step="1" value={input} onChange={(event) => setInput(Number(event.currentTarget.value))} />
        <span>{minimum}</span><span>{maximum}</span>
      </div>
      <div className="knowledge-memory-list" role="group" aria-label="空间使用方案">
        {cases.map((item, index) => {
          const value = valueFor(item);
          return <button key={`${text(item.label)}-${index}`} type="button" className={`tone-${tone(item.tone)} ${index === selected ? "is-selected" : ""}`} onClick={() => setSelected(index)} aria-pressed={index === selected}><span><strong>{text(item.label)}</strong><Latex source={text(item.formula)} spec={spec} /></span><i style={frameStyle("--knowledge-scale", `${Math.max(5, value / maxUnits * 100)}%`)} /><b>{formatQuantity(value)}</b></button>;
        })}
      </div>
      <p className="knowledge-visual-caption">{text(spec.config.unitLabel, "相对辅助空间")} · 数值按同阶代表函数计算，忽略常数因子和低阶项；条长相对当前最大值归一化。</p>
      <div className="knowledge-visual-observation" aria-live="polite"><span>SPACE</span><p><strong>{text(active.label)} · <Latex source={text(active.formula)} spec={spec} /></strong>n = {input} 时代表函数值为 {formatQuantity(valueFor(active))}。{text(active.note)}</p></div>
    </div>
  );
}

function StandardProcessFlow({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const steps = records(spec.config.steps);
  const connections = Array.isArray(spec.config.connections) ? spec.config.connections : [];
  const [selected, setSelected] = useState(0);
  const active = steps[selected] || {};
  const activeId = text(active.id);
  return (
    <div className="knowledge-flow">
      <div className="knowledge-flow-steps" role="group" aria-label="流程步骤">
        {steps.map((step, index) => <button key={text(step.id, String(index))} type="button" className={index === selected ? "is-selected" : ""} aria-pressed={index === selected} onClick={() => setSelected(index)}><small>{String(index + 1).padStart(2, "0")}</small>{step.from || step.to ? <span className="knowledge-flow-transfer"><b>{text(step.from, "起点")}</b> → <b>{text(step.to, "终点")}</b></span> : null}<strong>{text(step.label, text(step.message))}</strong><span className="knowledge-flow-hint">{index === selected ? "当前步骤" : "点击查看"}</span></button>)}
      </div>
      <div className="knowledge-flow-edges" aria-label="步骤连接关系">{connections.map((connection, index) => {
        const pair = Array.isArray(connection) ? connection : [];
        const from = steps.find((step) => text(step.id) === text(pair[0]));
        const to = steps.find((step) => text(step.id) === text(pair[1]));
        return <span key={`${text(pair[0])}-${text(pair[1])}-${index}`} className={activeId === text(pair[0]) || activeId === text(pair[1]) ? "is-active" : ""}>{text(from?.label, text(pair[0]))}<b>→</b>{text(to?.label, text(pair[1]))}</span>;
      })}</div>
      <p className="knowledge-visual-live" aria-live="polite">当前查看：{text(active.label, text(active.message))}。{text(active.detail, text(active.message))}</p>
    </div>
  );
}

function PrivilegeSwitchFlow({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const actors = records(spec.config.actors);
  const registers = records(spec.config.registers);
  const pcbs = records(spec.config.pcbs);
  const steps = records(spec.config.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const processStates = record(step.processStates);
  const cpu = record(step.cpu);
  const pcbStates = record(step.pcbs);
  const activeActors = new Set(Array.isArray(step.activeActors) ? step.activeActors.map((item) => text(item)) : []);
  const activePcbs = new Set(Array.isArray(step.activePcbs) ? step.activePcbs.map((item) => text(item)) : []);
  const isKernelMode = text(step.mode) === "kernel";

  return (
    <div className="knowledge-privilege-switch">
      <div className={`knowledge-privilege-status ${isKernelMode ? "is-kernel" : "is-user"}`}><span>CPU 当前特权集</span><strong>{text(step.modeLabel, isKernelMode ? "内核态（特权集开启）" : "用户态（受限特权集）")}</strong><small>{text(step.trigger)}</small></div>
      <div className="knowledge-privilege-route" aria-label="本步的控制与数据流向">{text(step.route, "进程 → CPU → 内存中的 PCB")}</div>
      <div className="knowledge-privilege-board">
        <section className="knowledge-privilege-processes" aria-label="参与的进程和内核代码">
          <header><span>参与方</span><strong>进程 / 内核</strong></header>
          <div>
            {actors.map((actor, actorIndex) => {
              const id = text(actor.id, String(actorIndex));
              return <article key={id} className={`tone-${tone(actor.tone)} ${activeActors.has(id) ? "is-active" : ""}`}><i aria-hidden="true" /><div><strong>{text(actor.label, id)}</strong><small>{text(processStates[id], text(actor.detail))}</small></div></article>;
            })}
          </div>
        </section>
        <section className="knowledge-privilege-cpu" aria-label="CPU 及寄存器状态">
          <header><span>CPU</span><strong>特权态与寄存器</strong></header>
          <div className="knowledge-privilege-registers">
            {registers.map((register, registerIndex) => {
              const id = text(register.id, String(registerIndex));
              return <div key={id} className={id === "psw" ? (isKernelMode ? "is-kernel" : "is-user") : ""}><span>{text(register.label, id.toUpperCase())}</span><b>{text(cpu[id], "—")}</b></div>;
            })}
          </div>
        </section>
        <section className="knowledge-privilege-memory" aria-label="内存中的 PCB">
          <header><span>RAM</span><strong>PCB：保存 / 恢复现场</strong></header>
          <div className="knowledge-privilege-pcbs">
            {pcbs.map((pcb, pcbIndex) => {
              const id = text(pcb.id, String(pcbIndex));
              const values = record(pcbStates[id]);
              return <article key={id} className={`${activePcbs.has(id) ? "is-active" : ""} tone-${tone(pcb.tone)}`}><strong>{text(pcb.label, id)}</strong><dl><div><dt>状态</dt><dd>{text(values.state, "—")}</dd></div><div><dt>已存现场</dt><dd>{text(values.context, "—")}</dd></div></dl></article>;
            })}
          </div>
        </section>
      </div>
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label="特权切换与可能的进程切换步骤" />
      <div className="knowledge-visual-observation" aria-live="polite"><span>{String(stepIndex + 1).padStart(2, "0")}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
      <p className="knowledge-privilege-caveat"><strong>区分：</strong>{text(spec.config.caveat)}</p>
    </div>
  );
}

function ProcessFamilyFlow({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const members = records(spec.config.members);
  const steps = records(spec.config.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const parentMember = members.find((member) => text(member.id) === "parent") || {};
  const childMember = members.find((member) => text(member.id) === "child") || {};
  const parent = record(step.parent);
  const child = record(step.child);
  const returns = record(step.returns);

  const node = (member: UnknownRecord, state: UnknownRecord, role: "parent" | "child") => (
    <article className={`knowledge-process-family-node tone-${tone(member.tone)} is-${role}`}>
      <span>{text(member.label, role === "parent" ? "父进程" : "子进程")}</span>
      <strong>{text(state.pid, role === "parent" ? "P100" : "P200")}</strong>
      <b>{text(state.state)}</b>
      <small>{text(state.detail)}</small>
      <footer><i>本分支返回值</i><code>{text(returns[role], "—")}</code></footer>
    </article>
  );

  return (
    <div className="knowledge-process-family">
      <div className="knowledge-process-family-intro"><span>创建关系</span><p><strong>`fork()` 后分成两条执行流</strong>{text(spec.config.intro)}</p><small>失败时 `fork()` 返回 -1，只有原父进程继续，不会产生子进程。</small></div>
      <div className="knowledge-process-family-branch" aria-label="父进程与子进程的关系图">
        {node(parentMember, parent, "parent")}
        <div className="knowledge-process-family-arrow"><strong>{text(step.action, "fork()")}</strong><i aria-hidden="true">→</i><small>{text(step.relationship)}</small></div>
        {node(childMember, child, "child")}
      </div>
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label="父子进程与回收场景" />
      <div className="knowledge-visual-observation" aria-live="polite"><span>{String(stepIndex + 1).padStart(2, "0")}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
      {text(step.rule) ? <p className="knowledge-process-family-rule"><strong>判断要点：</strong>{text(step.rule)}</p> : null}
    </div>
  );
}

function ProcessFlow({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const layout = text(spec.config.layout);
  if (layout === "computer-timeline") return <ComputerTimelineFlow spec={spec} />;
  if (layout === "privilege-switch") return <PrivilegeSwitchFlow spec={spec} />;
  if (layout === "process-family") return <ProcessFamilyFlow spec={spec} />;
  return <StandardProcessFlow spec={spec} />;
}

function SchedulerQueueTrace({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const queues = records(spec.config.queues);
  const jobs = records(spec.config.jobs);
  const steps = records(spec.config.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const queueState = record(step.queues);
  const jobById = new Map(jobs.map((job, index) => [text(job.id, String(index)), job]));
  const remaining = Object.fromEntries(jobs.map((job, index) => [text(job.id, String(index)), Math.max(0, number(job.service))]));

  for (let index = 0; index <= stepIndex; index += 1) {
    const current = steps[index] || {};
    const cpuId = text(current.cpu);
    if (cpuId in remaining) remaining[cpuId] = Math.max(0, number(remaining[cpuId]) - Math.max(0, number(current.duration)));
  }

  const jobLabel = (id: string) => text(jobById.get(id)?.label, id);
  const jobTone = (id: string) => tone(jobById.get(id)?.tone);
  const listIds = (value: unknown) => Array.isArray(value) ? value.map((item) => text(item)).filter(Boolean) : [];
  const activeJob = text(step.cpu);
  const arrivals = listIds(step.arrivals);
  const completed = listIds(step.completed);

  return (
    <div className="scheduler-queue-trace">
      <div className="scheduler-queue-rule"><span>{text(spec.config.modeLabel, "调度规则")}</span><p>{text(spec.config.rule)}</p></div>
      <div className="scheduler-queue-board">
        <section className="scheduler-cpu" aria-label="当前 CPU 执行片段">
          <header><span>CPU</span><strong>{text(step.time, "当前时间片")}</strong></header>
          <div className={`scheduler-cpu-job tone-${jobTone(activeJob)}`}>
            <small>本步运行</small>
            <strong>{jobLabel(activeJob)}</strong>
            <b>{number(step.duration)} {text(spec.config.unit, "时间单位")}</b>
          </div>
          <p>{text(step.action, "本片结束后，按当前策略更新队列。")}</p>
        </section>
        <section className="scheduler-ready-queues" aria-label="本步结束后的调度队列">
          <header><span>队列快照</span><strong>本步结束后</strong></header>
          <div>
            {queues.map((queue, queueIndex) => {
              const id = text(queue.id, String(queueIndex));
              const members = listIds(queueState[id]);
              return <article key={id} className={`tone-${tone(queue.tone)}`}><div><strong>{text(queue.label, id)}</strong><small>{text(queue.detail)}</small></div><ol aria-label={`${text(queue.label, id)} 当前顺序`}>{members.length ? members.map((member, memberIndex) => <li key={`${member}-${memberIndex}`} className={`tone-${jobTone(member)}`}><small>{memberIndex + 1}</small>{jobLabel(member)}</li>) : <li className="is-empty">空</li>}</ol></article>;
            })}
          </div>
        </section>
      </div>
      <section className="scheduler-jobs" aria-label="所有任务的剩余服务时间">
        <header><span>任务状态</span><strong>剩余服务时间</strong></header>
        <div>{jobs.map((job, jobIndex) => {
          const id = text(job.id, String(jobIndex));
          const value = number(remaining[id]);
          return <article key={id} className={`tone-${tone(job.tone)} ${id === activeJob ? "is-active" : ""} ${value === 0 ? "is-done" : ""}`}><strong>{text(job.label, id)}</strong><span>到达 {text(job.arrival, "—")} · 总服务 {number(job.service)}</span><b>{value === 0 ? "已完成" : `余 ${value}`}</b></article>;
        })}</div>
      </section>
      {(arrivals.length || completed.length || text(step.event)) ? <div className="scheduler-queue-events" aria-label="本步事件"><strong>本步事件</strong>{arrivals.length ? <span>到达：{arrivals.map(jobLabel).join("、")}</span> : null}{completed.length ? <span>完成：{completed.map(jobLabel).join("、")}</span> : null}{text(step.event) ? <span>{text(step.event)}</span> : null}</div> : null}
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label={`${text(spec.config.modeLabel, "调度")}步骤`} />
      <div className="knowledge-visual-observation" aria-live="polite"><span>{String(stepIndex + 1).padStart(2, "0")}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
    </div>
  );
}

function ComputerTimelineFlow({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const steps = records(spec.config.steps);
  const components = records(spec.config.components);
  const [selected, setSelected] = useState(0);
  const active = steps[selected] || {};
  const activeComponents = new Set(Array.isArray(active.components) ? active.components.map((item) => text(item)) : []);
  const stepButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const onStepKeyDown = useArrowNavigation(steps.length, selected, setSelected, (next) => stepButtons.current[next]?.focus());
  const activeComponentLabels = components
    .filter((component) => activeComponents.has(text(component.id)))
    .map((component) => text(component.label));

  return (
    <div className="knowledge-boot-flow">
      <div className="knowledge-boot-computer" role="img" aria-label={`简化计算机示意：当前处于${text(active.time, "当前时刻")}的${text(active.label)}，涉及${activeComponentLabels.join("、") || "启动组件"}`}>
        <div className="knowledge-boot-monitor">
          <span>BOOT SEQUENCE</span>
          <strong>{text(active.label)}</strong>
          <small>{text(active.time, "t = 0")}</small>
        </div>
        <i className="knowledge-boot-stand" aria-hidden="true" />
        <div className="knowledge-boot-chassis">
          <span className="knowledge-boot-chassis-label">计算机主机</span>
          <div className="knowledge-boot-components">
            {components.map((component, index) => {
              const id = text(component.id, String(index));
              return <span key={id} className={`tone-${tone(component.tone)} ${activeComponents.has(id) ? "is-active" : ""}`}><i aria-hidden="true" />{text(component.label, id)}</span>;
            })}
          </div>
        </div>
      </div>
      <div className="knowledge-boot-detail">
        <div className="knowledge-boot-observation" aria-live="polite"><span>{text(active.time, "t = 0")}</span><p><strong>{text(active.label)}</strong>{text(active.detail)}</p></div>
        <div className="knowledge-boot-timeline" role="group" aria-label="引导时间点" onKeyDown={onStepKeyDown}>
          {steps.map((step, index) => <button ref={(node) => { stepButtons.current[index] = node; }} key={text(step.id, String(index))} type="button" className={index === selected ? "is-selected" : ""} aria-current={index === selected ? "step" : undefined} tabIndex={index === selected ? 0 : -1} onClick={() => setSelected(index)}><small>{text(step.time, `t + ${index}`)}</small><strong>{text(step.label)}</strong></button>)}
        </div>
        <div className="knowledge-boot-actions">
          <button type="button" onClick={() => setSelected(Math.max(0, selected - 1))} disabled={selected === 0}>← 上一步</button>
          <span>{selected + 1} / {steps.length}</span>
          <button type="button" onClick={() => setSelected(Math.min(steps.length - 1, selected + 1))} disabled={selected >= steps.length - 1}>下一步 →</button>
        </div>
        <p className="knowledge-boot-route" aria-label="控制权的引导方向">控制权：固件 → 引导加载器 → 内核 → 系统服务</p>
      </div>
    </div>
  );
}

function StateMachine({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const states = records(spec.config.states);
  const transitions = records(spec.config.transitions);
  const initial = text(spec.config.initialState, text(states[0]?.id));
  const [current, setCurrent] = useState(initial);
  const [lastEvent, setLastEvent] = useState("选择一个事件，观察状态如何迁移。");
  const currentState = states.find((state) => text(state.id) === current) || states[0] || {};
  const available = transitions.filter((transition) => text(transition.from) === current);

  const runTransition = (transition: UnknownRecord) => {
    setCurrent(text(transition.to));
    setLastEvent(`${text(transition.event)}：${text(transition.from)} → ${text(transition.to)}`);
  };

  return (
    <div className="knowledge-state-machine">
      <div className="knowledge-state-nodes" aria-label="状态集合">
        {states.map((state, index) => <div key={text(state.id, String(index))} className={text(state.id) === current ? "is-current" : ""}><small>{String(index + 1).padStart(2, "0")}</small><strong>{text(state.label)}</strong><span>{text(state.note)}</span></div>)}
      </div>
      <div className="knowledge-state-events" role="group" aria-label={`从${text(currentState.label)}可选择的事件`}>
        <span>当前：<b>{text(currentState.label)}</b></span>
        {available.map((transition, index) => <button key={`${text(transition.event)}-${index}`} type="button" onClick={() => runTransition(transition)}>{text(transition.event)} <b>→</b></button>)}
        {!available.length || current !== initial ? <button type="button" className="is-reset" onClick={() => { setCurrent(initial); setLastEvent("已回到初始状态。"); }}>回到初始状态</button> : null}
      </div>
      <p className="knowledge-visual-live" aria-live="polite">{lastEvent} 当前状态：{text(currentState.label)}。</p>
    </div>
  );
}

function Timeline({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const lanes = Array.isArray(spec.config.lanes) ? spec.config.lanes : [];
  const events = records(spec.config.events);
  const laneInfo = lanes.map((lane, index) => {
    const value = record(lane);
    return { id: text(value.id, typeof lane === "string" ? lane : String(index)), label: text(value.label, typeof lane === "string" ? lane : `通道 ${index + 1}`) };
  });
  const configuredStart = number(spec.config.startAt, Number.NaN);
  const minimum = Number.isFinite(configuredStart) ? configuredStart : Math.min(...events.map((event) => number(event.start)));
  const maximum = Math.max(1, ...events.map((event) => number(event.start) + number(event.duration)));
  const span = Math.max(1, maximum - minimum);
  const [selected, setSelected] = useState(0);
  const active = events[selected] || {};
  const unitLabel = text(spec.config.unit, text(spec.config.unitLabel, "相对时间单位"));
  const tickStep = Math.max(1, Math.ceil((maximum - minimum) / 10));
  const regularTicks = Array.from({ length: Math.floor((maximum - minimum) / tickStep) + 1 }, (_, index) => minimum + index * tickStep);
  const ticks = regularTicks.at(-1) === maximum ? regularTicks : [...regularTicks, maximum];

  return (
    <div className="knowledge-timeline">
      <p className="knowledge-timeline-unit">坐标单位：{unitLabel} · {minimum}—{maximum}</p>
      <div className="knowledge-timeline-scroll">
        <div className="knowledge-timeline-axis"><span>通道</span><div>{ticks.map((tick) => <b key={tick} style={frameStyle("--tick-position", `${(tick - minimum) / span * 100}%`)}>{tick}</b>)}</div></div>
        <div className="knowledge-timeline-grid">
          {laneInfo.map((lane) => <div className="knowledge-timeline-lane" key={lane.id}><strong>{lane.label}</strong><div>{events.map((event, eventIndex) => {
          const eventLane = text(event.lane, text(event.laneId));
          if (eventLane && eventLane !== lane.id && eventLane !== lane.label) return null;
          if (!eventLane && lane.id !== laneInfo[0]?.id) return null;
          const left = (number(event.start) - minimum) / span * 100;
          const width = number(event.duration) / span * 100;
          return <button key={`${text(event.label)}-${eventIndex}`} type="button" className={`tone-${tone(event.tone)} ${eventIndex === selected ? "is-selected" : ""}`} style={{ ...frameStyle("--event-start", `${left}%`), ...frameStyle("--event-duration", `${Math.max(3, width)}%`) }} onClick={() => setSelected(eventIndex)} aria-pressed={eventIndex === selected}><span>{text(event.label)}</span><small>{number(event.start)} + {number(event.duration)}</small></button>;
          })}</div></div>)}
        </div>
      </div>
      <div className="knowledge-visual-observation" aria-live="polite"><span>TIME</span><p><strong>{text(active.label)}</strong>{text(active.note)}（开始 {number(active.start)}，持续 {number(active.duration)} {unitLabel}）</p></div>
    </div>
  );
}

function StandardComparison({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const rawColumns = Array.isArray(spec.config.columns) ? spec.config.columns : [];
  const columns = rawColumns.map((column, index) => {
    const value = record(column);
    return { id: text(value.id, typeof column === "string" ? column : String(index)), label: text(value.label, typeof column === "string" ? column : `对象 ${index + 1}`) };
  });
  const rows = records(spec.config.rows);
  const [selected, setSelected] = useState(0);
  const active = rows[selected] || {};
  const valuesFor = (row: UnknownRecord) => {
    if (Array.isArray(row.values)) return row.values.map((value) => text(value));
    const values = record(row.values);
    return columns.map((column) => text(values[column.id]));
  };
  return (
    <div className="knowledge-comparison">
      <div className="knowledge-comparison-table" role="table" aria-label={spec.title}>
        <div className="knowledge-comparison-row is-head" role="row" style={frameStyle("--comparison-columns", String(columns.length))}><span role="columnheader">比较维度</span>{columns.map((column) => <strong role="columnheader" key={column.id}>{column.label}</strong>)}</div>
        {rows.map((row, index) => <button type="button" className={`knowledge-comparison-row ${index === selected ? "is-selected" : ""}`} role="row" style={frameStyle("--comparison-columns", String(columns.length))} key={`${text(row.dimension, text(row.label))}-${index}`} onClick={() => setSelected(index)}><span role="rowheader">{text(row.dimension, text(row.label, `维度 ${index + 1}`))}</span>{valuesFor(row).map((value, valueIndex) => <b role="cell" key={`${value}-${valueIndex}`}>{value}</b>)}</button>)}
      </div>
      <p className="knowledge-visual-live" aria-live="polite">当前比较：{text(active.dimension, text(active.label, "未选择"))}。</p>
    </div>
  );
}

function LayeredStacksComparison({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const rawColumns = Array.isArray(spec.config.columns) ? spec.config.columns : [];
  const columns = rawColumns.map((column, index) => {
    const value = record(column);
    return { id: text(value.id, typeof column === "string" ? column : String(index)), label: text(value.label, typeof column === "string" ? column : `对象 ${index + 1}`) };
  });
  const stacks = records(spec.config.stacks);
  const [selected, setSelected] = useState(0);
  const active = stacks[selected] || {};
  const labelFor = (stack: UnknownRecord, index: number) => columns.find((column) => column.id === text(stack.id))?.label || text(stack.label, `方案 ${index + 1}`);

  return (
    <div className="knowledge-layered-stacks">
      <div className="knowledge-layered-tabs" role="group" aria-label={`${spec.title} 的分层方案`}>
        {stacks.map((stack, index) => <button key={text(stack.id, String(index))} type="button" className={index === selected ? "is-selected" : ""} aria-pressed={index === selected} onClick={() => setSelected(index)}>{labelFor(stack, index)}</button>)}
      </div>
      <div className="knowledge-layered-stack-grid">
        {stacks.map((stack, stackIndex) => {
          const layers = records(stack.layers);
          const isSelected = stackIndex === selected;
          return (
            <article key={text(stack.id, String(stackIndex))} className={`knowledge-layered-stack ${isSelected ? "is-selected" : ""}`}>
              <button type="button" className="knowledge-layered-stack-head" aria-pressed={isSelected} onClick={() => setSelected(stackIndex)}><span>{text(stack.eyebrow, `方案 ${stackIndex + 1}`)}</span><strong>{labelFor(stack, stackIndex)}</strong><small>{text(stack.subtitle)}</small></button>
              <ol aria-label={`${labelFor(stack, stackIndex)} 的自上而下分层`}>
                {layers.map((layer, layerIndex) => <li key={`${text(layer.label)}-${layerIndex}`} className={`tone-${tone(layer.tone)}`}><strong>{text(layer.label)}</strong>{text(layer.detail) ? <small>{text(layer.detail)}</small> : null}</li>)}
              </ol>
              {text(stack.examples) || text(stack.path) ? <footer>{text(stack.examples) ? <span><b>实例：</b>{text(stack.examples)}</span> : null}{text(stack.path) ? <small>{text(stack.path)}</small> : null}</footer> : null}
            </article>
          );
        })}
      </div>
      <div className="knowledge-visual-observation" aria-live="polite"><span>重点</span><p><strong>{labelFor(active, selected)}</strong>{text(active.summary)}</p></div>
    </div>
  );
}

function Comparison({ spec }: { spec: KnowledgeVisualizationSpec }) {
  if (text(spec.config.layout) === "layered-stacks") return <LayeredStacksComparison spec={spec} />;
  return <StandardComparison spec={spec} />;
}

function AddressFields({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const totalBits = number(spec.config.totalBits, 1);
  const fields = records(spec.config.fields);
  const [selected, setSelected] = useState(0);
  const active = fields[selected] || {};
  const ranges = fields.map((field, index) => {
    const consumedBits = fields.slice(0, index).reduce((sum, previous) => sum + number(previous.bits), 0);
    const high = totalBits - 1 - consumedBits;
    const bits = number(field.bits);
    const low = high - bits + 1;
    return bits === 1 ? `[${high}]` : `[${high}:${low}]`;
  });
  return (
    <div className="knowledge-address">
      <div className="knowledge-address-ruler"><span>{totalBits - 1}</span><b>{totalBits} bit</b><span>0</span></div>
      <div className="knowledge-address-fields" role="group" aria-label={`${totalBits} 位地址字段`}>
        {fields.map((field, index) => <button key={`${text(field.label)}-${index}`} type="button" className={`tone-${tone(field.tone)} ${index === selected ? "is-selected" : ""}`} style={frameStyle("--field-share", `${number(field.bits)}`)} onClick={() => setSelected(index)} aria-pressed={index === selected}><span>{text(field.label)}</span><strong>{number(field.bits)} bit</strong><small>{ranges[index]}</small></button>)}
      </div>
      <div className="knowledge-visual-observation" aria-live="polite"><span>FIELD</span><p><strong>{text(active.label)} · {number(active.bits)} bit</strong>{text(active.note)}</p></div>
    </div>
  );
}

function StepControls({
  steps,
  stepIndex,
  setStepIndex,
  label = "执行步骤",
}: {
  steps: UnknownRecord[];
  stepIndex: number;
  setStepIndex: (next: number) => void;
  label?: string;
}) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const onKeyDown = useArrowNavigation(steps.length, stepIndex, setStepIndex, (next) => buttons.current[next]?.focus());
  return (
    <div className="knowledge-visual-stepper" role="group" aria-label={label} onKeyDown={onKeyDown}>
      <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>← 上一步</button>
      <div className="knowledge-step-dots">
        {steps.map((step, index) => <button ref={(node) => { buttons.current[index] = node; }} key={`${text(step.label)}-${index}`} type="button" tabIndex={index === stepIndex ? 0 : -1} aria-label={`第 ${index + 1} 步：${text(step.label)}`} aria-current={index === stepIndex ? "step" : undefined} onClick={() => setStepIndex(index)}>{index + 1}</button>)}
      </div>
      <button type="button" onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))} disabled={stepIndex >= steps.length - 1}>下一步 →</button>
    </div>
  );
}

type BankerTraceStep = {
  work: number[];
  completed: number[];
  eligible: number[];
  selected: number | null;
  note: string;
  unsafe?: boolean;
  done?: boolean;
};

function vectorLabel(vector: number[]) {
  return `(${vector.join(", ")})`;
}

function buildBankerTrace(available: number[], maximum: number[][], allocation: number[][]): { safe: boolean; steps: BankerTraceStep[] } {
  const need = maximum.map((row, rowIndex) => row.map((value, columnIndex) => value - allocation[rowIndex][columnIndex]));
  const work = [...available];
  const finished = Array.from({ length: maximum.length }, () => false);
  const completed: number[] = [];
  const eligibleFor = () => maximum.map((_, index) => index).filter((index) => !finished[index] && need[index].every((value, columnIndex) => value <= work[columnIndex]));
  const steps: BankerTraceStep[] = [{
    work: [...work],
    completed: [],
    eligible: eligibleFor(),
    selected: null,
    note: `初始 Work=${vectorLabel(work)}；先从 Need 不大于 Work 的进程中任选一个。`,
  }];

  while (completed.length < maximum.length) {
    const eligible = eligibleFor();
    if (!eligible.length) {
      steps.push({
        work: [...work],
        completed: [...completed],
        eligible: [],
        selected: null,
        unsafe: true,
        note: "没有任何未完成进程满足 Need ≤ Work；当前数据没有安全序列，系统处于不安全状态。",
      });
      return { safe: false, steps };
    }
    const selected = eligible[0];
    work.forEach((value, index) => { work[index] = value + allocation[selected][index]; });
    finished[selected] = true;
    completed.push(selected);
    steps.push({
      work: [...work],
      completed: [...completed],
      eligible,
      selected,
      note: `选择 P${selected}，回收 Allocation${selected}=${vectorLabel(allocation[selected])}，Work 更新为 ${vectorLabel(work)}。`,
    });
  }
  steps.push({
    work: [...work],
    completed: [...completed],
    eligible: [],
    selected: null,
    done: true,
    note: `所有进程都能完成，得到安全序列 ${completed.map((index) => `P${index}`).join(" → ")}。`,
  });
  return { safe: true, steps };
}

function BankerSimulator({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const resourceNames = (Array.isArray(spec.config.resources) ? spec.config.resources : []).map((item, index) => text(item, `R${index}`));
  const processNames = (Array.isArray(spec.config.processes) ? spec.config.processes : []).map((item, index) => text(item, `P${index}`));
  const vectorFrom = (value: unknown) => resourceNames.map((_, index) => Math.max(0, Math.trunc(number(Array.isArray(value) ? value[index] : undefined))));
  const matrixFrom = (value: unknown) => processNames.map((_, rowIndex) => vectorFrom(Array.isArray(value) ? value[rowIndex] : undefined));
  const [available, setAvailable] = useState(() => vectorFrom(spec.config.available));
  const [maximum, setMaximum] = useState(() => matrixFrom(spec.config.max));
  const [allocation, setAllocation] = useState(() => matrixFrom(spec.config.allocation));
  const [stepIndex, setStepIndex] = useState(-1);
  const need = maximum.map((row, rowIndex) => row.map((value, columnIndex) => value - allocation[rowIndex][columnIndex]));
  const valid = available.every((value) => value >= 0) && maximum.every((row) => row.every((value) => value >= 0)) && allocation.every((row, rowIndex) => row.every((value, columnIndex) => value >= 0 && value <= maximum[rowIndex][columnIndex]));
  const trace = valid ? buildBankerTrace(available, maximum, allocation) : { safe: false, steps: [] as BankerTraceStep[] };
  const stepRecords = trace.steps.map((step, index) => ({ label: index === 0 ? "初始 Work" : step.done ? "安全序列" : step.unsafe ? "不安全" : `回收 P${step.selected}`, note: step.note }));
  const active = stepIndex >= 0 ? trace.steps[Math.min(stepIndex, trace.steps.length - 1)] : null;
  const activeEligible = new Set(active?.eligible || []);
  const completed = new Set(active?.completed || []);

  const changeAvailable = (columnIndex: number, value: string) => {
    const next = Math.max(0, Math.trunc(Number(value) || 0));
    setAvailable((current) => current.map((item, index) => index === columnIndex ? next : item));
    setStepIndex(-1);
  };
  const changeMatrix = (kind: "max" | "allocation", rowIndex: number, columnIndex: number, value: string) => {
    const next = Math.max(0, Math.trunc(Number(value) || 0));
    const setter = kind === "max" ? setMaximum : setAllocation;
    setter((current) => current.map((row, matrixRowIndex) => matrixRowIndex === rowIndex ? row.map((item, column) => column === columnIndex ? next : item) : row));
    setStepIndex(-1);
  };

  return (
    <div className="banker-simulator">
      <div className="banker-editor-intro"><span>可编辑初始状态</span><p>Need 自动按 Max − Allocation 计算；任何 Allocation 大于 Max 的输入都会阻止安全性检查。</p></div>
      <div className="banker-available-editor" role="group" aria-label="可用资源 Available">
        <strong>Available</strong>
        {resourceNames.map((name, columnIndex) => <label key={name}>{name}<input aria-label={`Available ${name}`} type="number" min="0" value={available[columnIndex]} onChange={(event) => changeAvailable(columnIndex, event.currentTarget.value)} /></label>)}
      </div>
      <div className="banker-table-wrap">
        <table className="banker-matrix" aria-label="可编辑的银行家算法资源矩阵">
          <thead>
            <tr><th rowSpan={2}>进程</th><th colSpan={resourceNames.length}>Max</th><th colSpan={resourceNames.length}>Allocation</th><th colSpan={resourceNames.length}>Need（自动计算）</th></tr>
            <tr>{["Max", "Allocation", "Need"].flatMap((group) => resourceNames.map((name) => <th key={`${group}-${name}`}>{name}</th>))}</tr>
          </thead>
          <tbody>
            {processNames.map((name, rowIndex) => <tr key={name} className={`${completed.has(rowIndex) ? "is-completed" : ""} ${active?.selected === rowIndex ? "is-selected" : ""} ${activeEligible.has(rowIndex) && !completed.has(rowIndex) ? "is-eligible" : ""}`}>
              <th scope="row">{name}{completed.has(rowIndex) ? <small>已回收</small> : activeEligible.has(rowIndex) ? <small>可完成</small> : null}</th>
              {resourceNames.map((resource, columnIndex) => <td key={`max-${resource}`}><input aria-label={`${name} Max ${resource}`} type="number" min="0" value={maximum[rowIndex][columnIndex]} onChange={(event) => changeMatrix("max", rowIndex, columnIndex, event.currentTarget.value)} /></td>)}
              {resourceNames.map((resource, columnIndex) => <td key={`allocation-${resource}`}><input aria-label={`${name} Allocation ${resource}`} type="number" min="0" value={allocation[rowIndex][columnIndex]} onChange={(event) => changeMatrix("allocation", rowIndex, columnIndex, event.currentTarget.value)} /></td>)}
              {resourceNames.map((resource, columnIndex) => <td key={`need-${resource}`} className={need[rowIndex][columnIndex] < 0 ? "is-invalid" : ""}>{need[rowIndex][columnIndex]}</td>)}
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="banker-actions">
        <button type="button" onClick={() => setStepIndex(0)} disabled={!valid}>开始安全性检查</button>
        <button type="button" className="is-reset" onClick={() => setStepIndex(-1)}>清除步骤</button>
        {!valid ? <p role="alert">请保证每个 Allocation 不大于同位置的 Max。</p> : null}
      </div>
      {active ? <>
        <div className={`banker-work ${active.unsafe ? "is-unsafe" : active.done ? "is-safe" : ""}`} aria-live="polite"><span>Work</span>{active.work.map((value, index) => <b key={`${resourceNames[index]}-${value}`}>{resourceNames[index]} <i>{value}</i></b>)}<strong>{active.unsafe ? "不安全" : active.done ? "安全" : "推演中"}</strong></div>
        <StepControls steps={stepRecords} stepIndex={Math.min(stepIndex, stepRecords.length - 1)} setStepIndex={setStepIndex} label="银行家安全性检查步骤" />
        <div className="knowledge-visual-observation banker-observation" aria-live="polite"><span>{String(Math.min(stepIndex + 1, stepRecords.length)).padStart(2, "0")}</span><p><strong>{stepRecords[Math.min(stepIndex, stepRecords.length - 1)]?.label}</strong>{active.note}</p></div>
        {active.done ? <p className="banker-sequence">安全序列：{active.completed.map((index) => processNames[index]).join(" → ")}</p> : null}
      </> : <p className="knowledge-visual-caption">当前示例的首次可完成顺序是 P1、P3、P0、P2、P4；你可以改动数字后重新检查。</p>}
    </div>
  );
}

function ResourceAllocationGraph({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const cases = records(spec.config.cases);
  const [selected, setSelected] = useState(0);
  const active = cases[selected] || {};
  const nodes = records(active.nodes);
  const edges = records(active.edges);
  const processes = nodes.filter((node) => text(node.kind) === "process");
  const resources = nodes.filter((node) => text(node.kind) === "resource");
  const height = Math.max(250, Math.max(processes.length, resources.length) * 92 + 66);
  const positionById = new Map<string, { x: number; y: number; kind: string }>();
  processes.forEach((node, index) => positionById.set(text(node.id), { x: 108, y: 56 + index * 92, kind: "process" }));
  resources.forEach((node, index) => positionById.set(text(node.id), { x: 338, y: 56 + index * 92, kind: "resource" }));
  const endpoint = (node: { x: number; y: number; kind: string }, towardRight: boolean) => ({ x: node.x + (node.kind === "process" ? (towardRight ? 26 : -26) : (towardRight ? 34 : -34)), y: node.y });

  return (
    <div className="resource-allocation-graph">
      <div className="resource-graph-options" role="group" aria-label="选择资源分配图例子">
        {cases.map((item, index) => <button type="button" key={text(item.id, String(index))} className={index === selected ? "is-selected" : ""} aria-pressed={index === selected} onClick={() => setSelected(index)}><small>{String(index + 1).padStart(2, "0")}</small>{text(item.label)}</button>)}
      </div>
      <div className="resource-graph-canvas">
        <svg viewBox={`0 0 446 ${height}`} role="img" aria-label={`${text(active.label)}的资源分配图`}>
          <defs><marker id={`${spec.id}-arrow-request`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" /></marker><marker id={`${spec.id}-arrow-allocation`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" /></marker></defs>
          {edges.map((edge, index) => {
            const from = positionById.get(text(edge.from));
            const to = positionById.get(text(edge.to));
            if (!from || !to) return null;
            const fromPoint = endpoint(from, to.x > from.x);
            const toPoint = endpoint(to, from.x > to.x);
            const kind = text(edge.kind);
            return <line key={`${text(edge.from)}-${text(edge.to)}-${index}`} className={`resource-graph-edge is-${kind}`} x1={fromPoint.x} y1={fromPoint.y} x2={toPoint.x} y2={toPoint.y} markerEnd={`url(#${spec.id}-arrow-${kind})`} />;
          })}
          {nodes.map((node, index) => {
            const position = positionById.get(text(node.id));
            if (!position) return null;
            const isResource = position.kind === "resource";
            const instances = Math.max(1, number(node.instances, 1));
            const available = Math.max(0, number(node.available));
            return <g key={`${text(node.id)}-${index}`} className={`resource-graph-node is-${position.kind}`} transform={`translate(${position.x} ${position.y})`}>
              {isResource ? <><rect x="-34" y="-27" width="68" height="54" rx="11" /><text y="-5">{text(node.label)}</text><text className="resource-graph-count" y="16">{instances} 实例 · 余 {available}</text></> : <><circle r="27" /><text y="5">{text(node.label)}</text></>}
            </g>;
          })}
        </svg>
      </div>
      <div className="resource-graph-legend"><span><i className="is-request" />请求边 P → R</span><span><i className="is-allocation" />分配边 R → P</span></div>
      <div className="knowledge-visual-observation" aria-live="polite"><span>判断</span><p><strong>{text(active.label)}</strong>{text(active.conclusion)}</p></div>
    </div>
  );
}

function CodePanels({ panes, activeCode }: { panes: UnknownRecord[]; activeCode: unknown }) {
  const activeLines = new Map<string, Set<number>>();
  for (const active of records(activeCode)) {
    const paneId = text(active.pane);
    const lines = Array.isArray(active.lines) ? active.lines.filter((line): line is number => Number.isInteger(line)) : [];
    activeLines.set(paneId, new Set(lines));
  }
  return (
    <div className="knowledge-code-panels" aria-label="与当前步骤对应的代码">
      {panes.map((pane, paneIndex) => {
        const paneId = text(pane.id, String(paneIndex));
        const lines = Array.isArray(pane.lines) ? pane.lines : [];
        const highlighted = activeLines.get(paneId) || new Set<number>();
        return <section key={paneId}><header>{text(pane.label, paneId)}</header><pre><code>{lines.map((line, lineIndex) => <span key={`${paneId}-${lineIndex}`} className={highlighted.has(lineIndex) ? "is-active" : ""}><i>{String(lineIndex + 1).padStart(2, "0")}</i>{text(line)}</span>)}</code></pre></section>;
      })}
    </div>
  );
}

function BoundedBufferState({ config, step }: { config: UnknownRecord; step: UnknownRecord }) {
  const buffer = Array.isArray(step.buffer) ? step.buffer : [];
  const counters = records(config.counters);
  const values = record(step.counters);
  return (
    <div className="semaphore-buffer-state">
      <section className="semaphore-buffer" aria-label="有限缓冲区">
        <header><strong>有限缓冲区</strong><span>{buffer.length} 个槽位</span></header>
        <div>{buffer.map((item, index) => <span key={`slot-${index}`} className={text(item) ? "is-filled" : ""}><small>槽 {index + 1}</small><b>{text(item, "空")}</b></span>)}</div>
      </section>
      <section className="semaphore-counters" aria-label="信号量状态">
        {counters.map((counter, index) => <div key={text(counter.id, String(index))}><span>{text(counter.label)}</span><b>{number(values[text(counter.id)])}</b><small>{text(counter.note)}</small></div>)}
      </section>
    </div>
  );
}

function DiningPhilosophersState({ config, step }: { config: UnknownRecord; step: UnknownRecord }) {
  const philosophers = Array.isArray(config.philosophers) ? config.philosophers.map((item) => text(item)) : [];
  const forks = Array.isArray(config.forks) ? config.forks.map((item) => text(item)) : [];
  const owners = Array.isArray(step.forkOwners) ? step.forkOwners.map((item) => text(item)) : [];
  const states = Array.isArray(step.states) ? step.states.map((item) => text(item)) : [];
  const actor = text(step.actor);
  const position = (index: number, count: number, radius: number, offset = -90) => {
    const radians = (offset + index * 360 / count) * Math.PI / 180;
    return { left: `${50 + radius * Math.cos(radians)}%`, top: `${50 + radius * Math.sin(radians)}%` };
  };
  return (
    <div className="semaphore-dining-state" aria-label="哲学家与叉子状态">
      <div className="semaphore-ring">
        <div className="semaphore-ring-center">非对称<br />拿叉</div>
        {philosophers.map((philosopher, index) => <div className={`semaphore-philosopher ${actor === philosopher ? "is-active" : ""}`} key={philosopher} style={position(index, philosophers.length, 39)}><strong>{philosopher}</strong><small>{states[index]}</small></div>)}
        {forks.map((fork, index) => <div className={`semaphore-fork ${owners[index] ? "is-held" : ""}`} key={fork} style={position(index, forks.length, 23, -54)}><strong>{fork}</strong><small>{owners[index] ? `由 ${owners[index]} 持有` : "空闲"}</small></div>)}
      </div>
    </div>
  );
}

function SemaphoreLab({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const mode = text(spec.config.mode);
  const steps = records(spec.config.steps);
  const panes = records(spec.config.code);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  return (
    <div className="semaphore-lab">
      {mode === "bounded-buffer" ? <BoundedBufferState config={spec.config} step={step} /> : <DiningPhilosophersState config={spec.config} step={step} />}
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label="信号量步骤" />
      <CodePanels panes={panes} activeCode={step.activeCode} />
      <div className="knowledge-visual-observation semaphore-observation" aria-live="polite"><span>{text(step.actor, "系统")}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
    </div>
  );
}

function ConcurrencyLab({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const scenarios = records(spec.config.scenarios);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const scenario = scenarios[scenarioIndex] || {};
  const actors = records(scenario.actors);
  const shared = records(scenario.shared);
  const queues = records(scenario.queues);
  const panes = records(scenario.code);
  const steps = records(scenario.steps);
  const step = steps[stepIndex] || {};
  const actorState = record(step.actors);
  const sharedState = record(step.shared);
  const queueState = record(step.queues);
  const activeActor = text(step.actor);
  const actorById = new Map(actors.map((actor, index) => [text(actor.id, String(index)), actor]));
  const actorLabel = (id: string) => text(actorById.get(id)?.label, id);
  const queueMembers = (id: string) => Array.isArray(queueState[id]) ? queueState[id].map((item) => text(item)).filter(Boolean) : [];

  const selectScenario = (index: number) => {
    setScenarioIndex(index);
    setStepIndex(0);
  };

  return (
    <div className="concurrency-lab">
      {scenarios.length > 1 ? <div className="concurrency-scenarios" role="group" aria-label="选择并发场景">{scenarios.map((item, index) => <button key={text(item.id, String(index))} type="button" className={index === scenarioIndex ? "is-selected" : ""} aria-pressed={index === scenarioIndex} onClick={() => selectScenario(index)}><small>{String(index + 1).padStart(2, "0")}</small>{text(item.label, `场景 ${index + 1}`)}</button>)}</div> : null}
      <div className="concurrency-intro"><span>{text(scenario.label, "并发场景")}</span><p>{text(scenario.summary)}</p></div>
      <div className="concurrency-board">
        <section className="concurrency-actors" aria-label="参与线程或任务状态"><header><span>参与方</span><strong>当前状态</strong></header><div>{actors.map((actor, actorIndex) => {
          const id = text(actor.id, String(actorIndex));
          return <article key={id} className={`tone-${tone(actor.tone)} ${id === activeActor ? "is-active" : ""}`}><i aria-hidden="true" /><div><strong>{text(actor.label, id)}</strong><small>{text(actorState[id], text(actor.detail, "未参与当前步骤"))}</small></div></article>;
        })}</div></section>
        <section className="concurrency-shared" aria-label="共享状态"><header><span>共享状态</span><strong>变量 / 资源</strong></header><div>{shared.map((item, itemIndex) => {
          const id = text(item.id, String(itemIndex));
          return <article key={id} className={`tone-${tone(item.tone)}`}><span>{text(item.label, id)}</span><b>{text(sharedState[id], "—")}</b><small>{text(item.detail)}</small></article>;
        })}</div></section>
      </div>
      {queues.length ? <section className="concurrency-queues" aria-label="等待与就绪队列"><header><span>队列</span><strong>本步结束后</strong></header><div>{queues.map((queue, queueIndex) => {
        const id = text(queue.id, String(queueIndex));
        const members = queueMembers(id);
        return <article key={id} className={`tone-${tone(queue.tone)}`}><div><strong>{text(queue.label, id)}</strong><small>{text(queue.detail)}</small></div><ol>{members.length ? members.map((member, memberIndex) => <li key={`${member}-${memberIndex}`}>{actorLabel(member)}</li>) : <li className="is-empty">空</li>}</ol></article>;
      })}</div></section> : null}
      <StepControls steps={steps} stepIndex={stepIndex} setStepIndex={setStepIndex} label={`${text(scenario.label, "并发")}步骤`} />
      <CodePanels panes={panes} activeCode={step.activeCode} />
      <div className="knowledge-visual-observation concurrency-observation" aria-live="polite"><span>{actorLabel(activeActor)}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
      {text(step.outcome) ? <p className="concurrency-outcome"><strong>此刻结论：</strong>{text(step.outcome)}</p> : null}
    </div>
  );
}

function VisualBody({ spec }: { spec: KnowledgeVisualizationSpec }) {
  if (spec.type === "growth-curves") return <GrowthCurves spec={spec} />;
  if (spec.type === "algorithm-trace") return <AlgorithmTrace spec={spec} />;
  if (spec.type === "memory-scale") return <MemoryScale spec={spec} />;
  if (spec.type === "process-flow") return <ProcessFlow spec={spec} />;
  if (spec.type === "state-machine") return <StateMachine spec={spec} />;
  if (spec.type === "timeline") return <Timeline spec={spec} />;
  if (spec.type === "comparison") return <Comparison spec={spec} />;
  if (spec.type === "banker-simulator") return <BankerSimulator spec={spec} />;
  if (spec.type === "resource-allocation-graph") return <ResourceAllocationGraph spec={spec} />;
  if (spec.type === "semaphore-lab") return <SemaphoreLab spec={spec} />;
  if (spec.type === "scheduler-queue") return <SchedulerQueueTrace spec={spec} />;
  if (spec.type === "concurrency-lab") return <ConcurrencyLab spec={spec} />;
  return <AddressFields spec={spec} />;
}

export function KnowledgeVisual({ spec }: { spec: KnowledgeVisualizationSpec }) {
  return (
    <section className={`knowledge-visual knowledge-visual-${spec.type}`} aria-labelledby={`${spec.id}-title`} data-visual-id={spec.id}>
      <header className="knowledge-visual-head">
        <span>{visualTypeLabels[spec.type]}</span>
        <div><h3 id={`${spec.id}-title`}>{spec.title}</h3><p>{spec.summary}</p></div>
      </header>
      <VisualBody spec={spec} />
    </section>
  );
}
