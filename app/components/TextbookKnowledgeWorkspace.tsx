"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import textbookData from "@/app/data/textbook-data-structures.json";
import type { DataStructuresTextbookDataset, TextbookPage } from "@/app/data/textbook-types";
import { readTextbookProgress } from "@/app/lib/textbook-progress";

const dataset = textbookData as DataStructuresTextbookDataset;

function sourceLabel(page: TextbookPage) {
  const parts = [];
  if (page.source.attributes.book_pages) parts.push(`书内页 ${page.source.attributes.book_pages}`);
  if (page.source.attributes.pdf_pages) parts.push(`PDF ${page.source.attributes.pdf_pages}`);
  return parts.join(" · ") || "保留 OCR 来源标记";
}

function matchesPage(page: TextbookPage, query: string) {
  const value = query.trim().toLocaleLowerCase();
  if (!value) return true;
  return `${page.title} ${page.summary} ${page.headings.join(" ")}`.toLocaleLowerCase().includes(value);
}

export function TextbookKnowledgeWorkspace({ currentSlug }: { currentSlug: string }) {
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const currentIndex = dataset.pages.findIndex((page) => page.slug === currentSlug);
  const currentPage = currentIndex >= 0 ? dataset.pages[currentIndex] : null;
  const previousPage = currentIndex > 0 ? dataset.pages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < dataset.pages.length - 1 ? dataset.pages[currentIndex + 1] : null;

  useEffect(() => {
    const progress = readTextbookProgress();
    // Browser-only progress belongs to this textbook, not the 408 real-question bank.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedCount(progress.mastered.length);
  }, []);

  const visiblePages = useMemo(() => dataset.pages.filter((page) => matchesPage(page, query)), [query]);
  const visibleIds = useMemo(() => new Set(visiblePages.map((page) => page.id)), [visiblePages]);
  const knowledgeChapters = dataset.chapters.filter((chapter) => chapter.route);

  if (!currentPage) {
    return (
      <div className="textbook-viewport">
        <AppHeader completedCount={completedCount} />
        <main className="textbook-missing shell-width">
          <span>404</span>
          <h1>没有找到这篇教材内容。</h1>
          <Link href="/textbook/data-structures">回到教材目录</Link>
        </main>
      </div>
    );
  }

  const chapter = dataset.chapters.find((item) => item.id === currentPage.chapterId);
  const chapterOverview = currentPage.chapterId ? dataset.pages.find((page) => page.slug === currentPage.chapterId) : null;
  const practiceHref = chapter ? `/textbook/data-structures/practice?chapter=${encodeURIComponent(chapter.id)}` : "/textbook/data-structures/practice";

  return (
    <div className="textbook-viewport">
      <AppHeader completedCount={completedCount} />
      <main className="textbook-main shell-width">
        <aside className="textbook-sidebar">
          <div className="textbook-sidebar-intro">
            <Link href="/" className="back-link">← 408 首页</Link>
            <p>TEXTBOOK / DATA STRUCTURES</p>
            <h1>数据结构<br />教材</h1>
            <span>严蔚敏 · C 语言版</span>
            <Link className="textbook-practice-link" href="/textbook/data-structures/practice">
              <span>刷本书习题</span><b>{dataset.stats.exerciseQuestions}</b>
            </Link>
          </div>

          <label className="textbook-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索章节、小节或术语" />
          </label>
          <button className="textbook-nav-toggle" type="button" onClick={() => setMobileMenuOpen((open) => !open)}>
            <span>教材目录 · {visiblePages.length} 篇</span><b>{mobileMenuOpen ? "收起" : "展开"}</b>
          </button>
          <nav className={`textbook-nav ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label="数据结构教材目录">
            <Link className={currentPage.slug === "" ? "active root" : "root"} href="/textbook/data-structures" onClick={() => setMobileMenuOpen(false)}>
              <span>全书目录</span><small>00</small>
            </Link>
            {knowledgeChapters.map((item, index) => {
              const pages = dataset.pages.filter((page) => page.slug === item.id || page.slug.startsWith(`${item.id}/`));
              const visible = !query.trim() || pages.some((page) => visibleIds.has(page.id));
              if (!visible) return null;
              return (
                <section className="textbook-nav-chapter" key={item.id}>
                  <Link className={currentPage.slug === item.id ? "chapter-link active" : "chapter-link"} href={item.route!} onClick={() => setMobileMenuOpen(false)}>
                    <small>{String(index + 1).padStart(2, "0")}</small><span>{item.title}</span>
                  </Link>
                  {pages.filter((page) => page.slug !== item.id && visibleIds.has(page.id)).map((page) => (
                    <Link
                      key={page.id}
                      className={`section-link depth-${Math.min(page.depth, 3)} ${page.id === currentPage.id ? "active" : ""}`}
                      href={page.route}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{page.title}</span>
                    </Link>
                  ))}
                </section>
              );
            })}
          </nav>
        </aside>

        <section className="textbook-reading-pane">
          <article className="textbook-article">
            <div className="textbook-breadcrumb">
              <Link href="/textbook/data-structures">数据结构（C语言版）</Link>
              {chapter ? <><span>/</span><Link href={chapter.route || "/textbook/data-structures"}>{chapter.title}</Link></> : null}
            </div>
            <header className="textbook-article-head">
              <div>
                <p>TEXTBOOK NOTE</p>
                <h2>{currentPage.title}</h2>
                <span>{sourceLabel(currentPage)}</span>
              </div>
              {chapter ? <Link className="textbook-inline-practice" href={practiceHref}>本章练习 <b>{chapter.questionCount}</b> →</Link> : null}
            </header>
            <div className="textbook-article-html" dangerouslySetInnerHTML={{ __html: currentPage.html }} />
            <nav className="textbook-page-pagination" aria-label="教材上下篇">
              {previousPage ? <Link href={previousPage.route}><span>上一篇</span><strong>← {previousPage.title}</strong></Link> : <span />}
              {nextPage ? <Link href={nextPage.route}><span>下一篇</span><strong>{nextPage.title} →</strong></Link> : <span />}
            </nav>
          </article>

          <aside className="textbook-context">
            <section>
              <span>READING CONTEXT</span>
              <strong>{chapter?.title || "全书导读"}</strong>
              <p>{chapter ? `${sourceLabel(chapterOverview || currentPage)} · ${chapter.questionCount} 条章节习题记录` : "按章节与小节保留原始 Markdown 结构。"}</p>
            </section>
            {chapter ? <Link href={practiceHref} className="textbook-context-practice">去做本章题目 <b>→</b></Link> : null}
            <section>
              <span>PAGE OUTLINE</span>
              <strong>本页小节</strong>
              <ol>{currentPage.headings.slice(0, 12).map((heading) => <li key={heading}>{heading}</li>)}</ol>
              {!currentPage.headings.length ? <p>本页为单节正文，无次级标题。</p> : null}
            </section>
            <section>
              <span>SOURCE TRACE</span>
              <strong>可追溯正文</strong>
              <p>{currentPage.sourceLatex.length} 个 LaTex 公式源保留在 Markdown；{currentPage.source.pageMarkers.length} 个页码来源标记已随页导入。</p>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
