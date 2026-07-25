"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  knowledgeById,
  questionSeeds,
  sectionSegments,
  segmentHref,
  type StudyQuestion,
} from "@/app/data/study";
import {
  catalogQuestions,
  subjectById,
  subjectCatalog,
  type SubjectId,
} from "@/app/data/catalog";

type SubjectQuestion = StudyQuestion & { subject: SubjectId };
type SubjectFilter = SubjectId | "all";
type TypeFilter = "all" | "choice" | "answer";
type PracticeProgress = {
  completed: string[];
  bookmarks: string[];
};

const STORAGE_KEY = "yanshua-408-progress-v1";
const EMPTY_PROGRESS: PracticeProgress = { completed: [], bookmarks: [] };
const osQuestions: SubjectQuestion[] = questionSeeds.map((question) => ({ ...question, subject: "os" }));
const allQuestions: SubjectQuestion[] = [
  catalogQuestions[0],
  catalogQuestions[2],
  osQuestions[0],
  catalogQuestions[4],
  catalogQuestions[1],
  catalogQuestions[3],
  ...osQuestions.slice(1),
  catalogQuestions[5],
];

function titleOf(value: string) {
  return value.replace(/^\d+(?:\.\d+)*　/, "");
}

function questionTypeLabel(question: StudyQuestion) {
  if (question.questionType === "choice") return "选择题";
  if (question.questionType === "answer") return "解答题";
  return "自录题";
}

function pointsFor(question: StudyQuestion) {
  return question.knowledgeIds
    .map((id) => knowledgeById.get(id))
    .filter((point): point is NonNullable<typeof point> => Boolean(point));
}

function BrandHeader({ progress }: { progress: PracticeProgress }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="wordmark" aria-label="研刷 408 首页">
          <span className="wordmark-seal">研</span>
          <span>研刷 <b>408</b></span>
        </Link>
        <nav className="main-nav" aria-label="主导航">
          <Link href="/#subjects">科目</Link>
          <Link href="/#question-bank">题库</Link>
          <Link href="/#method">复习路径</Link>
        </nav>
        <Link className="today-chip" href="/#question-bank">
          <span>今日</span>
          <strong>{progress.completed.length} 道已完成</strong>
        </Link>
      </div>
    </header>
  );
}

function SubjectCard({
  subjectId,
  count,
  completed,
  active,
  onSelect,
}: {
  subjectId: SubjectId;
  count: number;
  completed: number;
  active: boolean;
  onSelect: () => void;
}) {
  const subject = subjectById.get(subjectId)!;
  const progress = count ? Math.min(100, Math.round((completed / count) * 100)) : 0;
  return (
    <button
      className={`subject-card accent-${subject.accent}${active ? " is-active" : ""}`}
      onClick={onSelect}
      type="button"
    >
      <div className="subject-topline">
        <span>{subject.index}</span>
        <span className="subject-arrow">↗</span>
      </div>
      <div>
        <p>{subject.english}</p>
        <h3>{subject.name}</h3>
        <span className="subject-description">{subject.description}</span>
      </div>
      <div className="subject-topics">
        {subject.topics.map((topic) => <span key={topic}>{topic}</span>)}
      </div>
      <div className="subject-status">
        <span>{subjectId === "os" ? `${count} 道真题` : `${count} 道示例题`}</span>
        <span>{completed ? `已完成 ${completed}` : "开始练习"}</span>
      </div>
      <div className="thin-progress"><i style={{ width: `${progress}%` }} /></div>
    </button>
  );
}

function QuestionRow({ question, progress }: { question: SubjectQuestion; progress: PracticeProgress }) {
  const subject = subjectById.get(question.subject)!;
  const done = progress.completed.includes(question.id);
  const saved = progress.bookmarks.includes(question.id);
  return (
    <Link className="question-row" href={`/question/${question.id}`}>
      <div className={`question-subject-dot accent-${subject.accent}`} aria-hidden="true" />
      <div className="question-index">
        <span>{question.year || "练习"}</span>
        <strong>{question.questionNumber ? String(question.questionNumber).padStart(2, "0") : "—"}</strong>
      </div>
      <div className="question-copy">
        <div className="question-labels">
          <span>{subject.shortName}</span>
          <span>{questionTypeLabel(question)}</span>
          {done ? <span className="done-label">已完成</span> : null}
        </div>
        <h3>{question.prompt}</h3>
        <p>{question.tags.slice(0, 3).join(" · ")}</p>
      </div>
      <div className="question-tail">
        {saved ? <span className="bookmark-mark" aria-label="已收藏">◆</span> : null}
        <span>作答 <b>→</b></span>
      </div>
    </Link>
  );
}

