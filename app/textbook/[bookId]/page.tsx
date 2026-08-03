import { TextbookKnowledgeWorkspace } from "@/app/components/TextbookKnowledgeWorkspace";
import { TextbookShelf } from "@/app/components/TextbookShelf";
import { createTextbookReaderPayload, getTextbook } from "@/app/data/textbook-registry";
import { textbookStaticParams } from "@/app/lib/static-params";

export const dynamicParams = false;

export function generateStaticParams() {
  return textbookStaticParams();
}

export default async function TextbookRootPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const textbook = getTextbook(bookId);
  return textbook ? <TextbookKnowledgeWorkspace reader={createTextbookReaderPayload(textbook, "")} /> : <TextbookShelf unavailableBookSlug={bookId} />;
}
