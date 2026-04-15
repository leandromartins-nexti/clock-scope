/**
 * AbsenteismoContent V2 — follows spec "lovable-prompt-aba-absenteismo-mockada-v3.md"
 * 
 * 6 BigNumbers: Score, HC Operacional, Taxa, % Faltas Injustificadas, % Crônicos, Horas Perdidas/Mês
 * 3 Charts: Volume Mensal (line), Composição (stacked area 100%), Maturidade (stacked area 100%)
 * Data source: static JSON from src/data/customers/642/absenteismo/
 * 
 * Conventions applied:
 * - Mapa de Operação as first component below BigNumbers
 * - Score Detail Panel (Dialog) on click instead of Popover
 */
import { useState, useMemo, useCallback } from "react";
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine,
  Cell, Bar, ScatterChart, Scatter, ZAxis, ReferenceArea, LabelList,
} from "recharts";
import { Database } from "lucide-react";
import ChartModeToggle from "@/components/analytics/ChartModeToggle";
import type { DataMode, ChartMode } from "@/components/analytics/ChartModeToggle";
import ChartDataModal from "@/components/analytics/ChartDataModal";
import ScoreGauge from "@/components/analytics/ScoreGauge";
import InfoTip from "@/components/analytics/InfoTip";
import { ScoreBoard, KPIBoard } from "@/components/analytics/KPIBoard";
import GroupBySidebar, { type GroupBy } from "@/components/analytics/GroupBySidebar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useAbsenteismoScoreConfig,
  computeVolumeScore as computeVolumeScoreCtx,
  computeComposicaoScore as computeComposicaoScoreCtx,
  computeMaturidadeScore as computeMaturidadeScoreCtx,
  computeAbsCompositeScore,
  getAbsScoreClassification,
  getAbsScoreColor,
  getAbsScoreLabel,
  getVolumeScoreLabel,
  getMaturidadeScoreLabel,
  type AbsenteismoScoreConfig,
} from "@/contexts/AbsenteismoScoreConfigContext";

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
  horasPerdidas12meses: 41197,
};

// Consolidado computed from real JSON data (12 months)
const volumeConsolidado = [
  { reference_date: "2025-04-01", horas_ausencia_total: 5122, horas_ausencia_nao_planejada: 3023, qtd_eventos: 493, pessoas_ausentes: 92 },
  { reference_date: "2025-05-01", horas_ausencia_total: 5881, horas_ausencia_nao_planejada: 3514, qtd_eventos: 571, pessoas_ausentes: 99 },
  { reference_date: "2025-06-01", horas_ausencia_total: 5293, horas_ausencia_nao_planejada: 2561, qtd_eventos: 498, pessoas_ausentes: 90 },
  { reference_date: "2025-07-01", horas_ausencia_total: 5661, horas_ausencia_nao_planejada: 2790, qtd_eventos: 559, pessoas_ausentes: 106 },
  { reference_date: "2025-08-01", horas_ausencia_total: 4870, horas_ausencia_nao_planejada: 2677, qtd_eventos: 485, pessoas_ausentes: 86 },
  { reference_date: "2025-09-01", horas_ausencia_total: 5013, horas_ausencia_nao_planejada: 2433, qtd_eventos: 458, pessoas_ausentes: 92 },
  { reference_date: "2025-10-01", horas_ausencia_total: 10199, horas_ausencia_nao_planejada: 2844, qtd_eventos: 1042, pessoas_ausentes: 252 },
  { reference_date: "2025-11-01", horas_ausencia_total: 9358, horas_ausencia_nao_planejada: 3787, qtd_eventos: 964, pessoas_ausentes: 269 },
  { reference_date: "2025-12-01", horas_ausencia_total: 10857, horas_ausencia_nao_planejada: 4416, qtd_eventos: 1164, pessoas_ausentes: 255 },
  { reference_date: "2026-01-01", horas_ausencia_total: 8961, horas_ausencia_nao_planejada: 4657, qtd_eventos: 945, pessoas_ausentes: 252 },
  { reference_date: "2026-02-01", horas_ausencia_total: 11466, horas_ausencia_nao_planejada: 4374, qtd_eventos: 1236, pessoas_ausentes: 259 },
  { reference_date: "2026-03-01", horas_ausencia_total: 6313, horas_ausencia_nao_planejada: 4121, qtd_eventos: 658, pessoas_ausentes: 149 },
];

// Composição distribution from real data (mar/2026)
const composicaoDistribuicao = { planejada: 35, saude: 47, operacional: 1, falta: 17, nao_categorizada: 0 };

// Maturidade distribution from real data (mar/2026)
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
  saude: "#f59e0b",
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

const CATEGORIES_ORDER = ["planejada", "saude", "operacional", "nao_categorizada", "falta"];

const REAL_TAXA_BY_GROUP: Record<GroupBy, Record<string, number>> = {
  empresa: {
    "SEGURANCA PATRIMONIAL": 12.87,
    "PORTARIA E LIMPEZA": 15.27,
    "TERCEIRIZACAO": 14.05,
  },
  unidade: {
    "PORTARIA E LIMPEZA": 15.27,
    "SEGURANCA PATRIMONIAL": 13.95,
    "TERCEIRIZACAO": 14.17,
  },
  area: {
    PIRACICABA: 16.83,
    "SAO PAULO": 14.32,
    SOROCABA: 15.88,
  },
};

function normalizeEntityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^VIG\s*EYES\s*/i, "")
    .replace(/\s+TERCEIRIZACAO\s+DE\s+SERVICOS\s+LTDA$/i, " TERCEIRIZACAO")
    .replace(/\s+SEGURANCA\s+PATRIMONIAL\s+LTDA$/i, " SEGURANCA PATRIMONIAL")
    .replace(/\s+PORTARIA\s+E\s+LIMPEZA\s+LTDA$/i, " PORTARIA E LIMPEZA")
    .replace(/\s+LTDA$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function getLatestReferenceDate(rows: Array<Record<string, any>>): string | null {
  if (!rows.length) return null;
  return rows.reduce((latest, row) => (row.reference_date > latest ? row.reference_date : latest), rows[0].reference_date);
}

function computeEntityComposicaoDistribution(
  entityName: string,
  groupBy: GroupBy,
  nameField: string,
): typeof composicaoDistribuicao {
  const raw = (groupBy === "empresa" ? composicaoEmpresa : groupBy === "area" ? composicaoArea : composicaoUnNegocio) as Array<Record<string, any>>;
  const normalizedEntity = normalizeEntityName(entityName);
  const filtered = raw.filter((row) => normalizeEntityName(String(row[nameField] ?? "")) === normalizedEntity);
  const latestDate = getLatestReferenceDate(filtered);

  if (!latestDate) {
    return { planejada: 0, saude: 0, operacional: 0, falta: 0, nao_categorizada: 0 };
  }

  const latestRows = filtered.filter((row) => row.reference_date === latestDate);
  const totals = { planejada: 0, saude: 0, operacional: 0, falta: 0, nao_categorizada: 0 };
  let totalHoras = 0;

  for (const row of latestRows) {
    const category = CATEGORY_MAP[row.absence_situation_id] ?? "nao_categorizada";
    const horas = row.horas_total ?? 0;
    totals[category as keyof typeof totals] += horas;
    totalHoras += horas;
  }

  if (totalHoras === 0) return totals;

  return {
    planejada: +((totals.planejada / totalHoras) * 100).toFixed(1),
    saude: +((totals.saude / totalHoras) * 100).toFixed(1),
    operacional: +((totals.operacional / totalHoras) * 100).toFixed(1),
    falta: +((totals.falta / totalHoras) * 100).toFixed(1),
    nao_categorizada: +((totals.nao_categorizada / totalHoras) * 100).toFixed(1),
  };
}

function computeEntityMaturidadeDistribution(
  entityName: string,
  groupBy: GroupBy,
  nameField: string,
): typeof maturidadeDistribuicao {
  const raw = (groupBy === "empresa" ? maturidadeEmpresa : groupBy === "area" ? maturidadeArea : maturidadeUnNegocio) as Array<Record<string, any>>;
  const normalizedEntity = normalizeEntityName(entityName);
  const filtered = raw.filter((row) => normalizeEntityName(String(row[nameField] ?? "")) === normalizedEntity);
  const latestDate = getLatestReferenceDate(filtered);

  if (!latestDate) {
    return { planejado: 0, reativo: 0 };
  }

  const latestRows = filtered.filter((row) => row.reference_date === latestDate);
  let planejadoHoras = 0;
  let reativoHoras = 0;

  for (const row of latestRows) {
    const categoria = String(row.categoria ?? "").replace(/-/g, "_");
    const horas = row.horas_total ?? 0;
    if (categoria === "1_planejado") planejadoHoras += horas;
    if (categoria === "2_reativo") reativoHoras += horas;
  }

  const totalHoras = planejadoHoras + reativoHoras;
  if (totalHoras === 0) return { planejado: 0, reativo: 0 };

  return {
    planejado: +((planejadoHoras / totalHoras) * 100).toFixed(1),
    reativo: +((reativoHoras / totalHoras) * 100).toFixed(1),
  };
}

// Score functions now delegate to config-based context functions.
// They are called inside the component with the config from useAbsenteismoScoreConfig().
// See computeVolumeScoreCtx, computeComposicaoScoreCtx, computeMaturidadeScoreCtx in the context.

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
  const { config: absConfig } = useAbsenteismoScoreConfig();
  const [selectedMes, setSelectedMes] = useState<string | null>(null);
  const [volumeChartMode, setVolumeChartMode] = useState<ChartMode>("line");
  const [volumeDataMode, setVolumeDataMode] = useState<DataMode>("percent");
  const [chartDataModal, setChartDataModal] = useState<string | null>(null);
  const [visibleNames, setVisibleNames] = useState<string[]>([]);
  const [scoreDetailOpen, setScoreDetailOpen] = useState(false);
  const [fixedBubble, setFixedBubble] = useState<string | null>(null);
  const [mapaScoreFilter, setMapaScoreFilter] = useState<Set<string>>(() => new Set(["green", "orange", "red"]));

  // Config-aware score helpers (closures over absConfig)
  const computeEntityScore = useCallback((entityName: string, gb: GroupBy, nf: string): number => {
    const normalizedEntity = normalizeEntityName(entityName);
    const taxaEntry = Object.entries(REAL_TAXA_BY_GROUP[gb]).find(([label]) => normalizeEntityName(label) === normalizedEntity);
    const taxa = taxaEntry?.[1] ?? 0;
    const volScore = computeVolumeScoreCtx(taxa, absConfig);
    const composicao = computeEntityComposicaoDistribution(entityName, gb, nf);
    const maturidade = computeEntityMaturidadeDistribution(entityName, gb, nf);
    const compScore = computeComposicaoScoreCtx(composicao, absConfig);
    const matScore = computeMaturidadeScoreCtx(maturidade.planejado, absConfig);
    return computeAbsCompositeScore(volScore, compScore, matScore, absConfig);
  }, [absConfig]);

  const toggleMapaScoreFilter = useCallback((cat: string) => {
    setMapaScoreFilter(prev => {
      const next = new Set(prev);
      if (next.has(cat)) { if (next.size > 1) next.delete(cat); } else { next.add(cat); }
      return next;
    });
  }, []);

  // ── Data by dimension ──
  const volumeByDim = useMemo(() => {
    const raw = groupBy === "empresa" ? volumeEmpresa : groupBy === "area" ? volumeArea : volumeUnNegocio;
    return raw as Array<Record<string, any>>;
  }, [groupBy]);

  const nameField = groupBy === "empresa" ? "company_name" : groupBy === "area" ? "area_name" : "business_unit_name";

  // Build volume chart data
  const volumeChartData = useMemo(() => {
    if (selectedRegional) {
      const filtered = volumeByDim.filter(d => d[nameField] === selectedRegional);
      return Object.keys(MESES_LABELS).map(date => {
        const row = filtered.find(d => d.reference_date === date);
        const horas = row?.horas_ausencia ?? 0;
        const pessoas = row?.pessoas_ausentes ?? 0;
        const taxa = pessoas > 0 ? +((horas / (pessoas * 200)) * 100).toFixed(2) : 0;
        return {
          mes: MESES_LABELS[date],
          horas,
          eventos: row?.qtd_eventos ?? 0,
          pessoas,
          taxa,
          hcMes: pessoas,
        };
      });
    }
    return volumeConsolidado.map(d => ({
      mes: MESES_LABELS[d.reference_date],
      horas: d.horas_ausencia_nao_planejada,
      horasTotal: d.horas_ausencia_total,
      taxa: d.pessoas_ausentes > 0 ? +((d.horas_ausencia_nao_planejada / (d.pessoas_ausentes * 200)) * 100).toFixed(2) : 0,
      hcMes: d.pessoas_ausentes,
    }));
  }, [selectedRegional, volumeByDim, nameField]);

  // ── Composição chart data (stacked area 100%) ──
  const composicaoChartData = useMemo(() => {
    const raw = groupBy === "empresa" ? composicaoEmpresa : groupBy === "area" ? composicaoArea : composicaoUnNegocio;
    const nf = nameField;
    const dates = Object.keys(MESES_LABELS);

    return dates.map(date => {
      let items = (raw as any[]).filter(d => d.reference_date === date);
      if (selectedRegional) {
        items = items.filter(d => d[nf] === selectedRegional);
      }
      const byCategory: Record<string, number> = {};
      let total = 0;
      for (const item of items) {
        const cat = CATEGORY_MAP[item.absence_situation_id] ?? "nao_categorizada";
        const h = item.horas_total ?? 0;
        byCategory[cat] = (byCategory[cat] ?? 0) + h;
        total += h;
      }
      return {
        mes: MESES_LABELS[date],
        volumeTotal: total,
        ...Object.fromEntries(
          CATEGORIES_ORDER.map(cat => [cat, total > 0 ? +((( byCategory[cat] ?? 0) / total) * 100).toFixed(1) : 0])
        ),
      };
    }).filter(d => CATEGORIES_ORDER.some(c => (d as any)[c] > 0));
  }, [groupBy, selectedRegional, nameField]);

  // ── Maturidade chart data (stacked area 100%) + % falta crua from composição ──
  const maturidadeChartData = useMemo(() => {
    const raw = groupBy === "empresa" ? maturidadeEmpresa : groupBy === "area" ? maturidadeArea : maturidadeUnNegocio;
    const compRaw = groupBy === "empresa" ? composicaoEmpresa : groupBy === "area" ? composicaoArea : composicaoUnNegocio;
    const nf = nameField;
    const dates = Object.keys(MESES_LABELS);

    // Compute % falta crua per month from composição data
    const faltaPctByMonth: Record<string, number> = {};
    for (const date of dates) {
      let items = (compRaw as any[]).filter(d => d.reference_date === date);
      if (selectedRegional) items = items.filter(d => d[nf] === selectedRegional);
      let faltaH = 0, totalH = 0;
      for (const item of items) {
        const cat = CATEGORY_MAP[item.absence_situation_id] ?? "nao_categorizada";
        const h = item.horas_total ?? 0;
        if (cat === "falta") faltaH += h;
        totalH += h;
      }
      faltaPctByMonth[date] = totalH > 0 ? +((faltaH / totalH) * 100).toFixed(1) : 0;
    }
    
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
          pctFalta: faltaPctByMonth[date] ?? 0,
        };
      });
    }
    
    let filtered = raw as any[];
    if (selectedRegional) filtered = filtered.filter(d => d[nf] === selectedRegional);
    
    const totalHoras = filtered.reduce((s, d) => s + (d.horas_total ?? 0), 0);
    const planejadoHoras = filtered.filter(d => d.categoria === "1_planejado").reduce((s, d) => s + (d.horas_total ?? 0), 0);
    const reativoHoras = filtered.filter(d => d.categoria === "2_reativo").reduce((s, d) => s + (d.horas_total ?? 0), 0);
    
    return [{
      mes: "mar/26",
      "1_planejado": totalHoras > 0 ? +((planejadoHoras / totalHoras) * 100).toFixed(1) : 0,
      "2_reativo": totalHoras > 0 ? +((reativoHoras / totalHoras) * 100).toFixed(1) : 0,
      pctFalta: faltaPctByMonth["2026-03-01"] ?? 0,
    }];
  }, [groupBy, selectedRegional, nameField]);

  // ── Score computation ──
  const lastEntry = volumeConsolidado[volumeConsolidado.length - 1];
  const latestTaxa = lastEntry.pessoas_ausentes > 0 ? +((lastEntry.horas_ausencia_nao_planejada / (lastEntry.pessoas_ausentes * 200)) * 100).toFixed(2) : 0;
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
  const pctMaturidade = maturidadeDistribuicao.planejado;
  const matFaixa = computeMaturidadeScore(maturidadeDistribuicao);

  // ── Sidebar items ──
  const sidebarItems = useMemo(() => {
    const raw = groupBy === "empresa" ? volumeEmpresa : groupBy === "area" ? volumeArea : volumeUnNegocio;
    const nf = nameField;
    const entities = new Set<string>();
    
    for (const row of raw as any[]) {
      entities.add(row[nf]);
    }
    
    return [...entities].map((nome) => {
      const score = computeEntityScore(nome, groupBy, nf);
      return {
        nome,
        value: nome,
        score,
      };
    }).sort((a, b) => b.score - a.score);
  }, [groupBy, nameField]);

  // ── Mapa de Operações data (Convention 1) ──
  const visibleSet = useMemo(() => new Set(visibleNames), [visibleNames]);

  const mapaOperacoesData = useMemo(() => {
    const raw = groupBy === "empresa" ? volumeEmpresa : groupBy === "area" ? volumeArea : volumeUnNegocio;
    const nf = nameField;
    const entities = new Map<string, { headcount: number }>();

    for (const row of raw as any[]) {
      const name = row[nf];
      if (!entities.has(name)) entities.set(name, { headcount: 0 });
      const e = entities.get(name)!;
      e.headcount = Math.max(e.headcount, row.pessoas_ausentes ?? row.headcount ?? 0);
    }

    return [...entities.entries()]
      .filter(([nome]) => visibleSet.size === 0 || visibleSet.has(nome))
      .map(([nome, data]) => {
        const score = computeEntityScore(nome, groupBy, nf);
        const bubbleColor = score >= 70 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
        return {
          regional: nome,
          headcount: data.headcount || 10,
          score,
          classifLabel: getScoreLabel(score),
          bubbleColor,
        };
      });
  }, [groupBy, nameField, visibleSet]);

  const medianHeadcount = useMemo(() => {
    if (!mapaOperacoesData.length) return 100;
    const sorted = [...mapaOperacoesData].sort((a, b) => a.headcount - b.headcount);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1].headcount + sorted[mid].headcount) / 2) : sorted[mid].headcount;
  }, [mapaOperacoesData]);

  const mapaDomain = useMemo(() => {
    if (!mapaOperacoesData.length) return { xMin: 0, xMax: 600, yMin: 0, yMax: 110, xTicks: [0, 100, 200, 300, 400, 500, 600] };
    const hcs = mapaOperacoesData.map(d => d.headcount);
    const maxHc = Math.max(...hcs);
    const niceSteps = [50, 100, 150, 200, 250, 500];
    const raw = maxHc * 1.15;
    const step = niceSteps.find(s => Math.ceil(raw / s) <= 6) || Math.ceil(raw / 6 / 50) * 50;
    const xMax = Math.ceil(raw / step) * step || 600;
    const xMin = -Math.round(xMax * 0.05);
    const xTicks = Array.from({ length: 7 }, (_, i) => Math.round((xMax / 6) * i));
    return { xMin, xMax, yMin: 0, yMax: 110, xTicks };
  }, [mapaOperacoesData]);

  const criticalCount = useMemo(() => mapaOperacoesData.filter(d => d.score < 50 && d.headcount > medianHeadcount).length, [mapaOperacoesData, medianHeadcount]);

  // ── Chart interactions ──
  const handleChartClick = (e: any) => {
    if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
  };

  const xTick = (props: any) => {
    const { x, y, payload } = props;
    const isActive = selectedMes === payload.value;
    return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
  };

  const mediaTaxa = volumeConsolidado.reduce((s, d) => {
    const t = d.pessoas_ausentes > 0 ? (d.horas_ausencia_nao_planejada / (d.pessoas_ausentes * 200)) * 100 : 0;
    return s + t;
  }, 0) / volumeConsolidado.length;

  // ── Score breakdown data for detail panel ──
  const scoreBreakdownComponents = [
    {
      metrica: "Volume",
      peso: 50,
      valor_atual: `${latestTaxa}%`,
      nota: volScore.score,
      faixa: volScore.label,
      contribuicao: Math.round(volScore.score * 0.5),
      cor_semantica: volScore.score >= 75 ? "success" : volScore.score >= 50 ? "warning" : "critical",
      descricao: "Taxa de absenteísmo operacional (excluindo planejadas). Quanto menor, melhor.",
    },
    {
      metrica: "Composição",
      peso: 30,
      valor_atual: `${composicaoDistribuicao.planejada}% planej.`,
      nota: compScore,
      faixa: getScoreLabel(compScore),
      contribuicao: Math.round(compScore * 0.3),
      cor_semantica: compScore >= 75 ? "success" : compScore >= 50 ? "warning" : "critical",
      descricao: "Distribuição das ausências por categoria. Mais planejadas = melhor.",
    },
    {
      metrica: "Maturidade",
      peso: 20,
      valor_atual: `${maturidadeDistribuicao.planejado}% planej.`,
      nota: matScore.score,
      faixa: matScore.label,
      contribuicao: Math.round(matScore.score * 0.2),
      cor_semantica: matScore.score >= 75 ? "success" : matScore.score >= 50 ? "warning" : "critical",
      descricao: "Proporção de ausências planejadas vs reativas. Mais planejado = mais maduro.",
    },
  ];

  // ── Render volume chart ──
  const renderVolumeChart = () => {
    const isValor = volumeDataMode === "valor";
    const dataKey = isValor ? "horas" : "taxa";
    const yFmt = (v: number) => isValor ? formatHoursCompact(v) : `${v}%`;
    const color = "#ef4444";
    const data = volumeChartData;

    const tooltipContent = ({ active, payload, label }: any) => {
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
    };

    if (volumeChartMode === "bar") {
      return (
        <ComposedChart data={data} onClick={handleChartClick}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" tick={xTick} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={yFmt} label={{ value: isValor ? "Horas" : "Taxa (%)", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <RechartsTooltip content={tooltipContent} />
          {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
          {!isValor && <ReferenceLine y={mediaTaxa} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
          <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
            {data.map((entry, idx) => (
              <Cell key={idx} fill={selectedMes && selectedMes !== (entry as any).mes ? `${color}40` : `${color}A6`} />
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
          <RechartsTooltip content={tooltipContent} />
          {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
          {!isValor && <ReferenceLine y={mediaTaxa} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`${color}${selectedMes ? "33" : "59"}`} fillOpacity={1} />
        </AreaChart>
      );
    }

    // line (default) — ComposedChart to overlay HC line
    return (
      <ComposedChart data={data} onClick={handleChartClick}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="mes" tick={xTick} />
        <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={yFmt} domain={["auto", "auto"]} label={{ value: isValor ? "Horas" : "Taxa (%)", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={v => `${v}`} label={{ value: "HC", angle: 90, position: "insideRight", fontSize: 10, fill: "#9ca3af" }} hide={!data[0]?.hcMes} />
        <RechartsTooltip content={({ active, payload, label }: any) => {
          if (!active || !payload?.length) return null;
          const d = payload[0]?.payload;
          return (
            <div className="bg-card border border-border rounded-lg p-2.5 shadow-md text-xs space-y-1">
              <p className="font-semibold text-foreground">{label}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-muted-foreground">{isValor ? "Horas perdidas:" : "Taxa:"}</span>
                <span className="font-medium text-foreground">{isValor ? d?.horas?.toLocaleString("pt-BR") : `${d?.taxa}%`}</span>
              </div>
              {d?.hcMes && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#D3D1C7" }} />
                  <span className="text-muted-foreground">HC Operacional:</span>
                  <span className="font-medium text-foreground">{d.hcMes}</span>
                </div>
              )}
            </div>
          );
        }} />
        {!isValor && <ReferenceLine yAxisId="left" y={mediaTaxa} stroke="#C8860A99" strokeWidth={1.5} strokeDasharray="8 4" />}
        <Line yAxisId="left" type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={(props: any) => {
          const { cx, cy, payload } = props;
          const isSelected = selectedMes === payload.mes;
          const isActiveD = !selectedMes || isSelected;
          return (
            <g key={payload.mes} className="cursor-pointer">
              {isSelected && <circle cx={cx} cy={cy} r={10} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1} strokeDasharray="3 2" />}
              <circle cx={cx} cy={cy} r={isSelected ? 6 : 4} fill={isSelected ? color : isActiveD ? color : `${color}55`} stroke="#fff" strokeWidth={2} />
            </g>
          );
        }} activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: "#fff" }} name="Taxa" />
        {data[0]?.hcMes !== undefined && (
          <Area yAxisId="right" type="monotone" dataKey="hcMes" fill="#D3D1C7" fillOpacity={0.4} stroke="#D3D1C7" strokeWidth={0} name="HC Operacional" />
        )}
      </ComposedChart>
    );
  };

  // CATEGORIES_ORDER moved to module level

  return (
    <div className="flex w-full flex-1 min-w-0">
      <div className="flex-1 min-w-0 space-y-3 pl-6 pr-4 py-4">
        {/* ── BigNumbers (6 cards) ── */}
        <div className="grid grid-cols-6 gap-3">
          {/* 1. Score Absenteísmo */}
          <ScoreBoard title="Score Absenteísmo" tooltip="Score composto: Volume (50%) + Composição (30%) + Maturidade (20%). Clique para detalhes.">
            <button className="cursor-pointer" onClick={() => setScoreDetailOpen(true)} title="Ver decomposição do score">
              <ScoreGauge score={compositeScore} label={`${compositeScore}`} faixa={scoreLabel} color={scoreColor} />
            </button>
            {(() => {
              const anterior = 25;
              const delta = compositeScore - anterior;
              const absDelta = Math.abs(delta);
              const arrow = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
              const dColor = absDelta < 1 ? "text-muted-foreground" : delta > 0 ? "text-green-600" : "text-red-600";
              return (
                <span className={`text-[9px] flex items-center gap-0.5 -mt-0.5 ${dColor}`}>
                  {arrow} {Math.round(absDelta)}pp vs {anterior} (ant.)
                </span>
              );
            })()}
          </ScoreBoard>

          {/* 2. Taxa Absenteísmo → vinculado a G1 */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Taxa Absenteísmo</p>
              <InfoTip text="Taxa de absenteísmo operacional na última competência. Hover para ver horas perdidas." />
            </div>
            <p className={`text-xl font-bold mt-0.5 truncate ${latestTaxa <= 2.5 ? "text-green-600" : latestTaxa <= 6.0 ? "text-orange-500" : "text-red-600"}`} title={`Horas perdidas no mês: ${formatHoursCompact(horasPerdidaMes)} · Acumulado 12m: ${formatHoursCompact(MOCK.horasPerdidas12meses)}`}>{latestTaxa}%</p>
            <p className={`text-[11px] mt-0.5 font-medium ${latestTaxa <= 2.5 ? "text-green-600" : latestTaxa <= 6.0 ? "text-orange-500" : "text-red-600"}`}>
              {volScore.label}
            </p>
            {(() => {
              const prevTaxa = (() => {
                const prev = volumeConsolidado[volumeConsolidado.length - 2];
                return prev && prev.pessoas_ausentes > 0 ? +((prev.horas_ausencia_nao_planejada / (prev.pessoas_ausentes * 200)) * 100).toFixed(2) : null;
              })();
              if (prevTaxa === null) return <span className="text-[10px] mt-1 text-muted-foreground">sem histórico</span>;
              const d = +(latestTaxa - prevTaxa).toFixed(1);
              const arrow = d > 0 ? "↑" : d < 0 ? "↓" : "→";
              const dColor = Math.abs(d) < 0.1 ? "text-muted-foreground" : d > 0 ? "text-red-600" : "text-green-600";
              return <span className={`text-[10px] flex items-center gap-0.5 mt-1 ${dColor}`}>{arrow} {Math.abs(d).toFixed(1)}pp vs {prevTaxa}% (ant.)</span>;
            })()}
          </div>

          {/* 3. % Faltas Injustificadas → vinculado a G2 */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">% Faltas Injustif.</p>
              <InfoTip text="Percentual de horas de falta injustificada sobre o total de ausências." />
            </div>
            <p className={`text-xl font-bold mt-0.5 truncate ${pctFaltasInjustificadas >= 15 ? "text-red-600" : pctFaltasInjustificadas >= 10 ? "text-orange-500" : "text-green-600"}`}>{pctFaltasInjustificadas}%</p>
            <p className={`text-[11px] mt-0.5 font-medium ${pctFaltasInjustificadas >= 15 ? "text-red-600" : pctFaltasInjustificadas >= 10 ? "text-orange-500" : "text-green-600"}`}>
              {pctFaltasInjustificadas >= 15 ? "Crítico" : pctFaltasInjustificadas >= 10 ? "Atenção" : "Bom"}
            </p>
            <span className="text-[10px] flex items-center gap-0.5 mt-1 text-red-600">↑ 2pp vs 15% (ant.)</span>
          </div>

          {/* 4. % Maturidade → vinculado a G3 */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">% Maturidade</p>
              <InfoTip text="Percentual planejado vs reativo. Quanto maior o planejado, mais madura a gestão." />
            </div>
            <p className={`text-xl font-bold mt-0.5 truncate ${pctMaturidade >= 85 ? "text-green-600" : pctMaturidade >= 70 ? "text-orange-500" : "text-red-600"}`}>{pctMaturidade}%</p>
            <p className={`text-[11px] mt-0.5 font-medium ${pctMaturidade >= 85 ? "text-green-600" : pctMaturidade >= 70 ? "text-orange-500" : "text-red-600"}`}>
              {matFaixa.label}
            </p>
            <span className="text-[10px] flex items-center gap-0.5 mt-1 text-muted-foreground">planejado vs reativo</span>
          </div>

          {/* 5. Melhor Operação */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Melhor Operação</p>
              <InfoTip text="Operação com maior score de absenteísmo (menor risco)." />
            </div>
            {(() => {
              const sorted = [...mapaOperacoesData].sort((a, b) => b.score - a.score);
              const best = sorted[0];
              if (!best) return <p className="text-sm text-muted-foreground">—</p>;
              const clean = best.regional.replace(/^VIG\s*EYES\s*/i, "").trim();
              return (
                <>
                  <p className="text-base font-bold mt-0.5 truncate text-green-600" title={best.regional}>{clean}</p>
                  <p className="text-[11px] mt-0.5 font-medium text-green-600">Score {best.score}</p>
                  <span className="text-[10px] flex items-center gap-0.5 mt-1 text-muted-foreground">1º de {sorted.length}</span>
                </>
              );
            })()}
          </div>

          {/* 6. Maior Risco */}
          <div className="bg-card border border-border/50 rounded-xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col">
            <div className="flex items-center gap-1 mb-2">
              <p className="text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">Maior Risco</p>
              <InfoTip text="Operação com menor score de absenteísmo (maior risco)." />
            </div>
            {(() => {
              const sorted = [...mapaOperacoesData].sort((a, b) => a.score - b.score);
              const worst = sorted[0];
              if (!worst) return <p className="text-sm text-muted-foreground">—</p>;
              const clean = worst.regional.replace(/^VIG\s*EYES\s*/i, "").trim();
              return (
                <>
                  <p className="text-base font-bold mt-0.5 truncate text-red-600" title={worst.regional}>{clean}</p>
                  <p className="text-[11px] mt-0.5 font-medium text-red-600">Score {worst.score}</p>
                  <span className="text-[10px] flex items-center gap-0.5 mt-1 text-muted-foreground">{sorted.length}º de {sorted.length}</span>
                </>
              );
            })()}
          </div>
        </div>

        {/* ── Row 1: Mapa de Operações + Volume Mensal (grid 2 colunas) ── */}
        <div className="grid grid-cols-2 gap-3">
        <div className={`bg-card border rounded-xl p-4 ${selectedRegional ? "border-[#FF5722]/30" : "border-border/50"}`}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold">Mapa de Operações</h4>
              <InfoTip text="Cada bolha é uma operação. Posição horizontal mostra o headcount (escala). Posição vertical mostra o Score de Absenteísmo (saúde). Cor da bolha reforça a classificação." />
            </div>
            <div className="flex items-center gap-1.5">
              {criticalCount > 0 && (
                <span className="text-[10px] font-medium bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                  {criticalCount} crítica{criticalCount > 1 ? "s" : ""}
                </span>
              )}
              <button onClick={() => setChartDataModal("mapaOperacoes")} className="p-1 rounded hover:bg-muted/60 transition-colors" title="Ver dados">
                <Database className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mb-2">
            Headcount × Score Absenteísmo · uma bolha por {groupBy === "empresa" ? "empresa" : groupBy === "unidade" ? "un. negócio" : "área"}{selectedMes ? ` · ${selectedMes}` : " · consolidado"}
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <ScatterChart margin={{ top: 5, right: 50, bottom: 10, left: 0 }}>
              <defs>
                <linearGradient id="mapaAbsGradient" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.20} />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity={0.10} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0.15} />
                </linearGradient>
              </defs>
              <ReferenceArea x1={mapaDomain.xMin} x2={mapaDomain.xMax} y1={mapaDomain.yMin} y2={mapaDomain.yMax} fill="url(#mapaAbsGradient)" strokeOpacity={0} />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="headcount" name="Headcount" domain={[mapaDomain.xMin, mapaDomain.xMax]} ticks={mapaDomain.xTicks} tick={{ fontSize: 10 }} label={{ value: "Headcount", position: "insideBottom", offset: -5, fontSize: 10 }} />
              <YAxis type="number" dataKey="score" name="Score Absenteísmo" domain={[mapaDomain.yMin, mapaDomain.yMax]} ticks={[0, 25, 50, 75, 100]} tick={{ fontSize: 10 }} label={{ value: "Score Absenteísmo", angle: -90, position: "insideLeft", fontSize: 10 }} />
              <ZAxis type="number" range={[150, 150]} />
              <ReferenceLine y={70} stroke="#22c55e" strokeWidth={1.5} strokeDasharray="8 4" label={({ viewBox }: any) => {
                const { y, width, x } = viewBox || {};
                const rightEdge = (x ?? 0) + (width ?? 0);
                return (
                  <g>
                    <text x={rightEdge + 4} y={(y ?? 0) - 4} fontSize={8} fill="#22c55e" fontWeight={500} textAnchor="start">Limite</text>
                    <text x={rightEdge + 4} y={(y ?? 0) + 6} fontSize={8} fill="#22c55e" fontWeight={500} textAnchor="start">saudável</text>
                  </g>
                );
              }} />
              <RechartsTooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                const groupLabel = groupBy === "empresa" ? "empresa" : groupBy === "unidade" ? "un. negócio" : "área";
                return (
                  <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                    <p className="font-semibold text-sm">{d.regional}</p>
                    <p className="text-muted-foreground text-[10px]">{groupLabel}</p>
                    <hr className="border-border/50" />
                    <p>Score: <span className="font-bold" style={{ color: d.bubbleColor }}>{d.score}</span> · {d.classifLabel}</p>
                    <p>Headcount: <span className="font-medium">{d.headcount}</span></p>
                  </div>
                );
              }} />
              <Scatter data={mapaOperacoesData.filter(d => {
                const cat = d.score >= 70 ? "green" : d.score >= 50 ? "orange" : "red";
                return mapaScoreFilter.has(cat);
              })} shape={(props: any) => {
                const { cx, cy, payload } = props;
                const r = 14;
                const isFixed = fixedBubble === payload.regional;
                const isSelected = !selectedRegional || selectedRegional === payload.regional;
                const hasFilter = !!selectedRegional;
                const opacity = isFixed ? 0.85 : isSelected ? 0.75 : 0.45;
                const clean = payload.regional.replace(/^VIG\s*EYES\s*/i, "").trim();
                const abbr = clean ? clean.slice(0, 3).toUpperCase() : payload.regional.slice(0, 3).toUpperCase();
                return (
                  <g
                    onClick={() => {
                      setFixedBubble(prev => prev === payload.regional ? null : payload.regional);
                      onRegionalClick(payload.regional);
                    }}
                    onContextMenu={(e: any) => { e.preventDefault(); e.stopPropagation(); onItemDetail?.(payload.regional); }}
                    className="cursor-pointer"
                  >
                    <circle cx={cx} cy={cy} r={r} fill={payload.bubbleColor} fillOpacity={opacity}
                      stroke={isFixed && hasFilter ? "#FF5722" : payload.bubbleColor}
                      strokeWidth={isFixed && hasFilter ? 2 : 1}
                      strokeDasharray={isFixed && hasFilter ? "4 3" : "none"}
                    />
                    <text x={cx} y={cy - 3} textAnchor="middle" fontSize={8} fontWeight={700} fill="#fff" dominantBaseline="middle">{abbr}</text>
                    <text x={cx} y={cy + 6} textAnchor="middle" fontSize={7} fontWeight={600} fill="#fff" dominantBaseline="middle">{payload.score}</text>
                  </g>
                );
              }} />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-3 mt-1 text-[10px]">
            {[
              { cat: "green", color: "#22c55e", label: "≥ 70" },
              { cat: "orange", color: "#f59e0b", label: "50-70" },
              { cat: "red", color: "#ef4444", label: "< 50" },
            ].map(({ cat, color, label }) => {
              const active = mapaScoreFilter.has(cat);
              return (
                <button
                  key={cat}
                  onClick={() => toggleMapaScoreFilter(cat)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all ${
                    active ? "border-border/60 text-foreground" : "border-transparent text-muted-foreground/40 line-through"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full inline-block transition-opacity" style={{ backgroundColor: color, opacity: active ? 1 : 0.3 }} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* G1: Evolução da Taxa de Absenteísmo */}
        <div className={`bg-card border rounded-xl p-4 ${selectedMes ? "border-[#FF5722]/30" : "border-border/50"}`}>
          <div className="flex items-center justify-between mb-0.5">
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold">Evolução da Taxa de Absenteísmo</h4>
                <InfoTip text="Quanto a operação está perdendo para ausência. Taxa = horas não-planejadas / (HC × jornada mensal)." />
              </div>
              <p className="text-[10px] text-muted-foreground mb-2">Taxa mensal · linha cinza = HC operacional · clique para filtrar competência</p>
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
        </div>{/* close grid-cols-2 row 1 */}

        {/* ── G2 + G3: Composição + Maturidade side by side ── */}
        <div className="grid grid-cols-2 gap-3">
          {/* G2: Composição das Ausências por Tipo */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold">Composição das Ausências por Tipo</h4>
                <InfoTip text="Por que estão faltando. Distribuição de horas de ausência por categoria semântica." />
              </div>
              <button onClick={() => setChartDataModal("composicao")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Evolução mensal · % sobre total de horas · linha = volume absoluto</p>
            {composicaoChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={composicaoChartData} onClick={(e: any) => {
                  if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
                }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="mes" tick={(props: any) => {
                    const { x, y, payload } = props;
                    const isActive = selectedMes === payload.value;
                    return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                  }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 10 }} domain={[0, 100]} tickFormatter={v => `${v}%`} label={{ value: "Distribuição (%)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" }, offset: 0 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickFormatter={v => formatHoursCompact(v)} label={{ value: "Volume (h)", angle: 90, position: "insideRight", style: { fontSize: 10, fill: "#9ca3af" }, offset: 0 }} />
                  {selectedMes && <ReferenceLine yAxisId="left" x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                  <RechartsTooltip content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                        <p className="font-semibold text-foreground">{label}</p>
                        {payload.filter((p: any) => p.dataKey && CATEGORY_LABELS[p.dataKey]).map((p: any) => (
                          <div key={p.dataKey} className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5" style={{ backgroundColor: CATEGORY_COLORS[p.dataKey] }} />
                            <span className="text-muted-foreground">{CATEGORY_LABELS[p.dataKey]}:</span>
                            <span className="font-medium text-foreground">{typeof p.value === "number" ? `${p.value.toFixed(1)}%` : p.value}</span>
                          </div>
                        ))}
                        {d?.volumeTotal > 0 && (
                          <div className="flex items-center gap-1.5 border-t border-border/30 pt-1 mt-1">
                            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#3b82f6" }} />
                            <span className="text-muted-foreground">Volume total:</span>
                            <span className="font-medium text-foreground">{d.volumeTotal.toLocaleString("pt-BR")}h</span>
                          </div>
                        )}
                      </div>
                    );
                  }} />
                  {CATEGORIES_ORDER.filter(cat => composicaoChartData.some(d => (d as any)[cat] > 0)).map((cat, catIdx, arr) => (
                    <Bar
                      key={cat}
                      dataKey={cat}
                      stackId="1"
                      yAxisId="left"
                      radius={catIdx === arr.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                      name={CATEGORY_LABELS[cat]}
                    >
                      {composicaoChartData.map((entry, idx) => {
                        const isActive = selectedMes && selectedMes === (entry as any).mes;
                        const dimmed = selectedMes && selectedMes !== (entry as any).mes;
                        return <Cell key={idx} fill={CATEGORY_COLORS[cat]} fillOpacity={dimmed ? 0.25 : 0.65} stroke={isActive ? "#FF5722" : CATEGORY_COLORS[cat]} strokeOpacity={0.5} strokeWidth={isActive ? 2 : 1} strokeDasharray={isActive ? "4 3" : "none"} />;
                      })}
                    </Bar>
                  ))}
                  <Line yAxisId="right" type="monotone" dataKey="volumeTotal" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: "#3b82f6", stroke: "#3b82f6", strokeWidth: 0 }} name="Volume Total (h)" />
                  <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} payload={[
                    ...CATEGORIES_ORDER.filter(cat => composicaoChartData.some(d => (d as any)[cat] > 0)).map(cat => ({
                      value: `${CATEGORY_LABELS[cat]} ${composicaoDistribuicao[cat as keyof typeof composicaoDistribuicao] ?? 0}%`,
                      type: "square" as const,
                      color: CATEGORY_COLORS[cat],
                    })),
                    { value: "Volume Total", type: "line" as const, color: "#3b82f6" },
                  ]} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">Sem dados de composição</div>
            )}

          </div>

          {/* G3: Maturidade da Gestão (Planejado vs Reativo) */}
          <div className="bg-card border border-border/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold">Maturidade da Gestão</h4>
                <InfoTip text="Como tratam as ausências. Planejado = férias, licenças, abonos. Reativo = faltas, atestados de última hora." />
              </div>
              <button onClick={() => setChartDataModal("maturidade")} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Ver dados"><Database className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Evolução mensal · % planejado vs reativo · linha vermelha = % falta crua</p>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={maturidadeChartData} onClick={(e: any) => {
                if (e?.activeLabel) setSelectedMes(prev => prev === e.activeLabel ? null : e.activeLabel);
              }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="mes" tick={(props: any) => {
                  const { x, y, payload } = props;
                  const isActive = selectedMes === payload.value;
                  return <text x={x} y={y + 12} textAnchor="middle" fontSize={10} fill={isActive ? "#FF5722" : "hsl(var(--muted-foreground))"} fontWeight={isActive ? 700 : 400}>{payload.value}</text>;
                }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} tickFormatter={v => `${v}%`} label={{ value: "Distribuição (%)", angle: -90, position: "insideLeft", style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" }, offset: 0 }} />
                {selectedMes && <ReferenceLine x={selectedMes} stroke="#FF5722" strokeWidth={2} strokeDasharray="4 3" />}
                <RechartsTooltip content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0]?.payload;
                  return (
                    <div className="bg-white border rounded-lg p-2.5 shadow-md text-xs space-y-1">
                      <p className="font-semibold text-foreground">{label}</p>
                      {payload.filter((p: any) => p.dataKey && MATURIDADE_LABELS[p.dataKey]).map((p: any) => (
                        <div key={p.dataKey} className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5" style={{ backgroundColor: MATURIDADE_COLORS[p.dataKey] }} />
                          <span className="text-muted-foreground">{MATURIDADE_LABELS[p.dataKey]}:</span>
                          <span className="font-medium text-foreground">{typeof p.value === "number" ? `${p.value.toFixed(1)}%` : p.value}</span>
                        </div>
                      ))}
                      {d?.pctFalta > 0 && (
                        <div className="flex items-center gap-1.5 border-t border-border/30 pt-1 mt-1">
                          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: "#dc2626" }} />
                          <span className="text-muted-foreground">% Falta crua:</span>
                          <span className="font-medium text-foreground">{d.pctFalta}%</span>
                        </div>
                      )}
                    </div>
                  );
                }} />
                <Bar dataKey="1_planejado" stackId="1" radius={[0, 0, 0, 0]} name="Planejado">
                  {maturidadeChartData.map((entry, idx) => {
                    const isActive = selectedMes && selectedMes === (entry as any).mes;
                    const dimmed = selectedMes && selectedMes !== (entry as any).mes;
                    return <Cell key={idx} fill="#22c55e" fillOpacity={dimmed ? 0.25 : 0.65} stroke={isActive ? "#FF5722" : "#22c55e"} strokeOpacity={0.5} strokeWidth={isActive ? 2 : 1} strokeDasharray={isActive ? "4 3" : "none"} />;
                  })}
                </Bar>
                <Bar dataKey="2_reativo" stackId="1" radius={[4, 4, 0, 0]} name="Reativo">
                  {maturidadeChartData.map((entry, idx) => {
                    const isActive = selectedMes && selectedMes === (entry as any).mes;
                    const dimmed = selectedMes && selectedMes !== (entry as any).mes;
                    return <Cell key={idx} fill="#ef4444" fillOpacity={dimmed ? 0.25 : 0.65} stroke={isActive ? "#FF5722" : "#ef4444"} strokeOpacity={0.5} strokeWidth={isActive ? 2 : 1} strokeDasharray={isActive ? "4 3" : "none"} />;
                  })}
                </Bar>
                <Line type="monotone" dataKey="pctFalta" stroke="#dc2626" strokeWidth={1.5} strokeDasharray="6 3" dot={{ r: 3, fill: "#dc2626", stroke: "#fff", strokeWidth: 1 }} name="% Falta crua" />
                <Legend iconType="square" iconSize={10} wrapperStyle={{ fontSize: 10, paddingTop: 8 }} payload={[
                  { value: `Planejado ${maturidadeDistribuicao.planejado}%`, type: "square" as const, color: MATURIDADE_COLORS["1_planejado"] },
                  { value: `Reativo ${maturidadeDistribuicao.reativo}%`, type: "square" as const, color: MATURIDADE_COLORS["2_reativo"] },
                  { value: "% Falta crua", type: "line" as const, color: "#dc2626" },
                ]} />
              </ComposedChart>
            </ResponsiveContainer>
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

      {/* ── Convention 2: Score Detail Panel (Dialog) ── */}
      <Dialog open={scoreDetailOpen} onOpenChange={setScoreDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Decomposição do Score de Absenteísmo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-center">
              <ScoreGauge score={compositeScore} label={`${compositeScore}`} faixa={scoreLabel} color={scoreColor} />
            </div>

            <div className="space-y-3">
              {scoreBreakdownComponents.map((comp) => {
                const COMP_COLORS: Record<string, string> = { success: "#22c55e", warning: "#eab308", critical: "#ef4444" };
                const barColor = COMP_COLORS[comp.cor_semantica] || "#6b7280";
                const barWidth = Math.max(comp.contribuicao / Math.max(compositeScore, 1) * 100, 4);
                return (
                  <div key={comp.metrica} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{comp.metrica}</span>
                      <span className="text-[10px] text-muted-foreground">peso {comp.peso}%</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>{comp.valor_atual} → Nota {comp.nota}</span>
                      <span className="font-semibold">{comp.contribuicao} pts</span>
                    </div>
                    <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${barWidth}%`, backgroundColor: barColor }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground">{comp.descricao}</p>
                  </div>
                );
              })}
              <div className="border-t border-border/50 pt-3 flex items-center justify-between">
                <span className="text-xs font-semibold">Score composto</span>
                <span className="text-sm font-bold" style={{ color: scoreColor }}>
                  {compositeScore} ({scoreLabel})
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
      <ChartDataModal
        open={chartDataModal === "mapaOperacoes"}
        onClose={() => setChartDataModal(null)}
        title="Mapa de Operações — Dados"
        data={mapaOperacoesData}
        columns={[
          { key: "regional", label: "Operação" },
          { key: "headcount", label: "Headcount" },
          { key: "score", label: "Score" },
          { key: "classifLabel", label: "Classificação" },
        ]}
      />
    </div>
  );
}
