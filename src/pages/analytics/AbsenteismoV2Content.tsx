/**
 * AbsenteismoContent V2 — follows spec "lovable-prompt-aba-absenteismo-mockada-v3.md"
 * 
 * 6 BigNumbers: Score, HC Operacional, Taxa, % Faltas Injustificadas, % Crônicos, Horas Perdidas/Mês
 * 3 Charts: Volume Mensal (line), Composição (stacked area 100%), Maturidade (stacked area 100%)
 * Data source: static JSON from src/data/customers/642/absenteismo/
 */
import { useState, useMemo, useCallback } from "react";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine,
  Cell, Bar,
} from "recharts";
import { Database } from "lucide-react";
import ChartModeToggle from "@/components/analytics/ChartModeToggle";
import type { DataMode, ChartMode } from "@/components/analytics/ChartModeToggle";
import ChartDataModal from "@/components/analytics/ChartDataModal";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

// ── Static JSON imports ──
import volumeEmpresa from "@/data/customers/642/absenteismo/volume-mensal-por-empresa.json";
import volumeUnNegocio from "@/data/customers/642/absenteismo/volume-mensal-por-un-negocio.json";
import volumeArea from "@/data/customers/642/absenteismo/volume-mensal-por-area.json";
import composicaoEmpresa from "@/data/customers/642/absenteismo/composicao-por-empresa.json";
import composicaoUnNegocio from "@/data/customers/642/absenteismo/composicao-por-un-negocio.json";
import composicaoArea from "@/data/customers/642/absenteismo/composicao-por-area.json";
import maturidadeEmpresa from "@/data/customers/642/absenteismo/maturidade-por-empresa.json";
import maturidadeUnNegocio from "@/data/customers/642/absenteismo/maturidade-por-un-negocio.json";
import maturidadeArea from "@/data/customers/642/absenteismo/maturidade-por-area.json";

// ── Constants from spec ──
const MOCK = {
  hcOperacional: 484,
  hcTotalAtivo: 486,
  cronicos: [
    { person_name: "João Silva", dias_afastado: 502, tipo: "Afastamento INSS" },
    { person_name: "Maria Santos", dias_afastado: 518, tipo: "Afastamento INSS" },
  ],
  demissoesAbertas: 37,
  horasPerdidas12meses: 41310,
};

// Consolidado from spec
const volumeConsolidado = [
  { reference_date: "2025-04-01", horas_ausencia_total: 3023, horas_ausencia_nao_planejada: 1206, hcMes: 245, taxa: 2.46 },
  { reference_date: "2025-05-01", horas_ausencia_total: 3514, horas_ausencia_nao_planejada: 1448, hcMes: 251, taxa: 2.88 },
  { reference_date: "2025-06-01", horas_ausencia_total: 2561, horas_ausencia_nao_planejada: 729, hcMes: 250, taxa: 1.46 },
  { reference_date: "2025-07-01", horas_ausencia_total: 2790, horas_ausencia_nao_planejada: 1018, hcMes: 263, taxa: 1.94 },
  { reference_date: "2025-08-01", horas_ausencia_total: 2677, horas_ausencia_nao_planejada: 1036, hcMes: 258, taxa: 2.01 },
  { reference_date: "2025-09-01", horas_ausencia_total: 2433, horas_ausencia_nao_planejada: 953, hcMes: 440, taxa: 1.08 },
  { reference_date: "2025-10-01", horas_ausencia_total: 2843, horas_ausencia_nao_planejada: 1119, hcMes: 461, taxa: 1.21 },
  { reference_date: "2025-11-01", horas_ausencia_total: 3787, horas_ausencia_nao_planejada: 1592, hcMes: 466, taxa: 1.71 },
  { reference_date: "2025-12-01", horas_ausencia_total: 4416, horas_ausencia_nao_planejada: 1822, hcMes: 471, taxa: 1.93 },
  { reference_date: "2026-01-01", horas_ausencia_total: 4656, horas_ausencia_nao_planejada: 2031, hcMes: 475, taxa: 2.14 },
  { reference_date: "2026-02-01", horas_ausencia_total: 4373, horas_ausencia_nao_planejada: 1891, hcMes: 478, taxa: 1.98 },
  { reference_date: "2026-03-01", horas_ausencia_total: 4121, horas_ausencia_nao_planejada: 1690, hcMes: 484, taxa: 1.74 },
];

