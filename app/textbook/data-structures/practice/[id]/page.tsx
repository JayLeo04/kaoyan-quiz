import { TextbookQuestionWorkspace } from "@/app/components/TextbookPracticeWorkspace";

export default async function DataStructuresPracticeQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TextbookQuestionWorkspace questionId={id} />;
}
