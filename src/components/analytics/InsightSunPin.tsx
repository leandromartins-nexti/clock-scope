/**
 * InsightSunPin — pin de insight estilo "SOL mini" com lâmpada animada.
 * Suporta 4 variantes via prop `type` (risk/achievement/opportunity/trend),
 * cada uma com cor + emoji próprios mapeados em PIN_TYPE_VISUALS.
 */
import { PIN_TYPE_VISUALS, type PinType } from "@/data/qualidadeInsightsData";

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
  type?: PinType;
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
  type = "opportunity",
}: InsightSunPinProps) {
  const visuals = PIN_TYPE_VISUALS[type];
  const color = visuals.color;
  const IconCmp = visuals.icon;

  const longR2 = 36 * scale;
  const r1 = 22 * scale;
  const shortR2 = 30 * scale;
  const glowR = 28 * scale;
  const bulbR = 20 * scale;
  const iconSize = Math.max(12, Math.round(22 * scale));

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
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };

  return (
    <g style={{ cursor: "pointer" }} onClick={handle}>
      <title>{`${visuals.label}: ${title}`}</title>
      <circle cx={cx} cy={pinY} r={longR2 + 6} fill="#000" fillOpacity={0.001} onClick={handle} />
      <line x1={cx} y1={stemY1} x2={cx} y2={stemY2} stroke={color} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.6} pointerEvents="none" />
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
              stroke={color}
              strokeWidth={long ? 2.5 * scale : 1.8 * scale}
              strokeLinecap="round"
              opacity={0.85}
            >
              <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" begin={`${i * 0.07}s`} />
            </line>
          );
        })}
      </g>
      <circle cx={cx} cy={pinY} r={glowR} fill={color} opacity={0.35} pointerEvents="none">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={pinY} r={bulbR} fill={color} stroke="#fff" strokeWidth={Math.max(1.5, 3 * scale)} onClick={handle} />
      <foreignObject x={cx - iconSize / 2} y={pinY - iconSize / 2} width={iconSize} height={iconSize} pointerEvents="none">
        <div style={{ width: iconSize, height: iconSize, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
          <IconCmp size={iconSize} strokeWidth={2.5} />
        </div>
      </foreignObject>
    </g>
  );
}

