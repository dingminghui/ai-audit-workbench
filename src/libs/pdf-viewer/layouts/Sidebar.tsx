import type { ComponentPropsWithoutRef } from "react";

import "./Sidebar.css";

export type SidebarProps = ComponentPropsWithoutRef<"aside">;

export function Sidebar({ children, className, ...rest }: SidebarProps) {
  return (
    <aside className={["pdf-viewer-sidebar", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </aside>
  );
}
