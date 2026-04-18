/**
 * InsightOverlayPins — overlay HTML absoluto que renderiza pins de insight
 * SOBRE um chart Recharts, totalmente FORA da árvore de eventos do SVG.
 *
 * Posicionamento:
 *  - Horizontal: paddingLeft + (i + 0.5) * usableWidth / N
 *  - Vertical: `topPx` pixels a partir do topo do container (default 20px,
 *    ou seja, 20px abaixo do topo do gráfico, DENTRO da área do plot).
 *
 * Para evitar que o pin seja cortado quando posicionado próximo ao topo,
 * o componente ChartCard que envolve o gráfico deve ter `pt-6` (ou similar)
 * para abrir espaço acima do plot area.
 */
import InsightSunPin from "./InsightSunPin";

export interface InsightOverlayPin {
  mesIndex: number; // 0-based index dentro do array de meses
  insightId: string;
  topPx?: number; // pixels a partir do topo do container (default 20)
}

interface Props {
  pins: InsightOverlayPin[];
  totalMeses: number;
  onPinClick: (id: string) => void;
  paddingLeftPct?: number;
  paddingRightPct?: number;
  direction?: "up" | "down";
}

export default function InsightOverlayPins({
  pins,
  totalMeses,
  onPinClick,
  paddingLeftPct = 0.07,
  paddingRightPct = 0.04,
  direction = "down",
}: Props) {
  const usable = 1 - paddingLeftPct - paddingRightPct;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
      {pins.map((pin, idx) => {
        const xPct = paddingLeftPct + ((pin.mesIndex + 0.5) / totalMeses) * usable;
        const topPx = pin.topPx ?? 20;
        return (
          <div
            key={`${pin.insightId}-${idx}`}
            className="absolute"
            style={{
              left: `${xPct * 100}%`,
              top: `${topPx}px`,
              transform: "translate(-50%, -50%)",
              pointerEvents: "auto",
            }}
          >
            <svg width="60" height="60" viewBox="-30 -30 60 60" style={{ overflow: "visible" }}>
              <InsightSunPin
                cx={0}
                cy={0}
                onClick={() => onPinClick(pin.insightId)}
                scale={0.6}
                distance={0}
                direction={direction}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}
