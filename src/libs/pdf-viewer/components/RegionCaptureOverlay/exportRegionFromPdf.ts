import type { PixelCrop } from "react-image-crop";

import type { PageCanvasStore } from "../../plugins/regionCapturePlugin";
import type { PdfHighlightPosition, PdfRegionSelectionPayload } from "../../types";

export interface ExportRegionParams {
  crop: PixelCrop;
  scrollContainer: HTMLElement;
  pageCanvasStore: PageCanvasStore;
}

interface PageRect {
  pageIndex: number;
  top: number;
  left: number;
  width: number;
  height: number;
}

interface CropSegment {
  pageIndex: number;
  srcX: number;
  srcY: number;
  srcW: number;
  srcH: number;
  contentWidth: number;
  contentHeight: number;
  position: PdfHighlightPosition;
}

function collectPageLayouts(container: HTMLElement): PageRect[] {
  const pages: PageRect[] = [];
  const scrollEl = container.querySelector<HTMLElement>(".rpv-core__inner-pages") ?? container;
  const pageLayers = scrollEl.querySelectorAll<HTMLElement>('[data-testid^="core__page-layer-"]');
  const scrollRect = scrollEl.getBoundingClientRect();

  pageLayers.forEach((el) => {
    const testId = el.getAttribute("data-testid") ?? "";
    const match = testId.match(/core__page-layer-(\d+)/);
    if (!match) return;

    const pageIndex = parseInt(match[1], 10);
    const rect = el.getBoundingClientRect();
    pages.push({
      pageIndex,
      top: rect.top - scrollRect.top + scrollEl.scrollTop,
      left: rect.left - scrollRect.left + scrollEl.scrollLeft,
      width: rect.width,
      height: rect.height,
    });
  });

  pages.sort((a, b) => a.pageIndex - b.pageIndex);
  return pages;
}

function computeCropSegments(
  crop: PixelCrop,
  pageLayouts: PageRect[],
  pageCanvasStore: PageCanvasStore,
): CropSegment[] {
  const cropLeft = crop.x;
  const cropTop = crop.y;
  const cropRight = crop.x + crop.width;
  const cropBottom = crop.y + crop.height;

  const segments: CropSegment[] = [];

  for (const page of pageLayouts) {
    const pageRight = page.left + page.width;
    const pageBottom = page.top + page.height;

    const interLeft = Math.max(cropLeft, page.left);
    const interTop = Math.max(cropTop, page.top);
    const interRight = Math.min(cropRight, pageRight);
    const interBottom = Math.min(cropBottom, pageBottom);

    if (interLeft >= interRight || interTop >= interBottom) continue;

    const canvasInfo = pageCanvasStore.get(page.pageIndex);
    if (!canvasInfo) continue;

    const scaleX = canvasInfo.canvas.width / page.width;
    const scaleY = canvasInfo.canvas.height / page.height;

    const pageLocalLeft = interLeft - page.left;
    const pageLocalTop = interTop - page.top;
    const pageLocalW = interRight - interLeft;
    const pageLocalH = interBottom - interTop;
    const pageLocalRight = pageLocalLeft + pageLocalW;
    const pageLocalBottom = pageLocalTop + pageLocalH;
    segments.push({
      pageIndex: page.pageIndex,
      srcX: pageLocalLeft * scaleX,
      srcY: pageLocalTop * scaleY,
      srcW: pageLocalW * scaleX,
      srcH: pageLocalH * scaleY,
      contentWidth: pageLocalW,
      contentHeight: pageLocalH,
      position: {
        x1: pageLocalLeft / canvasInfo.scale,
        x2: pageLocalRight / canvasInfo.scale,
        y1: (page.height - pageLocalBottom) / canvasInfo.scale,
        y2: (page.height - pageLocalTop) / canvasInfo.scale,
        page_number: page.pageIndex + 1,
      },
    });
  }

  return segments;
}

// 只导出真正落在 PDF 页面内容上的区域，不保留越界空白。
export function exportRegionFromPdf({
  crop,
  scrollContainer,
  pageCanvasStore,
}: ExportRegionParams): PdfRegionSelectionPayload | null {
  const pageLayouts = collectPageLayouts(scrollContainer);
  if (pageLayouts.length === 0) {
    console.warn("[RegionCapture] 未找到页面布局，请确认 PDF 已加载完成");
    return null;
  }

  const segments = computeCropSegments(crop, pageLayouts, pageCanvasStore);
  if (segments.length === 0) {
    console.warn("[RegionCapture] 选区未落在有效页面内或对应 canvas 未就绪", {
      crop: { x: crop.x, y: crop.y, w: crop.width, h: crop.height },
    });
    return null;
  }

  const outputW = Math.max(...segments.map((segment) => segment.contentWidth));
  const outputH = segments.reduce((sum, segment) => sum + segment.contentHeight, 0);
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = Math.ceil(outputW);
  tempCanvas.height = Math.ceil(outputH);

  const ctx = tempCanvas.getContext("2d");
  if (!ctx) return null;

  let destY = 0;

  for (const seg of segments) {
    const canvasInfo = pageCanvasStore.get(seg.pageIndex);
    if (!canvasInfo) continue;

    ctx.drawImage(
      canvasInfo.canvas,
      Math.round(seg.srcX),
      Math.round(seg.srcY),
      Math.round(seg.srcW),
      Math.round(seg.srcH),
      0,
      Math.round(destY),
      Math.round(seg.contentWidth),
      Math.round(seg.contentHeight),
    );

    destY += seg.contentHeight;
  }

  return {
    imageDataUrl: tempCanvas.toDataURL("image/png"),
    positions: segments.map((segment) => segment.position),
  };
}
