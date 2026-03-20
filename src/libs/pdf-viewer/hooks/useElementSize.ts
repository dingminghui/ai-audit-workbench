import type { RefObject } from "react";
import { useLayoutEffect, useState } from "react";

export interface ElementSize {
  width: number;
  height: number;
}

export function useElementSize(
  elementRef: RefObject<HTMLElement | null>,
  enabled: boolean = true,
): ElementSize {
  const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = elementRef.current;
    if (!el) return;

    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry!.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [elementRef, enabled]);

  return size;
}
