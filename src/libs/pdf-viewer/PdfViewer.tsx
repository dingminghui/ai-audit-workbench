import { SpecialZoomLevel, Viewer, Worker } from "@react-pdf-viewer/core";
import {
  type ComponentPropsWithoutRef,
  type CSSProperties,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "./styles/highlight.css";
import "./styles/scrollbar.css";
import "./styles/selectionAddon.css";
import "./styles/textSelection.css";

import { DownloadControls } from "./components/DownloadControls";
import { PageNavigation } from "./components/PageNavigation";
import { PdfViewerBody } from "./components/PdfViewerBody";
import { PdfViewerHeader } from "./components/PdfViewerHeader";
import { RegionCaptureControls } from "./components/RegionCaptureControls";
import { SidebarToggle } from "./components/SidebarToggle";
import { ZoomControls } from "./components/ZoomControls";
import {
  useHighlightNavigation,
  type UseHighlightNavigationParams,
} from "./hooks/useHighlightNavigation";
import { usePdfViewerPlugins } from "./hooks/usePdfViewerPlugins";
import { useRegionCapture, type UseRegionCaptureParams } from "./hooks/useRegionCapture";
import { useSidebarState } from "./hooks/useSidebarState";
import { useTextSelection } from "./hooks/useTextSelection";
import { thumbnailPageLayout } from "./layouts/thumbnailPageLayout";
import { DEFAULT_THEME_COLOR, PdfViewerContext } from "./PdfViewerContext";
import type {
  PdfHighlightItem,
  PdfViewerFeatures,
  PdfViewerRegionCapture,
  PdfViewerTextSelection,
} from "./types";
import { resolvePdfViewerFeatures } from "./utils/resolvePdfViewerFeatures";

const PDF_WORKER_URL = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

type PdfViewerRootProps = Omit<ComponentPropsWithoutRef<"div">, "children" | "content">;

export interface PdfViewerProps extends PdfViewerRootProps {
  /** PDF 文件地址，支持 URL、base64 或项目内相对路径。 */
  fileUrl: string;
  /** 初始缩放比例，默认使用 `SpecialZoomLevel.PageFit`。 */
  defaultScale?: number | SpecialZoomLevel;
  /** 主题色，用于按钮激活态和局部高亮样式。 */
  themeColor?: string;
  /** 功能开关配置，稳定只表达“启用/关闭”。 */
  features?: PdfViewerFeatures;
  /** 可供定位的高亮块列表，供声明式或命令式滚动使用。 */
  highlights?: PdfHighlightItem[];
  /** 当前激活的高亮块 id，变化时会自动滚动到对应区域。 */
  activeHighlightId?: string | null;
  /** 区域截图能力，包含开关、行为选项和回调。 */
  regionCapture?: PdfViewerRegionCapture;
  /** 文本选择能力，包含开关、行为选项和回调。 */
  textSelection?: PdfViewerTextSelection;
}

export interface PdfViewerRef {
  /** 按高亮块 id 滚动到对应区域，成功命中时返回 `true`。 */
  scrollToHighlight: (chunkId: string) => Promise<boolean>;
}

export const PdfViewer = forwardRef<PdfViewerRef, PdfViewerProps>(function PdfViewer(
  {
    fileUrl,
    defaultScale,
    themeColor,
    features,
    highlights = [],
    activeHighlightId,
    regionCapture,
    textSelection,
    className,
    style,
    ...rootProps
  }: PdfViewerProps,
  ref,
) {
  const { download, thumbnail, pageNavigation, zoom, showLayout } =
    resolvePdfViewerFeatures(features);

  const { isSidebarOpen, onToggleSidebar } = useSidebarState();
  const contentRef = useRef<HTMLDivElement>(null);
  const effectiveDefaultScale = defaultScale ?? SpecialZoomLevel.PageFit;
  const effectiveThemeColor = themeColor ?? DEFAULT_THEME_COLOR;
  const effectiveHighlights = highlights;
  const effectiveActiveHighlightId = activeHighlightId ?? null;
  const isRegionCaptureEnabled = regionCapture?.enabled ?? !!regionCapture;
  const isTextSelectionEnabled = textSelection?.enabled ?? !!textSelection;
  const shouldShowLayout = showLayout || isRegionCaptureEnabled;

  const { textSelectionPluginProps } = useTextSelection({
    textSelectionEnabled: isTextSelectionEnabled,
    textSelection,
  });

  const pluginInstances = usePdfViewerPlugins({
    download,
    thumbnail,
    pageNavigation,
    zoom,
    regionCapture: isRegionCaptureEnabled,
    highlight: effectiveHighlights.length > 0,
    textSelection: isTextSelectionEnabled,
    textSelectionPluginProps,
  });

  const highlightNavigationParams: UseHighlightNavigationParams = {
    activeHighlightId: effectiveActiveHighlightId,
    fileUrl,
    highlights: effectiveHighlights,
  };

  if (pluginInstances.highlightPluginInstance?.jumpToPosition) {
    highlightNavigationParams.jumpToPosition =
      pluginInstances.highlightPluginInstance.jumpToPosition;
  }

  const { scrollToHighlight } = useHighlightNavigation(highlightNavigationParams);

  useImperativeHandle(
    ref,
    () => ({
      scrollToHighlight,
    }),
    [scrollToHighlight],
  );

  const regionCaptureParams: UseRegionCaptureParams = {
    regionCaptureEnabled: isRegionCaptureEnabled,
    pageCanvasStore: pluginInstances.pageCanvasStore,
    contentRef,
  };

  if (regionCapture) {
    regionCaptureParams.regionCapture = regionCapture;
  }

  const {
    isRegionCaptureActive,
    onToggleRegionCapture,
    handleRegionCopy,
    handleRegionQuote,
    handleRegionCancel,
  } = useRegionCapture(regionCaptureParams);

  const headerElement = shouldShowLayout ? (
    <PdfViewerHeader
      sidebarToggleSlot={
        thumbnail ? (
          <SidebarToggle isSidebarOpen={isSidebarOpen} onToggle={onToggleSidebar} />
        ) : null
      }
      pageNavigationSlot={
        pageNavigation && pluginInstances.pageNavigationPluginInstance ? (
          <PageNavigation
            CurrentPageInput={<pluginInstances.pageNavigationPluginInstance.CurrentPageInput />}
            NumberOfPages={<pluginInstances.pageNavigationPluginInstance.NumberOfPages />}
          />
        ) : null
      }
      regionCaptureSlot={
        isRegionCaptureEnabled ? (
          <RegionCaptureControls
            isActive={isRegionCaptureActive}
            onToggle={onToggleRegionCapture}
          />
        ) : null
      }
      zoomSlot={
        zoom && pluginInstances.zoomPluginInstance ? (
          <ZoomControls
            Zoom={pluginInstances.zoomPluginInstance.Zoom}
            ZoomIn={pluginInstances.zoomPluginInstance.ZoomIn}
            ZoomOut={pluginInstances.zoomPluginInstance.ZoomOut}
            defaultScale={effectiveDefaultScale}
          />
        ) : null
      }
      downloadSlot={
        download && pluginInstances.getFilePluginInstance ? (
          <DownloadControls Download={pluginInstances.getFilePluginInstance.Download} />
        ) : null
      }
    />
  ) : null;

  const rootClassName = ["pdf-viewer-container", className].filter(Boolean).join(" ");
  const rootStyle = {
    ...style,
    "--rpv-core__page-layer-box-shadow": "none",
  } as CSSProperties;

  return (
    <div className={rootClassName} style={rootStyle} {...rootProps}>
      <PdfViewerContext.Provider
        value={{
          themeColor: effectiveThemeColor,
          highlights: effectiveHighlights,
          activeHighlightId: effectiveActiveHighlightId,
        }}
      >
        <Worker workerUrl={PDF_WORKER_URL}>
          <PdfViewerBody
            showLayout={shouldShowLayout}
            header={headerElement}
            pluginInstances={pluginInstances}
            isSidebarOpen={isSidebarOpen}
            contentRef={contentRef}
            regionCapture={isRegionCaptureEnabled}
            isRegionCaptureActive={isRegionCaptureActive}
            onRegionCopy={handleRegionCopy}
            onRegionQuote={handleRegionQuote}
            onRegionCancel={handleRegionCancel}
          >
            <Viewer
              fileUrl={fileUrl}
              defaultScale={effectiveDefaultScale}
              plugins={pluginInstances.allPlugins}
              pageLayout={thumbnailPageLayout}
            />
          </PdfViewerBody>
        </Worker>
      </PdfViewerContext.Provider>
    </div>
  );
});

PdfViewer.displayName = "PdfViewer";
