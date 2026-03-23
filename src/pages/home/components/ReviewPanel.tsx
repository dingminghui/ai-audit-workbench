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
  const tabCountByFilter: Record<ResultFilter, number> = {
    all: selectedMaterial?.auditItems.length ?? 0,
    fail: selectedMaterial?.counts.fail ?? 0,
    manual: selectedMaterial?.counts.manual ?? 0,
  };

  return (
    <aside className="audit-panel flex w-full shrink-0 flex-col overflow-hidden rounded-[24px] xl:w-[360px]">
      <div className="border-b border-white/60 px-5 py-4">
        <p className="audit-kicker text-[color:var(--color-muted)]">审核轨道</p>
        <h2 className="audit-display mt-2 text-[1.7rem] leading-none text-[color:var(--color-ink)]">
          审核结论
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {filterOptions.map((option) => {
            const isActive = option.value === filter;
            return (
              <button
                key={option.value}
                aria-label={`筛选：${option.label}`}
                aria-pressed={isActive}
                className={cx(
                  "rounded-full border px-3.5 py-2 text-[11px] font-semibold transition",
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-[0_10px_20px_rgba(15,23,42,0.16)]"
                    : "border-white/70 bg-white/55 text-slate-500 hover:bg-white/78 hover:text-slate-800",
                )}
                type="button"
                onClick={() => onFilterChange(option.value)}
              >
                {option.label} {tabCountByFilter[option.value]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="audit-scroll flex-1 space-y-3 overflow-y-auto p-3">
          {filteredAuditItems.length === 0 ? (
            <div className="rounded-[22px] border border-white/70 bg-white/76 px-4 py-10 text-center text-[12px] text-slate-500 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
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
        "relative overflow-hidden rounded-[22px] border transition duration-300",
        isSelected
          ? cx(
              "border-white/70 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.1)] ring-1 ring-white/60",
              meta.cardClassName,
            )
          : "border-white/70 bg-white/76 shadow-[0_10px_20px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:shadow-[0_14px_24px_rgba(15,23,42,0.08)]",
      )}
    >
      {isSelected ? (
        <>
          <span
            aria-hidden="true"
            className="absolute -right-10 -top-14 h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.46)_0%,rgba(255,255,255,0)_72%)]"
          />

          <div className="relative flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={cx("h-2 w-2 rounded-full", meta.dotClassName)} />
                <p className="audit-kicker truncate text-[color:var(--color-muted)]">
                  {meta.summaryLabel}
                </p>
                <span className="rounded-full border border-white/70 bg-white/55 px-3 py-1 text-[10px] font-semibold text-slate-500">
                  第 {String(item.row).padStart(2, "0")} 行
                </span>
              </div>
              <h3 className="mt-2.5 text-pretty text-[18px] font-semibold leading-7 text-slate-900">
                {item.checkpoint}
              </h3>
            </div>

            <span
              className={cx(
                "shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
                meta.badgeClassName,
              )}
            >
              {meta.label}
            </span>
          </div>

          <p className="relative mt-3 text-[12px] leading-5 text-slate-600">{item.comment}</p>

          <div className="relative mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-[11px] font-medium text-slate-600">
              标记区域 {item.highlightRegions.length} 处
            </span>
            <span className="rounded-full border border-white/70 bg-white/55 px-3 py-1.5 text-[11px] font-medium text-slate-600">
              审核项编号 {item.row}
            </span>
          </div>

          {item.expandedText ? <MarkdownBubbleTrigger markdown={item.expandedText} /> : null}

          {canConfirmAnomaly && !isDecisionLocked ? (
            <div className="relative mt-4 flex gap-2">
              <button
                className={cx(
                  "rounded-2xl px-4 py-2.5 text-[11px] font-semibold transition",
                  "bg-[#e8f4f7] text-[#175f6d] shadow-[0_10px_22px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:bg-[#d9edf1]",
                )}
                type="button"
                onClick={() => onSelectAuditDecision("confirm")}
              >
                {meta.actionLabel}
              </button>
              <button
                className={cx(
                  "rounded-2xl px-4 py-2.5 text-[11px] font-semibold transition",
                  "bg-[#fff0ef] text-[#b33a49] shadow-[0_10px_22px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:bg-[#ffe2e0]",
                )}
                type="button"
                onClick={() => onSelectAuditDecision("cancel")}
              >
                取消异常
              </button>
            </div>
          ) : null}

          {isDecisionLocked ? <DecisionLockBanner decision={decision} /> : null}
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

function DecisionLockBanner({ decision }: { decision: AuditDecision | null }) {
  const label = decision === "confirm" ? "已确认异常" : "已取消异常";
  const toneClassName =
    decision === "confirm"
      ? "border-rose-200 bg-rose-50 text-rose-700"
      : "border-cyan-200 bg-cyan-50 text-cyan-800";

  return (
    <div
      className={`mt-4 rounded-[20px] border px-4 py-3 text-[12px] font-medium ${toneClassName}`}
    >
      {label}，该判断已锁定并写入本地决策记录。
    </div>
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
      <div
        className="relative inline-flex items-center"
        onMouseEnter={showBubble}
        onMouseLeave={hideBubble}
      >
        <button
          aria-label="查看异常详情"
          ref={anchorRef}
          className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-3 py-2 text-[11px] font-semibold text-slate-600 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-900"
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
              <div className="relative rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.92)_0%,rgba(247,242,235,0.96)_100%)] p-4 shadow-[0_24px_50px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/80">
                <span
                  aria-hidden="true"
                  className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rotate-45 rounded-[3px] bg-[#faf5ef] ring-1 ring-slate-200/80"
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
    <div className="flex items-start gap-3">
      <span className={cx("mt-1.5 h-2 w-2 shrink-0 rounded-full", meta.dotClassName)} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="line-clamp-2 text-[13px] font-semibold leading-6 text-slate-900">
            {item.checkpoint}
          </p>
          <span className="shrink-0 rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
            #{String(item.row).padStart(2, "0")}
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[12px] leading-5 text-slate-500">{item.comment}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={cx(
              "block rounded-full px-2.5 py-1 text-center text-[10px] font-semibold whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
              meta.badgeClassName,
            )}
          >
            {meta.shortLabel}
          </span>
          {item.highlightRegions.length > 0 ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
              {item.highlightRegions.length} 处标记
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
