import { TextbookKnowledgeWorkspace } from "@/app/components/TextbookKnowledgeWorkspace";
import { createTextbookReaderPayload, dataStructuresTextbook } from "@/app/data/textbook-registry";
import { dataStructuresArticleStaticParams } from "@/app/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return dataStructuresArticleStaticParams();
}

export default async function DataStructuresTextbookArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <TextbookKnowledgeWorkspace reader={createTextbookReaderPayload(dataStructuresTextbook, slug.join("/"))} />;
}
