import { useState, useMemo, useCallback } from "react";
import { Database, AlertTriangle, Lock, Info, ArrowUp, ArrowDown, Minus } from "lucide-react";
import ChartModeToggle from "@/components/analytics/ChartModeToggle";
import type { ChartMode } from "@/components/analytics/ChartModeToggle";
import ChartDataModal from "@/components/analytics/ChartDataModal";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useScoreConfig, getScoreClassification } from "@/contexts/ScoreConfigContext";
import tempoCasaData from "@/data/turnover/tempo-casa-desligados.json";
import rankingEmpresa from "@/data/turnover/ranking-clientes-turnover-por-empresa.json";
import rankingUnidade from "@/data/turnover/ranking-clientes-turnover-por-un-negocio.json";
import rankingArea from "@/data/turnover/ranking-clientes-turnover-por-area.json";
import benchmarks from "@/data/turnover/benchmarks-setoriais.json";
import kpisPeriodoAnterior from "@/data/turnover/kpis-periodo-anterior.json";
import decomposicaoScore from "@/data/turnover/decomposicao-score.json";
import {
  ResponsiveContainer, ComposedChart, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine, Cell,
} from "recharts";

// ══════════════════════════════════════════════════════════════
// Benchmark config — default to vigilância
// ══════════════════════════════════════════════════════════════
const SETOR_KEY = "vigilancia_facilities";
const bench = (benchmarks as any)[SETOR_KEY];

// ══════════════════════════════════════════════════════════════
// Mock data
// ══════════════════════════════════════════════════════════════

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
const TENURE_PALETTE = [
  { color: "#ef4444", opacity: 1.0 },
  { color: "#ef4444", opacity: 0.75 },
  { color: "#eab308", opacity: 1.0 },
  { color: "#eab308", opacity: 0.75 },
  { color: "#22c55e", opacity: 0.7 },
  { color: "#22c55e", opacity: 1.0 },
  { color: "#22c55e", opacity: 1.0 },
];
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
  const entry = Object.values(group).find((v: any) => v.label === selectedRegional);
  return entry || tempoCasaData.consolidado;
}

// Ranking Clientes
interface RankingClienteRow {
  customer_id: number;
  client_id: number;
  client_name: string;
  headcount_atual: number;
  headcount_medio?: number;
  saidas_periodo: number;
  turnover_pct: number;
  avg_tenure_days: number;
  company_name?: string;
  business_unit_name?: string;
  area_name?: string;
  company_id?: number;
  business_unit_id?: number;
  area_id?: number;
}

const RANKING_JSON_MAP: Record<GroupBy, RankingClienteRow[]> = {
  empresa: rankingEmpresa as RankingClienteRow[],
  unidade: rankingUnidade as RankingClienteRow[],
  area: rankingArea as RankingClienteRow[],
};

function getGroupLabel(row: RankingClienteRow, groupBy: GroupBy): string {
  if (groupBy === "empresa") {
    const name = row.company_name || "";
    if (name.includes("PORTARIA")) return "POR";
    if (name.includes("SEGURANCA")) return "SEG";
    if (name.includes("TERCEIRIZACAO")) return "TER";
    return name.slice(0, 3).toUpperCase();
  }
  if (groupBy === "unidade") {
    const name = row.business_unit_name || "";
    if (name.includes("PORTARIA")) return "POR";
    if (name.includes("SEGURANCA")) return "SEG";
    if (name.includes("TERCEIRIZACAO")) return "TER";
    return name.slice(0, 3).toUpperCase();
  }
  return (row.area_name || "S/Área").slice(0, 3).toUpperCase();
}

function getGroupId(row: RankingClienteRow, groupBy: GroupBy): string | number {
  if (groupBy === "empresa") return row.company_id || 0;
  if (groupBy === "unidade") return row.business_unit_id || 0;
  return row.area_id || "null";
}

function getGroupName(row: RankingClienteRow, groupBy: GroupBy): string {
  if (groupBy === "empresa") return row.company_name || "";
  if (groupBy === "unidade") return row.business_unit_name || "";
  return row.area_name || "Sem área";
}

