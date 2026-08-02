"use client";

import Link from "next/link";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import { subjectById, subjectCatalog, type SubjectId } from "@/app/data/catalog";
import importedQuestions from "@/app/data/questions.json";
import knowledgeIndexData from "@/app/data/knowledge-index.json";
import {
  createLocalStudyBackup,
  EMPTY_LOCAL_STUDY_SNAPSHOT,
  parseLocalStudyBackup,
  readLocalStudySnapshot,
  type AttemptRecord,
  type LocalStudySnapshot,
  writeLocalStudySnapshot,
} from "@/app/lib/local-study-data";

type ProfileView = "overview" | "notes" | "history" | "favorites" | "knowledge";
type ProfileQuestion = {
  id: string;
  subject: SubjectId;
  title: string;
  prompt: string;
  year: number | null;
  questionNumber: number | null;
  tags: string[];
};
type KnowledgeIndexDataset = {
  subjects: Record<SubjectId, {
    tagRoutes: Record<string, { href: string; title: string }>;
  }>;
};
type HistoryItem = {
  questionId: string;
  attempt: AttemptRecord | null;
  markedOnly: boolean;
};
type KnowledgePoint = {
  key: string;
  name: string;
  subject: SubjectId;
  href: string;
  articleTitle: string;
  count: number;
};
type SubjectPerformance = {
  subject: SubjectId;
  attempted: number;
  scored: number;
  correct: number;
  wrong: number;
  accuracy: number | null;
};
type StudyDay = {
  key: string;
  label: string;
  attempted: number;
  correct: number;
  wrong: number;
};
type WeakKnowledgePoint = KnowledgePoint & {
  attempted: number;
  correct: number;
  wrong: number;
  accuracy: number | null;
};
type PersonalHistoryAnalysis = {
  attempted: number;
  scored: number;
  correct: number;
  wrong: number;
  accuracy: number | null;
  subjectPerformance: SubjectPerformance[];
  recentStudyDays: StudyDay[];
  weakPoints: WeakKnowledgePoint[];
};

const profileQuestions = importedQuestions as ProfileQuestion[];
const questionsById = new Map(profileQuestions.map((question) => [question.id, question]));
const localKnowledgeIndex = knowledgeIndexData as KnowledgeIndexDataset;
const profileViews: Array<{ id: ProfileView; label: string }> = [
  { id: "overview", label: "概览" },
  { id: "notes", label: "笔记" },
  { id: "history", label: "做题历史" },
  { id: "favorites", label: "收藏题目" },
  { id: "knowledge", label: "知识点" },
];

function subjectLabel(subjectId: SubjectId | undefined) {
  return subjectId ? subjectById.get(subjectId)?.shortName || subjectId.toUpperCase() : "题目";
}

function questionTitle(questionId: string) {
  return questionsById.get(questionId)?.title || `题目 ${questionId}`;
}

function questionMeta(question: ProfileQuestion | undefined) {
  if (!question) return "本地记录";
  return `${subjectLabel(question.subject)} · ${question.year || "专项练习"}${question.questionNumber ? ` · 第 ${question.questionNumber} 题` : ""}`;
}

function compactText(value: string, maxLength = 132) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > maxLength ? `${compact.slice(0, maxLength)}…` : compact;
}

