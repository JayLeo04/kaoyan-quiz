import type { TextbookAnswerAudit } from "@/app/data/textbook-answer-audit";
import foundations from "@/app/data/textbook-answer-audits/foundations.json";
import stackStringArray from "@/app/data/textbook-answer-audits/stack-string-array.json";
import trees from "@/app/data/textbook-answer-audits/trees.json";
import arrays from "@/app/data/textbook-answer-audits/arrays.json";
import graph from "@/app/data/textbook-answer-audits/graph.json";

// Each chapter batch owns its own JSON file. Keeping this registry as the only
// aggregation point prevents parallel content reviewers from editing one file.
export const dataStructuresAnswerAudits: readonly TextbookAnswerAudit[] = [
  foundations as unknown as TextbookAnswerAudit,
  stackStringArray as unknown as TextbookAnswerAudit,
  trees as unknown as TextbookAnswerAudit,
  arrays as unknown as TextbookAnswerAudit,
  graph as unknown as TextbookAnswerAudit,
];
