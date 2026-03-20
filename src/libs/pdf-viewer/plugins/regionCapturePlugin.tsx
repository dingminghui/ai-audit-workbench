import type { Plugin, PluginRenderPageLayer } from "@react-pdf-viewer/core";
import { useEffect, useRef } from "react";

export interface PageCanvasInfo {
  canvas: HTMLCanvasElement;
  scale: number;
  width: number;
  height: number;
}

export type PageCanvasStore = Map<number, PageCanvasInfo>;

function PageCollector({
  pageLayer,
  store,
}: {
  pageLayer: PluginRenderPageLayer;
  store: PageCanvasStore;
}) {
  const { pageIndex, canvasLayerRef, canvasLayerRendered, scale, width, height } = pageLayer;
  const registered = useRef(false);

  useEffect(() => {
    if (!canvasLayerRendered || !canvasLayerRef.current) {
      registered.current = false;
      return;
    }
    store.set(pageIndex, {
      canvas: canvasLayerRef.current,
      scale,
      width,
      height,
    });
    registered.current = true;

    return () => {
      if (registered.current) {
        store.delete(pageIndex);
        registered.current = false;
      }
    };
  }, [canvasLayerRendered, canvasLayerRef, pageIndex, scale, width, height, store]);

  return null;
}

export interface RegionCapturePluginInstance {
  plugin: Plugin;
  pageCanvasStore: PageCanvasStore;
}

export function regionCapturePlugin(): RegionCapturePluginInstance {
  const pageCanvasStore: PageCanvasStore = new Map();

  const plugin: Plugin = {
    renderPageLayer: (pageLayer: PluginRenderPageLayer) => (
      <PageCollector pageLayer={pageLayer} store={pageCanvasStore} />
    ),
  };

  return { plugin, pageCanvasStore };
}
