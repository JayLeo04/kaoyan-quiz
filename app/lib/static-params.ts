import knowledgeData from "@/app/data/knowledge.json";
import importedQuestions from "@/app/data/questions.json";
import { subjectCatalog } from "@/app/data/catalog";
import { textbookCatalog } from "@/app/data/textbook-registry";

type StaticQuestion = { id: string };
type StaticKnowledgeDataset = {
  subjects: Record<string, { pages: Array<{ slug: string }> }>;
};

const questions = importedQuestions as StaticQuestion[];
const knowledge = knowledgeData as StaticKnowledgeDataset;

export function questionStaticParams() {
  return questions.map(({ id }) => ({ id }));
}

export function subjectStaticParams() {
  return subjectCatalog.map(({ id }) => ({ id }));
}

export function knowledgeSubjectStaticParams() {
  return Object.keys(knowledge.subjects).map((subject) => ({ subject }));
}

export function knowledgeArticleStaticParams() {
  return Object.entries(knowledge.subjects).flatMap(([subject, data]) => (
    data.pages
      .filter((page) => page.slug)
      .map((page) => ({ subject, slug: page.slug.split("/") }))
  ));
}

export function textbookStaticParams() {
  return textbookCatalog.map(({ slug: bookId }) => ({ bookId }));
}

export function textbookArticleStaticParams() {
  return textbookCatalog.flatMap(({ slug: bookId, dataset }) => (
    dataset.pages
      .filter((page) => page.slug)
      .map((page) => ({ bookId, slug: page.slug.split("/") }))
  ));
}

export function textbookQuestionStaticParams() {
  return textbookCatalog.flatMap(({ slug: bookId, dataset }) => (
    dataset.questions
      .filter((question) => question.isExercise)
      .map(({ id }) => ({ bookId, id }))
  ));
}

export function dataStructuresArticleStaticParams() {
  const textbook = textbookCatalog.find(({ slug }) => slug === "data-structures");
  return (textbook?.dataset.pages || [])
    .filter((page) => page.slug)
    .map((page) => ({ slug: page.slug.split("/") }));
}

export function dataStructuresQuestionStaticParams() {
  const textbook = textbookCatalog.find(({ slug }) => slug === "data-structures");
  return (textbook?.dataset.questions || [])
    .filter((question) => question.isExercise)
    .map(({ id }) => ({ id }));
}
