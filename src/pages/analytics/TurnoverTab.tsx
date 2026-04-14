import { useState, useMemo, useCallback } from "react";
import { Database } from "lucide-react";
import ChartModeToggle from "@/components/analytics/ChartModeToggle";
import type { ChartMode } from "@/components/analytics/ChartModeToggle";
import ChartDataModal from "@/components/analytics/ChartDataModal";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import tempoCasaData from "@/data/turnover/tempo-casa-desligados.json";
import {
  ResponsiveContainer, ComposedChart, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine, Cell,
} from "recharts";

// ══════════════════════════════════════════════════════════════
// Mock data
// ══════════════════════════════════════════════════════════════

// Chart 1: Evolução do Turnover e Headcount
const turnoverHeadcountData = [
  { mes: "abr/25", turnover: 3.2, headcount: 250 },
  { mes: "mai/25", turnover: 4.1, headcount: 257 },
  { mes: "jun/25", turnover: 3.8, headcount: 251 },
  { mes: "jul/25", turnover: 4.5, headcount: 254 },
  { mes: "ago/25", turnover: 3.9, headcount: 255 },
  { mes: "set/25", turnover: 2.1, headcount: 446 },
  { mes: "out/25", turnover: 3.5, headcount: 447 },
  { mes: "nov/25", turnover: 4.8, headcount: 437 },
  { mes: "dez/25", turnover: 5.2, headcount: 440 },
  { mes: "jan/26", turnover: 3.7, headcount: 441 },
  { mes: "fev/26", turnover: 4.4, headcount: 450 },
  { mes: "mar/26", turnover: 3.9, headcount: 449 },
];
const turnoverMediaAnual = turnoverHeadcountData.reduce((s, d) => s + d.turnover, 0) / turnoverHeadcountData.length;

// Tempo de Casa helpers
const TENURE_COLORS = ["#ef4444", "#ef4444", "#f97316", "#eab308", "#eab308", "#22c55e", "#22c55e"];
const TENURE_RANGE_LABELS: Record<string, string> = {
  lt30: "0 a 29 dias de casa", "30_90": "30 a 89 dias de casa", "3_6m": "90 a 179 dias de casa",
  "6_12m": "180 a 364 dias de casa", "1_2a": "365 a 729 dias de casa", "2_5a": "730 a 1824 dias de casa",
  "5plus": "1825+ dias de casa",
};
const GROUP_TO_JSON_KEY: Record<GroupBy, string> = { empresa: "por_empresa", unidade: "por_un_negocio", area: "por_area" };

function getTempoCasaDataset(groupBy: GroupBy, selectedRegional: string | null) {
  if (!selectedRegional) return tempoCasaData.consolidado;
  const jsonKey = GROUP_TO_JSON_KEY[groupBy];
  const group = (tempoCasaData as any)[jsonKey] as Record<string, any>;
  if (!group) return tempoCasaData.consolidado;
  // Find by label match
  const entry = Object.values(group).find((v: any) => v.label === selectedRegional);
  return entry || tempoCasaData.consolidado;
}

// Chart 3: Decomposição do Turnover
const decomposicaoData = [
  { mes: "abr/25", voluntario: 5, involuntario: 2, fimContrato: 1 },
  { mes: "mai/25", voluntario: 7, involuntario: 3, fimContrato: 0 },
  { mes: "jun/25", voluntario: 6, involuntario: 2, fimContrato: 1 },
  { mes: "jul/25", voluntario: 8, involuntario: 3, fimContrato: 1 },
  { mes: "ago/25", voluntario: 5, involuntario: 4, fimContrato: 1 },
  { mes: "set/25", voluntario: 4, involuntario: 3, fimContrato: 2 },
  { mes: "out/25", voluntario: 9, involuntario: 5, fimContrato: 2 },
  { mes: "nov/25", voluntario: 12, involuntario: 6, fimContrato: 3 },
  { mes: "dez/25", voluntario: 14, involuntario: 7, fimContrato: 2 },
  { mes: "jan/26", voluntario: 8, involuntario: 5, fimContrato: 3 },
  { mes: "fev/26", voluntario: 11, involuntario: 6, fimContrato: 3 },
  { mes: "mar/26", voluntario: 9, involuntario: 5, fimContrato: 4 },
];
const DECOMP_SERIES = [
  { key: "voluntario", name: "Voluntário", color: "#22c55e", rgba: "34,197,94" },
  { key: "involuntario", name: "Involuntário", color: "#ef4444", rgba: "239,68,68" },
  { key: "fimContrato", name: "Fim de Contrato", color: "#eab308", rgba: "234,179,8" },
];

