import type { Destination, PluginFunctions } from "@react-pdf-viewer/core";

import type { PdfHighlightPosition } from "../types";
import { isValidHighlightPosition } from "./highlightUtils";

export interface HighlightPageMetric {
  height: number;
  scale: number;
}

export function toHighlightDestination(position: PdfHighlightPosition): Destination | null {
  if (!isValidHighlightPosition(position)) {
    return null;
  }

  return {
    pageIndex: position.page_number - 1,
    leftOffset: Math.min(position.x1, position.x2),
    bottomOffset: Math.max(position.y1, position.y2),
  };
}

function getScrollContainer(pagesContainer: HTMLElement): HTMLElement {
  if (pagesContainer.classList.contains("rpv-core__inner-pages")) {
    return pagesContainer;
  }

  return pagesContainer.querySelector<HTMLElement>(".rpv-core__inner-pages") ?? pagesContainer;
}

export function manualScrollToHighlightPosition(
  position: PdfHighlightPosition,
  pluginFunctions: PluginFunctions,
  pageMetrics: Map<number, HighlightPageMetric>,
): boolean {
  const pageIndex = position.page_number - 1;
  if (pageIndex < 0) {
    return false;
  }

  const pagesContainer = pluginFunctions.getPagesContainer();
  if (!pagesContainer) {
    return false;
  }

  const scrollContainer = getScrollContainer(pagesContainer);
  const pageLayer = scrollContainer.querySelector<HTMLElement>(
    `[data-testid="core__page-layer-${pageIndex}"]`,
  );
  if (!pageLayer) {
    return false;
  }

  const pageMetric = pageMetrics.get(pageIndex);
  const pageTop = pageLayer.offsetTop;
  let topOffsetInPage = 0;

  if (pageMetric && pageMetric.scale > 0) {
    const topPdfY = Math.max(position.y1, position.y2);
    topOffsetInPage = pageMetric.height - topPdfY * pageMetric.scale;
  }

  const targetTop = Math.max(0, pageTop + topOffsetInPage - 24);
  scrollContainer.scrollTo({ top: targetTop });
  return true;
}
