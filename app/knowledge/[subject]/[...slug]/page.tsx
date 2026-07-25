import { renderKnowledge } from "@/app/knowledge/render-knowledge";

export const dynamic = "force-dynamic";

export default async function KnowledgeArticlePage({ params }: { params: Promise<{ subject: string; slug: string[] }> }) {
  const { subject, slug } = await params;
  return renderKnowledge(subject, slug);
}
