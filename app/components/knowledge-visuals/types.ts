export type KnowledgeVisualType =
  | "growth-curves"
  | "algorithm-trace"
  | "memory-scale"
  | "process-flow"
  | "state-machine"
  | "timeline"
  | "comparison"
  | "address-fields"
  | "banker-simulator"
  | "resource-allocation-graph"
  | "semaphore-lab"
  | "scheduler-queue"
  | "concurrency-lab";

export type KnowledgeVisualizationSpec = {
  id: string;
  route: string;
  type: KnowledgeVisualType;
  title: string;
  summary: string;
  sourceLatex: string[];
  formulaHtml: Record<string, string>;
  config: Record<string, unknown>;
};