// Chart 4: Movimentação Mensal (migrated from Absenteísmo)
const movimentacaoData = [
  { mes: "abr/25", admissoes: 2, demissoes: -8 },
  { mes: "mai/25", admissoes: 8, demissoes: -12 },
  { mes: "jun/25", admissoes: 11, demissoes: -7 },
  { mes: "jul/25", admissoes: 13, demissoes: -8 },
  { mes: "ago/25", admissoes: 8, demissoes: -18 },
  { mes: "set/25", admissoes: 214, demissoes: -16 },
  { mes: "out/25", admissoes: 16, demissoes: -15 },
  { mes: "nov/25", admissoes: 19, demissoes: -12 },
  { mes: "dez/25", admissoes: 20, demissoes: -22 },
  { mes: "jan/26", admissoes: 31, demissoes: -8 },
  { mes: "fev/26", admissoes: 23, demissoes: -14 },
  { mes: "mar/26", admissoes: 12, demissoes: -8 },
];

// Sidebar mock data
const sidebarDataByGroup: Record<GroupBy, { nome: string; score: number }[]> = {
  empresa: [
    { nome: "SEGURANCA PATRIMONIAL", score: 65 },
    { nome: "TERCEIRIZACAO", score: 48 },
    { nome: "PORTARIA E LIMPEZA", score: 32 },
  ],
  unidade: [
    { nome: "SEGURANCA PATRIMONIAL", score: 65 },
    { nome: "TERCEIRIZACAO", score: 48 },
    { nome: "PORTARIA E LIMPEZA", score: 32 },
  ],
  area: [
    { nome: "SAO PAULO", score: 58 },
    { nome: "PIRACICABA", score: 45 },
    { nome: "SOROCABA", score: 35 },
  ],
};

// ══════════════════════════════════════════════════════════════
// Score helpers
// ══════════════════════════════════════════════════════════════
function notaTurnoverAnual(taxa: number): number {
  if (taxa < 60) return 100;
  if (taxa < 80) return 80;
  if (taxa < 100) return 60;
  if (taxa < 130) return 30;
  return 0;
}

function notaTurnoverVoluntario(taxa: number): number {
  if (taxa < 30) return 100;
  if (taxa < 50) return 80;
  if (taxa < 70) return 60;
  if (taxa < 90) return 30;
  return 0;
}

function notaTurnoverPrecoce(taxa: number): number {
  if (taxa < 15) return 100;
  if (taxa < 25) return 80;
  if (taxa < 35) return 60;
  if (taxa < 50) return 30;
  return 0;
}

function computeTurnoverCompositeScore(anual: number, voluntarioPct: number, precoce: number): number {
  const nAnual = notaTurnoverAnual(anual);
  const nVol = notaTurnoverVoluntario(voluntarioPct);
  const nPrecoce = notaTurnoverPrecoce(precoce);
  return Math.round(nAnual * 0.5 + nVol * 0.3 + nPrecoce * 0.2);
}

function getTurnoverFaixa(score: number) {
  if (score >= 85) return "Excelente";
  if (score >= 70) return "Bom";
  if (score >= 55) return "Médio";
  if (score >= 40) return "Ruim";
  return "Crítico";
}

