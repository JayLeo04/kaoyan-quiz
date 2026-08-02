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
    origin: string;
    original: string;
    html: string;
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
  };
  isExercise: boolean;
};

export type DataStructuresTextbookDataset = {
  version: 1;
  generatedAt: string;
  book: {
    id: "data-structures-yan-weimin";
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