function getRankingTop10(groupBy: GroupBy, selectedRegional: string | null): { data: RankingClienteRow[]; totalWithExits: number } {
  const raw = RANKING_JSON_MAP[groupBy];
  let filtered = raw;
  if (selectedRegional) {
    filtered = raw.filter(r => {
      const name = getGroupName(r, groupBy);
      return name.toUpperCase().includes(selectedRegional.toUpperCase());
    });
  }

  const byClient = new Map<number, { client_name: string; headcount_atual: number; headcount_medio: number; saidas_periodo: number; avg_tenure_days_sum: number; avg_tenure_count: number; groups: Set<string> }>();
  for (const r of filtered) {
    const existing = byClient.get(r.client_id);
    const label = getGroupLabel(r, groupBy);
    const hm = r.headcount_medio ?? r.headcount_atual;
    if (existing) {
      existing.headcount_atual += r.headcount_atual;
      existing.headcount_medio += hm;
      existing.saidas_periodo += r.saidas_periodo;
      if (r.avg_tenure_days) { existing.avg_tenure_days_sum += r.avg_tenure_days * r.saidas_periodo; existing.avg_tenure_count += r.saidas_periodo; }
      existing.groups.add(label);
    } else {
      byClient.set(r.client_id, {
        client_name: r.client_name,
        headcount_atual: r.headcount_atual,
        headcount_medio: hm,
        saidas_periodo: r.saidas_periodo,
        avg_tenure_days_sum: r.avg_tenure_days ? r.avg_tenure_days * r.saidas_periodo : 0,
        avg_tenure_count: r.avg_tenure_days ? r.saidas_periodo : 0,
        groups: new Set([label]),
      });
    }
  }

  const aggregated: (RankingClienteRow & { chipLabel: string })[] = [];
  for (const [clientId, v] of byClient) {
    const denom = v.headcount_medio > 0 ? v.headcount_medio : 1;
    aggregated.push({
      customer_id: 642,
      client_id: clientId,
      client_name: v.client_name,
      headcount_atual: v.headcount_atual,
      headcount_medio: v.headcount_medio,
      saidas_periodo: v.saidas_periodo,
      turnover_pct: Math.round(v.saidas_periodo * 1000 / denom) / 10,
      avg_tenure_days: v.avg_tenure_count > 0 ? Math.round(v.avg_tenure_days_sum / v.avg_tenure_count) : 0,
      chipLabel: Array.from(v.groups).sort().join(" · "),
    } as any);
  }

  const valid = aggregated.filter(r => r.saidas_periodo >= 1);
  const totalWithExits = valid.length;
  valid.sort((a, b) => b.saidas_periodo - a.saidas_periodo);
  return { data: valid.slice(0, 10), totalWithExits };
}

function getTurnoverBarColor(pct: number): string {
  if (pct > 40) return "#ef4444";
  if (pct >= 20) return "#eab308";
  return "#22c55e";
}

// Chart 4: Movimentação Mensal
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

function notaTurnoverPrecoce(taxa: number): number {
  if (taxa < 15) return 100;
  if (taxa < 25) return 80;
  if (taxa < 35) return 60;
  if (taxa < 50) return 30;
  return 0;
}

function computeTurnoverCompositeScore(anual: number, precoce: number): number {
  const nAnual = notaTurnoverAnual(anual);
  const nPrecoce = notaTurnoverPrecoce(precoce);
  return Math.round(nAnual * 0.7 + nPrecoce * 0.3);
}

// getTurnoverFaixa now delegated to getScoreClassification from config

// ══════════════════════════════════════════════════════════════
// Benchmark helpers
// ══════════════════════════════════════════════════════════════
function getBenchmarkLabel(value: number, benchKey: "turnover_anual_pct" | "turnover_precoce_90d_pct") {
  const b = bench[benchKey];
  if (value < b.excelente) {
    const diff = b.mediana - value;
    return { text: `↓ ${Math.round(diff)}pp vs mediana setor (${b.mediana}%)`, color: "text-green-600" };
  }
  if (value <= b.mediana) {
    return { text: `Abaixo da mediana setor (${b.mediana}%)`, color: "text-muted-foreground" };
  }
  if (value <= b.critico) {
    const diff = value - b.mediana;
    return { text: `↑ ${Math.round(diff)}pp vs mediana setor (${b.mediana}%)`, color: "text-orange-500" };
  }
  const diff = value - b.mediana;
  return { text: `↑ ${Math.round(diff)}pp vs mediana setor (${b.mediana}%)`, color: "text-red-600" };
}

