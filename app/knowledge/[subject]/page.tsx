import { renderKnowledge } from "@/app/knowledge/render-knowledge";
import { knowledgeSubjectStaticParams } from "@/app/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return knowledgeSubjectStaticParams();
}

export default async function KnowledgeRootPage({ params }: { params: Promise<{ subject: string }> }) {
  const { subject } = await params;
  return renderKnowledge(subject, []);
}
