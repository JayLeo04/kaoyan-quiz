import { TextbookPracticeWorkspace } from "@/app/components/TextbookPracticeWorkspace";
import { createTextbookPracticeLibraryPayload, dataStructuresTextbook } from "@/app/data/textbook-registry";

export default async function DataStructuresPracticePage({ searchParams }: { searchParams: Promise<{ chapter?: string }> }) {
  const { chapter } = await searchParams;
  return <TextbookPracticeWorkspace library={createTextbookPracticeLibraryPayload(dataStructuresTextbook)} initialChapterId={chapter} />;
}
