import type { HighlightArea, SelectionData } from "@react-pdf-viewer/highlight";

export interface PdfHighlightPosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  page_number: number;
}

export interface PdfRegionSelectionPayload {
  imageDataUrl: string;
  positions: PdfHighlightPosition[];
}

export interface PdfHighlightItem {
  chunk_id: string;
  positions: PdfHighlightPosition[];
  original_reference?: string;
}

export interface PdfViewerFeatures {
  download?: boolean;
  pageNavigation?: boolean;
  thumbnail?: boolean;
  zoom?: boolean;
}

export interface PdfViewerRegionCapture {
  /** 是否启用区域截图。未显式传值时，传入该对象即视为启用。 */
  enabled?: boolean;
  /** 复制动作是否同时写入系统剪贴板，默认 `true`。 */
  copyToClipboard?: boolean;
  /** 复制区域截图后触发；第二个参数提供结构化点位。 */
  onCopy?: (imageDataUrl: string, payload: PdfRegionSelectionPayload) => void;
  /** 点击“引用”动作后触发。 */
  onSelectionExport?: (payload: PdfRegionSelectionPayload) => void;
}

export interface PdfTextSelectionPayload {
  selectedText: string;
  highlightAreas: HighlightArea[];
  selectionData?: SelectionData;
  selectionRegion: HighlightArea;
}

export interface PdfViewerTextSelection {
  /** 是否启用文本选择能力。未显式传值时，传入该对象即视为启用。 */
  enabled?: boolean;
  /** 复制动作是否同时写入系统剪贴板，默认 `true`。 */
  copyToClipboard?: boolean;
  /** 复制选中文本后触发；第二个参数提供结构化选择信息。 */
  onCopy?: (selectedText: string, payload: PdfTextSelectionPayload) => void;
  /** 点击“引用”动作后触发。 */
  onSelectionExport?: (payload: PdfTextSelectionPayload) => void;
}
