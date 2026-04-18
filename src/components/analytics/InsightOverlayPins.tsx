/**
 * InsightOverlayPins — overlay HTML absoluto que renderiza pins de insight
 * EXATAMENTE em cima do ponto (x, y) correspondente da série no gráfico Recharts.
 *
 * Posicionamento (sem CSS de offset, sem clamp, sem padding):
 *  - X: lê o centro real do tick do eixo X via getScreenCTM (pixel-perfect).
 *  - Y: converte o `value` em pixel usando o domínio do eixo (left/right) e a
 *    altura real do plot area medida no DOM (recharts-cartesian-grid).
 *
 *  O pin é centralizado no ponto via translate(-50%, -50%) — nada mais.
 */
import { useLayoutEffect, useRef, useState } from "react";
import InsightSunPin from "./InsightSunPin";
import type { PinType } from "@/data/qualidadeInsightsData";
import { useInsightsTour } from "@/contexts/InsightsTourContext";

export interface InsightOverlayPin {
  mesIndex: number;
  insightId: string;
  numericId?: number;
  type?: PinType;
  /** Valor numérico da série naquele índice — usado para calcular Y exato. */
  value?: number;
  /** Eixo Y a usar para a conversão valor→pixel. */
  axis?: "left" | "right";
  /** Nome da série (opcional, apenas referência). */
  series?: string;
  /** @deprecated mantido por compat; ignorado quando há value+axis+domain. */
  topPx?: number;
  /** @deprecated mantido por compat; ignorado. */
  offsetY?: number;
}

interface Props {
  pins: InsightOverlayPin[];
  totalMeses: number;
  onPinClick: (id: string, numericId?: number) => void;
  /** @deprecated mantido por compat — não usado no posicionamento. */
  paddingLeftPct?: number;
  /** @deprecated mantido por compat — não usado no posicionamento. */
  paddingRightPct?: number;
  direction?: "up" | "down";
  yDomainLeft?: [number, number];
  yDomainRight?: [number, number];
}

interface PlotInfo {
  top: number;
  left: number;
  width: number;
  height: number;
  tickCentersX: number[];
}

function usePlotArea(containerRef: React.RefObject<HTMLDivElement>) {
  const [area, setArea] = useState<PlotInfo | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // O SVG do Recharts é IRMÃO do overlay (ambos dentro do mesmo parent .relative).
    // Por isso buscamos no parent, não dentro do próprio overlay.
    const scope: HTMLElement = (el.parentElement as HTMLElement) ?? el;

    const measure = () => {
      const grid = scope.querySelector(".recharts-cartesian-grid") as SVGGraphicsElement | null;
      if (!grid) return false;
      const containerRect = el.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();

      const xAxis = scope.querySelector(".recharts-xAxis") as SVGGElement | null;
      const svg = scope.querySelector("svg.recharts-surface") as SVGSVGElement | null;
      const tickCentersX: number[] = [];
      if (xAxis && svg) {
        const ticks = xAxis.querySelectorAll(".recharts-cartesian-axis-tick");
        ticks.forEach((t) => {
          const tickG = t as SVGGElement;
          const lineEl = tickG.querySelector("line") as SVGLineElement | null;
          const textEl = tickG.querySelector("text") as SVGTextElement | null;
          let svgX: number | null = null;
          if (lineEl) svgX = parseFloat(lineEl.getAttribute("x1") ?? "NaN");
          if ((svgX === null || Number.isNaN(svgX)) && textEl) {
            svgX = parseFloat(textEl.getAttribute("x") ?? "NaN");
          }
          if (svgX === null || Number.isNaN(svgX)) {
            const r = tickG.getBoundingClientRect();
            tickCentersX.push(r.left + r.width / 2 - containerRect.left);
            return;
          }
          const ctm = tickG.getScreenCTM();
          if (!ctm) {
            tickCentersX.push(svgX);
            return;
          }
          const pt = svg.createSVGPoint();
          pt.x = svgX;
          pt.y = 0;
          const screenPt = pt.matrixTransform(ctm);
          tickCentersX.push(screenPt.x - containerRect.left);
        });
      }

      setArea({
        top: gridRect.top - containerRect.top,
        left: gridRect.left - containerRect.left,
        width: gridRect.width,
        height: gridRect.height,
        tickCentersX,
      });
      // DEBUG
      // eslint-disable-next-line no-console
      console.log("[InsightOverlayPins] measured", { tickCount: tickCentersX.length, gridLeft: gridRect.left - containerRect.left, gridWidth: gridRect.width });
      return true;
    };

    // Initial attempts
    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(scope);
    // MutationObserver: re-measure as Recharts mounts/updates SVG dentro do parent
    const mo = new MutationObserver(() => measure());
    mo.observe(scope, { childList: true, subtree: true, attributes: true, attributeFilter: ["width", "height", "transform", "x", "y", "x1", "y1", "x2", "y2"] });
    const t1 = setTimeout(measure, 50);
    const t2 = setTimeout(measure, 200);
    const t3 = setTimeout(measure, 500);
    const t4 = setTimeout(measure, 1000);
    return () => {
      ro.disconnect();
      mo.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [containerRef]);

  return area;
}

