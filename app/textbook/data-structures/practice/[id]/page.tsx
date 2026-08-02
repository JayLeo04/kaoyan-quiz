import { TextbookQuestionWorkspace } from "@/app/components/TextbookPracticeWorkspace";
import { createTextbookQuestionPayload, dataStructuresTextbook } from "@/app/data/textbook-registry";

export default async function DataStructuresPracticeQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TextbookQuestionWorkspace questionData={createTextbookQuestionPayload(dataStructuresTextbook, id)} />;
}
