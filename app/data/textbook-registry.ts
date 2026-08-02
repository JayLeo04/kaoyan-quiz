import dataStructuresTextbookData from "@/app/data/textbook-data-structures.json";
import type {
  TextbookChapterSummary,
  TextbookDataset,
  TextbookPageContent,
  TextbookPageSummary,
  TextbookPracticeLibraryPayload,
  TextbookPresentation,
  TextbookQuestionContent,
  TextbookQuestionPayload,
  TextbookQuestionSummary,
  TextbookReaderPayload,
} from "@/app/data/textbook-types";

export type TextbookRegistration = {
  /** Stable public route segment. It is intentionally separate from the source book ID. */
  slug: string;
  dataset: TextbookDataset;
  presentation: TextbookPresentation;
};

const dataStructuresTextbook: TextbookRegistration = {
  slug: "data-structures",
  dataset: dataStructuresTextbookData as TextbookDataset,
  presentation: {
    eyebrow: "TEXTBOOK / DATA STRUCTURES",
    displayName: "数据结构 教材",
    edition: "严蔚敏 · C 语言版",
    description: "保留教材正文、原书页码、题目图片与答案来源的学习版资料。",
  },
};

/**
 * The only place a textbook needs to be registered for the frontend.
 * A new book supplies its generated TextbookDataset, its own public asset namespace,
 * and one entry here; routes, reading, practice, and progress all follow this slug.
 */
export const textbookCatalog: readonly TextbookRegistration[] = [dataStructuresTextbook];

export function getTextbook(bookSlug: string | undefined) {
  return textbookCatalog.find((textbook) => textbook.slug === bookSlug) || null;
}