export default function InsightOverlayPins({
  pins,
  totalMeses,
  onPinClick,
  direction = "down",
  yDomainLeft,
  yDomainRight,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plot = usePlotArea(containerRef);
  const { hoveredId, setHoveredId } = useInsightsTour();

  // DEBUG
  // eslint-disable-next-line no-console
  console.log("[InsightOverlayPins] render", {
    pinsCount: pins.length,
    pins,
    plot: plot ? { top: plot.top, left: plot.left, width: plot.width, height: plot.height, ticks: plot.tickCentersX.length } : null,
    yDomainLeft,
    yDomainRight,
  });

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {plot &&
        pins.map((pin, idx) => {
          // X: para BarChart, cada categoria ocupa width/N e o centro está em (i + 0.5) * step.
          // Para LineChart/AreaChart, os pontos vão de 0 a width-1 (i / (N-1)).
          // Usamos a heurística do BarChart por padrão; quando há ticks suficientes (1 por categoria),
          // priorizamos o centro do tick real (mais preciso para line charts).
          let leftPx: number | undefined;
          if (plot.tickCentersX.length === totalMeses) {
            leftPx = plot.tickCentersX[pin.mesIndex];
          } else {
            const step = plot.width / totalMeses;
            leftPx = plot.left + step * (pin.mesIndex + 0.5);
          }
          if (leftPx === undefined || Number.isNaN(leftPx)) {
            console.warn("[InsightOverlayPins] skip - no x", { pin, ticks: plot.tickCentersX.length, totalMeses });
            return null;
          }

          let topPx: number | null = null;
          if (pin.value !== undefined && pin.axis) {
            const domain = pin.axis === "right" ? yDomainRight : yDomainLeft;
            if (domain) {
              const [min, max] = domain;
              const ratio = max === min ? 0 : (pin.value - min) / (max - min);
              const clamped = Math.max(0, Math.min(1, ratio));
              topPx = plot.top + plot.height * (1 - clamped);
            } else {
              console.warn("[InsightOverlayPins] skip - no domain for axis", { pin, axis: pin.axis });
            }
          } else {
            console.warn("[InsightOverlayPins] skip - missing value/axis", { pin });
          }
          if (topPx === null) return null;

          const isHighlighted = hoveredId === pin.insightId;
          return (
            <div
              key={`${pin.insightId}-${idx}`}
              className="absolute transition-transform duration-200"
              style={{
                left: `${leftPx}px`,
                top: `${topPx}px`,
                transform: `translate(-50%, -50%) scale(${isHighlighted ? 1.35 : 1})`,
                pointerEvents: "auto",
                filter: isHighlighted ? `drop-shadow(0 0 8px ${pin.type === "risk" ? "#ef4444" : pin.type === "achievement" ? "#22c55e" : pin.type === "opportunity" ? "#facc15" : "#3b82f6"})` : "none",
                zIndex: isHighlighted ? 30 : 20,
              }}
              onMouseEnter={() => setHoveredId(pin.insightId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <svg width="60" height="60" viewBox="-30 -30 60 60" style={{ overflow: "visible" }}>
                <InsightSunPin
                  cx={0}
                  cy={0}
                  onClick={() => onPinClick(pin.insightId, pin.numericId)}
                  scale={0.6}
                  distance={0}
                  direction={direction}
                  type={pin.type}
                />
              </svg>
            </div>
          );
        })}
    </div>
  );
}
