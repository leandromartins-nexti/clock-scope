/**
 * InsightsTourOverlay — popover fixo no canto inferior direito durante o tour,
 * exibindo o insight atual com narrativa, evidência e barra de progresso.
 * Usa ESC/Setas/Espaço (handled no contexto) e botões visuais.
 */
import { useInsightsTour } from "@/contexts/InsightsTourContext";
import { categoryConfig } from "@/data/qualidadeInsightsData";
import { Pause, Play, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function InsightsTourOverlay() {
  const {
    tourActive,
    tourPaused,
    tourIndex,
    tourTotal,
    tourCurrentInsight,
    tourProgress,
    pauseTour,
    resumeTour,
    nextStep,
    prevStep,
    stopTour,
  } = useInsightsTour();

  if (!tourActive || !tourCurrentInsight) return null;
  const cfg = categoryConfig[tourCurrentInsight.category];

  return (
    <>
      {/* Backdrop com sombra 30% para destacar o pin/card focado */}
      <div
        className="fixed inset-0 z-[55] bg-black/30 pointer-events-none animate-in fade-in duration-300"
        aria-hidden
      />
      <div
        className="fixed z-[60] bottom-4 right-[260px] w-[380px] bg-white rounded-lg shadow-2xl border border-border/40 animate-in slide-in-from-bottom-4 fade-in duration-300"
        style={{ borderTop: `3px solid ${cfg.borderColor}` }}
      >
        {/* Setinha apontando para cima (para o pin do gráfico) */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-l border-t border-border/40"
          style={{ borderTopColor: cfg.borderColor, borderLeftColor: cfg.borderColor, borderTopWidth: 3, borderLeftWidth: 3 }}
          aria-hidden
        />
      {/* Progress bar */}
      <div className="h-1 bg-muted/40">
        <div
          className="h-full transition-[width] ease-linear"
          style={{ width: `${tourProgress * 100}%`, background: cfg.borderColor, transitionDuration: tourPaused ? "0ms" : "100ms" }}
        />
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
              style={{ background: cfg.bgColor, color: cfg.textColor }}
            >
              {cfg.label}
            </span>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {tourIndex + 1} / {tourTotal}
            </span>
          </div>
          <button
            onClick={stopTour}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Encerrar tour"
          >
            <X size={14} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-[13px] font-semibold text-foreground leading-snug mb-1.5">
          {tourCurrentInsight.title}
        </h3>

        {/* Narrative */}
        {tourCurrentInsight.narrative && (
          <p className="text-[11px] leading-relaxed text-muted-foreground mb-2 line-clamp-4">
            {tourCurrentInsight.narrative}
          </p>
        )}

        {/* Evidence */}
        {tourCurrentInsight.evidence && (
          <div className="flex items-center gap-2 mb-3 bg-muted/30 rounded p-1.5 text-[10px]">
            <div className="flex-1 min-w-0">
              <span className="text-muted-foreground/70 block truncate text-[9px]">{tourCurrentInsight.evidence.before.label}</span>
              <span className="font-bold text-foreground">{tourCurrentInsight.evidence.before.value}</span>
            </div>
            <span className="text-muted-foreground/40">→</span>
            <div className="flex-1 min-w-0">
              <span className="text-muted-foreground/70 block truncate text-[9px]">{tourCurrentInsight.evidence.after.label}</span>
              <span className="font-bold text-foreground">{tourCurrentInsight.evidence.after.value}</span>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30">
          <div className="flex items-center gap-1">
            <button
              onClick={prevStep}
              disabled={tourIndex === 0}
              className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={tourPaused ? resumeTour : pauseTour}
              className="p-1 rounded hover:bg-muted/50 transition-colors"
              aria-label={tourPaused ? "Retomar" : "Pausar"}
            >
              {tourPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button
              onClick={nextStep}
              className="p-1 rounded hover:bg-muted/50 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight size={14} />
            </button>
          </div>
          <span className="text-[9px] text-muted-foreground/60">ESC encerra · ← → navega · espaço pausa</span>
        </div>
        </div>
      </div>
    </>
  );
}
