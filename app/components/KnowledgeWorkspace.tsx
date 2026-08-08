"use client";

import Link from "@/app/components/SiteLink";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/app/components/AppHeader";
import { KnowledgeVisual } from "@/app/components/knowledge-visuals/KnowledgeVisual";
import type { KnowledgeVisualizationSpec } from "@/app/components/knowledge-visuals/types";
import { MermaidCodeBlocks } from "@/app/components/MermaidCodeBlocks";
import { StudyAnnotationSurface, StudyResourceTools } from "@/app/components/StudyTools";
import { subjectById, type SubjectId } from "@/app/data/catalog";
import { withSiteAssetPaths } from "@/app/lib/site-path";
import type { LearningResource } from "@/app/lib/local-learning-library";

export type LocalKnowledgePage = {
  id: string;
  slug: string;
  route: string;
  sourcePath: string;
  title: string;
  summary: string;
  priority: "high" | "medium" | "low" | null;
  depth: number;
  parentSlug: string | null;
  headings: string[];
  tags: Array<{ name: string; questionCount: number }>;
  questionIds: string[];
  years: number[];
  sourceLatex: string[];
  visualizations: KnowledgeVisualizationSpec[];
  html: string;
};

export type LocalKnowledgeSubject = {
  sourceName: string;
  pageCount: number;
  mappedTagCount: number;
  pages: LocalKnowledgePage[];
};

export type LocalKnowledgeNavigationPage = Pick<
  LocalKnowledgePage,
  "id" | "slug" | "route" | "title" | "summary" | "depth" | "parentSlug" | "headings" | "tags"
>;

export type LocalKnowledgeNavigation = Omit<LocalKnowledgeSubject, "pages"> & {
  pages: LocalKnowledgeNavigationPage[];
};

const priorityLabel = { high: "高优先级", medium: "中优先级", low: "低优先级" } as const;
const knowledgeVisualMarker = /<!--\s*knowledge-visual:([a-z0-9]+(?:-[a-z0-9]+)*)\s*-->/g;

function KnowledgeArticle({ page, articleRef, resource }: { page: LocalKnowledgePage; articleRef: RefObject<HTMLElement | null>; resource: LearningResource }) {
  const specsById = new Map(page.visualizations.map((spec) => [spec.id, spec]));
  const pieces: Array<{ kind: "html"; html: string } | { kind: "visual"; spec: KnowledgeVisualizationSpec }> = [];
  let cursor = 0;
  for (const match of page.html.matchAll(knowledgeVisualMarker)) {
    if (match.index > cursor) pieces.push({ kind: "html", html: page.html.slice(cursor, match.index) });
    const spec = specsById.get(match[1]);
    if (spec) pieces.push({ kind: "visual", spec });
    cursor = match.index + match[0].length;
  }
  if (cursor < page.html.length) pieces.push({ kind: "html", html: page.html.slice(cursor) });

  return (
    <StudyAnnotationSurface resource={resource} contentKey={`${page.id}:${page.html.length}`} className="knowledge-annotation-surface">
      <article ref={articleRef} className="local-markdown" data-latex-source-count={page.sourceLatex.length}>
        {pieces.map((piece, index) => piece.kind === "visual"
          ? <KnowledgeVisual key={piece.spec.id} spec={piece.spec} />
          : <div key={`knowledge-html-${index}`} className="local-markdown-segment" data-study-annotatable="true" dangerouslySetInnerHTML={{ __html: withSiteAssetPaths(piece.html) }} />)}
        <MermaidCodeBlocks rootRef={articleRef} contentKey={`${page.id}:${page.html.length}`} />
      </article>
    </StudyAnnotationSurface>
  );
}

