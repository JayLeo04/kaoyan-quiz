import { HomeWorkspace } from "@/app/components/HomeWorkspace";
import { subjectCatalog, type SubjectId } from "@/app/data/catalog";
import importedQuestions from "@/app/data/questions.json";

type QuestionIndexEntry = { id: string; subject: SubjectId };

const questionIdsBySubject = Object.fromEntries(
  subjectCatalog.map((subject) => [subject.id, [] as string[]]),
) as Record<SubjectId, string[]>;

for (const question of importedQuestions as QuestionIndexEntry[]) {
  questionIdsBySubject[question.subject].push(question.id);
}

export default function Home() {
  return <HomeWorkspace totalQuestions={importedQuestions.length} questionIdsBySubject={questionIdsBySubject} />;
}
