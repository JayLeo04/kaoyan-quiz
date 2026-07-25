import { StudyWorkspace } from "@/app/components/StudyWorkspace";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getChatGPTUser();
  const returnTo = `/question/${encodeURIComponent(id)}`;
  return <StudyWorkspace initialQuestionId={id} initialUser={user} signInPath={chatGPTSignInPath(returnTo)} signOutPath={chatGPTSignOutPath(returnTo)} />;
}
