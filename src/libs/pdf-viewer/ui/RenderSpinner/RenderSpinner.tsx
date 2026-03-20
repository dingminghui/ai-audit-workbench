import { LoadingIcon } from "../../icons/LoadingIcon";

import "./RenderSpinner.css";

export function RenderSpinner() {
  return (
    <div className="pdf-viewer-spinner">
      <LoadingIcon className="pdf-viewer-spinner-icon" />
    </div>
  );
}
