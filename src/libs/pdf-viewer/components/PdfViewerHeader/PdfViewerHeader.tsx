import type { ReactNode } from "react";
import { PreviewLayout } from "../../layouts/PreviewLayout";

export interface PdfViewerHeaderProps {
  sidebarToggleSlot?: ReactNode;
  pageNavigationSlot?: ReactNode;
  regionCaptureSlot?: ReactNode;
  zoomSlot?: ReactNode;
  downloadSlot?: ReactNode;
}

export function PdfViewerHeader({
  sidebarToggleSlot,
  pageNavigationSlot,
  regionCaptureSlot,
  zoomSlot,
  downloadSlot,
}: PdfViewerHeaderProps) {
  return (
    <PreviewLayout.Header>
      <PreviewLayout.HeaderSpace>
        <PreviewLayout.HeaderLeft>
          {sidebarToggleSlot}
          {pageNavigationSlot}
        </PreviewLayout.HeaderLeft>
        <PreviewLayout.HeaderRight>
          {regionCaptureSlot}
          {zoomSlot}
          {downloadSlot}
        </PreviewLayout.HeaderRight>
      </PreviewLayout.HeaderSpace>
    </PreviewLayout.Header>
  );
}
