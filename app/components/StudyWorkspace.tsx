"use client";

/* eslint-disable @next/next/no-img-element -- Question-bank figures have source-provided dimensions. */

import Link from "@/app/components/SiteLink";
import { marked, Renderer } from "marked";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import { MermaidCodeBlocks } from "@/app/components/MermaidCodeBlocks";
import { StudyAnnotationSurface } from "@/app/components/StudyTools";
import {
  knowledgeById,
  questionSeeds,
  sectionSegments,
  segmentHref,
  type StudyQuestion,
} from "@/app/data/study";
import analyticsData from "@/app/data/analytics.json";
import importedQuestions from "@/app/data/questions.json";
import knowledgeIndexData from "@/app/data/knowledge-index.json";
import {
  subjectById,
  subjectCatalog,
  type SubjectId,
} from "@/app/data/catalog";
import {
  EMPTY_PROGRESS,
  MAX_QUESTION_NOTE_LENGTH,
  PROGRESS_STORAGE_KEY,
  QUESTION_NOTES_STORAGE_KEY,
  readLocalStudySnapshot,
  type PracticeProgress,
  type QuestionNotes,
} from "@/app/lib/local-study-data";
import type { LearningResource } from "@/app/lib/local-learning-library";
import { siteAssetPath, withSiteAssetPaths } from "@/app/lib/site-path";

type SubjectQuestion = StudyQuestion & { subject: SubjectId };
type TypeFilter = "all" | "choice" | "answer" | "wrong";
type AnalyticsView = "overview" | "knowledge" | "timeline" | "relations" | "questions";
type KnowledgeSort = "frequency" | "recent" | "answer";
type QuestionSideView = "answer" | "notes" | "knowledge" | "similar";
type AnalyticsArea = {
  id: string;
  name: string;
  count: number;
  share: number;
  answerCount: number;
  yearsCount: number;
  lastYear: number;
  longestStreak: number;
  recentCount: number;
  previousCount: number;
  recentRate: number;
  previousRate: number;
  momentum: number;
  yearSeries: number[];
  topTags: Array<{ name: string; count: number }>;
};
type AnalyticsTag = {
  name: string;
  areaId: string;
  count: number;
  answerCount: number;
  yearsCount: number;
  lastYear: number;
  recentCount: number;
  longestStreak: number;
  yearSeries: number[];
  questionIds: string[];
};
type AnalyticsRelation = {
  source: string;
  sourceName: string;
  target: string;
  targetName: string;
  count: number;
  yearsCount: number;
  lastYear: number;
  answerCount: number;
};
type SubjectAnalytics = {
  totals: {
    questions: number;
    years: number;
    choice: number;
    answer: number;
    uniqueTags: number;
    taggedQuestions: number;
    inferredQuestions: number;
    averagePerYear: number;
  };
  yearStats: Array<{
    year: number;
    questions: number;
    choice: number;
    answer: number;
    tagged: number;
    areas: Record<string, number>;
  }>;
  areas: AnalyticsArea[];
  fineTags: AnalyticsTag[];
  topTags: AnalyticsTag[];
  relations: AnalyticsRelation[];
};
type AnalyticsDataset = {
  range: { from: number; to: number; years: number[] };
  methodology: Record<string, string>;
  subjects: Record<SubjectId, SubjectAnalytics>;
};
type KnowledgeIndexDataset = {
  subjects: Record<SubjectId, {
    pageCount: number;
    mappedTagCount: number;
    tagRoutes: Record<string, { href: string; title: string }>;
    pages: Array<{ slug: string; route: string; title: string; questionIds: string[] }>;
  }>;
};
const PAGE_SIZE = 8;
const analytics = analyticsData as AnalyticsDataset;
const localKnowledgeIndex = knowledgeIndexData as KnowledgeIndexDataset;
const CHART_COLORS = ["#6658d9", "#2d9f78", "#ed8050", "#3d83d1", "#cf5c8c", "#c49527", "#6f8f59"];
const osKnowledgeIds = new Map(questionSeeds.map((question) => [question.id, question.knowledgeIds]));
const allQuestions = (importedQuestions as SubjectQuestion[]).map((question) => (
  question.subject === "os"
    ? { ...question, knowledgeIds: osKnowledgeIds.get(question.id) || [] }
    : question
));

function chartColor(index: number) {
  return CHART_COLORS[index % CHART_COLORS.length];
}

