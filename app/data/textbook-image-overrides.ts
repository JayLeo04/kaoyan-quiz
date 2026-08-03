/**
 * Readable textbook-figure overlays approved in the asset audit.
 *
 * Keep the generated textbook JSON and every original SVG untouched: source imports
 * can then be repeated without losing either the archival figure or this display
 * improvement. Keys and values are public URLs because the reader receives HTML.
 * Audit evidence lives in `.codex/audits/textbook-assets/`.
 */
const dataStructuresImageOverrides = {
  "/textbooks/data-structures/02-linear-list/2-2-sequential-representation-and-implementation/assets/py/fig-2-2-sequential-layout.svg": "/textbooks/data-structures/02-linear-list/2-2-sequential-representation-and-implementation/assets/py/fig-2-2-sequential-layout-readable.svg",
  "/textbooks/data-structures/02-linear-list/2-3-1-linear-linked-list/assets/py/fig-2-7-headed-singly-list.svg": "/textbooks/data-structures/02-linear-list/2-3-1-linear-linked-list/assets/py/fig-2-7-headed-singly-list-readable.svg",
  "/textbooks/data-structures/02-linear-list/2-3-1-linear-linked-list/assets/py/fig-2-8-insert-pointer-change.svg": "/textbooks/data-structures/02-linear-list/2-3-1-linear-linked-list/assets/py/fig-2-8-insert-pointer-change-readable.svg",
  "/textbooks/data-structures/03-stack-and-queue/3-4-queue/assets/py/fig-3-9-deque.svg": "/textbooks/data-structures/03-stack-and-queue/3-4-queue/assets/py/fig-3-9-deque-readable.svg",
  "/textbooks/data-structures/03-stack-and-queue/3-5-discrete-event-simulation/assets/py/fig-3-15-event-simulation.svg": "/textbooks/data-structures/03-stack-and-queue/3-5-discrete-event-simulation/assets/py/fig-3-15-event-simulation-readable.svg",
  "/textbooks/data-structures/05-array-and-generalized-list/5-1-array-definition/assets/py/fig-5-1-two-dimensional-array.svg": "/textbooks/data-structures/05-array-and-generalized-list/5-1-array-definition/assets/py/fig-5-1-two-dimensional-array-readable.svg",
  "/textbooks/data-structures/05-array-and-generalized-list/5-2-array-sequential-representation/assets/py/fig-5-2-storage-orders.svg": "/textbooks/data-structures/05-array-and-generalized-list/5-2-array-sequential-representation/assets/py/fig-5-2-storage-orders-readable.svg",
  "/textbooks/data-structures/05-array-and-generalized-list/5-3-matrix-compressed-storage/assets/py/fig-5-3-symmetric-compression.svg": "/textbooks/data-structures/05-array-and-generalized-list/5-3-matrix-compressed-storage/assets/py/fig-5-3-symmetric-compression-readable.svg",
  "/textbooks/data-structures/05-array-and-generalized-list/5-3-matrix-compressed-storage/assets/py/fig-5-4-band-matrix.svg": "/textbooks/data-structures/05-array-and-generalized-list/5-3-matrix-compressed-storage/assets/py/fig-5-4-band-matrix-readable.svg",
  "/textbooks/data-structures/05-array-and-generalized-list/5-3-matrix-compressed-storage/assets/py/fig-5-5-sparse-matrix-and-transpose.svg": "/textbooks/data-structures/05-array-and-generalized-list/5-3-matrix-compressed-storage/assets/py/fig-5-5-sparse-matrix-and-transpose-readable.svg",
  "/textbooks/data-structures/06-tree-and-binary-tree/6-3-traversal-and-threaded-binary-tree/assets/py/fig-6-10-traversal-process.svg": "/textbooks/data-structures/06-tree-and-binary-tree/6-3-traversal-and-threaded-binary-tree/assets/py/fig-6-10-traversal-process-readable.svg",
  "/textbooks/data-structures/06-tree-and-binary-tree/6-6-huffman-tree-and-applications/assets/py/fig-6-22-weighted-trees.svg": "/textbooks/data-structures/06-tree-and-binary-tree/6-6-huffman-tree-and-applications/assets/py/fig-6-22-weighted-trees-readable.svg",
  "/textbooks/data-structures/08-dynamic-storage/8-2-available-space-table-and-allocation/assets/py/fig-8-5.svg": "/textbooks/data-structures/08-dynamic-storage/8-2-available-space-table-and-allocation/assets/py/fig-8-5-readable.svg",
  "/textbooks/data-structures/09-search/09-02-dynamic-search/assets/py/fig-9-09.svg": "/textbooks/data-structures/09-search/09-02-dynamic-search/assets/py/fig-9-09-readable.svg",
  "/textbooks/data-structures/09-search/09-02-dynamic-search/assets/py/fig-9-13.svg": "/textbooks/data-structures/09-search/09-02-dynamic-search/assets/py/fig-9-13-readable.svg",
  "/textbooks/data-structures/09-search/09-02-dynamic-search/assets/py/fig-9-19.svg": "/textbooks/data-structures/09-search/09-02-dynamic-search/assets/py/fig-9-19-readable.svg",
  "/textbooks/data-structures/10-internal-sorting/10-7-comparison/assets/py/fig-10-16-decision-tree.svg": "/textbooks/data-structures/10-internal-sorting/10-7-comparison/assets/py/fig-10-16-decision-tree-readable.svg",
  "/textbooks/data-structures/11-external-sorting/11-4-replacement-selection/assets/py/fig-11-6-loser-tree-states.svg": "/textbooks/data-structures/11-external-sorting/11-4-replacement-selection/assets/py/fig-11-6-loser-tree-states-readable.svg",
} as const;

export function applyDataStructuresImageOverrides(html: string) {
  return Object.entries(dataStructuresImageOverrides).reduce(
    (currentHtml, [originalUrl, readableUrl]) => currentHtml.replaceAll(originalUrl, readableUrl),
    html,
  );
}
