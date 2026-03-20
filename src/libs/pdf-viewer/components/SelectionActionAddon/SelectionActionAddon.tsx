import { CloseIcon } from "../../icons/CloseIcon";
import { CopyIcon } from "../../icons/CopyIcon";
import { QuoteIcon } from "../../icons/QuoteIcon";
import {
  HeaderControlButton,
  HeaderControlDivider,
  HeaderControlGroup,
  HeaderControlIcon,
  HeaderControls,
} from "../../ui/HeaderControls";

export interface SelectionActionAddonProps {
  canCopy: boolean;
  canQuote: boolean;
  showQuote: boolean;
  showCancel?: boolean;
  className?: string;
  onCancel?: () => void;
  onCopy: () => void;
  onQuote: () => void;
}

export function SelectionActionAddon({
  canCopy,
  canQuote,
  showQuote,
  showCancel = false,
  className,
  onCancel,
  onCopy,
  onQuote,
}: SelectionActionAddonProps) {
  const shouldShowCancel = showCancel && !!onCancel;

  return (
    <div className={["pdf-viewer-selection-addon", className].filter(Boolean).join(" ")}>
      <HeaderControls>
        <HeaderControlGroup className="pdf-viewer-selection-addon-group">
          {shouldShowCancel ? (
            <>
              <HeaderControlButton
                className="pdf-viewer-selection-cancel-btn"
                onClick={onCancel}
                aria-label="取消"
              >
                <HeaderControlIcon>
                  <CloseIcon />
                </HeaderControlIcon>
              </HeaderControlButton>
              <HeaderControlDivider className="pdf-viewer-selection-addon-divider" />
            </>
          ) : null}
          <HeaderControlButton
            kind="text"
            className="pdf-viewer-selection-copy-btn"
            onClick={onCopy}
            disabled={!canCopy}
            aria-label="复制"
            title="复制"
          >
            <HeaderControlIcon>
              <CopyIcon />
            </HeaderControlIcon>
            <span>复制</span>
          </HeaderControlButton>
          {showQuote ? (
            <HeaderControlButton
              kind="text"
              className="pdf-viewer-selection-quote-btn"
              onClick={onQuote}
              disabled={!canQuote}
              aria-label="引用"
              title="引用"
            >
              <HeaderControlIcon>
                <QuoteIcon />
              </HeaderControlIcon>
              <span>引用</span>
            </HeaderControlButton>
          ) : null}
        </HeaderControlGroup>
      </HeaderControls>
    </div>
  );
}