function cleanPathPart(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

type TextbookRouteTarget = string | Pick<TextbookRegistration, "slug">;

function routeBookSlug(target: TextbookRouteTarget) {
  return typeof target === "string" ? target : target.slug;
}

export function textbookHref(target: TextbookRouteTarget, pageSlug = "") {
  const bookSlug = routeBookSlug(target);
  const suffix = cleanPathPart(pageSlug);
  return suffix ? `/textbook/${bookSlug}/${suffix}` : `/textbook/${bookSlug}`;
}

export function textbookPracticeHref(target: TextbookRouteTarget, chapterId?: string) {
  const base = `${textbookHref(target)}/practice`;
  return chapterId ? `${base}?chapter=${encodeURIComponent(chapterId)}` : base;
}

export function textbookQuestionHref(target: TextbookRouteTarget, questionId: string) {
  return `${textbookPracticeHref(target)}/${encodeURIComponent(questionId)}`;
}

function chapterSummaries(textbook: TextbookRegistration): TextbookChapterSummary[] {
  return textbook.dataset.chapters.map(({ id, title, questionCount }) => ({ id, title, questionCount }));
}

function pageSummaries(textbook: TextbookRegistration): TextbookPageSummary[] {
  return textbook.dataset.pages.map(({ id, slug, chapterId, title, summary, depth, headings }) => ({
    id,
    slug,
    chapterId,
    title,
    summary,
    depth,
    headings: [...headings],
  }));
}

function pageContent(page: TextbookDataset["pages"][number]): TextbookPageContent {
  return {
    id: page.id,
    slug: page.slug,
    chapterId: page.chapterId,
    title: page.title,
    headings: [...page.headings],
    sourceLatex: [...page.sourceLatex],
    source: {
      attributes: { ...page.source.attributes },
      pageMarkers: page.source.pageMarkers.map((marker) => ({ ...marker })),
    },
    html: page.html,
  };
}

function questionSummary(question: TextbookDataset["questions"][number]): TextbookQuestionSummary {
  return {
    id: question.id,
    number: question.number,
    type: question.type,
    chapterId: question.chapterId,
    section: { ...question.section, path: [...question.section.path] },
    prompt: { plain: question.prompt.plain },
    answer: { status: question.answer.status },
    knowledgePoints: question.knowledgePoints.map((point) => ({ ...point })),
  };
}

function questionContent(question: TextbookDataset["questions"][number]): TextbookQuestionContent {
  const sourceQuestion = question.source.question;
  const sourceAnswer = question.source.answer;
  return {
    id: question.id,
    number: question.number,
    type: question.type,
    chapterId: question.chapterId,
    section: { id: question.section.id, title: question.section.title },
    prompt: { html: question.prompt.html },
    options: question.options.map((option) => ({ label: option.label, html: option.html })),
    answer: { status: question.answer.status, html: question.answer.html },
    knowledgePoints: question.knowledgePoints.map((point) => ({ id: point.id, title: point.title })),
    source: {
      question: sourceQuestion ? {
        pdfPages: sourceQuestion.pdfPages ? [...sourceQuestion.pdfPages] : undefined,
        bookPages: sourceQuestion.bookPages ? [...sourceQuestion.bookPages] : undefined,
      } : undefined,
      answer: sourceAnswer ? {
        pdfPages: sourceAnswer.pdfPages ? [...sourceAnswer.pdfPages] : undefined,
        bookPages: sourceAnswer.bookPages ? [...sourceAnswer.bookPages] : undefined,
      } : undefined,
    },
    review: {
      flags: question.review.flags.map((flag) => ({ code: flag.code, message: flag.message, status: flag.status })),
    },
  };
}

function payloadBase(textbook: TextbookRegistration) {
  return {
    bookSlug: textbook.slug,
    presentation: { ...textbook.presentation },
    book: {
      id: textbook.dataset.book.id,
      title: textbook.dataset.book.title,
      author: textbook.dataset.book.author,
    },
  };
}

/** Builds the small server-to-client payload needed by the interactive reader. */
export function createTextbookReaderPayload(textbook: TextbookRegistration, currentSlug: string): TextbookReaderPayload {
  const currentPage = textbook.dataset.pages.find((page) => page.slug === currentSlug);
  return {
    ...payloadBase(textbook),
    currentSlug,
    stats: { exerciseQuestions: textbook.dataset.stats.exerciseQuestions },
    chapters: chapterSummaries(textbook),
    pages: pageSummaries(textbook),
    currentPage: currentPage ? pageContent(currentPage) : null,
  };
}

/** Builds card/filter data only; full question HTML is intentionally excluded. */
export function createTextbookPracticeLibraryPayload(textbook: TextbookRegistration): TextbookPracticeLibraryPayload {
  return {
    ...payloadBase(textbook),
    stats: {
      exerciseQuestions: textbook.dataset.stats.exerciseQuestions,
      answersProvided: textbook.dataset.stats.answersProvided,
      answersHintOnly: textbook.dataset.stats.answersHintOnly,
    },
    chapters: chapterSummaries(textbook),
    exerciseQuestions: textbook.dataset.questions.filter((question) => question.isExercise).map(questionSummary),
  };
}

/** Builds one question view plus its lightweight exercise sequence for navigation. */
export function createTextbookQuestionPayload(textbook: TextbookRegistration, questionId: string): TextbookQuestionPayload {
  const exerciseQuestions = textbook.dataset.questions.filter((question) => question.isExercise);
  const chapterExerciseQuestionIds = Object.fromEntries(
    textbook.dataset.chapters.map((chapter) => [
      chapter.id,
      exerciseQuestions.filter((question) => question.chapterId === chapter.id).map((question) => question.id),
    ]),
  );
  return {
    ...payloadBase(textbook),
    chapters: chapterSummaries(textbook),
    exerciseQuestionIds: exerciseQuestions.map((question) => question.id),
    chapterExerciseQuestionIds,
    question: (() => {
      const question = exerciseQuestions.find((item) => item.id === questionId);
      return question ? questionContent(question) : null;
    })(),
  };
}

export { dataStructuresTextbook };