// ══════════════════════════════════════════════════════════════
// Delta helpers (vs período anterior)
// ══════════════════════════════════════════════════════════════
const kpisAnterior = kpisPeriodoAnterior.kpis;

function getDeltaDisplay(key: "turnover_anual_pct" | "turnover_precoce_90d_pct" | "score_aba") {
  const kpi = (kpisAnterior as any)[key];
  if (!kpi) return null;
  const delta = kpi.delta;
  const absDelta = Math.abs(delta);
  
  // For turnover: up = worse, down = better
  // For score: up = better, down = worse
  const isScoreKpi = key === "score_aba";
  
  if (absDelta < 1) {
    return { icon: <Minus className="w-3 h-3" />, text: `Estável vs ${kpi.anterior}${isScoreKpi ? "" : "%"} (período anterior)`, color: "text-muted-foreground" };
  }
  
  const improved = isScoreKpi ? delta > 0 : delta < 0;
  const Icon = delta > 0 ? ArrowUp : ArrowDown;
  
  return {
    icon: <Icon className="w-3 h-3" />,
    text: `${absDelta.toFixed(1)}pp vs ${kpi.anterior}${isScoreKpi ? "" : "%"} (ant.)`,
    color: improved ? "text-green-600" : "text-red-600",
  };
}

// ══════════════════════════════════════════════════════════════
// Score Decomposition Popover
// ══════════════════════════════════════════════════════════════
const COMP_COLORS: Record<string, string> = { success: "#22c55e", warning: "#eab308", critical: "#ef4444" };

