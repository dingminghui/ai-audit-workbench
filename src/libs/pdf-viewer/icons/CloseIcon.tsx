import type { CSSProperties } from "react";

interface CloseIconProps {
  style?: CSSProperties;
}

export function CloseIcon({ style }: CloseIconProps) {
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
        fill="currentColor"
        d="M20.307 20.307a.997.997 0 0 0 .003-1.412l-6.845-6.844 6.845-6.845a.997.997 0 0 0-.003-1.412.997.997 0 0 0-1.412-.002l-6.844 6.844-6.845-6.845a.997.997 0 0 0-1.412.003.997.997 0 0 0-.002 1.412l6.844 6.844-6.845 6.845a.997.997 0 0 0 .003 1.412.997.997 0 0 0 1.412.003l6.844-6.845 6.845 6.845a.997.997 0 0 0 1.412-.003"
      />
    </svg>
  );
}
