import type { PdfHighlightItem } from "../types";
import { isValidHighlightPosition } from "./highlightUtils";

export interface HighlightRect {
  chunkId: string;
  height: number;
  left: number;
  top: number;
  width: number;
}

interface ResolveHighlightRectsParams {
  pageIndex: number;
  pageHeight: number;
  scale: number;
  highlights: PdfHighlightItem[];
}

export function resolveHighlightRects({
  pageIndex,
  pageHeight,
  scale,
  highlights,
}: ResolveHighlightRectsParams): HighlightRect[] {
  return highlights.flatMap((highlight) =>
    highlight.positions.flatMap((position) => {
      if (!isValidHighlightPosition(position) || position.page_number !== pageIndex + 1) {
        return [];
      }

      const left = Math.min(position.x1, position.x2) * scale;
      const top = pageHeight - Math.max(position.y1, position.y2) * scale;
      const width = Math.abs(position.x2 - position.x1) * scale;
      const height = Math.abs(position.y2 - position.y1) * scale;

      if (width <= 0 || height <= 0) {
        return [];
      }

      return [
        {
          chunkId: highlight.chunk_id,
          height,
          left,
          top,
          width,
        } satisfies HighlightRect,
      ];
    }),
  );
}
