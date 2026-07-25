"use client";

import { useParams } from "next/navigation";
import { StudyWorkspace } from "@/app/components/StudyWorkspace";

export default function SubjectPage() {
  const params = useParams<{ id: string }>();
  return <StudyWorkspace initialSubjectId={params.id} />;
}
