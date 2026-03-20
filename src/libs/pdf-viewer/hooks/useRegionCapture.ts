import type { RefObject } from "react";
import { useCallback, useEffect, useState } from "react";
import type { PixelCrop } from "react-image-crop";

import { exportRegionFromPdf } from "../components/RegionCaptureOverlay/exportRegionFromPdf";
import type { PageCanvasStore } from "../plugins/regionCapturePlugin";
import type { PdfViewerRegionCapture } from "../types";

export interface UseRegionCaptureParams {
  regionCaptureEnabled: boolean;
  regionCapture?: PdfViewerRegionCapture;
  pageCanvasStore: PageCanvasStore | null;
  contentRef: RefObject<HTMLDivElement | null>;
}

export interface UseRegionCaptureReturn {
  isRegionCaptureActive: boolean;
  onToggleRegionCapture: () => void;
  handleRegionCopy: (crop: PixelCrop) => Promise<boolean>;
  handleRegionQuote?: (crop: PixelCrop) => Promise<boolean>;
  handleRegionCancel: () => void;
}

export function useRegionCapture({
  regionCaptureEnabled,
  regionCapture,
  pageCanvasStore,
  contentRef,
}: UseRegionCaptureParams): UseRegionCaptureReturn {
  const [isRegionCaptureActive, setIsRegionCaptureActive] = useState(false);
  const onToggleRegionCapture = useCallback(() => {
    if (!regionCaptureEnabled) {
      return;
    }
    setIsRegionCaptureActive((v) => !v);
  }, [regionCaptureEnabled]);

  useEffect(() => {
    if (!regionCaptureEnabled) {
      setIsRegionCaptureActive(false);
    }
  }, [regionCaptureEnabled]);

  const handleRegionCopy = useCallback(
    async (crop: PixelCrop) => {
      const scrollContainer = contentRef.current;
      if (!scrollContainer || !pageCanvasStore) {
        console.warn("[RegionCapture] 缺少 scrollContainer 或 pageCanvasStore");
        return false;
      }

      const selectionPayload = exportRegionFromPdf({ crop, scrollContainer, pageCanvasStore });
      if (!selectionPayload) {
        console.warn("[RegionCapture] 导出失败，请检查选区是否在有效页面内");
        return false;
      }

      if (regionCapture?.copyToClipboard ?? true) {
        try {
          await navigator.clipboard.writeText(selectionPayload.imageDataUrl);
        } catch (e) {
          console.warn("[RegionCapture] 复制到剪贴板失败:", e);
        }
      }

      regionCapture?.onCopy?.(selectionPayload.imageDataUrl, selectionPayload);
      setIsRegionCaptureActive(false);
      return true;
    },
    [contentRef, pageCanvasStore, regionCapture],
  );

  const handleRegionQuote = useCallback(
    async (crop: PixelCrop) => {
      const scrollContainer = contentRef.current;
      if (!scrollContainer || !pageCanvasStore) {
        console.warn("[RegionCapture] 缺少 scrollContainer 或 pageCanvasStore");
        return false;
      }

      const selectionPayload = exportRegionFromPdf({ crop, scrollContainer, pageCanvasStore });
      if (!selectionPayload) {
        console.warn("[RegionCapture] 导出失败，请检查选区是否在有效页面内");
        return false;
      }

      regionCapture?.onSelectionExport?.(selectionPayload);
      setIsRegionCaptureActive(false);
      return true;
    },
    [contentRef, pageCanvasStore, regionCapture],
  );

  const handleRegionCancel = useCallback(() => {
    setIsRegionCaptureActive(false);
  }, []);

  return {
    isRegionCaptureActive,
    onToggleRegionCapture,
    handleRegionCopy,
    ...(regionCaptureEnabled && regionCapture?.onSelectionExport ? { handleRegionQuote } : {}),
    handleRegionCancel,
  };
}
