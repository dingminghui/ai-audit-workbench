import { useElementSize } from "@/libs/pdf-viewer/hooks/useElementSize";
import { hexToRgba } from "@/libs/pdf-viewer/utils/hexToRgba";
import { FitIcon, MinusIcon, PlusIcon } from "@/pages/home/components/HomeIcons";
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
    <section className="audit-panel flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-[32px]">
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
          {({ setTransform, zoomIn, zoomOut }) => (
            <>
              <header className="border-b border-white/60 px-4 py-3 sm:px-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="audit-kicker text-[color:var(--color-muted)]">核查画布</p>
                    <div className="mt-1.5 flex min-w-0 items-center gap-2">
                      <h2 className="truncate text-[15px] font-semibold text-slate-900">
                        {material.name}
                      </h2>
                      {previewMeta ? (
                        <span
                          className={cx(
                            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
                            previewMeta.badgeClassName,
                          )}
                        >
                          {previewMeta.shortLabel}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 text-slate-600">
                    <HeaderIconButton label="缩小图片" onClick={() => zoomOut(0.16)}>
                      <MinusIcon />
                    </HeaderIconButton>
                    <HeaderIconButton label="放大图片" onClick={() => zoomIn(0.16)}>
                      <PlusIcon />
                    </HeaderIconButton>
                    <HeaderIconButton
                      label="适应画布"
                      onClick={() =>
                        setTransform(
                          fitTransform.positionX,
                          fitTransform.positionY,
                          fitTransform.scale,
                          220,
                        )
                      }
                    >
                      <FitIcon />
                    </HeaderIconButton>
                  </div>
                </div>
              </header>

              <div className="flex h-0 min-h-0 flex-1 flex-col bg-[linear-gradient(180deg,rgba(229,238,243,0.44)_0%,rgba(243,247,249,0.12)_100%)] p-3">
                <div
                  ref={viewportRef}
                  className="relative flex h-full min-h-0 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(31,122,140,0.18),transparent_24%),linear-gradient(180deg,rgba(226,235,240,0.86)_0%,rgba(241,245,247,0.94)_32%,rgba(236,241,243,0.86)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
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
          <header className="border-b border-white/60 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="audit-kicker text-[color:var(--color-muted)]">核查画布</p>
              <p className="mt-1.5 text-[13px] text-slate-500">
                先从左侧选择素材，再进行预览与核查。
              </p>
            </div>

            <div className="mt-3 flex items-center gap-2 text-slate-400">
              <HeaderIconButton disabled label="缩小图片" onClick={() => undefined}>
                <MinusIcon />
              </HeaderIconButton>
              <HeaderIconButton disabled label="放大图片" onClick={() => undefined}>
                <PlusIcon />
              </HeaderIconButton>
              <HeaderIconButton disabled label="适应画布" onClick={() => undefined}>
                <FitIcon />
              </HeaderIconButton>
            </div>
          </header>

          <div className="flex h-0 min-h-0 flex-1 flex-col p-3">
            <div className="flex h-full min-h-0 min-w-0 flex-1 items-center justify-center rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(240,244,246,0.9)_100%)] px-6 text-center text-[13px] leading-6 text-slate-500 shadow-[0_18px_34px_rgba(15,34,51,0.08)]">
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
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#05111c] shadow-[0_28px_70px_rgba(8,18,30,0.34)]"
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

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,28,0.04)_0%,rgba(6,17,28,0.32)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_42%)]" />

      {showHighlights && previewItem.highlightRegions.length > 0 && previewMeta ? (
        <svg
          aria-hidden="true"
          className="absolute inset-0"
          viewBox={`0 0 ${material.sourceSize.width} ${material.sourceSize.height}`}
        >
          {previewItem.highlightRegions.map((region, index) => (
            <g key={`${previewItem.row}-${index}-${region.x}-${region.y}`}>
              <rect
                fill={hexToRgba(previewMeta.accentColor, 0.12)}
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
                height="32"
                rx="12"
                width="104"
                x={region.x}
                y={Math.max(region.y - 36, 12)}
              />
              <text
                fill="white"
                fontFamily="IBM Plex Mono, SFMono-Regular, monospace"
                fontSize="12"
                fontWeight="700"
                x={region.x + 10}
                y={Math.max(region.y - 16, 30)}
              >
                {`标记 ${String(index + 1).padStart(2, "0")}`}
              </text>
            </g>
          ))}
        </svg>
      ) : null}

      <div className="pointer-events-none absolute inset-x-6 bottom-6 flex items-center justify-between gap-4 text-[11px] text-white/78">
        <span className="line-clamp-1 rounded-full border border-white/15 bg-white/8 px-4 py-2 backdrop-blur-sm">
          当前检查点聚焦中
        </span>
        <span className="shrink-0 rounded-full border border-white/15 bg-white/8 px-4 py-2 font-mono backdrop-blur-sm">
          第 {String(previewItem.row).padStart(2, "0")} 行
        </span>
      </div>
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
        "rounded-2xl border border-white/60 bg-white/55 p-2.5 text-slate-600 shadow-[0_10px_22px_rgba(15,34,51,0.06)] transition",
        disabled
          ? "cursor-not-allowed text-slate-300"
          : "hover:-translate-y-0.5 hover:bg-white/80 hover:text-slate-900",
      )}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}
