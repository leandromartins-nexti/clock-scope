import { useMemo, useState } from "react";
import { AlertTriangle, Trophy, Lightbulb, Activity, ExternalLink } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { getInsightsForCustomer, categoryConfig, type QualidadeInsight } from "@/data/qualidadeInsightsData";
import InsightDetailModal from "./InsightDetailModal";
import { useDismissedInsights } from "@/hooks/useDismissedInsights";

const iconMap = { AlertTriangle, Trophy, Lightbulb, Activity } as const;
const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, info: 3, success: 4 };
const catKeys: Array<{ key: "all" | keyof typeof categoryConfig; label: string }> = [
  { key: "all", label: "Todos" },
  { key: "risk", label: "Riscos" },
  { key: "achievement", label: "Conquistas" },
  { key: "opportunity", label: "Oportun." },
  { key: "event", label: "Eventos" },
];

interface Props {
  /** When true, render the collapsed icon-only variant */
  collapsed?: boolean;
}

export default function RightSidebarInsightsPanel({ collapsed = false }: Props) {
  const { customerId } = useCustomer();
  const { dismissed } = useDismissedInsights(String(customerId));
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<QualidadeInsight | null>(null);

  const all = useMemo(() => getInsightsForCustomer(customerId), [customerId]);
  const active = useMemo(
    () => all.filter(i => !dismissed.includes(i.id))
            .sort((a, b) => (severityOrder[a.severity] ?? 9) - (severityOrder[b.severity] ?? 9)),
    [all, dismissed]
  );
  const filtered = useMemo(
    () => filter === "all" ? active : active.filter(i => i.category === filter),
    [active, filter]
  );

  // ── Collapsed (icon-only) ──
  if (collapsed) {
    const counts = catKeys.slice(1).map(({ key }) => ({
      key,
      count: active.filter(i => i.category === key).length,
      cfg: categoryConfig[key as keyof typeof categoryConfig],
    }));
    return (
      <div className="flex flex-col items-center gap-1.5">
        {counts.map(({ key, count, cfg }) => {
          const Icon = iconMap[cfg.icon as keyof typeof iconMap] ?? Lightbulb;
          return (
            <div
              key={key}
              className="relative p-1.5 rounded-md"
              style={{ background: cfg.bgColor }}
              title={`${cfg.label}: ${count}`}
            >
              <Icon size={13} style={{ color: cfg.borderColor }} />
              {count > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[8px] font-bold rounded-full px-1"
                  style={{ background: cfg.borderColor, color: "#fff", minWidth: 12, textAlign: "center" }}
                >
                  {count}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // ── Expanded ──
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-1 mb-1.5 shrink-0">
        {catKeys.map(({ key, label }) => {
          const isActive = filter === key;
          const cfg = key === "all" ? null : categoryConfig[key as keyof typeof categoryConfig];
          const count = key === "all" ? active.length : active.filter(i => i.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="px-1.5 py-0.5 rounded text-[10px] font-medium border transition-colors whitespace-nowrap"
              style={{
                background: isActive ? (cfg?.borderColor ?? "#FF5722") : (cfg?.bgColor ?? "#F1EFE8"),
                color: isActive ? "#fff" : (cfg?.textColor ?? "#444441"),
                borderColor: isActive ? (cfg?.borderColor ?? "#FF5722") : "transparent",
              }}
            >
              {label}·{count}
            </button>
          );
        })}
      </div>

      {/* Insight list */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filtered.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4">Nenhum insight</p>
        )}
        {filtered.map(ins => {
          const cfg = categoryConfig[ins.category];
          const Icon = iconMap[cfg.icon as keyof typeof iconMap] ?? Lightbulb;
          return (
            <button
              key={ins.id}
              onClick={() => setSelected(ins)}
              className="w-full text-left bg-white hover:bg-muted/40 transition-colors rounded-md p-2"
              style={{ border: `0.5px solid ${cfg.borderColor}40`, borderLeft: `3px solid ${cfg.borderColor}` }}
            >
              <div className="flex items-center gap-1 mb-0.5">
                <Icon size={10} style={{ color: cfg.borderColor }} />
                <span
                  className="text-[8px] font-bold uppercase tracking-wide"
                  style={{ color: cfg.textColor }}
                >
                  {cfg.label}
                </span>
              </div>
              <p className="text-[11px] font-medium leading-tight text-foreground line-clamp-3">
                {ins.title}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[9px] text-muted-foreground">
                <ExternalLink size={8} /> Ver detalhes
              </div>
            </button>
          );
        })}
      </div>

      <InsightDetailModal
        insight={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onDismiss={() => setSelected(null)}
      />
    </div>
  );
}
