import { TextbookKnowledgeWorkspace } from "@/app/components/TextbookKnowledgeWorkspace";
import { createTextbookReaderPayload, dataStructuresTextbook } from "@/app/data/textbook-registry";

export default function DataStructuresTextbookRootPage() {
  return <TextbookKnowledgeWorkspace reader={createTextbookReaderPayload(dataStructuresTextbook, "")} />;
}