function HomePage({ progress }: { progress: PracticeProgress }) {
  const [activeSubject, setActiveSubject] = useState<SubjectFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return allQuestions.filter((question) => {
      const subjectMatch = activeSubject === "all" || question.subject === activeSubject;
      const typeMatch = typeFilter === "all" || question.questionType === typeFilter;
      const queryMatch = !normalized || (
        question.prompt + question.title + question.number + question.tags.join(" ")
      ).toLowerCase().includes(normalized);
      return subjectMatch && typeMatch && queryMatch;
    });
  }, [activeSubject, query, typeFilter]);

  const dailyQuestion = allQuestions.find((question) => !progress.completed.includes(question.id)) || allQuestions[0];
  const completedSet = new Set(progress.completed);
  const completionRate = Math.round((progress.completed.length / Math.max(allQuestions.length, 1)) * 100);
  const selectSubject = (id: SubjectId) => {
    setActiveSubject(id);
    setShowAll(false);
    window.requestAnimationFrame(() => document.getElementById("question-bank")?.scrollIntoView({ behavior: "smooth" }));
  };

  return (
    <>
      <BrandHeader progress={progress} />
      <main>
        <section className="hero page-width">
          <div className="hero-copy">
            <p className="kicker"><span />全国硕士研究生招生考试 · 408</p>
            <h1>今天，<br />刷到会。</h1>
            <p className="hero-intro">不是堆题量。按科目组织真题，用一次作答连接知识点、解析与下一轮复习。</p>
            <div className="hero-actions">
              <Link className="button button-dark" href={`/question/${dailyQuestion.id}`}>开始今日练习 <span>→</span></Link>
              <Link className="text-link" href="#question-bank">浏览全部题目 <span>↓</span></Link>
            </div>
          </div>
          <aside className="daily-board" aria-label="今日刷题计划">
            <div className="board-head">
              <span>DAILY / 10</span>
              <span className="live-indicator">今日任务</span>
            </div>
            <div className="board-number">
              <strong>{String(Math.min(progress.completed.length, 10)).padStart(2, "0")}</strong>
              <span>/ 10</span>
            </div>
            <div className="board-bars" aria-hidden="true">
              {Array.from({ length: 10 }, (_, index) => (
                <i key={index} className={index < Math.min(progress.completed.length, 10) ? "filled" : ""} />
              ))}
            </div>
            <div className="board-foot">
              <div><span>总进度</span><b>{completionRate}%</b></div>
              <div><span>已收藏</span><b>{progress.bookmarks.length}</b></div>
              <div><span>下一题</span><b>{subjectById.get(dailyQuestion.subject)?.shortName}</b></div>
            </div>
          </aside>
        </section>

        <section className="subject-section page-width" id="subjects">
          <div className="section-title">
            <div><p className="kicker"><span />四门子科目</p><h2>一套体系，四条路径。</h2></div>
            <p>先分科建立框架，再用整套真题检验迁移能力。</p>
          </div>
          <div className="subject-grid">
            {subjectCatalog.map((subject) => {
              const questions = allQuestions.filter((question) => question.subject === subject.id);
              const completed = questions.filter((question) => completedSet.has(question.id)).length;
              return <SubjectCard key={subject.id} subjectId={subject.id} count={questions.length} completed={completed} active={activeSubject === subject.id} onSelect={() => selectSubject(subject.id)} />;
            })}
          </div>
        </section>

        <section className="question-section" id="question-bank">
          <div className="page-width">
            <div className="section-title question-heading">
              <div><p className="kicker"><span />题库</p><h2>从一道真题开始。</h2></div>
              <p>操作系统已收录 2009–2026 年真题；其余三科已建立练习入口。</p>
            </div>
            <div className="filter-bar">
              <div className="subject-filters" aria-label="按科目筛选">
                <button className={activeSubject === "all" ? "active" : ""} onClick={() => setActiveSubject("all")}>全部</button>
                {subjectCatalog.map((subject) => (
                  <button key={subject.id} className={activeSubject === subject.id ? "active" : ""} onClick={() => setActiveSubject(subject.id)}>{subject.shortName}</button>
                ))}
              </div>
              <div className="type-filters" aria-label="按题型筛选">
                <button className={typeFilter === "all" ? "active" : ""} onClick={() => setTypeFilter("all")}>全部题型</button>
                <button className={typeFilter === "choice" ? "active" : ""} onClick={() => setTypeFilter("choice")}>选择题</button>
                <button className={typeFilter === "answer" ? "active" : ""} onClick={() => setTypeFilter("answer")}>解答题</button>
              </div>
              <label className="search-box">
                <span>⌕</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索题干、年份或知识点" />
              </label>
            </div>
            <div className="result-summary">
              <span>共 {filteredQuestions.length} 道</span>
              <span>{activeSubject === "all" ? "408 全科" : subjectById.get(activeSubject)?.name}</span>
            </div>
            <div className="question-list">
              {filteredQuestions.slice(0, showAll ? filteredQuestions.length : 16).map((question) => (
                <QuestionRow key={question.id} question={question} progress={progress} />
              ))}
              {!filteredQuestions.length ? <div className="empty-state"><strong>暂时没有匹配的题目</strong><p>换一个关键词或筛选条件试试。</p></div> : null}
            </div>
            {!showAll && filteredQuestions.length > 16 ? (
              <button className="load-more" onClick={() => setShowAll(true)}>展开其余 {filteredQuestions.length - 16} 道题 <span>↓</span></button>
            ) : null}
          </div>
        </section>

        <section className="method-section page-width" id="method">
          <div className="method-intro">
            <p className="kicker"><span />复习路径</p>
            <h2>做题不是终点，<br />下一次做对才是。</h2>
          </div>
          <div className="method-steps">
            <article><span>01</span><h3>先独立作答</h3><p>不给提示，保留第一反应。选择答案后再打开解析。</p></article>
            <article><span>02</span><h3>定位知识缺口</h3><p>把错因落到具体知识点，而不是只记住这道题的答案。</p></article>
            <article><span>03</span><h3>进入下一轮</h3><p>收藏犹豫题、标记完成题，让复盘有明确的优先级。</p></article>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="page-width"><span>研刷 408</span><p>把每一道题，变成下一次做对的依据。</p><span>2026</span></div>
      </footer>
    </>
  );
}

