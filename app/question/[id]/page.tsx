import { StudyWorkspace } from "@/app/components/StudyWorkspace";

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudyWorkspace initialQuestionId={id} />;
}
