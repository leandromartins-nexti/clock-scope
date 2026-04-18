/**
 * InsightsTourOverlay — popover ancorado dinamicamente próximo ao PIN do insight
 * atual durante o tour. Move-se com transição suave a cada step e exibe seta
 * apontando para o pin. Backdrop escuro (30%) destaca o foco.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInsightsTour } from "@/contexts/InsightsTourContext";
import { categoryConfig } from "@/data/qualidadeInsightsData";
import { Pause, Play, ChevronLeft, ChevronRight, X } from "lucide-react";

const POPOVER_W = 360;
const POPOVER_H = 230; // estimativa (height varia com conteúdo)
const PIN_GAP = 28;    // distância da setinha até o pin
const MARGIN = 12;     // margem mínima do viewport

type Side = "top" | "bottom" | "left" | "right";

interface PopoverPos {
  left: number;
  top: number;
  side: Side;
  arrowOffset: number; // posição da seta no eixo perpendicular ao side
}

function computePos(pin: { x: number; y: number }, popH: number = POPOVER_H): PopoverPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const spaceTop = pin.y;
  const spaceBottom = vh - pin.y;
  const spaceLeft = pin.x;
  const spaceRight = vw - pin.x;

  // Sempre preferir exibir ACIMA do pin para não cobrir o gráfico abaixo.
  let side: Side = "top";
  if (spaceTop >= popH + PIN_GAP + MARGIN) side = "top";
  else if (spaceBottom >= popH + PIN_GAP + MARGIN) side = "bottom";
  else if (spaceRight >= POPOVER_W + PIN_GAP + MARGIN) side = "right";
  else side = "left";

  let left = 0;
  let top = 0;
  let arrowOffset = POPOVER_W / 2;

  if (side === "bottom" || side === "top") {
    let desiredLeft = pin.x - POPOVER_W / 2;
    desiredLeft = Math.max(MARGIN, Math.min(vw - POPOVER_W - MARGIN, desiredLeft));
    left = desiredLeft;
    arrowOffset = pin.x - left;
    arrowOffset = Math.max(16, Math.min(POPOVER_W - 16, arrowOffset));
    top = side === "bottom" ? pin.y + PIN_GAP : pin.y - popH - PIN_GAP;
  } else {
    let desiredTop = pin.y - popH / 2;
    desiredTop = Math.max(MARGIN, Math.min(vh - popH - MARGIN, desiredTop));
    top = desiredTop;
    arrowOffset = pin.y - top;
    arrowOffset = Math.max(16, Math.min(popH - 16, arrowOffset));
    left = side === "right" ? pin.x + PIN_GAP : pin.x - POPOVER_W - PIN_GAP;
  }

  return { left, top, side, arrowOffset };
}

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
    getPinPosition,
  } = useInsightsTour();

  const [pos, setPos] = useState<PopoverPos | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Recalcula posição quando o insight atual muda + a cada resize/scroll
  useLayoutEffect(() => {
    if (!tourActive || !tourCurrentInsight) {
      setPos(null);
      return;
    }
    const update = () => {
      const pin = getPinPosition(tourCurrentInsight.id);
      if (!pin) {
        setPos(null);
        return;
      }
      const measuredH = popoverRef.current?.offsetHeight || POPOVER_H;
      setPos(computePos(pin, measuredH));
    };
    update();
    // Reagenda nas próximas frames pra capturar pins que ainda estão sendo medidos
    const t1 = setTimeout(update, 60);
    const t2 = setTimeout(update, 200);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [tourActive, tourCurrentInsight, getPinPosition]);

  // Faz o pin ativo entrar em viewport (caso esteja fora)
  useEffect(() => {
    if (!tourActive || !tourCurrentInsight) return;
    const pin = getPinPosition(tourCurrentInsight.id);
    if (!pin) return;
    const vh = window.innerHeight;
    if (pin.y < 80 || pin.y > vh - 80) {
      window.scrollTo({ top: window.scrollY + pin.y - vh / 2, behavior: "smooth" });
    }
  }, [tourActive, tourCurrentInsight, getPinPosition]);

  if (!tourActive || !tourCurrentInsight) return null;
  const cfg = categoryConfig[tourCurrentInsight.category];

  // Estilos da setinha conforme o lado em que o popover ficou
  const arrowStyle: React.CSSProperties = pos
    ? (() => {
        const base: React.CSSProperties = {
          position: "absolute",
          width: 14,
          height: 14,
          background: "#fff",
          transform: "rotate(45deg)",
        };
        if (pos.side === "bottom") {
          return { ...base, top: -7, left: pos.arrowOffset - 7, borderTop: `3px solid ${cfg.borderColor}`, borderLeft: `3px solid ${cfg.borderColor}` };
        }
        if (pos.side === "top") {
          return { ...base, bottom: -7, left: pos.arrowOffset - 7, borderBottom: `3px solid ${cfg.borderColor}`, borderRight: `3px solid ${cfg.borderColor}` };
        }
        if (pos.side === "right") {
          return { ...base, left: -7, top: pos.arrowOffset - 7, borderBottom: `3px solid ${cfg.borderColor}`, borderLeft: `3px solid ${cfg.borderColor}` };
        }
        return { ...base, right: -7, top: pos.arrowOffset - 7, borderTop: `3px solid ${cfg.borderColor}`, borderRight: `3px solid ${cfg.borderColor}` };
      })()
    : {};

  return (
    <>
      {/* Backdrop com sombra 30% para destacar o pin/card focado */}
      <div className="fixed inset-0 z-[55] bg-black/30 pointer-events-none animate-in fade-in duration-300" aria-hidden />

      {/* Popover ancorado ao pin (fallback: canto inferior direito) */}
      <div
        ref={popoverRef}
        className="fixed z-[60] bg-white rounded-lg shadow-2xl border border-border/40"
        style={{
          width: POPOVER_W,
          left: pos?.left ?? window.innerWidth - POPOVER_W - 280,
          top: pos?.top ?? window.innerHeight - POPOVER_H - 16,
          borderTop: `3px solid ${cfg.borderColor}`,
          transition: "left 500ms cubic-bezier(0.22, 1, 0.36, 1), top 500ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {pos && <div style={arrowStyle} aria-hidden />}

        {/* Progress bar */}
        <div className="h-1 bg-muted/40 rounded-t-lg overflow-hidden">
          <div
            className="h-full transition-[width] ease-linear"
            style={{ width: `${tourProgress * 100}%`, background: cfg.borderColor, transitionDuration: tourPaused ? "0ms" : "100ms" }}
          />
        </div>

        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: cfg.bgColor, color: cfg.textColor }}>
                {cfg.label}
              </span>
              <span className="text-[10px] text-muted-foreground tabular-nums">{tourIndex + 1} / {tourTotal}</span>
            </div>
            <button onClick={stopTour} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Encerrar tour">
              <X size={14} />
            </button>
          </div>

          <h3 className="text-[13px] font-semibold text-foreground leading-snug mb-1.5">{tourCurrentInsight.title}</h3>

          {tourCurrentInsight.narrative && (
            <p className="text-[11px] leading-relaxed text-muted-foreground mb-2 line-clamp-4">{tourCurrentInsight.narrative}</p>
          )}

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

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-1">
              <button onClick={prevStep} disabled={tourIndex === 0} className="p-1 rounded hover:bg-muted/50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors" aria-label="Anterior">
                <ChevronLeft size={14} />
              </button>
              <button onClick={tourPaused ? resumeTour : pauseTour} className="p-1 rounded hover:bg-muted/50 transition-colors" aria-label={tourPaused ? "Retomar" : "Pausar"}>
                {tourPaused ? <Play size={14} /> : <Pause size={14} />}
              </button>
              <button onClick={nextStep} className="p-1 rounded hover:bg-muted/50 transition-colors" aria-label="Próximo">
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
