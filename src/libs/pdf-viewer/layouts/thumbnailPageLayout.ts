import type { PageLayout } from "@react-pdf-viewer/core";

export const thumbnailPageLayout: PageLayout = {
  buildPageStyles: () => ({
    padding: "10px 6px",
    margin: 0,
    background: "#f3f4f6",
  }),
  transformSize: ({ size }) => ({
    ...size,
    height: size.height + 20,
  }),
};
