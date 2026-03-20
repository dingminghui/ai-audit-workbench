import type { CSSProperties } from "react";

interface SidebarIconProps {
  style?: CSSProperties;
}

export function SidebarIcon({ style }: SidebarIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      aria-hidden
    >
      <path
        d="M9 5h12v14H9zM7 5H3v3.5h4zm-4 8.5v-3h4v3zm0 2V19h4v-3.5zM1 5a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
}
