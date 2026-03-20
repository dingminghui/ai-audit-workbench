import type { CSSProperties } from "react";

interface ZoomFitIconProps {
  style?: CSSProperties;
}

export function ZoomFitIcon({ style }: ZoomFitIconProps) {
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
      strokeLinejoin="round"
      style={style}
      aria-hidden
    >
      <rect x="3" y="3" width="9" height="9" rx="1" />
      <path d="M3 6V3h3M12 6V3H9M3 9v3h3M12 9v3H9" />
    </svg>
  );
}
