import auditWorkbenchData from "@/data/merck-meeting-audit/merckMeetingAudit.json";
import {
  countResults,
  resolveTaskStatus,
  summarizeTaskCounts,
} from "@/pages/home/homeUtils";
import type {
  AuditResult,
  AuditResultMeta,
  MaterialViewModel,
  TaskStatus,
  TaskStatusMeta,
  WorkbookData,
} from "@/pages/home/types";

const imageModules = import.meta.glob("../../data/merck-meeting-audit/images/*.{png,jpg,jpeg,gif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const imageUrlByFileName = Object.fromEntries(
  Object.entries(imageModules).map(([modulePath, imageUrl]) => [
    modulePath.split("/").pop() ?? modulePath,
    imageUrl,
  ]),
);

const rawData = auditWorkbenchData as WorkbookData;

export const materials: MaterialViewModel[] = rawData.materials.map((material, index) => {
  const counts = countResults(material.auditItems);
  return {
    id: material.id,
    name: material.name,
    serial: `AUD-${String(index + 1).padStart(3, "0")}`,
    imageUrl: resolveImageUrl(material.image.path),
    sourceSize: material.sourceSize,
    auditItems: material.auditItems,
    counts,
    taskStatus: resolveTaskStatus(counts),
    taskSummary: summarizeTaskCounts(counts),
  };
});

export const taskStatusMeta: Record<TaskStatus, TaskStatusMeta> = {
  urgent: {
    label: "紧急",
    dotClassName: "bg-rose-500",
    badgeClassName: "bg-rose-50 text-rose-600",
    cardClassName: "bg-white",
  },
  processing: {
    label: "处理中",
    dotClassName: "bg-amber-500",
    badgeClassName: "bg-amber-50 text-amber-600",
    cardClassName: "bg-white",
  },
  ready: {
    label: "就绪",
    dotClassName: "bg-emerald-500",
    badgeClassName: "bg-emerald-50 text-emerald-600",
    cardClassName: "bg-white",
  },
};

export const resultMeta: Record<AuditResult, AuditResultMeta> = {
  通过: {
    label: "通过",
    shortLabel: "通过",
    badgeClassName: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    dotClassName: "bg-emerald-500",
    accentColor: "#10b981",
    cardClassName: "bg-emerald-50/85",
    actionLabel: "查看详情",
    summaryLabel: "序列一致性核查",
  },
  不通过: {
    label: "检测到异常",
    shortLabel: "异常",
    badgeClassName: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    dotClassName: "bg-rose-500",
    accentColor: "#f43f5e",
    cardClassName: "bg-rose-50/85",
    actionLabel: "确认异常",
    summaryLabel: "异常确认",
  },
  需人工介入: {
    label: "需人工复核",
    shortLabel: "人工介入",
    badgeClassName: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    dotClassName: "bg-amber-500",
    accentColor: "#f59e0b",
    cardClassName: "bg-amber-50/85",
    actionLabel: "人工复核",
    summaryLabel: "复核处理中",
  },
};

export const filterOptions = [
  { value: "all", label: "全部" },
  { value: "fail", label: "异常" },
  { value: "manual", label: "人工介入" },
] as const;

function resolveImageUrl(imagePath: string) {
  const fileName = imagePath.split("/").pop() ?? imagePath;
  return imageUrlByFileName[fileName] ?? "";
}
