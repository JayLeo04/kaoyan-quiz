import knowledgeData from "@/app/data/knowledge.json";
import Link from "@/app/components/SiteLink";
import { KnowledgeWorkspace, type LocalKnowledgeSubject } from "@/app/components/KnowledgeWorkspace";
import { subjectById, type SubjectId } from "@/app/data/catalog";

type KnowledgeDataset = { subjects: Record<SubjectId, LocalKnowledgeSubject> };

export function renderKnowledge(subjectValue: string, slug: string[]) {
  const subjectId = subjectValue as SubjectId;
  const subject = subjectById.get(subjectId);
  const data = (knowledgeData as KnowledgeDataset).subjects[subjectId];
  const currentSlug = slug.join("/");
  const currentPage = data?.pages.find((page) => page.slug === currentSlug);
  if (!subject || !data || !currentPage) {
    return <main className="missing-page"><span>404</span><h1>没有找到这篇本地知识点。</h1><Link href="/">返回 408 首页</Link></main>;
  }
  return <KnowledgeWorkspace subjectId={subjectId} data={data} currentSlug={currentSlug} />;
}
