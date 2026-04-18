/**
 * InsightSunPin — pin de insight estilo "SOL mini" com lâmpada animada.
 * Renderizado como SVG dentro de Recharts via <LabelList content={...}>.
 * Posiciona-se 40px acima do ponto (cx, cy) recebido.
 */
interface InsightSunPinProps {
  cx: number;
  cy: number;
  onClick: () => void;
  scale?: number;
  offsetY?: number;
  title?: string;
}

export default function InsightSunPin({
  cx,
  cy,
  onClick,
  scale = 0.45,
  offsetY = -40,
  title = "Ver insight",
}: InsightSunPinProps) {
  const pinY = cy + offsetY;
  const r1 = 22 * scale;
  const longR2 = 36 * scale;
  const shortR2 = 30 * scale;
  const glowR = 28 * scale;
  const bulbR = 20 * scale;
  const fontSize = Math.max(10, Math.round(24 * scale));

  return (
    <g style={{ cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <title>{title}</title>
      <line x1={cx} y1={cy + 4} x2={cx} y2={pinY + bulbR * 0.9} stroke="#facc15" strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} />
      <g>
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
      <circle cx={cx} cy={pinY} r={glowR} fill="#fde047" opacity={0.4}>
        <animate attributeName="opacity" values="0.25;0.7;0.25" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={pinY} r={bulbR} fill="#facc15" stroke="#fff" strokeWidth={Math.max(1.5, 3 * scale)}>
        <animate attributeName="fill" values="#fde047;#facc15;#fde047" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <text x={cx} y={pinY + fontSize / 3} textAnchor="middle" fontSize={fontSize}>💡</text>
    </g>
  );
}