function formatDateTime(value: string | null) {
  if (!value) return "已标记完成";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "已保存";
  return new Intl.DateTimeFormat("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
}

function buildHistory(snapshot: LocalStudySnapshot): HistoryItem[] {
  const attempted = Object.entries(snapshot.progress.attempts).map(([questionId, attempt]) => ({ questionId, attempt, markedOnly: false }));
  const attemptedIds = new Set(attempted.map((item) => item.questionId));
  const markedOnly = snapshot.progress.completed
    .filter((questionId) => !attemptedIds.has(questionId))
    .map((questionId) => ({ questionId, attempt: null, markedOnly: true }));
  return [...attempted, ...markedOnly].sort((left, right) => {
    const leftTime = left.attempt ? Date.parse(left.attempt.answeredAt) : 0;
    const rightTime = right.attempt ? Date.parse(right.attempt.answeredAt) : 0;
    return rightTime - leftTime;
  });
}

function buildKnowledgePoints(snapshot: LocalStudySnapshot): KnowledgePoint[] {
  const relatedQuestionIds = new Set([
    ...snapshot.progress.completed,
    ...snapshot.progress.bookmarks,
    ...Object.keys(snapshot.progress.attempts),
    ...Object.keys(snapshot.notes),
  ]);
  const points = new Map<string, KnowledgePoint>();
  for (const questionId of relatedQuestionIds) {
    const question = questionsById.get(questionId);
    if (!question) continue;
    const routes = localKnowledgeIndex.subjects[question.subject]?.tagRoutes || {};
    for (const tag of question.tags || []) {
      const route = routes[tag];
      if (!route) continue;
      const key = `${question.subject}:${tag}`;
      const current = points.get(key);
      if (current) current.count += 1;
      else points.set(key, { key, name: tag, subject: question.subject, href: route.href, articleTitle: route.title, count: 1 });
    }
  }
  return [...points.values()].sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, "zh-CN"));
}

function percentage(numerator: number, denominator: number) {
  return denominator ? Math.round(numerator / denominator * 100) : null;
}

