import type { Plugin } from "@react-pdf-viewer/core";
import type { GetFilePlugin } from "@react-pdf-viewer/get-file";
import { getFilePlugin } from "@react-pdf-viewer/get-file";
import type {
  HighlightPlugin as TextSelectionPlugin,
  HighlightPluginProps as TextSelectionPluginProps,
} from "@react-pdf-viewer/highlight";
import {
  highlightPlugin as textSelectionHighlightPlugin,
  Trigger as TextSelectionTrigger,
} from "@react-pdf-viewer/highlight";
import type { PageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import type { ThumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import type { ZoomPlugin } from "@react-pdf-viewer/zoom";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { useMemo } from "react";

import type { HighlightPluginInstance } from "../plugins/highlightPlugin";
import { highlightPlugin } from "../plugins/highlightPlugin";
import type { PageCanvasStore, RegionCapturePluginInstance } from "../plugins/regionCapturePlugin";
import { regionCapturePlugin } from "../plugins/regionCapturePlugin";
import { RenderSpinner } from "../ui/RenderSpinner";

export interface PdfViewerPluginInstances {
  thumbnailPluginInstance: ThumbnailPlugin | null;
  pageNavigationPluginInstance: PageNavigationPlugin | null;
  zoomPluginInstance: ZoomPlugin | null;
  getFilePluginInstance: GetFilePlugin | null;
  regionCapturePluginInstance: RegionCapturePluginInstance | null;
  highlightPluginInstance: HighlightPluginInstance | null;
  textSelectionPluginInstance: TextSelectionPlugin | null;
  allPlugins: Plugin[];
  pageCanvasStore: PageCanvasStore | null;
}

export interface UsePdfViewerPluginsParams {
  download: boolean;
  thumbnail: boolean;
  pageNavigation: boolean;
  zoom: boolean;
  regionCapture: boolean;
  highlight: boolean;
  textSelection: boolean;
  textSelectionPluginProps?: TextSelectionPluginProps;
}

// react-pdf-viewer 的插件工厂内部会用到 hooks，需要始终在组件顶层调用。
export function usePdfViewerPlugins({
  download,
  thumbnail,
  pageNavigation,
  zoom,
  regionCapture,
  highlight,
  textSelection,
  textSelectionPluginProps,
}: UsePdfViewerPluginsParams): PdfViewerPluginInstances {
  const thumbInst = thumbnailPlugin({ renderSpinner: () => <RenderSpinner /> });
  const pageNavInst = pageNavigationPlugin();
  const zoomInst = zoomPlugin();
  const getFileInst = getFilePlugin();
  const textSelectionInst = textSelectionHighlightPlugin({
    trigger: TextSelectionTrigger.TextSelection,
    ...textSelectionPluginProps,
  });
  const captureInst = useMemo(() => regionCapturePlugin(), []);
  const highlightInst = useMemo(() => highlightPlugin(), []);

  const allPlugins: Plugin[] = [];
  if (thumbnail) allPlugins.push(thumbInst);
  if (pageNavigation) allPlugins.push(pageNavInst);
  if (zoom) allPlugins.push(zoomInst);
  if (download) allPlugins.push(getFileInst);
  if (regionCapture) allPlugins.push(captureInst.plugin);
  if (highlight) allPlugins.push(highlightInst.plugin);
  if (textSelection) allPlugins.push(textSelectionInst);

  return {
    thumbnailPluginInstance: thumbnail ? thumbInst : null,
    pageNavigationPluginInstance: pageNavigation ? pageNavInst : null,
    zoomPluginInstance: zoom ? zoomInst : null,
    getFilePluginInstance: download ? getFileInst : null,
    regionCapturePluginInstance: regionCapture ? captureInst : null,
    highlightPluginInstance: highlight ? highlightInst : null,
    textSelectionPluginInstance: textSelection ? textSelectionInst : null,
    allPlugins,
    pageCanvasStore: regionCapture ? captureInst.pageCanvasStore : null,
  };
}
