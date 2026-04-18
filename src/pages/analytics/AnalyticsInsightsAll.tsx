import { useMemo, useState } from "react";
import { AlertTriangle, Trophy, Lightbulb, Activity, ExternalLink, Search } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { getInsightsForCustomer, categoryConfig, type QualidadeInsight } from "@/data/qualidadeInsightsData";
import InsightDetailModal from "@/components/analytics/InsightDetailModal";
import { useDismissedInsights } from "@/hooks/useDismissedInsights";

const iconMap = { AlertTriangle, Trophy, Lightbulb, Activity } as const;
const severityRank: Record<string, number> = { critical: 0, high: 1, medium: 2, info: 3, success: 4 };

type FilterKey = "all" | keyof typeof categoryConfig;

const filterChips: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Todos" },
  { key: "risk", label: "Riscos" },
  { key: "achievement", label: "Conquistas" },
  { key: "opportunity", label: "Oportunidades" },
  { key: "event", label: "Eventos" },
];

export default function AnalyticsInsightsAll() {
  const { customerId } = useCustomer();
  const { dismissed } = useDismissedInsights(String(customerId));
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<QualidadeInsight | null>(null);

  const all = useMemo(() => getInsightsForCustomer(customerId), [customerId]);

  const active = useMemo(
    () => all
      .filter(i => !dismissed.includes(i.id))
      .sort((a, b) => (severityRank[a.severity] ?? 9) - (severityRank[b.severity] ?? 9)),
    [all, dismissed]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: active.length };
    for (const i of active) map[i.category] = (map[i.category] || 0) + 1;
    return map;
  }, [active]);

  const filtered = useMemo(() => {
    let result = filter === "all" ? active : active.filter(i => i.category === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i =>
        i.title.toLowerCase().includes(q) || i.narrative.toLowerCase().includes(q)
      );
    }
    return result;
  }, [active, filter, search]);

  return (
    <div className="flex-1 min-w-0 overflow-y-auto bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-xl font-semibold text-foreground mb-1">Central de Insights</h1>
          <p className="text-sm text-muted-foreground">
            {active.length} insights ativos · gerados a partir dos seus dados
          </p>
        </div>

        {/* Toolbar: filters + search */}
        <div className="bg-white rounded-lg border border-border p-3 mb-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
            {filterChips.map(({ key, label }) => {
              const isActive = filter === key;
              const cfg = key === "all" ? null : categoryConfig[key as keyof typeof categoryConfig];
              const count = counts[key] || 0;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap"
                  style={{
                    background: isActive ? (cfg?.borderColor ?? "#FF5722") : (cfg?.bgColor ?? "#F1EFE8"),
                    color: isActive ? "#fff" : (cfg?.textColor ?? "#444441"),
                    borderColor: isActive ? (cfg?.borderColor ?? "#FF5722") : "transparent",
                  }}
                >
                  {label} · {count}
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar insights..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-[#FF5722]/40"
            />
          </div>
        </div>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg border border-border p-12 flex flex-col items-center gap-3">
            <Lightbulb size={32} className="text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Nenhum insight encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(ins => {
              const cfg = categoryConfig[ins.category];
              const Icon = iconMap[cfg.icon as keyof typeof iconMap] ?? Lightbulb;
              return (
                <button
                  key={ins.id}
                  onClick={() => setSelected(ins)}
                  className="text-left bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all rounded-lg overflow-hidden flex flex-col"
                  style={{
                    border: `1px solid ${cfg.borderColor}30`,
                    borderLeft: `4px solid ${cfg.borderColor}`,
                  }}
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full" style={{ backgroundColor: cfg.borderColor }} />
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon size={12} style={{ color: cfg.borderColor }} />
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide"
                        style={{ color: cfg.textColor }}
                      >
                        {cfg.label}
                      </span>
                      {ins.severity === "critical" && (
                        <span className="ml-auto text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 text-red-700">
                          Crítico
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2">
                      {ins.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-3 flex-1">
                      {ins.narrative}
                    </p>
                    {ins.evidence && (
                      <div className="flex items-center gap-2 mb-3 bg-muted/40 rounded p-2 text-xs">
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-muted-foreground block truncate">{ins.evidence.before.label}</span>
                          <span className="text-[12px] font-bold text-foreground">{ins.evidence.before.value}</span>
                        </div>
                        <span className="text-muted-foreground/50">→</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] text-muted-foreground block truncate">{ins.evidence.after.label}</span>
                          <span className="text-[12px] font-bold text-foreground">{ins.evidence.after.value}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-[11px] font-medium" style={{ color: cfg.borderColor }}>
                      Ver detalhes <ExternalLink size={10} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
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
