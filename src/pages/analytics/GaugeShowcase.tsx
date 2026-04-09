
const score = 87;
const faixa = "Bom";
const color = "#16a34a";
const trackColor = "#e5e7eb";

// Helper for arc-based gauges
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

// ── V1: Current (half-arc) ──
function V1() {
  const r = 36, sw = 7, cx = 50, cy = 44;
  const circ = Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <svg width="100" height="58" viewBox="0 0 100 58">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={trackColor} strokeWidth={sw} strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${prog} ${circ}`}/>
      <text x={cx} y={cy-6} textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{score}</text>
      <text x={cx} y={cy+8} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{faixa}</text>
    </svg>
  );
}

// ── V2: Full donut ring ──
function V2() {
  const r = 38, sw = 8, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={sw}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${prog} ${circ}`} strokeDashoffset={circ * 0.25} transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy-2} textAnchor="middle" fontSize="22" fontWeight="800" fill={color}>{score}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{faixa}</text>
    </svg>
  );
}

// ── V3: 270° arc ──
function V3() {
  const cx = 55, cy = 55, r = 40, sw = 9;
  const startA = 135, totalA = 270;
  const endA = startA + totalA * (score / 100);
  return (
    <svg width="110" height="90" viewBox="0 0 110 90">
      <path d={describeArc(cx, cy, r, startA, startA + totalA)} fill="none" stroke={trackColor} strokeWidth={sw} strokeLinecap="round"/>
      <path d={describeArc(cx, cy, r, startA, endA)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <text x={cx} y={cy} textAnchor="middle" fontSize="24" fontWeight="800" fill={color}>{score}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fontSize="10" fontWeight="600" fill={color}>{faixa}</text>
    </svg>
  );
}

// ── V4: Thick arc with rounded badge ──
function V4() {
  const r = 36, sw = 12, cx = 50, cy = 44;
  const circ = Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <svg width="100" height="62" viewBox="0 0 100 62">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${prog} ${circ}`}/>
      <text x={cx} y={cy-4} textAnchor="middle" fontSize="20" fontWeight="800" fill={color}>{score}</text>
      <rect x={cx-14} y={cy+2} width="28" height="12" rx="6" fill={color} fillOpacity="0.12"/>
      <text x={cx} y={cy+11} textAnchor="middle" fontSize="8" fontWeight="700" fill={color}>{faixa}</text>
    </svg>
  );
}

// ── V5: Minimalist thin ring ──
function V5() {
  const r = 40, sw = 3, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${prog} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+2} textAnchor="middle" fontSize="26" fontWeight="300" fill="#1e293b">{score}</text>
      <text x={cx} y={cy+14} textAnchor="middle" fontSize="9" fontWeight="500" fill="#94a3b8">{faixa}</text>
    </svg>
  );
}

// ── V6: Double arc (bg + fill) with dot indicator ──
function V6() {
  const cx = 55, cy = 55, r = 40, sw = 7;
  const startA = 135, totalA = 270;
  const endA = startA + totalA * (score / 100);
  const dotPos = polarToCartesian(cx, cy, r, endA);
  return (
    <svg width="110" height="90" viewBox="0 0 110 90">
      <path d={describeArc(cx, cy, r, startA, startA + totalA)} fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"/>
      <path d={describeArc(cx, cy, r, startA, endA)} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
      <circle cx={dotPos.x} cy={dotPos.y} r="5" fill={color} stroke="white" strokeWidth="2"/>
      <text x={cx} y={cy-1} textAnchor="middle" fontSize="22" fontWeight="800" fill="#1e293b">{score}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{faixa}</text>
    </svg>
  );
}

// ── V7: Gradient fill donut ──
function V7() {
  const r = 38, sw = 10, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="g7" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#22c55e"/>
          <stop offset="100%" stopColor="#16a34a"/>
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#g7)" strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${prog} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`}/>
      <text x={cx} y={cy+3} textAnchor="middle" fontSize="24" fontWeight="700" fill="#1e293b">{score}</text>
      <text x={cx} y={cy+15} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{faixa}</text>
    </svg>
  );
}

// ── V8: Speedometer with needle ──
function V8() {
  const cx = 55, cy = 50, r = 38, sw = 8;
  const startA = 180, totalA = 180;
  const needleA = startA + totalA * (score / 100);
  const np = polarToCartesian(cx, cy, r - 14, needleA);
  return (
    <svg width="110" height="65" viewBox="0 0 110 65">
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"/>
      <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${(score / 100) * Math.PI * r} ${Math.PI * r}`}/>
      <line x1={cx} y1={cy} x2={np.x} y2={np.y} stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="4" fill="#374151"/>
      <text x={cx} y={cy-12} textAnchor="middle" fontSize="16" fontWeight="800" fill={color}>{score}</text>
    </svg>
  );
}

// ── V9: Pill/bar style (horizontal) ──
function V9() {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl font-bold" style={{ color }}>{score}</span>
      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }}/>
      </div>
      <span className="text-[9px] font-semibold" style={{ color }}>{faixa}</span>
    </div>
  );
}

// ── V10: Stacked semicircle (two layers) ──
function V10() {
  const cx = 50, cy = 44, r1 = 36, r2 = 28, sw = 5;
  const circ1 = Math.PI * r1, circ2 = Math.PI * r2;
  return (
    <svg width="100" height="58" viewBox="0 0 100 58">
      <path d={`M ${cx-r1} ${cy} A ${r1} ${r1} 0 0 1 ${cx+r1} ${cy}`} fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"/>
      <path d={`M ${cx-r1} ${cy} A ${r1} ${r1} 0 0 1 ${cx+r1} ${cy}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${(score/100)*circ1} ${circ1}`}/>
      <path d={`M ${cx-r2} ${cy} A ${r2} ${r2} 0 0 1 ${cx+r2} ${cy}`} fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"/>
      <path d={`M ${cx-r2} ${cy} A ${r2} ${r2} 0 0 1 ${cx+r2} ${cy}`} fill="none" stroke="#86efac" strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${(score/100)*circ2} ${circ2}`}/>
      <text x={cx} y={cy-6} textAnchor="middle" fontSize="18" fontWeight="700" fill={color}>{score}</text>
      <text x={cx} y={cy+8} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{faixa}</text>
    </svg>
  );
}

