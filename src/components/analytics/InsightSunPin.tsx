/**
 * InsightSunPin — pin de insight estilo "SOL mini" com lâmpada animada.
 * Renderizado como SVG dentro de Recharts via <LabelList content={...}>.
 * Por padrão posiciona-se 40px ACIMA do ponto (cx, cy). Se não houver espaço
 * suficiente acima (estouraria o topo do plot area), inverte para BAIXO.
 */
interface InsightSunPinProps {
  cx: number;
  cy: number;
  onClick: () => void;
  scale?: number;
  distance?: number;
  plotTop?: number;
  plotBottom?: number;
  direction?: "up" | "down" | "auto";
  title?: string;
}

export default function InsightSunPin({
  cx,
  cy,
  onClick,
  scale = 0.45,
  distance = 40,
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

  const required = distance + longR2;
  let placeBelow = false;
  if (direction === "down") placeBelow = true;
  else if (direction === "up") placeBelow = false;
  else {
    const spaceAbove = cy - plotTop;
    if (spaceAbove < required) placeBelow = true;
    if (placeBelow && plotBottom !== undefined) {
      const spaceBelow = plotBottom - cy;
      if (spaceBelow < required && spaceAbove >= spaceBelow) placeBelow = false;
    }
  }

  const pinY = placeBelow ? cy + distance : cy - distance;
  const stemY1 = placeBelow ? cy - 4 : cy + 4;
  const stemY2 = placeBelow ? pinY - bulbR * 0.9 : pinY + bulbR * 0.9;

  const handle = (e: React.MouseEvent) => {
    console.log("[InsightSunPin] click", { cx, cy, pinY });
    e.stopPropagation();
    e.preventDefault();
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
