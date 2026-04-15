import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link2, CheckCircle2, FileText, BarChart3, Zap } from "lucide-react";
import { categoryConfig, type QualidadeInsight } from "@/data/qualidadeInsightsData";

interface Props {
  insight: QualidadeInsight | null;
  open: boolean;
  onClose: () => void;
  onDismiss: (id: string) => void;
  onCrossRef?: (targetId: string) => void;
}

export default function InsightDetailModal({ insight, open, onClose, onDismiss, onCrossRef }: Props) {
  if (!insight) return null;
  const cfg = categoryConfig[insight.category];
  const modal = insight.modal;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-0">
        {/* Colored top accent */}
        <div className="h-1 w-full rounded-t-lg" style={{ backgroundColor: cfg.borderColor }} />

        <div className="px-6 pt-4">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold border px-2 py-0.5"
                    style={{ backgroundColor: cfg.bgColor, color: cfg.textColor, borderColor: cfg.borderColor }}
                  >
                    {cfg.label}
                  </Badge>
                  {insight.severity === "critical" && (
                    <Badge variant="destructive" className="text-[10px] px-2 py-0.5">Crítico</Badge>
                  )}
                </div>
                <DialogTitle className="text-[15px] font-semibold leading-snug">{insight.title}</DialogTitle>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="px-6 pb-5 space-y-5 mt-3">
          {/* Diagnosis */}
          {modal?.diagnosis && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <FileText size={12} className="text-muted-foreground" />
                <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Diagnóstico</h4>
              </div>
              <div className="text-[13px] text-muted-foreground leading-relaxed whitespace-pre-line bg-muted/20 rounded-lg p-4 border border-border/30">
                {modal.diagnosis}
              </div>
            </div>
          )}

          {/* Evidence grid */}
          {modal?.evidence && modal.evidence.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <BarChart3 size={12} className="text-muted-foreground" />
                <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Evidências</h4>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {modal.evidence.map((ev, i) => (
                  <div
                    key={i}
                    className="rounded-lg p-3 border border-border/40 bg-background hover:bg-muted/20 transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground block leading-tight">{ev.label}</span>
                    <span className="text-sm font-bold text-foreground mt-0.5 block">{ev.value}</span>
                    {ev.context && (
                      <span className="text-[10px] text-muted-foreground/80 block mt-0.5 italic">{ev.context}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inline evidence fallback */}
          {!modal?.evidence && insight.evidence && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <BarChart3 size={12} className="text-muted-foreground" />
                <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Evidências</h4>
              </div>
              <div className="flex items-center gap-4 rounded-lg p-4 border border-border/40 bg-background">
                <div>
                  <span className="text-[10px] text-muted-foreground block">{insight.evidence.before.label}</span>
                  <span className="text-sm font-bold text-foreground">{insight.evidence.before.value}</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground/40 flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-foreground block">{insight.evidence.after.label}</span>
                  <span className="text-sm font-bold text-foreground">{insight.evidence.after.value}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Plan */}
          {modal?.action_plan && modal.action_plan.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={12} className="text-muted-foreground" />
                <h4 className="text-[11px] font-semibold text-foreground uppercase tracking-wider">Plano de Ação</h4>
              </div>
              <div className="space-y-1.5">
                {modal.action_plan.map((step, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-[13px] text-muted-foreground leading-relaxed">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related cards */}
          {modal?.related_cards && modal.related_cards.length > 0 && onCrossRef && (
            <div>
              <h4 className="text-[11px] font-semibold text-foreground mb-2 uppercase tracking-wider">Insights Relacionados</h4>
              <div className="flex flex-wrap gap-2">
                {modal.related_cards.map((cardId) => (
                  <button
                    key={cardId}
                    onClick={() => { onCrossRef(cardId); onClose(); }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 flex items-center gap-1.5 border border-blue-200 rounded-full px-3 py-1.5 hover:bg-blue-50 transition-all hover:shadow-sm font-medium"
                  >
                    <Link2 size={10} />
                    {cardId}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-3 border-t border-border/30 bg-muted/10 flex justify-end">
          <Button variant="outline" size="sm" className="text-xs" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
