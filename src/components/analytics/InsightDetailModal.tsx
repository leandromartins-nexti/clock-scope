import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Link2 } from "lucide-react";
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle className="text-base font-semibold">{insight.title}</DialogTitle>
            <Badge
              variant="outline"
              className="text-[10px] font-semibold border"
              style={{ backgroundColor: cfg.bgColor, color: cfg.textColor, borderColor: cfg.borderColor }}
            >
              {cfg.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Diagnosis */}
          {modal?.diagnosis && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Diagnóstico</h4>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {modal.diagnosis}
              </div>
            </div>
          )}

          {/* Evidence */}
          {modal?.evidence && modal.evidence.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Evidências</h4>
              <div className="grid grid-cols-2 gap-2">
                {modal.evidence.map((ev, i) => (
                  <div key={i} className="bg-muted/40 rounded-lg p-3 border border-border/50">
                    <span className="text-[11px] text-muted-foreground block">{ev.label}</span>
                    <span className="text-sm font-semibold text-foreground">{ev.value}</span>
                    {ev.context && (
                      <span className="text-[10px] text-muted-foreground block mt-0.5 italic">{ev.context}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inline evidence (from card) */}
          {!modal?.evidence && insight.evidence && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Evidências</h4>
              <div className="flex items-center gap-3 bg-muted/40 rounded-lg p-3 border border-border/50">
                <div>
                  <span className="text-[11px] text-muted-foreground block">{insight.evidence.before.label}</span>
                  <span className="text-sm font-semibold text-foreground">{insight.evidence.before.value}</span>
                </div>
                <ArrowRight size={14} className="text-muted-foreground/50 flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-muted-foreground block">{insight.evidence.after.label}</span>
                  <span className="text-sm font-semibold text-foreground">{insight.evidence.after.value}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Plan */}
          {modal?.action_plan && modal.action_plan.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Plano de Ação</h4>
              <ol className="list-decimal list-inside space-y-1.5">
                {modal.action_plan.map((step, i) => (
                  <li key={i} className="text-sm text-muted-foreground leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Related cards */}
          {modal?.related_cards && modal.related_cards.length > 0 && onCrossRef && (
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Insights Relacionados</h4>
              <div className="flex flex-wrap gap-2">
                {modal.related_cards.map((cardId) => (
                  <button
                    key={cardId}
                    onClick={() => { onCrossRef(cardId); onClose(); }}
                    className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 border border-blue-200 rounded-full px-2.5 py-1 hover:bg-blue-50 transition-colors"
                  >
                    <Link2 size={10} />
                    {cardId}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-between sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => { onDismiss(insight.id); onClose(); }}
          >
            Dispensar este insight
          </Button>
          <Button variant="outline" size="sm" className="text-xs" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
