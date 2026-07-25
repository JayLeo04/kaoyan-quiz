import { StudyWorkspace } from "@/app/components/StudyWorkspace";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function SubjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string; knowledge?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const user = await getChatGPTUser();
  const initialKnowledgeSlug = query.view === "questions" && query.knowledge ? query.knowledge : undefined;
  const returnTo = initialKnowledgeSlug
    ? `/subject/${encodeURIComponent(id)}?view=questions&knowledge=${encodeURIComponent(initialKnowledgeSlug)}`
    : `/subject/${encodeURIComponent(id)}`;
  return <StudyWorkspace initialSubjectId={id} initialKnowledgeSlug={initialKnowledgeSlug} initialUser={user} signInPath={chatGPTSignInPath(returnTo)} signOutPath={chatGPTSignOutPath(returnTo)} />;
}
