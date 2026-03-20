import type { GetFilePlugin, RenderDownloadProps } from "@react-pdf-viewer/get-file";

import { DownloadIcon } from "../../icons/DownloadIcon";
import { HeaderControlButton, HeaderControlIcon, HeaderControls } from "../../ui/HeaderControls";

export interface DownloadControlsProps {
  Download: GetFilePlugin["Download"];
}

export function DownloadControls({ Download }: DownloadControlsProps) {
  return (
    <Download>
      {(props: RenderDownloadProps) => (
        <HeaderControls>
          <HeaderControlButton onClick={props.onClick} aria-label="下载 PDF">
            <HeaderControlIcon>
              <DownloadIcon />
            </HeaderControlIcon>
          </HeaderControlButton>
        </HeaderControls>
      )}
    </Download>
  );
}
