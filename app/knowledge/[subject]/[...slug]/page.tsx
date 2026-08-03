import { renderKnowledge } from "@/app/knowledge/render-knowledge";
import { knowledgeArticleStaticParams } from "@/app/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return knowledgeArticleStaticParams();
}

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ subject: string; slug: string[] }> }) {
  const { subject, slug } = await params;
  return renderKnowledge(subject, slug);
}
