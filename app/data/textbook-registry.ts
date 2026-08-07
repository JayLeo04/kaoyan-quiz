import dataStructuresTextbookData from "@/app/data/textbook-data-structures.json";
import { applyTextbookAnswerAudits } from "@/app/data/textbook-answer-audit";
import { dataStructuresAnswerAudits } from "@/app/data/textbook-answer-audits";
import type {
  TextbookChapterSummary,
  TextbookDataset,
  TextbookPageContent,
  TextbookPageSummary,
  TextbookPracticeLibraryPayload,
  TextbookPracticeQuery,
  TextbookPracticeResults,
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
  dataset: applyTextbookAnswerAudits(dataStructuresTextbookData as unknown as TextbookDataset, dataStructuresAnswerAudits),
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
    visualizations: (page.visualizations || []).map((visualization) => ({
      ...visualization,
      sourceLatex: [...(visualization.sourceLatex || [])],
      formulaHtml: { ...(visualization.formulaHtml || {}) },
      config: { ...(visualization.config || {}) },
    })),
    html: page.html,
    condensed: page.condensed ? {
      title: page.condensed.title,
      headings: [...page.condensed.headings],
      sourceLatex: [...page.condensed.sourceLatex],
      source: {
        attributes: { ...page.condensed.source.attributes },
        pageMarkers: page.condensed.source.pageMarkers.map((marker) => ({ ...marker })),
      },
      visualizations: (page.condensed.visualizations || []).map((visualization) => ({
        ...visualization,
        sourceLatex: [...(visualization.sourceLatex || [])],
        formulaHtml: { ...(visualization.formulaHtml || {}) },
        config: { ...(visualization.config || {}) },
      })),
      html: page.condensed.html,
      audit: { ...page.condensed.audit },
    } : undefined,
  };
}

function questionSummary(question: TextbookDataset["questions"][number]): TextbookQuestionSummary {
  return {
    id: question.id,
    number: question.number,
    type: question.type,
    chapterId: question.chapterId,
    section: { id: question.section.id, title: question.section.title },
    prompt: { markdown: question.prompt.markdown, plain: question.prompt.plain },
    answer: {
      status: question.answer.status,
      origin: question.answer.origin,
      hasVerified: Boolean(question.answer.verified?.trim()),
    },
    knowledgePoints: question.knowledgePoints.map((point) => ({ id: point.id, title: point.title })),
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
    answer: {
      status: question.answer.status,
      originalStatus: question.answer.originalStatus,
      origin: question.answer.origin,
      html: question.answer.html,
      verifiedHtml: question.answer.verifiedHtml,
      explanation: question.answer.explanation,
    },
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

const textbookPracticePageSize = 12;

export function createTextbookPracticeResults(textbook: TextbookRegistration, query: TextbookPracticeQuery = {}): TextbookPracticeResults {
  const normalized = String(query.query || "").trim().toLocaleLowerCase();
  const masteredIds = new Set(query.masteredIds || []);
  const reviewIds = new Set(query.reviewIds || []);
  const questions = textbook.dataset.questions.filter((question) => {
    if (!question.isExercise) return false;
    const chapterMatch = !query.chapterId || query.chapterId === "all" || question.chapterId === query.chapterId;
    const typeMatch = !query.type || query.type === "all" || question.type === query.type;
    const hasVerified = Boolean(question.answer.verified?.trim());
    const answerMatch = !query.answer || query.answer === "all"
      || (query.answer === "verified" ? hasVerified : question.answer.status === query.answer);
    const learningMatch = !query.learning || query.learning === "all"
      || (query.learning === "mastered" && masteredIds.has(question.id))
      || (query.learning === "review" && reviewIds.has(question.id))
      || (query.learning === "unmarked" && !masteredIds.has(question.id) && !reviewIds.has(question.id));
    const queryMatch = !normalized || `${question.number} ${question.prompt.plain} ${question.section.title} ${question.knowledgePoints.map((point) => point.title).join(" ")}`.toLocaleLowerCase().includes(normalized);
    return chapterMatch && typeMatch && answerMatch && learningMatch && queryMatch;
  });
  const pageCount = Math.max(1, Math.ceil(questions.length / textbookPracticePageSize));
  const requestedPage = Number.isFinite(query.page) ? Math.trunc(query.page || 1) : 1;
  const page = Math.min(pageCount, Math.max(1, requestedPage));
  return {
    questions: questions.slice((page - 1) * textbookPracticePageSize, page * textbookPracticePageSize).map(questionSummary),
    total: questions.length,
    page,
    pageSize: textbookPracticePageSize,
  };
}

/** Builds only the first visible result page; later filters and pages are requested on demand. */
export function createTextbookPracticeLibraryPayload(textbook: TextbookRegistration, initialChapterId?: string): TextbookPracticeLibraryPayload {
  const exerciseQuestions = textbook.dataset.questions.filter((question) => question.isExercise);
  const chapterId = textbook.dataset.chapters.some((chapter) => chapter.id === initialChapterId) ? initialChapterId : "all";
  return {
    ...payloadBase(textbook),
    stats: {
      exerciseQuestions: textbook.dataset.stats.exerciseQuestions,
      answersProvided: textbook.dataset.stats.answersProvided,
      answersHintOnly: textbook.dataset.stats.answersHintOnly,
      answersVerified: textbook.dataset.stats.answersVerified,
    },
    chapters: chapterSummaries(textbook),
    questionTypes: [...new Set(exerciseQuestions.map((question) => question.type))],
    exerciseQuestionIds: exerciseQuestions.map((question) => question.id),
    initialResults: createTextbookPracticeResults(textbook, { chapterId }),
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
