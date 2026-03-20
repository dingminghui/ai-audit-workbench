import type { AuditItem, MaterialViewModel, ResultCounts, TaskStatus } from "@/pages/home/types";

export function filterMaterials(items: MaterialViewModel[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return items;

  return items.filter((material) =>
    [
      material.name,
      material.serial,
      material.id,
      ...material.auditItems.map((item) => item.checkpoint),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery),
  );
}

export function filterAuditItems(items: AuditItem[], filter: "all" | "fail" | "manual") {
  return items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "fail") return item.result === "不通过";
    return item.result === "需人工介入";
  });
}

export function resolveSelectedAuditRow(
  allItems: AuditItem[],
  filteredItems: AuditItem[],
  currentRow: number,
) {
  if (filteredItems.some((item) => item.row === currentRow)) {
    return currentRow;
  }

  if (filteredItems.length > 0) {
    return filteredItems[0].row;
  }

  return pickDefaultAuditRow(allItems);
}

export function pickDefaultAuditRow(items: AuditItem[]) {
  return items.find((item) => item.result !== "通过")?.row ?? items[0]?.row ?? 0;
}

export function countResults(items: AuditItem[]): ResultCounts {
  return items.reduce(
    (counts, item) => {
      if (item.result === "通过") counts.pass += 1;
      if (item.result === "不通过") counts.fail += 1;
      if (item.result === "需人工介入") counts.manual += 1;
      return counts;
    },
    { pass: 0, fail: 0, manual: 0 },
  );
}

export function resolveTaskStatus(counts: ResultCounts): TaskStatus {
  if (counts.fail > 0) return "urgent";
  if (counts.manual > 0) return "processing";
  return "ready";
}

export function summarizeTaskCounts(counts: ResultCounts) {
  if (counts.fail > 0) return `${counts.fail} 个异常待确认`;
  if (counts.manual > 0) return `${counts.manual} 项等待人工复核`;
  return `${counts.pass} 项检查已通过`;
}

export function normalizeExpandedMarkdown(text: string) {
  const normalized = text
    .trim()
    .replace(/\r\n/g, "\n")
    .replace(/\|\|/g, "|\n|")
    .replace(/\n\s+\|/g, "\n|")
    .replace(/\n{3,}/g, "\n\n");

  return normalized;
}

export function getFitScale(
  contentWidth: number,
  contentHeight: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  if (viewportWidth <= 0 || viewportHeight <= 0) return 1;

  const availableWidth = Math.max(viewportWidth, 1);
  const availableHeight = Math.max(viewportHeight, 1);

  return Math.min(availableWidth / contentWidth, availableHeight / contentHeight, 1);
}

export function getFitTransform(
  contentWidth: number,
  contentHeight: number,
  viewportWidth: number,
  viewportHeight: number,
) {
  const scale = getFitScale(contentWidth, contentHeight, viewportWidth, viewportHeight);

  return {
    positionX: (viewportWidth - contentWidth * scale) / 2,
    positionY: (viewportHeight - contentHeight * scale) / 2,
    scale,
  };
}

export function cx(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}
