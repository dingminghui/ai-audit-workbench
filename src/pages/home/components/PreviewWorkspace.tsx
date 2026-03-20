import { useElementSize } from "@/libs/pdf-viewer/hooks/useElementSize";
import { hexToRgba } from "@/libs/pdf-viewer/utils/hexToRgba";
import {
  MinusIcon,
  PlusIcon,
} from "@/pages/home/components/HomeIcons";
import { resultMeta } from "@/pages/home/homeData";
import { cx, getFitTransform } from "@/pages/home/homeUtils";
import type { AuditItem, MaterialViewModel } from "@/pages/home/types";
import type { ReactNode } from "react";
import { useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

interface PreviewWorkspaceProps {
  material: MaterialViewModel | null;
  previewItem: AuditItem | null;
}

export function PreviewWorkspace({ material, previewItem }: PreviewWorkspaceProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const viewportSize = useElementSize(viewportRef);
  const showHighlights = true;
  const enhancedView = false;

  const fitTransform = material
    ? getFitTransform(
        material.sourceSize.width,
        material.sourceSize.height,
        viewportSize.width,
        viewportSize.height,
      )
    : { positionX: 0, positionY: 0, scale: 1 };

  const previewMeta = previewItem ? resultMeta[previewItem.result] : null;

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[28px] bg-white/84 shadow-[0_20px_44px_rgba(15,23,42,0.09)] backdrop-blur-sm">
      {material && previewItem ? (
        <TransformWrapper
          key={`${material.id}-${Math.round(viewportSize.width)}-${Math.round(viewportSize.height)}`}
          disablePadding
          doubleClick={{ disabled: true }}
          initialPositionX={fitTransform.positionX}
          initialPositionY={fitTransform.positionY}
          initialScale={fitTransform.scale}
          limitToBounds
          maxScale={4}
          minScale={Math.min(fitTransform.scale, 1) * 0.75}
          panning={{ allowLeftClickPan: true }}
          wheel={{ step: 0.12 }}
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[12px] text-slate-500">
                    <h2 className="truncate font-semibold text-slate-800">核查工作台</h2>
                    <span className="text-slate-300">/</span>
                    <span className="truncate text-[12px] font-medium text-slate-500">
                      {material.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500">
                  <HeaderIconButton label="缩小图片" onClick={() => zoomOut(0.16)}>
                    <MinusIcon />
                  </HeaderIconButton>
                  <HeaderIconButton label="放大图片" onClick={() => zoomIn(0.16)}>
                    <PlusIcon />
                  </HeaderIconButton>
                </div>
              </header>

              <div className="flex h-0 min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,#f1f7fe_0%,#f8fbff_100%)]">
                <div
                  ref={viewportRef}
                  className="relative flex h-full min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(24,144,255,0.12),transparent_26%),linear-gradient(180deg,#edf6ff_0%,#f7fbff_28%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
                >
                  <TransformComponent
                    contentStyle={{
                      width: `${material.sourceSize.width}px`,
                      height: `${material.sourceSize.height}px`,
                    }}
                    wrapperStyle={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <PreviewCanvas
                      enhancedView={enhancedView}
                      material={material}
                      previewItem={previewItem}
                      previewMeta={previewMeta}
                      showHighlights={showHighlights}
                    />
                  </TransformComponent>
                </div>
              </div>
            </>
          )}
        </TransformWrapper>
      ) : (
        <>
          <header className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <h2 className="truncate font-semibold text-slate-800">核查工作台</h2>
                <span className="text-slate-300">/</span>
                <span className="truncate text-[12px] font-medium text-slate-500">未选择任务</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <HeaderIconButton disabled label="缩小图片" onClick={() => undefined}>
                <MinusIcon />
              </HeaderIconButton>
              <HeaderIconButton disabled label="放大图片" onClick={() => undefined}>
                <PlusIcon />
              </HeaderIconButton>
            </div>
          </header>

          <div className="flex h-0 min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,#f1f7fe_0%,#f8fbff_100%)]">
          <div className="flex h-full min-h-0 min-w-0 flex-1 items-center justify-center rounded-[24px] bg-white/92 shadow-[0_14px_28px_rgba(15,23,42,0.07)] text-[13px] text-slate-500">
            当前没有可预览的核查任务
          </div>
          </div>
        </>
      )}
    </section>
  );
}

function PreviewCanvas({
  enhancedView,
  material,
  previewItem,
  previewMeta,
  showHighlights,
}: {
  enhancedView: boolean;
  material: MaterialViewModel;
  previewItem: AuditItem;
  previewMeta: (typeof resultMeta)[keyof typeof resultMeta] | null;
  showHighlights: boolean;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[24px] bg-[#04070c] shadow-[0_22px_50px_rgba(15,23,42,0.24)]"
      style={{
        width: material.sourceSize.width,
        height: material.sourceSize.height,
      }}
    >
      <img
        alt={material.name}
        className={cx(
          "h-full w-full object-cover transition duration-300",
          enhancedView ? "brightness-[1.06] contrast-[1.08] saturate-[1.05]" : "",
        )}
        draggable={false}
        src={material.imageUrl}
      />

      {showHighlights && previewItem.highlightRegions.length > 0 && previewMeta ? (
        <svg
          aria-hidden="true"
          className="absolute inset-0"
          viewBox={`0 0 ${material.sourceSize.width} ${material.sourceSize.height}`}
        >
          {previewItem.highlightRegions.map((region, index) => (
            <g key={`${previewItem.row}-${index}-${region.x}-${region.y}`}>
              <rect
                fill={hexToRgba(previewMeta.accentColor, 0.1)}
                height={region.height}
                rx="16"
                stroke={previewMeta.accentColor}
                strokeWidth="4"
                width={region.width}
                x={region.x}
                y={region.y}
              />
              <rect
                fill={previewMeta.accentColor}
                height="30"
                rx="10"
                width={Math.min(Math.max(previewItem.checkpoint.length * 14, 88), 240)}
                x={region.x}
                y={Math.max(region.y - 36, 12)}
              />
              <text
                fill="white"
                fontFamily="ui-monospace, SFMono-Regular, monospace"
                fontSize="12"
                fontWeight="700"
                x={region.x + 10}
                y={Math.max(region.y - 16, 30)}
              >
                {`ERR_${String(index + 1).padStart(2, "0")}`}
              </text>
            </g>
          ))}
        </svg>
      ) : null}
    </div>
  );
}

function HeaderIconButton({
  children,
  disabled,
  label,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      className={cx(
        "rounded-xl p-2 transition",
        disabled
          ? "cursor-not-allowed text-slate-300"
          : "hover:bg-white/70 hover:text-slate-700",
      )}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