// Composição distribution from spec (mar/2026)
const composicaoDistribuicao = { planejada: 45, saude: 35, operacional: 1, falta: 19, nao_categorizada: 0 };

// Maturidade distribution from spec (mar/2026)
const maturidadeDistribuicao = { planejado: 83, reativo: 17 };

// ── Absence category mapping (spec section 3) ──
const CATEGORY_MAP: Record<number, string> = {
  18345: "planejada", 18352: "planejada", 18549: "planejada", 18550: "planejada", 18548: "planejada", 18545: "planejada",
  18351: "saude", 18348: "saude", 18546: "saude", 18547: "saude",
  18349: "operacional", 18350: "operacional",
  18346: "falta",
};

const CATEGORY_COLORS: Record<string, string> = {
  planejada: "#22c55e",
  saude: "#3b82f6",
  operacional: "#f97316",
  falta: "#ef4444",
  nao_categorizada: "#9ca3af",
};

const CATEGORY_LABELS: Record<string, string> = {
  planejada: "Planejada",
  saude: "Saúde",
  operacional: "Operacional",
  falta: "Falta",
  nao_categorizada: "Não Categorizada",
};

const MATURIDADE_COLORS: Record<string, string> = {
  "1_planejado": "#22c55e",
  "2_reativo": "#ef4444",
};

const MATURIDADE_LABELS: Record<string, string> = {
  "1_planejado": "Planejado",
  "2_reativo": "Reativo",
};

// ── Score computation (spec section 2 & 5) ──
function computeVolumeScore(taxa: number): { score: number; label: string } {
  if (taxa <= 2.5) return { score: 100, label: "Excelente" };
  if (taxa <= 4.0) return { score: 75, label: "Bom" };
  if (taxa <= 6.0) return { score: 50, label: "Atenção" };
  if (taxa <= 8.0) return { score: 25, label: "Ruim" };
  return { score: 0, label: "Crítico" };
}

function computeComposicaoScore(dist: typeof composicaoDistribuicao): number {
  const weights: Record<string, number> = { planejada: 100, saude: 80, operacional: 60, nao_categorizada: 50, falta: 0 };
  const total = Object.values(dist).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let weighted = 0;
  for (const [cat, pct] of Object.entries(dist)) {
    weighted += (pct / total) * (weights[cat] ?? 50);
  }
  return Math.round(weighted);
}

function computeMaturidadeScore(dist: typeof maturidadeDistribuicao): { score: number; label: string } {
  const pctPlanejado = dist.planejado;
  if (pctPlanejado >= 95) return { score: 100, label: "Excelente" };
  if (pctPlanejado >= 85) return { score: 75, label: "Bom" };
  if (pctPlanejado >= 70) return { score: 50, label: "Atenção" };
  if (pctPlanejado >= 50) return { score: 25, label: "Ruim" };
  return { score: 0, label: "Crítico" };
}

function getScoreColor(score: number): string {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#84cc16";
  if (score >= 50) return "#f97316";
  if (score >= 25) return "#ef4444";
  return "#dc2626";
}

function getScoreLabel(score: number): string {
  if (score >= 85) return "Excelente";
  if (score >= 70) return "Bom";
  if (score >= 50) return "Atenção";
  if (score >= 25) return "Ruim";
  return "Crítico";
}

// ── Helpers ──
const MESES_LABELS: Record<string, string> = {
  "2025-04-01": "abr/25", "2025-05-01": "mai/25", "2025-06-01": "jun/25",
  "2025-07-01": "jul/25", "2025-08-01": "ago/25", "2025-09-01": "set/25",
  "2025-10-01": "out/25", "2025-11-01": "nov/25", "2025-12-01": "dez/25",
  "2026-01-01": "jan/26", "2026-02-01": "fev/26", "2026-03-01": "mar/26",
};

function formatHoursCompact(h: number): string {
  if (h >= 1000) return `${(h / 1000).toFixed(1)}K`;
  return `${h}`;
}

type ContentProps = {
  selectedRegional: string | null;
  onRegionalClick: (n: string) => void;
  onItemDetail?: (n: string) => void;
  groupBy: GroupBy;
  onGroupByChange: (g: GroupBy) => void;
};

