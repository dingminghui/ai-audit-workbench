import { taskStatusMeta } from "@/pages/home/homeData";
import { cx } from "@/pages/home/homeUtils";
import type { MaterialViewModel } from "@/pages/home/types";

interface TaskSidebarProps {
  selectedMaterialId: string;
  visibleMaterials: MaterialViewModel[];
  onSelectMaterial: (materialId: string) => void;
}

export function TaskSidebar({
  selectedMaterialId,
  visibleMaterials,
  onSelectMaterial,
}: TaskSidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-3 xl:w-[292px]">
      <section className="rounded-[24px] bg-white/88 p-5 shadow-[0_8px_18px_rgba(15,23,42,0.05)] backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-slate-700 uppercase">
              审计任务清单
            </p>
            <p className="mt-1 text-[12px] leading-5 text-slate-500">
              当前审计流中的素材任务与核查入口
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] bg-white/74 p-2 shadow-[0_10px_22px_rgba(15,23,42,0.05)] backdrop-blur-sm xl:min-h-0 xl:flex-1">
        <div className="flex flex-col gap-2 xl:max-h-full xl:overflow-y-auto">
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
            <div className="rounded-2xl bg-white px-4 py-8 text-center text-[12px] text-slate-500 shadow-[0_6px_14px_rgba(15,23,42,0.04)]">
              没有匹配到任务
            </div>
          )}
        </div>
      </section>

    </aside>
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
        "group relative w-full overflow-hidden rounded-[20px] px-3 py-3 text-left shadow-[0_4px_12px_rgba(15,23,42,0.05)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isSelected
          ? "bg-[linear-gradient(135deg,#e6f4ff_0%,#f7fbff_68%)] shadow-[0_8px_18px_rgba(24,144,255,0.10)]"
          : `${status.cardClassName} hover:shadow-[0_8px_16px_rgba(15,23,42,0.06)]`,
      )}
      type="button"
      onClick={onClick}
    >
      <span
        aria-hidden="true"
        className={cx(
          "absolute inset-0 bg-[linear-gradient(135deg,#e6f4ff_0%,#f7fbff_68%)] transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
      <span
        aria-hidden="true"
        className={cx(
          "absolute left-0 top-1/2 h-[78%] w-1.5 -translate-y-1/2 rounded-r-full bg-[#1890ff] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isSelected ? "scale-y-100 opacity-100" : "scale-y-75 opacity-0",
        )}
      />
      <span
        aria-hidden="true"
        className={cx(
          "absolute left-0 top-1/2 h-12 w-4 -translate-y-1/2 rounded-r-full bg-[#91caff]/70 blur-[10px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isSelected ? "scale-y-100 opacity-100" : "scale-y-75 opacity-0",
        )}
      />
      <div className="relative flex items-start gap-3">
        <img
          alt={`${material.name} 缩略图`}
          className="h-12 w-12 rounded-xl object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          src={material.imageUrl}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span
              className={cx(
                "truncate font-mono text-[9px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isSelected ? "text-[#1890ff]" : "text-slate-400",
              )}
            >
              {material.serial}
            </span>
            <span
              className={cx(
                "rounded-full px-2.5 py-1 text-[9px] font-semibold leading-none transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                status.label === "紧急"
                  ? "bg-[#fff1f0] text-[#cf1322]"
                  : status.label === "处理中"
                    ? "bg-[#fff7e6] text-[#d48806]"
                    : "bg-[#f6ffed] text-[#389e0d]",
              )}
            >
              {status.label}
            </span>
          </div>

          <p
            className={cx(
              "mt-1 truncate text-[12px] font-semibold transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              isSelected ? "text-slate-900" : "text-slate-800",
            )}
          >
            {material.name}
          </p>

          <div className="mt-2 flex items-center gap-2">
            <span
              className={cx(
                "h-1.5 w-1.5 rounded-full transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                status.dotClassName,
              )}
            />
            <span
              className={cx(
                "text-[10px] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isSelected ? "text-[#0958d9]" : "text-slate-500",
              )}
            >
              {material.auditItems.length} 项审核点
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