function KnowledgeLinks({ question }: { question: SubjectQuestion }) {
  const points = pointsFor(question);
  if (!points.length) return null;
  return (
    <section className="knowledge-panel">
      <div className="panel-heading"><span>关联知识点</span><b>{points.length}</b></div>
      <div className="knowledge-list">
        {points.map((point) => {
          const segment = point.segmentId ? sectionSegments.find((item) => item.id === point.segmentId) : undefined;
          const href = segmentHref(point.segmentId);
          return (
            <article key={point.id}>
              <div><span>{point.id}</span><h3>{titleOf(point.title)}</h3><p>{point.page ? `原书第 ${point.page} 页` : "知识点索引"}{segment ? ` · 阅读 ${segment.slice_start}–${segment.slice_end} 页` : ""}</p></div>
              {href ? <a href={href} target="_blank" rel="noreferrer">阅读片段 ↗</a> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function QuestionDetail({
  question,
  progress,
  updateProgress,
}: {
  question: SubjectQuestion;
  progress: PracticeProgress;
  updateProgress: (value: PracticeProgress) => void;
}) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const subject = subjectById.get(question.subject)!;
  const correctOption = question.answer.match(/[A-D]/)?.[0] || null;
  const isCompleted = progress.completed.includes(question.id);
  const isBookmarked = progress.bookmarks.includes(question.id);
  const subjectQuestions = allQuestions.filter((item) => item.subject === question.subject);
  const currentIndex = subjectQuestions.findIndex((item) => item.id === question.id);
  const nextQuestion = subjectQuestions[(currentIndex + 1) % subjectQuestions.length];

  const toggleCompleted = () => {
    updateProgress({
      ...progress,
      completed: isCompleted ? progress.completed.filter((id) => id !== question.id) : [...progress.completed, question.id],
    });
  };
  const toggleBookmark = () => {
    updateProgress({
      ...progress,
      bookmarks: isBookmarked ? progress.bookmarks.filter((id) => id !== question.id) : [...progress.bookmarks, question.id],
    });
  };

  return (
    <>
      <BrandHeader progress={progress} />
      <main className="detail-main page-width">
        <div className="detail-crumbs">
          <Link href="/#question-bank">← 返回题库</Link>
          <span>{subject.name}</span>
          <span>{questionTypeLabel(question)}</span>
        </div>
        <div className="detail-layout">
          <article className="question-sheet">
            <div className="sheet-meta">
              <span className={`subject-badge accent-${subject.accent}`}>{subject.name}</span>
              <span>{question.number}</span>
            </div>
            <h1>{question.title}</h1>
            <p className="question-prompt">{question.prompt}</p>
            {question.images.length ? <div className="question-images">{question.images.map((src, index) => <img key={src} src={src} alt={`${question.number} 题图 ${index + 1}`} />)}</div> : null}
            {question.options.length ? (
              <div className="option-list" role="group" aria-label="请选择答案">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.label;
                  const isCorrect = revealed && correctOption === option.label;
                  const isWrong = revealed && isSelected && correctOption !== option.label;
                  return (
                    <button
                      key={option.label}
                      className={["option-button", isSelected ? "selected" : "", isCorrect ? "correct" : "", isWrong ? "wrong" : ""].filter(Boolean).join(" ")}
                      onClick={() => { if (!revealed) setSelectedOption(option.label); }}
                      type="button"
                    >
                      <span>{option.label}</span><p>{option.text}</p>{isCorrect ? <b>正确</b> : null}{isWrong ? <b>你的选择</b> : null}
                    </button>
                  );
                })}
              </div>
            ) : null}
            <div className="answer-actions">
              <button className="button button-dark" disabled={Boolean(question.options.length) && !selectedOption} onClick={() => setRevealed(true)}>{revealed ? "解析已展开" : "核对答案"}</button>
              <button className={`button button-light${isBookmarked ? " active" : ""}`} onClick={toggleBookmark}>{isBookmarked ? "◆ 已收藏" : "◇ 收藏此题"}</button>
            </div>
            {revealed ? (
              <section className="answer-panel">
                <div className="answer-title"><span>答案与解析</span><strong>{question.answer || "参考思路"}</strong></div>
                <p>{question.solution || "这道题暂未录入解析，请先按知识点自行复盘。"}</p>
                <div className="answer-bottom">
                  <span>理解后再标记完成，复盘才有意义。</span>
                  <button className={isCompleted ? "completed" : ""} onClick={toggleCompleted}>{isCompleted ? "✓ 已完成" : "标记为已完成"}</button>
                </div>
              </section>
            ) : null}
            <KnowledgeLinks question={question} />
          </article>
          <aside className="detail-aside">
            <div className="aside-card">
              <span className="aside-label">本题定位</span>
              <strong>{question.year ? `${question.year} 年` : "专项练习"}</strong>
              <p>{question.section}</p>
              <div className="tag-cloud">{question.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            </div>
            <div className="aside-card next-card">
              <span className="aside-label">下一题</span>
              <p>{nextQuestion.prompt}</p>
              <Link href={`/question/${nextQuestion.id}`}>继续练习 <span>→</span></Link>
            </div>
            <Link className="aside-back" href={`/#question-bank`}>查看 {subject.name} 题库</Link>
          </aside>
        </div>
      </main>
    </>
  );
}

export function StudyWorkspace({ initialQuestionId }: { initialQuestionId?: string }) {
  const [progress, setProgress] = useState<PracticeProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as PracticeProgress | null;
      if (saved && Array.isArray(saved.completed) && Array.isArray(saved.bookmarks)) setProgress(saved);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const updateProgress = (value: PracticeProgress) => {
    setProgress(value);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  if (!initialQuestionId) return <HomePage progress={progress} />;
  const selected = allQuestions.find((question) => question.id === initialQuestionId);
  if (!selected) {
    return (
      <><BrandHeader progress={progress} /><main className="not-found page-width"><span>404</span><h1>这道题暂时不在题库里。</h1><Link className="button button-dark" href="/">返回首页</Link></main></>
    );
  }
  return <QuestionDetail question={selected} progress={progress} updateProgress={updateProgress} />;
}
