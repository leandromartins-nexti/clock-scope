import { useState, useMemo } from "react";
import { Info, TrendingUp, TrendingDown, Minus, Eraser, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine,
  ScatterChart, Scatter, ZAxis,
} from "recharts";

// ── Shared helpers (same as Coberturas) ──
function ScoreGauge({ score, max = 100 }: { score: number; max?: number }) {
  const radius = 36;
  const stroke = 7;
  const cx = 45;
  const cy = 42;
  const circumference = Math.PI * radius;
  const pct = Math.min(score / max, 1);
  const progress = pct * circumference;
  const color = max === 100
    ? (score >= 85 ? "hsl(var(--success))" : score >= 70 ? "#FF5722" : "hsl(var(--destructive))")
    : "#FF5722";
  return (
    <svg width="90" height="50" viewBox="0 0 90 50">
      <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} fill="none" stroke="#e5e7eb" strokeWidth={stroke} strokeLinecap="round" />
      <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${progress} ${circumference}`} />
    </svg>
  );
}

function InfoTip({ text }: { text: string }) {
  return (
    <UITooltip>
      <TooltipTrigger asChild><Info size={14} className="text-muted-foreground cursor-help" /></TooltipTrigger>
      <TooltipContent className="max-w-[280px] text-xs">{text}</TooltipContent>
    </UITooltip>
  );
}

function TrendIcon({ t }: { t: string }) {
  if (t === "melhorando") return <TrendingUp size={14} className="text-green-500" />;
  if (t === "piorando") return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-gray-400" />;
}

// ══════════════════════════════════════════════════════════════
// Mock data
// ══════════════════════════════════════════════════════════════

// ── Qualidade do Ponto ──
const qualidadeEvolucao = [
  { mes: "abr/25", value: 83.2 }, { mes: "mai/25", value: 84.1 }, { mes: "jun/25", value: 84.5 },
  { mes: "jul/25", value: 85.0 }, { mes: "ago/25", value: 85.3 }, { mes: "set/25", value: 85.8 },
  { mes: "out/25", value: 86.2 }, { mes: "nov/25", value: 86.5 }, { mes: "dez/25", value: 86.1 },
  { mes: "jan/26", value: 87.0 }, { mes: "fev/26", value: 87.8 }, { mes: "mar/26", value: 87.3 },
];
const qualidadeMedia = 85.7;
const qualidadeRegionais = [
  { nome: "Regional SP", qualidade: 89.2, atrasos: 10.1, registradas: 72, justificadas: 28, tendencia: "melhorando" },
  { nome: "Regional MG", qualidade: 88.1, atrasos: 11.5, registradas: 70, justificadas: 30, tendencia: "melhorando" },
  { nome: "Regional PR", qualidade: 87.5, atrasos: 13.2, registradas: 68, justificadas: 32, tendencia: "estavel" },
  { nome: "Regional RJ", qualidade: 86.8, atrasos: 12.3, registradas: 67, justificadas: 33, tendencia: "piorando" },
  { nome: "Regional BA", qualidade: 82.4, atrasos: 16.8, registradas: 60, justificadas: 40, tendencia: "piorando" },
];

const scatterQualidade = [
  { regional: "Regional SP", volume: 268000, qualidade: 89.2, headcount: 2800 },
  { regional: "Regional RJ", volume: 189000, qualidade: 86.8, headcount: 1900 },
  { regional: "Regional MG", volume: 152000, qualidade: 88.1, headcount: 1400 },
  { regional: "Regional PR", volume: 138000, qualidade: 87.5, headcount: 1100 },
  { regional: "Regional BA", volume: 145000, qualidade: 82.4, headcount: 800 },
];

const evolucaoTratativa = [
  { mes: "abr/25", dias: 8.5 }, { mes: "mai/25", dias: 7.8 }, { mes: "jun/25", dias: 8.2 },
  { mes: "jul/25", dias: 7.1 }, { mes: "ago/25", dias: 6.5 }, { mes: "set/25", dias: 6.2 },
  { mes: "out/25", dias: 5.8 }, { mes: "nov/25", dias: 5.5 }, { mes: "dez/25", dias: 7.2 },
  { mes: "jan/26", dias: 5.1 }, { mes: "fev/26", dias: 4.8 }, { mes: "mar/26", dias: 4.5 },
];
const tratativaMedia = evolucaoTratativa.reduce((s, d) => s + d.dias, 0) / evolucaoTratativa.length;

// ── Absenteísmo ──
const absenteismoEvolucao = [
  { mes: "abr/25", value: 5.4 }, { mes: "mai/25", value: 5.1 }, { mes: "jun/25", value: 5.6 },
  { mes: "jul/25", value: 5.3 }, { mes: "ago/25", value: 5.0 }, { mes: "set/25", value: 4.8 },
  { mes: "out/25", value: 4.9 }, { mes: "nov/25", value: 4.7 }, { mes: "dez/25", value: 5.2 },
  { mes: "jan/26", value: 4.5 }, { mes: "fev/26", value: 4.3 }, { mes: "mar/26", value: 4.8 },
];
const absenteismoMedia = 4.97;
const absenteismoBarras = [
  { mes: "abr/25", atestados: 2100, faltas: 1200 }, { mes: "mai/25", atestados: 2000, faltas: 1100 },
  { mes: "jun/25", atestados: 2300, faltas: 1300 }, { mes: "jul/25", atestados: 2150, faltas: 1150 },
  { mes: "ago/25", atestados: 2050, faltas: 1050 }, { mes: "set/25", atestados: 1950, faltas: 1000 },
  { mes: "out/25", atestados: 2100, faltas: 1100 }, { mes: "nov/25", atestados: 2200, faltas: 1050 },
  { mes: "dez/25", atestados: 2400, faltas: 1250 }, { mes: "jan/26", atestados: 2050, faltas: 980 },
  { mes: "fev/26", atestados: 1900, faltas: 920 }, { mes: "mar/26", atestados: 2000, faltas: 1000 },
];
const absenteismoMediaBarras = absenteismoBarras.reduce((s, d) => s + d.atestados + d.faltas, 0) / absenteismoBarras.length;
const absenteismoRegionais = [
  { nome: "Regional SP", taxa: 4.2, turnover: 7.1, tendencia: "melhorando" },
  { nome: "Regional PR", taxa: 4.3, turnover: 6.9, tendencia: "melhorando" },
  { nome: "Regional MG", taxa: 4.6, turnover: 7.8, tendencia: "estavel" },
  { nome: "Regional RJ", taxa: 5.1, turnover: 8.5, tendencia: "piorando" },
  { nome: "Regional BA", taxa: 6.8, turnover: 11.3, tendencia: "piorando" },
];

// ── Movimentações ──
const movimentacoesEvolucao = [
  { mes: "abr/25", value: 6.8 }, { mes: "mai/25", value: 7.0 }, { mes: "jun/25", value: 6.5 },
  { mes: "jul/25", value: 7.2 }, { mes: "ago/25", value: 7.5 }, { mes: "set/25", value: 7.1 },
  { mes: "out/25", value: 7.8 }, { mes: "nov/25", value: 7.0 }, { mes: "dez/25", value: 8.2 },
  { mes: "jan/26", value: 7.4 }, { mes: "fev/26", value: 6.9 }, { mes: "mar/26", value: 7.2 },
];
const movimentacoesMedia = 7.2;
const movimentacoesBarras = [
  { mes: "abr/25", escala: 1450, posto: 850 }, { mes: "mai/25", escala: 1380, posto: 820 },
  { mes: "jun/25", escala: 1420, posto: 790 }, { mes: "jul/25", escala: 1350, posto: 750 },
  { mes: "ago/25", escala: 1280, posto: 720 }, { mes: "set/25", escala: 1220, posto: 680 },
  { mes: "out/25", escala: 1180, posto: 650 }, { mes: "nov/25", escala: 1150, posto: 630 },
  { mes: "dez/25", escala: 1300, posto: 700 }, { mes: "jan/26", escala: 1100, posto: 620 },
  { mes: "fev/26", escala: 1050, posto: 590 }, { mes: "mar/26", escala: 1020, posto: 580 },
];
const movimentacoesMediaBarras = movimentacoesBarras.reduce((s, d) => s + d.escala + d.posto, 0) / movimentacoesBarras.length;
const movimentacoesRegionais = [
  { nome: "Regional SP", total: 7400, escala: 4800, posto: 2600, tempoFechamento: 6.1, tendencia: "melhorando" },
  { nome: "Regional RJ", total: 5300, escala: 3400, posto: 1900, tempoFechamento: 7.5, tendencia: "estavel" },
  { nome: "Regional MG", total: 4000, escala: 2600, posto: 1400, tempoFechamento: 7.0, tendencia: "melhorando" },
  { nome: "Regional PR", total: 3400, escala: 2200, posto: 1200, tempoFechamento: 8.2, tendencia: "piorando" },
  { nome: "Regional BA", total: 2900, escala: 1800, posto: 1100, tempoFechamento: 9.1, tendencia: "piorando" },
];

const subTabs = [
  { id: "qualidade", label: "Qualidade do Ponto" },
  { id: "absenteismo", label: "Absenteísmo" },
  { id: "movimentacoes", label: "Movimentações" },
];

// ══════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════
export default function AnalyticsDisciplinaOperacional({ embedded }: { embedded?: boolean }) {
  const [activeSubTab, setActiveSubTab] = useState("qualidade");
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);

  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);

  const content = (
    <div className="px-6 py-4 space-y-3">
      {/* Sub-tab toggle */}
      <div className="flex gap-2">
        {subTabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setActiveSubTab(t.id); setSelectedRegional(null); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeSubTab === t.id
                ? "bg-[#FF5722] text-white border-[#FF5722]"
                : "bg-white text-muted-foreground border-border hover:border-[#FF5722]/40"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeSubTab === "qualidade" && <QualidadeContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} />}
      {activeSubTab === "absenteismo" && <AbsenteismoContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} />}
      {activeSubTab === "movimentacoes" && <MovimentacoesContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} />}
    </div>
  );

  if (embedded) return content;
  return content;
}

// ══════════════════════════════════════════════════════════════
// Ranking bar grid (reusable dashed lines + footer)
// ══════════════════════════════════════════════════════════════
function RankingDashedGrid() {
  return (
    <>
      {[20, 40, 60, 80].map(p => (
        <svg key={p} className="absolute top-0 z-20 pointer-events-none" width="2" height="16" style={{ left: `${p}%` }}>
          <line x1="1" y1="0" x2="1" y2="16" stroke="rgba(0,0,0,0.35)" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      ))}
    </>
  );
}

function RankingFooter() {
  return (
    <div className="flex items-center gap-4 mt-1 -mx-2 px-2">
      <span className="min-w-[120px]" />
      <div className="flex-1 relative h-4">
        {[0, 20, 40, 60, 80, 100].map(p => (
          <span key={p} className="absolute text-[10px] text-muted-foreground -translate-x-1/2" style={{ left: `${p}%` }}>{p}%</span>
        ))}
      </div>
      <span className="min-w-[80px]" />
      <span className="w-[14px]" />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-aba 1: Qualidade do Ponto
// ══════════════════════════════════════════════════════════════
function QualidadeContent({ selectedRegional, onRegionalClick }: { selectedRegional: string | null; onRegionalClick: (n: string) => void }) {
  const activeData = useMemo(() => {
    if (!selectedRegional) return { score: 87.3, diff: "+4.1 pp", registradas: "892.0K", justificadas: "130.2K" };
    const r = qualidadeRegionais.find(x => x.nome === selectedRegional);
    if (!r) return { score: 87.3, diff: "+4.1 pp", registradas: "892.0K", justificadas: "130.2K" };
    return { score: r.qualidade, diff: `${(r.qualidade - 87.3).toFixed(1)} pp`, registradas: `${(r.registradas * 12.4).toFixed(0)}K`, justificadas: `${(r.justificadas * 3.26).toFixed(0)}K` };
  }, [selectedRegional]);

  const scoreColor = activeData.score >= 85 ? "text-green-600" : activeData.score >= 75 ? "text-orange-500" : "text-red-600";
  const scoreFaixa = activeData.score >= 85 ? "Bom" : activeData.score >= 75 ? "Atenção" : "Crítico";

  return (
    <div className="space-y-3">
      {/* Linha 1: Score + 2 KPIs */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Qualidade do Ponto</p>
            <InfoTip text="Percentual de marcações registradas corretamente vs total de marcações que exigiram intervenção (justificativas manuais)." />
          </div>
          <ScoreGauge score={activeData.score} />
          <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{activeData.score}%</p>
          <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{scoreFaixa}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-[11px] font-medium text-green-600">{activeData.diff} vs anterior</span>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <ArrowUpRight size={16} className="text-green-500" />
            <InfoTip text="Total de marcações registradas pelo colaborador sem necessidade de ajuste." />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Registradas</p>
          <p className="text-2xl font-bold text-green-600 mt-0.5">{activeData.registradas}</p>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <ArrowDownRight size={16} className="text-orange-500" />
            <InfoTip text="Total de marcações que foram justificadas manualmente pelo operador ou gestor." />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Justificadas</p>
          <p className="text-2xl font-bold text-orange-500 mt-0.5">{activeData.justificadas}</p>
        </div>
      </div>

      {/* Evolução da Qualidade do Ponto */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <h4 className="text-sm font-semibold mb-2">Evolução da Qualidade do Ponto</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={qualidadeEvolucao}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
            <YAxis domain={[75, 95]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
            <RechartsTooltip formatter={(v: number) => [`${v}%`, "Qualidade"]} />
            <ReferenceLine y={qualidadeMedia} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: `Média ${qualidadeMedia}%`, position: "right", fontSize: 10, fill: "#9ca3af" }} />
            <Line type="monotone" dataKey="value" stroke="#FF5722" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Qualidade" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Scatter Qualidade×Volume */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <h4 className="text-sm font-semibold">Qualidade × Volume por Operação</h4>
          <InfoTip text="Operações no quadrante inferior direito (alto volume, baixa qualidade) devem ser priorizadas." />
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">Cada bolha representa uma operação. Tamanho = headcount</p>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" dataKey="volume" name="Volume" tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} label={{ value: "Volume de marcações", position: "insideBottom", offset: -5, fontSize: 10 }} />
            <YAxis type="number" dataKey="qualidade" name="Qualidade" domain={[78, 92]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} label={{ value: "Qualidade (%)", angle: -90, position: "insideLeft", fontSize: 10 }} />
            <ZAxis type="number" dataKey="headcount" range={[200, 800]} />
            <ReferenceLine y={85} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: "85% (Bom)", position: "right", fontSize: 9, fill: "#9ca3af" }} />
            <ReferenceLine x={170000} stroke="#9ca3af" strokeDasharray="6 4" />
            <RechartsTooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              return (
                <div className="bg-white border rounded-lg p-2 shadow-md text-xs">
                  <p className="font-semibold">{d.regional}</p>
                  <p>Volume: {(d.volume / 1000).toFixed(0)}K marcações</p>
                  <p>Qualidade: {d.qualidade}%</p>
                  <p>Headcount: {d.headcount}</p>
                </div>
              );
            }} />
            <Scatter data={scatterQualidade} shape={(props: any) => {
              const { cx, cy, payload } = props;
              const r = Math.sqrt(payload.headcount) / 4;
              const fill = payload.qualidade >= 85 ? "#22c55e" : payload.qualidade >= 75 ? "#f97316" : "#ef4444";
              return (
                <g>
                  <circle cx={cx} cy={cy} r={r} fill={fill} fillOpacity={0.7} stroke={fill} strokeWidth={1.5} />
                  <text x={cx} y={cy - r - 4} textAnchor="middle" fontSize={9} fill="#374151">{payload.regional.replace("Regional ", "")}</text>
                </g>
              );
            }} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Evolução Tempo Médio de Tratativa */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center gap-1.5 mb-1">
          <h4 className="text-sm font-semibold">Tempo Médio de Tratativa por Competência</h4>
          <InfoTip text="Média de dias entre o registro da marcação e o ajuste. Tendência de queda indica melhora na eficiência do back-office." />
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">Evolução mensal em dias</p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={evolucaoTratativa}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
            <YAxis domain={[0, 12]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}d`} />
            <RechartsTooltip formatter={(v: number) => [`${v} dias`, "Tempo Médio"]} />
            <ReferenceLine y={tratativaMedia} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: `Média ${tratativaMedia.toFixed(1)}d`, position: "right", fontSize: 10, fill: "#9ca3af" }} />
            <Line type="monotone" dataKey="dias" stroke="#f97316" strokeWidth={2} dot={(props: any) => {
              const { cx, cy, index } = props;
              const isLast = index === evolucaoTratativa.length - 1;
              return <circle cx={cx} cy={cy} r={isLast ? 5 : 3} fill={isLast ? "#FF5722" : "#f97316"} stroke={isLast ? "#fff" : "none"} strokeWidth={isLast ? 2 : 0} />;
            }} activeDot={{ r: 5 }} name="Dias" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Ranking */}
      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold">Ranking de Qualidade por Regional</h3>
          {selectedRegional && (
            <button onClick={() => onRegionalClick(selectedRegional)} className="text-[11px] text-[#FF5722] hover:underline flex items-center gap-1">
              <Eraser size={12} /> Limpar seleção
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">Qualidade do ponto e pontualidade por regional · clique para filtrar</p>

        <div className="flex items-center gap-4 mb-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-green-500" /> Registradas</div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm bg-orange-400" /> Justificadas</div>
        </div>

        <div className="space-y-3">
          {qualidadeRegionais.map(op => {
            const isSelected = selectedRegional === op.nome;
            const isDimmed = selectedRegional && !isSelected;
            const barColor = op.qualidade >= 85 ? "text-green-600" : op.qualidade >= 75 ? "text-orange-500" : "text-red-600";
            return (
              <div key={op.nome} className={`flex items-center gap-4 cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-all ${isSelected ? "bg-orange-50 ring-1 ring-[#FF5722]/30" : "hover:bg-muted/30"} ${isDimmed ? "opacity-35" : ""}`} onClick={() => onRegionalClick(op.nome)}>
                <span className="text-sm font-medium min-w-[120px]">{op.nome}</span>
                <div className="flex-1 relative h-4">
                  <RankingDashedGrid />
                  <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <UITooltip><TooltipTrigger asChild><div className="h-4 bg-green-500 transition-all cursor-default" style={{ width: `${op.registradas}%` }} /></TooltipTrigger><TooltipContent className="text-xs"><span className="font-semibold">Registradas</span>: {op.registradas}%</TooltipContent></UITooltip>
                      <UITooltip><TooltipTrigger asChild><div className="h-4 bg-orange-400 transition-all cursor-default" style={{ width: `${op.justificadas}%` }} /></TooltipTrigger><TooltipContent className="text-xs"><span className="font-semibold">Justificadas</span>: {op.justificadas}%</TooltipContent></UITooltip>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-semibold min-w-[50px] text-right ${barColor}`}>{op.qualidade}%</span>
                <span className="text-[11px] text-muted-foreground min-w-[50px] text-right">{op.atrasos}%</span>
                <TrendIcon t={op.tendencia} />
              </div>
            );
          })}
        </div>
        <RankingFooter />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-aba 2: Absenteísmo
// ══════════════════════════════════════════════════════════════
function AbsenteismoContent({ selectedRegional, onRegionalClick }: { selectedRegional: string | null; onRegionalClick: (n: string) => void }) {
  const activeData = useMemo(() => {
    if (!selectedRegional) return { taxa: 4.8, diff: "-0.6 pp", faltasNJ: "38%", turnover: "8.2%" };
    const r = absenteismoRegionais.find(x => x.nome === selectedRegional);
    if (!r) return { taxa: 4.8, diff: "-0.6 pp", faltasNJ: "38%", turnover: "8.2%" };
    return { taxa: r.taxa, diff: `${(r.taxa - 4.8).toFixed(1)} pp`, faltasNJ: `${Math.round(30 + r.taxa * 3)}%`, turnover: `${r.turnover}%` };
  }, [selectedRegional]);

  const scoreColor = activeData.taxa <= 4 ? "text-green-600" : activeData.taxa <= 6 ? "text-orange-500" : "text-red-600";
  const scoreFaixa = activeData.taxa <= 4 ? "Bom" : activeData.taxa <= 6 ? "Atenção" : "Crítico";
  const maxTaxa = Math.max(...absenteismoRegionais.map(r => r.taxa));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Absenteísmo</p>
            <InfoTip text="Taxa de ausências sobre o efetivo total no período. Inclui atestados, faltas justificadas e não justificadas." />
          </div>
          <ScoreGauge score={Math.max(0, 100 - activeData.taxa * 10)} />
          <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{activeData.taxa}%</p>
          <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{scoreFaixa}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-[11px] font-medium text-green-600">{activeData.diff} vs anterior</span>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <AlertTriangle size={16} className="text-red-500" />
            <InfoTip text="Percentual das ausências que não tiveram justificativa registrada." />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Faltas Não Justificadas</p>
          <p className="text-2xl font-bold text-red-600 mt-0.5">{activeData.faltasNJ}</p>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <ArrowUpRight size={16} className="text-orange-500" />
            <InfoTip text="Taxa de rotatividade: desligamentos no período sobre o efetivo médio." />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Turnover</p>
          <p className="text-2xl font-bold text-orange-500 mt-0.5">{activeData.turnover}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-2">Atestados e Faltas por Competência</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={absenteismoBarras}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RechartsTooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={absenteismoMediaBarras} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: `Média`, position: "right", fontSize: 10, fill: "#9ca3af" }} />
              <Bar dataKey="atestados" stackId="a" fill="hsl(var(--chart-2))" name="Atestados" radius={[0, 0, 0, 0]} />
              <Bar dataKey="faltas" stackId="a" fill="hsl(var(--destructive))" name="Faltas NJ" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-2">Evolução da Taxa de Absenteísmo</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={absenteismoEvolucao}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
              <YAxis domain={[3, 7]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}%`} />
              <RechartsTooltip formatter={(v: number) => [`${v}%`, "Absenteísmo"]} />
              <ReferenceLine y={absenteismoMedia} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: `Média ${absenteismoMedia}%`, position: "right", fontSize: 10, fill: "#9ca3af" }} />
              <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Taxa" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold">Ranking de Absenteísmo por Regional</h3>
          {selectedRegional && (
            <button onClick={() => onRegionalClick(selectedRegional)} className="text-[11px] text-[#FF5722] hover:underline flex items-center gap-1">
              <Eraser size={12} /> Limpar seleção
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">Taxa de absenteísmo e turnover por regional · clique para filtrar</p>

        <div className="space-y-3">
          {absenteismoRegionais.map(op => {
            const isSelected = selectedRegional === op.nome;
            const isDimmed = selectedRegional && !isSelected;
            const barColor = op.taxa <= 4 ? "bg-green-500" : op.taxa <= 6 ? "bg-orange-400" : "bg-red-500";
            const textColor = op.taxa <= 4 ? "text-green-600" : op.taxa <= 6 ? "text-orange-500" : "text-red-600";
            const barWidth = (op.taxa / maxTaxa) * 100;
            return (
              <div key={op.nome} className={`flex items-center gap-4 cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-all ${isSelected ? "bg-orange-50 ring-1 ring-[#FF5722]/30" : "hover:bg-muted/30"} ${isDimmed ? "opacity-35" : ""}`} onClick={() => onRegionalClick(op.nome)}>
                <span className="text-sm font-medium min-w-[120px]">{op.nome}</span>
                <div className="flex-1 relative h-4">
                  <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
                <span className={`text-sm font-semibold min-w-[50px] text-right ${textColor}`}>{op.taxa}%</span>
                <span className="text-[11px] text-muted-foreground min-w-[70px] text-right">Turnover {op.turnover}%</span>
                <TrendIcon t={op.tendencia} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Sub-aba 3: Movimentações
// ══════════════════════════════════════════════════════════════
function MovimentacoesContent({ selectedRegional, onRegionalClick }: { selectedRegional: string | null; onRegionalClick: (n: string) => void }) {
  const activeData = useMemo(() => {
    if (!selectedRegional) return { total: "23.0K", diff: "-18.3%", escala: "14.8K", posto: "8.2K" };
    const r = movimentacoesRegionais.find(x => x.nome === selectedRegional);
    if (!r) return { total: "23.0K", diff: "-18.3%", escala: "14.8K", posto: "8.2K" };
    return { total: `${(r.total / 1000).toFixed(1)}K`, diff: `${((r.total - 23000) / 23000 * 100).toFixed(1)}%`, escala: `${(r.escala / 1000).toFixed(1)}K`, posto: `${(r.posto / 1000).toFixed(1)}K` };
  }, [selectedRegional]);

  const totalNum = parseFloat(activeData.total) * 1000;
  const scoreColor = totalNum <= 15000 ? "text-green-600" : totalNum <= 25000 ? "text-orange-500" : "text-red-600";
  const scoreFaixa = totalNum <= 15000 ? "Bom" : totalNum <= 25000 ? "Atenção" : "Crítico";
  const maxTotal = Math.max(...movimentacoesRegionais.map(r => r.total));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 mb-1">
            <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Movimentações</p>
            <InfoTip text="Total de trocas de escala e trocas de posto no período. Volume alto indica instabilidade operacional." />
          </div>
          <ScoreGauge score={Math.max(0, 100 - (totalNum / 30000) * 100)} />
          <p className={`text-3xl font-bold leading-none -mt-1 ${scoreColor}`}>{activeData.total}</p>
          <p className={`text-xs font-semibold ${scoreColor} mt-0.5`}>{scoreFaixa}</p>
          <div className="flex items-center justify-center gap-1 mt-1">
            <TrendingUp size={12} className="text-green-500" />
            <span className="text-[11px] font-medium text-green-600">{activeData.diff} vs anterior</span>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <ArrowUpRight size={16} className="text-blue-500" />
            <InfoTip text="Colaboradores que tiveram sua escala alterada no período." />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Trocas de Escala</p>
          <p className="text-2xl font-bold text-blue-600 mt-0.5">{activeData.escala}</p>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-center">
          <div className="flex justify-between items-start">
            <ArrowUpRight size={16} className="text-sky-400" />
            <InfoTip text="Colaboradores que foram transferidos de posto no período." />
          </div>
          <p className="text-[11px] font-medium text-muted-foreground mt-2">Trocas de Posto</p>
          <p className="text-2xl font-bold text-sky-500 mt-0.5">{activeData.posto}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-4">
          <h4 className="text-sm font-semibold mb-2">Trocas por Competência</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={movimentacoesBarras}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <RechartsTooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={movimentacoesMediaBarras} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: "Média", position: "right", fontSize: 10, fill: "#9ca3af" }} />
              <Bar dataKey="escala" stackId="a" fill="hsl(var(--chart-2))" name="Trocas de Escala" />
              <Bar dataKey="posto" stackId="a" fill="hsl(var(--chart-3))" name="Trocas de Posto" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <h4 className="text-sm font-semibold">Evolução do Tempo de Fechamento</h4>
            <InfoTip text="Tempo médio entre o fim da competência e o fechamento do ponto pelo DP/RH." />
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={movimentacoesEvolucao}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} />
              <YAxis domain={[5, 10]} tick={{ fontSize: 10 }} tickFormatter={v => `${v}d`} />
              <RechartsTooltip formatter={(v: number) => [`${v} dias`, "Tempo"]} />
              <ReferenceLine y={movimentacoesMedia} stroke="#9ca3af" strokeDasharray="6 4" label={{ value: `Média ${movimentacoesMedia}d`, position: "right", fontSize: 10, fill: "#9ca3af" }} />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Dias" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold">Ranking de Movimentações por Regional</h3>
          {selectedRegional && (
            <button onClick={() => onRegionalClick(selectedRegional)} className="text-[11px] text-[#FF5722] hover:underline flex items-center gap-1">
              <Eraser size={12} /> Limpar seleção
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-4">Volume de trocas e tempo de fechamento por regional · clique para filtrar</p>

        <div className="flex items-center gap-4 mb-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(var(--chart-2))" }} /> Trocas de Escala</div>
          <div className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: "hsl(var(--chart-3))" }} /> Trocas de Posto</div>
        </div>

        <div className="space-y-3">
          {movimentacoesRegionais.map(op => {
            const isSelected = selectedRegional === op.nome;
            const isDimmed = selectedRegional && !isSelected;
            const escalaPct = (op.escala / maxTotal) * 100;
            const postoPct = (op.posto / maxTotal) * 100;
            return (
              <div key={op.nome} className={`flex items-center gap-4 cursor-pointer rounded-lg px-2 py-1.5 -mx-2 transition-all ${isSelected ? "bg-orange-50 ring-1 ring-[#FF5722]/30" : "hover:bg-muted/30"} ${isDimmed ? "opacity-35" : ""}`} onClick={() => onRegionalClick(op.nome)}>
                <span className="text-sm font-medium min-w-[120px]">{op.nome}</span>
                <div className="flex-1 relative h-4">
                  <RankingDashedGrid />
                  <div className="absolute inset-0 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full flex">
                      <div className="h-4 transition-all" style={{ width: `${escalaPct}%`, background: "hsl(var(--chart-2))" }} />
                      <div className="h-4 transition-all" style={{ width: `${postoPct}%`, background: "hsl(var(--chart-3))" }} />
                    </div>
                  </div>
                </div>
                <span className="text-sm font-semibold min-w-[50px] text-right">{(op.total / 1000).toFixed(1)}K</span>
                <span className="text-[11px] text-muted-foreground min-w-[70px] text-right">{op.tempoFechamento} dias</span>
                <TrendIcon t={op.tendencia} />
              </div>
            );
          })}
        </div>
        <RankingFooter />
      </div>
    </div>
  );
}

// ── Exported standalone tab wrappers ──
export function QualidadeTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  return <div className="px-6 py-4"><QualidadeContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} /></div>;
}

export function AbsenteismoTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  return <div className="px-6 py-4"><AbsenteismoContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} /></div>;
}

export function MovimentacoesTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  return <div className="px-6 py-4"><MovimentacoesContent selectedRegional={selectedRegional} onRegionalClick={handleRegionalClick} /></div>;
}
