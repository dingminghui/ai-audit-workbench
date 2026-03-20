import type { Crop, PixelCrop } from "react-image-crop";

const MIN_CROP_PX = 24;

export function meetsMinCropThreshold(
  c: Crop | PixelCrop | null,
  mediaSize: { width: number; height: number },
): boolean {
  if (!c || !mediaSize.width || !mediaSize.height) return false;
  const w = c.unit === "%" ? (c.width / 100) * mediaSize.width : (c as PixelCrop).width;
  const h = c.unit === "%" ? (c.height / 100) * mediaSize.height : (c as PixelCrop).height;
  return w >= MIN_CROP_PX && h >= MIN_CROP_PX;
}
