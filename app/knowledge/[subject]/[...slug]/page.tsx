import { renderKnowledge } from "@/app/knowledge/render-knowledge";

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ subject: string; slug: string[] }> }) {
  const { subject, slug } = await params;
  return renderKnowledge(subject, slug);
}
