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

      {/* Insight list — cada card renderizado num layout diferente p/ validação */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4">Nenhum insight</p>
        )}
        {filtered.map((ins, idx) => {
          const cfg = categoryConfig[ins.category];
          const Icon = iconMap[cfg.icon as keyof typeof iconMap] ?? Lightbulb;
          const variant = idx % 8;

          // V0 — Borda esquerda grossa (atual minimalista)
          if (variant === 0) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="group w-full text-left bg-white hover:bg-muted/40 transition-all rounded-md p-2"
                style={{ borderLeft: `3px solid ${cfg.borderColor}`, border: `0.5px solid ${cfg.borderColor}30`, borderLeftWidth: 3 }}
              >
                <span className="block text-[8px] font-bold uppercase tracking-wide mb-0.5" style={{ color: cfg.textColor }}>
                  <Icon size={9} className="inline -mt-0.5 mr-0.5" style={{ color: cfg.borderColor }} />
                  {cfg.label} · v1
                </span>
                <p className="text-[11px] font-medium leading-tight text-foreground line-clamp-3">{ins.title}</p>
                <span className="text-[9px] mt-1 inline-flex items-center gap-0.5" style={{ color: cfg.borderColor }}>
                  <ExternalLink size={8} /> Ver detalhes
                </span>
              </button>
            );
          }

          // V1 — Header colorido tipo "tag" no topo
          if (variant === 1) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left bg-white hover:shadow-sm transition-all rounded-md overflow-hidden border border-border/40"
              >
                <div className="px-2 py-1 flex items-center gap-1" style={{ background: cfg.borderColor }}>
                  <Icon size={10} className="text-white" />
                  <span className="text-[8px] font-bold uppercase tracking-wide text-white">{cfg.label} · v2</span>
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-medium leading-tight text-foreground line-clamp-3">{ins.title}</p>
                </div>
              </button>
            );
          }

          // V2 — Ícone circular grande à esquerda + texto à direita
          if (variant === 2) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left bg-white hover:bg-muted/40 transition-all rounded-md p-2 flex gap-2 border border-border/40"
              >
                <div
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ background: cfg.bgColor, border: `1.5px solid ${cfg.borderColor}` }}
                >
                  <Icon size={13} style={{ color: cfg.borderColor }} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] font-bold uppercase block mb-0.5" style={{ color: cfg.textColor }}>
                    {cfg.label} · v3
                  </span>
                  <p className="text-[11px] font-medium leading-tight text-foreground line-clamp-3">{ins.title}</p>
                </div>
              </button>
            );
          }

          // V3 — Fundo colorido suave (tinted card)
          if (variant === 3) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left rounded-md p-2 hover:brightness-95 transition-all"
                style={{ background: cfg.bgColor, border: `1px solid ${cfg.borderColor}40` }}
              >
                <div className="flex items-center gap-1 mb-1">
                  <Icon size={10} style={{ color: cfg.borderColor }} />
                  <span className="text-[8px] font-bold uppercase tracking-wide" style={{ color: cfg.textColor }}>
                    {cfg.label} · v4
                  </span>
                </div>
                <p className="text-[11px] font-semibold leading-tight line-clamp-3" style={{ color: cfg.textColor }}>
                  {ins.title}
                </p>
              </button>
            );
          }

          // V4 — Faixa lateral colorida + ícone vertical
          if (variant === 4) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left bg-white hover:bg-muted/40 transition-all rounded-md flex overflow-hidden border border-border/40"
              >
                <div className="w-7 shrink-0 flex flex-col items-center justify-center py-2 gap-1" style={{ background: cfg.borderColor }}>
                  <Icon size={12} className="text-white" />
                  <span className="text-[7px] font-bold text-white writing-mode-vertical">v5</span>
                </div>
                <div className="p-2 min-w-0 flex-1">
                  <span className="text-[8px] font-bold uppercase block mb-0.5" style={{ color: cfg.textColor }}>
                    {cfg.label}
                  </span>
                  <p className="text-[11px] font-medium leading-tight text-foreground line-clamp-3">{ins.title}</p>
                </div>
              </button>
            );
          }

          // V5 — Card "ticket" com bordas pontilhadas + bullet
          if (variant === 5) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left bg-white hover:bg-muted/30 transition-all rounded-md p-2 border-2 border-dashed"
                style={{ borderColor: `${cfg.borderColor}60` }}
              >
                <div className="flex items-start gap-1.5">
                  <span
                    className="shrink-0 w-1.5 h-1.5 rounded-full mt-1"
                    style={{ background: cfg.borderColor, boxShadow: `0 0 0 3px ${cfg.borderColor}25` }}
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[8px] font-bold uppercase block mb-0.5" style={{ color: cfg.textColor }}>
                      {cfg.label} · v6
                    </span>
                    <p className="text-[11px] font-medium leading-tight text-foreground line-clamp-3">{ins.title}</p>
                  </div>
                </div>
              </button>
            );
          }

          // V6 — Minimal ultra-compacto (uma linha + título)
          if (variant === 6) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left bg-white hover:bg-muted/40 transition-all rounded p-1.5 border border-border/30"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className="shrink-0 inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold uppercase"
                    style={{ background: cfg.borderColor, color: "#fff" }}
                  >
                    <Icon size={8} />
                    v7
                  </span>
                  <p className="text-[11px] font-medium leading-tight text-foreground line-clamp-2 flex-1">{ins.title}</p>
                </div>
              </button>
            );
          }

          // V7 — Card "premium" com gradiente sutil + sombra
          return (
            <button
              key={ins.id}
              onClick={() => setSelected(ins)}
              className="w-full text-left rounded-lg p-2 transition-all hover:shadow-md hover:-translate-y-px"
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, ${cfg.bgColor} 100%)`,
                border: `1px solid ${cfg.borderColor}50`,
                boxShadow: `0 1px 2px ${cfg.borderColor}15`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="inline-flex items-center gap-0.5 text-[8px] font-bold uppercase" style={{ color: cfg.textColor }}>
                  <Icon size={10} style={{ color: cfg.borderColor }} />
                  {cfg.label} · v8
                </span>
                <ExternalLink size={9} style={{ color: cfg.borderColor }} />
              </div>
              <p className="text-[11px] font-semibold leading-tight text-foreground line-clamp-3">{ins.title}</p>
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
