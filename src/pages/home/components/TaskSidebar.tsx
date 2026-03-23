import { taskStatusMeta } from "@/pages/home/homeData";
import { cx } from "@/pages/home/homeUtils";
import type { MaterialViewModel } from "@/pages/home/types";

interface TaskSidebarProps {
  selectedMaterialId: string;
  totalAuditItems: number;
  totalFailCount: number;
  totalManualCount: number;
  visibleMaterials: MaterialViewModel[];
  onSelectMaterial: (materialId: string) => void;
}

export function TaskSidebar({
  selectedMaterialId,
  totalAuditItems,
  totalFailCount,
  totalManualCount,
  visibleMaterials,
  onSelectMaterial,
}: TaskSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[292px] xl:min-h-0">
      <section className="audit-panel rounded-[24px] p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="audit-display text-[1.7rem] leading-none text-[color:var(--color-ink)]">
              素材队列
            </h2>
          </div>

          <div className="rounded-[18px] border border-white/65 bg-white/58 px-3 py-2 text-right shadow-[0_10px_18px_rgba(15,34,51,0.05)]">
            <p className="audit-kicker text-[color:var(--color-muted)]">素材数</p>
            <p className="audit-metric-value mt-1 text-[1.55rem] leading-none text-[color:var(--color-ink)]">
              {visibleMaterials.length}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <SidebarMetric label="审核项" tone="text-cyan-900" value={totalAuditItems} />
          <SidebarMetric label="异常" tone="text-rose-700" value={totalFailCount} />
          <SidebarMetric label="人工介入" tone="text-amber-700" value={totalManualCount} />
        </div>
      </section>

      <section className="audit-panel rounded-[24px] p-2 xl:min-h-0 xl:flex-1">
        <div className="flex items-center justify-between px-2 py-2">
          <p className="audit-kicker text-[color:var(--color-muted)]">素材切换</p>
          <p className="text-[11px] text-slate-400">点击切换预览</p>
        </div>

        <div className="audit-scroll flex flex-col gap-2 xl:max-h-full xl:overflow-y-auto">
          {visibleMaterials.length > 0 ? (
            visibleMaterials.map((material) => (
              <TaskListItem
                key={material.id}
                isSelected={material.id === selectedMaterialId}
                material={material}
                onClick={() => onSelectMaterial(material.id)}
              />
            ))
          ) : (
            <div className="rounded-[20px] border border-white/70 bg-white/75 px-4 py-8 text-center text-[12px] text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              没有匹配到任务
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}

function SidebarMetric({ label, tone, value }: { label: string; tone: string; value: number }) {
  return (
    <div className="rounded-[18px] border border-white/65 bg-white/55 px-3 py-2.5 shadow-[0_8px_16px_rgba(15,34,51,0.04)]">
      <p className="text-[10px] font-semibold tracking-[0.12em] text-slate-400 uppercase">
        {label}
      </p>
      <p className={`audit-metric-value mt-1.5 text-[1.3rem] leading-none ${tone}`}>{value}</p>
    </div>
  );
}

function TaskListItem({
  isSelected,
  material,
  onClick,
}: {
  isSelected: boolean;
  material: MaterialViewModel;
  onClick: () => void;
}) {
  const status = taskStatusMeta[material.taskStatus];

  return (
    <button
      aria-label={`切换材料：${material.name}`}
      className={cx(
        "group relative isolate w-full overflow-hidden rounded-[20px] border p-3.5 text-left transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isSelected
          ? "border-cyan-200/90 bg-[linear-gradient(180deg,rgba(245,251,252,0.95)_0%,rgba(225,241,245,0.88)_100%)] shadow-[0_16px_28px_rgba(31,122,140,0.15)]"
          : "border-white/70 bg-white/76 shadow-[0_10px_20px_rgba(15,34,51,0.06)] hover:-translate-y-0.5 hover:shadow-[0_14px_22px_rgba(15,34,51,0.08)]",
      )}
      type="button"
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className={cx(
          "absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(31,122,140,0.12)_0%,rgba(31,122,140,0)_48%)] opacity-0 transition duration-300 group-hover:opacity-100",
          isSelected ? "opacity-100" : "",
        )}
      />
      <span
        aria-hidden="true"
        className={cx(
          "absolute left-0 top-3 h-[calc(100%-1.5rem)] w-1.5 rounded-r-full transition-all duration-300",
          isSelected
            ? "bg-[color:var(--color-accent)] shadow-[0_0_18px_rgba(31,122,140,0.46)]"
            : "bg-transparent",
        )}
      />

      <div className="relative flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            alt={`${material.name} 缩略图`}
            className="h-12 w-12 rounded-[16px] object-cover shadow-[0_10px_20px_rgba(15,34,51,0.14)] transition-transform duration-300 group-hover:scale-[1.02]"
            src={material.imageUrl}
          />
          <span
            aria-hidden="true"
            className={cx(
              "absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white",
              status.dotClassName,
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className={cx(
                  "font-mono text-[9px] tracking-[0.18em]",
                  isSelected ? "text-[color:var(--color-accent)]" : "text-slate-400",
                )}
              >
                {material.serial}
              </p>
              <p className="mt-1 text-[13px] font-semibold text-slate-900">{material.name}</p>
            </div>
            <span
              className={cx(
                "rounded-full px-2.5 py-1 text-[9px] font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]",
                status.badgeClassName,
              )}
            >
              {status.label}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-500">
            {material.taskSummary}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <CountPill accent="rose" label="异常" value={material.counts.fail} />
            <CountPill accent="amber" label="人工" value={material.counts.manual} />
            <CountPill accent="emerald" label="通过" value={material.counts.pass} />
          </div>
        </div>
      </div>
    </button>
  );
}

function CountPill({
  accent,
  label,
  value,
}: {
  accent: "amber" | "emerald" | "rose";
  label: string;
  value: number;
}) {
  const accentClassName =
    accent === "rose"
      ? "bg-rose-50 text-rose-700"
      : accent === "amber"
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${accentClassName}`}>
      {label} {value}
    </span>
  );
}
