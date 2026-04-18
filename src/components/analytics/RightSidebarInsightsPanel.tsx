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

      {/* Insight list — 8 variantes minimalistas para validação */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 && (
          <p className="text-[10px] text-muted-foreground text-center py-4">Nenhum insight</p>
        )}
        {filtered.map((ins, idx) => {
          const cfg = categoryConfig[ins.category];
          const variant = idx % 8;
          const tag = `v${variant + 1}`;

          // V1 — Só uma barra esquerda fina + título. Zero label/ícone.
          if (variant === 0) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left py-1 pl-2 pr-1 hover:bg-muted/30 transition-colors"
                style={{ borderLeft: `2px solid ${cfg.borderColor}` }}
              >
                <p className="text-[11px] leading-snug text-foreground line-clamp-3">{ins.title}</p>
                <span className="text-[8px] text-muted-foreground/60 mt-0.5 block">{tag}</span>
              </button>
            );
          }

          // V2 — Bullet colorido + título inline. Sem caixa.
          if (variant === 1) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left flex items-start gap-2 py-1 px-1 hover:bg-muted/30 transition-colors rounded"
              >
                <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: cfg.borderColor }} />
                <p className="text-[11px] leading-snug text-foreground line-clamp-3 flex-1">{ins.title}</p>
                <span className="text-[8px] text-muted-foreground/60">{tag}</span>
              </button>
            );
          }

          // V3 — Underline colorido sob o título.
          if (variant === 2) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left py-1.5 px-1 hover:bg-muted/30 transition-colors"
              >
                <p
                  className="text-[11px] leading-snug text-foreground line-clamp-3 pb-1"
                  style={{ borderBottom: `1px solid ${cfg.borderColor}40` }}
                >
                  {ins.title}
                </p>
                <span className="text-[8px] text-muted-foreground/60 mt-0.5 block">{tag}</span>
              </button>
            );
          }

          // V4 — Quadradinho colorido inline antes do título.
          if (variant === 3) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left py-1 px-1 hover:bg-muted/30 transition-colors rounded"
              >
                <p className="text-[11px] leading-snug text-foreground line-clamp-3">
                  <span
                    className="inline-block w-2 h-2 rounded-sm mr-1.5 align-middle"
                    style={{ background: cfg.borderColor }}
                  />
                  {ins.title}
                </p>
                <span className="text-[8px] text-muted-foreground/60 mt-0.5 block">{tag}</span>
              </button>
            );
          }

          // V5 — Borda inteira super-fina, sem fill, sem ícone.
          if (variant === 4) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left rounded p-1.5 hover:bg-muted/30 transition-colors"
                style={{ border: `1px solid ${cfg.borderColor}40` }}
              >
                <p className="text-[11px] leading-snug text-foreground line-clamp-3">{ins.title}</p>
                <span className="text-[8px] text-muted-foreground/60 mt-0.5 block">{tag}</span>
              </button>
            );
          }

          // V6 — Apenas a categoria em texto pequeno colorido + título.
          if (variant === 5) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left py-1 px-1 hover:bg-muted/30 transition-colors rounded"
              >
                <span
                  className="text-[8px] uppercase tracking-wider font-medium"
                  style={{ color: cfg.borderColor }}
                >
                  {cfg.label}
                </span>
                <p className="text-[11px] leading-snug text-foreground line-clamp-3 mt-0.5">{ins.title}</p>
                <span className="text-[8px] text-muted-foreground/40">{tag}</span>
              </button>
            );
          }

          // V7 — Linha vertical 1px à esquerda, sem fundo nem borda externa.
          if (variant === 6) {
            return (
              <button
                key={ins.id}
                onClick={() => setSelected(ins)}
                className="w-full text-left py-1 pl-2 pr-1 hover:bg-muted/30 transition-colors flex gap-2"
              >
                <span className="shrink-0 w-px self-stretch" style={{ background: cfg.borderColor }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] leading-snug text-foreground line-clamp-3">{ins.title}</p>
                  <span className="text-[8px] text-muted-foreground/60 mt-0.5 block">{tag}</span>
                </div>
              </button>
            );
          }

          // V8 — Linha separadora superior colorida.
          return (
            <button
              key={ins.id}
              onClick={() => setSelected(ins)}
              className="w-full text-left py-1.5 px-1 hover:bg-muted/30 transition-colors"
              style={{ borderTop: `1px solid ${cfg.borderColor}` }}
            >
              <p className="text-[11px] leading-snug text-foreground line-clamp-3">{ins.title}</p>
              <span className="text-[8px] text-muted-foreground/60 mt-0.5 block">{tag}</span>
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
