import { TextbookPracticeWorkspace } from "@/app/components/TextbookPracticeWorkspace";
import { createTextbookPracticeLibraryPayload, dataStructuresTextbook } from "@/app/data/textbook-registry";

export default async function DataStructuresPracticePage({ searchParams }: { searchParams: Promise<{ chapter?: string; knowledge?: string }> }) {
  const { chapter, knowledge } = await searchParams;
  return <TextbookPracticeWorkspace library={createTextbookPracticeLibraryPayload(dataStructuresTextbook, chapter, knowledge)} initialChapterId={chapter} />;
}
