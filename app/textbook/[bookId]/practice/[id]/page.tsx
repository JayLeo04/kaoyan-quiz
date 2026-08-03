import { TextbookQuestionWorkspace } from "@/app/components/TextbookPracticeWorkspace";
import { TextbookShelf } from "@/app/components/TextbookShelf";
import { createTextbookQuestionPayload, getTextbook } from "@/app/data/textbook-registry";
import { textbookQuestionStaticParams } from "@/app/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return textbookQuestionStaticParams();
}

export default async function TextbookPracticeQuestionPage({ params }: { params: Promise<{ bookId: string; id: string }> }) {
  const { bookId, id } = await params;
  const textbook = getTextbook(bookId);
  return textbook ? <TextbookQuestionWorkspace questionData={createTextbookQuestionPayload(textbook, id)} /> : <TextbookShelf unavailableBookSlug={bookId} />;
}
