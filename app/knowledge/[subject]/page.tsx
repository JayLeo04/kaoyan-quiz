import { renderKnowledge } from "@/app/knowledge/render-knowledge";

export default async function KnowledgeRootPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  return renderKnowledge(subject, []);
}