export function KnowledgeWorkspace({
  subjectId,
  data,
  currentPage,
  textbookPractice,
}: {
  subjectId: SubjectId;
  data: LocalKnowledgeNavigation;
  currentPage: LocalKnowledgePage;
  textbookPractice?: { href: string; count: number } | null;
}) {
  const [completedCount, setCompletedCount] = useState(0);
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const subject = subjectById.get(subjectId)!;
  const currentIndex = Math.max(0, data.pages.findIndex((page) => page.id === currentPage.id));
  const previousPage = currentIndex > 0 ? data.pages[currentIndex - 1] : null;
  const nextPage = currentIndex < data.pages.length - 1 ? data.pages[currentIndex + 1] : null;
  const practiceHref = currentPage.slug && currentPage.questionIds.length
    ? `/subject/${subjectId}?view=questions&knowledge=${encodeURIComponent(currentPage.slug)}`
    : null;
  const learningResource = useMemo<LearningResource>(() => ({
    id: `knowledge:${subjectId}:${currentPage.id}`,
    kind: "knowledge",
    title: currentPage.title,
    href: currentPage.route,
    context: `${subject.shortName}知识点`,
  }), [currentPage.id, currentPage.route, currentPage.title, subject.shortName, subjectId]);

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem("yanshua-408-progress-v1") || "null") as { completed?: unknown } | null;
      // Hydration must finish before reading browser-only local storage.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(stored?.completed)) setCompletedCount(stored.completed.length);
    } catch { /* A corrupt local record should not block reading the handbook. */ }
  }, []);

  useEffect(() => {
    const figures = articleRef.current?.querySelectorAll<HTMLElement>(".knowledge-figure") || [];
    const cleanups: Array<() => void> = [];
    for (const figure of figures) {
      const image = figure.querySelector<HTMLImageElement>("img");
      if (!image) continue;
      const updateState = () => figure.classList.toggle("is-broken", image.complete && image.naturalWidth === 0);
      image.addEventListener("load", updateState);
      image.addEventListener("error", updateState);
      updateState();
      cleanups.push(() => {
        image.removeEventListener("load", updateState);
        image.removeEventListener("error", updateState);
      });
    }
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [currentPage.id]);

  const filteredPages = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return data.pages;
    return data.pages.filter((page) => (
      `${page.title} ${page.summary} ${page.headings.join(" ")} ${page.tags.map((tag) => tag.name).join(" ")}`.toLowerCase().includes(normalized)
    ));
  }, [data.pages, query]);
  const rootPage = data.pages.find((page) => !page.slug);
  const topPages = filteredPages.filter((page) => page.depth === 1);
  const flatSearch = Boolean(query.trim());

  return (
    <div className="viewport-app knowledge-viewport">
      <AppHeader completedCount={completedCount} />
      <main className={`local-knowledge-main shell-width accent-${subject.accent}`}>
        <aside className="local-knowledge-sidebar">
          <div className="local-knowledge-intro">
            <Link href={`/subject/${subjectId}`} className="back-link">← {subject.name}</Link>
            <p className="page-label">SCHEDULE / 本地知识库</p>
            <h1>{subject.shortName}<br />知识点</h1>
            <p>{data.pageCount} 篇本地资料 · {data.mappedTagCount} 个真题标签已关联</p>
          </div>
          <label className="local-knowledge-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、章节或考点" /></label>
          <button className="local-knowledge-nav-toggle" type="button" onClick={() => setMobileNavOpen((open) => !open)}>知识目录 · {filteredPages.length} 篇 <b>{mobileNavOpen ? "收起" : "展开"}</b></button>
          <nav className={`local-knowledge-nav ${mobileNavOpen ? "mobile-open" : ""}`} aria-label={`${subject.shortName}本地知识目录`}>
            {flatSearch ? filteredPages.map((page) => (
              <Link key={page.id} className={page.id === currentPage.id ? "active search-result" : "search-result"} href={page.route}>
                <span>{page.title}</span><small>{page.headings.length} 节</small>
              </Link>
            )) : (
              <>
                {rootPage ? <Link className={rootPage.id === currentPage.id ? "active root-page" : "root-page"} href={rootPage.route}><span>科目导读</span><small>00</small></Link> : null}
                {topPages.map((page, index) => {
                  const children = data.pages.filter((child) => child.parentSlug === page.slug);
                  return (
                    <div className="local-knowledge-nav-group" key={page.id}>
                      <Link className={page.id === currentPage.id ? "active group-title" : "group-title"} href={page.route}><small>{String(index + 1).padStart(2, "0")}</small><span>{page.title}</span></Link>
                      {children.map((child) => <Link key={child.id} className={child.id === currentPage.id ? "active" : ""} href={child.route}><span>{child.title}</span><small>{child.tags.length ? `${child.tags.length} 考点` : "阅读"}</small></Link>)}
                    </div>
                  );
                })}
              </>
            )}
            {!filteredPages.length ? <p className="local-knowledge-no-result">没有匹配的本地资料</p> : null}
          </nav>
        </aside>

        <section className="local-knowledge-reader">
          <div className="local-knowledge-reader-head">
            <div><span>本地资料</span><strong>{currentPage.title}</strong></div>
            <div className="local-knowledge-stepper">
              {previousPage ? <Link href={previousPage.route} aria-label={`上一篇：${previousPage.title}`}>← 上一篇</Link> : <span />}
              <b>{currentIndex + 1} / {data.pageCount}</b>
              {nextPage ? <Link href={nextPage.route} aria-label={`下一篇：${nextPage.title}`}>下一篇 →</Link> : <span />}
            </div>
          </div>
          <div className="local-knowledge-scroll">
            <div className="local-knowledge-meta">
              <span>SCHEDULE LOCAL</span>
              {currentPage.priority ? <b className={`priority-${currentPage.priority}`}>{priorityLabel[currentPage.priority]}</b> : null}
              <small>{currentPage.headings.length} 个小节</small>
              {currentPage.years.length ? <small>覆盖真题 {currentPage.years[0]}—{currentPage.years.at(-1)}</small> : null}
            </div>
            {currentPage.tags.length || textbookPractice ? (
              <div className="local-knowledge-tags">
                <span>关联考点</span>
                {currentPage.tags.slice(0, 8).map((tag) => <b key={tag.name}>{tag.name}<small>{tag.questionCount}</small></b>)}
                {practiceHref ? <Link href={practiceHref}>做相关真题 · {currentPage.questionIds.length} 道 →</Link> : null}
                {textbookPractice ? <Link href={textbookPractice.href}>做教材习题 · {textbookPractice.count} 道 →</Link> : null}
              </div>
            ) : null}
            <StudyResourceTools resource={learningResource} practiceHref={practiceHref} practiceLabel={`做相关真题${currentPage.questionIds.length ? ` · ${currentPage.questionIds.length} 道` : ""}`} />
            <KnowledgeArticle page={currentPage} articleRef={articleRef} resource={learningResource} />
            <div className="local-knowledge-bottom-nav">
              {previousPage ? <Link href={previousPage.route}><span>上一篇</span><strong>{previousPage.title}</strong></Link> : <span />}
              {nextPage ? <Link href={nextPage.route}><span>下一篇</span><strong>{nextPage.title}</strong></Link> : <span />}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
