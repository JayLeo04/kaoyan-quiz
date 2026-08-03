"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import { textbookHref, textbookPracticeHref, textbookQuestionHref } from "@/app/data/textbook-registry";
import type {
  TextbookChapterSummary,
  TextbookPracticeLibraryPayload,
  TextbookQuestion,
  TextbookQuestionPayload,
  TextbookQuestionSummary,
} from "@/app/data/textbook-types";
import {
  EMPTY_TEXTBOOK_PROGRESS,
  readTextbookProgress,
  toggleTextbookBookmark,
  toggleTextbookStatus,
  writeTextbookProgress,
  type TextbookProgress,
} from "@/app/lib/textbook-progress";
import { withSiteAssetPaths } from "@/app/lib/site-path";

const typeLabels: Record<string, string> = {
  algorithm: "算法题",
  calculation: "计算题",
  programming: "程序设计题",
  discussion: "论述题",
  "short-answer": "简答题",
  practical: "应用题",
  choice: "选择题",
  "fill-blank": "填空题",
  "true-false": "判断题",
  unknown: "待分类",
};

function questionTypeLabel(type: string) {
  return typeLabels[type] || "习题";
}

type AnswerPresentation = Pick<TextbookQuestion["answer"], "status" | "origin"> & {
  hasVerified?: boolean;
  verifiedHtml?: string;
};

function answerLabel(question: { answer: AnswerPresentation }) {
  if (question.answer.hasVerified || question.answer.verifiedHtml) {
    return question.answer.origin === "book+verified" ? "原书内容 · 核验补充" : "独立核验解答";
  }
  if (question.answer.status === "provided") return "原书答案";
  if (question.answer.status === "hint-only") return "原书提示";
  if (question.answer.status === "pending-review") return "答案待复核";
  return "未收录独立答案";
}

function pagesLabel(pages?: number[]) {
  if (!pages?.length) return "页码未标注";
  return pages.length === 1 ? `书内页 ${pages[0]}` : `书内页 ${pages[0]}–${pages.at(-1)}`;
}

function ProgressMark({ question, progress }: { question: Pick<TextbookQuestion, "id">; progress: TextbookProgress }) {
  if (progress.mastered.includes(question.id)) return <span className="textbook-status mastered">已掌握</span>;
  if (progress.review.includes(question.id)) return <span className="textbook-status review">需复习</span>;
  if (progress.bookmarks.includes(question.id)) return <span className="textbook-status saved">已收藏</span>;
  return <span className="textbook-status">未标记</span>;
}

function PracticeLibraryCard({ question, progress, bookSlug, chapters }: { question: TextbookQuestionSummary; progress: TextbookProgress; bookSlug: string; chapters: TextbookChapterSummary[] }) {
  const chapter = chapters.find((item) => item.id === question.chapterId);
  const cardHref = textbookQuestionHref(bookSlug, question.id);
  return (
    <Link href={cardHref} className="textbook-question-card">
      <div className="textbook-question-card-meta">
        <span>{question.number} · {questionTypeLabel(question.type)}</span>
        <ProgressMark question={question} progress={progress} />
      </div>
      <h2>{question.prompt.plain}</h2>
      <div className="textbook-question-card-bottom">
        <span>{chapter?.title || question.section.title}</span>
        <b>{answerLabel(question)} →</b>
      </div>
    </Link>
  );
}

