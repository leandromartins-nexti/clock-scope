import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { AlertTriangle, Trophy, Lightbulb, Activity, ArrowRight, Link2, RotateCcw } from "lucide-react";
import { getInsightsForCustomer, categoryConfig, type QualidadeInsight } from "@/data/qualidadeInsightsData";
import { useDismissedInsights } from "@/hooks/useDismissedInsights";
import { useCustomer } from "@/contexts/CustomerContext";
import InsightDetailModal from "./InsightDetailModal";

const iconMap = {
  AlertTriangle, Trophy, Lightbulb, Activity,
} as const;

const severityOrder: Record<string, number> = {
  critical: 0, high: 1, medium: 2, info: 3, success: 0,
};

const categories: Array<QualidadeInsight["category"]> = ["risk", "achievement", "opportunity", "event"];

export default function QualidadeInsightsSection() {
  const { customerId } = useCustomer();
  const qualidadeInsights = useMemo(() => getInsightsForCustomer(customerId), [customerId]);
  const { dismissed, dismiss, restore } = useDismissedInsights(`${customerId}_qualidade`);
  const [fadingOut, setFadingOut] = useState<string | null>(null);
  const [selectedInsight, setSelectedInsight] = useState<QualidadeInsight | null>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Clear highlight after 2s
  useEffect(() => {
    if (!highlightedId) return;
    const t = setTimeout(() => setHighlightedId(null), 2000);
    return () => clearTimeout(t);
  }, [highlightedId]);

  const activeInsights = useMemo(
    () => qualidadeInsights.filter((i) => !dismissed.includes(i.id)),
    [dismissed]
  );

  const dismissedInsights = useMemo(
    () => qualidadeInsights.filter((i) => dismissed.includes(i.id)),
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

  const handleDismiss = useCallback((id: string) => {
    setFadingOut(id);
    setTimeout(() => { dismiss(id); setFadingOut(null); }, 200);
  }, [dismiss]);

  const handleCrossRef = useCallback((targetId: string) => {
    setHighlightedId(targetId);
    // Scroll to card if visible
    const el = cardRefs.current[targetId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const handleRestoreOne = useCallback((id: string) => {
    // Restore all then re-dismiss others — simpler: just manipulate localStorage directly
    const key = "dismissed_insights_642_qualidade";
    const current = dismissed.filter(d => d !== id);
    localStorage.setItem(key, JSON.stringify(current));
    // Force re-render by calling restore then re-dismiss
    restore();
    // Re-dismiss the others after restore
    setTimeout(() => {
      current.forEach(d => dismiss(d));
    }, 0);
  }, [dismissed, restore, dismiss]);

  if (qualidadeInsights.length === 0) {
    return (
      <div className="mt-6 mb-2 text-center py-8">
        <p className="text-sm text-muted-foreground">
          Nenhum insight disponível para este cliente no momento. Insights são curados pela equipe Nexti com base em padrões operacionais.
        </p>
      </div>
    );
  }

  if (activeInsights.length === 0 && dismissedInsights.length === 0) return null;

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

              {/* Body */}
              <div className="p-2 flex flex-col gap-2 flex-1">
                {items.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground text-center py-4">Nenhum insight ativo</p>
                ) : (
                  items.map((ins) => {
                    const isFading = fadingOut === ins.id;
                    const isHighlighted = highlightedId === ins.id;
                    return (
                      <div
                        key={ins.id}
                        ref={(el) => { cardRefs.current[ins.id] = el; }}
                        className="rounded border border-border/60 p-2.5 bg-white transition-all cursor-pointer hover:shadow-sm"
                        style={{
                          opacity: isFading ? 0 : 1,
                          transform: isFading ? "translateY(4px)" : "translateY(0)",
                          transition: "opacity 200ms, transform 200ms, box-shadow 300ms",
                          boxShadow: isHighlighted ? `0 0 0 2px ${cfg.borderColor}` : undefined,
                          animation: isHighlighted ? "insightPulse 1s ease-in-out" : undefined,
                        }}
                        onClick={() => setSelectedInsight(ins)}
                      >
                        <p className="text-[12px] font-medium leading-tight text-foreground mb-1">{ins.title}</p>
                        <p className="text-[11px] leading-relaxed text-muted-foreground mb-1.5 line-clamp-3">{ins.narrative}</p>

                        {ins.crossRef && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCrossRef(ins.crossRef!.targetId); }}
                            className="text-[10px] text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-1.5 transition-colors"
                          >
                            <Link2 size={10} />
                            {ins.crossRef.label}
                          </button>
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
                          onClick={(e) => { e.stopPropagation(); handleDismiss(ins.id); }}
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

      {/* Dismissed footer */}
      {dismissedInsights.length > 0 && (
        <div className="mt-3 border border-border/40 rounded-lg bg-muted/20 p-3">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw size={12} className="text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {dismissedInsights.length} insight{dismissedInsights.length > 1 ? "s" : ""} dispensado{dismissedInsights.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={restore}
              className="ml-auto text-[10px] text-[#FF5722] hover:underline"
            >
              Restaurar todos
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {dismissedInsights.map((ins) => {
              const cfg = categoryConfig[ins.category];
              return (
                <button
                  key={ins.id}
                  onClick={() => handleRestoreOne(ins.id)}
                  className="text-[10px] px-2 py-1 rounded border border-border/50 bg-white hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.borderColor }} />
                  {ins.title.length > 40 ? ins.title.slice(0, 40) + "…" : ins.title}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Detail modal */}
      <InsightDetailModal
        insight={selectedInsight}
        open={!!selectedInsight}
        onClose={() => setSelectedInsight(null)}
        onDismiss={handleDismiss}
        onCrossRef={handleCrossRef}
      />

      <style>{`
        @keyframes insightPulse {
          0%, 100% { box-shadow: 0 0 0 2px transparent; }
          50% { box-shadow: 0 0 0 3px currentColor; }
        }
      `}</style>
    </div>
  );
}
