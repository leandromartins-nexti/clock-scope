import { useMemo, useState } from "react";
import { AlertTriangle, Trophy, Lightbulb, Activity, ArrowRight, Link2 } from "lucide-react";
import { qualidadeInsights, categoryConfig, type QualidadeInsight } from "@/data/qualidadeInsightsData";
import { useDismissedInsights } from "@/hooks/useDismissedInsights";

const iconMap = {
  AlertTriangle, Trophy, Lightbulb, Activity,
} as const;

const severityOrder: Record<string, number> = {
  critical: 0, high: 1, medium: 2, info: 3, success: 0,
};

const categories: Array<QualidadeInsight["category"]> = ["risk", "achievement", "opportunity", "event"];

export default function QualidadeInsightsSection() {
  const { dismissed, dismiss } = useDismissedInsights("642_qualidade");
  const [fadingOut, setFadingOut] = useState<string | null>(null);

  const activeInsights = useMemo(
    () => qualidadeInsights.filter((i) => !dismissed.includes(i.id)),
    [dismissed]
  );

  const byCategory = useMemo(() => {
    const m: Record<string, QualidadeInsight[]> = {};
    for (const cat of categories) m[cat] = [];
    for (const ins of activeInsights) {
      m[ins.category].push(ins);
    }
    for (const cat of categories) {
      m[cat].sort((a, b) => (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5));
    }
    return m;
  }, [activeInsights]);

  const handleDismiss = (id: string) => {
    setFadingOut(id);
    setTimeout(() => { dismiss(id); setFadingOut(null); }, 200);
  };

  if (activeInsights.length === 0) return null;

  return (
    <div className="mt-6 mb-2">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-[#FF5722]" />
        <span className="text-sm font-semibold text-foreground">Insights da Qualidade do Ponto</span>
        <span className="text-[11px] text-muted-foreground">· {activeInsights.length} ativos</span>
      </div>

      <div className="grid grid-cols-4 gap-3 items-stretch">
        {categories.map((cat) => {
          const cfg = categoryConfig[cat];
          const items = byCategory[cat];
          const Icon = iconMap[cfg.icon];

          return (
            <div
              key={cat}
              className="rounded-lg border bg-white flex flex-col"
              style={{ borderColor: cfg.borderColor + "40", borderTop: `3px solid ${cfg.borderColor}` }}
            >
              {/* Header */}
              <div className="px-3 py-2.5 flex items-center gap-2" style={{ backgroundColor: cfg.bgColor }}>
                <Icon size={14} style={{ color: cfg.textColor }} />
                <span className="text-xs font-semibold" style={{ color: cfg.textColor }}>{cfg.label}</span>
                <span
                  className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: cfg.badgeBg, color: cfg.textColor }}
                >
                  {items.length}
                </span>
              </div>

              {/* Body - flex-1 ensures equal height */}
              <div className="p-2 flex flex-col gap-2 flex-1">
                {items.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground text-center py-4">Nenhum insight ativo</p>
                ) : (
                  items.map((ins) => {
                    const isFading = fadingOut === ins.id;
                    return (
                      <div
                        key={ins.id}
                        className="rounded border border-border/60 p-2.5 bg-white transition-all"
                        style={{
                          opacity: isFading ? 0 : 1,
                          transform: isFading ? "translateY(4px)" : "translateY(0)",
                          transition: "opacity 200ms, transform 200ms",
                        }}
                      >
                        <p className="text-[12px] font-medium leading-tight text-foreground mb-1">{ins.title}</p>
                        <p className="text-[11px] leading-relaxed text-muted-foreground mb-1.5">{ins.narrative}</p>

                        {ins.crossRef && (
                          <p className="text-[10px] text-blue-600 flex items-center gap-1 mb-1.5">
                            <Link2 size={10} />
                            {ins.crossRef.label}
                          </p>
                        )}

                        {ins.evidence && (
                          <div className="flex items-center gap-1.5 mb-1.5 bg-muted/40 rounded p-1.5 text-[11px]">
                            <div>
                              <span className="text-[9px] text-muted-foreground block">{ins.evidence.before.label}</span>
                              <span className="font-semibold text-foreground">{ins.evidence.before.value}</span>
                            </div>
                            <ArrowRight size={10} className="text-muted-foreground/50 flex-shrink-0" />
                            <div>
                              <span className="text-[9px] text-muted-foreground block">{ins.evidence.after.label}</span>
                              <span className="font-semibold text-foreground">{ins.evidence.after.value}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex items-start gap-1 mb-1.5">
                          <span className="text-[10px] text-muted-foreground italic">💡 {ins.action}</span>
                        </div>

                        <button
                          onClick={() => handleDismiss(ins.id)}
                          className="text-[10px] text-muted-foreground hover:text-foreground border border-border/50 px-2 py-0.5 rounded transition-colors"
                        >
                          Dispensar
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
