import type { CSSProperties } from "react";

interface ThumbnailIconProps {
  style?: CSSProperties;
}

export function ThumbnailIcon({ style }: ThumbnailIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 1024 1024"
      fill="currentColor"
      style={style}
      aria-hidden
    >
      <path d="M412.27 216v196.27H216V216h196.27m24-56H192a32 32 0 0 0-32 32v244.27a32 32 0 0 0 32 32h244.27a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32zM808 216v196.27H611.73V216H808m24-56H587.73a32 32 0 0 0-32 32v244.27a32 32 0 0 0 32 32H832a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32zM412.27 611.73V808H216V611.73h196.27m24-56H192a32 32 0 0 0-32 32V832a32 32 0 0 0 32 32h244.27a32 32 0 0 0 32-32V587.73a32 32 0 0 0-32-32zm371.73 56V808H611.73V611.73H808m24-56H587.73a32 32 0 0 0-32 32V832a32 32 0 0 0 32 32H832a32 32 0 0 0 32-32V587.73a32 32 0 0 0-32-32z" />
    </svg>
  );
}
