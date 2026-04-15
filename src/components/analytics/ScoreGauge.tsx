/**
 * ScoreGauge — semicircular gauge for operational health scores.
 * Shared across all Analytics pages.
 * 
 * Shows a multi-zone gradient background arc (Crítico → Ruim → Atenção → Bom → Excelente)
 * with the progress arc and pointer at the current score position.
 * Pass `color` to override the default threshold-based coloring.
 */
export default function ScoreGauge({
  score,
  max = 100,
  label,
  faixa,
  color: colorOverride,
}: {
  score: number;
  max?: number;
  label?: string;
  faixa?: string;
  color?: string;
}) {
  const radius = 36;
  const stroke = 7;
  const cx = 50;
  const cy = 44;
  const circumference = Math.PI * radius;
  const pct = Math.min(score / max, 1);
  const progress = pct * circumference;
  
  // Default fallback color (only used when no override is provided)
  const defaultColor =
    max === 100
      ? score >= 85
        ? "#22c55e"
        : score >= 70
        ? "#FF5722"
        : "#ef4444"
      : "#FF5722";
  
  const color = colorOverride || defaultColor;

  // Unique gradient ID to avoid conflicts when multiple gauges render
  const gradientId = `gauge-zones-${score}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg width="100" height="58" viewBox="0 0 100 58">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" stopOpacity={0.35} />
          <stop offset="25%" stopColor="#f87171" stopOpacity={0.30} />
          <stop offset="40%" stopColor="#f97316" stopOpacity={0.30} />
          <stop offset="60%" stopColor="#84cc16" stopOpacity={0.30} />
          <stop offset="100%" stopColor="#22c55e" stopOpacity={0.35} />
        </linearGradient>
      </defs>
      {/* Background: multi-zone gradient */}
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      {/* Progress arc */}
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
      />
      {label && (
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#1f2937">
          {label}
        </text>
      )}
      {faixa && (
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>
          {faixa}
        </text>
      )}
    </svg>
  );
}
