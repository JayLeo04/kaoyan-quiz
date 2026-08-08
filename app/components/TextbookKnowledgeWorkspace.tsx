"use client";

import Link from "@/app/components/SiteLink";
import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import { KnowledgeVisual } from "@/app/components/knowledge-visuals/KnowledgeVisual";
import { StudyAnnotationSurface, StudyResourceTools } from "@/app/components/StudyTools";
import { textbookCondensedHref, textbookHref, textbookPracticeHref } from "@/app/data/textbook-routes";
import type { TextbookChapterSummary, TextbookPageSummary, TextbookReaderPayload, TextbookReadingContent } from "@/app/data/textbook-types";
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
  const attributes = page.source.attributes;
  const firstAttribute = (...keys: string[]) => keys.map((key) => attributes[key]).find(Boolean);
  const parts = [];
  const bookPages = firstAttribute("book_pages", "book_page");
  const pdfPages = firstAttribute("pdf_pages", "source_pdf_pages", "original_pdf_pages", "physical_pdf_pages", "source_pdf_page", "original_pdf_page", "physical_pdf_page");
  if (bookPages) parts.push(`书内页 ${bookPages}`);
  if (pdfPages) parts.push(`PDF ${pdfPages}`);
  return parts.join(" · ") || "保留 OCR 来源标记";
}

function matchesPage(page: TextbookPageSummary, query: string) {
  const value = query.trim().toLocaleLowerCase();
  if (!value) return true;
  return `${page.title} ${page.summary} ${page.headings.join(" ")}`.toLocaleLowerCase().includes(value);
}

type NavigationChapter = TextbookChapterSummary & {
  pages: TextbookPageSummary[];
};

type TextbookNavigation = {
  prelude: NavigationChapter[];
  chapters: NavigationChapter[];
  appendices: NavigationChapter[];
  references: NavigationChapter[];
};

function compareSourceOrder(left: Pick<TextbookChapterSummary, "id" | "order">, right: Pick<TextbookChapterSummary, "id" | "order">) {
  const orderDifference = (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER);
  return orderDifference || left.id.localeCompare(right.id);
}

function navigationTitleParts(title: string) {
  const match = title.match(/^(第\s*\d+\s*(?:篇|章)|附录\s*\d+\s*[A-Za-z]?)(?:\s+|　*)(.*)$/);
  if (!match) return { label: "", title };
  return { label: match[1].replace(/\s+/g, ""), title: match[2] || title };
}

function buildTextbookNavigation(chapters: TextbookChapterSummary[], pages: TextbookPageSummary[]): TextbookNavigation {
  const chapterEntries = [...chapters]
    .filter((chapter) => pages.some((page) => page.slug === chapter.id))
    .sort(compareSourceOrder)
    .map((chapter) => ({
      ...chapter,
      pages: pages.filter((page) => page.slug === chapter.id || page.slug.startsWith(`${chapter.id}/`)),
    }));
  const prelude: NavigationChapter[] = [];
  const orderedChapters: NavigationChapter[] = [];
  const appendices: NavigationChapter[] = [];
  const references: NavigationChapter[] = [];

  for (const entry of chapterEntries) {
    if (entry.kind === "front_matter") prelude.push(entry);
    else if (entry.kind === "appendix") appendices.push(entry);
    else if (entry.kind === "references") references.push(entry);
    else orderedChapters.push(entry);
  }

  return {
    prelude,
    chapters: orderedChapters,
    appendices,
    references,
  };
}

function navigationEntryMatches(entry: NavigationChapter, visibleIds: Set<string>) {
  return entry.pages.some((page) => visibleIds.has(page.id));
}

