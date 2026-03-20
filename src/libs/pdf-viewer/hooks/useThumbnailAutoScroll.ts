import type { RefObject } from "react";
import { useEffect } from "react";

import { useDebounce } from "./useDebounce";

export function useThumbnailAutoScroll(
  itemRef: RefObject<HTMLElement | null>,
  pageIndex: number,
  currentPage: number,
): void {
  const debouncedCurrentPage = useDebounce(currentPage, 150);

  useEffect(() => {
    if (!itemRef.current) return;
    if (pageIndex !== debouncedCurrentPage) return;

    itemRef.current.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior: "smooth",
    });
  }, [itemRef, debouncedCurrentPage, pageIndex]);
}
