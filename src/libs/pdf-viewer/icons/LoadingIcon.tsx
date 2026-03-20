import type { CSSProperties } from "react";

export interface LoadingIconProps {
  className?: string;
  style?: CSSProperties;
}

export function LoadingIcon({ className, style }: LoadingIconProps) {
  return (
    <svg viewBox="0 0 50 50" className={className} style={style} aria-hidden>
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 150"
        strokeDashoffset="0"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 25 25"
          to="360 25 25"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