function localStudyDay(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function shortStudyDay(value: string) {
  const [, month, day] = value.split("-");
  return `${Number(month)}/${Number(day)}`;
}

function buildPersonalHistoryAnalysis(snapshot: LocalStudySnapshot): PersonalHistoryAnalysis {
  const perSubject = new Map<SubjectId, Omit<SubjectPerformance, "accuracy">>();
  for (const subject of subjectCatalog) perSubject.set(subject.id, { subject: subject.id, attempted: 0, scored: 0, correct: 0, wrong: 0 });
  const dayStats = new Map<string, Omit<StudyDay, "key" | "label">>();
  const tagStats = new Map<string, Omit<WeakKnowledgePoint, "accuracy">>();
  let attempted = 0;
  let scored = 0;
  let correct = 0;
  let wrong = 0;

  for (const [questionId, attempt] of Object.entries(snapshot.progress.attempts)) {
    const question = questionsById.get(questionId);
    if (!question) continue;
    const subject = perSubject.get(question.subject);
    if (!subject) continue;
    attempted += 1;
    subject.attempted += 1;
    const dayKey = localStudyDay(attempt.answeredAt);
    const day = dayStats.get(dayKey) || { attempted: 0, correct: 0, wrong: 0 };
    day.attempted += 1;
    dayStats.set(dayKey, day);

    if (typeof attempt.correct !== "boolean") continue;
    scored += 1;
    subject.scored += 1;
    if (attempt.correct) {
      correct += 1;
      subject.correct += 1;
      day.correct += 1;
    } else {
      wrong += 1;
      subject.wrong += 1;
      day.wrong += 1;
    }

    const routes = localKnowledgeIndex.subjects[question.subject]?.tagRoutes || {};
    for (const tag of question.tags || []) {
      const route = routes[tag] || { href: `/knowledge/${question.subject}`, title: `${subjectLabel(question.subject)}知识点` };
      const key = `${question.subject}:${tag}`;
      const point = tagStats.get(key) || {
        key,
        name: tag,
        subject: question.subject,
        href: route.href,
        articleTitle: route.title,
        count: 0,
        attempted: 0,
        correct: 0,
        wrong: 0,
      };
      point.count += 1;
      point.attempted += 1;
      if (attempt.correct) point.correct += 1;
      else point.wrong += 1;
      tagStats.set(key, point);
    }
  }

  const subjectPerformance = [...perSubject.values()].map((item) => ({ ...item, accuracy: percentage(item.correct, item.scored) }));
  const recentStudyDays = [...dayStats.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-7)
    .map(([key, item]) => ({ key, label: shortStudyDay(key), ...item }));
  const weakPoints = [...tagStats.values()]
    .filter((point) => point.wrong > 0)
    .map((point) => ({ ...point, accuracy: percentage(point.correct, point.attempted) }))
    .sort((left, right) => right.wrong - left.wrong || (left.accuracy ?? 100) - (right.accuracy ?? 100) || right.attempted - left.attempted)
    .slice(0, 6);

  return { attempted, scored, correct, wrong, accuracy: percentage(correct, scored), subjectPerformance, recentStudyDays, weakPoints };
}

function EmptyProfileState({ title, detail }: { title: string; detail: string }) {
  return <div className="profile-empty"><strong>{title}</strong><span>{detail}</span></div>;
}

function QuestionRecord({
  questionId,
  badge,
  meta,
  excerpt,
}: {
  questionId: string;
  badge?: string;
  meta: string;
  excerpt?: string;
}) {
  const question = questionsById.get(questionId);
  return (
    <Link className="profile-record" href={`/question/${encodeURIComponent(questionId)}`}>
      <div className="profile-record-meta"><span>{meta}</span>{badge ? <b>{badge}</b> : null}</div>
      <strong>{questionTitle(questionId)}</strong>
      <p>{excerpt || compactText(question?.prompt || "本地记录中的题目内容暂不可用。")}</p>
    </Link>
  );
}

export function LocalProfileWorkspace() {
  const [snapshot, setSnapshot] = useState<LocalStudySnapshot>(EMPTY_LOCAL_STUDY_SNAPSHOT);
  const [view, setView] = useState<ProfileView>("overview");
  const [message, setMessage] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Browser storage is intentionally read after hydration so this page remains a local-only view.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnapshot(readLocalStudySnapshot());
  }, []);

  const history = useMemo(() => buildHistory(snapshot), [snapshot]);
  const noteEntries = useMemo(() => Object.entries(snapshot.notes).sort(([leftId], [rightId]) => {
    const leftTime = Date.parse(snapshot.progress.attempts[leftId]?.answeredAt || "") || 0;
    const rightTime = Date.parse(snapshot.progress.attempts[rightId]?.answeredAt || "") || 0;
    return rightTime - leftTime;
  }), [snapshot]);
  const favorites = useMemo(() => snapshot.progress.bookmarks.map((questionId) => ({ questionId, question: questionsById.get(questionId) })), [snapshot.progress.bookmarks]);
  const knowledgePoints = useMemo(() => buildKnowledgePoints(snapshot), [snapshot]);
  const historyAnalysis = useMemo(() => buildPersonalHistoryAnalysis(snapshot), [snapshot]);
  const recentActivityMax = Math.max(...historyAnalysis.recentStudyDays.map((day) => day.attempted), 1);
  const leadingWeakPoint = historyAnalysis.weakPoints[0];
  const reviewFocus = !historyAnalysis.attempted
    ? "先完成几道有标准答案的题目，个人分析会随着作答自动生成。"
    : leadingWeakPoint
      ? `优先回看「${leadingWeakPoint.name}」：已错 ${leadingWeakPoint.wrong} 次。`
      : historyAnalysis.scored === 0
        ? "当前作答暂不计分；完成带标准答案的题目后即可看到正确率。"
        : historyAnalysis.accuracy !== null && historyAnalysis.accuracy < 60
          ? "先从最近错题开始复盘，再回到对应知识点巩固。"
          : "保持节奏，继续用错题和收藏题检验薄弱知识点。";

  const downloadBackup = () => {
    const backup = createLocalStudyBackup(snapshot);
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `yanshua-408-local-backup-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(href), 0);
    setMessage("备份已下载，文件包含笔记、做题历史、完成与收藏记录。");
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    if (file.size > 6 * 1024 * 1024) {
      setMessage("备份文件过大，请选择 6 MB 以内的研刷本地备份。 ");
      return;
    }
    try {
      const imported = parseLocalStudyBackup(JSON.parse(await file.text()) as unknown);
      if (!imported) {
        setMessage("无法识别该备份文件。请选择由研刷 408 导出的本地备份。 ");
        return;
      }
      if (!window.confirm("导入会覆盖这台设备现有的笔记、做题历史、完成与收藏记录。确定继续吗？")) return;
      if (!writeLocalStudySnapshot(imported)) {
        setMessage("本地存储空间不足，暂时无法导入该备份。 ");
        return;
      }
      setSnapshot(imported);
      window.location.reload();
    } catch {
      setMessage("备份文件无法读取，请确认文件完整且为 JSON 格式。 ");
    }
  };

  const overview = (
    <div className="profile-overview-grid">
      <section className="profile-summary-card">
        <span>LOCAL STUDY SUMMARY</span>
        <h2>这台设备上的学习资料</h2>
        <p>不需要登录；所有记录只保存在浏览器本地。需要换设备时，先导出备份，再在新设备导入即可。</p>
        <div className="profile-stat-grid">
          <div><b>{snapshot.progress.completed.length}</b><span>已完成</span></div>
          <div><b>{history.length}</b><span>作答记录</span></div>
          <div><b>{snapshot.progress.bookmarks.length}</b><span>收藏题目</span></div>
          <div><b>{noteEntries.length}</b><span>题目笔记</span></div>
        </div>
      </section>
      <section className="profile-summary-card profile-review-card">
        <span>REVIEW CUE</span>
        <h2>{historyAnalysis.scored ? `正确率 ${historyAnalysis.accuracy}%` : history.length ? "等待可计分作答" : "从第一道题开始"}</h2>
        <p>{history.length ? reviewFocus : "在题目右侧完成作答、收藏或写笔记后，资料会自动出现在这里。"}</p>
        <button type="button" onClick={() => setView(history.length ? "history" : "favorites")}>{history.length ? "查看做题历史" : "查看收藏题目"} →</button>
      </section>
      <section className="profile-section-card profile-recent-card">
        <header><div><span>RECENT ACTIVITY</span><h2>最近做题</h2></div>{history.length ? <button type="button" onClick={() => setView("history")}>全部查看</button> : null}</header>
        <div className="profile-record-list compact">
          {history.slice(0, 4).map((item) => <QuestionRecord key={item.questionId} questionId={item.questionId} meta={item.attempt ? formatDateTime(item.attempt.answeredAt) : "已标记完成"} badge={item.markedOnly ? "完成" : item.attempt?.correct === true ? "答对" : item.attempt?.correct === false ? "待复盘" : "已作答"} />)}
          {!history.length ? <EmptyProfileState title="还没有做题记录" detail="完成题目后，这里会按时间展示你的学习轨迹。" /> : null}
        </div>
      </section>
      <section className="profile-section-card profile-recent-card">
        <header><div><span>KNOWLEDGE TRAIL</span><h2>关联知识点</h2></div>{knowledgePoints.length ? <button type="button" onClick={() => setView("knowledge")}>全部查看</button> : null}</header>
        <div className="profile-knowledge-preview">
          {knowledgePoints.slice(0, 8).map((point) => <Link key={point.key} href={point.href}><span>{subjectLabel(point.subject)}</span><strong>{point.name}</strong><small>× {point.count}</small></Link>)}
          {!knowledgePoints.length ? <EmptyProfileState title="暂未形成知识点轨迹" detail="收藏、作答或写笔记后，会自动聚合关联知识点。" /> : null}
        </div>
      </section>
    </div>
  );

  const historyAnalysisPanel = (
    <section className="profile-history-analysis" aria-label="个人做题分析">
      <header className="profile-analysis-head">
        <div><span>PERSONAL PRACTICE ANALYSIS</span><h2>个人做题分析</h2></div>
        <p>正确率仅统计有标准答案且已提交的题目。</p>
      </header>
      <div className="profile-analysis-metrics">
        <div><span>作答</span><strong>{historyAnalysis.attempted}</strong><small>次</small></div>
        <div><span>已计分</span><strong>{historyAnalysis.scored}</strong><small>题</small></div>
        <div><span>正确率</span><strong>{historyAnalysis.accuracy === null ? "—" : `${historyAnalysis.accuracy}%`}</strong><small>{historyAnalysis.scored ? `${historyAnalysis.correct} 对 / ${historyAnalysis.wrong} 错` : "等待计分"}</small></div>
        <div><span>待复盘</span><strong>{historyAnalysis.wrong}</strong><small>道错题</small></div>
      </div>
      <div className="profile-analysis-grid">
        <section className="profile-analysis-card">
          <header><div><span>RECENT STUDY DAYS</span><h3>最近学习日</h3></div><small>柱高为作答数</small></header>
          {historyAnalysis.recentStudyDays.length ? (
            <>
              <div className="profile-trend-chart" role="img" aria-label={`最近 ${historyAnalysis.recentStudyDays.length} 个学习日，共作答 ${historyAnalysis.recentStudyDays.reduce((total, day) => total + day.attempted, 0)} 次`}>
                {historyAnalysis.recentStudyDays.map((day) => {
                  const pending = day.attempted - day.correct - day.wrong;
                  return <div className="profile-trend-day" key={day.key} aria-label={`${day.label}：作答 ${day.attempted} 次，答对 ${day.correct} 次，待复盘 ${day.wrong} 次`}><b>{day.attempted}</b><div className="profile-trend-bar"><i className="is-correct" style={{ height: `${day.correct / recentActivityMax * 100}%` }} /><i className="is-wrong" style={{ height: `${day.wrong / recentActivityMax * 100}%` }} />{pending ? <i className="is-pending" style={{ height: `${pending / recentActivityMax * 100}%` }} /> : null}</div><span>{day.label}</span></div>;
                })}
              </div>
              <div className="profile-analysis-legend"><span><i className="is-correct" />答对</span><span><i className="is-wrong" />待复盘</span><span><i className="is-pending" />暂不计分</span></div>
            </>
          ) : <EmptyProfileState title="还没有可分析的作答" detail="提交答案后，这里会展示最近学习日的作答节奏。" />}
        </section>
        <section className="profile-analysis-card">
          <header><div><span>SUBJECT PERFORMANCE</span><h3>科目表现</h3></div><small>横条为正确率</small></header>
          <div className="profile-subject-performance">
            {historyAnalysis.subjectPerformance.map((item) => <div className="profile-subject-row" key={item.subject}><div><strong>{subjectLabel(item.subject)}</strong><span>{item.attempted ? `${item.attempted} 次作答` : "未作答"}</span></div><div className="profile-subject-track" aria-label={`${subjectLabel(item.subject)}正确率${item.accuracy === null ? "暂不计分" : `${item.accuracy}%`} `}><i style={{ width: `${item.accuracy || 0}%` }} /></div><b>{item.accuracy === null ? "—" : `${item.accuracy}%`}</b></div>)}
          </div>
        </section>
        <section className="profile-analysis-card profile-weakness-card">
          <header><div><span>REVIEW PRIORITY</span><h3>优先复盘的知识点</h3></div><small>{historyAnalysis.weakPoints.length ? "按错题次数排序" : "持续作答后自动生成"}</small></header>
          {historyAnalysis.weakPoints.length ? <div className="profile-weakness-list">{historyAnalysis.weakPoints.map((point) => <Link key={point.key} href={point.href}><div><span>{subjectLabel(point.subject)}</span><strong>{point.name}</strong><p>{point.articleTitle}</p></div><b>{point.wrong} 错</b><small>{point.accuracy}% 正确率</small></Link>)}</div> : <EmptyProfileState title="暂未发现需要复盘的知识点" detail="错题会自动按关联知识点归类，并给出优先级。" />}
        </section>
      </div>
      <div className="profile-analysis-focus"><span>下一步</span><strong>{reviewFocus}</strong></div>
    </section>
  );

  const content = view === "overview" ? overview : view === "notes" ? (
    <section className="profile-section-card profile-list-card">
      <header><div><span>QUESTION NOTES</span><h2>我的题目笔记</h2></div><small>{noteEntries.length} 条</small></header>
      <div className="profile-record-list">
        {noteEntries.map(([questionId, note]) => <QuestionRecord key={questionId} questionId={questionId} meta={questionMeta(questionsById.get(questionId))} badge="笔记" excerpt={compactText(note, 180)} />)}
        {!noteEntries.length ? <EmptyProfileState title="还没有笔记" detail="在题目侧边打开“笔记”，写下思路、易错点或 Mermaid 图后会自动保存到这里。" /> : null}
      </div>
    </section>
  ) : view === "history" ? (
    <div className="profile-history-view">
      {historyAnalysisPanel}
      <section className="profile-section-card profile-list-card">
        <header><div><span>ANSWER HISTORY</span><h2>做题历史</h2></div><small>{history.length} 条</small></header>
        <div className="profile-record-list">
          {history.map((item) => <QuestionRecord key={item.questionId} questionId={item.questionId} meta={item.attempt ? `${questionMeta(questionsById.get(item.questionId))} · ${formatDateTime(item.attempt.answeredAt)}` : questionMeta(questionsById.get(item.questionId))} badge={item.markedOnly ? "完成" : item.attempt?.correct === true ? "答对" : item.attempt?.correct === false ? "待复盘" : "已作答"} />)}
          {!history.length ? <EmptyProfileState title="还没有做题历史" detail="提交答案或标记完成后，会自动保留在本地。" /> : null}
        </div>
      </section>
    </div>
  ) : view === "favorites" ? (
    <section className="profile-section-card profile-list-card">
      <header><div><span>BOOKMARKED QUESTIONS</span><h2>收藏题目</h2></div><small>{favorites.length} 题</small></header>
      <div className="profile-record-list">
        {favorites.map(({ questionId, question }) => <QuestionRecord key={questionId} questionId={questionId} meta={questionMeta(question)} badge="收藏" />)}
        {!favorites.length ? <EmptyProfileState title="还没有收藏题目" detail="在任意题目的右侧点击“收藏”，之后便能在这里快速回看。" /> : null}
      </div>
    </section>
  ) : (
    <section className="profile-section-card profile-list-card">
      <header><div><span>KNOWLEDGE POINTS</span><h2>学习知识点</h2></div><small>{knowledgePoints.length} 个</small></header>
      <p className="profile-section-intro">根据你的作答、完成、收藏与笔记自动汇总，点击即可回到对应的本地知识页。</p>
      <div className="profile-knowledge-list">
        {knowledgePoints.map((point) => <Link key={point.key} href={point.href}><div><span>{subjectLabel(point.subject)}</span><strong>{point.name}</strong></div><p>{point.articleTitle}</p><small>关联 {point.count} 道题</small></Link>)}
        {!knowledgePoints.length ? <EmptyProfileState title="暂未形成知识点轨迹" detail="完成、收藏或记录笔记后，相关知识点会在这里自动出现。" /> : null}
      </div>
    </section>
  );

  return (
    <div className="viewport-app profile-viewport">
      <AppHeader completedCount={snapshot.progress.completed.length} />
      <main className="local-profile-main shell-width">
        <aside className="local-profile-sidebar">
          <Link href="/" className="back-link">← 返回 408 首页</Link>
          <div className="profile-identity"><span>我</span><div><p>LOCAL LEARNER</p><h1>本地资料库</h1></div></div>
          <p className="profile-sidebar-copy">你的资料只保存在这台设备。备份文件由你自己保存、自己导入。</p>
          <nav className="profile-view-nav" aria-label="本地资料库导航">
            {profileViews.map((item) => <button key={item.id} type="button" className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><span>{item.label}</span>{item.id === "notes" ? <small>{noteEntries.length}</small> : item.id === "favorites" ? <small>{favorites.length}</small> : item.id === "history" ? <small>{history.length}</small> : item.id === "knowledge" ? <small>{knowledgePoints.length}</small> : null}</button>)}
          </nav>
          <div className="profile-backup-box">
            <span>LOCAL BACKUP</span>
            <strong>备份这台设备的学习资料</strong>
            <p>包含笔记、做题历史、完成与收藏记录。</p>
            <button type="button" className="profile-backup-download" onClick={downloadBackup}>下载备份</button>
            <button type="button" className="profile-backup-import" onClick={() => importRef.current?.click()}>导入备份</button>
            <input ref={importRef} className="profile-import-input" type="file" accept="application/json,.json" onChange={importBackup} />
            {message ? <small role="status">{message}</small> : null}
          </div>
        </aside>
        <section className="local-profile-content">{content}</section>
      </main>
    </div>
  );
}
