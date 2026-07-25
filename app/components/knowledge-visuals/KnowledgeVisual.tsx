"use client";

import { type CSSProperties, type KeyboardEvent, useState } from "react";
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

function useArrowNavigation(length: number, index: number, setIndex: (next: number) => void) {
  return (event: KeyboardEvent<HTMLElement>) => {
    if (!length || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") setIndex(0);
    else if (event.key === "End") setIndex(length - 1);
    else setIndex((index + (event.key === "ArrowRight" ? 1 : -1) + length) % length);
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

function AlgorithmTrace({ spec }: { spec: KnowledgeVisualizationSpec }) {
  const items = Array.isArray(spec.config.items) ? spec.config.items : [];
  const steps = records(spec.config.steps);
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex] || {};
  const activeIndexes = new Set((Array.isArray(step.active) ? step.active : []).filter((item): item is number => Number.isInteger(item)));
  const range = Array.isArray(step.range) && step.range.length === 2 ? step.range.map((value) => number(value)) : null;
  const onStepKeyDown = useArrowNavigation(steps.length, stepIndex, setStepIndex);

  return (
    <div className="knowledge-trace">
      <div className="knowledge-trace-items" role="img" aria-label={`第 ${stepIndex + 1} 步的数据状态`}>
        {items.map((item, index) => {
          const inRange = !range || (index >= range[0] && index <= range[1]);
          return <span key={`${text(item)}-${index}`} className={`${inRange ? "is-in-range" : "is-out-range"} ${activeIndexes.has(index) ? "is-active" : ""}`}><small>{index}</small><b>{text(item)}</b></span>;
        })}
      </div>
      <div className="knowledge-visual-stepper" role="group" aria-label="执行步骤" onKeyDown={onStepKeyDown}>
        <button type="button" onClick={() => setStepIndex(Math.max(0, stepIndex - 1))} disabled={stepIndex === 0}>← 上一步</button>
        <div className="knowledge-step-dots">
          {steps.map((item, index) => <button key={`${text(item.label)}-${index}`} type="button" aria-label={`第 ${index + 1} 步：${text(item.label)}`} aria-current={index === stepIndex ? "step" : undefined} onClick={() => setStepIndex(index)}>{index + 1}</button>)}
        </div>
        <button type="button" onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))} disabled={stepIndex >= steps.length - 1}>下一步 →</button>
      </div>
      <div className="knowledge-visual-observation" aria-live="polite"><span>{String(stepIndex + 1).padStart(2, "0")}</span><p><strong>{text(step.label)}</strong>{text(step.note)}</p></div>
    </div>
  );
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

function ProcessFlow({ spec }: { spec: KnowledgeVisualizationSpec }) {
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

function Comparison({ spec }: { spec: KnowledgeVisualizationSpec }) {
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

function VisualBody({ spec }: { spec: KnowledgeVisualizationSpec }) {
  if (spec.type === "growth-curves") return <GrowthCurves spec={spec} />;
  if (spec.type === "algorithm-trace") return <AlgorithmTrace spec={spec} />;
  if (spec.type === "memory-scale") return <MemoryScale spec={spec} />;
  if (spec.type === "process-flow") return <ProcessFlow spec={spec} />;
  if (spec.type === "state-machine") return <StateMachine spec={spec} />;
  if (spec.type === "timeline") return <Timeline spec={spec} />;
  if (spec.type === "comparison") return <Comparison spec={spec} />;
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
