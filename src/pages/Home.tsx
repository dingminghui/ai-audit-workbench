import { PreviewWorkspace } from "@/pages/home/components/PreviewWorkspace";
import { ReviewPanel } from "@/pages/home/components/ReviewPanel";
import { TaskSidebar } from "@/pages/home/components/TaskSidebar";
import { materials } from "@/pages/home/homeData";
import { filterAuditItems, pickDefaultAuditRow, resolveSelectedAuditRow } from "@/pages/home/homeUtils";
import type { ResultFilter } from "@/pages/home/types";
import { useEffect, useMemo, useState } from "react";

const AUDIT_DECISIONS_STORAGE_KEY = "ai-audit-workbench.audit-decisions";
const LEGACY_CONFIRMED_ANOMALIES_STORAGE_KEY = "ai-audit-workbench.confirmed-anomalies";

type AuditDecision = "confirm" | "cancel";

export function Home() {
  const [selectedMaterialId, setSelectedMaterialId] = useState(materials[0]?.id ?? "");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("all");
  const [selectedAuditRow, setSelectedAuditRow] = useState<number>(
    pickDefaultAuditRow(materials[0]?.auditItems ?? []),
  );
  const [auditDecisions, setAuditDecisions] = useState<Record<string, AuditDecision>>(() =>
    loadAuditDecisions(),
  );
  const visibleMaterials = useMemo(() => materials, []);

  useEffect(() => {
    if (visibleMaterials.length === 0) return;

    if (!visibleMaterials.some((material) => material.id === selectedMaterialId)) {
      setSelectedMaterialId(visibleMaterials[0].id);
      setResultFilter("all");
    }
  }, [selectedMaterialId, visibleMaterials]);

  const selectedMaterial =
    visibleMaterials.find((material) => material.id === selectedMaterialId) ??
    visibleMaterials[0] ??
    null;

  const filteredAuditItems = useMemo(
    () => filterAuditItems(selectedMaterial?.auditItems ?? [], resultFilter),
    [resultFilter, selectedMaterial],
  );

  useEffect(() => {
    if (!selectedMaterial) return;

    const nextSelectedAuditRow = resolveSelectedAuditRow(
      selectedMaterial.auditItems,
      filteredAuditItems,
      selectedAuditRow,
    );

    if (nextSelectedAuditRow !== selectedAuditRow) {
      setSelectedAuditRow(nextSelectedAuditRow);
    }
  }, [filteredAuditItems, selectedAuditRow, selectedMaterial]);

  const selectedAuditItem =
    filteredAuditItems.find((item) => item.row === selectedAuditRow) ??
    filteredAuditItems[0] ??
    selectedMaterial?.auditItems.find((item) => item.row === selectedAuditRow) ??
    selectedMaterial?.auditItems[0] ??
    null;

  const selectedAuditItemKey =
    selectedMaterial && selectedAuditItem
      ? buildAuditItemStorageKey(selectedMaterial.id, selectedAuditItem.row)
      : null;
  const selectedAuditDecision = selectedAuditItemKey ? auditDecisions[selectedAuditItemKey] ?? null : null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f2f7fc_0%,#e7eef6_100%)] p-3 text-slate-900 sm:p-4">
      <h1 className="sr-only">会议结算审核工作台</h1>

      <div className="mx-auto flex max-w-[1920px] flex-col gap-3 xl:h-[calc(100vh-32px)] xl:min-h-[860px] xl:flex-row">
        <TaskSidebar
          selectedMaterialId={selectedMaterial?.id ?? ""}
          visibleMaterials={visibleMaterials}
          onSelectMaterial={(materialId) => {
            setSelectedMaterialId(materialId);
            setResultFilter("all");
          }}
        />

        <PreviewWorkspace material={selectedMaterial} previewItem={selectedAuditItem} />

        <ReviewPanel
          filteredAuditItems={filteredAuditItems}
          filter={resultFilter}
          selectedAuditDecision={selectedAuditDecision}
          selectedAuditItem={selectedAuditItem}
          selectedMaterial={selectedMaterial}
          onFilterChange={setResultFilter}
          onSelectAuditDecision={(decision) => {
            if (!selectedAuditItemKey) return;
            setAuditDecisions((current) => {
              if (current[selectedAuditItemKey]) return current;

              const next = {
                ...current,
                [selectedAuditItemKey]: decision,
              };

              persistAuditDecisions(next);
              return next;
            });
          }}
          onSelectAuditRow={setSelectedAuditRow}
        />
      </div>
    </div>
  );
}

function buildAuditItemStorageKey(materialId: string, row: number) {
  return `${materialId}:${row}`;
}

function loadAuditDecisions(): Record<string, AuditDecision> {
  if (typeof window === "undefined") return {};

  try {
    const rawValue = window.localStorage.getItem(AUDIT_DECISIONS_STORAGE_KEY);
    if (rawValue) {
      const parsed = JSON.parse(rawValue);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return Object.entries(parsed).reduce<Record<string, AuditDecision>>((result, [key, value]) => {
          if (value === "confirm" || value === "cancel") {
            result[key] = value;
          }
          return result;
        }, {});
      }
    }

    const legacyValue = window.localStorage.getItem(LEGACY_CONFIRMED_ANOMALIES_STORAGE_KEY);
    if (!legacyValue) return {};

    const parsedLegacyValue = JSON.parse(legacyValue);
    return Array.isArray(parsedLegacyValue)
      ? parsedLegacyValue.reduce<Record<string, AuditDecision>>((result, value) => {
          if (typeof value === "string") {
            result[value] = "confirm";
          }
          return result;
        }, {})
      : {};
  } catch {
    return {};
  }
}

function persistAuditDecisions(values: Record<string, AuditDecision>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUDIT_DECISIONS_STORAGE_KEY, JSON.stringify(values));
}
