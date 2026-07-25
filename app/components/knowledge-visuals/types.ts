export type KnowledgeVisualType =
  | "growth-curves"
  | "algorithm-trace"
  | "memory-scale"
  | "process-flow"
  | "state-machine"
  | "timeline"
  | "comparison"
  | "address-fields";

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

