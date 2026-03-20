import type { RefObject } from "react";
import { useLayoutEffect, useRef, useState } from "react";

export interface UseOverlayPortalReturn {
  portalTarget: HTMLDivElement | null;
  portalReady: boolean;
}

// Overlay 需要挂到 inner-pages 内部，才能和页面内容使用同一套坐标系。
export function useOverlayPortal(
  scrollContainerRef: RefObject<HTMLElement | null>,
): UseOverlayPortalReturn {
  const portalTargetRef = useRef<HTMLDivElement | null>(null);
  const [portalReady, setPortalReady] = useState(false);

  useLayoutEffect(() => {
    const contentEl = scrollContainerRef.current;
    if (!contentEl) return;

    let cleanup: () => void = () => {};

    const setupPortal = (): boolean => {
      const innerPages = contentEl.querySelector<HTMLElement>(".rpv-core__inner-pages");
      if (!innerPages) return false;

      const wrapper = document.createElement("div");
      wrapper.style.cssText =
        "position: absolute; top: 0; left: 0; width: 100%; z-index: 50; min-height: 100%;";
      innerPages.style.position = innerPages.style.position || "relative";
      innerPages.appendChild(wrapper);
      portalTargetRef.current = wrapper;
      setPortalReady(true);

      const updateHeight = () => {
        wrapper.style.height = `${innerPages.scrollHeight}px`;
      };
      updateHeight();
      const ro = new ResizeObserver(updateHeight);
      ro.observe(innerPages);

      cleanup = () => {
        ro.disconnect();
        wrapper.remove();
        portalTargetRef.current = null;
        setPortalReady(false);
      };
      return true;
    };

    if (!setupPortal()) {
      const id = setInterval(() => {
        if (setupPortal()) clearInterval(id);
      }, 200);
      return () => {
        clearInterval(id);
        cleanup();
      };
    }

    return () => cleanup();
  }, [scrollContainerRef]);

  return { portalTarget: portalTargetRef.current, portalReady };
}
