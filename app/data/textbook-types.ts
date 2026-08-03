export type TextbookPage = {
  id: string;
  slug: string;
  route: string;
  sourcePath: string;
  chapterId: string | null;
  title: string;
  summary: string;
  depth: number;
  parentSlug: string | null;
  headings: string[];
  sourceLatex: string[];
  source: {
    attributes: Record<string, string>;
    pageMarkers: Array<Record<string, string>>;
  };
  markdown: string;
  html: string;
};

export type TextbookChapter = {
  id: string;
  title: string;
  bookPages?: number[];
  pdfPages?: number[];
  route: string | null;
  questionCount: number;
  part?: string;
};

export type TextbookImage = {
  id: string;
  path: string;
  src: string;
  alt: string;
  role: string;
  inline: boolean;
  quality?: {
    generatedBy?: string;
    format?: string;
    width?: number;
    height?: number;
    verified?: boolean;
  };
};

export type TextbookQuestionOption = {
  label: string;
  markdown: string;
  html: string;
};

export type TextbookQuestion = {
  id: string;
  number: string;
  type: string;
  chapterId: string;
  section: {
    id: string;
    title: string;
    path: string[];
  };
  prompt: {
    markdown: string;
    html: string;
    plain: string;
  };
  options: TextbookQuestionOption[];
  answer: {
    status: "provided" | "hint-only" | "missing" | "pending-review";
    /** Status before a separately reviewed supplement was attached. */
    originalStatus?: "provided" | "hint-only" | "missing" | "pending-review";
    origin: string;
    original: string;
    html: string;
    /** Independently derived content; never replaces the transcribed book answer. */
    verified?: string;
    verifiedHtml?: string;
    explanation?: string;
  };
  knowledgePoints: Array<{
    id: string;
    title: string;
    relation: string;
    confidence: string;
  }>;
  images: TextbookImage[];
  source: {
    question?: { markdown?: string; anchor?: string; pdfPages?: number[]; bookPages?: number[] };
    answer?: { markdown?: string; anchor?: string; pdfPages?: number[]; bookPages?: number[] };
  };
  review: {
    status: string;
    flags: Array<{
      code: string;
      message: string;
      severity: string;
      status: string;
      pdfPages?: number[];
    }>;
    notes?: string;
  };
  isExercise: boolean;
};

export type TextbookDataset = {
  version: number;
  generatedAt: string;
  book: {
    id: string;
    title: string;
    author: string;
    sourcePdf: string;
  };
  stats: {
    knowledgePages: number;
    knowledgeImages: number;
    chapters: number;
    exerciseRecords: number;
    exerciseQuestions: number;
    exerciseImages: number;
    answersProvided: number;
    answersMissing: number;
    answersHintOnly: number;
    answersVerified: number;
    openReviewFlags: number;
  };
  chapters: TextbookChapter[];
  pages: TextbookPage[];
  questions: TextbookQuestion[];
  knowledgePoints: Array<{
    id: string;
    title: string;
    titles: string[];
    relations: string[];
    confidences: string[];
    questionIds: string[];
  }>;
};

export type TextbookPresentation = {
  eyebrow: string;
  displayName: string;
  edition: string;
  description: string;
};

export type TextbookChapterSummary = Pick<TextbookChapter, "id" | "title" | "questionCount">;

export type TextbookPageSummary = Pick<TextbookPage, "id" | "slug" | "chapterId" | "title" | "summary" | "depth" | "headings">;

export type TextbookPageContent = Pick<TextbookPage, "id" | "slug" | "chapterId" | "title" | "headings" | "sourceLatex" | "source" | "html">;

export type TextbookQuestionSummary = Pick<TextbookQuestion, "id" | "number" | "type" | "chapterId" | "section" | "knowledgePoints"> & {
  prompt: Pick<TextbookQuestion["prompt"], "plain">;
  answer: Pick<TextbookQuestion["answer"], "status" | "originalStatus" | "origin"> & { hasVerified: boolean };
};

export type TextbookQuestionContent = Pick<TextbookQuestion, "id" | "number" | "type" | "chapterId"> & {
  section: Pick<TextbookQuestion["section"], "id" | "title">;
  prompt: Pick<TextbookQuestion["prompt"], "html">;
  options: Array<Pick<TextbookQuestionOption, "label" | "html">>;
  answer: Pick<TextbookQuestion["answer"], "status" | "originalStatus" | "origin" | "html" | "verifiedHtml" | "explanation">;
  knowledgePoints: Array<Pick<TextbookQuestion["knowledgePoints"][number], "id" | "title">>;
  source: {
    question?: Pick<NonNullable<TextbookQuestion["source"]["question"]>, "pdfPages" | "bookPages">;
    answer?: Pick<NonNullable<TextbookQuestion["source"]["answer"]>, "pdfPages" | "bookPages">;
  };
  review: {
    flags: Array<Pick<TextbookQuestion["review"]["flags"][number], "code" | "message" | "status">>;
  };
};

export type TextbookReaderPayload = {
  bookSlug: string;
  currentSlug: string;
  presentation: TextbookPresentation;
  book: Pick<TextbookDataset["book"], "id" | "title" | "author">;
  stats: Pick<TextbookDataset["stats"], "exerciseQuestions">;
  chapters: TextbookChapterSummary[];
  pages: TextbookPageSummary[];
  currentPage: TextbookPageContent | null;
};

export type TextbookPracticeLibraryPayload = {
  bookSlug: string;
  presentation: TextbookPresentation;
  book: Pick<TextbookDataset["book"], "id" | "title" | "author">;
  stats: Pick<TextbookDataset["stats"], "exerciseQuestions" | "answersProvided" | "answersHintOnly" | "answersVerified">;
  chapters: TextbookChapterSummary[];
  exerciseQuestions: TextbookQuestionSummary[];
};

export type TextbookQuestionPayload = {
  bookSlug: string;
  presentation: TextbookPresentation;
  book: Pick<TextbookDataset["book"], "id" | "title" | "author">;
  chapters: TextbookChapterSummary[];
  exerciseQuestionIds: string[];
  chapterExerciseQuestionIds: Record<string, string[]>;
  question: TextbookQuestionContent | null;
};

// Kept as an alias while the first imported textbook is data structures.
// New textbook datasets should use TextbookDataset directly.
export type DataStructuresTextbookDataset = TextbookDataset;
