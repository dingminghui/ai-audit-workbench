import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { ZoomPlugin } from "@react-pdf-viewer/zoom";
import type { CSSProperties } from "react";

import { useThemeColor } from "../../PdfViewerContext";
import { ZoomInIcon } from "../../icons/ZoomInIcon";
import { ZoomOutIcon } from "../../icons/ZoomOutIcon";
import {
  HeaderControlButton,
  HeaderControlDivider,
  HeaderControlGroup,
  HeaderControlIcon,
  HeaderControls,
} from "../../ui/HeaderControls";
import { useZoomLevel } from "./useZoomLevel";
import { getZoomLevelOption, ZOOM_LEVEL_OPTIONS } from "./zoomLevelOptions";

import { ZoomFitIcon } from "../../icons/ZoomFitIcon";
import "./ZoomControls.css";

export interface ZoomControlsProps {
  Zoom: ZoomPlugin["Zoom"];
  ZoomIn: ZoomPlugin["ZoomIn"];
  ZoomOut: ZoomPlugin["ZoomOut"];
  defaultScale?: number | import("@react-pdf-viewer/core").SpecialZoomLevel;
}

export function ZoomControls({ Zoom, ZoomIn, ZoomOut, defaultScale }: ZoomControlsProps) {
  const themeColor = useThemeColor();
  const { selectedLevel, clearSelectedLevel, selectLevel } = useZoomLevel(defaultScale);

  const currentOption = getZoomLevelOption(selectedLevel);
  const TriggerIcon = currentOption ? currentOption.Icon : ZoomFitIcon;

  return (
    <Zoom>
      {(zoomProps) => (
        <DropdownMenu.Root>
          <HeaderControls className="pdf-viewer-zoom-controls" aria-label="缩放控制">
            <HeaderControlGroup>
              <DropdownMenu.Trigger asChild>
                <HeaderControlButton isActive={!!currentOption} aria-label="缩放级别">
                  <HeaderControlIcon>
                    <TriggerIcon />
                  </HeaderControlIcon>
                </HeaderControlButton>
              </DropdownMenu.Trigger>
              <HeaderControlDivider />
              <ZoomOut>
                {(zoomOutProps) => (
                  <HeaderControlButton
                    onClick={() => {
                      clearSelectedLevel();
                      zoomOutProps.onClick();
                    }}
                    aria-label="缩小"
                  >
                    <HeaderControlIcon>
                      <ZoomOutIcon />
                    </HeaderControlIcon>
                  </HeaderControlButton>
                )}
              </ZoomOut>
              <HeaderControlDivider />
              <ZoomIn>
                {(zoomInProps) => (
                  <HeaderControlButton
                    onClick={() => {
                      clearSelectedLevel();
                      zoomInProps.onClick();
                    }}
                    aria-label="放大"
                  >
                    <HeaderControlIcon>
                      <ZoomInIcon />
                    </HeaderControlIcon>
                  </HeaderControlButton>
                )}
              </ZoomIn>
            </HeaderControlGroup>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="pdf-viewer-zoom-controls-menu"
                sideOffset={4}
                align="end"
                side="bottom"
              >
                {ZOOM_LEVEL_OPTIONS.map((opt) => {
                  const Icon = opt.Icon;
                  const isSelected = selectedLevel === opt.value;
                  return (
                    <DropdownMenu.Item
                      key={opt.value}
                      className={`pdf-viewer-zoom-controls-menu-item ${isSelected ? "pdf-viewer-zoom-controls-menu-item--selected" : ""}`}
                      style={
                        isSelected
                          ? ({ "--pdf-viewer-active-color": themeColor } as CSSProperties)
                          : undefined
                      }
                      onSelect={() => {
                        selectLevel(opt.value);
                        zoomProps.onZoom(opt.value);
                      }}
                      textValue={opt.label}
                    >
                      <span
                        className={`pdf-viewer-zoom-controls-menu-icon ${isSelected ? "pdf-viewer-zoom-controls-menu-icon--selected" : ""}`}
                      >
                        <Icon />
                      </span>
                      <span>{opt.label}</span>
                    </DropdownMenu.Item>
                  );
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </HeaderControls>
        </DropdownMenu.Root>
      )}
    </Zoom>
  );
}