// ── V11: Segmented arc ──
function V11() {
  const cx = 55, cy = 55, r = 40, sw = 8;
  const startA = 135, totalA = 270;
  const segments = 20;
  const filled = Math.round(segments * (score / 100));
  const gap = totalA / segments;
  return (
    <svg width="110" height="90" viewBox="0 0 110 90">
      {Array.from({ length: segments }).map((_, i) => {
        const a1 = startA + i * gap + 1;
        const a2 = startA + (i + 1) * gap - 1;
        return (
          <path key={i} d={describeArc(cx, cy, r, a1, a2)} fill="none"
            stroke={i < filled ? color : "#e2e8f0"} strokeWidth={sw} strokeLinecap="round"/>
        );
      })}
      <text x={cx} y={cy} textAnchor="middle" fontSize="22" fontWeight="800" fill={color}>{score}</text>
      <text x={cx} y={cy+13} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{faixa}</text>
    </svg>
  );
}

// ── V12: Flat card with big number ──
function V12() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-full border-4 flex items-center justify-center" style={{ borderColor: color }}>
        <span className="text-lg font-bold" style={{ color }}>{score}</span>
      </div>
      <div>
        <p className="text-xs font-semibold" style={{ color }}>{faixa}</p>
        <p className="text-[10px] text-gray-400">de 100</p>
      </div>
    </div>
  );
}

// ── V13: Radial with glow effect ──
function V13() {
  const r = 38, sw = 8, cx = 50, cy = 50;
  const circ = 2 * Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <defs>
        <filter id="glow13"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth={sw}/>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${prog} ${circ}`} transform={`rotate(-90 ${cx} ${cy})`} filter="url(#glow13)"/>
      <text x={cx} y={cy+3} textAnchor="middle" fontSize="24" fontWeight="800" fill={color}>{score}</text>
      <text x={cx} y={cy+16} textAnchor="middle" fontSize="9" fontWeight="600" fill="#64748b">{faixa}</text>
    </svg>
  );
}

// ── V14: Arc with colored background fill ──
function V14() {
  const cx = 50, cy = 44, r = 36, sw = 7;
  const circ = Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-xl" style={{ background: `${color}08` }}/>
      <div className="relative flex flex-col items-center py-2">
        <svg width="100" height="52" viewBox="0 0 100 52">
          <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={`${color}20`} strokeWidth={sw} strokeLinecap="round"/>
          <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${prog} ${circ}`}/>
          <text x={cx} y={cy-6} textAnchor="middle" fontSize="20" fontWeight="800" fill={color}>{score}</text>
          <text x={cx} y={cy+8} textAnchor="middle" fontSize="9" fontWeight="600" fill={color}>{faixa}</text>
        </svg>
      </div>
    </div>
  );
}

// ── V15: Compact inline with mini arc ──
function V15() {
  const r = 22, sw = 5, cx = 28, cy = 28;
  const circ = Math.PI * r;
  const prog = (score / 100) * circ;
  return (
    <div className="flex items-center gap-2">
      <svg width="56" height="36" viewBox="0 0 56 36">
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="#f1f5f9" strokeWidth={sw} strokeLinecap="round"/>
        <path d={`M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeDasharray={`${prog} ${circ}`}/>
        <text x={cx} y={cy-4} textAnchor="middle" fontSize="14" fontWeight="800" fill={color}>{score}</text>
      </svg>
      <div>
        <p className="text-sm font-bold" style={{ color }}>{faixa}</p>
        <p className="text-[9px] text-gray-400">Score operacional</p>
      </div>
    </div>
  );
}

const variations = [
  { id: 1, name: "Atual (semi-arco)", C: V1 },
  { id: 2, name: "Donut completo", C: V2 },
  { id: 3, name: "Arco 270°", C: V3 },
  { id: 4, name: "Arco grosso + badge", C: V4 },
  { id: 5, name: "Anel fino minimalista", C: V5 },
  { id: 6, name: "Arco 270° + dot", C: V6 },
  { id: 7, name: "Donut gradiente", C: V7 },
  { id: 8, name: "Velocímetro + ponteiro", C: V8 },
  { id: 9, name: "Barra horizontal", C: V9 },
  { id: 10, name: "Semi-arco duplo", C: V10 },
  { id: 11, name: "Arco segmentado", C: V11 },
  { id: 12, name: "Circle badge flat", C: V12 },
  { id: 13, name: "Donut com glow", C: V13 },
  { id: 14, name: "Semi-arco + fundo tinted", C: V14 },
  { id: 15, name: "Mini arco inline", C: V15 },
];

export default function GaugeShowcase() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-xl font-bold mb-6">Variações de Gauge — Score 87 (Bom)</h1>
      <div className="grid grid-cols-5 gap-4">
        {variations.map(({ id, name, C }) => (
          <div key={id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] hover:shadow-lg transition-shadow">
            <p className="text-[10px] font-semibold text-gray-400 mb-3 uppercase tracking-wide">V{id}</p>
            <C />
            <p className="text-[11px] text-gray-500 mt-3 text-center">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
