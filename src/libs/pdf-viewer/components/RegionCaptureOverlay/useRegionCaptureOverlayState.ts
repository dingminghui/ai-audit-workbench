import { useCallback, useMemo, useState } from "react";
import type { Crop, PixelCrop } from "react-image-crop";

import type { ElementSize } from "../../hooks/useElementSize";

export interface UseRegionCaptureOverlayStateParams {
  mediaSize: ElementSize;
  onCopy: (crop: PixelCrop) => Promise<boolean>;
  onQuote?: (crop: PixelCrop) => Promise<boolean>;
}

export interface UseRegionCaptureOverlayStateReturn {
  crop: Crop | undefined;
  completedCrop: PixelCrop | undefined;
  effectiveCrop: Crop | PixelCrop | null;
  canCopy: boolean;
  setCrop: (crop: Crop) => void;
  setCompletedCrop: (crop: PixelCrop | undefined) => void;
  resetSelection: () => void;
  handleCopy: () => Promise<void>;
  handleQuote: () => Promise<void>;
}

function isCropVisible(crop: Crop | PixelCrop | undefined): crop is Crop | PixelCrop {
  return !!crop && crop.width > 0 && crop.height > 0;
}

export function useRegionCaptureOverlayState({
  mediaSize: _mediaSize,
  onCopy,
  onQuote,
}: UseRegionCaptureOverlayStateParams): UseRegionCaptureOverlayStateReturn {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const resetSelection = useCallback(() => {
    setCrop(undefined);
    setCompletedCrop(undefined);
  }, []);

  const effectiveCrop = useMemo(() => {
    if (isCropVisible(crop)) {
      return crop;
    }

    if (isCropVisible(completedCrop)) {
      return completedCrop;
    }

    return null;
  }, [crop, completedCrop]);

  const canCopy = useMemo(() => effectiveCrop !== null, [effectiveCrop]);

  const handleCopy = useCallback(async () => {
    if (!completedCrop) {
      resetSelection();
      return;
    }

    const didExport = await onCopy(completedCrop);
    if (!didExport) {
      resetSelection();
    }
  }, [completedCrop, onCopy, resetSelection]);

  const handleQuote = useCallback(async () => {
    if (!completedCrop) {
      resetSelection();
      return;
    }

    const didExport = await onQuote?.(completedCrop);
    if (!didExport) {
      resetSelection();
    }
  }, [completedCrop, onQuote, resetSelection]);

  return {
    crop,
    completedCrop,
    effectiveCrop,
    canCopy,
    setCrop,
    setCompletedCrop,
    resetSelection,
    handleCopy,
    handleQuote,
  };
}
