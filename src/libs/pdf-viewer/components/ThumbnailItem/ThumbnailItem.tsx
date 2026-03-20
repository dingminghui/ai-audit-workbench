import type { RenderThumbnailItemProps } from "@react-pdf-viewer/thumbnail";
import type { CSSProperties } from "react";
import { useRef } from "react";

import { useThumbnailAutoScroll } from "../../hooks/useThumbnailAutoScroll";
import { useThemeColor } from "../../PdfViewerContext";

import "./ThumbnailItem.css";

export function ThumbnailItem(props: RenderThumbnailItemProps) {
  const { pageIndex, currentPage, renderPageThumbnail, renderPageLabel, onJumpToPage } = props;
  const themeColor = useThemeColor();
  const itemRef = useRef<HTMLButtonElement | null>(null);

  useThumbnailAutoScroll(itemRef, pageIndex, currentPage);

  const isActive = pageIndex === currentPage;

  return (
    <button
      type="button"
      ref={itemRef}
      className={["pdf-viewer-thumbnail-item", isActive ? "pdf-viewer-thumbnail-item--active" : ""]
        .filter(Boolean)
        .join(" ")}
      style={{ "--pdf-viewer-thumbnail-border-color": themeColor } as CSSProperties}
      onClick={onJumpToPage}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="pdf-viewer-thumbnail-container">{renderPageThumbnail}</div>
      <p className="pdf-viewer-thumbnail-label">{renderPageLabel}</p>
    </button>
  );
}
