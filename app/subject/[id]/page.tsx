import { StudyWorkspace } from "@/app/components/StudyWorkspace";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function SubjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getChatGPTUser();
  const returnTo = `/subject/${encodeURIComponent(id)}`;
  return <StudyWorkspace initialSubjectId={id} initialUser={user} signInPath={chatGPTSignInPath(returnTo)} signOutPath={chatGPTSignOutPath(returnTo)} />;
}
