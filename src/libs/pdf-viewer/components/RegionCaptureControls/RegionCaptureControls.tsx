import { CaptureIcon } from "../../icons/CaptureIcon";
import {
  HeaderControlButton,
  HeaderControlGroup,
  HeaderControlIcon,
  HeaderControls,
} from "../../ui/HeaderControls";

export interface RegionCaptureControlsProps {
  isActive: boolean;
  onToggle: () => void;
}

export function RegionCaptureControls({ isActive, onToggle }: RegionCaptureControlsProps) {
  return (
    <HeaderControls>
      <HeaderControlGroup>
        <HeaderControlButton
          isActive={isActive}
          onClick={onToggle}
          aria-label={isActive ? "退出区域截图" : "区域截图"}
        >
          <HeaderControlIcon>
            <CaptureIcon />
          </HeaderControlIcon>
        </HeaderControlButton>
      </HeaderControlGroup>
    </HeaderControls>
  );
}
