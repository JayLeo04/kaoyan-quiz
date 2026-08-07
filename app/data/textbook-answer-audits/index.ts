import type { TextbookAnswerAudit } from "@/app/data/textbook-answer-audit";
import foundations from "@/app/data/textbook-answer-audits/foundations.json";
import stackStringArray from "@/app/data/textbook-answer-audits/stack-string-array.json";
import trees from "@/app/data/textbook-answer-audits/trees.json";
import arrays from "@/app/data/textbook-answer-audits/arrays.json";
import graph from "@/app/data/textbook-answer-audits/graph.json";
import batch01LinearString from "@/app/data/textbook-answer-audits/batch-01-linear-string.json";
import batch02StringTrees from "@/app/data/textbook-answer-audits/batch-02-string-trees.json";
import batch03TreesGraph from "@/app/data/textbook-answer-audits/batch-03-trees-graph.json";
import batch04GraphStorageSearch from "@/app/data/textbook-answer-audits/batch-04-graph-storage-search.json";
import batch05SearchSorting from "@/app/data/textbook-answer-audits/batch-05-search-sorting.json";
import batch06SortingExternal from "@/app/data/textbook-answer-audits/batch-06-sorting-external.json";
import batch07ExternalFilePractice1 from "@/app/data/textbook-answer-audits/batch-07-external-file-practice1.json";
import batch08Practice1To3 from "@/app/data/textbook-answer-audits/batch-08-practice1-3.json";
import batch09Practice4To6 from "@/app/data/textbook-answer-audits/batch-09-practice4-6.json";
import fullCoverage01To05 from "@/app/data/textbook-answer-audits/full-coverage-01-05.json";
import fullCoverage06To08 from "@/app/data/textbook-answer-audits/full-coverage-06-08.json";
import fullCoverage09Practice from "@/app/data/textbook-answer-audits/full-coverage-09-practice.json";

// Each chapter batch owns its own JSON file. Keeping this registry as the only
// aggregation point prevents parallel content reviewers from editing one file.
export const dataStructuresAnswerAudits: readonly TextbookAnswerAudit[] = [
  foundations as unknown as TextbookAnswerAudit,
  stackStringArray as unknown as TextbookAnswerAudit,
  trees as unknown as TextbookAnswerAudit,
  arrays as unknown as TextbookAnswerAudit,
  graph as unknown as TextbookAnswerAudit,
  batch01LinearString as unknown as TextbookAnswerAudit,
  batch02StringTrees as unknown as TextbookAnswerAudit,
  batch03TreesGraph as unknown as TextbookAnswerAudit,
  batch04GraphStorageSearch as unknown as TextbookAnswerAudit,
  batch05SearchSorting as unknown as TextbookAnswerAudit,
  batch06SortingExternal as unknown as TextbookAnswerAudit,
  batch07ExternalFilePractice1 as unknown as TextbookAnswerAudit,
  batch08Practice1To3 as unknown as TextbookAnswerAudit,
  batch09Practice4To6 as unknown as TextbookAnswerAudit,
  fullCoverage01To05 as unknown as TextbookAnswerAudit,
  fullCoverage06To08 as unknown as TextbookAnswerAudit,
  fullCoverage09Practice as unknown as TextbookAnswerAudit,
];
