/**
 * InsightOverlayPins — overlay HTML absoluto que renderiza pins de insight
 * SOBRE um chart Recharts, totalmente FORA da árvore de eventos do SVG.
 *
 * Posicionamento:
 *  - Horizontal: paddingLeft + (i + 0.5) * usableWidth / N
 *  - Vertical: calculado AUTOMATICAMENTE a partir do `value` da série âncora,
 *    convertendo-o em pixels usando a área do plot (medida via SVG do Recharts)
 *    e o domínio Y indicado (`axis`: left | right). Pode ser refinado com `offsetY`.
 *
 *  - Fallback: se `value` não vier, usa `topPx` (legado) ou 20px.
 */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import InsightSunPin from "./InsightSunPin";
import type { PinType } from "@/data/qualidadeInsightsData";

export interface InsightOverlayPin {
  mesIndex: number; // 0-based index dentro do array de meses
  insightId: string; // legacy id (kept for click resolution)
  numericId?: number; // preferred id used by JSON-driven pins
  type?: PinType; // visual variant
  topPx?: number; // legacy: pixels a partir do topo do container

  /** Nome da série a ancorar (apenas para cálculo automático). */
  series?: string;
  /** Valor (numérico) da série naquele índice — necessário para cálculo automático. */
  value?: number;
  /** Eixo Y a usar no cálculo. */
  axis?: "left" | "right";
  /** Ajuste fino vertical em pixels (negativo = sobe). Default: -28. */
  offsetY?: number;
}

interface Props {
  pins: InsightOverlayPin[];
  totalMeses: number;
  onPinClick: (id: string, numericId?: number) => void;
  paddingLeftPct?: number;
  paddingRightPct?: number;
  direction?: "up" | "down";
  /** Domínio do eixo Y esquerdo [min, max]. Necessário para pins ancorados em axis=left. */
  yDomainLeft?: [number, number];
  /** Domínio do eixo Y direito [min, max]. Necessário para pins ancorados em axis=right. */
  yDomainRight?: [number, number];
}

/**
 * Mede a área do plot do gráfico Recharts (recharts-cartesian-grid)
 * em coordenadas relativas ao container do overlay.
 */
interface PlotInfo {
  top: number;
  left: number;
  width: number;
  height: number;
  /** Centros x reais (em px relativos ao container) de cada tick do eixo X. */
  tickCentersX: number[];
}

function usePlotArea(containerRef: React.RefObject<HTMLDivElement>) {
  const [area, setArea] = useState<PlotInfo | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const grid = el.querySelector(".recharts-cartesian-grid") as SVGGraphicsElement | null;
      if (!grid) return;
      const containerRect = el.getBoundingClientRect();
      const gridRect = grid.getBoundingClientRect();

      // Lê a posição EXATA de cada categoria no eixo X.
      // Estratégia: usar o atributo `x` do <line> interno do tick (coordenada SVG
      // ancorada na categoria), convertido para o sistema de coordenadas do
      // container via getCTM. Isso evita o erro do bounding box do <text>, que
      // inclui padding do label e desloca o centro alguns pixels.
      const xAxis = el.querySelector(".recharts-xAxis") as SVGGElement | null;
      const svg = el.querySelector("svg.recharts-surface") as SVGSVGElement | null;
      let tickCentersX: number[] = [];
      if (xAxis && svg) {
        const ticks = xAxis.querySelectorAll(".recharts-cartesian-axis-tick");
        ticks.forEach((t) => {
          const tickG = t as SVGGElement;
          const lineEl = tickG.querySelector("line") as SVGLineElement | null;
          const textEl = tickG.querySelector("text") as SVGTextElement | null;
          // x do tick em coordenadas SVG: prioriza <line x1>, fallback <text x>
          let svgX: number | null = null;
          if (lineEl) {
            svgX = parseFloat(lineEl.getAttribute("x1") ?? "NaN");
          }
          if ((svgX === null || Number.isNaN(svgX)) && textEl) {
            svgX = parseFloat(textEl.getAttribute("x") ?? "NaN");
          }
          if (svgX === null || Number.isNaN(svgX)) {
            // Fallback final: bounding box
            const r = tickG.getBoundingClientRect();
            tickCentersX.push(r.left + r.width / 2 - containerRect.left);
            return;
          }
          // Converte (svgX, 0) do espaço do tick para o espaço da tela
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
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const t = setTimeout(measure, 50);
    const t2 = setTimeout(measure, 200);
    const t3 = setTimeout(measure, 500);
    return () => {
      ro.disconnect();
      clearTimeout(t);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [containerRef]);

  return area;
}

export default function InsightOverlayPins({
  pins,
  totalMeses,
  onPinClick,
  paddingLeftPct = 0.07,
  paddingRightPct = 0.04,
  direction = "down",
  yDomainLeft,
  yDomainRight,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plot = usePlotArea(containerRef);
  const usable = 1 - paddingLeftPct - paddingRightPct;

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {pins.map((pin, idx) => {
        // Horizontal: usa o centro REAL do tick correspondente (precisão pixel-perfect
        // mesmo com barCategoryGap/barGap do Recharts). Fallback para cálculo proporcional.
        let leftPx: number;
        if (plot && plot.tickCentersX[pin.mesIndex] !== undefined) {
          leftPx = plot.tickCentersX[pin.mesIndex];
        } else if (plot) {
          leftPx = plot.left + ((pin.mesIndex + 0.5) / totalMeses) * plot.width;
        } else {
          leftPx = 0;
        }

        // Vertical: cálculo automático baseado no value/axis, fallback para topPx legado
        let topPx: number;
        const offsetY = pin.offsetY ?? -28;

        if (plot && pin.value !== undefined && pin.axis) {
          const domain = pin.axis === "right" ? yDomainRight : yDomainLeft;
          if (domain) {
            const [min, max] = domain;
            const ratio = max === min ? 0 : (pin.value - min) / (max - min);
            const clamped = Math.max(0, Math.min(1, ratio));
            topPx = plot.top + plot.height * (1 - clamped) + offsetY;
          } else {
            topPx = pin.topPx ?? 20;
          }
        } else {
          topPx = pin.topPx ?? 20;
        }

        // Clamp horizontal: pin tem ~60px, então mantém 30px de margem em
        // relação às bordas do CONTAINER para nunca ser cortado.
        if (plot) {
          const containerWidth = containerRef.current?.clientWidth ?? Infinity;
          leftPx = Math.max(30, Math.min(containerWidth - 30, leftPx));
        }

        const positioning: React.CSSProperties = plot
          ? { left: `${leftPx}px`, top: `${topPx}px` }
          : { left: `${(paddingLeftPct + ((pin.mesIndex + 0.5) / totalMeses) * usable) * 100}%`, top: `${pin.topPx ?? 20}px` };

        return (
          <div
            key={`${pin.insightId}-${idx}`}
            className="absolute"
            style={{
              ...positioning,
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
            }}
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
