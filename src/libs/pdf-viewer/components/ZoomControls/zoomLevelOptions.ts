import { SpecialZoomLevel } from "@react-pdf-viewer/core";

import { ZoomActualIcon } from "../../icons/ZoomActualIcon";
import { ZoomFitIcon } from "../../icons/ZoomFitIcon";
import { ZoomWidthIcon } from "../../icons/ZoomWidthIcon";

export interface ZoomLevelOption {
  value: SpecialZoomLevel;
  label: string;
  Icon: React.ComponentType<{ style?: React.CSSProperties }>;
}

export const ZOOM_LEVEL_OPTIONS: readonly ZoomLevelOption[] = [
  { value: SpecialZoomLevel.PageFit, label: "自动缩放", Icon: ZoomFitIcon },
  { value: SpecialZoomLevel.PageWidth, label: "适合页宽", Icon: ZoomWidthIcon },
  { value: SpecialZoomLevel.ActualSize, label: "实际大小", Icon: ZoomActualIcon },
] as const;

const SPECIAL_LEVELS: readonly SpecialZoomLevel[] = [
  SpecialZoomLevel.PageFit,
  SpecialZoomLevel.PageWidth,
  SpecialZoomLevel.ActualSize,
];

export function isSpecialZoomLevel(v: unknown): v is SpecialZoomLevel {
  return typeof v === "string" && (SPECIAL_LEVELS as readonly string[]).includes(v);
}

export function getZoomLevelOption(level: SpecialZoomLevel | ""): ZoomLevelOption | null {
  if (!level) return null;
  return ZOOM_LEVEL_OPTIONS.find((o) => o.value === level) ?? null;
}
