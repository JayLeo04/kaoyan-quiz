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
type AttemptRecord = {
  selectedOption: string | null;
  correct: boolean | null;
  answeredAt: string;
};
type PracticeProgress = {
  completed: string[];
  bookmarks: string[];
  attempts: Record<string, AttemptRecord>;
};
type TypeFilter = "all" | "choice" | "answer" | "wrong";

const STORAGE_KEY = "yanshua-408-progress-v1";
const EMPTY_PROGRESS: PracticeProgress = { completed: [], bookmarks: [], attempts: {} };
const PAGE_SIZE = 8;
const osQuestions: SubjectQuestion[] = questionSeeds.map((question) => ({ ...question, subject: "os" }));
const allQuestions: SubjectQuestion[] = [
  ...catalogQuestions,
  ...osQuestions,
];

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

function AppHeader({ progress }: { progress: PracticeProgress }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link href="/" className="app-brand" aria-label="研刷 408 首页">
          <span>研</span>
          <strong>研刷 408</strong>
        </Link>
        <nav aria-label="科目导航">
          {subjectCatalog.map((subject) => <Link key={subject.id} href={`/subject/${subject.id}`}>{subject.shortName}</Link>)}
        </nav>
        <div className="header-progress"><span>已完成</span><b>{progress.completed.length}</b><span>题</span></div>
      </div>
    </header>
  );
}

