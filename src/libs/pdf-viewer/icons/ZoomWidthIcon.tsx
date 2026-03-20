import type { CSSProperties } from "react";

interface ZoomWidthIconProps {
  style?: CSSProperties;
}

export function ZoomWidthIcon({ style }: ZoomWidthIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 15 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={style}
      aria-hidden
    >
      <line x1="3" y1="3" x2="3" y2="12" strokeDasharray="2 2" />
      <line x1="12" y1="3" x2="12" y2="12" strokeDasharray="2 2" />
      <line x1="3" y1="7.5" x2="12" y2="7.5" />
    </svg>
  );
}
