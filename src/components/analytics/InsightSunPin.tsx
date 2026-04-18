/**
 * InsightSunPin — pin de insight estilo "SOL mini" com lâmpada animada.
 * Renderizado como SVG dentro de Recharts via <LabelList content={...}>.
 *
 * Posicionamento:
 *  - Calcula a posição relativa do ponto (cy) dentro do plot area [plotTop, plotBottom].
 *  - Se o ponto estiver na metade SUPERIOR (≤ 50%) → joga o pin para BAIXO (abaixo do plot, com padding).
 *  - Se o ponto estiver na metade INFERIOR (> 50%) → joga o pin para CIMA (acima do plot, com padding).
 *  - O pin fica SEMPRE FORA do plot area, com `padding` px de respiro.
 */
interface InsightSunPinProps {
  cx: number;
  cy: number;
  onClick: () => void;
  scale?: number;
  /** Padding em px entre o plot area e o pin (espaço em branco). */
  padding?: number;
  /** Topo do plot area (y do início da área de desenho). */
  plotTop?: number;
  /** Base do plot area (y do fim da área de desenho). */
  plotBottom?: number;
  /** Força direção. "auto" (default) decide pela posição relativa. */
  direction?: "up" | "down" | "auto";
  title?: string;
}

export default function InsightSunPin({
  cx,
  cy,
  onClick,
  scale = 0.45,
  padding = 5,
  plotTop = 0,
  plotBottom,
  direction = "auto",
  title = "Ver insight",
}: InsightSunPinProps) {
  const longR2 = 36 * scale;
  const r1 = 22 * scale;
  const shortR2 = 30 * scale;
  const glowR = 28 * scale;
  const bulbR = 20 * scale;
  const fontSize = Math.max(10, Math.round(24 * scale));

  // Decide posição: ACIMA ou ABAIXO do plot area
  let placeBelow = false;
  if (direction === "down") placeBelow = true;
  else if (direction === "up") placeBelow = false;
  else if (plotBottom !== undefined) {
    const plotHeight = plotBottom - plotTop;
    const relativeY = (cy - plotTop) / plotHeight; // 0 = topo, 1 = base
    // Ponto na metade superior → pin vai para BAIXO. Ponto na metade inferior → pin vai para CIMA.
    placeBelow = relativeY <= 0.5;
  }

  // Posição do pin SEMPRE fora do plot area, com padding de respiro
  const pinY = placeBelow
    ? (plotBottom ?? cy) + padding + longR2
    : plotTop - padding - longR2;

  // Linha tracejada conectando o ponto ao pin
  const stemY1 = placeBelow ? cy + 4 : cy - 4;
  const stemY2 = placeBelow ? pinY - longR2 : pinY + longR2;

  const handle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <g style={{ cursor: "pointer" }} onClick={handle}>
      <title>{title}</title>
      {/* Hit area transparente maior cobrindo toda a lâmpada + raios */}
      <circle cx={cx} cy={pinY} r={longR2 + 6} fill="#000" fillOpacity={0.001} onClick={handle} />
      <line x1={cx} y1={stemY1} x2={cx} y2={stemY2} stroke="#facc15" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} pointerEvents="none" />
      <g pointerEvents="none">
        <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${pinY}`} to={`360 ${cx} ${pinY}`} dur="12s" repeatCount="indefinite" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i * 22.5 * Math.PI) / 180;
          const long = i % 2 === 0;
          const r2 = long ? longR2 : shortR2;
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * r1}
              y1={pinY + Math.sin(a) * r1}
              x2={cx + Math.cos(a) * r2}
              y2={pinY + Math.sin(a) * r2}
              stroke="#facc15"
              strokeWidth={long ? 2.5 * scale : 1.8 * scale}
              strokeLinecap="round"
              opacity={0.85}
            >
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.07}s`} />
            </line>
          );
        })}
      </g>
      <circle cx={cx} cy={pinY} r={glowR} fill="#fde047" opacity={0.4} pointerEvents="none">
        <animate attributeName="opacity" values="0.25;0.7;0.25" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={pinY} r={bulbR} fill="#facc15" stroke="#fff" strokeWidth={Math.max(1.5, 3 * scale)} onClick={handle} />
      <text x={cx} y={pinY + fontSize / 3} textAnchor="middle" fontSize={fontSize} pointerEvents="none">💡</text>
    </g>
  );
}
