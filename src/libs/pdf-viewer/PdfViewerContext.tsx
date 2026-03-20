import { createContext, useContext } from "react";

import type { PdfHighlightItem } from "./types";

const DEFAULT_THEME_COLOR = "#38F";

export interface PdfViewerContextValue {
  themeColor: string;
  highlights: PdfHighlightItem[];
  activeHighlightId: string | null;
}

const defaultContextValue: PdfViewerContextValue = {
  themeColor: DEFAULT_THEME_COLOR,
  highlights: [],
  activeHighlightId: null,
};

export const PdfViewerContext = createContext<PdfViewerContextValue>(defaultContextValue);

export function usePdfViewerContext(): PdfViewerContextValue {
  return useContext(PdfViewerContext);
}

export function useThemeColor(): string {
  return usePdfViewerContext().themeColor;
}

export { DEFAULT_THEME_COLOR };
