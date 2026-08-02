import { TextbookQuestionWorkspace } from "@/app/components/TextbookPracticeWorkspace";
import { TextbookShelf } from "@/app/components/TextbookShelf";
import { createTextbookQuestionPayload, getTextbook } from "@/app/data/textbook-registry";

export default async function TextbookPracticeQuestionPage({ params }: { params: Promise<{ bookId: string; id: string }> }) {
  const { bookId, id } = await params;
  const textbook = getTextbook(bookId);
  return textbook ? <TextbookQuestionWorkspace questionData={createTextbookQuestionPayload(textbook, id)} /> : <TextbookShelf unavailableBookSlug={bookId} />;
}
