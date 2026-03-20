import { SelectionActionAddon } from "../SelectionActionAddon";

export interface RegionCaptureSelectionAddonProps {
  canCopy: boolean;
  canQuote: boolean;
  showQuote: boolean;
  onCancel: () => void;
  onCopy: () => void;
  onQuote: () => void;
}

export function RegionCaptureSelectionAddon({
  canCopy,
  canQuote,
  showQuote,
  onCancel,
  onCopy,
  onQuote,
}: RegionCaptureSelectionAddonProps) {
  return (
    <SelectionActionAddon
      className="region-capture-addon"
      canCopy={canCopy}
      canQuote={canQuote}
      showQuote={showQuote}
      showCancel
      onCancel={onCancel}
      onCopy={onCopy}
      onQuote={onQuote}
    />
  );
}