// ══════════════════════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════════════════════
export default function TurnoverTab() {
  const [selectedRegional, setSelectedRegional] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<GroupBy>("unidade");
  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  const [chartDataModal, setChartDataModal] = useState<string | null>(null);

  const handleRegionalClick = (nome: string) => setSelectedRegional(prev => prev === nome ? null : nome);
  const handleGroupByChange = (g: GroupBy) => { setGroupBy(g); setSelectedRegional(null); };

  const handleChartClick = (e: any) => {
    if (e?.activeLabel) setSelectedMes((prev: string | null) => prev === e.activeLabel ? null : e.activeLabel);
  };
  const xTick = (props: any) => {
    const { x, y, payload } = props;
    const isActive = selectedMes === payload.value;
    return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
  };

  const sidebarItems = useMemo(() => sidebarDataByGroup[groupBy] || sidebarDataByGroup.unidade, [groupBy]);

  // KPI calculations
  const turnoverAnual = 43.1;
  const turnoverPrecoce = 38.4;
  // Calculate voluntary turnover % from decomposition data
  const totalDeslig = decomposicaoData.reduce((s, d) => s + d.voluntario + d.involuntario + d.fimContrato, 0);
  const totalVol = decomposicaoData.reduce((s, d) => s + d.voluntario, 0);
  const turnoverVoluntarioPct = totalDeslig > 0 ? (totalVol / totalDeslig) * 100 : 0;
  const score = computeTurnoverCompositeScore(turnoverAnual, turnoverVoluntarioPct, turnoverPrecoce);
  const faixa = getTurnoverFaixa(score);
  const melhorOp = sidebarItems.reduce((a, b) => a.score > b.score ? a : b);
  const maiorRisco = sidebarItems.reduce((a, b) => a.score < b.score ? a : b);

  // Movimentação Y-axis cap at 50
  const movYMax = 50;
  const movTicks = useMemo(() => {
    const t: number[] = [];
    for (let i = -movYMax; i <= movYMax; i += 10) t.push(i);
    return t;
  }, []);
  const saldos = movimentacaoData.map(d => d.admissoes + d.demissoes);
  const saldoMediano = useMemo(() => {
    const sorted = [...saldos].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }, []);

  const maxHC = Math.max(...turnoverHeadcountData.map(d => d.headcount));

  return (
    <div className="flex flex-1 min-h-0">
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4 overflow-y-auto">
        {/* Row 1: 5 KPI Cards */}
        <div className="grid grid-cols-5 gap-3">
          <ScoreBoard title="Score da Aba" tooltip="Score composto de turnover, calculado a partir do turnover anual, voluntário e precoce. Configurável.">
            <ScoreGauge score={score} label={`${score}`} faixa={faixa} />
          </ScoreBoard>
          <KPIBoard title="Turnover Anual %" tooltip="Demissões nos últimos 12 meses dividido pelo headcount médio do período. Benchmark vigilância: 80% a 120%." value={`${turnoverAnual}%`} valueColor={turnoverAnual < 60 ? "text-green-600" : turnoverAnual <= 100 ? "text-orange-500" : "text-red-600"} />
          <KPIBoard title="Turnover Precoce <90D %" tooltip="Percentual dos desligamentos que ocorreram nos primeiros 90 dias de casa. Indicador de qualidade do recrutamento e onboarding." value={`${turnoverPrecoce}%`} valueColor={turnoverPrecoce < 20 ? "text-green-600" : turnoverPrecoce <= 35 ? "text-orange-500" : "text-red-600"} />
          <KPIBoard title="Melhor Operação" tooltip="Operação com menor turnover anual no período" value={melhorOp.nome} valueColor="text-green-600" subtitle={`Score ${melhorOp.score}`} />
          <KPIBoard title="Maior Risco" tooltip="Operação com maior turnover anual no período" value={maiorRisco.nome} valueColor="text-red-600" subtitle={`Score ${maiorRisco.score}`} />
        </div>

        {/* Row 2: 2 charts */}
        <div className="grid grid-cols-2 gap-3">
          {/* Chart 1: Evolução do Turnover e Headcount */}
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold">Evolução do Turnover e Headcount</h4>
                  <InfoTip text="O quadro está crescendo ou encolhendo, e como o turnover acompanha esse movimento?" />
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">Turnover % (linha) vs Headcount (área) · clique para filtrar</p>
              </div>
              <button onClick={() => setChartDataModal("evoHeadcount")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={turnoverHeadcountData} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={xTick} />
                <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={(v: number) => `${v}%`} domain={[0, 15]} ticks={[0, 3, 6, 9, 12, 15]} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} domain={[0, 500]} ticks={[0, 100, 200, 300, 400, 500]} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                      <p className="font-semibold text-foreground">{label}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5" style={{ backgroundColor: "#E24B4A" }} />
                        <span className="text-muted-foreground">Turnover:</span>
                        <span className="font-medium text-foreground">{d.turnover}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5" style={{ backgroundColor: "#D3D1C7" }} />
                        <span className="text-muted-foreground">Headcount:</span>
                        <span className="font-medium text-foreground">{d.headcount}</span>
                      </div>
                    </div>
                  );
                }} />
                {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                <ReferenceLine yAxisId="left" y={turnoverMediaAnual} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" label={{ value: `Média ${turnoverMediaAnual.toFixed(1)}%`, position: "right", fontSize: 9, fill: "#C8860A" }} />
                <Area yAxisId="right" type="monotone" dataKey="headcount" fill="#D3D1C7" fillOpacity={0.4} stroke="#D3D1C7" strokeWidth={0} name="Headcount" />
                <Line yAxisId="left" type="monotone" dataKey="turnover" stroke="#E24B4A" strokeWidth={2} dot={(props: any) => {
                  const { cx, cy, payload: p } = props;
                  const isSelected = selectedMes === p.mes;
                  return (
                    <g key={p.mes}>
                      {isSelected && <circle cx={cx} cy={cy} r={10} fill="#E24B4A" fillOpacity={0.15} stroke="#E24B4A" strokeWidth={1} strokeDasharray="3 2" />}
                      <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? "#E24B4A" : !selectedMes ? "#E24B4A" : "#E24B4A55"} stroke="#fff" strokeWidth={2} />
                    </g>
                  );
                }} activeDot={{ r: 6, stroke: "#E24B4A", strokeWidth: 2, fill: "#fff" }} name="Turnover (%)" />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 2: Tempo de Casa dos Desligados */}
          <TempoCasaChart groupBy={groupBy} selectedRegional={selectedRegional} onOpenData={() => setChartDataModal("tempoCasa")} />
        </div>

        {/* Row 3: 2 charts */}
        <div className="grid grid-cols-2 gap-3">
          {/* Chart 3: Decomposição do Turnover */}
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold">Decomposição do Turnover</h4>
                  <InfoTip text="Decomposição mensal dos desligamentos por motivo. Voluntário indica retenção. Involuntário indica gestão. Fim de contrato indica modelo de contratação." />
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">Desligamentos por motivo · clique para filtrar</p>
              </div>
              <button onClick={() => setChartDataModal("decomposicao")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={decomposicaoData} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={xTick} />
                <YAxis tick={{ fontSize: 10 }} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload;
                  const total = d.voluntario + d.involuntario + d.fimContrato;
                  return (
                    <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{total}</span></p>
                      {DECOMP_SERIES.map(s => {
                        const val = d[s.key as keyof typeof d] as number;
                        const pct = total > 0 ? ((val / total) * 100).toFixed(0) : "0";
                        return (
                          <div key={s.key} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5" style={{ backgroundColor: s.color }} />
                            <span className="text-muted-foreground">{s.name}:</span>
                            <span className="font-medium text-foreground">{val} ({pct}%)</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }} />
                {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                {DECOMP_SERIES.map((s, i) => (
                  <Bar key={s.key} dataKey={s.key} stackId="decomp" stroke={`rgba(${s.rgba},0.5)`} strokeWidth={1} name={s.name} radius={i === DECOMP_SERIES.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}>
                    {decomposicaoData.map((entry, idx) => (
                      <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? `rgba(${s.rgba},0.25)` : `rgba(${s.rgba},0.65)`} />
                    ))}
                  </Bar>
                ))}
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} payload={DECOMP_SERIES.map(s => ({ value: s.name, type: "square" as const, color: s.color }))} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart 4: Movimentação Mensal */}
          <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
            <div className="flex items-center justify-between mb-0.5">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold">Movimentação Mensal</h4>
                  <InfoTip text="Admissões e demissões em número absoluto por mês. Barras verdes (para cima) são admissões, vermelhas (para baixo) são demissões. Eixo Y limitado a ±50." />
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">Admissões (↑) e demissões (↓) em número absoluto · clique para filtrar</p>
              </div>
              <button onClick={() => setChartDataModal("movimentacao")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={movimentacaoData} stackOffset="sign" margin={{ top: 10, right: 80, bottom: 10, left: 0 }} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={xTick} />
                <YAxis
                  tick={{ fontSize: 10 }}
                  domain={[-movYMax, movYMax]}
                  ticks={movTicks}
                  tickFormatter={(value: number) => Math.abs(value).toString()}
                />
                <ReferenceLine y={0} stroke="#000" strokeWidth={2} />
                <ReferenceLine y={saldoMediano} stroke="#f59e0b" strokeWidth={1.2} strokeDasharray="6 4" label={{ value: `Saldo mediano: ${saldoMediano > 0 ? "+" : ""}${Math.round(saldoMediano)}`, position: "right", fontSize: 9, fill: "#f59e0b" }} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const row = payload[0]?.payload;
                  if (!row) return null;
                  const saldo = row.admissoes + row.demissoes;
                  const isTruncated = row.admissoes > movYMax || Math.abs(row.demissoes) > movYMax;
                  return (
                    <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                      <p className="font-semibold text-foreground">{label}{isTruncated ? " ⚠️ truncado" : ""}</p>
                      <p className="text-muted-foreground">Total: <span className="font-semibold text-foreground">{(row.admissoes + Math.abs(row.demissoes)).toLocaleString("pt-BR")}</span></p>
                      {[{ name: "Admissões", value: row.admissoes, color: "#22c55e" }, { name: "Demissões", value: Math.abs(row.demissoes), color: "#ef4444" }].map(f => (
                        <div key={f.name} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5" style={{ backgroundColor: f.color }} />
                          <span className="text-muted-foreground">{f.name}:</span>
                          <span className="font-medium text-foreground">{f.value} pessoas</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-1.5 pt-0.5 border-t border-border/50">
                        <span className="text-muted-foreground">Saldo:</span>
                        <span className={`font-semibold ${saldo > 0 ? "text-green-600" : saldo < 0 ? "text-red-600" : "text-muted-foreground"}`}>{saldo > 0 ? "+" : ""}{saldo} pessoas</span>
                      </div>
                    </div>
                  );
                }} />
                {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 11 }} payload={[{ value: "Admissões", type: "square" as const, color: "#22c55e" }, { value: "Demissões", type: "square" as const, color: "#ef4444" }]} />
                <Bar dataKey="admissoes" name="Admissões" stackId="mov" stroke="#22c55e" strokeWidth={1} radius={[4, 4, 0, 0]} animationDuration={600}>
                  {movimentacaoData.map((entry, idx) => (
                    <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? "rgba(34,197,94,0.25)" : "rgba(34,197,94,0.65)"} />
                  ))}
                </Bar>
                <Bar dataKey="demissoes" name="Demissões" stackId="mov" stroke="rgba(239,68,68,0.5)" strokeWidth={1} radius={[4, 4, 0, 0]} animationDuration={600}>
                  {movimentacaoData.map((entry, idx) => (
                    <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? "rgba(239,68,68,0.25)" : "rgba(239,68,68,0.65)"} />
                  ))}
                </Bar>
                {/* Truncation label for set/25 */}
                {movimentacaoData.map((d, i) => {
                  if (d.admissoes > movYMax) {
                    return (
                      <ReferenceLine key={`trunc-${i}`} x={d.mes} stroke="transparent" label={{ value: `+${d.admissoes}`, position: "top", fontSize: 9, fill: "#22c55e", fontWeight: 700 }} />
                    );
                  }
                  return null;
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <GroupBySidebar
        items={sidebarItems}
        selectedRegional={selectedRegional}
        onRegionalClick={handleRegionalClick}
        groupBy={groupBy}
        onGroupByChange={handleGroupByChange}
      />

      {/* Data Modals */}
      <ChartDataModal open={chartDataModal === "evoHeadcount"} onClose={() => setChartDataModal(null)} title="Evolução do Turnover e Headcount" data={turnoverHeadcountData} columns={[{ key: "mes", label: "Competência" }, { key: "turnover", label: "Turnover (%)" }, { key: "headcount", label: "Headcount" }]} sqlQuery={`SELECT DATE_FORMAT(reference_month, '%b/%y') AS mes, ROUND(turnover_percentage, 1) AS turnover_pct, avg_headcount FROM vw_turnover_mensal WHERE reference_month BETWEEN '2025-04-01' AND '2026-03-31' ORDER BY reference_month;`} />
      <ChartDataModal open={chartDataModal === "tempoCasa"} onClose={() => setChartDataModal(null)} title="Tempo de Casa dos Desligados" data={getTempoCasaDataset(groupBy, selectedRegional).faixas} columns={[{ key: "label", label: "Faixa" }, { key: "count", label: "Desligamentos" }, { key: "pct", label: "%" , format: (v: number) => `${v}%` }, { key: "avg_days", label: "Média (dias)" }]} sqlQuery={`SELECT tenure_bucket, COUNT(*) AS desligamentos_count, ROUND(AVG(DATEDIFF(demission_date, admission_date)),0) AS avg_tenure_days, ROUND(COUNT(*)*100.0/SUM(COUNT(*)) OVER(),1) AS pct FROM vw_turnover_detail WHERE customer_id = 642 AND demission_date BETWEEN '2025-04-01' AND '2026-03-31' GROUP BY tenure_bucket ORDER BY bucket_order;`} />
      <ChartDataModal open={chartDataModal === "decomposicao"} onClose={() => setChartDataModal(null)} title="Decomposição do Turnover" data={decomposicaoData.map(d => ({ ...d, total: d.voluntario + d.involuntario + d.fimContrato }))} columns={[{ key: "mes", label: "Competência" }, { key: "voluntario", label: "Voluntário" }, { key: "involuntario", label: "Involuntário" }, { key: "fimContrato", label: "Fim Contrato" }, { key: "total", label: "Total" }]} sqlQuery={`SELECT DATE_FORMAT(demission_date, '%b/%y') AS mes, SUM(CASE WHEN reason = 'voluntary' THEN 1 ELSE 0 END) AS voluntario, SUM(CASE WHEN reason = 'involuntary' THEN 1 ELSE 0 END) AS involuntario, SUM(CASE WHEN reason = 'end_contract' THEN 1 ELSE 0 END) AS fim_contrato FROM vw_turnover_detail WHERE customer_id = 642 GROUP BY mes ORDER BY demission_date;`} />
      <ChartDataModal open={chartDataModal === "movimentacao"} onClose={() => setChartDataModal(null)} title="Movimentação Mensal" data={movimentacaoData.map(d => ({ ...d, demissoes_abs: Math.abs(d.demissoes), saldo: d.admissoes + d.demissoes }))} columns={[{ key: "mes", label: "Competência" }, { key: "admissoes", label: "Admissões" }, { key: "demissoes_abs", label: "Demissões" }, { key: "saldo", label: "Saldo" }]} sqlQuery={`SELECT DATE_FORMAT(reference_month, '%b/%y') AS mes, SUM(CASE WHEN tipo = 'admissao' THEN 1 ELSE 0 END) AS admissoes, SUM(CASE WHEN tipo = 'demissao' THEN 1 ELSE 0 END) AS demissoes FROM vw_movimentacoes WHERE customer_id = 642 AND reference_month BETWEEN '2025-04-01' AND '2026-03-31' GROUP BY reference_month ORDER BY reference_month;`} />
    </div>
  );
}
