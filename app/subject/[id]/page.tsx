import { StudyWorkspace } from "@/app/components/StudyWorkspace";
import { subjectStaticParams } from "@/app/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return subjectStaticParams();
}

export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string; knowledge?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const initialKnowledgeSlug = query.view === "questions" && query.knowledge ? query.knowledge : undefined;
  return <StudyWorkspace initialSubjectId={id} initialKnowledgeSlug={initialKnowledgeSlug} />;
}