function colorWithAlpha(hex: string, alpha: number) {
  const value = Number.parseInt(hex.slice(1), 16);
  return `rgba(${value >> 16}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
}

function shortAreaName(name: string) {
  return name
    .replace("进程、线程与调度", "进程调度")
    .replace("内存与虚拟存储", "内存虚存")
    .replace("同步、互斥与死锁", "同步死锁")
    .replace("内核与系统调用", "内核调用")
    .replace("体系结构与物理层", "体系物理")
    .replace("可靠传输与接入", "可靠接入")
    .replace("总线与 I/O", "总线 I/O")
    .replace("数据表示与运算", "数据表示")
    .replace("指令系统", "指令")
    .replace("性能与体系结构", "体系性能")
    .slice(0, 6);
}

function questionTypeLabel(question: StudyQuestion) {
  if (question.questionType === "choice") return "选择题";
  if (question.questionType === "answer") return "解答题";
  return "练习题";
}

function pointsFor(question: StudyQuestion) {
  return question.knowledgeIds
    .map((id) => knowledgeById.get(id))
    .filter((point): point is NonNullable<typeof point> => Boolean(point));
}

function escapeMarkdownHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isSafeMarkdownHref(value: string) {
  return /^(?:https?:|mailto:|\/(?!\/)|\.\.?\/|#|\?)/i.test(value.trim());
}

function renderQuestionNoteMarkdown(value: string) {
  const renderer = new Renderer();
  renderer.html = ({ text }) => escapeMarkdownHtml(text);
  renderer.link = function link({ href, title, tokens }) {
    const label = this.parser.parseInline(tokens);
    if (!isSafeMarkdownHref(href)) return label;
    const safeHref = escapeMarkdownHtml(href);
    const safeTitle = title ? ` title="${escapeMarkdownHtml(title)}"` : "";
    return `<a href="${safeHref}"${safeTitle} target="_blank" rel="noreferrer">${label}</a>`;
  };
  // Notes stay text-first: images are represented by their alt text and raw HTML is escaped.
  renderer.image = ({ text }) => escapeMarkdownHtml(text);
  try {
    const html = marked.parse(value, { renderer, gfm: true, breaks: true });
    return typeof html === "string" ? html : "";
  } catch {
    return "";
  }
}

function nonInteractiveQuestionPreview(html: string) {
  return withSiteAssetPaths(html)
    .replace(/<a\b[^>]*>/gi, "")
    .replace(/<\/a>/gi, "")
    .replace(/<img\b[^>]*>/gi, '<span class="question-preview-image">含题图</span>');
}

function HomePage({ progress }: { progress: PracticeProgress }) {
  const completedSet = new Set(progress.completed);
  return (
    <div className="viewport-app home-viewport">
      <AppHeader completedCount={progress.completed.length} />
      <main className="home-main shell-width">
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="home-kicker">全国硕士研究生招生考试</p>
            <h1><strong>408</strong><span>真题</span></h1>
            <div className="home-hero-meta">
              <span>2009—2026</span>
              <span>{allQuestions.length} 道真题</span>
              <span>4 门科目</span>
            </div>
            <p className="home-hero-description">按科目进入题库，每页只做一道题。<br />进度、错题、收藏与笔记都会保存在本机。</p>
            <Link className="home-primary-action" href="/question/real-2026-1">从 2026 真题开始 <b>↗</b></Link>
          </div>
          <div className="home-visual">
            <img src={siteAssetPath("/hero-408-minimal-v5.png")} alt="栈与二叉树、CPU、操作系统窗口和网络路由器组成的四个 Q 版 408 知识点形象" />
          </div>
        </section>
        <section className="home-subjects" aria-label="选择科目">
          {subjectCatalog.map((subject) => {
            const questions = allQuestions.filter((question) => question.subject === subject.id);
            const completed = questions.filter((question) => completedSet.has(question.id)).length;
            return (
              <Link key={subject.id} href={`/subject/${subject.id}`} className={`home-subject-card accent-${subject.accent}`}>
                <div className="home-card-top"><span>{subject.index}</span><span>{completed} 已完成</span></div>
                <div className="home-card-title"><small>{subject.english}</small><h2>{subject.name}</h2></div>
                <div className="home-card-bottom">
                  <strong>{questions.length}<small> 题</small></strong>
                  <span>进入 ↗</span>
                </div>
                <div className="home-card-progress"><i style={{ width: `${questions.length ? completed / questions.length * 100 : 0}%` }} /></div>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}

function SubjectQuestionCard({ question, progress }: { question: SubjectQuestion; progress: PracticeProgress }) {
  const done = progress.completed.includes(question.id);
  const saved = progress.bookmarks.includes(question.id);
  const attempt = progress.attempts[question.id];
  return (
    <Link href={`/question/${question.id}`} className="subject-question-card">
      <div className="card-meta">
        <span>{question.year || "专项"} · {questionTypeLabel(question)}</span>
        <span>{saved ? "◆ " : ""}{attempt ? (attempt.correct === false ? "答错" : attempt.correct === true ? "答对" : "已作答") : done ? "✓" : ""}</span>
      </div>
      {question.promptHtml ? (
        <div
          className="question-card-markdown subject-question-card-markdown"
          dangerouslySetInnerHTML={{ __html: nonInteractiveQuestionPreview(question.promptHtml) }}
        />
      ) : <p className="question-card-markdown subject-question-card-markdown">{question.prompt}</p>}
      <div className="card-bottom"><span>{question.tags.slice(0, 2).join(" · ") || question.section}</span><b>作答 →</b></div>
    </Link>
  );
}

function OverviewDashboard({ data }: { data: SubjectAnalytics }) {
  const maxAreaCount = Math.max(...data.areas.map((area) => area.count), 1);
  const signalAreas = [...data.areas]
    .filter((area) => area.momentum !== 0)
    .sort((left, right) => Math.abs(right.momentum) - Math.abs(left.momentum))
    .slice(0, 4);
  const answerYieldAreas = [...data.areas]
    .map((area) => ({ ...area, yieldRate: area.count ? area.answerCount / area.count * 100 : 0 }))
    .sort((left, right) => right.yieldRate - left.yieldRate)
    .slice(0, 4);
  const maxYieldRate = Math.max(...answerYieldAreas.map((area) => area.yieldRate), 1);
  const priorityTags = [...data.topTags]
    .map((tag) => ({ ...tag, priorityScore: tag.count + tag.recentCount * 1.8 + tag.answerCount * 2.5 + tag.yearsCount * .2 }))
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, 5);

  return (
    <div className="analytics-overview">
      <section className="insight-panel overview-weight-panel">
          <div className="insight-panel-head"><div><span>MODULE WEIGHT</span><h2>知识模块权重</h2></div><small>涉及率＝相关题目 / 本科目真题</small></div>
          <div className="overview-weight-list">
            {data.areas.map((area, index) => (
              <div className="overview-weight-row" key={area.id}>
                <span style={{ color: chartColor(index) }}>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{area.name}</strong><small>{area.yearsCount} 年有考察</small></div>
                <div className="overview-weight-track"><i style={{ width: `${area.count / maxAreaCount * 100}%`, backgroundColor: chartColor(index) }} /></div>
                <b>{area.count}<small>题</small></b>
                <em>{area.share}%</em>
              </div>
            ))}
          </div>
          <p className="overview-method-note">同一道综合题可能同时覆盖两个模块，因此各模块涉及率不要求相加为 100%。</p>
        </section>

      <div className="overview-side-column">
        <section className="insight-panel overview-signal-panel">
          <div className="insight-panel-head compact"><div><span>RECENT SIGNAL</span><h2>近五年升降温</h2></div><small>对比 2017—2021</small></div>
          <div className="overview-signal-grid">
            {signalAreas.map((area) => (
              <div key={area.id} className={area.momentum > 0 ? "warming" : "cooling"}>
                <span>{area.momentum > 0 ? "升温" : "降温"}</span>
                <strong>{shortAreaName(area.name)}</strong>
                <b>{area.momentum > 0 ? "+" : ""}{area.momentum}<small>pt</small></b>
                <em>近五年占比 {area.recentRate}%</em>
              </div>
            ))}
          </div>
        </section>

        <section className="insight-panel overview-yield-panel">
          <div className="insight-panel-head compact"><div><span>LONG-ANSWER YIELD</span><h2>综合题产出率</h2></div><small>模块内综合题占比</small></div>
          <div className="overview-yield-list">
            {answerYieldAreas.map((area, index) => (
              <div key={area.id}>
                <span>{shortAreaName(area.name)}</span>
                <div><i style={{ width: `${area.yieldRate / maxYieldRate * 100}%`, backgroundColor: chartColor(index) }} /></div>
                <b>{area.yieldRate.toFixed(1)}%</b>
                <small>{area.answerCount} 道</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="insight-panel overview-priority-panel">
        <div className="priority-heading"><div><span>STUDY PRIORITY</span><h2>复习优先级</h2></div><small>综合总频次、近五年活跃度与综合题权重</small></div>
        <div className="priority-tag-grid">
          {priorityTags.map((tag, index) => (
            <div key={tag.name}>
              <span style={{ backgroundColor: chartColor(index) }}>{index + 1}</span>
              <strong>{tag.name}</strong>
              <p><b>{tag.count}</b> 题总频次 · 近五年 {tag.recentCount} 题</p>
              <small>{tag.answerCount ? `${tag.answerCount} 道综合题` : `覆盖 ${tag.yearsCount} 年`}</small>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function KnowledgeDashboard({ subjectId, data, onOpenQuestions }: { subjectId: SubjectId; data: SubjectAnalytics; onOpenQuestions: (tag: string, questionIds: string[]) => void }) {
  const [selectedAreaId, setSelectedAreaId] = useState(data.areas[0]?.id || "all");
  const [knowledgeQuery, setKnowledgeQuery] = useState("");
  const [sortBy, setSortBy] = useState<KnowledgeSort>("frequency");
  const [knowledgePage, setKnowledgePage] = useState(1);
  const safeAreaId = selectedAreaId === "all" || data.areas.some((area) => area.id === selectedAreaId) ? selectedAreaId : "all";
  const areaByAnalyticsId = new Map(data.areas.map((area) => [area.id, area]));
  const normalizedQuery = knowledgeQuery.trim().toLowerCase();
  const filteredTags = data.fineTags
    .filter((tag) => (safeAreaId === "all" || tag.areaId === safeAreaId) && (!normalizedQuery || tag.name.toLowerCase().includes(normalizedQuery)))
    .sort((left, right) => {
      if (sortBy === "recent") return right.recentCount - left.recentCount || right.count - left.count;
      if (sortBy === "answer") return right.answerCount - left.answerCount || right.count - left.count;
      return right.count - left.count || right.yearsCount - left.yearsCount;
    });
  const knowledgePageSize = 8;
  const totalKnowledgePages = Math.max(1, Math.ceil(filteredTags.length / knowledgePageSize));
  const safeKnowledgePage = Math.min(knowledgePage, totalKnowledgePages);
  const visibleTags = filteredTags.slice((safeKnowledgePage - 1) * knowledgePageSize, safeKnowledgePage * knowledgePageSize);
  const selectedArea = safeAreaId === "all" ? null : areaByAnalyticsId.get(safeAreaId);
  const setArea = (areaId: string) => {
    setSelectedAreaId(areaId);
    setKnowledgeQuery("");
    setKnowledgePage(1);
  };
  const setKnowledgeSort = (value: KnowledgeSort) => {
    setSortBy(value);
    setKnowledgePage(1);
  };
  const localTagRoutes = localKnowledgeIndex.subjects[subjectId].tagRoutes;

  return (
    <div className="knowledge-dashboard">
      <aside className="knowledge-modules insight-panel">
        <div className="knowledge-module-head"><span>MODULES</span><strong>知识模块</strong><small>{data.fineTags.length} 个细分考点</small></div>
        <div className="knowledge-module-list">
          <button className={safeAreaId === "all" ? "active" : ""} onClick={() => setArea("all")}><i style={{ backgroundColor: "#171815" }} /><span>全部考点</span><b>{data.fineTags.length}</b></button>
          {data.areas.map((area, index) => {
            const count = data.fineTags.filter((tag) => tag.areaId === area.id).length;
            return <button key={area.id} className={safeAreaId === area.id ? "active" : ""} onClick={() => setArea(area.id)}><i style={{ backgroundColor: chartColor(index) }} /><span>{area.name}</span><b>{count}</b></button>;
          })}
        </div>
        <p>细分标签来自 2009—2025 真题；2026 已计入模块趋势，不虚构缺失标签。</p>
      </aside>

      <section className="knowledge-browser insight-panel">
        <div className="knowledge-toolbar">
          <div><span>KNOWLEDGE POINTS</span><strong>{selectedArea?.name || "全部细分考点"}</strong><small>{filteredTags.length} 个结果</small></div>
          <div className="knowledge-controls">
            <label><span>⌕</span><input value={knowledgeQuery} onChange={(event) => { setKnowledgeQuery(event.target.value); setKnowledgePage(1); }} placeholder="搜索考点" /></label>
            <div className="knowledge-sort" aria-label="细分考点排序">
              <button className={sortBy === "frequency" ? "active" : ""} onClick={() => setKnowledgeSort("frequency")}>总频次</button>
              <button className={sortBy === "recent" ? "active" : ""} onClick={() => setKnowledgeSort("recent")}>近五年</button>
              <button className={sortBy === "answer" ? "active" : ""} onClick={() => setKnowledgeSort("answer")}>综合题</button>
            </div>
          </div>
        </div>

        <div className="knowledge-card-grid">
          {visibleTags.map((tag, index) => {
            const area = areaByAnalyticsId.get(tag.areaId);
            const areaIndex = data.areas.findIndex((item) => item.id === tag.areaId);
            const tagColor = chartColor(areaIndex >= 0 ? areaIndex : index);
            const maxSeries = Math.max(...tag.yearSeries, 1);
            const localArticle = localTagRoutes[tag.name];
            return (
              <article className="knowledge-point-card" key={tag.name}>
                <header>
                  <i style={{ backgroundColor: tagColor }} />
                  <div><strong>{tag.name}</strong><small>{area?.name} · 最近 {tag.lastYear}</small></div>
                  <b>{tag.count}<small>题</small></b>
                </header>
                <div className="knowledge-mini-trend" aria-label={`${tag.name} 2009 至 2026 年考察走势`}>
                  {tag.yearSeries.map((count, yearIndex) => <span key={analytics.range.years[yearIndex]} title={`${analytics.range.years[yearIndex]} 年 · ${count} 题`}><i style={{ height: count ? `${Math.max(20, count / maxSeries * 100)}%` : "3px", backgroundColor: count ? tagColor : "rgba(23,24,21,.08)" }} /></span>)}
                </div>
                <footer>
                  <span>近五年 <b>{tag.recentCount}</b></span>
                  <span>综合题 <b>{tag.answerCount}</b></span>
                  <span>覆盖 <b>{tag.yearsCount} 年</b></span>
                  {localArticle ? <Link className="knowledge-read-link" href={localArticle.href}>阅读知识点 ↗</Link> : null}
                  <button onClick={() => onOpenQuestions(tag.name, tag.questionIds)}>相关真题 →</button>
                </footer>
              </article>
            );
          })}
          {!visibleTags.length ? <div className="knowledge-empty"><strong>没有匹配的考点</strong><span>换一个模块或搜索词试试。</span></div> : null}
        </div>

        <div className="knowledge-pagination">
          <span>第 {safeKnowledgePage} / {totalKnowledgePages} 页</span>
          <div><button disabled={safeKnowledgePage <= 1} onClick={() => setKnowledgePage((value) => Math.max(1, value - 1))}>← 上一页</button><button disabled={safeKnowledgePage >= totalKnowledgePages} onClick={() => setKnowledgePage((value) => Math.min(totalKnowledgePages, value + 1))}>下一页 →</button></div>
        </div>
      </section>
    </div>
  );
}

function TimelineDashboard({ data }: { data: SubjectAnalytics }) {
  const trendAreas = [...data.areas].sort((left, right) => right.recentCount - left.recentCount);
  const yearlyDistributions = data.yearStats.map((year) => {
    const assignmentTotal = data.areas.reduce((sum, area) => sum + (year.areas[area.id] || 0), 0);
    return {
      ...year,
      assignmentTotal,
      segments: data.areas.map((area, index) => ({
        area,
        color: chartColor(index),
        count: year.areas[area.id] || 0,
        share: assignmentTotal ? (year.areas[area.id] || 0) / assignmentTotal * 100 : 0,
      })),
    };
  });
  const areaPolygons = data.areas.map((area, areaIndex) => {
    const topBoundary = yearlyDistributions.map((year, yearIndex) => {
      const lower = year.segments.slice(0, areaIndex).reduce((sum, segment) => sum + segment.share, 0);
      const upper = lower + year.segments[areaIndex].share;
      const x = yearIndex / (yearlyDistributions.length - 1) * 100;
      return `${x}% ${100 - upper}%`;
    });
    const bottomBoundary = [...yearlyDistributions].reverse().map((year, reverseIndex) => {
      const yearIndex = yearlyDistributions.length - 1 - reverseIndex;
      const lower = year.segments.slice(0, areaIndex).reduce((sum, segment) => sum + segment.share, 0);
      const x = yearIndex / (yearlyDistributions.length - 1) * 100;
      return `${x}% ${100 - lower}%`;
    });
    return { area, color: chartColor(areaIndex), clipPath: `polygon(${[...topBoundary, ...bottomBoundary].join(", ")})` };
  });
  const latestDistribution = yearlyDistributions.at(-1)!;

  return (
    <div className="analytics-timeline">
      <section className="insight-panel distribution-panel">
        <div className="insight-panel-head"><div><span>2009—2026</span><h2>知识模块年度分布</h2></div><small>每年模块归类总量＝100%</small></div>
        <div className="distribution-chart" aria-label="2009 至 2026 年连续知识模块百分比分布图">
          <div className="distribution-y-axis"><span>100%</span><span>75</span><span>50</span><span>25</span><span>0</span></div>
          <div className="distribution-plot">
            <div className="distribution-guides"><i /><i /><i /><i /><i /></div>
            <div className="distribution-area-layers">
              {areaPolygons.map((polygon) => <div key={polygon.area.id} className="distribution-area-layer" style={{ backgroundColor: polygon.color, clipPath: polygon.clipPath }} />)}
            </div>
            <div className="distribution-year-hitboxes">
              {yearlyDistributions.map((year) => (
                <span key={year.year} title={`${year.year} 年 · ${year.questions} 道真题｜${year.segments.map((segment) => `${segment.area.name} ${segment.share.toFixed(1)}%`).join("；")}`} />
              ))}
            </div>
            <div className="distribution-x-axis">{yearlyDistributions.map((year) => <b key={year.year}>{String(year.year).slice(2)}</b>)}</div>
          </div>
          <aside className="distribution-side-labels">
            <strong>2026 占比</strong>
            {[...latestDistribution.segments].reverse().map((segment) => <div key={segment.area.id}><i style={{ backgroundColor: segment.color }} /><span>{segment.area.name}</span><b>{segment.share.toFixed(1)}%</b></div>)}
          </aside>
        </div>
        <p className="distribution-note">连续色带表示占比随年份的扩张与收缩；每年按模块归类次数归一化为 100%。</p>
      </section>

      <section className="insight-panel timeline-notes">
        <div className="insight-panel-head"><div><span>SIGNALS</span><h2>时间信号</h2></div><small>按近五年题量</small></div>
        <div className="timeline-card-list">
          {trendAreas.map((area, index) => (
            <div className="timeline-card" key={area.id} style={{ borderLeftColor: chartColor(index) }}>
              <div><strong>{area.name}</strong><span>覆盖 {area.yearsCount} / 18 年</span></div>
              <b style={{ color: chartColor(index) }}>{area.recentCount}<small>近五年</small></b>
              <p>最长连续 {area.longestStreak} 年 · {area.momentum > 0 ? "升" : area.momentum < 0 ? "降" : "持平"} {Math.abs(area.momentum)}pt</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RelationsDashboard({ data }: { data: SubjectAnalytics }) {
  const answerTags = [...data.topTags].sort((left, right) => right.answerCount - left.answerCount || right.count - left.count).slice(0, 8);
  const stableAreas = [...data.areas].sort((left, right) => right.yearsCount - left.yearsCount || right.longestStreak - left.longestStreak);
  const maxAnswerCount = Math.max(...answerTags.map((tag) => tag.answerCount), 1);
  const maxRelationCount = Math.max(...data.relations.map((relation) => relation.count), 1);
  const relationKey = (left: string, right: string) => [left, right].sort().join("|");
  const relationMap = new Map(data.relations.map((relation) => [relationKey(relation.source, relation.target), relation]));

  return (
    <div className="analytics-relations">
      <section className="insight-panel relation-panel">
        <div className="insight-panel-head"><div><span>CO-OCCURRENCE</span><h2>跨模块关系矩阵</h2></div><small>数字为共同出现题数</small></div>
        <div className="relation-matrix" style={{ gridTemplateColumns: `88px repeat(${data.areas.length}, minmax(20px, 1fr))` }}>
          <span className="matrix-corner">模块</span>
          {data.areas.map((area, index) => <span className="matrix-column" key={area.id} title={area.name} style={{ color: chartColor(index) }}>{index + 1}</span>)}
          {data.areas.flatMap((area, rowIndex) => [
            <span className="matrix-row-label" key={`${area.id}-label`}><i style={{ backgroundColor: chartColor(rowIndex) }} />{shortAreaName(area.name)}</span>,
            ...data.areas.map((target, columnIndex) => {
              const relation = relationMap.get(relationKey(area.id, target.id));
              if (columnIndex < rowIndex) return <span className="matrix-cell matrix-empty" key={`${area.id}-${target.id}`} />;
              if (columnIndex === rowIndex) return <span className="matrix-cell matrix-self" key={`${area.id}-${target.id}`} style={{ backgroundColor: colorWithAlpha(chartColor(rowIndex), .16), color: chartColor(rowIndex) }}>●</span>;
              const count = relation?.count || 0;
              return <span className="matrix-cell" key={`${area.id}-${target.id}`} title={`${area.name} + ${target.name}：${count} 题`} style={{ backgroundColor: count ? colorWithAlpha(chartColor(columnIndex), .18 + count / maxRelationCount * .7) : "rgba(23,24,21,.035)", color: count / maxRelationCount > .45 ? "#fff" : "#54554f" }}>{count || ""}</span>;
            }),
          ])}
        </div>
        <div className="relation-highlights">
          {data.relations.slice(0, 4).map((relation, index) => (
            <div key={`${relation.source}-${relation.target}`}>
              <i style={{ backgroundColor: chartColor(index) }} />
              <span>{shortAreaName(relation.sourceName)} × {shortAreaName(relation.targetName)}</span>
              <b>{relation.count} 题</b>
            </div>
          ))}
        </div>
      </section>

      <section className="insight-panel answer-hotspot-panel">
        <div className="insight-panel-head"><div><span>LONG ANSWER</span><h2>综合题热点</h2></div><small>按综合题次数</small></div>
        <div className="answer-hotspot-list">
          {answerTags.map((tag, index) => (
            <div key={tag.name}>
              <span style={{ backgroundColor: colorWithAlpha(chartColor(index), .15), color: chartColor(index) }}>{index + 1}</span><strong>{tag.name}</strong>
              <p><b>{tag.answerCount}</b> 道综合题</p><small>总计 {tag.count} 题 · 覆盖 {tag.yearsCount} 年</small>
              <div className="answer-hotspot-meter"><i style={{ width: `${tag.answerCount / maxAnswerCount * 100}%`, backgroundColor: chartColor(index) }} /></div>
            </div>
          ))}
        </div>
      </section>

      <section className="insight-panel stability-panel">
        <div className="insight-panel-head"><div><span>STABILITY</span><h2>长期稳定性</h2></div><small>跨年覆盖</small></div>
        <div className="stability-list">
          {stableAreas.map((area, index) => (
            <div key={area.id}>
              <div><strong>{area.name}</strong><span>最近 {area.lastYear}</span></div>
              <div className="stability-track"><i style={{ width: `${area.yearsCount / data.totals.years * 100}%`, backgroundColor: chartColor(index) }} /></div>
              <p><b>{area.yearsCount}</b> / 18 年覆盖 <span>最长连续 {area.longestStreak} 年</span></p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SubjectPage({ subjectId, progress, initialKnowledgeSlug }: { subjectId: SubjectId; progress: PracticeProgress; initialKnowledgeSlug?: string }) {
  const initialKnowledgePage = initialKnowledgeSlug
    ? localKnowledgeIndex.subjects[subjectId].pages.find((page) => page.slug === initialKnowledgeSlug && page.questionIds.length)
    : undefined;
  const [view, setView] = useState<AnalyticsView>(initialKnowledgePage ? "questions" : "overview");
  const [query, setQuery] = useState(initialKnowledgePage?.title || "");
  const [knowledgeQuestionIds, setKnowledgeQuestionIds] = useState<string[] | null>(initialKnowledgePage?.questionIds || null);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(1);
  const subject = subjectById.get(subjectId)!;
  const subjectAnalytics = analytics.subjects[subjectId];
  const subjectQuestions = useMemo(() => allQuestions.filter((question) => question.subject === subjectId), [subjectId]);
  const completedQuestionCount = subjectQuestions.filter((question) => progress.completed.includes(question.id)).length;
  const nextPracticeQuestion = subjectQuestions.find((question) => !progress.completed.includes(question.id)) ?? subjectQuestions[0];
  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return subjectQuestions.filter((question) => {
      const typeMatch = typeFilter === "all" || (typeFilter === "wrong" ? progress.attempts[question.id]?.correct === false : question.questionType === typeFilter);
      const exactTagMatch = !knowledgeQuestionIds || knowledgeQuestionIds.includes(question.id);
      const queryMatch = !normalized || Boolean(knowledgeQuestionIds) || (question.prompt + question.title + question.tags.join(" ") + question.year).toLowerCase().includes(normalized);
      return typeMatch && exactTagMatch && queryMatch;
    });
  }, [knowledgeQuestionIds, progress.attempts, query, subjectQuestions, typeFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageQuestions = filteredQuestions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const setFilter = (value: TypeFilter) => { setTypeFilter(value); setPage(1); };
  const clearKnowledgeQuestionFilter = () => {
    setKnowledgeQuestionIds(null);
    setQuery("");
    setPage(1);
  };
  const selectAnalyticsView = (nextView: AnalyticsView) => {
    if (nextView === "questions" && knowledgeQuestionIds) clearKnowledgeQuestionFilter();
    setView(nextView);
  };
  const openQuestionsForTag = (tag: string, questionIds: string[]) => {
    setQuery(tag);
    setKnowledgeQuestionIds(questionIds);
    setTypeFilter("all");
    setPage(1);
    setView("questions");
  };
  const views: Array<{ id: AnalyticsView; label: string }> = [
    { id: "overview", label: "总览" },
    { id: "knowledge", label: "细分考点" },
    { id: "timeline", label: "时间趋势" },
    { id: "relations", label: "关联分析" },
    { id: "questions", label: "真题题库" },
  ];

  return (
    <div className="viewport-app">
      <AppHeader completedCount={progress.completed.length} />
      <main className={`subject-main shell-width accent-${subject.accent}`}>
        <aside className="subject-summary">
          <Link href="/" className="back-link">← 408 四科</Link>
          <div>
            <p className="page-label">{subject.index} / {subject.english}</p>
            <h1>{subject.name}</h1>
            <p>{subject.description}</p>
          </div>
          <div className="subject-numbers">
            <div><span>真题</span><strong>{subjectAnalytics.totals.questions}</strong></div>
            <div><span>知识模块</span><strong>{subjectAnalytics.areas.length}</strong></div>
          </div>
          <p className="subject-data-note">18 年真题 · {subjectAnalytics.totals.answer} 道综合题</p>
          <div className="subject-actions">
            {nextPracticeQuestion ? (
              <Link className="subject-start-action" href={`/question/${nextPracticeQuestion.id}`}>
                <span>{completedQuestionCount ? "继续做题" : "开始做题"}</span><b>→</b>
              </Link>
            ) : null}
            <Link className="subject-knowledge-action" href={`/knowledge/${subjectId}`}>
              <span>查看知识点</span><b>{localKnowledgeIndex.subjects[subjectId].pageCount}</b>
            </Link>
          </div>
          <div className="subject-switcher">
            {subjectCatalog.map((item) => <Link key={item.id} className={item.id === subjectId ? "active" : ""} href={`/subject/${item.id}`}>{item.index} {item.shortName}</Link>)}
          </div>
        </aside>
        <section className="subject-library" id="subject-analysis-panel">
          <div className="analytics-head">
            <div><span>2009—2026 真题数据</span><strong>{subject.shortName}考情分析</strong></div>
            <div className="analytics-tabs" role="tablist" aria-label={`${subject.shortName}分析视图`}>
              {views.map((item) => <button key={item.id} role="tab" aria-selected={view === item.id} className={view === item.id ? "active" : ""} onClick={() => selectAnalyticsView(item.id)}>{item.label}</button>)}
            </div>
          </div>
          <div className="analytics-view">
            {view === "overview" ? <OverviewDashboard data={subjectAnalytics} /> : null}
            {view === "knowledge" ? <KnowledgeDashboard subjectId={subjectId} data={subjectAnalytics} onOpenQuestions={openQuestionsForTag} /> : null}
            {view === "timeline" ? <TimelineDashboard data={subjectAnalytics} /> : null}
            {view === "relations" ? <RelationsDashboard data={subjectAnalytics} /> : null}
            {view === "questions" ? (
              <div className="question-library-view">
                <div className="library-head">
                  <div><span>{knowledgeQuestionIds ? "相关真题" : "题库"}</span><strong>{filteredQuestions.length} 道</strong>{knowledgeQuestionIds ? <button className="clear-tag-filter" onClick={clearKnowledgeQuestionFilter}>{query} ×</button> : null}</div>
                  <div className="library-filters">
                    <div className="segmented-control">
                      <button className={typeFilter === "all" ? "active" : ""} onClick={() => setFilter("all")}>全部</button>
                      <button className={typeFilter === "choice" ? "active" : ""} onClick={() => setFilter("choice")}>选择题</button>
                      <button className={typeFilter === "answer" ? "active" : ""} onClick={() => setFilter("answer")}>综合题</button>
                      <button className={typeFilter === "wrong" ? "active" : ""} onClick={() => setFilter("wrong")}>错题</button>
                    </div>
                    <label className="compact-search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setKnowledgeQuestionIds(null); setPage(1); }} placeholder="搜索题目" /></label>
                  </div>
                </div>
                <div className="subject-question-grid">
                  {pageQuestions.map((question) => <SubjectQuestionCard key={question.id} question={question} progress={progress} />)}
                  {!pageQuestions.length ? <div className="library-empty"><strong>没有匹配的题目</strong><span>试试其他关键词或题型。</span></div> : null}
                </div>
                <div className="library-pagination">
                  <span>第 {safePage} / {totalPages} 页</span>
                  <div><button disabled={safePage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>← 上一页</button><button disabled={safePage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>下一页 →</button></div>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

function localLinksForQuestion(question: SubjectQuestion) {
  return [...new Map(question.tags.flatMap((tag) => {
    const article = localKnowledgeIndex.subjects[question.subject].tagRoutes[tag];
    return article ? [[article.href, { ...article, tag }] as const] : [];
  })).values()];
}

function promptSimilarity(left: SubjectQuestion, right: SubjectQuestion) {
  const normalize = (value: string) => value.toLowerCase().replace(/[\s\p{P}\p{S}]/gu, "");
  const grams = (value: string) => {
    const normalized = normalize(value);
    return new Set(Array.from({ length: Math.max(0, normalized.length - 1) }, (_, index) => normalized.slice(index, index + 2)));
  };
  const leftGrams = grams(left.prompt);
  const rightGrams = grams(right.prompt);
  const overlap = [...leftGrams].filter((gram) => rightGrams.has(gram)).length;
  const lexical = overlap / Math.max(1, Math.sqrt(leftGrams.size * rightGrams.size));
  const sameType = left.questionType === right.questionType ? .04 : 0;
  const sameSlot = left.questionNumber && left.questionNumber === right.questionNumber ? .03 : 0;
  return lexical + sameType + sameSlot;
}

function recommendedKnowledgeForQuestion(question: SubjectQuestion, questions: SubjectQuestion[]) {
  if (question.tags.length) return [];
  const tagScores = new Map<string, number>();
  questions
    .filter((item) => item.id !== question.id && item.tags.length)
    .map((item) => ({ item, score: promptSimilarity(question, item) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 8)
    .forEach(({ item, score }) => item.tags.forEach((tag) => tagScores.set(tag, (tagScores.get(tag) || 0) + score)));
  const articleScores = new Map<string, { href: string; title: string; tag: string; score: number }>();
  for (const [tag, score] of tagScores) {
    const article = localKnowledgeIndex.subjects[question.subject].tagRoutes[tag];
    if (!article) continue;
    const existing = articleScores.get(article.href);
    if (!existing || existing.score < score) articleScores.set(article.href, { ...article, tag, score });
  }
  return [...articleScores.values()].sort((left, right) => right.score - left.score).slice(0, 3);
}

function KnowledgeLinks({ question }: { question: SubjectQuestion }) {
  const points = pointsFor(question);
  const localLinks = localLinksForQuestion(question);
  if (!points.length && !localLinks.length) return null;
  return (
    <div className="question-knowledge">
      <span>关联知识点</span>
      {localLinks.map((article) => (
        <div key={article.href}>
          <section><small>本地知识库 · {article.tag}</small><strong>{article.title}</strong></section>
          <Link href={article.href}>阅读 →</Link>
        </div>
      ))}
      {points.map((point) => {
        const segment = point.segmentId ? sectionSegments.find((item) => item.id === point.segmentId) : undefined;
        const href = segmentHref(point.segmentId);
        return (
          <div key={point.id}>
            <section><small>{point.id}</small><strong>{point.title.replace(/^\d+(?:\.\d+)*　/, "")}</strong>{segment ? <small>阅读 {segment.slice_start}–{segment.slice_end} 页</small> : null}</section>
            {href ? <a href={href} target="_blank" rel="noreferrer">↗</a> : null}
          </div>
        );
      })}
    </div>
  );
}

function QuestionKnowledgePanel({ question, questions }: { question: SubjectQuestion; questions: SubjectQuestion[] }) {
  const directArticles = localLinksForQuestion(question);
  const recommendedArticles = recommendedKnowledgeForQuestion(question, questions);
  const articles = directArticles.length ? directArticles.map((article) => ({ ...article, recommended: false })) : recommendedArticles.map((article) => ({ ...article, recommended: true }));
  return (
    <div className="question-context-panel">
      <header><span>KNOWLEDGE MAP</span><strong>本题知识点</strong><small>{articles.length} 篇本地资料</small></header>
      <div className="question-context-scroll">
        <div className="question-context-tags">
          <span>{question.tags.length ? "题目标签" : "该年份暂未提供标签，以下按题干与历年题匹配"}</span>
          <div>{question.tags.map((tag) => <b key={tag}>{tag}</b>)}</div>
        </div>
        {articles.map((article, index) => (
          <Link className="question-knowledge-card" href={article.href} key={article.href}>
            <span>{String(index + 1).padStart(2, "0")} · {article.recommended ? "题干推荐" : article.tag}</span>
            <strong>{article.title}</strong>
            <p>{article.recommended ? `参考考点：${article.tag}` : "打开 schedule 本地知识点"} <b>↗</b></p>
          </Link>
        ))}
        {!articles.length ? <div className="question-context-empty"><strong>暂未匹配本地文章</strong><span>仍可在“类似题”中按题型继续练习。</span></div> : null}
      </div>
    </div>
  );
}

function SimilarQuestionsPanel({ question, questions, progress }: { question: SubjectQuestion; questions: SubjectQuestion[]; progress: PracticeProgress }) {
  const currentTags = new Set(question.tags);
  const ranked = questions
    .filter((item) => item.id !== question.id)
    .map((item) => {
      const sharedTags = item.tags.filter((tag) => currentTags.has(tag));
      const yearDistance = question.year && item.year ? Math.abs(question.year - item.year) : 20;
      return { question: item, sharedTags, score: sharedTags.length * 100 + (item.questionType === question.questionType ? 10 : 0) - yearDistance };
    })
    .map((item) => ({ ...item, score: item.score + (item.question.questionNumber === question.questionNumber ? 35 : 0) + promptSimilarity(question, item.question) * 20 }))
    .sort((left, right) => right.score - left.score || (right.question.year || 0) - (left.question.year || 0))
    .slice(0, 6);

  return (
    <div className="question-context-panel">
      <header><span>SIMILAR QUESTIONS</span><strong>同类真题</strong><small>按共同考点排序</small></header>
      <div className="question-context-scroll similar-question-list">
        {ranked.map((item) => {
          const attempt = progress.attempts[item.question.id];
          return (
            <Link href={`/question/${item.question.id}`} key={item.question.id}>
              <div><span>{item.question.year || "专项"} · 第 {item.question.questionNumber || "—"} 题</span>{attempt ? <b className={attempt.correct === false ? "wrong" : "done"}>{attempt.correct === false ? "曾错" : "已做"}</b> : null}</div>
              <strong>{item.question.title || item.question.prompt}</strong>
              <p>{item.sharedTags.length ? item.sharedTags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>) : <span>{item.question.questionNumber === question.questionNumber ? "同题位 · 同科目" : `同科目 · ${questionTypeLabel(item.question)}`}</span>}</p>
            </Link>
          );
        })}
        {!ranked.length ? <div className="question-context-empty"><strong>暂时没有同标签真题</strong><span>可以继续下一题或回到学科题库。</span></div> : null}
      </div>
    </div>
  );
}

function QuestionNotesPanel({
  question,
  value,
  onChange,
}: {
  question: SubjectQuestion;
  value: string;
  onChange: (value: string) => void;
}) {
  const [mode, setMode] = useState<"write" | "preview">("write");
  const previewRef = useRef<HTMLDivElement>(null);
  const hasNote = Boolean(value.trim());

  useEffect(() => {
    // Start each question in writing mode so a new note is immediately actionable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode("write");
  }, [question.id]);

  return (
    <section className="question-notes-panel" aria-label="本题 Markdown 笔记">
      <header className="question-notes-head">
        <div><span>MY MARKDOWN NOTE</span><strong>本题笔记</strong></div>
        <small>本机自动保存</small>
      </header>
      <div className="question-notes-toolbar">
        <div className="question-notes-mode" role="tablist" aria-label="笔记显示模式">
          <button className={mode === "write" ? "active" : ""} role="tab" aria-selected={mode === "write"} onClick={() => setMode("write")}>编辑</button>
          <button className={mode === "preview" ? "active" : ""} role="tab" aria-selected={mode === "preview"} onClick={() => setMode("preview")}>预览</button>
        </div>
        {hasNote ? <button className="question-note-clear" onClick={() => onChange("")}>清空</button> : <span>{value.length} 字</span>}
      </div>
      {mode === "write" ? (
        <label className="question-note-editor">
          <textarea
            aria-label="本题 Markdown 笔记"
            value={value}
            maxLength={MAX_QUESTION_NOTE_LENGTH}
            onChange={(event) => onChange(event.target.value)}
            placeholder={"## 我的思路\n- 关键条件：\n- 易错点：\n- 下次复习：\n\n```mermaid\nflowchart LR\n  条件 --> 结论\n```"}
            spellCheck={false}
          />
        </label>
      ) : hasNote ? (
        // The renderer escapes raw HTML and permits only safe link protocols.
        <>
          <div ref={previewRef} className="question-note-preview" dangerouslySetInnerHTML={{ __html: renderQuestionNoteMarkdown(value) }} />
          <MermaidCodeBlocks rootRef={previewRef} contentKey={`${question.id}:${value}`} />
        </>
      ) : (
        <div className="question-note-empty"><strong>还没有笔记</strong><span>写下思路、易错点或下次复习提示。</span></div>
      )}
      <footer className="question-note-footer">
        <span>{hasNote ? `${value.length} 字 · 已保存` : "随写随存"}</span>
        <small>支持 <code>```mermaid</code> 图 · # 标题 · **加粗** · - 列表</small>
      </footer>
    </section>
  );
}