function TextbookNavigationEntry({
  entry,
  textbookSlug,
  currentSlug,
  visibleIds,
  onNavigate,
}: {
  entry: NavigationChapter;
  textbookSlug: string;
  currentSlug: string;
  visibleIds: Set<string>;
  onNavigate: () => void;
}) {
  const title = navigationTitleParts(entry.title);
  const isCurrent = entry.id === currentSlug;
  const visibleSections = entry.pages.filter((page) => page.slug !== entry.id && visibleIds.has(page.id));

  return (
    <div className={`textbook-nav-entry${entry.kind === "appendix" ? " appendix" : ""} kind-${entry.kind || "page"}`}>
      <Link
        className={isCurrent ? "textbook-nav-entry-link active" : "textbook-nav-entry-link"}
        href={textbookHref(textbookSlug, entry.id)}
        onClick={onNavigate}
        aria-current={isCurrent ? "page" : undefined}
      >
        {title.label ? <small>{title.label}</small> : null}
        <span>{title.title}</span>
      </Link>
      {visibleSections.map((page) => (
        <Link
          key={page.id}
          className={`section-link depth-${Math.min(page.depth, 3)} ${page.slug === currentSlug ? "active" : ""}`}
          href={textbookHref(textbookSlug, page.slug)}
          onClick={onNavigate}
        >
          <span>{page.title}</span>
        </Link>
      ))}
    </div>
  );
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
  const hasPractice = dataset.stats.exerciseQuestions > 0;
  const previousPage = currentIndex > 0 ? dataset.pages[currentIndex - 1] : null;
  const nextPage = currentIndex >= 0 && currentIndex < dataset.pages.length - 1 ? dataset.pages[currentIndex + 1] : null;

  useEffect(() => {
    const progress = readTextbookProgress(textbook.slug);
    // Browser-only progress belongs to this textbook, not the 408 real-question bank.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCompletedCount(progress.mastered.length);
  }, [reader.currentSlug, textbook.slug]);

  useEffect(() => {
    const preferences = readTextbookReaderPreferences(textbook.slug);
    const requestedMode = new URLSearchParams(window.location.search).get("mode");
    const readingMode = requestedMode === "condensed" ? "condensed" : preferences.readingMode;
    // Browser-only preferences are loaded after hydration to keep server and client markup stable.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReadingModePreference(readingMode);
    if (readingMode !== preferences.readingMode) {
      writeTextbookReaderPreferences(textbook.slug, { readingMode });
    }
  }, [textbook.slug]);

  function chooseReadingMode(readingMode: TextbookReadingMode) {
    setReadingModePreference(readingMode);
    const saved = writeTextbookReaderPreferences(textbook.slug, { readingMode });
    setPreferenceError(saved ? "" : "当前浏览器无法保存阅读版本；本次切换仍然有效。");
  }

  const visiblePages = useMemo(() => pages.filter((page) => matchesPage(page, query)), [pages, query]);
  const visibleIds = useMemo(() => new Set(visiblePages.map((page) => page.id)), [visiblePages]);
  const navigation = buildTextbookNavigation(dataset.chapters, pages);
  const visibleNavigationCount = visiblePages.filter((page) => page.slug).length;
  const condensedPage = currentPage?.condensed;
  const firstCondensedPage = pages.find((page) => page.hasCondensed);
  const readingMode: TextbookReadingMode = readingModePreference === "condensed" && condensedPage ? "condensed" : "original";
  const chapter = currentPage ? dataset.chapters.find((item) => item.id === currentPage.chapterId) : undefined;
  const practiceHref = hasPractice ? textbookPracticeHref(textbook.slug, chapter?.id) : null;
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
            {hasPractice ? <Link className="textbook-practice-link" href={textbookPracticeHref(textbook)}>
              <span>刷本书习题</span><b>{dataset.stats.exerciseQuestions}</b>
            </Link> : null}
          </div>

          <label className="textbook-search">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索章节、小节或术语" />
          </label>
          <button className="textbook-nav-toggle" type="button" onClick={() => setMobileMenuOpen((open) => !open)}>
            <span>教材目录 · {visibleNavigationCount} 项</span><b>{mobileMenuOpen ? "收起" : "展开"}</b>
          </button>
          <nav className={`textbook-nav ${mobileMenuOpen ? "mobile-open" : ""}`} aria-label={`${textbook.presentation.displayName}目录`}>
            <Link className={currentPage.slug === "" ? "active root" : "root"} href={textbookHref(textbook)} onClick={() => setMobileMenuOpen(false)}>
              <span>全书目录</span><small>00</small>
            </Link>
            {navigation.prelude.filter((entry) => navigationEntryMatches(entry, visibleIds)).length ? (
              <section className="textbook-nav-group textbook-nav-standalone" aria-label="书前内容">
                <span className="textbook-nav-group-label">书前内容</span>
                {navigation.prelude.filter((entry) => navigationEntryMatches(entry, visibleIds)).map((entry) => (
                  <TextbookNavigationEntry
                    key={entry.id}
                    entry={entry}
                    textbookSlug={textbook.slug}
                    currentSlug={currentPage.slug}
                    visibleIds={visibleIds}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                ))}
              </section>
            ) : null}
            {navigation.chapters.filter((entry) => navigationEntryMatches(entry, visibleIds)).map((entry) => {
              const title = navigationTitleParts(entry.title);
              const sectionCount = entry.pages.filter((page) => page.slug !== entry.id && !page.slug.endsWith("/99-exercises")).length;
              const visibleSections = entry.pages.filter((page) => page.slug !== entry.id && visibleIds.has(page.id));
              const chapterIsCurrent = currentPage.chapterId === entry.id;
              return (
                <section className="textbook-nav-chapter-group" key={entry.id}>
                  <Link
                    className={`textbook-nav-chapter-heading${currentPage.slug === entry.id ? " active" : chapterIsCurrent ? " current" : ""}`}
                    href={textbookHref(textbook.slug, entry.id)}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={currentPage.slug === entry.id ? "page" : undefined}
                  >
                    {title.label ? <small>{title.label}</small> : null}
                    <span>{title.title}</span>
                    {sectionCount ? <b>{sectionCount} 节</b> : null}
                  </Link>
                  <div className="textbook-nav-chapter-contents">
                    {visibleSections.map((page) => (
                      <Link
                        key={page.id}
                        className={`section-link depth-${Math.min(page.depth, 3)} ${page.slug === currentPage.slug ? "active" : ""}`}
                        href={textbookHref(textbook.slug, page.slug)}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-current={page.slug === currentPage.slug ? "page" : undefined}
                      >
                        <span>{page.title}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
            {navigation.appendices.filter((entry) => navigationEntryMatches(entry, visibleIds)).length ? (
              <section className="textbook-nav-group textbook-nav-appendix-group" aria-label="附录">
                <span className="textbook-nav-group-label">附录 · {navigation.appendices.length} 项</span>
                <div className="textbook-nav-appendix-contents">
                  {navigation.appendices.filter((entry) => navigationEntryMatches(entry, visibleIds)).map((entry) => (
                    <TextbookNavigationEntry
                      key={entry.id}
                      entry={entry}
                      textbookSlug={textbook.slug}
                      currentSlug={currentPage.slug}
                      visibleIds={visibleIds}
                      onNavigate={() => setMobileMenuOpen(false)}
                    />
                  ))}
                </div>
              </section>
            ) : null}
            {navigation.references.filter((entry) => navigationEntryMatches(entry, visibleIds)).length ? (
              <section className="textbook-nav-group textbook-nav-standalone" aria-label="参考资料">
                <span className="textbook-nav-group-label">参考资料</span>
                {navigation.references.filter((entry) => navigationEntryMatches(entry, visibleIds)).map((entry) => (
                  <TextbookNavigationEntry
                    key={entry.id}
                    entry={entry}
                    textbookSlug={textbook.slug}
                    currentSlug={currentPage.slug}
                    visibleIds={visibleIds}
                    onNavigate={() => setMobileMenuOpen(false)}
                  />
                ))}
              </section>
            ) : null}
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
                {!condensedPage && firstCondensedPage && dataset.stats.condensedPages ? (
                  <Link className="textbook-inline-practice" href={textbookCondensedHref(textbook.slug, firstCondensedPage.slug)}>
                    进入精简版 <b>{dataset.stats.condensedPages} 章</b>
                  </Link>
                ) : null}
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
                {hasPractice && chapter && practiceHref ? <Link className="textbook-inline-practice" href={practiceHref}>本章练习 <b>{chapter.questionCount}</b> →</Link> : null}
              </div>
            </header>
            <StudyResourceTools resource={learningResource} practiceHref={chapter ? practiceHref : null} practiceLabel={hasPractice ? (chapter ? `做本章题目 · ${chapter.questionCount} 道` : "去做教材习题") : undefined} />
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
            {hasPractice && chapter && practiceHref ? <Link href={practiceHref} className="textbook-context-practice">去做本章题目 <b>→</b></Link> : null}
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
