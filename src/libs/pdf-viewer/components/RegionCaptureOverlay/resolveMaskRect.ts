import type { Crop, PixelCrop } from "react-image-crop";

import type { ElementSize } from "../../hooks/useElementSize";

export interface MaskRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function resolveMaskRect(
  crop: Crop | PixelCrop | null,
  mediaSize: ElementSize,
): MaskRect | null {
  if (!crop) {
    return null;
  }

  if (crop.unit === "%") {
    return {
      x: (crop.x / 100) * mediaSize.width,
      y: (crop.y / 100) * mediaSize.height,
      w: (crop.width / 100) * mediaSize.width,
      h: (crop.height / 100) * mediaSize.height,
    };
  }

  return {
    x: crop.x,
    y: crop.y,
    w: crop.width,
    h: crop.height,
  };
}