export function TextbookPracticeWorkspace({ initialChapterId, library }: { initialChapterId?: string; library: TextbookPracticeLibraryPayload }) {
  const textbook = { slug: library.bookSlug };
  const dataset = { book: library.book, stats: library.stats, chapters: library.chapters };
  const exerciseQuestions = library.exerciseQuestions;
  const validInitialChapter = dataset.chapters.some((chapter) => chapter.id === initialChapterId) ? initialChapterId! : "all";
  const [chapterId, setChapterId] = useState(validInitialChapter);
  const [type, setType] = useState("all");
  const [answer, setAnswer] = useState("all");
  const [learning, setLearning] = useState("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState<TextbookProgress>(EMPTY_TEXTBOOK_PROGRESS);

  useEffect(() => {
    // Browser-only state is intentionally kept separate from the real-question progress record.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(readTextbookProgress(textbook.slug));
  }, [textbook.slug]);

  const filteredQuestions = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return exerciseQuestions.filter((question) => {
      const chapterMatch = chapterId === "all" || question.chapterId === chapterId;
      const typeMatch = type === "all" || question.type === type;
      const answerMatch = answer === "all" || (answer === "verified" ? question.answer.hasVerified : question.answer.status === answer);
      const learningMatch = learning === "all"
        || (learning === "mastered" && progress.mastered.includes(question.id))
        || (learning === "review" && progress.review.includes(question.id))
        || (learning === "unmarked" && !progress.mastered.includes(question.id) && !progress.review.includes(question.id));
      const queryMatch = !normalized || `${question.number} ${question.prompt.plain} ${question.section.title} ${question.knowledgePoints.map((point) => point.title).join(" ")}`.toLocaleLowerCase().includes(normalized);
      return chapterMatch && typeMatch && answerMatch && learningMatch && queryMatch;
    });
  }, [answer, chapterId, exerciseQuestions, learning, progress.mastered, progress.review, query, type]);

  const pageSize = 12;
  const pageCount = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleQuestions = filteredQuestions.slice((safePage - 1) * pageSize, safePage * pageSize);
  const chapterOptions = dataset.chapters.filter((chapter) => chapter.questionCount > 0);
  const continueQuestion = exerciseQuestions.find((question) => !progress.mastered.includes(question.id));
  const resetPage = () => setPage(1);
  const resetAll = () => {
    setChapterId("all");
    setType("all");
    setAnswer("all");
    setLearning("all");
    setQuery("");
    setPage(1);
  };

  return (
    <div className="textbook-viewport textbook-practice-viewport">
      <AppHeader completedCount={progress.mastered.length} />
      <main className="textbook-practice-main shell-width">
        <section className="textbook-practice-hero">
          <div>
            <Link href={textbookHref(textbook)} className="back-link">← 返回教材阅读</Link>
            <p>TEXTBOOK PRACTICE / {dataset.book.title}</p>
            <h1>按章节，做完这本书的题</h1>
            <span>{dataset.stats.exerciseQuestions} 道可练习题 · {dataset.stats.answersProvided} 道含原书完整答案 · {dataset.stats.answersHintOnly} 道仅原书提示 · {dataset.stats.answersVerified} 道有独立核验补充</span>
          </div>
          <div className="textbook-practice-progress">
            <strong>{progress.mastered.length}</strong><span>已掌握</span>
            <i style={{ width: `${dataset.stats.exerciseQuestions ? progress.mastered.length / dataset.stats.exerciseQuestions * 100 : 0}%` }} />
            <small>{progress.review.length} 道待复习 · {progress.bookmarks.length} 道已收藏</small>
            {continueQuestion ? <Link href={textbookQuestionHref(textbook, continueQuestion.id)}>继续下一题 →</Link> : <span className="complete">全部已标记掌握</span>}
          </div>
        </section>

        <section className="textbook-library-toolbar" aria-label="筛选教材习题">
          <label>
            <span>章节</span>
            <select value={chapterId} onChange={(event) => { setChapterId(event.target.value); resetPage(); }}>
              <option value="all">全部章节</option>
              {chapterOptions.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.title} · {chapter.questionCount} 题</option>)}
            </select>
          </label>
          <label>
            <span>题型</span>
            <select value={type} onChange={(event) => { setType(event.target.value); resetPage(); }}>
              <option value="all">全部题型</option>
              {[...new Set(exerciseQuestions.map((question) => question.type))].map((item) => <option key={item} value={item}>{questionTypeLabel(item)}</option>)}
            </select>
          </label>
          <label>
            <span>答案</span>
            <select value={answer} onChange={(event) => { setAnswer(event.target.value); resetPage(); }}>
              <option value="all">全部答案状态</option>
              <option value="provided">有完整参考解答</option>
              <option value="hint-only">仅原书提示</option>
              <option value="verified">独立核验补充</option>
              <option value="missing">未收录完整参考内容</option>
              <option value="pending-review">待复核</option>
            </select>
          </label>
          <label>
            <span>学习状态</span>
            <select value={learning} onChange={(event) => { setLearning(event.target.value); resetPage(); }}>
              <option value="all">全部状态</option>
              <option value="unmarked">未标记</option>
              <option value="mastered">已掌握</option>
              <option value="review">需复习</option>
            </select>
          </label>
          <label className="textbook-library-search">
            <span>⌕</span>
            <input value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="搜索题干、章节或知识点" />
          </label>
          <button type="button" onClick={resetAll}>清除筛选</button>
        </section>

        <section className="textbook-library-results">
          <div className="textbook-library-results-head">
            <div><span>QUESTION BANK</span><strong>{filteredQuestions.length} 道匹配题目</strong></div>
            <small>每题保留对应章节、图片、答案状态与来源页码。</small>
          </div>
          <div className="textbook-question-grid">
            {visibleQuestions.map((question) => <PracticeLibraryCard key={question.id} question={question} progress={progress} bookSlug={library.bookSlug} chapters={library.chapters} />)}
            {!visibleQuestions.length ? <div className="textbook-library-empty"><strong>没有匹配的题目</strong><span>试试放宽章节、答案或学习状态筛选。</span></div> : null}
          </div>
          <nav className="textbook-library-pagination" aria-label="习题分页">
            <span>第 {safePage} / {pageCount} 页</span>
            <div><button type="button" disabled={safePage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>← 上一页</button><button type="button" disabled={safePage >= pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))}>下一页 →</button></div>
          </nav>
        </section>
      </main>
    </div>
  );
}

