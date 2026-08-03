import { StudyWorkspace } from "@/app/components/StudyWorkspace";
import { questionStaticParams } from "@/app/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return questionStaticParams();
}

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StudyWorkspace initialQuestionId={id} />;
}
