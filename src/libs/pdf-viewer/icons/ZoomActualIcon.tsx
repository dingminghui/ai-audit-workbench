import type { CSSProperties } from "react";

interface ZoomActualIconProps {
  style?: CSSProperties;
}

export function ZoomActualIcon({ style }: ZoomActualIconProps) {
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
      <rect x="2" y="2" width="11" height="11" strokeDasharray="2 2" />
      <rect x="5" y="5" width="5" height="5" fill="currentColor" stroke="none" />
    </svg>
  );
}
