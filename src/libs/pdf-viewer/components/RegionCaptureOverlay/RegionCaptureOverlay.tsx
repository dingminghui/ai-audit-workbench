import type { CSSProperties } from "react";
import { useCallback, useMemo, useRef } from "react";
import * as ReactDOM from "react-dom";
import type { PixelCrop } from "react-image-crop";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { useElementSize } from "../../hooks/useElementSize";
import { useEscapeKey } from "../../hooks/useEscapeKey";
import { useOverlayPortal } from "../../hooks/useOverlayPortal";
import { useThemeColor } from "../../PdfViewerContext";
import { hexToRgba } from "../../utils/hexToRgba";
import "./RegionCaptureOverlay.css";
import { RegionCaptureSelectionAddon } from "./RegionCaptureSelectionAddon";
import { resolveMaskRect } from "./resolveMaskRect";
import { useRegionCaptureOverlayState } from "./useRegionCaptureOverlayState";

export interface RegionCaptureOverlayProps {
  onCopy: (crop: PixelCrop) => Promise<boolean>;
  onQuote?: (crop: PixelCrop) => Promise<boolean>;
  onCancel: () => void;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function RegionCaptureOverlay({
  onCopy,
  onQuote,
  onCancel,
  scrollContainerRef,
}: RegionCaptureOverlayProps) {
  const themeColor = useThemeColor();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { portalTarget, portalReady } = useOverlayPortal(scrollContainerRef);
  const mediaSize = useElementSize(wrapperRef, portalReady);
  useEscapeKey(onCancel);

  const { crop, effectiveCrop, canCopy, setCrop, setCompletedCrop, handleCopy, handleQuote } =
    useRegionCaptureOverlayState({
      mediaSize,
      onCopy,
      ...(onQuote ? { onQuote } : {}),
    });

  const handleCropComplete = useCallback(
    (nextCrop: PixelCrop) => {
      if (nextCrop.width <= 0 || nextCrop.height <= 0) {
        setCompletedCrop(undefined);
        return;
      }

      setCompletedCrop(nextCrop);
    },
    [setCompletedCrop],
  );

  const renderSelectionAddon = useCallback(
    () => (
      <RegionCaptureSelectionAddon
        canCopy={canCopy}
        canQuote={canCopy && !!onQuote}
        showQuote={!!onQuote}
        onCancel={onCancel}
        onCopy={handleCopy}
        onQuote={handleQuote}
      />
    ),
    [canCopy, handleCopy, handleQuote, onCancel, onQuote],
  );

  const cropVars = useMemo(
    () =>
      ({
        "--region-capture-handle-color": themeColor,
        "--region-capture-border-color": hexToRgba(themeColor, 0.75),
      }) as CSSProperties,
    [themeColor],
  );

  const maskRect = useMemo(
    () => resolveMaskRect(effectiveCrop, mediaSize),
    [effectiveCrop, mediaSize],
  );

  if (!portalReady || !portalTarget) return null;

  return ReactDOM.createPortal(
    <div className="region-capture-overlay">
      <svg
        className="region-capture-overlay-mask"
        width={mediaSize.width || 1}
        height={mediaSize.height || 1}
      >
        <defs>
          <mask id="region-capture-mask">
            <rect width="100%" height="100%" fill="white" />
            {maskRect && (
              <rect
                x={maskRect.x}
                y={maskRect.y}
                width={maskRect.w}
                height={maskRect.h}
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.20)"
          mask="url(#region-capture-mask)"
        />
      </svg>
      <div ref={wrapperRef} className="region-capture-crop-wrapper">
        {mediaSize.width > 0 && mediaSize.height > 0 && (
          <div className="region-capture-crop" style={cropVars}>
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={handleCropComplete}
              renderSelectionAddon={renderSelectionAddon}
              style={{ width: "100%", height: "100%" }}
            >
              <div
                style={{
                  width: mediaSize.width,
                  height: mediaSize.height,
                  display: "block",
                }}
              />
            </ReactCrop>
          </div>
        )}
      </div>
    </div>,
    portalTarget,
  );
}
