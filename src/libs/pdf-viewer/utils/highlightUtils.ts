import type { PdfHighlightPosition } from "../types";

export function isValidHighlightPosition(position: PdfHighlightPosition): boolean {
  return (
    Number.isInteger(position.page_number) &&
    position.page_number >= 1 &&
    Number.isFinite(position.x1) &&
    Number.isFinite(position.y1) &&
    Number.isFinite(position.x2) &&
    Number.isFinite(position.y2)
  );
}
