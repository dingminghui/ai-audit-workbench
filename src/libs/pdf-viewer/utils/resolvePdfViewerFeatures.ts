import type { PdfViewerFeatures } from "../types";

export interface ResolvedPdfViewerFeatures {
  download: boolean;
  thumbnail: boolean;
  pageNavigation: boolean;
  zoom: boolean;
  showLayout: boolean;
}

export function resolvePdfViewerFeatures(features?: PdfViewerFeatures): ResolvedPdfViewerFeatures {
  const download = features?.download ?? false;
  const thumbnail = features?.thumbnail ?? false;
  const pageNavigation = features?.pageNavigation ?? false;
  const zoom = features?.zoom ?? false;

  return {
    download,
    thumbnail,
    pageNavigation,
    zoom,
    showLayout: download || thumbnail || pageNavigation || zoom,
  };
}
