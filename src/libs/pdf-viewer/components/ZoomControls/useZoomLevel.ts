import type { SpecialZoomLevel } from "@react-pdf-viewer/core";
import { useCallback, useState } from "react";

import { isSpecialZoomLevel } from "./zoomLevelOptions";

export interface UseZoomLevelResult {
  selectedLevel: SpecialZoomLevel | "";
  clearSelectedLevel: () => void;
  selectLevel: (level: SpecialZoomLevel) => void;
}

export function useZoomLevel(defaultScale?: number | SpecialZoomLevel): UseZoomLevelResult {
  const [selectedLevel, setSelectedLevel] = useState<SpecialZoomLevel | "">(
    () => (isSpecialZoomLevel(defaultScale) ? defaultScale : ""),
  );

  const clearSelectedLevel = useCallback(() => setSelectedLevel(""), []);
  const selectLevel = useCallback((level: SpecialZoomLevel) => setSelectedLevel(level), []);

  return { selectedLevel, clearSelectedLevel, selectLevel };
}
