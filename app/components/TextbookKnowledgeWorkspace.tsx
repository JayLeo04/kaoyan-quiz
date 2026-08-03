"use client";

import Link from "@/app/components/SiteLink";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import { KnowledgeVisual } from "@/app/components/knowledge-visuals/KnowledgeVisual";
import { textbookHref, textbookPracticeHref } from "@/app/data/textbook-registry";
import type { TextbookPageContent, TextbookPageSummary, TextbookReaderPayload } from "@/app/data/textbook-types";
import { readTextbookProgress } from "@/app/lib/textbook-progress";

const knowledgeVisualMarker = /<!--\s*knowledge-visual:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->/g;

function sourceLabel(page: TextbookPageContent) {
  const parts = [];
  if (page.source.attributes.book_pages) parts.push(`书内页 ${page.source.attributes.book_pages}`);
  if (page.source.attributes.pdf_pages) parts.push(`PDF ${page.source.attributes.pdf_pages}`);
  return parts.join(" · ") || "保留 OCR 来源标记";
}

function matchesPage(page: TextbookPageSummary, query: string) {
  const value = query.trim().toLocaleLowerCase();
  if (!value) return true;
  return `${page.title} ${page.summary} ${page.headings.join(" ")}`.toLocaleLowerCase().includes(value);
}

function TextbookArticleContent({ page }: { page: TextbookPageContent }) {
  const specsById = new Map((page.visualizations || []).map((spec) => [spec.id, spec]));
  const pieces: Array<{ kind: "html"; html: string } | { kind: "visual"; id: string }> = [];
  let cursor = 0;

  for (const match of page.html.matchAll(knowledgeVisualMarker)) {
    if (match.index !== undefined && match.index > cursor) {
      pieces.push({ kind: "html", html: page.html.slice(cursor, match.index) });
    }
    if (specsById.has(match[1])) pieces.push({ kind: "visual", id: match[1] });
    cursor = (match.index || 0) + match[0].length;
  }
  if (cursor < page.html.length) pieces.push({ kind: "html", html: page.html.slice(cursor) });

  return (
    <>
      {pieces.map((piece, index) => {
        if (piece.kind === "html") {
          return <div key={`textbook-html-${index}`} className="textbook-article-html" dangerouslySetInnerHTML={{ __html: piece.html }} />;
        }
        const spec = specsById.get(piece.id);
        return spec ? (
          <div key={spec.id} className="textbook-article-html local-markdown textbook-visual-host">
            <KnowledgeVisual spec={spec} />
          </div>
        ) : null;
      })}
    </>
  );
}

export function TextbookKnowledgeWorkspace({ reader }: { reader: TextbookReaderPayload }) {
  const textbook = { slug: reader.bookSlug, presentation: reader.presentation };
  const { currentSlug, pages } = reader;
  const dataset = {
    book: reader.book,
    stats: reader.stats,
    chapters: reader.chapters,
    pages,
  };
  const [query, setQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const currentIndex = dataset.pages.findIndex((page) => page.slug === currentSlug);
  const currentPage = reader.currentPage;
  const previousPage = currentIndex > 0 ? dataset.pages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < dataset.pages.length - 1 ? dataset.pages[currentIndex + 1] : null;

  useEffect(() => {
    const progress = readTextbookProgress(textbook.slug);
    // Browser-only progress belongs to this textbook, not the 408 real-question bank.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedCount(progress.mastered.length);
  }, [textbook.slug]);

  const visiblePages = useMemo(() => pages.filter((page) => matchesPage(page, query)), [pages, query]);
  const visibleIds = useMemo(() => new Set(visiblePages.map((page) => page.id)), [visiblePages]);
  const knowledgeChapters = dataset.chapters.filter((chapter) => dataset.pages.some((page) => page.slug === chapter.id));

  if (!currentPage) {
    return (
      <div className="textbook-viewport">
        <AppHeader completedCount={completedCount} />
        <main className="textbook-missing shell-width">
          <span>404</span>
          <h1>没有找到这篇教材内容。</h1>
          <Link href={textbookHref(textbook)}>回到教材目录</Link>
        </main>
      </div>
    );
  }

  const chapter = dataset.chapters.find((item) => item.id === currentPage.chapterId);
  const chapterOverview = currentPage;
  const practiceHref = textbookPracticeHref(textbook, chapter?.id);

  return (
    <div className="textbook-viewport">
      <AppHeader completedCount={completedCount} />
      <main className="textbook-main shell-width">
        <aside className="textbook-sidebar">
          <div className="textbook-sidebar-intro">
            <Link href="/" className="back-link">← 408 首页</Link>
            <p>{textbook.presentation.eyebrow}</p>
            <h1>{textbook.presentation.displayName}</h1>
            <span>{textbook.presentation.edition}</span>
            <Link className="textbook-practice-link" href={textbookPracticeHref(textbook)}>
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
          <nav className={`textbook-nav ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label={`${textbook.presentation.displayName}目录`}>
            <Link className={currentPage.slug === "" ? "active root" : "root"} href={textbookHref(textbook)} onClick={() => setMobileMenuOpen(false)}>
              <span>全书目录</span><small>00</small>
            </Link>
            {knowledgeChapters.map((item, index) => {
              const pages = dataset.pages.filter((page) => page.slug === item.id || page.slug.startsWith(`${item.id}/`));
              const visible = !query.trim() || pages.some((page) => visibleIds.has(page.id));
              if (!visible) return null;
              return (
                <section className="textbook-nav-chapter" key={item.id}>
                  <Link className={currentPage.slug === item.id ? "chapter-link active" : "chapter-link"} href={textbookHref(textbook, item.id)} onClick={() => setMobileMenuOpen(false)}>
                    <small>{String(index + 1).padStart(2, "0")}</small><span>{item.title}</span>
                  </Link>
                  {pages.filter((page) => page.slug !== item.id && visibleIds.has(page.id)).map((page) => (
                    <Link
                      key={page.id}
                      className={`section-link depth-${Math.min(page.depth, 3)} ${page.id === currentPage.id ? "active" : ""}`}
                      href={textbookHref(textbook, page.slug)}
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
              <Link href={textbookHref(textbook)}>{dataset.book.title}</Link>
              {chapter ? <><span>/</span><Link href={textbookHref(textbook, chapter.id)}>{chapter.title}</Link></> : null}
            </div>
            <header className="textbook-article-head">
              <div>
                <p>TEXTBOOK NOTE</p>
                <h2>{currentPage.title}</h2>
                <span>{sourceLabel(currentPage)}</span>
              </div>
              {chapter ? <Link className="textbook-inline-practice" href={practiceHref}>本章练习 <b>{chapter.questionCount}</b> →</Link> : null}
            </header>
            <TextbookArticleContent page={currentPage} />
            <nav className="textbook-page-pagination" aria-label="教材上下篇">
              {previousPage ? <Link href={textbookHref(textbook, previousPage.slug)}><span>上一篇</span><strong>← {previousPage.title}</strong></Link> : <span />}
              {nextPage ? <Link href={textbookHref(textbook, nextPage.slug)}><span>下一篇</span><strong>{nextPage.title} →</strong></Link> : <span />}
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
