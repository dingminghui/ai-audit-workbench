import type {
  ButtonHTMLAttributes,
  ComponentPropsWithoutRef,
  CSSProperties,
  ReactNode,
} from "react";
import { forwardRef } from "react";

import { useThemeColor } from "../../PdfViewerContext";

import "../../styles/headerControls.css";

export type HeaderControlsProps = ComponentPropsWithoutRef<"div">;

export function HeaderControls({ className, children, ...rest }: HeaderControlsProps) {
  return (
    <div
      data-pdf-viewer-controls
      {...rest}
      className={["pdf-viewer-controls", className].filter(Boolean).join(" ")}
    >
      {children}
    </div>
  );
}

export type HeaderControlGroupProps = ComponentPropsWithoutRef<"div">;

export function HeaderControlGroup({ className, children, ...rest }: HeaderControlGroupProps) {
  return (
    <div {...rest} className={["pdf-viewer-control-group", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

export type HeaderControlDividerProps = ComponentPropsWithoutRef<"span">;

export function HeaderControlDivider({ className, ...rest }: HeaderControlDividerProps) {
  return (
    <span
      aria-hidden
      {...rest}
      className={["pdf-viewer-control-divider", className].filter(Boolean).join(" ")}
    />
  );
}

export interface HeaderControlButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  isActive?: boolean;
  size?: "md" | "sm";
  kind?: "icon" | "text";
}

export const HeaderControlButton = forwardRef<HTMLButtonElement, HeaderControlButtonProps>(
  function HeaderControlButton(
    { isActive = false, size = "md", kind = "icon", className, style, children, ...rest },
    ref,
  ) {
    const themeColor = useThemeColor();
    const activeStyle = isActive
      ? ({ "--pdf-viewer-active-color": themeColor, ...style } as CSSProperties)
      : style;

    return (
      <button
        ref={ref}
        type="button"
        {...rest}
        className={[
          "pdf-viewer-control-button",
          size === "sm" ? "pdf-viewer-control-button--sm" : "",
          kind === "text" ? "pdf-viewer-control-button--text" : "",
          isActive ? "pdf-viewer-control-button--active" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={activeStyle}
      >
        {children}
      </button>
    );
  },
);

export interface HeaderControlIconProps {
  children: ReactNode;
}

export function HeaderControlIcon({ children }: HeaderControlIconProps) {
  return <span className="pdf-viewer-control-icon">{children}</span>;
}