function HomePage({ progress }: { progress: PracticeProgress }) {
  const completedSet = new Set(progress.completed);
  return (
    <div className="viewport-app">
      <AppHeader progress={progress} />
      <main className="home-main shell-width">
        <section className="home-intro">
          <div>
            <p className="page-label">全国硕士研究生招生考试 · 408</p>
            <h1>408<br />四科题库</h1>
          </div>
          <div className="home-intro-bottom">
            <p>选择科目，进入题库。<br />逐题作答，并记录完成与收藏。</p>
            <div className="overview-stat">
              <span>当前题目</span>
              <strong>{allQuestions.length}</strong>
              <small>操作系统真题已完整接入</small>
            </div>
          </div>
        </section>
        <section className="home-subjects" aria-label="选择科目">
          {subjectCatalog.map((subject) => {
            const questions = allQuestions.filter((question) => question.subject === subject.id);
            const completed = questions.filter((question) => completedSet.has(question.id)).length;
            return (
              <Link key={subject.id} href={`/subject/${subject.id}`} className={`home-subject-card accent-${subject.accent}`}>
                <div className="home-card-top"><span>{subject.index}</span><span>进入题库 ↗</span></div>
                <div className="home-card-title"><small>{subject.english}</small><h2>{subject.name}</h2></div>
                <div className="home-card-bottom">
                  <span>{subject.topics.join(" / ")}</span>
                  <strong>{questions.length}<small> 题</small></strong>
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
      <h3>{question.prompt}</h3>
      <div className="card-bottom"><span>{question.tags.slice(0, 2).join(" · ") || question.section}</span><b>作答 →</b></div>
    </Link>
  );
}

function SubjectPage({ subjectId, progress }: { subjectId: SubjectId; progress: PracticeProgress }) {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(1);
  const subject = subjectById.get(subjectId)!;
  const subjectQuestions = useMemo(() => allQuestions.filter((question) => question.subject === subjectId), [subjectId]);
  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return subjectQuestions.filter((question) => {
      const typeMatch = typeFilter === "all" || (typeFilter === "wrong" ? progress.attempts[question.id]?.correct === false : question.questionType === typeFilter);
      const queryMatch = !normalized || (question.prompt + question.title + question.tags.join(" ") + question.year).toLowerCase().includes(normalized);
      return typeMatch && queryMatch;
    });
  }, [progress.attempts, query, subjectQuestions, typeFilter]);
  const totalPages = Math.max(1, Math.ceil(filteredQuestions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageQuestions = filteredQuestions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const completed = subjectQuestions.filter((question) => progress.completed.includes(question.id)).length;
  const setFilter = (value: TypeFilter) => { setTypeFilter(value); setPage(1); };

  return (
    <div className="viewport-app">
      <AppHeader progress={progress} />
      <main className={`subject-main shell-width accent-${subject.accent}`}>
        <aside className="subject-summary">
          <Link href="/" className="back-link">← 408 四科</Link>
          <div>
            <p className="page-label">{subject.index} / {subject.english}</p>
            <h1>{subject.name}</h1>
            <p>{subject.description}</p>
          </div>
          <div className="subject-numbers">
            <div><span>题目</span><strong>{subjectQuestions.length}</strong></div>
            <div><span>完成</span><strong>{completed}</strong></div>
          </div>
          <div className="subject-switcher">
            {subjectCatalog.map((item) => <Link key={item.id} className={item.id === subjectId ? "active" : ""} href={`/subject/${item.id}`}>{item.index} {item.shortName}</Link>)}
          </div>
        </aside>
        <section className="subject-library">
          <div className="library-head">
            <div><span>题库</span><strong>{filteredQuestions.length} 道</strong></div>
            <div className="library-filters">
              <div className="segmented-control">
                <button className={typeFilter === "all" ? "active" : ""} onClick={() => setFilter("all")}>全部</button>
                <button className={typeFilter === "choice" ? "active" : ""} onClick={() => setFilter("choice")}>选择题</button>
                <button className={typeFilter === "answer" ? "active" : ""} onClick={() => setFilter("answer")}>解答题</button>
                <button className={typeFilter === "wrong" ? "active" : ""} onClick={() => setFilter("wrong")}>错题</button>
              </div>
              <label className="compact-search"><span>⌕</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="搜索题目" /></label>
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
        </section>
      </main>
    </div>
  );
}

function KnowledgeLinks({ question }: { question: SubjectQuestion }) {
  const points = pointsFor(question);
  if (!points.length) return null;
  return (
    <div className="question-knowledge">
      <span>关联知识点</span>
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

function QuestionPage({
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
  const subjectQuestions = allQuestions.filter((item) => item.subject === question.subject);
  const currentIndex = subjectQuestions.findIndex((item) => item.id === question.id);
  const nextQuestion = subjectQuestions[(currentIndex + 1) % subjectQuestions.length];
  const correctOption = question.answer.match(/[A-D]/)?.[0] || null;
  const completed = progress.completed.includes(question.id);
  const bookmarked = progress.bookmarks.includes(question.id);
  const savedAttempt = progress.attempts[question.id];
  const save = (value: PracticeProgress) => updateProgress(value);
  const toggleCompleted = () => save({ ...progress, completed: completed ? progress.completed.filter((id) => id !== question.id) : [...progress.completed, question.id] });
  const toggleBookmark = () => save({ ...progress, bookmarks: bookmarked ? progress.bookmarks.filter((id) => id !== question.id) : [...progress.bookmarks, question.id] });

  useEffect(() => {
    setSelectedOption(savedAttempt?.selectedOption ?? null);
    setRevealed(Boolean(savedAttempt));
  }, [question.id, savedAttempt?.answeredAt, savedAttempt?.selectedOption]);

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
  };

  return (
    <div className="viewport-app question-viewport">
      <AppHeader progress={progress} />
      <main className={`question-main shell-width accent-${subject.accent}`}>
        <div className="question-toolbar">
          <Link href={`/subject/${question.subject}`}>← {subject.name}题库</Link>
          <div><span>{currentIndex + 1} / {subjectQuestions.length}</span><span>{question.year || "专项练习"} · {questionTypeLabel(question)}</span></div>
        </div>
        <div className="question-workspace">
          <article className="question-content">
            <div className="question-content-scroll">
              <p className="page-label">{question.number}</p>
              <h1>{question.title}</h1>
              <p className="single-prompt">{question.prompt}</p>
              {question.images.length ? <div className="single-images">{question.images.map((src, index) => <img key={src} src={src} alt={`${question.number} 题图 ${index + 1}`} />)}</div> : null}
              {question.options.length ? (
                <div className="single-options" role="group" aria-label="请选择答案">
                  {question.options.map((option) => {
                    const isSelected = selectedOption === option.label;
                    const isCorrect = revealed && correctOption === option.label;
                    const isWrong = revealed && isSelected && correctOption !== option.label;
                    return <button key={option.label} type="button" className={[isSelected ? "selected" : "", isCorrect ? "correct" : "", isWrong ? "wrong" : ""].filter(Boolean).join(" ")} onClick={() => { if (!revealed) setSelectedOption(option.label); }}><span>{option.label}</span><p>{option.text}</p>{isCorrect ? <b>正确答案</b> : isWrong ? <b>你的选择</b> : null}</button>;
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
            {!revealed ? (
              <div className="answer-placeholder">
                <span>完成作答后查看解析</span>
                <strong>{question.options.length ? "选择一个答案" : "先在纸上完成解答"}</strong>
                <button disabled={Boolean(question.options.length) && !selectedOption} onClick={submitAnswer}>{question.options.length ? "提交并查看解析" : "查看参考解析"}</button>
              </div>
            ) : (
              <div className="answer-reveal-panel">
                <div className="answer-reveal-head"><span>参考答案{savedAttempt ? ` · ${new Date(savedAttempt.answeredAt).toLocaleString("zh-CN", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}` : ""}</span><strong>{question.answer || "解题思路"}</strong></div>
                <div className="answer-scroll"><p>{question.solution || "这道题暂未录入解析，请结合知识点自行复盘。"}</p><KnowledgeLinks question={question} /></div>
              </div>
            )}
            <Link className="next-question" href={`/question/${nextQuestion.id}`}><span>下一题</span><p>{nextQuestion.prompt}</p><b>继续 →</b></Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

export function StudyWorkspace({ initialQuestionId, initialSubjectId }: { initialQuestionId?: string; initialSubjectId?: string }) {
  const [progress, setProgress] = useState<PracticeProgress>(EMPTY_PROGRESS);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as PracticeProgress | null;
      if (saved && Array.isArray(saved.completed) && Array.isArray(saved.bookmarks)) {
        setProgress({ ...saved, attempts: saved.attempts && typeof saved.attempts === "object" ? saved.attempts : {} });
      }
    } catch { window.localStorage.removeItem(STORAGE_KEY); }
  }, []);

  const updateProgress = (value: PracticeProgress) => {
    setProgress(value);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  if (initialQuestionId) {
    const question = allQuestions.find((item) => item.id === initialQuestionId);
    if (question) return <QuestionPage question={question} progress={progress} updateProgress={updateProgress} />;
  }
  if (initialSubjectId && subjectById.has(initialSubjectId as SubjectId)) return <SubjectPage subjectId={initialSubjectId as SubjectId} progress={progress} />;
  if (initialQuestionId || initialSubjectId) return <div className="viewport-app"><AppHeader progress={progress} /><main className="missing-page"><span>404</span><h1>这个页面暂时不存在。</h1><Link href="/">返回 408 四科题库</Link></main></div>;
  return <HomePage progress={progress} />;
}
