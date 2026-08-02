import { TextbookPracticeWorkspace } from "@/app/components/TextbookPracticeWorkspace";

export default async function DataStructuresPracticePage({ searchParams }: { searchParams: Promise<{ chapter?: string }> }) {
  const { chapter } = await searchParams;
  return <TextbookPracticeWorkspace initialChapterId={chapter} />;
}
