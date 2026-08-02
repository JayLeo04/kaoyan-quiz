import { TextbookPracticeWorkspace } from "@/app/components/TextbookPracticeWorkspace";
import { TextbookShelf } from "@/app/components/TextbookShelf";
import { createTextbookPracticeLibraryPayload, getTextbook } from "@/app/data/textbook-registry";

export default async function TextbookPracticePage({ params, searchParams }: { params: Promise<{ bookId: string }>; searchParams: Promise<{ chapter?: string }> }) {
  const [{ bookId }, { chapter }] = await Promise.all([params, searchParams]);
  const textbook = getTextbook(bookId);
  return textbook ? <TextbookPracticeWorkspace library={createTextbookPracticeLibraryPayload(textbook)} initialChapterId={chapter} /> : <TextbookShelf unavailableBookSlug={bookId} />;
}
