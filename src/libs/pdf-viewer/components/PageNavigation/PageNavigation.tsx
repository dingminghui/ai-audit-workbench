import type { ComponentPropsWithoutRef, ReactElement } from "react";

import "./PageNavigation.css";

export interface PageNavigationProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  CurrentPageInput: ReactElement;
  NumberOfPages: ReactElement;
}

export function PageNavigation({
  CurrentPageInput,
  NumberOfPages,
  className,
  style,
  ...rest
}: PageNavigationProps) {
  return (
    <div
      data-pdf-viewer-page-nav
      {...rest}
      className={["pdf-viewer-page-nav", className].filter(Boolean).join(" ")}
      style={style}
      aria-label="页码导航"
    >
      <div className="pdf-viewer-page-nav-input-wrapper">{CurrentPageInput}</div>
      <span className="pdf-viewer-page-nav-separator">/</span>
      <div className="pdf-viewer-page-nav-total">{NumberOfPages}</div>
    </div>
  );
}
