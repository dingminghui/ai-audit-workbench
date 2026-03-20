import type {
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react";
import { forwardRef } from "react";

import "./PreviewLayout.css";

export type PreviewLayoutProps = ComponentPropsWithoutRef<"div">;

interface PreviewLayoutComponent {
  (props: PreviewLayoutProps): React.JSX.Element;
  Header: (props: { children: ReactNode }) => React.JSX.Element;
  HeaderSpace: (props: { children: ReactNode }) => React.JSX.Element;
  HeaderLeft: (props: { children: ReactNode }) => React.JSX.Element;
  HeaderRight: (props: { children: ReactNode }) => React.JSX.Element;
  Main: (props: { children: ReactNode }) => React.JSX.Element;
  Content: ForwardRefExoticComponent<{ children: ReactNode } & RefAttributes<HTMLDivElement>>;
}

export const PreviewLayout: PreviewLayoutComponent = Object.assign(
  function PreviewLayout({ children, className, ...rest }: PreviewLayoutProps) {
    return (
      <div className={["pdf-viewer-layout", className].filter(Boolean).join(" ")} {...rest}>
        {children}
      </div>
    );
  },
  {
    Header({ children }: { children: ReactNode }) {
      return <header className="pdf-viewer-layout-header">{children}</header>;
    },
    HeaderSpace({ children }: { children: ReactNode }) {
      return <div className="pdf-viewer-layout-header-space">{children}</div>;
    },
    HeaderLeft({ children }: { children: ReactNode }) {
      return <div className="pdf-viewer-layout-header-left">{children}</div>;
    },
    HeaderRight({ children }: { children: ReactNode }) {
      return <div className="pdf-viewer-layout-header-right">{children}</div>;
    },
    Main({ children }: { children: ReactNode }) {
      return <main className="pdf-viewer-layout-main">{children}</main>;
    },
    Content: forwardRef<HTMLDivElement, { children: ReactNode }>(function Content(
      { children },
      ref,
    ) {
      return (
        <div ref={ref} className="pdf-viewer-layout-content">
          {children}
        </div>
      );
    }),
  },
);
