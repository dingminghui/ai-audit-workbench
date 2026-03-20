import type { Plugin, PluginFunctions, PluginRenderPageLayer } from "@react-pdf-viewer/core";

import { useMemo } from "react";

import { usePdfViewerContext } from "../PdfViewerContext";
import type { PdfHighlightPosition } from "../types";
import { hexToRgba } from "../utils/hexToRgba";
import {
  type HighlightPageMetric,
  manualScrollToHighlightPosition,
  toHighlightDestination,
} from "../utils/highlightNavigationUtils";
import { resolveHighlightRects } from "../utils/resolveHighlightRects";

export interface HighlightPluginInstance {
  plugin: Plugin;
  jumpToPosition: (position: PdfHighlightPosition) => Promise<boolean>;
}

function HighlightLayer({ pageLayer }: { pageLayer: PluginRenderPageLayer }) {
  const { pageIndex, height, scale } = pageLayer;
  const { activeHighlightId, highlights, themeColor } = usePdfViewerContext();

  const rects = useMemo(
    () =>
      resolveHighlightRects({
        pageIndex,
        pageHeight: height,
        scale,
        highlights,
      }),
    [height, highlights, pageIndex, scale],
  );

  if (rects.length === 0) {
    return null;
  }

  return (
    <div className="pdf-viewer-highlight-layer" aria-hidden="true">
      {rects.map((rect, index) => {
        const isActive = rect.chunkId === activeHighlightId;

        return (
          <div
            key={`${rect.chunkId}-${pageIndex}-${index}`}
            data-active={isActive ? "true" : "false"}
            data-testid={`pdf-viewer-highlight-${rect.chunkId}-${index}`}
            className="pdf-viewer-highlight-rect"
            style={{
              backgroundColor: hexToRgba(themeColor, isActive ? 0.32 : 0.18),
              height: `${rect.height}px`,
              left: `${rect.left}px`,
              top: `${rect.top}px`,
              width: `${rect.width}px`,
            }}
          />
        );
      })}
    </div>
  );
}

export function highlightPlugin(): HighlightPluginInstance {
  let pluginFunctions: PluginFunctions | null = null;
  const pageMetrics = new Map<number, HighlightPageMetric>();

  const plugin: Plugin = {
    install: (functions: PluginFunctions) => {
      pluginFunctions = functions;
    },
    uninstall: () => {
      pluginFunctions = null;
    },
    renderPageLayer: (pageLayer: PluginRenderPageLayer) => {
      pageMetrics.set(pageLayer.pageIndex, {
        height: pageLayer.height,
        scale: pageLayer.scale,
      });

      return <HighlightLayer pageLayer={pageLayer} />;
    },
  };

  const jumpToPosition = async (position: PdfHighlightPosition): Promise<boolean> => {
    if (!pluginFunctions) return false;

    const destination = toHighlightDestination(position);
    let jumpedByDestination = false;

    if (destination) {
      try {
        await pluginFunctions.jumpToDestination(destination);
        jumpedByDestination = true;
      } catch {
        jumpedByDestination = false;
      }
    }

    if (jumpedByDestination) {
      return true;
    }

    return manualScrollToHighlightPosition(position, pluginFunctions, pageMetrics);
  };

  return { plugin, jumpToPosition };
}
