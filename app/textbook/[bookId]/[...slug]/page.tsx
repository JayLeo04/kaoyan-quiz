import { TextbookKnowledgeWorkspace } from "@/app/components/TextbookKnowledgeWorkspace";
import { TextbookShelf } from "@/app/components/TextbookShelf";
import { createTextbookReaderPayload, getTextbook } from "@/app/data/textbook-registry";

export default async function TextbookArticlePage({ params }: { params: Promise<{ bookId: string; slug: string[] }> }) {
  const { bookId, slug } = await params;
  const textbook = getTextbook(bookId);
  return textbook ? <TextbookKnowledgeWorkspace reader={createTextbookReaderPayload(textbook, slug.join("/"))} /> : <TextbookShelf unavailableBookSlug={bookId} />;
}
