"use client";

import Link from "@/app/components/SiteLink";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import { KnowledgeVisual } from "@/app/components/knowledge-visuals/KnowledgeVisual";
import { StudyAnnotationSurface, StudyResourceTools } from "@/app/components/StudyTools";
import { textbookHref, textbookPracticeHref } from "@/app/data/textbook-routes";
import type { TextbookPageSummary, TextbookReaderPayload, TextbookReadingContent } from "@/app/data/textbook-types";
import {
  readTextbookReaderPreferences,
  writeTextbookReaderPreferences,
  type TextbookReadingMode,
} from "@/app/lib/textbook-preferences";
import { readTextbookProgress } from "@/app/lib/textbook-progress";
import type { LearningResource } from "@/app/lib/local-learning-library";

const knowledgeVisualMarker = /<!--\s*knowledge-visual:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->/g;
const pageBreakMarker = /<!--\s*textbook-page-break\s*-->/g;
const sectionHeadingMarker = /<h[23]\b/gi;

function sourceLabel(page: TextbookReadingContent) {
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

function TextbookArticleContent({ page }: { page: TextbookReadingContent }) {
  const specsById = new Map((page.visualizations || []).map((spec) => [spec.id, spec]));
  const pieces: Array<{ kind: "html"; html: string } | { kind: "visual"; id: string }> = [];
  let cursor = 0;

  const pushHtml = (html: string) => {
    const pageOffsets = [...html.matchAll(pageBreakMarker)]
      .map((match) => match.index)
      .filter((index): index is number => index !== undefined);
    const fallbackHeadingOffsets = pageOffsets.length ? [] : [...html.matchAll(sectionHeadingMarker)]
      .map((match) => match.index)
      .filter((index): index is number => index !== undefined);
    const offsets = [...new Set([0, ...pageOffsets, ...fallbackHeadingOffsets, html.length])].sort((left, right) => left - right);
    for (let index = 0; index < offsets.length - 1; index += 1) {
      const chunk = html.slice(offsets[index], offsets[index + 1]).replace(pageBreakMarker, "");
      if (chunk.trim()) pieces.push({ kind: "html", html: chunk });
    }
  };

  for (const match of page.html.matchAll(knowledgeVisualMarker)) {
    if (match.index !== undefined && match.index > cursor) {
      pushHtml(page.html.slice(cursor, match.index));
    }
    if (specsById.has(match[1])) pieces.push({ kind: "visual", id: match[1] });
    cursor = (match.index || 0) + match[0].length;
  }
  if (cursor < page.html.length) pushHtml(page.html.slice(cursor));

  return (
    <>
      {pieces.map((piece, index) => {
        if (piece.kind === "html") {
          return <div key={`textbook-html-${index}`} className="textbook-article-html textbook-article-chunk" data-study-annotatable="true" dangerouslySetInnerHTML={{ __html: piece.html }} />;
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
  const [readingModePreference, setReadingModePreference] = useState<TextbookReadingMode>("original");
  const [preferenceError, setPreferenceError] = useState("");
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

  useEffect(() => {
    const preferences = readTextbookReaderPreferences(textbook.slug);
    // Browser-only preferences are loaded after hydration to keep server and client markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadingModePreference(preferences.readingMode);
  }, [textbook.slug]);

  function chooseReadingMode(readingMode: TextbookReadingMode) {
    setReadingModePreference(readingMode);
    const saved = writeTextbookReaderPreferences(textbook.slug, { readingMode });
    setPreferenceError(saved ? "" : "当前浏览器无法保存阅读版本；本次切换仍然有效。");
  }

  const visiblePages = useMemo(() => pages.filter((page) => matchesPage(page, query)), [pages, query]);
  const visibleIds = useMemo(() => new Set(visiblePages.map((page) => page.id)), [visiblePages]);
  const knowledgeChapters = dataset.chapters.filter((chapter) => dataset.pages.some((page) => page.slug === chapter.id));
  const condensedPage = currentPage?.condensed;
  const readingMode: TextbookReadingMode = readingModePreference === "condensed" && condensedPage ? "condensed" : "original";
  const chapter = currentPage ? dataset.chapters.find((item) => item.id === currentPage.chapterId) : undefined;
  const practiceHref = textbookPracticeHref(textbook.slug, chapter?.id);
  const learningResource = useMemo<LearningResource>(() => ({
    id: `textbook-page:${textbook.slug}:${currentPage?.id || "missing"}`,
    kind: "textbook-page",
    title: currentPage?.title || "教材内容",
    href: currentPage ? textbookHref(textbook.slug, currentPage.slug) : textbookHref(textbook.slug),
    context: textbook.presentation.displayName,
  }), [currentPage, textbook.presentation.displayName, textbook.slug]);
  const annotationResource = useMemo<LearningResource>(() => ({
    ...learningResource,
    id: `${learningResource.id}:${readingMode}`,
    title: `${learningResource.title}（${readingMode === "condensed" ? "精简版" : "教材原文"}）`,
  }), [learningResource, readingMode]);

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

  const displayPage: TextbookReadingContent = readingMode === "condensed" && condensedPage ? condensedPage : currentPage;

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
          <article className="textbook-article" data-reading-mode={readingMode}>
            <div className="textbook-breadcrumb">
              <Link href={textbookHref(textbook)}>{dataset.book.title}</Link>
              {chapter ? <><span>/</span><Link href={textbookHref(textbook, chapter.id)}>{chapter.title}</Link></> : null}
            </div>
            <header className="textbook-article-head">
              <div>
                <p>{readingMode === "condensed" ? "408 CONDENSED NOTE" : "TEXTBOOK NOTE"}</p>
                <h2>{displayPage.title}</h2>
                <span>
                  {readingMode === "condensed" && condensedPage
                    ? `精简版 · ${condensedPage.audit.sourceFiles} 个源文件覆盖 · ${sourceLabel(displayPage)}`
                    : sourceLabel(displayPage)}
                </span>
              </div>
              <div className="textbook-article-actions">
                {condensedPage ? (
                  <div className="textbook-version-control">
                    <fieldset className="textbook-version-switch">
                      <legend>阅读版本</legend>
                      <label>
                        <input
                          type="radio"
                          name={`textbook-version-${textbook.slug}`}
                          value="original"
                          checked={readingMode === "original"}
                          onChange={() => chooseReadingMode("original")}
                        />
                        <span>教材原文</span>
                        <small>完整叙述</small>
                      </label>
                      <label>
                        <input
                          type="radio"
                          name={`textbook-version-${textbook.slug}`}
                          value="condensed"
                          checked={readingMode === "condensed"}
                          onChange={() => chooseReadingMode("condensed")}
                        />
                        <span>精简版</span>
                        <small>408 复习</small>
                      </label>
                    </fieldset>
                    {preferenceError ? <span className="textbook-version-error" role="alert">{preferenceError}</span> : null}
                  </div>
                ) : null}
                {chapter ? <Link className="textbook-inline-practice" href={practiceHref}>本章练习 <b>{chapter.questionCount}</b> →</Link> : null}
              </div>
            </header>
            <StudyResourceTools resource={learningResource} practiceHref={chapter ? practiceHref : null} practiceLabel={chapter ? `做本章题目 · ${chapter.questionCount} 道` : "去做教材习题"} />
            <StudyAnnotationSurface resource={annotationResource} contentKey={`${currentPage.id}:${readingMode}:${displayPage.html.length}`} className="textbook-annotation-surface">
              <TextbookArticleContent page={displayPage} />
            </StudyAnnotationSurface>
            <nav className="textbook-page-pagination" aria-label="教材上下篇">
              {previousPage ? <Link href={textbookHref(textbook, previousPage.slug)}><span>上一篇</span><strong>← {previousPage.title}</strong></Link> : <span />}
              {nextPage ? <Link href={textbookHref(textbook, nextPage.slug)}><span>下一篇</span><strong>{nextPage.title} →</strong></Link> : <span />}
            </nav>
          </article>

          <aside className="textbook-context">
            <section>
              <span>READING CONTEXT</span>
              <strong>{chapter?.title || "全书导读"}</strong>
              <p>
                {chapter
                  ? `${readingMode === "condensed" ? "高密度复习版" : sourceLabel(displayPage)} · ${chapter.questionCount} 条章节习题记录`
                  : "按章节与小节保留原始 Markdown 结构。"}
              </p>
            </section>
            {chapter ? <Link href={practiceHref} className="textbook-context-practice">去做本章题目 <b>→</b></Link> : null}
            <section>
              <span>PAGE OUTLINE</span>
              <strong>本页小节</strong>
              <ol>{displayPage.headings.slice(0, 12).map((heading) => <li key={heading}>{heading}</li>)}</ol>
              {!displayPage.headings.length ? <p>本页为单节正文，无次级标题。</p> : null}
            </section>
            <section>
              <span>SOURCE TRACE</span>
              <strong>可追溯正文</strong>
              <p>
                {displayPage.sourceLatex.length} 个 LaTeX 公式源保留在 Markdown；{displayPage.source.pageMarkers.length} 个页码来源标记已随页导入。
                {readingMode === "condensed" && condensedPage ? ` 审计记录覆盖 ${condensedPage.audit.sourceFiles} 个源文件，遗留风险 ${condensedPage.audit.risks} 项。` : ""}
              </p>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
