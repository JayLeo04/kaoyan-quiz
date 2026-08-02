import { TextbookKnowledgeWorkspace } from "@/app/components/TextbookKnowledgeWorkspace";

export default async function DataStructuresTextbookArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <TextbookKnowledgeWorkspace currentSlug={slug.join("/")} />;
}
