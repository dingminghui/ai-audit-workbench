import type { ComponentPropsWithoutRef } from "react";

import { SidebarIcon } from "../../icons/SidebarIcon";
import { HeaderControlButton, HeaderControlIcon, HeaderControls } from "../../ui/HeaderControls";

export interface SidebarToggleProps extends Omit<ComponentPropsWithoutRef<"button">, "onClick"> {
  isSidebarOpen: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ isSidebarOpen, onToggle, className, ...rest }: SidebarToggleProps) {
  return (
    <HeaderControls>
      <HeaderControlButton
        {...rest}
        size="sm"
        isActive={isSidebarOpen}
        className={className}
        onClick={onToggle}
        aria-label={isSidebarOpen ? "收起侧边栏" : "展开侧边栏"}
      >
        <HeaderControlIcon>
          <SidebarIcon />
        </HeaderControlIcon>
      </HeaderControlButton>
    </HeaderControls>
  );
}
