/**
 * InsightOverlayPins — overlay HTML absoluto que renderiza pins de insight
 * SOBRE um chart Recharts, totalmente FORA da árvore de eventos do SVG.
 * Isto garante que o clique no pin NÃO seja capturado pelo onClick do
 * ComposedChart/Bar/Line.
 *
 * Posicionamento: o pin do mês `i` (de N meses) é colocado em
 * (paddingLeft + (i + 0.5) * (1 - paddingLeft - paddingRight) / N) * 100%
 * horizontal e a uma `topPct` configurável vertical.
 */
import InsightSunPin from "./InsightSunPin";

export interface InsightOverlayPin {
  mesIndex: number; // 0-based index dentro do array de meses
  insightId: string;
  topPct?: number; // 0..1 — onde verticalmente posicionar (default 0.15)
}

interface Props {
  pins: InsightOverlayPin[];
  totalMeses: number;
  onPinClick: (id: string) => void;
  // Padding interno do plot area do Recharts (aproximado)
  paddingLeftPct?: number;
  paddingRightPct?: number;
  // Direção de exibição da lâmpada
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
        const topPct = pin.topPct ?? 0.15;
        return (
          <div
            key={`${pin.insightId}-${idx}`}
            className="absolute"
            style={{
              left: `${xPct * 100}%`,
              top: `${topPct * 100}%`,
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