function QuestionPage({
  question,
  progress,
  updateProgress,
  notes,
  updateNote,
}: {
  question: SubjectQuestion;
  progress: PracticeProgress;
  updateProgress: (value: PracticeProgress) => void;
  notes: QuestionNotes;
  updateNote: (questionId: string, value: string) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [sideView, setSideView] = useState<QuestionSideView>("answer");
  const subject = subjectById.get(question.subject)!;
  const subjectQuestions = allQuestions.filter((item) => item.subject === question.subject);
  const currentIndex = subjectQuestions.findIndex((item) => item.id === question.id);
  const nextQuestion = subjectQuestions[(currentIndex + 1) % subjectQuestions.length];
  const correctOption = question.answer.match(/[A-D]/)?.[0] || null;
  const completed = progress.completed.includes(question.id);
  const bookmarked = progress.bookmarks.includes(question.id);
  const savedAttempt = progress.attempts[question.id];
  const promptResource = useMemo<LearningResource>(() => ({
    id: `question:${question.id}:prompt`,
    kind: "question",
    title: `${question.number}题干`,
    href: `/question/${question.id}`,
    context: subject.name,
  }), [question.id, question.number, subject.name]);
  const solutionResource = useMemo<LearningResource>(() => ({
    ...promptResource,
    id: `question:${question.id}:solution`,
    title: `${question.number}解析`,
  }), [promptResource, question.id, question.number]);
  const save = (value: PracticeProgress) => updateProgress(value);
  const toggleCompleted = () => save({ ...progress, completed: completed ? progress.completed.filter((id) => id !== question.id) : [...progress.completed, question.id] });
  const toggleBookmark = () => save({ ...progress, bookmarks: bookmarked ? progress.bookmarks.filter((id) => id !== question.id) : [...progress.bookmarks, question.id] });

  useEffect(() => {
    // Restore the saved answer whenever the route changes or local progress is loaded.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedOption(savedAttempt?.selectedOption ?? null);
    setRevealed(Boolean(savedAttempt));
  }, [question.id, savedAttempt]);

  useEffect(() => {
    // A newly opened question should always begin from its answer controls.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSideView("answer");
  }, [question.id]);

  const submitAnswer = () => {
    const correct = correctOption && selectedOption ? correctOption === selectedOption : null;
    const completedIds = progress.completed.includes(question.id) ? progress.completed : [...progress.completed, question.id];
    save({
      ...progress,
      completed: completedIds,
      attempts: {
        ...progress.attempts,
        [question.id]: { selectedOption, correct, answeredAt: new Date().toISOString() },
      },
    });
    setRevealed(true);
    setSideView("answer");
  };

  return (
    <div className="viewport-app question-viewport">
      <AppHeader completedCount={progress.completed.length} />
      <main className={`question-main shell-width accent-${subject.accent}`}>
        <div className="question-toolbar">
          <Link href={`/subject/${question.subject}`}>← {subject.name}题库</Link>
          <div><span>{currentIndex + 1} / {subjectQuestions.length}</span><span>{question.year || "专项练习"} · {questionTypeLabel(question)}</span></div>
        </div>
        <div className={`question-workspace ${revealed || sideView !== "answer" ? "answer-open" : "answer-closed"}`}>
          <article className="question-content">
            <div className="question-content-scroll">
              <p className="page-label">{question.number}</p>
              <h1>{question.title}</h1>
              <StudyAnnotationSurface resource={promptResource} contentKey={`${question.id}:prompt:${question.promptHtml?.length || question.prompt.length}`} className="question-annotation-surface">
                {question.promptHtml ? (
                  <div className="question-rich-html single-prompt" data-study-annotatable="true" dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(question.promptHtml) }} />
                ) : (
                  <p className="single-prompt" data-study-annotatable="true">{question.prompt}</p>
                )}
              </StudyAnnotationSurface>
              {!question.promptHtml && question.images.length ? <div className="single-images">{question.images.map((src, index) => <img key={src} src={siteAssetPath(src)} alt={`${question.number} 题图 ${index + 1}`} />)}</div> : null}
              {question.options.length ? (
                <div className="single-options" role="group" aria-label="请选择答案">
                  {question.options.map((option) => {
                    const isSelected = selectedOption === option.label;
                    const isCorrect = revealed && correctOption === option.label;
                    const isWrong = revealed && isSelected && correctOption !== option.label;
                    return <button key={option.label} type="button" className={[isSelected ? "selected" : "", isCorrect ? "correct" : "", isWrong ? "wrong" : ""].filter(Boolean).join(" ")} onClick={() => { if (!revealed) setSelectedOption(option.label); }}><span>{option.label}</span>{option.html ? <div className="option-rich-html" dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(option.html) }} /> : <p>{option.text}</p>}{isCorrect ? <b>正确答案</b> : isWrong ? <b>你的选择</b> : null}</button>;
                  })}
                </div>
              ) : null}
            </div>
          </article>
          <aside className="answer-workspace">
            <div className="answer-tools">
              <button className={bookmarked ? "active" : ""} onClick={toggleBookmark}>{bookmarked ? "◆ 已收藏" : "◇ 收藏"}</button>
              <button className={completed ? "active" : ""} onClick={toggleCompleted}>{completed ? "✓ 已完成" : "标记完成"}</button>
            </div>
            <div className="question-side-tabs" role="tablist" aria-label="题目辅助面板">
              <button className={sideView === "answer" ? "active" : ""} role="tab" aria-selected={sideView === "answer"} onClick={() => setSideView("answer")}>作答解析</button>
              <button className={sideView === "notes" ? "active" : ""} role="tab" aria-selected={sideView === "notes"} onClick={() => setSideView("notes")}>笔记</button>
              <button className={sideView === "knowledge" ? "active" : ""} role="tab" aria-selected={sideView === "knowledge"} onClick={() => setSideView("knowledge")}>知识点</button>
              <button className={sideView === "similar" ? "active" : ""} role="tab" aria-selected={sideView === "similar"} onClick={() => setSideView("similar")}>类似题</button>
            </div>
            <div className="question-side-body">
              {sideView === "answer" ? !revealed ? (
                <div className="answer-placeholder">
                  <span>完成作答后查看解析</span>
                  <strong>{question.options.length ? "选择一个答案" : "先在纸上完成解答"}</strong>
                  <button disabled={Boolean(question.options.length) && !selectedOption} onClick={submitAnswer}>{question.options.length ? "提交并查看解析" : "查看参考解析"}</button>
                </div>
              ) : (
                <div className="answer-reveal-panel">
                  <div className="answer-reveal-head"><span>参考答案{savedAttempt ? ` · ${new Date(savedAttempt.answeredAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}` : ""}</span><strong>{question.answer || "解题思路"}</strong></div>
                  <div className="answer-scroll">
                    <StudyAnnotationSurface resource={solutionResource} contentKey={`${question.id}:solution:${question.solutionHtml?.length || question.solution?.length || 0}`} className="question-solution-annotation" showHint={false}>
                      {question.solutionHtml ? <div className="solution-rich-html" data-study-annotatable="true" dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(question.solutionHtml) }} /> : <p data-study-annotatable="true">{question.solution || "这道题暂未录入解析，请结合知识点自行复盘。"}</p>}
                    </StudyAnnotationSurface>
                    <KnowledgeLinks question={question} />
                  </div>
                </div>
              ) : null}
              {sideView === "notes" ? <QuestionNotesPanel question={question} value={notes[question.id] || ""} onChange={(value) => updateNote(question.id, value)} /> : null}
              {sideView === "knowledge" ? <QuestionKnowledgePanel question={question} questions={subjectQuestions} /> : null}
              {sideView === "similar" ? <SimilarQuestionsPanel question={question} questions={subjectQuestions} progress={progress} /> : null}
            </div>
            <Link className="next-question" href={`/question/${nextQuestion.id}`}><span>下一题</span><p>{nextQuestion.prompt}</p><b>继续 →</b></Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