export default function AbsenteismoV2Content({ selectedRegional, onRegionalClick, onItemDetail, groupBy, onGroupByChange }: ContentProps) {
  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  const [volumeChartMode, setVolumeChartMode] = useState<ChartMode>("line");
  const [volumeDataMode, setVolumeDataMode] = useState<DataMode>("percent");
  const [chartDataModal, setChartDataModal] = useState<string | null>(null);
  const [visibleNames, setVisibleNames] = useState<string[]>([]);

  // ── Data by dimension ──
  const volumeByDim = useMemo(() => {
    const raw = groupBy === "empresa" ? volumeEmpresa : groupBy === "area" ? volumeArea : volumeUnNegocio;
    const nameField = groupBy === "empresa" ? "company_name" : groupBy === "area" ? "area_name" : "business_unit_name";
    return raw as Array<Record<string, any>>;
  }, [groupBy]);

  const nameField = groupBy === "empresa" ? "company_name" : groupBy === "area" ? "area_name" : "business_unit_name";

  // Build volume chart data
  const volumeChartData = useMemo(() => {
    if (selectedRegional) {
      // filter to selected entity
      const filtered = volumeByDim.filter(d => d[nameField] === selectedRegional);
      return Object.keys(MESES_LABELS).map(date => {
        const row = filtered.find(d => d.reference_date === date);
        return {
          mes: MESES_LABELS[date],
          horas: row?.horas_ausencia ?? 0,
          eventos: row?.qtd_eventos ?? 0,
          pessoas: row?.pessoas_ausentes ?? 0,
          taxa: 0, // will compute below
        };
      });
    }
    return volumeConsolidado.map(d => ({
      mes: MESES_LABELS[d.reference_date],
      horas: d.horas_ausencia_nao_planejada,
      horasTotal: d.horas_ausencia_total,
      taxa: d.taxa,
      hcMes: d.hcMes,
    }));
  }, [selectedRegional, volumeByDim, nameField]);

  // ── Composição chart data (stacked area 100%) ──
  const composicaoChartData = useMemo(() => {
    // Composição data is only for mar/2026, so we show as a single snapshot
    // For time series we use maturidade data which has 12 months
    const raw = groupBy === "empresa" ? composicaoEmpresa : groupBy === "area" ? composicaoArea : composicaoUnNegocio;
    
    if (selectedRegional) {
      const nf = nameField;
      const filtered = (raw as any[]).filter(d => d[nf] === selectedRegional);
      if (filtered.length === 0) return [];
      
      const total = filtered.reduce((s, d) => s + (d.horas_total ?? 0), 0);
      const byCategory: Record<string, number> = {};
      for (const item of filtered) {
        const cat = CATEGORY_MAP[item.absence_situation_id] ?? "nao_categorizada";
        byCategory[cat] = (byCategory[cat] ?? 0) + (item.horas_total ?? 0);
      }
      return [{ 
        mes: "mar/26",
        ...Object.fromEntries(Object.entries(byCategory).map(([k, v]) => [k, total > 0 ? +((v / total) * 100).toFixed(1) : 0])),
      }];
    }

    // Consolidated
    const total = Object.values(composicaoDistribuicao).reduce((a, b) => a + b, 0);
    return [{
      mes: "mar/26",
      ...Object.fromEntries(Object.entries(composicaoDistribuicao).map(([k, v]) => [k, total > 0 ? +((v / total) * 100).toFixed(1) : 0])),
    }];
  }, [groupBy, selectedRegional, nameField]);

  // ── Maturidade chart data (stacked area 100%) ── uses time series from area (12 months)
  const maturidadeChartData = useMemo(() => {
    const raw = groupBy === "empresa" ? maturidadeEmpresa : groupBy === "area" ? maturidadeArea : maturidadeUnNegocio;
    const nf = nameField;
    const dates = Object.keys(MESES_LABELS);
    
    // Maturidade area has full 12m data, empresa/un only mar/2026
    const hasTimeSeries = (raw as any[]).some(d => d.reference_date !== "2026-03-01");
    
    if (hasTimeSeries) {
      return dates.map(date => {
        let filtered = (raw as any[]).filter(d => d.reference_date === date);
        if (selectedRegional) filtered = filtered.filter(d => d[nf] === selectedRegional);
        
        const totalHoras = filtered.reduce((s, d) => s + (d.horas_total ?? 0), 0);
        const planejadoHoras = filtered.filter(d => d.categoria === "1_planejado").reduce((s, d) => s + (d.horas_total ?? 0), 0);
        const reativoHoras = filtered.filter(d => d.categoria === "2_reativo").reduce((s, d) => s + (d.horas_total ?? 0), 0);
        
        return {
          mes: MESES_LABELS[date],
          "1_planejado": totalHoras > 0 ? +((planejadoHoras / totalHoras) * 100).toFixed(1) : 0,
          "2_reativo": totalHoras > 0 ? +((reativoHoras / totalHoras) * 100).toFixed(1) : 0,
        };
      });
    }
    
    // Single month snapshot
    let filtered = raw as any[];
    if (selectedRegional) filtered = filtered.filter(d => d[nf] === selectedRegional);
    
    const totalHoras = filtered.reduce((s, d) => s + (d.horas_total ?? 0), 0);
    const planejadoHoras = filtered.filter(d => d.categoria === "1_planejado").reduce((s, d) => s + (d.horas_total ?? 0), 0);
    const reativoHoras = filtered.filter(d => d.categoria === "2_reativo").reduce((s, d) => s + (d.horas_total ?? 0), 0);
    
    return [{
      mes: "mar/26",
      "1_planejado": totalHoras > 0 ? +((planejadoHoras / totalHoras) * 100).toFixed(1) : 0,
      "2_reativo": totalHoras > 0 ? +((reativoHoras / totalHoras) * 100).toFixed(1) : 0,
    }];
  }, [groupBy, selectedRegional, nameField]);

  // ── Score computation ──
  const latestTaxa = volumeConsolidado[volumeConsolidado.length - 1].taxa;
  const volScore = computeVolumeScore(latestTaxa);
  const compScore = computeComposicaoScore(composicaoDistribuicao);
  const matScore = computeMaturidadeScore(maturidadeDistribuicao);
  const compositeScore = Math.round(volScore.score * 0.5 + compScore * 0.3 + matScore.score * 0.2);
  const scoreColor = getScoreColor(compositeScore);
  const scoreLabel = getScoreLabel(compositeScore);

  // BigNumbers
  const pctFaltasInjustificadas = composicaoDistribuicao.falta;
  const pctCronicos = +((MOCK.cronicos.length / MOCK.hcOperacional) * 100).toFixed(1);
  const horasPerdidaMes = volumeConsolidado[volumeConsolidado.length - 1].horas_ausencia_nao_planejada;

  // ── Sidebar items ──
  const sidebarItems = useMemo(() => {
    const raw = groupBy === "empresa" ? volumeEmpresa : groupBy === "area" ? volumeArea : volumeUnNegocio;
    const nf = nameField;
    const entities = new Map<string, { horas: number; count: number }>();
    
    for (const row of raw as any[]) {
      const name = row[nf];
      if (!entities.has(name)) entities.set(name, { horas: 0, count: 0 });
      const e = entities.get(name)!;
      e.horas += row.horas_ausencia ?? 0;
      e.count++;
    }
    
    const maxHoras = Math.max(...[...entities.values()].map(e => e.horas));
    
    return [...entities.entries()].map(([nome, data]) => ({
      nome,
      value: nome,
      score: Math.round(Math.max(0, 100 - (data.horas / maxHoras) * 100)),
    })).sort((a, b) => b.score - a.score);
  }, [groupBy, nameField]);

  // ── Chart interactions ──
  const handleChartClick = (e: any) => {
    if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
  };

  const xTick = (props: any) => {
    const { x, y, payload } = props;
    const isActive = selectedMes === payload.value;
    return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
  };

  const mediaTaxa = volumeConsolidado.reduce((s, d) => s + d.taxa, 0) / volumeConsolidado.length;

  // ── Render volume chart ──
  const renderVolumeChart = () => {
    const isValor = volumeDataMode === "valor";
    const dataKey = isValor ? "horas" : "taxa";
    const yFmt = (v: number) => isValor ? formatHoursCompact(v) : `${v}%`;
    const color = "#ef4444";

    const data = volumeChartData;

    if (volumeChartMode === "bar") {
      return (
        <ComposedChart data={data} onClick={handleChartClick}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" tick={xTick} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={yFmt} label={{ value: isValor ? "Horas" : "Taxa (%)", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <RechartsTooltip content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-card border border-border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                <p className="font-semibold text-foreground">{label}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-muted-foreground">{isValor ? "Horas perdidas:" : "Taxa:"}</span>
                  <span className="font-medium text-foreground">{isValor ? d.horas?.toLocaleString("pt-BR") : `${d.taxa}%`}</span>
                </div>
              </div>
            );
          }} />
          {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
          {!isValor && <ReferenceLine y={mediaTaxa} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={selectedMes && selectedMes !== entry.mes ? `${color}40` : `${color}A6`} />
            ))}
          </Bar>
        </ComposedChart>
      );
    }

    if (volumeChartMode === "area") {
      return (
        <AreaChart data={data} onClick={handleChartClick}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" tick={xTick} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={yFmt} label={{ value: isValor ? "Horas" : "Taxa (%)", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <RechartsTooltip content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload;
            return (
              <div className="bg-card border border-border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                <p className="font-semibold text-foreground">{label}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-muted-foreground">{isValor ? "Horas perdidas:" : "Taxa:"}</span>
                  <span className="font-medium text-foreground">{isValor ? d.horas?.toLocaleString("pt-BR") : `${d.taxa}%`}</span>
                </div>
              </div>
            );
          }} />
          {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
          {!isValor && <ReferenceLine y={mediaTaxa} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}${selectedMes ? "33" : "59"}`} fillOpacity={1} />
        </AreaChart>
      );
    }

    // line (default)
    return (
      <LineChart data={data} onClick={handleChartClick}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="mes" tick={xTick} />
        <YAxis tick={{ fontSize: 10 }} tickFormatter={yFmt} domain={["auto", "auto"]} label={{ value: isValor ? "Horas" : "Taxa (%)", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
        <RechartsTooltip content={({ active, payload, label }) => {
          if (!active || !payload?.length) return null;
          const d = payload[0].payload;
          return (
            <div className="bg-card border border-border rounded-lg p-2.5 shadow-md text-xs space-y-1">
              <p className="font-semibold text-foreground">{label}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{isValor ? "Horas perdidas:" : "Taxa:"}</span>
                <span className="font-medium text-foreground">{isValor ? d.horas?.toLocaleString("pt-BR") : `${d.taxa}%`}</span>
              </div>
            </div>
          );
        }} />
        {!isValor && <ReferenceLine y={mediaTaxa} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={(props: any) => {
          const { cx, cy, payload } = props;
          const isSelected = selectedMes === payload.mes;
          const isActive = !selectedMes || isSelected;
          return (
            <g key={payload.mes} className="cursor-pointer">
              {isSelected && <circle cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1} strokeDasharray="3 2" />}
              <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? color : isActive ? color : `${color}55`} stroke="#fff" strokeWidth={2} />
            </g>
          );
        }} activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: "#fff" }} name="Taxa" />
      </LineChart>
    );
  };

  const CATEGORIES_ORDER = ["planejada", "saude", "operacional", "nao_categorizada", "falta"];

  return (
    <div className="flex">
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4">
        {/* ── BigNumbers (6 cards) ── */}
        <div className="grid grid-cols-6 gap-3">
          {/* 1. Score */}
          <ScoreBoard title="Score Absenteísmo" tooltip="Score composto: Volume (50%) + Composição (30%) + Maturidade (20%)">
            <Popover>
              <PopoverTrigger asChild>
                <button className="cursor-pointer">
                  <ScoreGauge score={compositeScore} label={`${compositeScore}`} faixa={scoreLabel} color={scoreColor} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 text-xs space-y-2">
                <p className="font-semibold">Decomposição do Score</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span>Volume (50%)</span>
                    <span className="font-medium">{volScore.score} — {volScore.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Composição (30%)</span>
                    <span className="font-medium">{compScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maturidade (20%)</span>
                    <span className="font-medium">{matScore.score} — {matScore.label}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-semibold">
                    <span>Composto</span>
                    <span>{compositeScore} — {scoreLabel}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </ScoreBoard>

          {/* 2. HC Operacional */}
          <KPIBoard
            title="HC Operacional"
            tooltip={`De ${MOCK.hcTotalAtivo} ativos (${MOCK.cronicos.length} crônicos)`}
            value={`${MOCK.hcOperacional}`}
            valueColor="text-foreground"
            subtitle={`de ${MOCK.hcTotalAtivo} ativos (${MOCK.cronicos.length} crônicos)`}
          />

          {/* 3. Taxa */}
          <KPIBoard
            title="Taxa Absenteísmo"
            tooltip="Taxa de absenteísmo operacional (excluindo ausências planejadas) na última competência."
            value={`${latestTaxa}%`}
            valueColor={latestTaxa <= 2.5 ? "text-green-600" : latestTaxa <= 4.0 ? "text-orange-500" : "text-red-600"}
            subtitle="Mar/2026"
          />

          {/* 4. % Faltas Injustificadas */}
          <KPIBoard
            title="% Faltas Injustificadas"
            tooltip="Percentual de horas de ausência classificadas como 'Falta' (injustificada) sobre o total."
            value={`${pctFaltasInjustificadas}%`}
            valueColor={pctFaltasInjustificadas >= 15 ? "text-red-600" : pctFaltasInjustificadas >= 10 ? "text-orange-500" : "text-green-600"}
          />

          {/* 5. % Crônicos */}
          <KPIBoard
            title="% Afastados Crônicos"
            tooltip={`${MOCK.cronicos.length} colaboradores com afastamento INSS prolongado.`}
            value={`${pctCronicos}%`}
            valueColor={pctCronicos >= 1 ? "text-orange-500" : "text-green-600"}
            subtitle={`${MOCK.cronicos.length} colaborador(es)`}
          />

          {/* 6. Horas Perdidas */}
          <KPIBoard
            title="Horas Perdidas/Mês"
            tooltip="Horas de ausência não-planejada na última competência."
            value={formatHoursCompact(horasPerdidaMes)}
            valueColor="text-red-600"
            subtitle={`${formatHoursCompact(MOCK.horasPerdidas12meses)} em 12 meses`}
          />
        </div>

        {/* ── G1: Volume Mensal ── */}
        <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
          <div className="flex items-center justify-between mb-0.5">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold">Volume Mensal</h4>
                <InfoTip text="Quanto a operação está perdendo para ausência. Taxa = horas não-planejadas / (HC × jornada mensal)." />
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">Por competência · clique para filtrar</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setChartDataModal("volume")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
              <ChartModeToggle dataMode={volumeDataMode} onDataModeChange={setVolumeDataMode} chartMode={volumeChartMode} onChartModeChange={setVolumeChartMode} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            {renderVolumeChart()}
          </ResponsiveContainer>
        </div>

        {/* ── G2 + G3: Composição + Maturidade side by side ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* G2: Composição */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold">Composição</h4>
                <InfoTip text="Por que estão faltando. Distribuição de horas de ausência por categoria semântica." />
              </div>
              <button onClick={() => setChartDataModal("composicao")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Mar/2026 · % sobre total de horas</p>
            {composicaoChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={composicaoChartData} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tickFormatter={v => `${Math.round(v * 100)}%`} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                  <RechartsTooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    return (
                      <div className="bg-card border border-border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                        <p className="font-semibold text-foreground">{label}</p>
                        {payload.map((p: any) => (
                          <div key={p.dataKey} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[p.dataKey] }} />
                            <span className="text-muted-foreground">{CATEGORY_LABELS[p.dataKey] ?? p.dataKey}:</span>
                            <span className="font-medium text-foreground">{typeof p.value === "number" ? `${p.value.toFixed(1)}%` : p.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }} />
                  {CATEGORIES_ORDER.filter(cat => composicaoChartData.some(d => (d as any)[cat] > 0)).map(cat => (
                    <Area
                      key={cat}
                      type="monotone"
                      dataKey={cat}
                      stackId="1"
                      fill={CATEGORY_COLORS[cat]}
                      stroke={CATEGORY_COLORS[cat]}
                      fillOpacity={0.65}
                      name={CATEGORY_LABELS[cat]}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">Sem dados de composição</div>
            )}
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {CATEGORIES_ORDER.filter(cat => composicaoDistribuicao[cat as keyof typeof composicaoDistribuicao] > 0).map(cat => (
                <div key={cat} className="flex items-center gap-1.5 text-[10px]">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: CATEGORY_COLORS[cat] }} />
                  <span className="text-muted-foreground">{CATEGORY_LABELS[cat]}</span>
                  <span className="font-medium">{composicaoDistribuicao[cat as keyof typeof composicaoDistribuicao]}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* G3: Maturidade */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold">Maturidade</h4>
                <InfoTip text="Como tratam as ausências. Planejado = férias, licenças, abonos. Reativo = faltas, atestados de última hora." />
              </div>
              <button onClick={() => setChartDataModal("maturidade")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">{maturidadeChartData.length > 1 ? "Evolução mensal" : "Mar/2026"} · % sobre total</p>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={maturidadeChartData} stackOffset="expand">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickFormatter={v => `${Math.round(v * 100)}%`} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <RechartsTooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-card border border-border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                      <p className="font-semibold text-foreground">{label}</p>
                      {payload.map((p: any) => (
                        <div key={p.dataKey} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MATURIDADE_COLORS[p.dataKey] }} />
                          <span className="text-muted-foreground">{MATURIDADE_LABELS[p.dataKey]}:</span>
                          <span className="font-medium text-foreground">{typeof p.value === "number" ? `${p.value.toFixed(1)}%` : p.value}</span>
                        </div>
                      ))}
                    </div>
                  );
                }} />
                <Area type="monotone" dataKey="1_planejado" stackId="1" fill={MATURIDADE_COLORS["1_planejado"]} stroke={MATURIDADE_COLORS["1_planejado"]} fillOpacity={0.65} name="Planejado" />
                <Area type="monotone" dataKey="2_reativo" stackId="1" fill={MATURIDADE_COLORS["2_reativo"]} stroke={MATURIDADE_COLORS["2_reativo"]} fillOpacity={0.65} name="Reativo" />
              </AreaChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex gap-4 mt-2 justify-center">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MATURIDADE_COLORS["1_planejado"] }} />
                <span className="text-muted-foreground">Planejado</span>
                <span className="font-medium">{maturidadeDistribuicao.planejado}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: MATURIDADE_COLORS["2_reativo"] }} />
                <span className="text-muted-foreground">Reativo</span>
                <span className="font-medium">{maturidadeDistribuicao.reativo}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Insights inline ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-orange-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-orange-600">⚠ Alertas</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>• <span className="text-foreground font-medium">TERCEIRIZACAO</span> com 49% reativo (pior maturidade)</li>
              <li>• Falta crua subindo nos últimos 6 meses</li>
              <li>• {MOCK.demissoesAbertas} demissões em aberto, revisar fechamento</li>
            </ul>
          </div>
          <div className="bg-card border border-blue-200 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-blue-600">ℹ Informações</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>• {MOCK.cronicos.length} colaborador(es) com afastamento INSS {'>'} 180 dias</li>
              <li>• Operação estável após salto de HC em set/2025</li>
              <li>• Todas as 13 categorias de ausência mapeadas</li>
            </ul>
          </div>
        </div>
      </div>

      <GroupBySidebar
        items={sidebarItems}
        selectedRegional={selectedRegional}
        onRegionalClick={onRegionalClick}
        onItemDetail={onItemDetail}
        groupBy={groupBy}
        onGroupByChange={onGroupByChange}
        onPagedItemsChange={setVisibleNames}
      />

      {/* Data modals */}
      <ChartDataModal
        open={chartDataModal === "volume"}
        onClose={() => setChartDataModal(null)}
        title="Volume Mensal — Dados"
        data={volumeChartData}
        columns={[
          { key: "mes", label: "Competência" },
          { key: "taxa", label: "Taxa (%)", format: (v: number) => `${v}%` },
          { key: "horas", label: "Horas Perdidas", format: (v: number) => v?.toLocaleString("pt-BR") ?? "—" },
        ]}
      />
      <ChartDataModal
        open={chartDataModal === "composicao"}
        onClose={() => setChartDataModal(null)}
        title="Composição — Dados"
        data={composicaoChartData}
        columns={[
          { key: "mes", label: "Competência" },
          ...CATEGORIES_ORDER.map(cat => ({ key: cat, label: CATEGORY_LABELS[cat], format: (v: number) => `${v}%` })),
        ]}
      />
      <ChartDataModal
        open={chartDataModal === "maturidade"}
        onClose={() => setChartDataModal(null)}
        title="Maturidade — Dados"
        data={maturidadeChartData}
        columns={[
          { key: "mes", label: "Competência" },
          { key: "1_planejado", label: "Planejado (%)", format: (v: number) => `${v}%` },
          { key: "2_reativo", label: "Reativo (%)", format: (v: number) => `${v}%` },
        ]}
      />
    </div>
  );
}