export function TextbookQuestionWorkspace({ questionData }: { questionData: TextbookQuestionPayload }) {
  const textbook = { slug: questionData.bookSlug };
  const dataset = { chapters: questionData.chapters };
  const question = questionData.question;
  const questionId = question?.id || "";
  const [progress, setProgress] = useState<TextbookProgress>(EMPTY_TEXTBOOK_PROGRESS);
  const [answerVisible, setAnswerVisible] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(readTextbookProgress(textbook.slug));
  }, [textbook.slug]);

  useEffect(() => {
    // Every newly opened question starts with its answer concealed, including questions with no source answer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnswerVisible(false);
  }, [questionId, textbook.slug]);

  const saveProgress = (next: TextbookProgress) => {
    setProgress(next);
    writeTextbookProgress(textbook.slug, next);
  };

  if (!question) {
    return (
      <div className="textbook-viewport">
        <AppHeader completedCount={progress.mastered.length} />
        <main className="textbook-missing shell-width"><span>404</span><h1>没有找到这道教材习题。</h1><Link href={textbookPracticeHref(textbook)}>回到题库</Link></main>
      </div>
    );
  }

  const chapter = dataset.chapters.find((item) => item.id === question.chapterId);
  const chapterQuestions = questionData.chapterExerciseQuestionIds[question.chapterId] || [];
  const index = chapterQuestions.findIndex((item) => item === question.id);
  const previousQuestion = index > 0 ? { id: chapterQuestions[index - 1] } : null;
  const nextQuestion = index >= 0 && index < chapterQuestions.length - 1 ? { id: chapterQuestions[index + 1] } : null;
  const sourceQuestion = question.source.question;
  const sourceAnswer = question.source.answer;
  const mastered = progress.mastered.includes(question.id);
  const review = progress.review.includes(question.id);
  const bookmarked = progress.bookmarks.includes(question.id);
  const openFlags = question.review.flags.filter((flag) => flag.status === "open");
  const chapterPracticeHref = textbookPracticeHref(textbook, question.chapterId);
  const chapterKnowledgeHref = textbookHref(textbook, chapter?.id);

  return (
    <div className="textbook-viewport textbook-question-viewport">
      <AppHeader completedCount={progress.mastered.length} />
      <main className="textbook-question-main shell-width">
        <header className="textbook-question-toolbar">
          <Link href={chapterPracticeHref}>← {chapter?.title || "返回本章题目"}</Link>
          <span>{index + 1} / {chapterQuestions.length}</span>
          <nav>
            {previousQuestion ? <Link href={textbookQuestionHref(textbook, previousQuestion.id)}>← 上一题</Link> : <span />}
            {nextQuestion ? <Link href={textbookQuestionHref(textbook, nextQuestion.id)}>下一题 →</Link> : <span />}
          </nav>
        </header>

        <section className="textbook-question-workspace">
          <article className="textbook-question-content">
            <div className="textbook-question-scroll">
              <div className="textbook-question-eyebrow"><span>{question.number}</span><span>{questionTypeLabel(question.type)}</span><span>{question.section.title}</span></div>
              <h1>第 {question.number} 题</h1>
              <div className="textbook-question-html" dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(question.prompt.html) }} />
              {question.options.length ? (
                <section className="textbook-question-options">
                  <header><span>QUESTION PARTS</span><strong>题中给出的操作或选项</strong></header>
                  <ol>{question.options.map((option) => <li key={option.label}><b>{option.label}</b><div dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(option.html) }} /></li>)}</ol>
                </section>
              ) : null}
              <div className="textbook-learning-actions">
                <button className={mastered ? "active mastered" : ""} type="button" onClick={() => saveProgress(toggleTextbookStatus(progress, question.id, "mastered"))}>{mastered ? "✓ 已掌握" : "标记已掌握"}</button>
                <button className={review ? "active review" : ""} type="button" onClick={() => saveProgress(toggleTextbookStatus(progress, question.id, "review"))}>{review ? "↺ 需复习" : "标记需复习"}</button>
                <button className={bookmarked ? "active saved" : ""} type="button" onClick={() => saveProgress(toggleTextbookBookmark(progress, question.id))}>{bookmarked ? "◆ 已收藏" : "◇ 收藏"}</button>
                <button className="show-answer" type="button" onClick={() => setAnswerVisible((visible) => !visible)}>{answerVisible ? "收起参考内容" : question.answer.verifiedHtml ? "查看参考解答" : "查看原书答案 / 提示"}</button>
              </div>
            </div>
          </article>

          <aside className="textbook-question-aside">
            <section className="textbook-answer-panel">
              <header>
                <div><span>REFERENCE</span><strong>{answerLabel(question)}</strong></div>
                <button type="button" onClick={() => setAnswerVisible((visible) => !visible)}>{answerVisible ? "隐藏" : "显示"}</button>
              </header>
              {answerVisible ? (() => {
                const hasBookAnswer = Boolean(question.answer.html.trim());
                const hasVerifiedAnswer = Boolean(question.answer.verifiedHtml?.trim());
                if (!hasBookAnswer && !hasVerifiedAnswer) {
                  return <div className="textbook-answer-missing"><strong>暂未收录可独立对应的完整参考内容。</strong><p>原书内容保持缺答状态；后续仅在完成独立核验后才会补充。</p></div>;
                }
                if (!hasVerifiedAnswer) return <div className="textbook-answer-html" dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(question.answer.html) }} />;
                return (
                  <div className="textbook-answer-composite">
                    {hasBookAnswer ? <section className="textbook-book-answer"><span>原书保留内容</span><div className="textbook-answer-html" dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(question.answer.html) }} /></section> : null}
                    <section className="textbook-verified-answer">
                      <header><span>独立核验补充</span><small>非原书答案</small></header>
                      <div className="textbook-answer-html" dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(question.answer.verifiedHtml || "") }} />
                      {question.answer.explanation ? <p className="textbook-verified-note">核验说明：{question.answer.explanation}</p> : null}
                    </section>
                  </div>
                );
              })() : <div className="textbook-answer-closed"><strong>先独立作答</strong><span>点击“显示”后查看原书保留内容或独立核验补充。</span></div>}
            </section>

            <section className="textbook-question-context">
              <span>KNOWLEDGE CONNECTION</span>
              <strong>对应知识点</strong>
              <div className="textbook-question-tags">{question.knowledgePoints.map((point) => <b key={point.id}>{point.title}</b>)}</div>
              <Link href={chapterKnowledgeHref}>阅读对应教材章节 <b>→</b></Link>
            </section>

            <section className="textbook-question-source">
              <span>SOURCE TRACE</span>
              <strong>题目与答案来源</strong>
              <p>{pagesLabel(sourceQuestion?.bookPages)} · PDF {sourceQuestion?.pdfPages?.join("、") || "未标注"}</p>
              {sourceAnswer ? <p>答案：{pagesLabel(sourceAnswer.bookPages)} · PDF {sourceAnswer.pdfPages?.join("、") || "未标注"}</p> : <p>答案篇未建立对应条目。</p>}
              {question.answer.verifiedHtml ? <p>补充：独立核验解答，不替代原书内容。</p> : null}
            </section>

            {openFlags.length ? <details className="textbook-review-flags"><summary>来源审校提示 · {openFlags.length}</summary><ul>{openFlags.map((flag) => <li key={`${flag.code}-${flag.message}`}><b>{flag.code}</b>{flag.message}</li>)}</ul></details> : null}
          </aside>
        </section>
      </main>
    </div>
  );
}