function ScoreDecompositionPopover({ score, faixa, scoreColor }: { score: number; faixa: string; scoreColor: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex flex-col items-center gap-0 cursor-pointer" title="Ver decomposição do score">
          <ScoreGauge score={score} label={`${score}`} faixa={faixa} color={scoreColor} />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" side="bottom" align="start">
        <div className="p-3 border-b border-border/50">
          <p className="text-sm font-semibold">Como o Score {score} foi calculado</p>
        </div>
        <div className="p-3 space-y-3">
          {decomposicaoScore.componentes.map((comp) => {
            const barColor = COMP_COLORS[comp.cor_semantica] || "#6b7280";
            const barWidth = Math.max(comp.contribuicao / decomposicaoScore.score_composto * 100, 4);
            return (
              <div key={comp.metrica} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">{comp.metrica}</span>
                  <span className="text-[10px] text-muted-foreground">peso {comp.peso}%</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>{comp.valor_atual}{comp.unidade}  →  Nota {comp.nota}</span>
                  <span className="font-semibold">{comp.contribuicao} pts</span>
                </div>
                <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, backgroundColor: barColor }} />
                </div>
              </div>
            );
          })}
          <div className="border-t border-border/50 pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold">Score composto</span>
            <span className="text-sm font-bold" style={{ color: score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444" }}>
              {score} ({faixa})
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ══════════════════════════════════════════════════════════════
// Tempo de Casa Chart
// ══════════════════════════════════════════════════════════════
function TempoCasaChart({ groupBy, selectedRegional, onOpenData }: { groupBy: GroupBy; selectedRegional: string | null; onOpenData: () => void }) {
  const dataset = useMemo(() => getTempoCasaDataset(groupBy, selectedRegional), [groupBy, selectedRegional]);
  const maxCount = Math.max(...dataset.faixas.map((f: any) => f.count), 1);
  
  // Compute precoce percentage for header
  const precoce90 = dataset.faixas.slice(0, 2).reduce((s: number, f: any) => s + f.count, 0);
  const precocePct = dataset.total > 0 ? Math.round(precoce90 * 1000 / dataset.total) / 10 : 0;

  return (
    <div className="bg-card border rounded-xl p-4 border-border/50">
      <div className="flex items-center justify-between mb-0.5">
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-semibold">Tempo de Casa dos Desligados</h4>
            <InfoTip text="Distribuição dos colaboradores que saíram da empresa no período, agrupados pela faixa de tempo de casa que tinham no momento do desligamento." />
          </div>
          <p className="text-[10px] text-muted-foreground mb-1">Em qual faixa de tempo de casa estavam ao sair · clique para filtrar</p>
          <p className="text-[10px] text-muted-foreground">
            Turnover precoce &lt;90d: <span className="font-semibold text-foreground">{precocePct}%</span>
            <span className="text-muted-foreground"> · Mediana setor: {bench.turnover_precoce_90d_pct.mediana}%</span>
          </p>
        </div>
        <button onClick={onOpenData} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={dataset.faixas} layout="vertical" margin={{ top: 5, right: 90, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, Math.ceil(maxCount * 1.15)]} />
          <YAxis type="category" dataKey="label" tick={{ fontSize: 10 }} width={110} />
          <RechartsTooltip content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            const rangeDays = TENURE_RANGE_LABELS[d.id] || "";
            return (
              <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                <p className="font-semibold text-foreground">{d.label}</p>
                <p className="text-muted-foreground">{rangeDays}</p>
                <p className="text-foreground">{d.count} desligamentos · {d.pct}% do total</p>
                {d.avg_days > 0 && <p className="text-muted-foreground">Média: {d.avg_days} dias</p>}
              </div>
            );
          }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} animationDuration={600}
            label={({ x, y, width, value, index }: any) => {
              const faixa = dataset.faixas[index];
              const labelX = faixa.count === 0 ? (x + 4) : (x + width + 6);
              return (
                <text x={labelX} y={y + 14} fontSize={10} fill="hsl(var(--foreground))" fontWeight={600}>
                  {faixa.count} · {faixa.pct}%
                </text>
              );
            }}
          >
            {dataset.faixas.map((f: any, i: number) => {
              const p = TENURE_PALETTE[i];
              return (
                <Cell key={f.id} fill={p.color} fillOpacity={f.count === 0 ? 0 : p.opacity * 0.65} stroke={p.color} strokeOpacity={f.count === 0 ? 0 : p.opacity * 0.5} strokeWidth={1} />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-muted-foreground text-center mt-1">Total no período: {dataset.total} desligamentos</p>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// KPI Delta Sub-label component
// ══════════════════════════════════════════════════════════════
function KPIDelta({ deltaKey, benchmarkKey }: { deltaKey?: "turnover_anual_pct" | "turnover_precoce_90d_pct" | "score_aba"; benchmarkKey?: "turnover_anual_pct" | "turnover_precoce_90d_pct" }) {
  const delta = deltaKey ? getDeltaDisplay(deltaKey) : null;
  const benchmark = benchmarkKey ? getBenchmarkLabel(
    deltaKey === "turnover_anual_pct" ? 43.1 : 38.4,
    benchmarkKey
  ) : null;

  if (!delta && !benchmark) return null;

  return (
    <div className="flex flex-col gap-0.5 mt-1">
      {delta && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`text-[10px] flex items-center gap-0.5 cursor-help ${delta.color}`}>
              {delta.icon} {delta.text}
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[220px] text-xs">
            <p className="font-semibold mb-1">Comparação com período anterior</p>
            <p>Atual (abr/25 a mar/26): {deltaKey === "score_aba" ? (kpisAnterior as any)[deltaKey].atual : `${(kpisAnterior as any)[deltaKey].atual}%`}</p>
            <p>Anterior (abr/24 a mar/25): {deltaKey === "score_aba" ? (kpisAnterior as any)[deltaKey].anterior : `${(kpisAnterior as any)[deltaKey].anterior}%`}</p>
            <p>Variação: {(kpisAnterior as any)[deltaKey].delta > 0 ? "+" : ""}{(kpisAnterior as any)[deltaKey].delta}pp</p>
          </TooltipContent>
        </Tooltip>
      )}
      {benchmark && (
        <span className={`text-[10px] ${benchmark.color}`}>{benchmark.text}</span>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Main component
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
  const { config: scoreConfig } = useScoreConfig();
  const score = computeTurnoverCompositeScore(turnoverAnual, turnoverPrecoce);
  const scoreClassif = getScoreClassification(score, scoreConfig);
  const faixa = scoreClassif.label;
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

  // KPI delta for descriptive cards
  const melhorOpAnterior = kpisAnterior.melhor_operacao as any;
  const maiorRiscoAnterior = kpisAnterior.maior_risco as any;

  return (
    <div className="flex flex-col xl:flex-row flex-1 min-h-0 w-full">
      <div className="flex-1 min-w-0 space-y-3 px-3 sm:pl-6 sm:pr-4 py-4 pb-24 xl:pb-4 overflow-y-auto">
        {/* Row 1: 6 KPI Cards */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
          {/* 1. Score with decomposition popover */}
          <ScoreBoard title="Score da Aba" tooltip="Score composto de turnover, calculado a partir do turnover anual, voluntário e precoce. Clique para ver a decomposição.">
            <ScoreDecompositionPopover score={score} faixa={faixa} scoreColor={scoreClassif.color} />
            {(() => {
              const d = getDeltaDisplay("score_aba");
              if (!d) return null;
              return (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className={`text-[9px] flex items-center gap-0.5 cursor-help -mt-0.5 ${d.color}`}>
                      {d.icon} {d.text}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Atual: {kpisAnterior.score_aba.atual} · Anterior: {kpisAnterior.score_aba.anterior}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })()}
          </ScoreBoard>

          {/* 2. Turnover Anual */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Turnover Anual %</p>
              <InfoTip text="Demissões nos últimos 12 meses dividido pelo headcount médio do período." />
            </div>
            <p className={`text-xl font-bold mt-0.5 ${turnoverAnual < 60 ? "text-green-600" : turnoverAnual <= 100 ? "text-orange-500" : "text-red-600"}`}>{turnoverAnual}%</p>
            <KPIDelta deltaKey="turnover_anual_pct" benchmarkKey="turnover_anual_pct" />
          </div>

          {/* 3. Turnover Precoce */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Turnover Precoce &lt;90D %</p>
              <InfoTip text="Percentual dos desligamentos que ocorreram nos primeiros 90 dias de casa." />
            </div>
            <p className={`text-xl font-bold mt-0.5 ${turnoverPrecoce < 20 ? "text-green-600" : turnoverPrecoce <= 35 ? "text-orange-500" : "text-red-600"}`}>{turnoverPrecoce}%</p>
            <KPIDelta deltaKey="turnover_precoce_90d_pct" benchmarkKey="turnover_precoce_90d_pct" />
          </div>

          {/* 4. Melhor Operação */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Melhor Operação</p>
              <InfoTip text="Operação com menor turnover anual no período" />
            </div>
            <p className="text-xl font-bold mt-0.5 truncate text-green-600">{melhorOp.nome}</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">Score {melhorOp.score}</p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {melhorOpAnterior.mudou ? melhorOpAnterior.mudanca_label : "Mesma posição do período anterior"}
            </span>
          </div>

          {/* 5. Maior Risco */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Maior Risco</p>
              <InfoTip text="Operação com maior turnover anual no período" />
            </div>
            <p className="text-xl font-bold mt-0.5 truncate text-red-600">{maiorRisco.nome}</p>
            <p className="text-[11px] text-muted-foreground mt-1 truncate">Score {maiorRisco.score}</p>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              {maiorRiscoAnterior.mudou ? maiorRiscoAnterior.mudanca_label : "Mesma posição do período anterior"}
            </span>
          </div>

          {/* 6. Custo do Turnover — locked placeholder for V2 */}
          {/*
            V2 Formula:
            custo_turnover = saidas_periodo × custo_medio_desligamento
            custo_medio_desligamento = rescisao_media (2.5x salario_base) + recrutamento (R$800-1500) + treinamento (40h × custo_hora) + produtividade_perdida (30% × salario × 3m) + overhead (15%)
          */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="bg-card border border-border/50 rounded-xl p-4 flex flex-col relative opacity-60 cursor-default select-none">
                <Lock className="w-3.5 h-3.5 absolute top-2.5 right-2.5 text-muted-foreground" />
                <div className="flex items-center gap-1 mb-2">
                  <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Custo do Turnover</p>
                </div>
                <p className="text-lg font-bold mt-0.5 text-muted-foreground">Em breve</p>
                <p className="text-[10px] text-muted-foreground mt-1">Disponível após integração da folha</p>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[260px] text-xs">
              Cálculo do custo financeiro total do turnover no período. Requer integração da folha de pagamento (custo de recrutamento, treinamento, rescisão e produtividade perdida). Previsto para a próxima versão.
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Row 2: 2 charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
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
                {selectedMes && <ReferenceLine yAxisId="left" x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                <ReferenceLine yAxisId="left" y={turnoverMediaAnual} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" label={{ value: `Média ${turnoverMediaAnual.toFixed(1)}%`, position: "right", fontSize: 9, fill: "#C8860A" }} />
                {/* Benchmark: Mediana setor */}
                <ReferenceLine yAxisId="left" y={bench.turnover_anual_pct.mediana / 12} stroke="#9ca3af" strokeWidth={1} strokeDasharray="6 4" label={{ value: `Mediana setor: ${(bench.turnover_anual_pct.mediana / 12).toFixed(1)}%/mês`, position: "insideTopRight", fontSize: 8, fill: "#9ca3af" }} />
                {/* Benchmark: Excelente setor */}
                <ReferenceLine yAxisId="left" y={bench.turnover_anual_pct.excelente / 12} stroke="#86efac" strokeWidth={1} strokeDasharray="6 4" label={{ value: `Excelente setor: ${(bench.turnover_anual_pct.excelente / 12).toFixed(1)}%/mês`, position: "insideBottomRight", fontSize: 8, fill: "#22c55e" }} />
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          {/* Chart 3: Top 10 Clientes com Maior Volume de Saídas */}
          {(() => {
            const { data: rankingData, totalWithExits } = getRankingTop10(groupBy, selectedRegional);
            const maxSaidas = Math.max(...rankingData.map(r => r.saidas_periodo), 1);
            return (
              <div className="bg-card border rounded-xl p-4 border-border/50">
                <div className="flex items-center justify-between mb-0.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold">Top 10 Clientes com Maior Volume de Saídas</h4>
                      <InfoTip text="Os 10 clientes com maior número absoluto de desligamentos no período. Turnover calculado com headcount médio do período. A cor da barra reflete a taxa de turnover." />
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">Ranking por volume no período · base: headcount médio · clique para filtrar</p>
                  </div>
                  <button onClick={() => setChartDataModal("rankingClientes")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={rankingData} layout="vertical" margin={{ top: 5, right: 120, bottom: 5, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, Math.ceil(maxSaidas * 1.25)]} />
                    <YAxis type="category" dataKey="client_name" tick={({ x, y, payload }: any) => {
                      const row = rankingData.find(r => r.client_name === payload.value);
                      const chip = (row as any)?.chipLabel || "";
                      const name = payload.value.length > 20 ? payload.value.slice(0, 18) + "…" : payload.value;
                      return (
                        <g>
                          <text x={x - 4} y={y} textAnchor="end" fontSize={9} fill="hsl(var(--foreground))" dominantBaseline="middle">{name}</text>
                          {chip && <text x={x - 4} y={y + 11} textAnchor="end" fontSize={7} fill="hsl(var(--muted-foreground))" dominantBaseline="middle">{chip}</text>}
                        </g>
                      );
                    }} width={130} />
                    <RechartsTooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload as RankingClienteRow;
                      const groupName = getGroupName(d, groupBy);
                      return (
                        <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1 max-w-[260px]">
                          <p className="font-semibold text-foreground">{d.client_name}</p>
                          <p className="text-muted-foreground">{groupName}</p>
                          <div className="border-t border-border/50 pt-1 mt-1 space-y-0.5">
                            <p>Headcount médio: <span className="font-medium">{d.headcount_medio ?? d.headcount_atual} colaboradores</span></p>
                            <p>Saídas no período: <span className="font-medium">{d.saidas_periodo}</span></p>
                            <p>Turnover: <span className="font-medium">{d.turnover_pct}%</span></p>
                            <p className="text-muted-foreground">Mediana setor: {bench.turnover_anual_pct.mediana}%</p>
                            <p>Tempo médio de casa: <span className="font-medium">{d.avg_tenure_days} dias</span></p>
                            {d.headcount_atual === 0 && (
                              <p className="text-orange-600 flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" />Contrato provavelmente encerrado</p>
                            )}
                          </div>
                        </div>
                      );
                    }} />
                    <Bar dataKey="saidas_periodo" radius={[0, 4, 4, 0]} animationDuration={600}
                      label={({ x, y, width, index }: any) => {
                        const r = rankingData[index];
                        return (
                          <text x={x + width + 6} y={y + 14} fontSize={10} fill="hsl(var(--foreground))" fontWeight={600}>
                            {r.saidas_periodo} saídas · {r.turnover_pct}%
                          </text>
                        );
                      }}
                    >
                      {rankingData.map((r, i) => {
                        const barColor = getTurnoverBarColor(r.turnover_pct);
                        return <Cell key={i} fill={barColor} fillOpacity={0.65} stroke={barColor} strokeOpacity={0.5} strokeWidth={1} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-[10px] text-muted-foreground text-center mt-1">
                  Mostrando {rankingData.length} de {totalWithExits} clientes com saídas no período
                </p>
              </div>
            );
          })()}

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
      <ChartDataModal open={chartDataModal === "rankingClientes"} onClose={() => setChartDataModal(null)} title="Top 10 Clientes com Maior Volume de Saídas" data={getRankingTop10(groupBy, selectedRegional).data.map(r => ({ ...r, headcount_medio: r.headcount_medio ?? r.headcount_atual }))} columns={[{ key: "client_name", label: "Cliente" }, { key: "headcount_medio", label: "HC Médio" }, { key: "saidas_periodo", label: "Saídas" }, { key: "turnover_pct", label: "Turnover %", format: (v: number) => `${v}%` }, { key: "avg_tenure_days", label: "Média (dias)" }]} sqlQuery={`WITH headcount_inicial AS (\n  SELECT w.client_id, COUNT(DISTINCT p.id) AS qtd\n  FROM person p\n  INNER JOIN workplace_transfer wt ON wt.person_id = p.id AND COALESCE(wt.removed, 0) = 0\n    AND wt.transfer_date <= '2025-04-01' AND (wt.finish_date IS NULL OR wt.finish_date > '2025-04-01')\n  INNER JOIN workplace w ON w.id = wt.workplace_id\n  WHERE p.customer_id = 642 AND p.admission_date <= '2025-04-01'\n    AND (p.demission_date IS NULL OR p.demission_date > '2025-04-01') AND w.client_id IS NOT NULL\n  GROUP BY w.client_id\n)\nSELECT c.name AS client_name,\n  ROUND((COALESCE(hi.qtd,0) + COUNT(DISTINCT CASE WHEN p.demission_date IS NULL THEN p.id END)) / 2.0, 0) AS headcount_medio,\n  COUNT(DISTINCT CASE WHEN p.demission_date BETWEEN '2025-04-01' AND '2026-03-31' THEN p.id END) AS saidas_periodo,\n  ROUND(saidas_periodo * 100.0 / NULLIF(headcount_medio, 0), 1) AS turnover_pct\nFROM client c LEFT JOIN headcount_inicial hi ON hi.client_id = c.id\nWHERE c.customer_id = 642\nGROUP BY c.id ORDER BY saidas_periodo DESC LIMIT 10;`} />
      <ChartDataModal open={chartDataModal === "movimentacao"} onClose={() => setChartDataModal(null)} title="Movimentação Mensal" data={movimentacaoData.map(d => ({ ...d, demissoes: Math.abs(d.demissoes), saldo: d.admissoes + d.demissoes }))} columns={[{ key: "mes", label: "Competência" }, { key: "admissoes", label: "Admissões" }, { key: "demissoes", label: "Demissões" }, { key: "saldo", label: "Saldo" }]} sqlQuery={`SELECT DATE_FORMAT(reference_month, '%b/%y') AS mes, SUM(CASE WHEN type = 'admission' THEN 1 ELSE 0 END) AS admissoes, SUM(CASE WHEN type = 'demission' THEN 1 ELSE 0 END) AS demissoes FROM vw_movimentacao WHERE customer_id = 642 AND reference_month BETWEEN '2025-04-01' AND '2026-03-31' GROUP BY reference_month ORDER BY reference_month;`} />
    </div>
  );
}
