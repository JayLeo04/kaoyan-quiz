"use client";

import { useParams } from "next/navigation";
import { StudyWorkspace } from "@/app/components/StudyWorkspace";

export default function QuestionPage() {
  const params = useParams<{ id: string }>();
  return <StudyWorkspace initialQuestionId={params.id} />;
}
