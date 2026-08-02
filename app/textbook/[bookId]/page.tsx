import { TextbookKnowledgeWorkspace } from "@/app/components/TextbookKnowledgeWorkspace";
import { TextbookShelf } from "@/app/components/TextbookShelf";
import { createTextbookReaderPayload, getTextbook } from "@/app/data/textbook-registry";

export default async function TextbookRootPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const textbook = getTextbook(bookId);
  return textbook ? <TextbookKnowledgeWorkspace reader={createTextbookReaderPayload(textbook, "")} /> : <TextbookShelf unavailableBookSlug={bookId} />;
}
