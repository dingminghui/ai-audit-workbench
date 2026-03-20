import type { HighlightPluginProps, RenderHighlightTargetProps } from "@react-pdf-viewer/highlight";
import { useCallback, useMemo } from "react";

import { SelectionActionAddon } from "../components/SelectionActionAddon";
import type { PdfTextSelectionPayload, PdfViewerTextSelection } from "../types";

export interface UseTextSelectionParams {
  textSelectionEnabled: boolean;
  textSelection?: PdfViewerTextSelection;
}

export interface UseTextSelectionReturn {
  textSelectionPluginProps?: HighlightPluginProps;
}

function buildTextSelectionPayload({
  selectedText,
  highlightAreas,
  selectionData,
  selectionRegion,
}: RenderHighlightTargetProps): PdfTextSelectionPayload {
  return {
    selectedText,
    highlightAreas,
    selectionData,
    selectionRegion,
  };
}

export function useTextSelection({
  textSelectionEnabled,
  textSelection,
}: UseTextSelectionParams): UseTextSelectionReturn {
  const handleCopy = useCallback(
    async (props: RenderHighlightTargetProps) => {
      const payload = buildTextSelectionPayload(props);

      if (textSelection?.copyToClipboard ?? true) {
        try {
          await navigator.clipboard.writeText(payload.selectedText);
        } catch (e) {
          console.warn("[TextSelection] 复制到剪贴板失败:", e);
        }
      }

      textSelection?.onCopy?.(payload.selectedText, payload);
      props.cancel();
    },
    [textSelection],
  );

  const handleQuote = useCallback(
    (props: RenderHighlightTargetProps) => {
      const payload = buildTextSelectionPayload(props);
      textSelection?.onSelectionExport?.(payload);
      props.cancel();
    },
    [textSelection],
  );

  const renderHighlightTarget = useCallback(
    (props: RenderHighlightTargetProps) => {
      if (!textSelectionEnabled) {
        return <></>;
      }

      if (props.selectedText.trim().length === 0) {
        return <></>;
      }

      const selectionRegion = props.selectionRegion;
      const showQuote = !!textSelection?.onSelectionExport;

      return (
        <div
          className="pdf-viewer-text-selection-target"
          style={{
            left: `${selectionRegion.left}%`,
            top: `${selectionRegion.top + selectionRegion.height}%`,
          }}
        >
          <SelectionActionAddon
            canCopy
            canQuote={showQuote}
            showQuote={showQuote}
            onCopy={() => {
              void handleCopy(props);
            }}
            onQuote={() => {
              handleQuote(props);
            }}
          />
        </div>
      );
    },
    [handleCopy, handleQuote, textSelection?.onSelectionExport, textSelectionEnabled],
  );

  const textSelectionPluginProps = useMemo<HighlightPluginProps | undefined>(() => {
    if (!textSelectionEnabled) {
      return undefined;
    }

    return { renderHighlightTarget };
  }, [textSelectionEnabled, renderHighlightTarget]);

  return { textSelectionPluginProps };
}
