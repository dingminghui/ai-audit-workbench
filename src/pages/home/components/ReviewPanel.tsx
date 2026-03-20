import { MarkdownPreview } from "@/pages/home/components/MarkdownPreview";
import { filterOptions, resultMeta } from "@/pages/home/homeData";
import { cx } from "@/pages/home/homeUtils";
import type { AuditItem, MaterialViewModel, ResultFilter } from "@/pages/home/types";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type AuditDecision = "confirm" | "cancel";

interface ReviewPanelProps {
  filteredAuditItems: AuditItem[];
  filter: ResultFilter;
  selectedAuditDecision: AuditDecision | null;
  selectedAuditItem: AuditItem | null;
  selectedMaterial: MaterialViewModel | null;
  onFilterChange: (filter: ResultFilter) => void;
  onSelectAuditDecision: (decision: AuditDecision) => void;
  onSelectAuditRow: (row: number) => void;
}

export function ReviewPanel({
  filteredAuditItems,
  filter,
  selectedAuditDecision,
  selectedAuditItem,
  selectedMaterial,
  onFilterChange,
  onSelectAuditDecision,
  onSelectAuditRow,
}: ReviewPanelProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col overflow-hidden rounded-[28px] bg-white/84 shadow-[0_20px_44px_rgba(15,23,42,0.09)] backdrop-blur-sm xl:w-[360px]">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-slate-700 uppercase">
              素材审核概览
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              {selectedMaterial ? `${selectedMaterial.name} · ${selectedMaterial.auditItems.length} 项` : "暂无数据"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          {filterOptions.map((option) => {
            const isActive = option.value === filter;
            return (
              <button
                key={option.value}
                aria-label={`筛选：${option.label}`}
                aria-pressed={isActive}
                className={cx(
                  "rounded-lg px-3 py-2 text-[11px] font-semibold transition",
                  isActive
                    ? "bg-slate-900 text-white shadow-[0_8px_16px_rgba(15,23,42,0.16)]"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                )}
                type="button"
                onClick={() => onFilterChange(option.value)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col bg-white/88">
        <div className="flex-1 space-y-3 overflow-y-auto p-3">
          {filteredAuditItems.length === 0 ? (
            <div className="rounded-2xl bg-white px-4 py-10 text-center text-[12px] text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)]">
              当前筛选条件下没有审核项
            </div>
          ) : null}

          {filteredAuditItems.map((item) => (
            <ReviewAuditCard
              key={item.row}
              decision={selectedAuditItem?.row === item.row ? selectedAuditDecision : null}
              isSelected={selectedAuditItem?.row === item.row}
              item={item}
              onSelectAuditDecision={onSelectAuditDecision}
              onSelectAuditRow={onSelectAuditRow}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function ReviewAuditCard({
  decision,
  isSelected,
  item,
  onSelectAuditDecision,
  onSelectAuditRow,
}: {
  decision: AuditDecision | null;
  isSelected: boolean;
  item: AuditItem;
  onSelectAuditDecision: (decision: AuditDecision) => void;
  onSelectAuditRow: (row: number) => void;
}) {
  const meta = resultMeta[item.result];
  const canConfirmAnomaly = item.result === "不通过";
  const isDecisionLocked = decision !== null;

  return (
    <section
      className={cx(
        "rounded-[24px] transition",
        isSelected
          ? cx(
              "p-4 shadow-[0_12px_26px_rgba(15,23,42,0.08)] ring-1 ring-white/70",
              meta.cardClassName,
            )
          : "bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)] hover:shadow-[0_12px_24px_rgba(15,23,42,0.08)]",
      )}
    >
      {isSelected ? (
        <>
          <div className="flex items-start gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cx("h-2 w-2 rounded-full", meta.dotClassName)} />
                <p className="truncate text-[11px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  {meta.summaryLabel}
                </p>
                <span
                  className={cx(
                    "rounded-lg px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap",
                    meta.badgeClassName,
                  )}
                >
                  {meta.label}
                </span>
              </div>
              <h3 className="mt-2 text-pretty text-[18px] font-semibold leading-7 text-slate-900">
                {item.checkpoint}
              </h3>
            </div>
          </div>

          <p className="mt-3 text-[12px] leading-5 text-slate-500">{item.comment}</p>

          {item.expandedText ? (
            <MarkdownBubbleTrigger markdown={item.expandedText} />
          ) : null}

          {canConfirmAnomaly && !isDecisionLocked ? (
            <div className="mt-4 flex gap-2">
              <button
                className={cx(
                  "rounded-xl px-3 py-2 text-[11px] font-semibold transition",
                  "bg-[#e6f4ff] text-[#0958d9] shadow-[0_6px_16px_rgba(15,23,42,0.06)] hover:bg-[#d0e8ff] hover:text-[#003eb3]",
                )}
                type="button"
                onClick={() => onSelectAuditDecision("confirm")}
              >
                {meta.actionLabel}
              </button>
              <button
                className={cx(
                  "rounded-xl px-3 py-2 text-[11px] font-semibold transition",
                  "bg-[#fff1f0] text-[#cf1322] shadow-[0_6px_16px_rgba(15,23,42,0.06)] hover:bg-[#ffe0de] hover:text-[#a8071a]",
                )}
                type="button"
                onClick={() => onSelectAuditDecision("cancel")}
              >
                取消异常
              </button>
            </div>
          ) : null}

        </>
      ) : (
        <button
          aria-label={`审核项：${item.checkpoint}`}
          className="w-full px-4 py-4 text-left"
          type="button"
          onClick={() => onSelectAuditRow(item.row)}
        >
          <AuditListCard item={item} />
        </button>
      )}
    </section>
  );
}

function MarkdownBubbleTrigger({ markdown }: { markdown: string }) {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const [open, setOpen] = useState(false);
  const [bubbleStyle, setBubbleStyle] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const updateBubblePosition = () => {
    if (!anchorRef.current) return;

    const rect = anchorRef.current.getBoundingClientRect();
    setBubbleStyle({
      left: Math.max(rect.left - 16, 24),
      top: rect.top + rect.height / 2,
    });
  };

  const showBubble = () => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    updateBubblePosition();
    setOpen(true);
  };

  const hideBubble = () => {
    hideTimerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  return (
    <div className="mt-4 flex justify-start">
      <div className="relative inline-flex items-center" onMouseEnter={showBubble} onMouseLeave={hideBubble}>
        <button
          aria-label="查看异常详情"
          ref={anchorRef}
          className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition hover:bg-white hover:text-slate-900"
          type="button"
          onBlur={hideBubble}
          onFocus={showBubble}
        >
          <span className="h-2 w-2 rounded-full bg-[#1890ff]" />
          <span>异常详情</span>
        </button>
      </div>

      {open && bubbleStyle
        ? createPortal(
            <div
              className="fixed z-50 w-[320px] max-w-[min(320px,calc(100vw-32px))] -translate-x-full -translate-y-1/2 max-[1400px]:w-[280px]"
              style={bubbleStyle}
              onMouseEnter={showBubble}
              onMouseLeave={hideBubble}
            >
              <div className="relative rounded-[20px] bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.16)] ring-1 ring-slate-200/80">
                <span
                  aria-hidden="true"
                  className="-right-2 absolute top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-[3px] bg-white ring-1 ring-slate-200/80"
                />
                <div className="max-h-[min(60vh,420px)] overflow-auto pr-1">
                  <MarkdownPreview markdown={markdown} />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function AuditListCard({ item }: { item: AuditItem }) {
  const meta = resultMeta[item.result];

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cx("h-1.5 w-1.5 rounded-full", meta.dotClassName)} />
          <p className="truncate text-[12px] font-semibold text-slate-800">{item.checkpoint}</p>
        </div>

        <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-400">{item.comment}</p>
      </div>

      <div className="shrink-0">
        <span
          className={cx(
            "block rounded-lg px-2 py-1 text-center text-[10px] font-semibold whitespace-nowrap",
            meta.badgeClassName,
          )}
        >
          {meta.shortLabel}
        </span>
      </div>
    </div>
  );
}
