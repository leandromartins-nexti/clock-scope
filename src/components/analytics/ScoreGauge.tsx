/**
 * ScoreGauge — semicircular gauge for operational health scores.
 * Shared across all Analytics pages.
 * 
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

  return (
    <svg width="100" height="58" viewBox="0 0 100 58">
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <path
        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${progress} ${circumference}`}
      />
      {label && (
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>
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
