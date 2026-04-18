import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Trophy, Lightbulb, Activity, Play, Square } from "lucide-react";
import { useCustomer } from "@/contexts/CustomerContext";
import { getInsightsForCustomer, categoryConfig, type QualidadeInsight } from "@/data/qualidadeInsightsData";
import InsightDetailModal from "./InsightDetailModal";
import { useDismissedInsights } from "@/hooks/useDismissedInsights";
import { useInsightsTour } from "@/contexts/InsightsTourContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

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
  collapsed?: boolean;
}

export default function RightSidebarInsightsPanel({ collapsed = false }: Props) {
  const { customerId } = useCustomer();
  const { dismissed } = useDismissedInsights(String(customerId));
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<QualidadeInsight | null>(null);
  const { hoveredId, setHoveredId, tourActive, startTour, stopTour, pinnedIds } = useInsightsTour();
  const cardRefs = useRef<Record<string, HTMLButtonElement | null>>({});

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

  // Scroll-into-view quando hover é trigado externamente (pin ou tour)
  useEffect(() => {
    if (!hoveredId) return;
    const el = cardRefs.current[hoveredId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [hoveredId]);

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
            <div key={key} className="relative p-1.5 rounded-md" style={{ background: cfg.bgColor }} title={`${cfg.label}: ${count}`}>
              <Icon size={13} style={{ color: cfg.borderColor }} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold rounded-full px-1"
                  style={{ background: cfg.borderColor, color: "#fff", minWidth: 12, textAlign: "center" }}>
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
      {/* Tour trigger header */}
      <div className="flex items-center justify-between mb-1.5 shrink-0 px-0.5">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {filtered.length} {filtered.length === 1 ? "insight" : "insights"}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                if (tourActive) { stopTour(); return; }
                const pinned = filtered.filter(i => pinnedIds.has(i.id));
                startTour(pinned.length ? pinned : filtered);
              }}
              disabled={!tourActive && filtered.length === 0}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: tourActive ? "#ef4444" : "#FF5722",
                color: "#fff",
              }}
            >
              {tourActive ? <Square size={9} fill="#fff" /> : <Play size={9} fill="#fff" />}
              {tourActive ? "Parar" : `Tour (${filtered.filter(i => pinnedIds.has(i.id)).length || filtered.length})`}
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" sideOffset={6}>
            {tourActive ? "Encerrar tour guiado (ESC)" : "Iniciar tour guiado pelos insights"}
            <TooltipPrimitive.Arrow className="fill-popover" width={10} height={5} />
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 shrink-0 px-0.5">
        {catKeys.map(({ key, label }) => {
          const isActive = filter === key;
          const cfg = key === "all" ? null : categoryConfig[key as keyof typeof categoryConfig];
          const count = key === "all" ? active.length : active.filter(i => i.category === key).length;
          const dotColor = cfg?.borderColor ?? "#9CA3AF";
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className="group inline-flex items-center gap-1 py-0.5 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor, opacity: isActive ? 1 : 0.5 }} />
              <span
                className={`text-[10px] ${isActive ? "font-semibold text-foreground" : "font-medium text-muted-foreground group-hover:text-foreground"}`}
                style={isActive ? { borderBottom: `1.5px solid ${dotColor}` } : undefined}
              >
                {label}
              </span>
              <span className={`text-[9px] tabular-nums ${isActive ? "text-foreground" : "text-muted-foreground/60"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Insight list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4">Nenhum insight</p>
        )}
        {filtered.map((ins) => {
          const cfg = categoryConfig[ins.category];
          const isHovered = hoveredId === ins.id;
          return (
            <button
              key={ins.id}
              ref={(el) => { cardRefs.current[ins.id] = el; }}
              onClick={() => setSelected(ins)}
              onMouseEnter={() => setHoveredId(ins.id)}
              onMouseLeave={() => !tourActive && setHoveredId(null)}
              className="w-full text-left bg-white rounded-md transition-all p-2"
              style={{
                borderLeft: `3px solid ${cfg.borderColor}`,
                boxShadow: isHovered
                  ? `0 0 0 2px ${cfg.borderColor}, 0 4px 12px ${cfg.borderColor}40`
                  : "0 1px 2px rgba(0,0,0,0.06)",
                transform: isHovered ? "translateX(-2px)" : "translateX(0)",
              }}
            >
              <span className="text-[8px] font-bold uppercase tracking-wider block mb-0.5" style={{ color: cfg.borderColor }}>
                {cfg.label}
              </span>
              <p className="text-[11px] leading-snug font-medium text-foreground line-clamp-2">
                {ins.title}
              </p>
              {ins.narrative && (
                <p className="text-[10px] leading-snug text-muted-foreground line-clamp-2 mt-0.5">
                  {ins.narrative}
                </p>
              )}
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
