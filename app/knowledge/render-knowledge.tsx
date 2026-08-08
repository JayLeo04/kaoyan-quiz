import knowledgeData from "@/app/data/knowledge.json";
import textbookKnowledgeLinks from "@/app/data/textbook-knowledge-links.json";
import Link from "@/app/components/SiteLink";
import {
  KnowledgeWorkspace,
  type LocalKnowledgeNavigation,
  type LocalKnowledgeSubject,
} from "@/app/components/KnowledgeWorkspace";
import { subjectById, type SubjectId } from "@/app/data/catalog";

type KnowledgeDataset = { subjects: Record<SubjectId, LocalKnowledgeSubject> };
type TextbookKnowledgeLinks = { books: { "data-structures": { knowledge: Record<string, { title: string; questionIds: string[] }> } } };

export function renderKnowledge(subjectValue: string, slug: string[]) {
  const subjectId = subjectValue as SubjectId;
  const subject = subjectById.get(subjectId);
  const data = (knowledgeData as KnowledgeDataset).subjects[subjectId];
  const currentSlug = slug.join("/");
  const currentPage = data?.pages.find((page) => page.slug === currentSlug);
  if (!subject || !data || !currentPage) {
    return <main className="missing-page"><span>404</span><h1>没有找到这篇本地知识点。</h1><Link href="/">返回 408 首页</Link></main>;
  }
  const textbookLink = subjectId === "ds"
    ? (textbookKnowledgeLinks as TextbookKnowledgeLinks).books["data-structures"].knowledge[currentPage.id]
    : undefined;
  const textbookCount = textbookLink?.questionIds.length || 0;
  const textbookPractice = textbookCount ? {
    href: `/textbook/data-structures/practice?knowledge=${encodeURIComponent(currentPage.id)}`,
    count: textbookCount,
  } : null;
  const navigation: LocalKnowledgeNavigation = {
    sourceName: data.sourceName,
    pageCount: data.pageCount,
    mappedTagCount: data.mappedTagCount,
    pages: data.pages.map(({ id, slug: pageSlug, route, title, summary, depth, parentSlug, headings, tags }) => ({
      id,
      slug: pageSlug,
      route,
      title,
      summary,
      depth,
      parentSlug,
      headings,
      tags,
    })),
  };
  return <KnowledgeWorkspace subjectId={subjectId} data={navigation} currentPage={currentPage} textbookPractice={textbookPractice} />;
}
