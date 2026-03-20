import type { CSSProperties } from "react";

interface ZoomOutIconProps {
  style?: CSSProperties;
}

export function ZoomOutIcon({ style }: ZoomOutIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 15 15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden
    >
      <circle cx="6.5" cy="6.5" r="4" />
      <path d="m9.5 9.5 2.5 2.5M5 6.5h3" />
    </svg>
  );
}
