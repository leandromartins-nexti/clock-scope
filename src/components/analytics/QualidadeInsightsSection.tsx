import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { AlertTriangle, Trophy, Lightbulb, Activity, ArrowRight, Link2, RotateCcw, ChevronDown, ChevronUp, Eye } from "lucide-react";
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
  const [expandedCats, setExpandedCats] = useState<Record<string, boolean>>({});
  const [showDismissed, setShowDismissed] = useState(false);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!highlightedId) return;
    const t = setTimeout(() => setHighlightedId(null), 2000);
    return () => clearTimeout(t);
  }, [highlightedId]);

  const activeInsights = useMemo(
    () => qualidadeInsights.filter((i) => !dismissed.includes(i.id)),
    [qualidadeInsights, dismissed]
  );

  const dismissedInsights = useMemo(
    () => qualidadeInsights.filter((i) => dismissed.includes(i.id)),
    [qualidadeInsights, dismissed]
  );

  const byCategory = useMemo(() => {
    const m: Record<string, QualidadeInsight[]> = {};
    for (const cat of categories) m[cat] = [];
    for (const ins of activeInsights) {
      m[ins.category]?.push(ins);
    }
    for (const cat of categories) {
      m[cat].sort((a, b) => (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5));
    }
    return m;
  }, [activeInsights]);

  const handleDismiss = useCallback((id: string) => {
    setFadingOut(id);
    setTimeout(() => { dismiss(id); setFadingOut(null); }, 250);
  }, [dismiss]);

  const handleCrossRef = useCallback((targetId: string) => {
    setHighlightedId(targetId);
    const el = cardRefs.current[targetId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleRestoreOne = useCallback((id: string) => {
    const key = `dismissed_insights_${customerId}_qualidade`;
    const current = dismissed.filter(d => d !== id);
    localStorage.setItem(key, JSON.stringify(current));
    restore();
    setTimeout(() => { current.forEach(d => dismiss(d)); }, 0);
  }, [dismissed, restore, dismiss, customerId]);

  const toggleCat = useCallback((cat: string) => {
    setExpandedCats(prev => ({ ...prev, [cat]: !prev[cat] }));
  }, []);

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

  // Max visible cards per category before "show more"
  const MAX_VISIBLE = 2;

  return (
    <div className="mt-6 mb-2">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#FF5722]/10">
          <Lightbulb size={14} className="text-[#FF5722]" />
        </div>
        <span className="text-sm font-semibold text-foreground tracking-tight">Insights da Qualidade do Ponto</span>
        <div className="flex items-center gap-1.5 ml-1">
          <span className="text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full">
            {activeInsights.length} ativo{activeInsights.length !== 1 ? "s" : ""}
          </span>
        </div>
        {dismissedInsights.length > 0 && (
          <button
            onClick={() => setShowDismissed(!showDismissed)}
            className="ml-auto text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={10} />
            {dismissedInsights.length} dispensado{dismissedInsights.length > 1 ? "s" : ""}
          </button>
        )}
      </div>

      {/* Category columns */}
      <div className="grid grid-cols-4 gap-4">
        {categories.map((cat) => {
          const cfg = categoryConfig[cat];
          const items = byCategory[cat];
          const Icon = iconMap[cfg.icon];
          const isExpanded = expandedCats[cat] ?? false;
          const visibleItems = isExpanded ? items : items.slice(0, MAX_VISIBLE);
          const hasMore = items.length > MAX_VISIBLE;

          return (
            <div key={cat} className="flex flex-col">
              {/* Category header */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-t-lg"
                style={{ backgroundColor: cfg.bgColor, borderBottom: `2px solid ${cfg.borderColor}` }}
              >
                <Icon size={13} style={{ color: cfg.textColor }} />
                <span className="text-[11px] font-semibold tracking-wide" style={{ color: cfg.textColor }}>
                  {cfg.label}
                </span>
                <span
                  className="ml-auto text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full"
                  style={{ backgroundColor: cfg.borderColor + "18", color: cfg.textColor }}
                >
                  {items.length}
                </span>
              </div>

              {/* Cards area */}
              <div className="bg-muted/15 rounded-b-lg border border-t-0 border-border/30 flex-1 flex flex-col">
                {items.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center py-8">
                    <p className="text-[11px] text-muted-foreground/60 italic">Nenhum insight nesta categoria</p>
                  </div>
                ) : (
                  <div className="p-2 flex flex-col gap-2">
                    {visibleItems.map((ins) => {
                      const isFading = fadingOut === ins.id;
                      const isHighlighted = highlightedId === ins.id;
                      return (
                        <div
                          key={ins.id}
                          ref={(el) => { cardRefs.current[ins.id] = el; }}
                          className="group rounded-lg bg-background border border-border/40 hover:border-border/80 p-3 transition-all cursor-pointer hover:shadow-md"
                          style={{
                            opacity: isFading ? 0 : 1,
                            transform: isFading ? "scale(0.96) translateY(4px)" : "scale(1) translateY(0)",
                            transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
                            boxShadow: isHighlighted ? `0 0 0 2px ${cfg.borderColor}, 0 4px 12px ${cfg.borderColor}30` : undefined,
                          }}
                          onClick={() => setSelectedInsight(ins)}
                        >
                          {/* Title */}
                          <p className="text-[12px] font-semibold leading-snug text-foreground mb-1.5 line-clamp-2 group-hover:text-foreground/90">
                            {ins.title}
                          </p>

                          {/* Narrative */}
                          <p className="text-[11px] leading-relaxed text-muted-foreground mb-2 line-clamp-3">
                            {ins.narrative}
                          </p>

                          {/* Cross-ref */}
                          {ins.crossRef && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCrossRef(ins.crossRef!.targetId); }}
                              className="text-[10px] text-blue-600 hover:text-blue-700 flex items-center gap-1 mb-2 font-medium transition-colors"
                            >
                              <Link2 size={9} />
                              {ins.crossRef.label}
                            </button>
                          )}

                          {/* Evidence pill */}
                          {ins.evidence && (
                            <div className="flex items-center gap-2 mb-2 rounded-md p-2" style={{ backgroundColor: cfg.bgColor + "80" }}>
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] text-muted-foreground block leading-tight truncate">{ins.evidence.before.label}</span>
                                <span className="text-[12px] font-bold text-foreground">{ins.evidence.before.value}</span>
                              </div>
                              <ArrowRight size={10} className="text-muted-foreground/40 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] text-muted-foreground block leading-tight truncate">{ins.evidence.after.label}</span>
                                <span className="text-[12px] font-bold text-foreground">{ins.evidence.after.value}</span>
                              </div>
                            </div>
                          )}

                          {/* Action */}
                          <p className="text-[10px] text-muted-foreground italic leading-snug mb-2">
                            <span className="not-italic">💡</span> {ins.action}
                          </p>

                          {/* Footer actions */}
                          <div className="flex items-center justify-between pt-1.5 border-t border-border/20">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedInsight(ins); }}
                              className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                            >
                              <Eye size={10} />
                              Detalhes
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDismiss(ins.id); }}
                              className="text-[10px] text-muted-foreground/60 hover:text-destructive transition-colors"
                            >
                              Dispensar
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Show more/less */}
                    {hasMore && (
                      <button
                        onClick={() => toggleCat(cat)}
                        className="text-[10px] text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-1.5 transition-colors"
                      >
                        {isExpanded ? (
                          <><ChevronUp size={11} /> Mostrar menos</>
                        ) : (
                          <><ChevronDown size={11} /> +{items.length - MAX_VISIBLE} mais</>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dismissed drawer */}
      {showDismissed && dismissedInsights.length > 0 && (
        <div className="mt-3 border border-border/30 rounded-lg bg-muted/10 p-3 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 mb-2.5">
            <RotateCcw size={11} className="text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground">Insights dispensados</span>
            <button
              onClick={() => { restore(); setShowDismissed(false); }}
              className="ml-auto text-[10px] text-[#FF5722] hover:text-[#FF5722]/80 font-medium transition-colors"
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
                  className="text-[10px] px-2.5 py-1 rounded-full border border-border/40 bg-background hover:bg-muted/40 text-muted-foreground hover:text-foreground transition-all flex items-center gap-1.5 hover:shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.borderColor }} />
                  <span className="truncate max-w-[200px]">{ins.title}</span>
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
