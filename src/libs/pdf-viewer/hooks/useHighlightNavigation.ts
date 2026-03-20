import { useCallback, useEffect, useMemo, useRef } from "react";

import type { PdfHighlightItem, PdfHighlightPosition } from "../types";
import { isValidHighlightPosition } from "../utils/highlightUtils";

const SCROLL_RETRY_LIMIT = 16;
const SCROLL_RETRY_DELAY_MS = 80;

export interface UseHighlightNavigationParams {
  activeHighlightId?: string | null;
  fileUrl: string;
  highlights: PdfHighlightItem[];
  jumpToPosition?: (position: PdfHighlightPosition) => Promise<boolean>;
}

export interface UseHighlightNavigationReturn {
  scrollToHighlight: (chunkId: string) => Promise<boolean>;
}

function resolveHighlightAnchorPosition(
  highlights: PdfHighlightItem[],
): Map<string, PdfHighlightPosition> {
  return new Map(
    highlights.flatMap((highlight) => {
      const anchorPosition = highlight.positions.find(isValidHighlightPosition);
      return anchorPosition ? [[highlight.chunk_id, anchorPosition] as const] : [];
    }),
  );
}

export function useHighlightNavigation({
  activeHighlightId,
  fileUrl,
  highlights,
  jumpToPosition,
}: UseHighlightNavigationParams): UseHighlightNavigationReturn {
  const highlightAnchorMap = useMemo(
    () => resolveHighlightAnchorPosition(highlights),
    [highlights],
  );
  const highlightAnchorMapRef = useRef(highlightAnchorMap);
  const jumpToPositionRef = useRef(jumpToPosition);
  const scrollRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrollRequestIdRef = useRef(0);
  const pendingScrollResolveRef = useRef<((value: boolean) => void) | null>(null);
  const lastScrollAttemptKeyRef = useRef<string | null>(null);

  highlightAnchorMapRef.current = highlightAnchorMap;
  jumpToPositionRef.current = jumpToPosition;

  const clearScrollRetryTimer = useCallback(() => {
    if (scrollRetryTimerRef.current !== null) {
      clearTimeout(scrollRetryTimerRef.current);
      scrollRetryTimerRef.current = null;
    }
  }, []);

  const finishPendingScroll = useCallback(
    (result: boolean) => {
      clearScrollRetryTimer();
      const resolve = pendingScrollResolveRef.current;
      pendingScrollResolveRef.current = null;
      resolve?.(result);
    },
    [clearScrollRetryTimer],
  );

  const cancelPendingScroll = useCallback(() => {
    scrollRequestIdRef.current += 1;
    finishPendingScroll(false);
  }, [finishPendingScroll]);

  const scrollToHighlight = useCallback(
    (chunkId: string): Promise<boolean> => {
      const anchorPosition = highlightAnchorMapRef.current.get(chunkId);
      const jump = jumpToPositionRef.current;
      if (!anchorPosition || !jump) {
        return Promise.resolve(false);
      }

      scrollRequestIdRef.current += 1;
      const requestId = scrollRequestIdRef.current;
      finishPendingScroll(false);

      return new Promise<boolean>((resolve) => {
        pendingScrollResolveRef.current = resolve;
        let attempts = 0;

        const tryJump = async () => {
          if (requestId !== scrollRequestIdRef.current) {
            return;
          }

          attempts += 1;
          const success = await jump(anchorPosition);

          if (requestId !== scrollRequestIdRef.current) {
            return;
          }

          if (success) {
            finishPendingScroll(true);
            return;
          }

          if (attempts < SCROLL_RETRY_LIMIT) {
            scrollRetryTimerRef.current = setTimeout(() => {
              void tryJump();
            }, SCROLL_RETRY_DELAY_MS);
            return;
          }

          finishPendingScroll(false);
        };

        void tryJump();
      });
    },
    [finishPendingScroll],
  );

  useEffect(
    () => () => {
      cancelPendingScroll();
    },
    [cancelPendingScroll],
  );

  useEffect(() => {
    cancelPendingScroll();
  }, [fileUrl, cancelPendingScroll]);

  useEffect(() => {
    if (activeHighlightId == null) {
      lastScrollAttemptKeyRef.current = null;
      return;
    }

    const anchorPosition = highlightAnchorMap.get(activeHighlightId);
    const anchorKey = anchorPosition
      ? `${anchorPosition.page_number}:${anchorPosition.x1}:${anchorPosition.y1}:${anchorPosition.x2}:${anchorPosition.y2}`
      : "missing-anchor";
    const jumpReady = jumpToPosition ? "jump-ready" : "jump-missing";
    const attemptKey = `${fileUrl}:${activeHighlightId}:${anchorKey}:${jumpReady}`;

    if (lastScrollAttemptKeyRef.current === attemptKey) {
      return;
    }

    lastScrollAttemptKeyRef.current = attemptKey;

    if (!anchorPosition || !jumpToPosition) {
      return;
    }

    void scrollToHighlight(activeHighlightId);
  }, [activeHighlightId, fileUrl, highlightAnchorMap, jumpToPosition, scrollToHighlight]);

  return { scrollToHighlight };
}