export function StudyWorkspace({
  initialQuestionId,
  initialSubjectId,
  initialKnowledgeSlug,
}: {
  initialQuestionId?: string;
  initialSubjectId?: string;
  initialKnowledgeSlug?: string;
}) {
  const [progress, setProgress] = useState<PracticeProgress>(EMPTY_PROGRESS);
  const [questionNotes, setQuestionNotes] = useState<QuestionNotes>({});
  const [notesReady, setNotesReady] = useState(false);

  useEffect(() => {
    const local = readLocalStudySnapshot();
    // Hydration must finish before reading browser-only local storage.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(local.progress);
    setQuestionNotes(local.notes);
    setNotesReady(true);
  }, []);

  useEffect(() => {
    if (!notesReady) return;
    try {
      if (Object.keys(questionNotes).length) window.localStorage.setItem(QUESTION_NOTES_STORAGE_KEY, JSON.stringify(questionNotes));
      else window.localStorage.removeItem(QUESTION_NOTES_STORAGE_KEY);
    } catch {
      // A full or unavailable browser storage should never interrupt answering questions.
    }
  }, [notesReady, questionNotes]);

  const updateProgress = (value: PracticeProgress) => {
    setProgress(value);
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(value));
  };

  const updateQuestionNote = (questionId: string, value: string) => {
    setQuestionNotes((current) => {
      const next = { ...current };
      if (value) next[questionId] = value.slice(0, MAX_QUESTION_NOTE_LENGTH);
      else delete next[questionId];
      return next;
    });
  };

  if (initialQuestionId) {
    const question = allQuestions.find((item) => item.id === initialQuestionId);
    if (question) return <QuestionPage question={question} progress={progress} updateProgress={updateProgress} notes={questionNotes} updateNote={updateQuestionNote} />;
  }
  if (initialSubjectId && subjectById.has(initialSubjectId as SubjectId)) return <SubjectPage subjectId={initialSubjectId as SubjectId} progress={progress} initialKnowledgeSlug={initialKnowledgeSlug} />;
  if (initialQuestionId || initialSubjectId) return <div className="viewport-app"><AppHeader completedCount={progress.completed.length} /><main className="missing-page"><span>404</span><h1>这个页面暂时不存在。</h1><Link href="/">返回 408 四科题库</Link></main></div>;
  return <HomePage progress={progress} />;
}
