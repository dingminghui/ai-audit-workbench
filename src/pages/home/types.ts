export type AuditResult = "通过" | "不通过" | "需人工介入";
export type ResultFilter = "all" | "fail" | "manual";
export type TaskStatus = "urgent" | "processing" | "ready";

export interface HighlightRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AuditItem {
  row: number;
  checkpoint: string;
  result: AuditResult;
  comment: string;
  highlightRegions: HighlightRegion[];
  expandedText: string | null;
}

export interface Material {
  id: string;
  name: string;
  sourceSize: {
    width: number;
    height: number;
  };
  image: {
    path: string;
  };
  auditItems: AuditItem[];
}

export interface WorkbookData {
  materials: Material[];
}

export interface ResultCounts {
  pass: number;
  fail: number;
  manual: number;
}

export interface MaterialViewModel {
  id: string;
  name: string;
  serial: string;
  imageUrl: string;
  sourceSize: {
    width: number;
    height: number;
  };
  auditItems: AuditItem[];
  counts: ResultCounts;
  taskStatus: TaskStatus;
  taskSummary: string;
}

export interface TaskStatusMeta {
  label: string;
  dotClassName: string;
  badgeClassName: string;
  cardClassName: string;
}

export interface AuditResultMeta {
  label: string;
  shortLabel: string;
  badgeClassName: string;
  dotClassName: string;
  accentColor: string;
  cardClassName: string;
  actionLabel: string;
  summaryLabel: string;
}
